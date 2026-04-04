"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrinkEntry {
  id: number;
  drinkKey: string;
  customMl: string;
  customPct: string;
  count: string;
}

interface CalcResult {
  totalAlcoholG: number;
  bac: number; // ‰
  nihonshuEquiv: number;
  drinkStartTime: string;
  peakTime: string;
  soberTime: string;
  driveOkTime: string | null; // null if already under limit at peak
  driveOkNextDay: boolean;
  soberNextDay: boolean;
  morningBac: number; // BAC at 08:00 next day
  morningDriveWarning: boolean;
  morningAlcRemaining: boolean;
}

// ─── Drink Presets ────────────────────────────────────────────────────────────

interface DrinkPreset {
  label: string;
  ml: number;
  pct: number;
}

const DRINK_PRESETS: Record<string, DrinkPreset> = {
  beer_medium:    { label: "ビール（中瓶 500ml・5%）",      ml: 500, pct: 5 },
  beer_large:     { label: "ビール（大瓶 633ml・5%）",      ml: 633, pct: 5 },
  beer_can350:    { label: "缶ビール（350ml・5%）",         ml: 350, pct: 5 },
  beer_can500:    { label: "缶ビール（500ml・5%）",         ml: 500, pct: 5 },
  nihonshu:       { label: "日本酒（1合 180ml・15%）",      ml: 180, pct: 15 },
  shochu:         { label: "焼酎（1合 180ml・25%）",        ml: 180, pct: 25 },
  wine_glass:     { label: "ワイン（グラス 120ml・12%）",   ml: 120, pct: 12 },
  wine_bottle:    { label: "ワイン（ボトル 750ml・12%）",   ml: 750, pct: 12 },
  whisky_single:  { label: "ウイスキー（シングル 30ml・43%）", ml: 30, pct: 43 },
  whisky_double:  { label: "ウイスキー（ダブル 60ml・43%）",  ml: 60, pct: 43 },
  chuhai_350:     { label: "チューハイ（350ml・5%）",       ml: 350, pct: 5 },
  chuhai_500:     { label: "チューハイ（500ml・7%）",       ml: 500, pct: 7 },
  highball:       { label: "ハイボール（350ml・5%）",       ml: 350, pct: 5 },
  umeshu:         { label: "梅酒（90ml・13%）",             ml: 90,  pct: 13 },
  cocktail:       { label: "カクテル（120ml・8%）",         ml: 120, pct: 8 },
  custom:         { label: "カスタム（量・度数を手入力）",  ml: 0,   pct: 0 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = Math.round(totalMin % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addMinutes(hhmm: string, addMin: number): { time: string; nextDay: boolean } {
  const base = timeToMinutes(hhmm);
  const total = base + addMin;
  const nextDay = total >= 1440;
  const wrapped = total % 1440;
  return { time: minutesToHHMM(wrapped), nextDay };
}

function calcAlcoholG(ml: number, pct: number): number {
  return ml * (pct / 100) * 0.8;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calculate(
  gender: "male" | "female",
  weightKg: number,
  startTime: string,
  drinks: DrinkEntry[]
): CalcResult {
  // Step 1: Total pure alcohol
  let totalAlcoholG = 0;
  for (const d of drinks) {
    const count = parseFloat(d.count) || 1;
    if (d.drinkKey === "custom") {
      const ml = parseFloat(d.customMl) || 0;
      const pct = parseFloat(d.customPct) || 0;
      totalAlcoholG += calcAlcoholG(ml, pct) * count;
    } else {
      const preset = DRINK_PRESETS[d.drinkKey];
      if (preset) totalAlcoholG += calcAlcoholG(preset.ml, preset.pct) * count;
    }
  }

  // Step 2: Peak BAC (Widmark)
  const distributionFactor = gender === "male" ? 0.7 : 0.6;
  const bac = totalAlcoholG / (weightKg * distributionFactor); // ‰ (Widmark: g / (kg × r))

  // Step 3: Metabolism rate
  const baseRate = 0.12; // ‰/h
  const metaRate = gender === "male" ? baseRate : baseRate * 0.85;

  // Step 4: Time to sober (hours after peak, i.e. after absorption hour)
  const hoursToSober = bac / metaRate;
  const minToSober = Math.ceil(hoursToSober * 60);

  // Peak is 1h after start (absorption)
  const startMin = timeToMinutes(startTime);
  const peakMin = startMin + 60;
  const soberMin = peakMin + minToSober;

  const peak = addMinutes(startTime, 60);
  const sober = { time: minutesToHHMM(soberMin % 1440), nextDay: soberMin >= 1440 };

  // Step 5: Drive-ok time (BAC < 0.3‰)
  const DRIVE_LIMIT = 0.3; // ‰
  let driveOkTime: string | null = null;
  let driveOkNextDay = false;

  if (bac > DRIVE_LIMIT) {
    const hoursUntilDriveOk = (bac - DRIVE_LIMIT) / metaRate;
    const minUntilDriveOk = Math.ceil(hoursUntilDriveOk * 60);
    const driveOkMin = peakMin + minUntilDriveOk;
    driveOkNextDay = driveOkMin >= 1440;
    driveOkTime = minutesToHHMM(driveOkMin % 1440);
  }

  // Step 6: Morning check (08:00 = 480 min)
  // Hours elapsed from peak to 08:00 next day
  const nextMorning8Min = 480 + 1440; // 08:00 next day in absolute minutes from midnight
  const hoursFromPeakToMorning = (nextMorning8Min - peakMin) / 60;
  const morningBac = Math.max(0, bac - metaRate * hoursFromPeakToMorning);
  const morningAlcRemaining = morningBac > 0;
  const morningDriveWarning = morningBac > DRIVE_LIMIT;

  // Nihonshu equiv (22g = 1 go)
  const nihonshuEquiv = totalAlcoholG / 22;

  return {
    totalAlcoholG,
    bac,
    nihonshuEquiv,
    drinkStartTime: startTime,
    peakTime: peak.time,
    soberTime: sober.time,
    driveOkTime,
    driveOkNextDay,
    soberNextDay: sober.nextDay,
    morningBac,
    morningAlcRemaining,
    morningDriveWarning,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineBar({ result }: { result: CalcResult }) {
  const start = timeToMinutes(result.drinkStartTime);
  const peak = start + 60;
  const soberMin = peak + Math.ceil((result.bac / (result.bac > 0 ? 1 : 1)) * 60); // placeholder
  const totalSpan = Math.max(
    timeToMinutes(result.soberTime) + (result.soberNextDay ? 1440 : 0) - start,
    120
  );

  const peakPct = (60 / totalSpan) * 100;
  const driveOkPct = result.driveOkTime
    ? ((timeToMinutes(result.driveOkTime) + (result.driveOkNextDay ? 1440 : 0) - start) / totalSpan) * 100
    : 100;

  return (
    <div className="mt-4">
      <div className="relative h-8 rounded-full overflow-hidden bg-gray-100 flex">
        <div className="bg-yellow-400" style={{ width: `${Math.min(peakPct, 100)}%` }} />
        {result.driveOkTime && (
          <div className="bg-red-400" style={{ width: `${Math.min(driveOkPct - peakPct, 100 - peakPct)}%` }} />
        )}
        <div className="bg-orange-300 flex-1" />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{result.drinkStartTime} 飲酒開始</span>
        <span>{result.peakTime} ピーク</span>
        {result.driveOkTime && (
          <span>{result.driveOkTime}{result.driveOkNextDay ? " 翌日" : ""} 運転可</span>
        )}
        <span>{result.soberTime}{result.soberNextDay ? " 翌日" : ""} 完全回復</span>
      </div>
      <div className="flex gap-3 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-yellow-400" />吸収中</span>
        {result.driveOkTime && <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-400" />危険ゾーン</span>}
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-orange-300" />分解中</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

let nextId = 1;

function newDrink(): DrinkEntry {
  return { id: nextId++, drinkKey: "beer_medium", customMl: "", customPct: "", count: "1" };
}

export default function AlcoholCalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [startTime, setStartTime] = useState(getCurrentTimeHHMM);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([newDrink()]);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function addDrink() {
    if (drinks.length >= 6) return;
    setDrinks((prev) => [...prev, newDrink()]);
  }

  function removeDrink(id: number) {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
  }

  function updateDrink(id: number, field: keyof DrinkEntry, value: string) {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function handleCalculate() {
    setError("");
    const w = parseFloat(weight);
    if (!weight || isNaN(w) || w < 20 || w > 300) {
      setError("体重を正しく入力してください（20〜300kg）。");
      return;
    }
    if (!startTime) {
      setError("飲み始めた時刻を入力してください。");
      return;
    }
    if (drinks.length === 0) {
      setError("お酒を1つ以上追加してください。");
      return;
    }
    // Validate custom drinks
    for (const d of drinks) {
      if (d.drinkKey === "custom") {
        if (!d.customMl || !d.customPct || parseFloat(d.customMl) <= 0 || parseFloat(d.customPct) <= 0) {
          setError("カスタムのお酒の量と度数を入力してください。");
          return;
        }
      }
    }

    const res = calculate(gender, w, startTime, drinks);
    setResult(res);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setGender("male");
    setWeight("");
    setStartTime(getCurrentTimeHHMM());
    setDrinks([newDrink()]);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/health" className="hover:text-blue-600">健康・ウェルネス</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-800">アルコール分解時間計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">飲酒・アルコール分解時間計算機</h1>
          <p className="text-gray-600 mt-1 text-sm">
            飲んだお酒の量から血中アルコール濃度と完全分解時刻を計算。翌朝の残存確認・飲酒運転判定付き。
          </p>
          {/* Safety notice */}
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <span className="flex-shrink-0 font-bold">⚠️</span>
            <span>このツールは安全意識のための参考情報です。個人差が大きく正確な値は保証できません。<strong>少しでも飲んだら運転しないこと。</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AdUnit slot="top" className="my-2" />

        {/* Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Section 1: Basic info */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-4">基本情報</h2>
            <div className="space-y-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  性別
                  <span className="ml-1 text-xs font-normal text-gray-400 cursor-help" title="女性は同じ量でも血中アルコール濃度が高くなります">(?)</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 w-fit">
                  <button
                    onClick={() => setGender("male")}
                    className={`px-6 py-2.5 text-sm font-medium transition-colors ${gender === "male" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    男性
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`px-6 py-2.5 text-sm font-medium transition-colors border-l border-gray-200 ${gender === "female" ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    女性
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">体重</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="例: 65"
                      min="20"
                      max="300"
                      className="w-28 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-gray-600 text-sm">kg</span>
                  </div>
                </div>
                {/* Start time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">飲み始めた時刻</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Drinks */}
          <div className="border-t border-gray-100 pt-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">飲んだお酒</h2>
            <div className="space-y-3">
              {drinks.map((d, idx) => (
                <div key={d.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">お酒 {idx + 1}</span>
                    {drinks.length > 1 && (
                      <button
                        onClick={() => removeDrink(d.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        削除
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">種類</label>
                      <select
                        value={d.drinkKey}
                        onChange={(e) => updateDrink(d.id, "drinkKey", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      >
                        {Object.entries(DRINK_PRESETS).map(([key, preset]) => (
                          <option key={key} value={key}>{preset.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">杯数/本数</label>
                      <input
                        type="number"
                        value={d.count}
                        onChange={(e) => updateDrink(d.id, "count", e.target.value)}
                        min="0.5"
                        step="0.5"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  {d.drinkKey === "custom" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">量（ml）</label>
                        <input
                          type="number"
                          value={d.customMl}
                          onChange={(e) => updateDrink(d.id, "customMl", e.target.value)}
                          placeholder="例: 350"
                          min="1"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">アルコール度数（%）</label>
                        <input
                          type="number"
                          value={d.customPct}
                          onChange={(e) => updateDrink(d.id, "customPct", e.target.value)}
                          placeholder="例: 5"
                          min="0.1"
                          max="100"
                          step="0.1"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {drinks.length < 6 && (
                <button
                  onClick={addDrink}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  ＋ お酒を追加（{drinks.length}/6）
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base transition-colors"
            >
              計算する
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section id="results" className="space-y-4">
            {/* Section 1: Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">飲酒量サマリー</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 mb-1">合計純アルコール量</p>
                  <p className="text-3xl font-bold text-blue-700">{result.totalAlcoholG.toFixed(1)}<span className="text-base font-normal">g</span></p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-red-600 mb-1">推定最大血中アルコール濃度</p>
                  <p className="text-3xl font-bold text-red-700">{result.bac.toFixed(2)}<span className="text-base font-normal">‰</span></p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                日本酒換算：約 <strong>{result.nihonshuEquiv.toFixed(1)}合</strong> 分のアルコールです
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                ※厚生労働省推奨の適度な飲酒量は純アルコール約20g/日（日本酒1合相当）
              </p>
            </div>

            {/* Section 2: Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">タイムライン</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">飲み始め</p>
                    <p className="text-2xl font-mono font-bold text-gray-800">{result.drinkStartTime}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <p className="text-xs text-yellow-600">アルコール最高値</p>
                    <p className="text-2xl font-mono font-bold text-yellow-700">{result.peakTime}<span className="text-sm font-normal">頃</span></p>
                  </div>
                  <div className={`rounded-xl p-3 ${result.driveOkTime ? "bg-orange-50" : "bg-green-50"}`}>
                    <p className={`text-xs ${result.driveOkTime ? "text-orange-600" : "text-green-600"}`}>運転可能になる目安</p>
                    {result.driveOkTime ? (
                      <p className="text-2xl font-mono font-bold text-orange-700">
                        {result.driveOkTime}
                        {result.driveOkNextDay && <span className="text-sm font-normal text-orange-500"> 翌日</span>}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-green-700 mt-1">飲酒直後から基準未満</p>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-600">完全に抜ける時刻</p>
                    <p className="text-2xl font-mono font-bold text-green-700">
                      {result.soberTime}
                      {result.soberNextDay && <span className="text-sm font-normal text-green-500"> 翌日</span>}
                    </p>
                  </div>
                </div>
                <TimelineBar result={result} />
              </div>
            </div>

            {/* Section 3: Driving warning */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">飲酒運転危険度</h2>
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-2xl flex-shrink-0">🔴</span>
                <div>
                  {result.driveOkTime ? (
                    <>
                      <p className="font-bold text-red-700 text-base">
                        {result.driveOkTime}{result.driveOkNextDay ? "（翌日）" : ""}まで絶対に運転しないでください
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        日本では呼気1L中0.15mg以上のアルコールで酒気帯び運転（3年以下の懲役または50万円以下の罰金）になります。
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-red-700 text-base">
                        飲酒直後でも計算上は基準値未満ですが、絶対に運転しないでください
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        少量でもアルコールは判断力・反応速度を低下させます。飲んだら乗るな。
                      </p>
                    </>
                  )}
                  <p className="text-xs text-red-500 mt-2 font-semibold">
                    ※この計算は平均値に基づく目安です。個人差が大きく、少しでも飲んだら運転しないことが絶対的なルールです。
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Morning check */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">翌朝チェック（翌朝8:00時点）</h2>
              {result.morningAlcRemaining ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <span className="text-2xl flex-shrink-0">🟠</span>
                    <div>
                      <p className="font-semibold text-orange-700">翌朝8:00時点でもアルコールが残っている可能性があります</p>
                      <p className="text-sm text-orange-600 mt-0.5">
                        推定残存BAC: {result.morningBac.toFixed(2)}‰ — 朝の通勤・運転には注意してください
                      </p>
                    </div>
                  </div>
                  {result.morningDriveWarning && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <span className="text-2xl flex-shrink-0">🔴</span>
                      <div>
                        <p className="font-bold text-red-700">翌朝の運転も危険です！</p>
                        <p className="text-sm text-red-600 mt-0.5">
                          翌朝8:00時点でも酒気帯び運転の基準（0.3‰）を超えている計算です。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                  <span className="text-2xl flex-shrink-0">🟢</span>
                  <div>
                    <p className="font-semibold text-green-700">翌朝8:00には完全に抜けている計算です</p>
                    <p className="text-sm text-green-600 mt-0.5">ただし体調・疲労などで個人差があります。</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Health advice */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">健康アドバイス</h2>
              <ul className="space-y-3">
                {[
                  "アルコールの分解速度には大きな個人差があります。計算結果より早く回復する人も、遅い人もいます。",
                  "お酒を飲む前・飲んでいる間に水を飲むと脱水予防になります。",
                  "空腹時の飲酒はアルコールの吸収が早くなります。",
                  "少しでも飲んだら運転しない。これが鉄則です。",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <AdUnit slot="mid" className="my-2" />

        {/* SEO Section 1: Reference table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">お酒別 純アルコール量早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-2.5 px-3 text-gray-600 font-semibold">お酒の種類</th>
                  <th className="text-center py-2.5 px-3 text-gray-600 font-semibold">量</th>
                  <th className="text-center py-2.5 px-3 text-gray-600 font-semibold">度数</th>
                  <th className="text-center py-2.5 px-3 text-gray-600 font-semibold">純アルコール量</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "ビール", amount: "500ml（中瓶）", pct: "5%", g: "20g" },
                  { name: "日本酒", amount: "1合（180ml）", pct: "15%", g: "21.6g" },
                  { name: "焼酎（25度）", amount: "1合（180ml）", pct: "25%", g: "36g" },
                  { name: "ワイン", amount: "グラス1杯（120ml）", pct: "12%", g: "11.5g" },
                  { name: "ウイスキー", amount: "ダブル（60ml）", pct: "43%", g: "20.6g" },
                  { name: "チューハイ", amount: "500ml缶", pct: "7%", g: "28g" },
                ].map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-800">{row.name}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{row.amount}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{row.pct}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-red-600">{row.g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            厚生労働省の推奨する適度な飲酒量は純アルコールで1日約20g（ビール中瓶1本相当）です
          </p>
        </section>

        {/* SEO Section 2: Basics */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">アルコール分解の基礎知識</h2>
          <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">肝臓とアルコール分解</h3>
              <p>
                アルコール（エタノール）は主に肝臓で分解されます。肝臓のアルコール分解能力は体重1kgあたり約1時間に0.1g程度が平均的です（個人差あり）。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">アルコールが体に及ぼす影響</h3>
              <div className="space-y-1">
                {[
                  { bac: "0.2〜0.4‰", effect: "陽気になる・顔が赤くなる" },
                  { bac: "0.5〜1.0‰", effect: "判断力・反応速度の低下" },
                  { bac: "1.0〜2.0‰", effect: "千鳥足・言動が乱れる" },
                  { bac: "2.0〜3.0‰", effect: "泥酔状態" },
                  { bac: "3.0‰以上", effect: "意識障害・生命の危険" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 py-1 border-b border-gray-100 last:border-0">
                    <span className="font-mono text-blue-700 font-semibold w-24 flex-shrink-0">{item.bac}</span>
                    <span className="text-gray-700">{item.effect}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">飲酒運転の法律（日本）</h3>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-700">酒気帯び運転（呼気0.15mg/L以上）</p>
                  <p className="text-red-600 text-xs mt-0.5">3年以下の懲役または50万円以下の罰金</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <p className="font-semibold text-red-800">酒酔い運転（正常運転ができない状態）</p>
                  <p className="text-red-700 text-xs mt-0.5">5年以下の懲役または100万円以下の罰金</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">翌朝の「残りアルコール」に注意</h3>
              <p>
                深夜まで飲んだ後、翌朝の運転でもアルコールが残っていることがあります。特に大量飲酒後の翌朝は必ずこのツールで確認しましょう。
              </p>
            </div>
          </div>
        </section>

        {/* SEO Section 3: FAQ */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: "アルコールを早く抜く方法はありますか？",
                a: "残念ながら、アルコールの分解を早める確実な方法はありません。時間だけが解決します。水を飲むことで脱水を防ぎ、二日酔いの症状を和らげる効果はありますが、血中アルコール濃度を下げる効果はありません。コーヒー・栄養ドリンク・シャワーなども分解速度を早める効果はないとされています。",
              },
              {
                q: "体重が重い人はお酒に強いですか？",
                a: "一般的に体重が重い方が同じ量のお酒での血中アルコール濃度は低くなります。ただしアルコールへの強さ（耐性）は体重だけでなく、肝臓の分解酵素（アルコール脱水素酵素）の量にも大きく影響されます。体重が重くても酵素量が少ない人は「弱い」場合があります。",
              },
              {
                q: "女性は男性より酔いやすいのはなぜですか？",
                a: "主な理由は2つです。①女性は体内の水分量が男性より少ないため同じ体重でも血中アルコール濃度が高くなる、②女性はアルコール分解酵素（ADH）の活性が低い傾向がある、です。同じ体重・同じ飲酒量でも女性の方が血中アルコール濃度が高くなります。",
              },
              {
                q: "「ちゃんぽん（いろいろなお酒を混ぜる）」は酔いやすいですか？",
                a: "科学的には、同じ量の純アルコールであれば酔い方は変わりません。ただし、いろいろなお酒を飲むと自分がどれだけ飲んだか把握しにくくなること、炭酸入りのお酒は吸収が早いことなどから、結果的に飲みすぎてしまうことが多いです。",
              },
              {
                q: "二日酔いを防ぐ方法はありますか？",
                a: "効果的な方法は①飲む前に食事をする（空腹での飲酒を避ける）②水・お茶を一緒に飲む（アルコールと同量以上）③飲酒量を守る（純アルコール20g以下/日）④週に2日は休肝日を作る、などです。二日酔いは肝臓がアルコール処理で疲弊しているサインです。",
              },
            ].map((item, i) => (
              <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-4 py-3.5 font-semibold text-gray-800 text-sm hover:bg-gray-50 list-none flex justify-between items-center">
                  <span>Q. {item.q}</span>
                  <span className="text-gray-400 ml-2 flex-shrink-0">▾</span>
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* SEO Section 4: Related tools */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機", desc: "身長・体重からBMIと肥満度を判定" },
              { href: "/health/calorie-calculator", label: "基礎代謝・カロリー計算機", desc: "TDEE・目標カロリー・PFC比率を自動計算" },
              { href: "/health/sleep-calculator", label: "睡眠時間 最適化ツール", desc: "90分サイクルで最適な就寝・起床時刻を計算" },
              { href: "/health/ideal-weight-calculator", label: "標準体重・肥満度 判定ツール", desc: "年齢・性別別の標準体重を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors group"
              >
                <span className="text-blue-500 mt-0.5 flex-shrink-0 group-hover:text-blue-600">→</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700">{tool.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit slot="bottom" className="my-2" />
      </div>
    </main>
  );
}
