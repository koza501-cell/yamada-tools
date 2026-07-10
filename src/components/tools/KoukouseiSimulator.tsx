"use client";

import { useState } from "react";
import { AdUnit } from "@/components/common/AdUnit";

function getIncomeTaxRate(annualSalary: number): number {
  if (annualSalary <= 2_950_000) return 0.05;
  if (annualSalary <= 4_800_000) return 0.10;
  if (annualSalary <= 6_600_000) return 0.20;
  if (annualSalary <= 8_500_000) return 0.23;
  if (annualSalary <= 11_800_000) return 0.33;
  if (annualSalary <= 34_600_000) return 0.40;
  return 0.45;
}

const INCOME_TAX_DEDUCTION = 380_000;
const RESIDENT_TAX_DEDUCTION = 330_000;
const RESIDENT_TAX_RATE = 0.10;
const JIDOU_TEATE_PER_CHILD = 120_000;

const TABLE_ROWS = [
  { label: "300万円", income: 3_000_000 },
  { label: "400万円", income: 4_000_000 },
  { label: "500万円", income: 5_000_000 },
  { label: "600万円", income: 6_000_000 },
  { label: "800万円", income: 8_000_000 },
  { label: "1,000万円", income: 10_000_000 },
  { label: "1,200万円", income: 12_000_000 },
];

const FAQ_ITEMS = [
  {
    q: "2026年7月時点で、扶養控除縮小は決まっていますか？",
    a: "決まっていません。令和8年度税制改正大綱（2025年12月公表）には盛り込まれず、高市首相も「縮減の指示はしていない」と明言しています。本ツールは「もし実施されたら」という仮定のシミュレーターです。",
  },
  {
    q: "令和8年度税制改正で確定した変更点はありますか？",
    a: "はい。扶養親族の合計所得金額要件が58万円以下→62万円以下へ引き上げ（基礎控除・給与所得控除の引き上げに伴う連動）。これは2026年分から確定しています。16〜18歳の控除縮小とは別の話です。",
  },
  {
    q: "児童手当（月1万円）はどの世帯でも受け取れますか？",
    a: "2024年10月から所得制限が撤廃されたため、高校生年代（16〜18歳）の子どもがいる全世帯が月10,000円・年120,000円を受け取れます。控除縮小の増税分と相殺すると、低〜中所得世帯は実質的にプラスになるケースが多くなります。",
  },
  {
    q: "大学生（19〜22歳）の特定扶養控除は影響しますか？",
    a: "今回の議論の対象外です。特定扶養控除（19〜22歳未満）の63万円は変更なしです。",
  },
  {
    q: "この計算はどこまで正確ですか？",
    a: "所得税率は給与収入から概算した目安です。実際の税負担は給与所得控除・各種所得控除・社会保険料の実額によって変わります。参考値としてご利用ください。正確な計算は税理士か税務署にご確認ください。",
  },
];

export default function KoukouseiSimulator() {
  const [incomeText, setIncomeText] = useState("400");
  const [income, setIncome] = useState(4_000_000);
  const [numChildren, setNumChildren] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const taxRate = getIncomeTaxRate(income);
  const incomeTaxIncrease = INCOME_TAX_DEDUCTION * taxRate;
  const residentTaxIncrease = RESIDENT_TAX_DEDUCTION * RESIDENT_TAX_RATE;
  const totalTaxIncrease = (incomeTaxIncrease + residentTaxIncrease) * numChildren;
  const jidouTeateTotal = JIDOU_TEATE_PER_CHILD * numChildren;
  const netImpact = jidouTeateTotal - totalTaxIncrease;

  const fmt = (yen: number) => {
    const man = Math.round(Math.abs(yen) / 1_000) / 10;
    return man.toFixed(1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">このツールは「未決定の政策」を試算するシミュレーターです</p>
            <p>
              高校生（16〜18歳）の扶養控除縮小案は、2025年12月の令和8年度税制改正大綱に
              <strong>盛り込まれませんでした</strong>。実施時期・内容は未定です。
              本ツールは「もし検討案が実施されたら？」という仮定のシミュレーターです。
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        高校生扶養控除 見直し動向シミュレーター 2026
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        16〜18歳の子どもを扶養している世帯向け。縮小案が実施された場合の増税影響と、児童手当との差し引き計算。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-700 mb-2">✅ 確定（令和8年度）</p>
          <ul className="text-sm text-green-800 space-y-1.5">
            <li>・扶養親族の合計所得要件：58万 → <strong>62万円</strong>へ引上げ</li>
            <li>・2024年10月〜 高校生年代の<strong>児童手当</strong>（月1万円）開始・所得制限なし</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">❓ 未定（大綱に非掲載）</p>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>・16〜18歳の扶養控除縮小（所得税38万円 → 縮小案）</li>
            <li>・実施時期：未定</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">世帯年収（万円）</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                value={incomeText}
                onChange={(e) => {
                  setIncomeText(e.target.value);
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v > 0) setIncome(v * 10_000);
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-500 text-sm">万円</span>
            </div>
            <input
              type="range"
              min={200}
              max={3000}
              step={50}
              value={Math.min(Math.max(Math.round(income / 10_000), 200), 3000)}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setIncome(v * 10_000);
                setIncomeText(String(v));
              }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>200万円</span>
              <span>3,000万円</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              推定所得税率：<span className="font-semibold text-gray-600">{Math.round(taxRate * 100)}%</span>（概算）
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">16〜18歳の子どもの人数</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setNumChildren(n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    numChildren === n
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {n}人
                </button>
              ))}
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-2" />
        </div>

        <div className="sm:w-72 space-y-4">
          <div className={`rounded-xl p-5 text-white ${netImpact >= 0 ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-orange-500 to-red-600"}`}>
            <p className="text-sm opacity-80 mb-1">差し引き 年間損益（仮定）</p>
            <p className="text-3xl font-bold">
              {netImpact >= 0 ? "+" : "-"}{fmt(netImpact)}万円
            </p>
            <p className="text-xs opacity-70 mt-1">児童手当 − 控除縮小による増税</p>
            <div className="mt-3 pt-3 border-t border-white/30 text-xs opacity-80">
              {netImpact >= 0 ? "児童手当の方が多く、実質プラス" : "増税が児童手当を上回る負担増"}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">内訳（縮小案実施の仮定）</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">所得税 増加（推定）</span>
                <span className="font-semibold text-red-600">+{fmt(incomeTaxIncrease * numChildren)}万円</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">住民税 増加</span>
                <span className="font-semibold text-red-600">+{fmt(residentTaxIncrease * numChildren)}万円</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-700 font-medium">増税 小計</span>
                <span className="font-bold text-red-700">+{fmt(totalTaxIncrease)}万円</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">児童手当（年額）</span>
                <span className="font-semibold text-green-600">−{fmt(jidouTeateTotal)}万円</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-700 font-medium">純負担増</span>
                <span className={`font-bold ${netImpact >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {netImpact >= 0 ? "−" : "+"}{fmt(netImpact)}万円
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 pt-1">※ 所得税率は年収からの概算です</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700 text-sm">年収別 影響早見表（子ども1人・縮小案実施の仮定）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 px-4 text-left text-gray-500 font-medium">年収目安</th>
                <th className="py-2 px-4 text-right text-gray-500 font-medium">所得税率</th>
                <th className="py-2 px-4 text-right text-gray-500 font-medium">所得税増</th>
                <th className="py-2 px-4 text-right text-gray-500 font-medium">住民税増</th>
                <th className="py-2 px-4 text-right text-gray-500 font-medium">児童手当</th>
                <th className="py-2 px-4 text-right text-gray-500 font-medium">純損益</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(row => {
                const r = getIncomeTaxRate(row.income);
                const it = INCOME_TAX_DEDUCTION * r;
                const rt = RESIDENT_TAX_DEDUCTION * RESIDENT_TAX_RATE;
                const net = JIDOU_TEATE_PER_CHILD - it - rt;
                return (
                  <tr key={row.label} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-700">{row.label}</td>
                    <td className="py-2 px-4 text-right text-gray-500">{Math.round(r * 100)}%</td>
                    <td className="py-2 px-4 text-right text-red-600">{(it / 10_000).toFixed(1)}万</td>
                    <td className="py-2 px-4 text-right text-red-600">{(rt / 10_000).toFixed(1)}万</td>
                    <td className="py-2 px-4 text-right text-green-600">12.0万</td>
                    <td className={`py-2 px-4 text-right font-semibold ${net >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {net >= 0 ? "+" : ""}{(net / 10_000).toFixed(1)}万
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 px-4 py-2 border-t border-gray-100">
          ※ 所得税率は給与収入からの目安。実際は給与所得控除・配偶者控除等で変動します。
        </p>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h2 className="font-semibold text-blue-900 mb-3 text-sm">最新動向を確認する（一次情報）</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://www.mof.go.jp/tax_policy/tax_reform/outline/fy2026/zeikaisei2026.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              財務省：令和8年度税制改正の大綱 →
            </a>
          </li>
          <li>
            <a
              href="https://www.kantei.go.jp/jp/tyoukanpress/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              首相官邸：官房長官記者会見 →
            </a>
          </li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          2026年7月時点の情報です。今後の税制改正大綱で内容が変更される可能性があります。
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4 text-sm">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />
    </div>
  );
}
