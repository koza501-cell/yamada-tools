"use client";
import { useState } from "react";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

const DEFAULT_RATES = [
  { name: "健康保険料（会社負担）", key: "kenpo", rate: 5.00 },
  { name: "厚生年金保険料（会社負担）", key: "kosei", rate: 9.15 },
  { name: "雇用保険料（会社負担）", key: "koyo", rate: 0.95 },
  { name: "労災保険料", key: "rosai", rate: 0.88 },
  { name: "子ども・子育て拠出金", key: "kosodate", rate: 0.36 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP") + "円";
}

function fmtRate(r: number) {
  return r.toFixed(2) + "%";
}

export default function HofukuClient() {
  const tool = getToolById("hofuku-calculator");
  const [roumuhi, setRoumuhi] = useState("1000000");
  const [customMode, setCustomMode] = useState(false);
  const [customRates, setCustomRates] = useState(DEFAULT_RATES.map(r => ({ ...r, customRate: r.rate.toString() })));
  const [copied, setCopied] = useState(false);

  const rates = customMode
    ? customRates.map(r => ({ ...r, rate: parseFloat(r.customRate) || 0 }))
    : DEFAULT_RATES;

  const roumu = parseFloat(roumuhi) || 0;
  const items = rates.map(r => ({ name: r.name, rate: r.rate, amount: roumu * r.rate / 100 }));
  const total = items.reduce((s, i) => s + i.amount, 0);
  const totalRate = rates.reduce((s, r) => s + r.rate, 0);

  function buildCopyText() {
    const lines = [
      "【法定福利費 明細】",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `労務費合計：${roumu.toLocaleString("ja-JP")}円`,
      "─────────────────────────",
      ...items.map(i => `${i.name}：${fmt(i.amount)}`),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `法定福利費合計：${fmt(total)}`,
    ];
    return lines.join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/business" className="hover:underline">ビジネス</a>
        <span className="mx-1">&gt;</span>
        <span>法定福利費計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🏗️ 建設業 法定福利費計算機</h1>
        <p className="text-gray-600 text-sm">労務費から法定福利費を自動計算。見積書への記載テキストをワンクリックでコピー。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">💼 労務費入力</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">労務費合計</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-kon outline-none"
              value={roumuhi}
              onChange={e => setRoumuhi(e.target.value)}
              placeholder="1000000"
              min="0"
            />
            <span className="text-gray-500 text-sm whitespace-nowrap">円</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={customMode} onChange={e => setCustomMode(e.target.checked)} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-700">実際の保険料率で計算する（各率を手動入力）</span>
          </label>
        </div>

        {customMode && (
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">各保険種別の会社負担率を入力してください</p>
            {customRates.map((row, i) => (
              <div key={row.key} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-44 shrink-0">{row.name}</span>
                <input
                  type="number"
                  className="border border-gray-300 rounded px-2 py-1 w-20 text-sm outline-none"
                  value={row.customRate}
                  step="0.01"
                  min="0"
                  max="50"
                  onChange={e => {
                    const next = [...customRates];
                    next[i] = { ...next[i], customRate: e.target.value };
                    setCustomRates(next);
                  }}
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-kon text-white p-4">
          <p className="text-sm opacity-80 mb-1">法定福利費合計 / 見積書記載額</p>
          <p className="text-3xl font-bold">{fmt(total)}</p>
          <p className="text-gin text-sm mt-1">労務費の {fmtRate(totalRate)} 相当</p>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-500 font-normal py-1">保険種別</th>
                <th className="text-right text-gray-500 font-normal py-1">率</th>
                <th className="text-right text-gray-500 font-normal py-1">金額</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.name} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{item.name}</td>
                  <td className="py-2 text-right text-gray-500">{fmtRate(item.rate)}</td>
                  <td className="py-2 text-right font-medium text-gray-800">{fmt(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-2 font-bold text-kon">合計</td>
                <td className="py-2 text-right font-bold text-kon">{fmtRate(totalRate)}</td>
                <td className="py-2 text-right font-bold text-kon">{fmt(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <button type="button"
            onClick={handleCopy}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            {copied ? "✅ コピーしました！" : "📋 見積書テキストをコピー"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
        <p className="font-semibold text-kon mb-2">📋 根拠・参考資料</p>
        <ul className="text-kon space-y-1 text-xs">
          <li>・ 2024年度適用保険料率（協会けんぽ・日本年金機構・厚生労働省）</li>
          <li>・ 国土交通省通達「社会保険の加入に関する下請指導ガイドライン」</li>
          <li>・ 建設業の見積書への法定福利費明示は国交省通達（H24年）以降の業界標準</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 mb-8">※ 計算結果は参考値です。実際の保険料率は加入機関・業種・給与水準により異なります。</p>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "法定福利費率 16.34%の内訳は？", a: "健康保険5.00%＋厚生年金9.15%＋雇用保険0.95%＋労災保険0.88%＋子ども・子育て拠出金0.36%＝16.34%です（2024年度・建設業・協会けんぽ）。" },
            { q: "見積書に法定福利費を書く義務がありますか？", a: "義務ではありませんが、国土交通省の通達（平成24年以降）により建設業では法定福利費の明示が強く求められています。元請企業は下請への指導も必要です。" },
            { q: "下請けと元請けで計算方法は違いますか？", a: "法定福利費の計算式自体は同じです。ただし元請けは下請けの法定福利費も適切に見積もりに含めて発注することが求められています。" },
          ].map(({ q, a }, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>


      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
        <p className="text-gray-300 text-xs mt-1">透かしなし・高品質PDFはPROプランで → yamada-tools.jp/pricing</p>
      </div>
      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
