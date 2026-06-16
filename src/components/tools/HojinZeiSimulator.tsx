"use client";

import { useState, useMemo } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import { calcHojinZei, type CompanySize } from "@/lib/hojin-zei-calculator";

const FAQ = [
  { q: "防衛特別法人税とは何ですか？", a: "防衛増税の一環として2027年以降の導入が予定されている法人税の付加税です。法人税額に4%を乗じた金額が追加負担となります。例えば法人税が100万円の場合、4万円の追加負担になります。中小企業への配慮措置が設けられる可能性があります。" },
  { q: "中小企業と大企業の法人税率の違いは？", a: "中小法人（資本金1億円以下）は課税所得年800万円以下の部分に軽減税率15%が適用されます。800万円超の部分は23.2%です。大法人は所得金額にかかわらず一律23.2%が適用されます。" },
  { q: "実効税率とはなんですか？", a: "法人税・地方法人税・法人住民税・法人事業税をすべて合計した税額の課税所得に対する割合です。日本の実効税率は中小企業で約25〜27%、大企業で約30〜34%程度になります。" },
  { q: "法人事業税の外形標準課税とは？", a: "資本金1億円超の大企業に適用され、所得割だけでなく付加価値割・資本割も課税されます。このシミュレーターでは簡易計算（所得割のみ）を使用しています。詳細は税理士にご相談ください。" },
  { q: "このシミュレーターはどれくらい正確ですか？", a: "概算計算のため、実際の税額とは異なる場合があります。均等割（法人住民税の固定額）は10万円で固定しています。実際の申告は税理士または国税庁の計算ツールを使用してください。" },
];

export default function HojinZeiSimulator() {
  const [profit, setProfit] = useState(1000);
  const [profitText, setProfitText] = useState("1000");
  const [companySize, setCompanySize] = useState<CompanySize>("small");
  const [applyBoei, setApplyBoei] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const result = useMemo(() => calcHojinZei({
    profit, companySize, capital: 1000, employees: 10, applyBoeiSurtax: applyBoei
  }), [profit, companySize, applyBoei]);

  const resultWithBoei = useMemo(() => calcHojinZei({
    profit, companySize, capital: 1000, employees: 10, applyBoeiSurtax: true
  }), [profit, companySize]);

  const resultWithout = useMemo(() => calcHojinZei({
    profit, companySize, capital: 1000, employees: 10, applyBoeiSurtax: false
  }), [profit, companySize]);

  const boeiImpact = Math.round((resultWithBoei.totalTax - resultWithout.totalTax) * 10) / 10;

  const totalForBar = result.totalTax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">法人税シミュレーター 2026</h1>
      <p className="text-sm text-gray-500 mb-6">防衛特別法人税（2027年〜）を含む法人税負担を一括試算</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 入力 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">課税所得（税引前利益）</label>
              <div className="flex items-center gap-2 mb-2">
                <input type="number" value={profitText}
                  onChange={e => { setProfitText(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setProfit(v); }}
                  className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <span className="text-gray-500 text-sm">万円</span>
              </div>
              <input type="range" min={100} max={10000} step={100} value={Math.min(profit, 10000)}
                onChange={e => { const v = Number(e.target.value); setProfit(v); setProfitText(String(v)); }}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100万</span><span>800万（中小軽減枠）</span><span>1億</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">会社の区分</label>
              <div className="flex gap-2">
                {([["small", "中小企業（資本金1億円以下）"], ["large", "大企業（資本金1億円超）"]] as [CompanySize, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setCompanySize(v)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${companySize === v ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`}>
                    {l}
                  </button>
                ))}
              </div>
              {companySize === "small" && profit > 800 && (
                <p className="text-xs text-blue-600 mt-1">800万円超の部分（{profit - 800}万円）は23.2%適用</p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-800">防衛特別法人税（2027年〜予定）</p>
                <p className="text-xs text-red-600 mt-0.5">法人税額×4%の付加税</p>
              </div>
              <button
                onClick={() => setApplyBoei(!applyBoei)}
                className={`relative w-12 h-6 rounded-full transition-colors ${applyBoei ? "bg-red-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${applyBoei ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* 内訳積み上げバー */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">税額内訳</h2>
            <div className="space-y-2.5">
              {result.layers.map((layer, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{layer.label}</span>
                    <span className="font-mono">{layer.amount}万円 <span className="text-gray-400">({layer.rate.toFixed(1)}%)</span></span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${layer.color}`}
                      style={{ width: `${Math.min((layer.amount / profit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 防衛増税前後比較 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">防衛特別法人税の影響</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">現行（〜2026年）</p>
                <p className="text-2xl font-bold font-mono text-green-700">{resultWithout.totalTax}<span className="text-sm font-normal">万円</span></p>
                <p className="text-xs text-gray-500 mt-1">実効税率 {resultWithout.effectiveRate}%</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">防衛増税後（2027年〜）</p>
                <p className="text-2xl font-bold font-mono text-red-700">{resultWithBoei.totalTax}<span className="text-sm font-normal">万円</span></p>
                <p className="text-xs text-gray-500 mt-1">実効税率 {resultWithBoei.effectiveRate}%</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">増税影響額</span>
              <span className="font-bold text-red-600 font-mono">+{boeiImpact}万円</span>
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* 結果 */}
        <div className="lg:w-80 xl:w-96 lg:sticky lg:top-4 self-start space-y-4">
          <div className={`rounded-xl p-6 text-white ${applyBoei ? "bg-gradient-to-br from-red-700 to-red-900" : "bg-gradient-to-br from-blue-700 to-indigo-800"}`}>
            <p className="text-sm opacity-80 mb-1">合計税額</p>
            <div className="text-4xl font-bold font-mono mb-1">{result.totalTax}<span className="text-2xl font-normal">万円</span></div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">課税所得</span>
                <span className="font-bold">{profit}万円</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">実効税率</span>
                <span className="font-bold">{result.effectiveRate}%</span>
              </div>
              <div className={`flex justify-between pt-2 border-t ${applyBoei ? "border-red-600" : "border-blue-600"}`}>
                <span className="opacity-80">税引後利益</span>
                <span className="font-bold text-xl text-green-200">{result.afterTaxProfit}万円</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">税額明細</p>
            {[
              ["法人税", result.corporateTax],
              ["地方法人税", result.localCorporateTax],
              ["法人事業税", result.businessTax],
              ["法人住民税", result.residentTax],
            ].map(([label, amount]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-gray-600">{label as string}</span>
                <span className="font-mono font-medium">{amount as number}万円</span>
              </div>
            ))}
            {applyBoei && (
              <div className="flex justify-between text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                <span className="font-medium">防衛特別法人税</span>
                <span className="font-mono font-bold">+{result.boeiSurtax}万円</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span>合計</span>
              <span className="font-mono">{result.totalTax}万円</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-1">免責事項</p>
            <p className="text-xs text-amber-700 leading-relaxed">本ツールは概算計算です。実際の税額は決算内容・税制改正により異なります。申告・納税は税理士にご相談ください。</p>
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
