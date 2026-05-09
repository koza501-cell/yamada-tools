"use client";
import { useState } from "react";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

const EXPENSE_ITEMS = [
  { key: "shibyo", label: "種苗費" },
  { key: "hiryo", label: "肥料費" },
  { key: "noyaku", label: "農薬費" },
  { key: "doryoku", label: "動力光熱費" },
  { key: "noki", label: "農機具費" },
  { key: "shuzen", label: "修繕費" },
  { key: "jidai", label: "地代・賃借料" },
  { key: "sono_ta", label: "その他経費" },
];

function calcIncomeTax(income: number): number {
  if (income <= 0) return 0;
  const brackets = [
    { limit: 1_950_000, rate: 0.05, deduct: 0 },
    { limit: 3_300_000, rate: 0.10, deduct: 97_500 },
    { limit: 6_950_000, rate: 0.20, deduct: 427_500 },
    { limit: 9_000_000, rate: 0.23, deduct: 636_000 },
    { limit: 18_000_000, rate: 0.33, deduct: 1_536_000 },
    { limit: 40_000_000, rate: 0.40, deduct: 2_796_000 },
    { limit: Infinity, rate: 0.45, deduct: 4_796_000 },
  ];
  for (const b of brackets) {
    if (income <= b.limit) {
      return Math.floor(income * b.rate - b.deduct);
    }
  }
  return 0;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP") + "円";
}

export default function NogyoClient() {
  const tool = getToolById("nogyo-income-calculator");
  const [revenue, setRevenue] = useState("3000000");
  const [kyosai, setKyosai] = useState("0");
  const [expenses, setExpenses] = useState<Record<string, string>>(
    Object.fromEntries(EXPENSE_ITEMS.map(e => [e.key, "0"]))
  );
  const [aoshiro, setAoshiro] = useState<"65" | "10" | "shiro">("65");
  const [expOpen, setExpOpen] = useState(true);

  const totalExpense = EXPENSE_ITEMS.reduce((s, e) => s + (parseFloat(expenses[e.key]) || 0), 0);
  const expenseRate = (parseFloat(revenue) || 0) > 0 ? (totalExpense / (parseFloat(revenue) || 1)) * 100 : 0;
  const aoshiroDeduction = aoshiro === "65" ? 650_000 : aoshiro === "10" ? 100_000 : 0;
  const nogyoIncome = (parseFloat(revenue) || 0) + (parseFloat(kyosai) || 0) - totalExpense;
  const basicDeduction = 480_000;
  const taxableIncome = Math.max(nogyoIncome - aoshiroDeduction - basicDeduction, 0);
  const incomeTax = calcIncomeTax(taxableIncome);
  const fukkoTax = Math.floor(incomeTax * 0.021);
  const totalTax = incomeTax + fukkoTax;
  const needsFiling = nogyoIncome > basicDeduction;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/health" className="hover:underline">健康・暮らし</a>
        <span className="mx-1">&gt;</span>
        <span>農業所得計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🌾 農業所得計算機</h1>
        <p className="text-gray-600 text-sm">農業の売上・経費から農業所得と確定申告の目安を計算。青色申告控除・農業共済対応。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">🌱 農業収入</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">農業収入（円/年）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="3000000" min="0" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">農業共済金（円）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={kyosai} onChange={e => setKyosai(e.target.value)} placeholder="0" min="0" />
          </div>
        </div>

        <div>
          <button type="button" className="flex items-center gap-2 text-sm font-semibold text-gray-700 w-full text-left"
            onClick={() => setExpOpen(o => !o)}>
            <span>{expOpen ? "▼" : "▶"}</span>
            <span>農業経費の内訳</span>
            <span className="ml-auto text-gray-400 font-normal">合計 {fmt(totalExpense)}</span>
          </button>
          {expOpen && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {EXPENSE_ITEMS.map(item => (
                <div key={item.key}>
                  <label className="block text-xs text-gray-500 mb-1">{item.label}</label>
                  <div className="flex items-center gap-1">
                    <input type="number"
                      className="border border-gray-300 rounded-lg px-2 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={expenses[item.key]}
                      onChange={e => setExpenses(prev => ({ ...prev, [item.key]: e.target.value }))}
                      placeholder="0" min="0" />
                    <span className="text-gray-400 text-xs">円</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">申告種別</label>
          <div className="flex flex-wrap gap-3">
            {(["65", "10", "shiro"] as const).map(val => {
              const lbl = val === "65" ? "青色申告（65万控除）" : val === "10" ? "青色申告（10万控除）" : "白色申告（控除なし）";
              return (
                <label key={val} className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input type="radio" name="aoshiro" value={val} checked={aoshiro === val}
                    onChange={() => setAoshiro(val)} className="accent-blue-500" />
                  <span className="text-gray-700">{lbl}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-green-700 text-white p-4">
          <p className="text-sm opacity-80 mb-1">農業所得</p>
          <p className="text-3xl font-bold">{fmt(nogyoIncome)}</p>
          <p className="text-green-200 text-sm mt-1">経費率 {expenseRate.toFixed(1)}%</p>
        </div>
        <div className="p-4 divide-y divide-gray-100">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">農業収入合計</span>
            <span className="text-gray-800">{fmt((parseFloat(revenue) || 0) + (parseFloat(kyosai) || 0))}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">農業経費合計</span>
            <span className="text-gray-800">- {fmt(totalExpense)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">青色申告特別控除</span>
            <span className="text-gray-800">- {fmt(aoshiroDeduction)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">基礎控除</span>
            <span className="text-gray-800">- {fmt(basicDeduction)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold">
            <span className="text-gray-900">課税所得の目安</span>
            <span className="text-blue-700">{fmt(taxableIncome)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">所得税の目安</span>
            <span className="text-gray-800">{fmt(incomeTax)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">復興特別所得税（2.1%）</span>
            <span className="text-gray-800">{fmt(fukkoTax)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold border-t-2 border-gray-200 mt-1">
            <span className="text-gray-900">納税額合計の目安</span>
            <span className="text-blue-700 text-base">{fmt(totalTax)}</span>
          </div>
        </div>
      </div>

      <div className={needsFiling ? "bg-red-50 border border-red-200 rounded-xl p-4 mb-6" : "bg-green-50 border border-green-200 rounded-xl p-4 mb-6"}>
        <p className="font-semibold text-sm mb-1">{needsFiling ? "⚠️ 確定申告が必要です" : "✅ 確定申告は不要な可能性があります"}</p>
        <p className="text-xs text-gray-600">
          {needsFiling
            ? "農業所得が基礎控除（48万円）を超えているため、確定申告が必要です。青色申告を選択すると最大65万円の特別控除が受けられます。"
            : "農業所得が基礎控除（48万円）以下のため、農業所得のみの場合は確定申告が不要な可能性があります。他の所得がある場合は別途ご確認ください。"}
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 text-sm mb-6">
        <h2 className="font-bold text-gray-800 mb-3">📄 計算結果サマリー（印刷用）</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
          <dt className="text-gray-500">農業収入</dt><dd className="text-gray-800">{fmt(parseFloat(revenue) || 0)}</dd>
          <dt className="text-gray-500">農業共済金</dt><dd className="text-gray-800">{fmt(parseFloat(kyosai) || 0)}</dd>
          <dt className="text-gray-500">農業経費合計</dt><dd className="text-gray-800">{fmt(totalExpense)}</dd>
          <dt className="text-gray-500">農業所得</dt><dd className="font-bold text-gray-900">{fmt(nogyoIncome)}</dd>
          <dt className="text-gray-500">課税所得（目安）</dt><dd className="text-gray-800">{fmt(taxableIncome)}</dd>
          <dt className="text-gray-500">所得税（目安）</dt><dd className="text-gray-800">{fmt(incomeTax)}</dd>
        </dl>
        <button onClick={() => window.print()} className="mt-3 text-xs text-blue-600 hover:underline print:hidden">
          🖨️ 印刷 / PDFとして保存
        </button>
        <div className="hidden print:block mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
          <p className="text-gray-300 text-xs mt-1">透かしなし・高品質 PDFはPROプランで → yamada-tools.jp/pricing</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-8">※ 計算結果は簡易的な目安です。実際の税額は他の収入・控除・経費詳細により異なります。税務署または税理士にご確認ください。</p>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "農業所得はどう計算しますか？", a: "農業所得 = 農業収入 + 農業共済金 - 農業経費で計算します。青色申告の場合はさらに65万円または10万円の特別控除が受けられます。" },
            { q: "確定申告が必要な基準は？", a: "原則として農業所得が基礎控除（48万円）を超える場合は確定申告が必要です。給与収入など他の所得がある場合は別途判断が必要です。" },
            { q: "青色申告と白色申告の違いは？", a: "青色申告は記帳・書類作成の義務がある代わりに最大65万円の特別控除が受けられます。白色申告は簡易的な記録でよいですが控除はありません。" },
            { q: "農業共済金は収入に含まれますか？", a: "農業共済から受け取った共済金は農業収入に加算されます。種類によって取り扱いが異なる場合があります。" },
          ].map(({ q, a }, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
