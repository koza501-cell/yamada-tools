"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ---- Types ----
interface MovingInputs {
  fromPref: string;
  toPref: string;
  season: string;
  weekday: string;
  timeSlot: string;
  household: string;
  madori: string;
  volume: string;
  bigItems: string;
  elevatorFrom: string;
  elevatorTo: string;
  floorFrom: string;
  floorTo: string;
  aircon: string;
  junk: string;
  packing: string;
  piano: string;
  furnitureAssembly: string;
  houseCleaning: string;
}

interface MovingResult {
  distanceLabel: string;
  basePrice: number;
  seasonAdj: number;
  weekdayAdj: number;
  timeAdj: number;
  volumeAdj: number;
  bigItemsAdj: number;
  stairsAdj: number;
  subtotalBeforeOptions: number;
  airconCost: number;
  junkCost: number;
  packingCost: number;
  pianoCost: number;
  furnitureCost: number;
  cleaningCost: number;
  optionsTotal: number;
  total: number;
  minTotal: number;
  maxTotal: number;
}

// ---- Constants ----
const PREFS = [
  "北海道","青森","岩手","宮城","秋田","山形","福島",
  "茨城","栃木","群馬","埼玉","千葉","東京","神奈川",
  "新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知",
  "三重","滋賀","京都","大阪","兵庫","奈良","和歌山",
  "鳥取","島根","岡山","広島","山口",
  "徳島","香川","愛媛","高知",
  "福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄",
];

const REGIONS: Record<string, string> = {
  北海道: "hokkaido",
  青森: "tohoku", 岩手: "tohoku", 宮城: "tohoku", 秋田: "tohoku", 山形: "tohoku", 福島: "tohoku",
  茨城: "kanto", 栃木: "kanto", 群馬: "kanto", 埼玉: "kanto", 千葉: "kanto", 東京: "kanto", 神奈川: "kanto",
  新潟: "chubu", 富山: "chubu", 石川: "chubu", 福井: "chubu", 山梨: "chubu", 長野: "chubu", 岐阜: "chubu", 静岡: "chubu", 愛知: "chubu",
  三重: "kinki", 滋賀: "kinki", 京都: "kinki", 大阪: "kinki", 兵庫: "kinki", 奈良: "kinki", 和歌山: "kinki",
  鳥取: "chugoku", 島根: "chugoku", 岡山: "chugoku", 広島: "chugoku", 山口: "chugoku",
  徳島: "shikoku", 香川: "shikoku", 愛媛: "shikoku", 高知: "shikoku",
  福岡: "kyushu", 佐賀: "kyushu", 長崎: "kyushu", 熊本: "kyushu", 大分: "kyushu", 宮崎: "kyushu", 鹿児島: "kyushu",
  沖縄: "okinawa",
};

const ADJACENT: [string, string][] = [
  ["hokkaido", "tohoku"],
  ["tohoku", "kanto"],
  ["kanto", "chubu"],
  ["chubu", "kinki"],
  ["chubu", "tohoku"],
  ["kinki", "chugoku"],
  ["kinki", "shikoku"],
  ["chugoku", "shikoku"],
  ["chugoku", "kyushu"],
  ["shikoku", "kyushu"],
];

const VERY_FAR_PAIRS: [string, string][] = [
  ["hokkaido", "chubu"],
  ["hokkaido", "kinki"],
  ["hokkaido", "chugoku"],
  ["hokkaido", "shikoku"],
  ["hokkaido", "kyushu"],
  ["hokkaido", "okinawa"],
  ["okinawa", "tohoku"],
  ["okinawa", "kanto"],
  ["okinawa", "chubu"],
  ["okinawa", "kinki"],
  ["okinawa", "chugoku"],
  ["okinawa", "shikoku"],
];

function getDistance(from: string, to: string): "near" | "mid" | "far" | "veryFar" {
  if (from === to) return "near";
  const rFrom = REGIONS[from] ?? "";
  const rTo = REGIONS[to] ?? "";
  if (rFrom === rTo) return "near";
  if (
    VERY_FAR_PAIRS.some(
      ([a, b]) => (rFrom === a && rTo === b) || (rFrom === b && rTo === a)
    )
  ) {
    return "veryFar";
  }
  if (
    ADJACENT.some(
      ([a, b]) => (rFrom === a && rTo === b) || (rFrom === b && rTo === a)
    )
  ) {
    return "mid";
  }
  return "far";
}

const DISTANCE_LABELS: Record<string, string> = {
  near: "近距離（〜50km）",
  mid: "中距離（50〜200km）",
  far: "遠距離（200〜500km）",
  veryFar: "超遠距離（500km+）",
};

const BASE_PRICES: Record<string, Record<string, number>> = {
  single: { near: 35000, mid: 55000, far: 80000, veryFar: 120000 },
  two:    { near: 60000, mid: 90000, far: 130000, veryFar: 200000 },
  three:  { near: 90000, mid: 130000, far: 190000, veryFar: 280000 },
  four:   { near: 130000, mid: 180000, far: 260000, veryFar: 380000 },
  five:   { near: 170000, mid: 240000, far: 340000, veryFar: 500000 },
};

const CLEANING_BY_MADORI: Record<string, number> = {
  "1K": 30000,
  "1DK_1LDK": 40000,
  "2DK_2LDK": 50000,
  "3DK_3LDK": 55000,
  "4LDK+": 60000,
};

const PACKING_BY_HOUSEHOLD: Record<string, number> = {
  single: 5000,
  two: 8000,
  three: 10000,
  four: 12000,
  five: 15000,
};

// ---- Helpers ----
function fmtYen(n: number): string {
  return Math.round(n).toLocaleString() + "円";
}

function fmtMan(n: number): string {
  const man = n / 10000;
  if (man >= 100) return Math.round(man).toLocaleString() + "万円";
  if (man >= 1) return man.toFixed(1).replace(/\.0$/, "") + "万円";
  return Math.round(n).toLocaleString() + "円";
}

function getStairsMultiplier(
  elevatorFrom: string,
  elevatorTo: string,
  floorFrom: string,
  floorTo: string
): number {
  const highFloor = (f: string) => f === "4-6" || f === "7+";
  const sevenPlus = (f: string) => f === "7+";
  const noElevFrom = elevatorFrom === "no" && highFloor(floorFrom);
  const noElevTo = elevatorTo === "no" && highFloor(floorTo);
  const sevenFrom = elevatorFrom === "no" && sevenPlus(floorFrom);
  const sevenTo = elevatorTo === "no" && sevenPlus(floorTo);
  if (sevenFrom || sevenTo) return 1.3;
  if (noElevFrom && noElevTo) return 1.2;
  if (noElevFrom || noElevTo) return 1.1;
  return 1.0;
}

function calcMoving(inp: MovingInputs): MovingResult {
  const dist = getDistance(inp.fromPref, inp.toPref);
  const basePrice = BASE_PRICES[inp.household]?.[dist] ?? 35000;

  const seasonMult =
    inp.season === "peak" ? 1.5 : inp.season === "off" ? 0.8 : 1.0;
  const weekdayMult = inp.weekday === "weekend" ? 1.2 : 1.0;
  const timeMult =
    inp.timeSlot === "morning" ? 1.1 : inp.timeSlot === "flexible" ? 0.9 : 1.0;
  const volumeMult =
    inp.volume === "light" ? 0.85 : inp.volume === "heavy" ? 1.2 : 1.0;
  const bigMult =
    inp.bigItems === "1-3" ? 1.1 :
    inp.bigItems === "4-6" ? 1.2 :
    inp.bigItems === "7+" ? 1.4 : 1.0;
  const stairsMult = getStairsMultiplier(
    inp.elevatorFrom, inp.elevatorTo, inp.floorFrom, inp.floorTo
  );

  // Step-by-step for breakdown display
  const afterSeason   = Math.round(basePrice * seasonMult);
  const afterWeekday  = Math.round(afterSeason * weekdayMult);
  const afterTime     = Math.round(afterWeekday * timeMult);
  const afterVolume   = Math.round(afterTime * volumeMult);
  const afterBig      = Math.round(afterVolume * bigMult);
  const afterStairs   = Math.round(afterBig * stairsMult);

  const seasonAdj    = afterSeason - basePrice;
  const weekdayAdj   = afterWeekday - afterSeason;
  const timeAdj      = afterTime - afterWeekday;
  const volumeAdj    = afterVolume - afterTime;
  const bigItemsAdj  = afterBig - afterVolume;
  const stairsAdj    = afterStairs - afterBig;

  const subtotalBeforeOptions = afterStairs;

  const airconCount =
    inp.aircon === "1" ? 1 : inp.aircon === "2" ? 2 : inp.aircon === "3+" ? 3 : 0;
  const airconCost = airconCount * 15000;
  const junkCost =
    inp.junk === "small" ? 20000 : inp.junk === "mid" ? 40000 : inp.junk === "large" ? 80000 : 0;
  const packingCost  = inp.packing === "yes" ? (PACKING_BY_HOUSEHOLD[inp.household] ?? 5000) : 0;
  const pianoCost    = inp.piano === "yes" ? 30000 : 0;
  const furnitureCost = inp.furnitureAssembly === "yes" ? 10000 : 0;
  const cleaningCost = inp.houseCleaning === "yes" ? (CLEANING_BY_MADORI[inp.madori] ?? 30000) : 0;

  const optionsTotal = airconCost + junkCost + packingCost + pianoCost + furnitureCost + cleaningCost;
  const total    = subtotalBeforeOptions + optionsTotal;
  const minTotal = Math.round(total * 0.7);
  const maxTotal = Math.round(total * 1.3);

  return {
    distanceLabel: DISTANCE_LABELS[dist],
    basePrice, seasonAdj, weekdayAdj, timeAdj, volumeAdj, bigItemsAdj, stairsAdj,
    subtotalBeforeOptions,
    airconCost, junkCost, packingCost, pianoCost, furnitureCost, cleaningCost,
    optionsTotal, total, minTotal, maxTotal,
  };
}

// ---- Defaults ----
const defaultInputs: MovingInputs = {
  fromPref: "東京", toPref: "神奈川",
  season: "normal", weekday: "weekday", timeSlot: "flexible",
  household: "single", madori: "1K", volume: "normal", bigItems: "none",
  elevatorFrom: "yes", elevatorTo: "yes", floorFrom: "1", floorTo: "1",
  aircon: "none", junk: "none", packing: "no", piano: "no",
  furnitureAssembly: "no", houseCleaning: "no",
};

// ---- Main Page ----
export default function MovingCostCalculatorPage() {
  const [inputs, setInputs] = useState<MovingInputs>({ ...defaultInputs });
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<MovingResult | null>(null);
  const [error, setError] = useState("");

  function update(key: keyof MovingInputs, val: string) {
    setInputs((prev) => ({ ...prev, [key]: val }));
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    if (!inputs.fromPref || !inputs.toPref) {
      setError("引越し元と引越し先の都道府県を選択してください。");
    setMascotState("error");
      return;
    }
    setError("");
    setResult(calcMoving(inputs));
  }

  function handleReset() {
    setInputs({ ...defaultInputs });
    setResult(null);
    setError("");
  }

  const selectCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-ai">ホーム</Link>{" "}
            &gt;{" "}
            <Link href="/realestate" className="hover:text-ai">不動産・住まい</Link>{" "}
            &gt; <span>引越し費用 見積もり計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            引越し費用 見積もり計算機
          </h1>
          <p className="text-gray-600 text-sm">
            距離・荷物量・時期・オプションから<strong>引越し費用を自動見積もり</strong>。
            繁忙期・閑散期の料金差や節約アドバイスも表示。
          </p>
        </div>

        {/* Calculator card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

          {/* Section 1: 基本情報 */}
          <h2 className="text-base font-semibold text-gray-800 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelCls}>引越し元の都道府県 <span className="text-danger">*</span></label>
              <select className={selectCls} value={inputs.fromPref} onChange={(e) => update("fromPref", e.target.value)}>
                {PREFS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>引越し先の都道府県 <span className="text-danger">*</span></label>
              <select className={selectCls} value={inputs.toPref} onChange={(e) => update("toPref", e.target.value)}>
                {PREFS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>引越し予定時期</label>
              <select className={selectCls} value={inputs.season} onChange={(e) => update("season", e.target.value)}>
                <option value="peak">繁忙期（2月・3月・4月）×1.5倍</option>
                <option value="normal">通常期（5〜1月）</option>
                <option value="off">閑散期（6〜8月）×0.8倍</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>引越し希望日</label>
              <select className={selectCls} value={inputs.weekday} onChange={(e) => update("weekday", e.target.value)}>
                <option value="weekday">平日</option>
                <option value="weekend">土日祝（+20%）</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>時間帯</label>
              <select className={selectCls} value={inputs.timeSlot} onChange={(e) => update("timeSlot", e.target.value)}>
                <option value="morning">午前指定（+10%）</option>
                <option value="afternoon">午後指定</option>
                <option value="flexible">時間おまかせ（−10%）</option>
              </select>
            </div>
          </div>

          {/* Section 2: 荷物・家族情報 */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">荷物・家族情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>世帯人数</label>
                <select className={selectCls} value={inputs.household} onChange={(e) => update("household", e.target.value)}>
                  <option value="single">単身</option>
                  <option value="two">2人</option>
                  <option value="three">3人</option>
                  <option value="four">4人</option>
                  <option value="five">5人以上</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>間取り（現住居）</label>
                <select className={selectCls} value={inputs.madori} onChange={(e) => update("madori", e.target.value)}>
                  <option value="1K">ワンルーム/1K</option>
                  <option value="1DK_1LDK">1DK/1LDK</option>
                  <option value="2DK_2LDK">2DK/2LDK</option>
                  <option value="3DK_3LDK">3DK/3LDK</option>
                  <option value="4LDK+">4LDK以上</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>荷物の量</label>
                <select className={selectCls} value={inputs.volume} onChange={(e) => update("volume", e.target.value)}>
                  <option value="light">少なめ（−15%）</option>
                  <option value="normal">普通</option>
                  <option value="heavy">多め（+20%）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>大型家具・家電の数</label>
                <select className={selectCls} value={inputs.bigItems} onChange={(e) => update("bigItems", e.target.value)}>
                  <option value="none">なし</option>
                  <option value="1-3">1〜3点（+10%）</option>
                  <option value="4-6">4〜6点（+20%）</option>
                  <option value="7+">7点以上（+40%）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>エレベーター（現住居）</label>
                <select className={selectCls} value={inputs.elevatorFrom} onChange={(e) => update("elevatorFrom", e.target.value)}>
                  <option value="yes">あり</option>
                  <option value="no">なし</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>エレベーター（新住居）</label>
                <select className={selectCls} value={inputs.elevatorTo} onChange={(e) => update("elevatorTo", e.target.value)}>
                  <option value="yes">あり</option>
                  <option value="no">なし</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>階数（現住居）</label>
                <select className={selectCls} value={inputs.floorFrom} onChange={(e) => update("floorFrom", e.target.value)}>
                  <option value="1">1階</option>
                  <option value="2-3">2〜3階</option>
                  <option value="4-6">4〜6階</option>
                  <option value="7+">7階以上</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>階数（新住居）</label>
                <select className={selectCls} value={inputs.floorTo} onChange={(e) => update("floorTo", e.target.value)}>
                  <option value="1">1階</option>
                  <option value="2-3">2〜3階</option>
                  <option value="4-6">4〜6階</option>
                  <option value="7+">7階以上</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: オプション */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">オプション・追加費用</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>エアコン取り外し・取り付け</label>
                <select className={selectCls} value={inputs.aircon} onChange={(e) => update("aircon", e.target.value)}>
                  <option value="none">なし</option>
                  <option value="1">1台（+1.5万円）</option>
                  <option value="2">2台（+3万円）</option>
                  <option value="3+">3台以上（+4.5万円）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>不用品処分</label>
                <select className={selectCls} value={inputs.junk} onChange={(e) => update("junk", e.target.value)}>
                  <option value="none">なし</option>
                  <option value="small">少量（〜軽トラ1台・+2万円）</option>
                  <option value="mid">中量（+4万円）</option>
                  <option value="large">大量（+8万円）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>梱包資材（業者依頼）</label>
                <select className={selectCls} value={inputs.packing} onChange={(e) => update("packing", e.target.value)}>
                  <option value="no">自分で用意する（0円）</option>
                  <option value="yes">業者に依頼する</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>ピアノ・金庫等の特殊品</label>
                <select className={selectCls} value={inputs.piano} onChange={(e) => update("piano", e.target.value)}>
                  <option value="no">なし</option>
                  <option value="yes">あり（+3万円）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>新居での家具組み立て</label>
                <select className={selectCls} value={inputs.furnitureAssembly} onChange={(e) => update("furnitureAssembly", e.target.value)}>
                  <option value="no">なし</option>
                  <option value="yes">あり（+1万円）</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>ハウスクリーニング（旧居）</label>
                <select className={selectCls} value={inputs.houseCleaning} onChange={(e) => update("houseCleaning", e.target.value)}>
                  <option value="no">なし</option>
                  <option value="yes">あり（間取りに応じた相場）</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button type="button"
              onClick={handleCalculate}
              className="flex-1 py-3 px-6 rounded-lg bg-kon text-white font-semibold text-sm hover:bg-ai transition-colors shadow-sm"
            >
              計算する
            </button>
            <button type="button"
              onClick={handleReset}
              className="py-3 px-6 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">引越し費用の概算</h2>
              <p className="text-xs text-gray-500 mb-4">
                {inputs.fromPref} → {inputs.toPref}（{result.distanceLabel}）
              </p>
              <div className="text-center bg-gray-50 rounded-xl p-6 mb-4">
                <p className="text-sm text-kon mb-2">引越し業者費用の目安</p>
                <p className="text-4xl font-bold text-kon">
                  {fmtMan(result.minTotal)}〜{fmtMan(result.maxTotal)}
                </p>
                <p className="text-sm text-kon mt-2">
                  中央値: 約{fmtMan(result.total)}
                </p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                ※ 複数社の一括見積もりで最安{fmtMan(result.minTotal)}台の可能性があります
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">費用内訳</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-kon text-white">
                      <th className="px-4 py-2 text-left font-semibold">項目</th>
                      <th className="px-4 py-2 text-right font-semibold">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">基本引越し料金</td>
                      <td className="px-4 py-2 text-right">{fmtYen(result.basePrice)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">
                        季節調整
                        {inputs.season === "peak" && (
                          <span className="ml-1 text-xs text-danger">（繁忙期×1.5）</span>
                        )}
                        {inputs.season === "off" && (
                          <span className="ml-1 text-xs text-green-600">（閑散期×0.8）</span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-2 text-right ${
                          result.seasonAdj > 0
                            ? "text-danger"
                            : result.seasonAdj < 0
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {result.seasonAdj >= 0 ? "+" : ""}
                        {fmtYen(result.seasonAdj)}
                      </td>
                    </tr>
                    {result.weekdayAdj !== 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">曜日割増（土日祝）</td>
                        <td className="px-4 py-2 text-right text-danger">
                          +{fmtYen(result.weekdayAdj)}
                        </td>
                      </tr>
                    )}
                    {result.timeAdj !== 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">
                          時間帯
                          {result.timeAdj > 0 ? "割増（午前指定）" : "割引（時間おまかせ）"}
                        </td>
                        <td
                          className={`px-4 py-2 text-right ${
                            result.timeAdj > 0 ? "text-danger" : "text-green-600"
                          }`}
                        >
                          {result.timeAdj >= 0 ? "+" : ""}
                          {fmtYen(result.timeAdj)}
                        </td>
                      </tr>
                    )}
                    {result.volumeAdj !== 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">
                          荷物量{result.volumeAdj > 0 ? "割増（多め）" : "割引（少なめ）"}
                        </td>
                        <td
                          className={`px-4 py-2 text-right ${
                            result.volumeAdj > 0 ? "text-danger" : "text-green-600"
                          }`}
                        >
                          {result.volumeAdj >= 0 ? "+" : ""}
                          {fmtYen(result.volumeAdj)}
                        </td>
                      </tr>
                    )}
                    {result.bigItemsAdj !== 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">大型家具・家電割増</td>
                        <td className="px-4 py-2 text-right text-danger">
                          +{fmtYen(result.bigItemsAdj)}
                        </td>
                      </tr>
                    )}
                    {result.stairsAdj !== 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">階段・高層階割増</td>
                        <td className="px-4 py-2 text-right text-danger">
                          +{fmtYen(result.stairsAdj)}
                        </td>
                      </tr>
                    )}
                    {result.airconCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">エアコン取り外し・取り付け</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.airconCost)}</td>
                      </tr>
                    )}
                    {result.junkCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">不用品処分</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.junkCost)}</td>
                      </tr>
                    )}
                    {result.packingCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">梱包資材（業者依頼）</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.packingCost)}</td>
                      </tr>
                    )}
                    {result.pianoCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">ピアノ・金庫等（特殊品）</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.pianoCost)}</td>
                      </tr>
                    )}
                    {result.furnitureCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">家具組み立て</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.furnitureCost)}</td>
                      </tr>
                    )}
                    {result.cleaningCost > 0 && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">ハウスクリーニング（旧居）</td>
                        <td className="px-4 py-2 text-right">+{fmtYen(result.cleaningCost)}</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-4 py-2 text-kon">合計（中央値）</td>
                      <td className="px-4 py-2 text-right text-kon text-lg">
                        {fmtMan(result.total)}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-4 py-2 text-green-700 text-xs">
                        最安値目安（複数社見積もり）
                      </td>
                      <td className="px-4 py-2 text-right text-green-700 text-xs">
                        {fmtMan(result.minTotal)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-kon text-xs">最高値目安</td>
                      <td className="px-4 py-2 text-right text-kon text-xs">
                        {fmtMan(result.maxTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Savings advice */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">節約アドバイス</h2>
              <div className="space-y-3">
                {inputs.season === "peak" && (
                  <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="text-danger text-lg shrink-0">⚠️</span>
                    <p className="text-sm text-danger">
                      <strong>繁忙期のため料金が1.5倍になっています。</strong>
                      5〜8月への変更で最大
                      {fmtMan(Math.round(result.total * 0.33))}節約できます。
                    </p>
                  </div>
                )}
                {inputs.weekday === "weekend" && (
                  <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <span className="text-yellow-500 text-lg shrink-0">💡</span>
                    <p className="text-sm text-yellow-800">
                      <strong>平日引越しに変更すると約20%節約できます。</strong>
                      約{fmtMan(Math.round(result.total * 0.167))}の節約が見込めます。
                    </p>
                  </div>
                )}
                {inputs.timeSlot === "morning" && (
                  <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <span className="text-yellow-500 text-lg shrink-0">💡</span>
                    <p className="text-sm text-yellow-800">
                      <strong>時間おまかせに変更すると約10%節約できます。</strong>
                      約{fmtMan(Math.round(result.total * 0.091))}の節約が見込めます。
                    </p>
                  </div>
                )}
                <div className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-green-500 text-lg shrink-0">✅</span>
                  <p className="text-sm text-green-800">
                    <strong>複数社の見積もり取得で20〜30%の節約が期待できます。</strong>
                    引越し一括見積もりサービスの利用をお勧めします
                    （最大{fmtMan(Math.round(result.total * 0.3))}節約の可能性）。
                  </p>
                </div>
              </div>
            </div>

            {/* Savings ranking */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                節約ポイント ランキング
              </h2>
              <div className="space-y-3">
                {[
                  {
                    medal: "🥇",
                    label: "複数社一括見積もりを取る",
                    pct: "最大−30%",
                    saving: Math.round(result.total * 0.3),
                  },
                  {
                    medal: "🥈",
                    label: "繁忙期を避けて閑散期に引越す",
                    pct: "最大−20%",
                    saving: Math.round(result.total * 0.2),
                  },
                  {
                    medal: "🥉",
                    label: "土日祝→平日に変更する",
                    pct: "−20%",
                    saving: Math.round(result.total * 0.167),
                  },
                  {
                    medal: "4️⃣",
                    label: "午前指定→時間おまかせに変更する",
                    pct: "−10%",
                    saving: Math.round(result.total * 0.091),
                  },
                  {
                    medal: "5️⃣",
                    label: "荷物を減らして不用品を事前処分",
                    pct: "−15%〜",
                    saving: Math.round(result.total * 0.15),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-xl shrink-0">{item.medal}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.pct}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-green-700">
                        {fmtMan(item.saving)}節約
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden costs reference */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                引越しに関連するその他の費用（参考・合計に含まず）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <p>• 駐車場代（旧居・新居）: 各1〜3万円</p>
                <p>• 転居郵便物転送サービス: 無料</p>
                <p>• 各種住所変更手続き: 無料（時間のみ）</p>
                <p>
                  • 新居での備品購入目安:{" "}
                  {inputs.household === "single" ? "約5万円" : "約10〜20万円"}
                </p>
              </div>
            </div>

            <AdUnit slot="6291847305" format="horizontal" className="mb-6" />
          </>
        )}

        {/* SEO: 早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            引越し費用の目安早見表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    世帯人数
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">
                    近距離
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">
                    中距離
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">
                    遠距離
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">
                    繁忙期割増
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "単身", near: "3〜6万円", mid: "5〜9万円", far: "8〜15万円" },
                  { label: "2人", near: "6〜10万円", mid: "9〜15万円", far: "13〜22万円" },
                  { label: "3〜4人", near: "9〜18万円", mid: "13〜27万円", far: "19〜38万円" },
                  { label: "5人以上", near: "12〜25万円", mid: "17〜35万円", far: "25〜50万円" },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{row.label}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.near}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.mid}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.far}</td>
                    <td className="px-3 py-2 text-center text-danger font-medium">×1.5倍</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            引越し費用の基礎知識
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              引越し費用は「距離」「荷物量」「時期」の3つで大きく変わります。
            </p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">繁忙期と閑散期の差</h3>
              <p>
                3月〜4月は引越しの繁忙期で、料金は通常の1.5〜2倍になることがあります。
                逆に6〜8月は閑散期で、通常の70〜80%の費用で引越しできる場合があります。
                スケジュールに柔軟性がある場合は、5月以降への引越しで大幅節約が可能です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">複数社見積もりの重要性</h3>
              <p>
                引越し費用は業者によって大きく異なります（同条件で2〜3倍の差が出ることも）。
                一括見積もりサービスを利用して最低3社から見積もりを取ることを強くお勧めします。
                見積もり自体は無料で、断っても問題ありません。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">単身パックとは</h3>
              <p>
                荷物が少ない単身者向けの格安プランです。
                専用コンテナ（ボックス）に荷物を積むため、通常便より30〜50%安くなります。
                荷物がボックス1〜2個に収まる場合は単身パックが最もお得です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">引越し費用に含まれないもの</h3>
              <p>
                引越し業者の見積もりには、エアコンの取り外し・取り付け（別途工事業者）、
                不用品の処分費用、梱包資材（自分で用意する場合）などが含まれないことがあります。
                見積もり時に何が含まれるか必ず確認しましょう。
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: "引越し費用の相場はいくらですか？",
                a: "単身・近距離（同一市内）の場合は3〜6万円、ファミリー（3〜4人）・中距離の場合は15〜25万円が一般的な相場です。ただし時期・業者・荷物量によって大きく変わります。3月の繁忙期は通常の1.5〜2倍になることがあるため、時期の選択が最も重要です。",
              },
              {
                q: "引越し費用を最も安くするにはどうすればいいですか？",
                a: "最も効果的な方法は①複数社から一括見積もりを取る②繁忙期（2〜4月）を避ける③平日・午後・時間おまかせを選ぶ④不用品を事前に処分して荷物量を減らす⑤自分で梱包する、の5つです。これらを組み合わせると通常の半額以下になることもあります。",
              },
              {
                q: "引越し業者の見積もりはいつ頃取ればいいですか？",
                a: "引越し希望日の1〜2ヶ月前が理想的です。繁忙期（2〜4月）は早めに予約しないと希望日に業者を確保できない場合があります。逆に閑散期は直前でも予約できることが多く、「当日割引」を交渉できる場合もあります。",
              },
              {
                q: "単身パックとはどんなサービスですか？",
                a: "荷物が少ない単身者向けの格安引越しプランです。専用のボックス（コンテナ）に荷物を積んで運ぶため、通常の引越しより30〜50%安くなります。荷物がボックス1〜2個（ダンボール10〜20箱程度）に収まる場合に最適です。",
              },
              {
                q: "引越し費用は会社から補助が出ますか？",
                a: "転勤による引越しの場合、多くの企業で引越し費用の全額または一部を会社が負担します。就活・転職での引越しの場合は企業によって対応が異なります。確認できていない場合は人事部門に問い合わせてみましょう。自己都合の引越しでも、確定申告で引越し費用の一部が控除になる場合があります（転居を伴う転勤等）。",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 text-sm list-none flex items-start gap-2">
                  <span className="text-kon font-bold shrink-0">Q{i + 1}.</span>
                  {item.q}
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/realestate/rental-cost-calculator",
                label: "賃貸 敷金礼金 トータルコスト計算機",
                desc: "敷金・礼金から退去費用まで賃貸の全コストを計算",
              },
              {
                href: "/realestate/rent-vs-buy",
                label: "家賃 vs 購入 比較計算機",
                desc: "賃貸と購入、どちらがお得かシミュレーション",
              },
              {
                href: "/realestate/acquisition-tax",
                label: "不動産取得税 計算機",
                desc: "軽減措置を自動適用して税額を計算",
              },
              {
                href: "/realestate/property-tax-calculator",
                label: "固定資産税 計算機",
                desc: "固定資産税・都市計画税の年間額を試算",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-ai transition-all group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-ai text-sm mb-1">
                  {tool.label}
                </p>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
