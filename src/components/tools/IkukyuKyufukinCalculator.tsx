"use client";

import { useState, useMemo } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import { calcIkukyu, type IkukyuInput } from "@/lib/ikukyu-calculator";

const CURRENT_YEAR = 2026;

const FAQ = [
  { q: "育児休業給付金の受給条件は？", a: "雇用保険に加入し、育休開始前の2年間に賃金支払い基礎日数11日以上の月が12ヶ月以上あることが条件です。有期契約社員の場合は子が1歳6ヶ月までに契約更新の見込みがあることも必要です。" },
  { q: "給付率67%はいつまでですか？", a: "育休開始から通算180日（約6ヶ月）までが67%、それ以降は50%になります。パパ・ママ育休プラスを活用すると期間を延長できる場合があります。" },
  { q: "社会保険料の免除とはなんですか？", a: "育休中は健康保険料・厚生年金保険料が免除されます（本人負担分＋事業主負担分）。ただし年金の計算上は保険料を支払ったとみなされるため、将来の年金受取額に影響しません。" },
  { q: "育休中に手取りはどれくらいになりますか？", a: "給付金（67%）＋社会保険料免除（約14%）＋所得税・住民税が非課税になる効果を合わせると、育休前の手取りの約80〜85%程度を維持できるとされています。" },
  { q: "パパ育休（産後パパ育休）の給付は？", a: "産後パパ育休（出生時育児休業）でも雇用保険の育児休業給付が受けられます。子の出生後8週間以内に最大4週間取得可能で、休業中に就業した場合も一定の条件で給付を受けられます。" },
];

export default function IkukyuKyufukinCalculator() {
  const now = new Date();
  const [salary, setSalary] = useState(30);
  const [salaryText, setSalaryText] = useState("30");
  const [startMonth, setStartMonth] = useState(now.getMonth() + 1);
  const [startYear, setStartYear] = useState(CURRENT_YEAR);
  const [duration, setDuration] = useState(12);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const input: IkukyuInput = {
    monthlySalary: salary,
    startMonth,
    startYear,
    durationMonths: duration,
    isPartner: false,
    useBonus: false,
    bonusAmount: 0,
  };
  const result = useMemo(() => calcIkukyu(input), [salary, startMonth, startYear, duration]);

  const maxBenefit = Math.max(...result.months.map(m => m.benefit), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">育児休業給付金計算ツール 2026</h1>
      <p className="text-sm text-gray-500 mb-6">月給と育休期間を入力して給付金を月別にシミュレーション</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 入力 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">育休前の月給（額面）</label>
              <div className="flex items-center gap-2">
                <input type="number" value={salaryText}
                  onChange={e => { setSalaryText(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setSalary(v); }}
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <span className="text-gray-500 text-sm">万円 / 月</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">上限: 約{result.ceilingMonthly}万円/月（2026年度）</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">育休開始月</label>
              <div className="flex gap-2">
                <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}月</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">育休期間: <span className="text-blue-700 font-bold">{duration}ヶ月</span></label>
              <input type="range" min={1} max={24} step={1} value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1ヶ月</span><span>6ヶ月（180日）</span><span>12ヶ月</span><span>24ヶ月</span>
              </div>
            </div>
          </div>

          {/* 月別バー */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">月別給付金</h2>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {result.months.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-16 flex-shrink-0">{m.label}</span>
                  <div className="flex-1 relative h-5 bg-gray-100 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-300 ${m.isFirst180 ? "bg-blue-500" : "bg-blue-300"}`}
                      style={{ width: `${(m.benefit / maxBenefit) * 100}%` }}
                    />
                    <span className="absolute right-1 top-0 bottom-0 flex items-center text-xs font-mono text-gray-700">
                      {m.benefit}万
                    </span>
                  </div>
                  <span className={`w-8 flex-shrink-0 font-medium ${m.isFirst180 ? "text-blue-700" : "text-blue-400"}`}>
                    {Math.round(m.rate * 100)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" />67%（〜180日）</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-300 rounded-sm inline-block" />50%（180日〜）</span>
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* 結果 */}
        <div className="lg:w-80 xl:w-96 lg:sticky lg:top-4 self-start space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <p className="text-sm opacity-80 mb-4">育休{duration}ヶ月の給付金合計</p>
            <div className="text-4xl font-bold font-mono mb-1">{result.totalBenefit}<span className="text-2xl font-normal">万円</span></div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">180日以内分（67%）</span>
                <span className="font-bold">{result.totalBenefit180}万円</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">180日超分（50%）</span>
                <span className="font-bold">{result.totalBenefitAfter180}万円</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-500">
                <span className="opacity-80">社保免除（概算）</span>
                <span className="font-bold text-green-300">+{result.socialInsSaving}万円</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">実質収入維持率</p>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-3xl font-bold font-mono ${result.effectiveIncomeRate >= 80 ? "text-green-700" : result.effectiveIncomeRate >= 60 ? "text-yellow-700" : "text-red-700"}`}>
                {result.effectiveIncomeRate}%
              </span>
              <span className="text-sm text-gray-500 mb-1">（給付金＋社保免除）</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${result.effectiveIncomeRate >= 80 ? "bg-green-500" : result.effectiveIncomeRate >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(result.effectiveIncomeRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">※所得税・住民税非課税効果は含まず</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-800 mb-2">ポイント</p>
            <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed">
              <li>• 育休中は社会保険料が全額免除（本人・事業主分）</li>
              <li>• 給付金は非課税のため所得税・住民税がかからない</li>
              <li>• 夫婦同時取得でパパ育休加算（最大14日で10/10補償）</li>
              <li>• 保育園入園目的の延長は最長2歳まで可能</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 font-medium mb-2">📌 注意事項</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              給付金の実際の金額はハローワークへの申請後に確定します。賃金日額の計算方法や受給条件は変更される場合があります。
            </p>
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
