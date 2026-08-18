"use client";

import { useState, useMemo } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import { MINIMUM_WAGES_2026, SORTED_BY_WAGE } from "@/data/minimum-wage-2026";

type WageType = "hourly" | "daily" | "monthly";

const FAQ = [
  { q: "最低賃金は2026年いつから適用されますか？", a: "地域別最低賃金は毎年10月1日前後に改定されます。2026年度の最低賃金は2026年10月頃に発効予定です。当ツールは2026年度（最新改定）の数値を使用しています。" },
  { q: "月給制の場合の最低賃金換算方法は？", a: "月給 ÷ 月の所定労働時間 = 時給換算額で計算します。月の所定労働時間は「週の所定労働時間 × 52週 ÷ 12ヶ月」で求めます。例: 週40時間の場合、月の所定労働時間 = 40×52÷12 ≈ 173.3時間。" },
  { q: "アルバイトも最低賃金の対象ですか？", a: "はい。パート・アルバイト・派遣社員を含むすべての労働者に最低賃金が適用されます。試用期間中でも原則として最低賃金を下回ることはできません（一部例外あり）。" },
  { q: "最低賃金を下回った場合の罰則は？", a: "最低賃金法違反は50万円以下の罰金が科せられます（最低賃金法第40条）。また、未払い分の賃金の支払いも求められます。" },
  { q: "特定最低賃金（産業別）とは？", a: "特定の産業・業種に適用される最低賃金で、地域別最低賃金より高い場合があります。製造業・情報処理など一部産業では業種別の最低賃金が別途設定されており、どちらか高い方が適用されます。" },
];

export default function SaiteichinginCheck() {
  const [prefecture, setPrefecture] = useState("東京");
  const [wageType, setWageType] = useState<WageType>("hourly");
  const [wage, setWage] = useState(1200);
  const [wageText, setWageText] = useState("1200");
  const [dailyHours, setDailyHours] = useState(8);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const prefData = MINIMUM_WAGES_2026.find(p => p.name === prefecture) ?? MINIMUM_WAGES_2026[12]; // Tokyo default
  const minWage = prefData.wage;

  const hourlyWage = useMemo(() => {
    if (wageType === "hourly")  return wage;
    if (wageType === "daily")   return dailyHours > 0 ? Math.round(wage / dailyHours) : 0;
    const monthlyHours = (weeklyHours * 52) / 12;
    return monthlyHours > 0 ? Math.round(wage / monthlyHours) : 0;
  }, [wage, wageType, dailyHours, weeklyHours]);

  const diff = hourlyWage - minWage;
  const isOk = diff >= 0;
  const rank = SORTED_BY_WAGE.findIndex(p => p.name === prefecture) + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">最低賃金チェックツール 2026</h1>
      <p className="text-sm text-gray-500 mb-6">都道府県別の最低賃金と実際の賃金を比較・チェック</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 入力 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">都道府県</label>
              <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {MINIMUM_WAGES_2026.map(p => <option key={p.name} value={p.name}>{p.name}（¥{p.wage}）</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">賃金形態</label>
              <div className="flex gap-2">
                {(["hourly", "daily", "monthly"] as WageType[]).map(t => (
                  <button key={t} onClick={() => setWageType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${wageType === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`}>
                    {t === "hourly" ? "時給" : t === "daily" ? "日給" : "月給"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {wageType === "hourly" ? "時給額" : wageType === "daily" ? "日給額" : "月給額"}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">¥</span>
                <input type="number" value={wageText} onChange={e => { setWageText(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setWage(v); }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            {wageType === "daily" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">所定労働時間/日</label>
                <input type="number" min={1} max={12} value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <span className="text-sm text-gray-500 ml-2">時間</span>
              </div>
            )}
            {wageType === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">週の所定労働時間</label>
                <input type="number" min={1} max={60} value={weeklyHours} onChange={e => setWeeklyHours(Number(e.target.value))}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <span className="text-sm text-gray-500 ml-2">時間/週（月{Math.round((weeklyHours * 52) / 12)}時間換算）</span>
              </div>
            )}
          </div>

          {/* 全国比較 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">全国ランキング（{prefecture}: {rank}位 / 47都道府県）</h2>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${((48 - rank) / 47) * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">上位5都道府県</p>
                {SORTED_BY_WAGE.slice(0, 5).map((p, i) => (
                  <div key={p.name} className={`flex justify-between text-xs py-0.5 ${p.name === prefecture ? "font-bold text-blue-700" : "text-gray-600"}`}>
                    <span>{i + 1}. {p.name}</span><span>¥{p.wage}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">下位5都道府県</p>
                {SORTED_BY_WAGE.slice(-5).reverse().map((p, i) => (
                  <div key={p.name} className={`flex justify-between text-xs py-0.5 ${p.name === prefecture ? "font-bold text-blue-700" : "text-gray-600"}`}>
                    <span>{47 - i}. {p.name}</span><span>¥{p.wage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* 結果 */}
        <div className="lg:w-80 xl:w-96 lg:sticky lg:top-4 self-start space-y-4">
          <div className={`rounded-xl p-6 text-white ${isOk ? "bg-gradient-to-br from-green-600 to-emerald-700" : "bg-gradient-to-br from-red-600 to-rose-700"}`}>
            <div className="text-4xl font-bold mb-2">{isOk ? "✅" : "❌"}</div>
            <p className="text-lg font-bold mb-1">
              {isOk ? "最低賃金を満たしています" : "最低賃金を下回っています"}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">{prefecture}の最低賃金</span>
                <span className="font-bold">¥{minWage}/時</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">あなたの時給換算</span>
                <span className="font-bold">¥{hourlyWage}/時</span>
              </div>
              <div className={`flex justify-between pt-2 border-t ${isOk ? "border-green-500" : "border-red-500"}`}>
                <span className="opacity-80">差額</span>
                <span className={`font-bold text-lg ${isOk ? "text-green-200" : "text-red-200"}`}>
                  {diff >= 0 ? "+" : ""}¥{diff}/時
                </span>
              </div>
            </div>
          </div>

          {!isOk && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-bold text-red-800 mb-2">⚠️ 最低賃金法違反の可能性</p>
              <p className="text-xs text-red-700 mb-2">最低賃金法に違反した場合、使用者は50万円以下の罰金が科せられます。</p>
              <a href="https://www.mhlw.go.jp" target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 underline">厚生労働省 最低賃金の情報 →</a>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-medium mb-2">📌 改定情報</p>
            <p className="text-xs text-gray-600">最低賃金は毎年10月頃に改定されます。当ツールは2026年度の数値を使用しています。最新情報は厚生労働省のウェブサイトをご確認ください。</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50">
                <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
      <AdUnit slot="5612038947" format="horizontal" className="mt-8" />
    </div>
  );
}
