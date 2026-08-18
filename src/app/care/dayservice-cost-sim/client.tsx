"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import { TSUSHO_UNITS } from "@/data/kaigo-units";
import { calcTanka } from "@/data/kaigo-tanka";
import type { Kyuchi } from "@/data/kaigo-tanka";
import chiikiData from "@/data/kaigo-chiiki.json";

const Icons = {
  Calc: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect width="12" height="8" x="6" y="14"/>
    </svg>
  ),
  Warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
};

const TIME_OPTIONS = [
  { key: "3-4h", label: "3〜4時間" },
  { key: "5-6h", label: "5〜6時間" },
  { key: "7-8h", label: "7〜8時間" },
  { key: "8-9h", label: "8〜9時間" },
] as const;

type TimeKey = "3-4h" | "5-6h" | "7-8h" | "8-9h";

const KAIGO_LEVELS = [
  { label: "要介護1", idx: 0 },
  { label: "要介護2", idx: 1 },
  { label: "要介護3", idx: 2 },
  { label: "要介護4", idx: 3 },
  { label: "要介護5", idx: 4 },
];

const LIMIT_UNITS = [16765, 19705, 27048, 30938, 36217];

type ChiikiEntry = { city: string; kyuchi: string };
const chiikList = chiikiData as ChiikiEntry[];
const CITY_LIST = chiikList.map(d => d.city);

function getCityKyuchi(city: string): Kyuchi {
  const entry = chiikList.find(d => d.city === city);
  return ((entry?.kyuchi) ?? "other") as Kyuchi;
}

interface CalcResult {
  monthlyVisits: number;
  perVisitYen: number;
  perVisitUser: number;
  monthlyInsuranceUser: number;
  monthlyFood: number;
  monthlyTotal: number;
  totalInsuranceYen: number;
  limitYen: number;
  isOverLimit: boolean;
  overflowYen: number;
}


const FAQ = [
  {
    question: "デイサービスの料金はどう決まるの?",
    answer: "介護保険の単位数 × お住まいの地域単価 × 自己負担割合(1〜3割)で計算されます。これに食費(1回あたり500〜800円が目安)などの実費が加わります。平均的な加算と食費を含めた月額目安がわかります。",
  },
  {
    question: "計算結果は正確?",
    answer: "一般的な加算込みの概算です。実際の費用は施設の加算内容や食費設定により上下します。正確な見積もりは契約予定のデイサービス事業所にご確認ください。",
  },
  {
    question: "限度額を超えるとどうなる?",
    answer: "月額の支給限度額(要介護度ごとに決まっています)を超えると、超過分は全額自己負担になります。限度額を超えると警告でお知らせします。ケアマネジャーと相談して回数を調整するのが一般的です。",
  },
  {
    question: "1割負担、2割負担、3割負担はどう決まる?",
    answer: "本人の合計所得金額と年金収入で決まります。多くの方は1割負担です。年金収入のみで年280万円以上(単身)の場合は2割、340万円以上の場合は3割になります。市区町村から「介護保険負担割合証」が交付されます。",
  },
  {
    question: "要支援1・2の場合は使えない?",
    answer: "要支援の方は「介護予防通所サービス」を利用します。当ツールは要介護1〜5の方向けです。要支援の方は「要介護度 早見表」で限度額を確認してください。",
  },
];

const SEO_TABLE = [
  { level: "要介護1", w3: "約 ¥10,400", w5: "約 ¥17,300" },
  { level: "要介護2", w3: "約 ¥12,000", w5: "約 ¥20,000" },
  { level: "要介護3", w3: "約 ¥13,700", w5: "約 ¥22,800" },
  { level: "要介護4", w3: "約 ¥15,400", w5: "約 ¥25,600" },
  { level: "要介護5", w3: "約 ¥17,000", w5: "約 ¥28,300" },
];

export default function DayserviceCostSimClient() {
  const [mounted, setMounted]   = useState(false);
  const [kaigoIdx, setKaigoIdx] = useState(1);
  const [timeKey, setTimeKey]   = useState<TimeKey>("7-8h");
  const [weekly, setWeekly]     = useState(3);
  const [city, setCity]         = useState("");
  const [waribai, setWaribai]   = useState(1);
  const [result, setResult]     = useState<CalcResult | null>(null);
  const [copied, setCopied]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleCalculate() {
    const kyuchi = city ? getCityKyuchi(city) : "other";
    const base = TSUSHO_UNITS[timeKey]?.[kaigoIdx] ?? 0;
    const flatUnits = base + 40 + 56;
    const unitsWithShogyu = Math.floor(flatUnits * 1.092);
    const tanka = calcTanka(kyuchi, 45);
    const perVisitYen = Math.floor(unitsWithShogyu * tanka);
    const perVisitUser = Math.floor(perVisitYen * waribai / 10);
    const monthlyVisits = Math.round(weekly * 4.3);
    const monthlyInsuranceUser = perVisitUser * monthlyVisits;
    const monthlyFood = monthlyVisits * 700;
    const monthlyTotal = monthlyInsuranceUser + monthlyFood;
    const totalInsuranceYen = perVisitYen * monthlyVisits;
    const limitYen = Math.floor(LIMIT_UNITS[kaigoIdx] * tanka);
    const isOverLimit = totalInsuranceYen > limitYen;
    const overflowYen = isOverLimit ? totalInsuranceYen - limitYen : 0;
    setResult({ monthlyVisits, perVisitYen, perVisitUser, monthlyInsuranceUser, monthlyFood, monthlyTotal, totalInsuranceYen, limitYen, isOverLimit, overflowYen });
  }

  function handleCopy() {
    if (!result) return;
    const kaigoLabel = KAIGO_LEVELS[kaigoIdx].label;
    const timeLabel = TIME_OPTIONS.find(t => t.key === timeKey)?.label ?? "";
    const lines = [
      "【デイサービス 月額利用料 試算結果】",
      "",
      `要介護度: ${kaigoLabel}　利用時間: ${timeLabel}　週${weekly}回`,
      `地域: ${city || "その他の地域"}　自己負担割合: ${waribai}割`,
      "",
      `月間利用回数: 約${result.monthlyVisits}回`,
      `介護保険分（窓口で払う分）: ¥${result.monthlyInsuranceUser.toLocaleString()}`,
      `食費（実費）: ¥${result.monthlyFood.toLocaleString()}`,
      `月額合計: ¥${result.monthlyTotal.toLocaleString()}`,
      "",
      result.isOverLimit
        ? `⚠️ 支給限度額超過: ¥${result.overflowYen.toLocaleString()}が全額自己負担`
        : "✅ 支給限度額の範囲内です",
      "",
      "※本ツールは月額の目安を試算するものです。実際の料金はケアマネジャーまたはデイサービス事業所にご確認ください。",
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4 print-hide">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/care" className="hover:underline">介護・保育</a>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-900 dark:text-white">デイサービス 月額利用料 シミュレーター</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 print-hide">
        デイサービス 月額利用料 シミュレーター【家族向け・無料】
      </h1>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 print-hide">
        デイサービス(通所介護)の1ヶ月の費用を、要介護度・利用時間・回数から簡単に試算。食費込みの月額目安が一発で分かります。
      </p>

      <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4 print-hide">
        <p className="text-sm text-sky-800 dark:text-sky-300">
          親が介護を必要としているけれど、デイサービスにどれくらい費用がかかるか不安——そんな方のためのシンプルな月額試算ツールです。専門用語は使わず、家族目線で月額目安を出します。
        </p>
        <p className="text-xs text-sky-600 dark:text-sky-400 mt-2">
          ※令和6年度介護報酬改定対応 ※通所介護(デイサービス)通常規模型 ※標準的な加算（入浴介助加算Ⅰ・個別機能訓練加算Ⅰイ・処遇改善加算Ⅰ）と食費込みの試算です
        </p>
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-5">費用を試算する</h2>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q1. 要介護度</p>
          <div className="flex flex-wrap gap-2">
            {KAIGO_LEVELS.map((lv) => (
              <button
                key={lv.idx}
                type="button"
                onClick={() => { setKaigoIdx(lv.idx); setResult(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${kaigoIdx === lv.idx ? "bg-sky-500 text-white border-sky-500" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
              >
                {lv.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">※要支援の方は対象外です。<a href="/care/youkaigodo-hayami" className="text-sky-600 dark:text-sky-400 underline">要介護度 早見表</a>もご参照ください。</p>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q2. 1日の利用時間</p>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => { setTimeKey(opt.key as TimeKey); setResult(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${timeKey === opt.key ? "bg-sky-500 text-white border-sky-500" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q3. 週の利用回数</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setWeekly(w => Math.max(1, w - 1)); setResult(null); }} className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors" aria-label="減らす">−</button>
            <span className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center">{weekly}</span>
            <button type="button" onClick={() => { setWeekly(w => Math.min(7, w + 1)); setResult(null); }} className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors" aria-label="増やす">＋</button>
            <span className="text-sm text-gray-600 dark:text-gray-400">回 / 週</span>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q4. お住まいの地域</p>
          <select value={city} onChange={e => { setCity(e.target.value); setResult(null); }} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400">
            <option value="">その他の地域</option>
            {CITY_LIST.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">わからない場合は「その他の地域」を選択してください</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q5. 自己負担割合</p>
          <div className="flex gap-2">
            {[1, 2, 3].map(w => (
              <button key={w} type="button" onClick={() => { setWaribai(w); setResult(null); }} className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${waribai === w ? "bg-sky-500 text-white border-sky-500" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>{w}割</button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">多くの方は1割負担です。年金収入で年280万円以上の場合は2〜3割になります。</p>
        </div>

        <button type="button" onClick={handleCalculate} className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors text-base">
          <Icons.Calc />
          月額を試算する
        </button>
      </section>

      {result && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <div className="hidden print:block mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">デイサービス 月額利用料 試算結果</h2>
            <p className="text-xs text-gray-500">{KAIGO_LEVELS[kaigoIdx].label}　{TIME_OPTIONS.find(t => t.key === timeKey)?.label}　週{weekly}回　{city || "その他の地域"}　{waribai}割負担</p>
          </div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 print-hide">📅 月額の目安（約{result.monthlyVisits}回利用）</h2>
          <div className="bg-sky-50 dark:bg-sky-900/30 rounded-xl p-5 text-center">
            <p className="text-xs text-sky-600 dark:text-sky-400 mb-1">月額合計の目安</p>
            <p className="text-4xl font-bold text-sky-700 dark:text-sky-300">約 ¥{result.monthlyTotal.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">約{result.monthlyVisits}回/月</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">介護保険分（窓口で払う分）</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">¥{result.monthlyInsuranceUser.toLocaleString()}</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">食費（実費、1回700円×{result.monthlyVisits}回）</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">¥{result.monthlyFood.toLocaleString()}</td>
                </tr>
                <tr className="bg-sky-50 dark:bg-sky-900/20">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">合計</td>
                  <td className="px-4 py-3 text-right font-bold text-sky-700 dark:text-sky-300 text-base">¥{result.monthlyTotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">1日あたり</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">約 ¥{Math.floor(result.monthlyTotal / result.monthlyVisits).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">1週間あたり</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">約 ¥{Math.floor(result.monthlyTotal / 4.3).toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1.5">含まれる費用</p>
              <ul className="text-green-700 dark:text-green-400 space-y-0.5 text-xs">
                <li>・介護保険の自己負担分（基本利用料）</li>
                <li>・入浴介助・個別機能訓練加算込み</li>
                <li>・食費（1回700円目安）</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1.5">含まれない費用</p>
              <ul className="text-gray-500 dark:text-gray-400 space-y-0.5 text-xs">
                <li>・おやつ代（施設により異なる）</li>
                <li>・レクリエーション材料費</li>
                <li>・個別の理美容代</li>
                <li>・医療費</li>
              </ul>
            </div>
          </div>
          {result.isOverLimit ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"><Icons.Warning /></span>
              <div className="text-sm">
                <p className="font-semibold text-amber-800 dark:text-amber-300">支給限度額を超えています</p>
                <p className="text-amber-700 dark:text-amber-400 mt-0.5">超過分 <strong>¥{result.overflowYen.toLocaleString()}</strong> が全額自己負担になります。ケアマネジャーと利用回数を相談することをお勧めします。</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-2 text-sm">
              <span className="text-green-500">✅</span>
              <p className="text-green-700 dark:text-green-400">支給限度額（¥{result.limitYen.toLocaleString()}）の範囲内です</p>
            </div>
          )}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>※本ツールは月額の目安を試算するものです。実際の料金は事業所の加算内容・食費・実費（おやつ・教材費など）により異なります。正確な見積もりはケアマネジャーまたは契約予定のデイサービス事業所にご確認ください。</p>
            <p>※令和6年度介護報酬改定（2024年4月施行）に基づきます。</p>
            <p>※標準的な加算（入浴介助加算Ⅰ・個別機能訓練加算Ⅰイ・処遇改善加算Ⅰ）と食費（1回700円目安）を含めた試算です。</p>
          </div>
          <div className="flex gap-2 print-hide">
            <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {copied ? <Icons.Check /> : <Icons.Copy />}
              {copied ? "コピー済み" : "結果をコピー"}
            </button>
            <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Icons.Printer />
              印刷
            </button>
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">よくある月額の目安</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">（標準的な加算込み・食費700円/回・その他地域・1割負担）</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold">要介護度</th>
                <th className="text-right px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold">週3回 (1割)</th>
                <th className="text-right px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold">週5回 (1割)</th>
              </tr>
            </thead>
            <tbody>
              {SEO_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}>
                  <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">{row.level}</td>
                  <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{row.w3}</td>
                  <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{row.w5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">利用時間: 7〜8時間。実際の費用はケアマネジャーにご確認ください。</p>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">デイサービスの費用構造</h2>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">デイサービスにかかる費用は3種類</p>
        <div className="space-y-3">
          {[
            { num: "1", title: "介護保険適用部分（1〜3割の自己負担）", body: "費用の7〜9割は介護保険でカバーされます。残りの1〜3割が窓口でのお支払いです。基本料金＋加算で決まります。" },
            { num: "2", title: "食費（1回 約500〜800円、施設により異なる）", body: "昼食代は介護保険の対象外です。多くの施設で1回500〜800円です。当ツールは700円/回で計算しています。" },
            { num: "3", title: "実費（おやつ・教材費など）", body: "おやつ代、レクリエーション材料費、理美容代などは全額自己負担です。施設によって異なります。" },
          ].map(item => (
            <div key={item.num} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 text-xs font-bold flex items-center justify-center">{item.num}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">自己負担が変わる条件</h2>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">年収による負担割合（1割 / 2割 / 3割）</h3>
            <p>年金収入のみで年280万円以上（単身）は2割、340万円以上は3割。市区町村から「介護保険負担割合証」が届きます。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">高額介護サービス費（月額上限）</h3>
            <p>1ヶ月の自己負担が上限額を超えた場合、超過分が払い戻されます（高額介護サービス費制度）。一般的な所得の方の上限は月44,400円です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">限度額を超えた場合</h3>
            <p>月額の支給限度額（要介護度ごとに設定）を超えた分は全額自己負担になります。複数のサービスを利用する場合は合計が限度額内に収まるよう調整が必要です。</p>
          </div>
        </div>
      </section>

      {/* Blog callout */}
      <section className="mt-12 print-hide">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-950/50">
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">📖 もっと詳しく</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            デイサービスの料金はいくら？要介護度別・月額の目安完全ガイド
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            1回1,500〜2,500円の内訳、食費・実費、限度額超過、令和8年6月処遇改善加算拡充の影響まで完全解説。
          </p>
          <a
            href="/blog/dayservice-ryoukin-guide"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            解説記事を読む →
          </a>
        </div>
      </section>

      <div className="print-hide">
        <FAQSection faq={FAQ} title="よくある質問" />
      </div>

    </div>
  );
}
