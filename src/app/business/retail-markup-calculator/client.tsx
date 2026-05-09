"use client";
import { useState, useMemo, useRef } from "react";

type Mode = "price" | "reverse" | "profit" | "bulk";
type PriceMode = "markup" | "margin";

interface BulkRow {
  id: number;
  name: string;
  cost: string;
  price: string;
}

const BENCHMARKS = [
  { name: "スーパー", margin: "25〜30%" },
  { name: "コンビニ", margin: "30〜35%" },
  { name: "アパレル", margin: "40〜60%" },
  { name: "飲食店", margin: "60〜70%" },
  { name: "書籍", margin: "20〜25%" },
  { name: "家電量販", margin: "20〜30%" },
  { name: "EC通販", margin: "30〜50%" },
];

const TABS: { key: Mode; label: string }[] = [
  { key: "price", label: "原価→売価" },
  { key: "reverse", label: "売価→利益" },
  { key: "profit", label: "利益→売価" },
  { key: "bulk", label: "一括計算" },
];

export default function RetailMarkupClient() {
  const nextId = useRef(2);
  const [mode, setMode] = useState<Mode>("price");
  const [priceMode, setPriceMode] = useState<PriceMode>("markup");
  const [cost, setCost] = useState("1000");
  const [targetRate, setTargetRate] = useState("50");
  const [sellPrice, setSellPrice] = useState("1500");
  const [targetProfit, setTargetProfit] = useState("500");
  const [includeTax, setIncludeTax] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    { id: 1, name: "商品A", cost: "1000", price: "1500" },
  ]);

  const addRow = () => setBulkRows(prev => [...prev, { id: nextId.current++, name: "", cost: "", price: "" }]);
  const removeRow = (id: number) => setBulkRows(prev => prev.filter(r => r.id !== id));
  const updateRow = (id: number, updates: Partial<BulkRow>) => {
    setBulkRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const tax = includeTax ? 1.1 : 1.0;

  const calc = useMemo(() => {
    const c = parseFloat(cost) || 0;
    const rate = parseFloat(targetRate) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const tp = parseFloat(targetProfit) || 0;

    const m1Ex = priceMode === "markup" ? c * (1 + rate / 100) : (rate < 100 ? c / (1 - rate / 100) : 0);
    const m1Sell = m1Ex * tax;
    const m1Profit = m1Ex - c;
    const m1Markup = c > 0 ? (m1Profit / c) * 100 : 0;
    const m1Margin = m1Ex > 0 ? (m1Profit / m1Ex) * 100 : 0;

    const m2Ex = sp / tax;
    const m2Profit = m2Ex - c;
    const m2Markup = c > 0 ? (m2Profit / c) * 100 : 0;
    const m2Margin = m2Ex > 0 ? (m2Profit / m2Ex) * 100 : 0;

    const m3Ex = c + tp;
    const m3Sell = m3Ex * tax;
    const m3Markup = c > 0 ? (tp / c) * 100 : 0;
    const m3Margin = m3Ex > 0 ? (tp / m3Ex) * 100 : 0;

    const bulkCalc = bulkRows.map(r => {
      const bc = parseFloat(r.cost) || 0;
      const bpEx = (parseFloat(r.price) || 0) / tax;
      const bProfit = bpEx - bc;
      const bMarkup = bc > 0 ? (bProfit / bc) * 100 : 0;
      const bMargin = bpEx > 0 ? (bProfit / bpEx) * 100 : 0;
      return { ...r, profit: bProfit, markup: bMarkup, margin: bMargin };
    });
    const totalProfit = bulkCalc.reduce((s, r) => s + r.profit, 0);
    const totalRev = bulkCalc.reduce((s, r) => s + (parseFloat(r.price) || 0) / tax, 0);
    const avgMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;

    return { m1Ex, m1Sell, m1Profit, m1Markup, m1Margin, m2Profit, m2Markup, m2Margin, m3Ex, m3Sell, m3Markup, m3Margin, bulkCalc, totalProfit, avgMargin };
  }, [cost, priceMode, targetRate, sellPrice, targetProfit, tax, bulkRows]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const fmtR = (n: number) => n.toFixed(1);
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const ResultCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-bold text-gray-800 dark:text-white">{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">小売・販売 値入率・粗利率 計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">原価から売価を決める・粗利率を正確に把握する</p>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300 space-y-1 mb-5">
          <p className="font-semibold">値入率 vs 粗利率（マージン率）の違い</p>
          <p>・<strong>値入率（マークアップ率）</strong> = 利益 ÷ 原価 × 100　例: 原価100円→売価150円 → 50÷100 = 50%</p>
          <p>・<strong>粗利率（マージン率）</strong> = 利益 ÷ 売価 × 100　例: 原価100円→売価150円 → 50÷150 = 33.3%</p>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setMode(t.key)}
              className={"px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors " + (mode === t.key ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700")}>
              {t.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
          <input type="checkbox" checked={includeTax} onChange={e => setIncludeTax(e.target.checked)} className="w-4 h-4 rounded" />
          売価を税込で計算する（入力した売価を÷1.1して税抜換算）
        </label>

        {mode === "price" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">入力</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">原価（円）</label>
                <input type="number" value={cost} onChange={e => setCost(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">目標設定方法</label>
                <div className="flex gap-2 mb-2">
                  {([["markup", "値入率で指定"], ["margin", "粗利率で指定"]] as [PriceMode, string][]).map(([k, l]) => (
                    <button key={k} onClick={() => setPriceMode(k)}
                      className={"flex-1 py-2 rounded-lg text-xs border transition-colors " + (priceMode === k ? "bg-blue-500 text-white border-blue-500" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600")}>
                      {l}
                    </button>
                  ))}
                </div>
                <input type="number" value={targetRate} onChange={e => setTargetRate(e.target.value)} className={inp}
                  placeholder={priceMode === "markup" ? "値入率 %" : "粗利率 %"} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">計算結果</h2>
              <div className="text-center mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">売価（税抜）</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{fmt(calc.m1Ex)}円</div>
                {includeTax && <div className="text-sm text-gray-500 dark:text-gray-400">税込: {fmt(calc.m1Sell)}円</div>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="利益額" value={fmt(calc.m1Profit) + "円"} />
                <ResultCard label="値入率（マークアップ）" value={fmtR(calc.m1Markup) + "%"} />
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs text-blue-400">粗利率（マージン）</div>
                  <div className="font-bold text-blue-700 dark:text-blue-300">{fmtR(calc.m1Margin)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "reverse" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">入力</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">原価（円）</label>
                <input type="number" value={cost} onChange={e => setCost(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">売価（円）{includeTax ? "・税込" : "・税抜"}</label>
                <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} className={inp} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">計算結果</h2>
              <div className="text-center mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">利益額</div>
                <div className={"text-3xl font-bold " + (calc.m2Profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>{fmt(calc.m2Profit)}円</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="値入率（マークアップ）" value={fmtR(calc.m2Markup) + "%"} />
                <div className={"rounded-lg p-3 " + (calc.m2Margin >= 30 ? "bg-green-50 dark:bg-green-900/10" : "bg-blue-50 dark:bg-blue-900/20")}>
                  <div className="text-xs text-gray-400">粗利率（マージン）</div>
                  <div className={"font-bold " + (calc.m2Margin >= 30 ? "text-green-600 dark:text-green-400" : "text-blue-700 dark:text-blue-300")}>{fmtR(calc.m2Margin)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "profit" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">入力</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">原価（円）</label>
                <input type="number" value={cost} onChange={e => setCost(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">目標利益額（円）</label>
                <input type="number" value={targetProfit} onChange={e => setTargetProfit(e.target.value)} className={inp} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">計算結果</h2>
              <div className="text-center mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">必要売価（税抜）</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{fmt(calc.m3Ex)}円</div>
                {includeTax && <div className="text-sm text-gray-500 dark:text-gray-400">税込: {fmt(calc.m3Sell)}円</div>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="値入率（マークアップ）" value={fmtR(calc.m3Markup) + "%"} />
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs text-blue-400">粗利率（マージン）</div>
                  <div className="font-bold text-blue-700 dark:text-blue-300">{fmtR(calc.m3Margin)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "bulk" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left pb-2 pr-2">商品名</th>
                    <th className="text-right pb-2 pr-2">原価（円）</th>
                    <th className="text-right pb-2 pr-2">売価（円）</th>
                    <th className="text-right pb-2 pr-2">利益</th>
                    <th className="text-right pb-2 pr-1">粗利率</th>
                    <th className="pb-2 w-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {calc.bulkCalc.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-2 pr-2">
                        <input value={row.name} onChange={e => updateRow(row.id, { name: e.target.value })}
                          placeholder="商品名"
                          className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" value={row.cost} onChange={e => updateRow(row.id, { cost: e.target.value })}
                          className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white text-right" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" value={row.price} onChange={e => updateRow(row.id, { price: e.target.value })}
                          className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white text-right" />
                      </td>
                      <td className={"py-2 pr-2 text-right font-medium " + (row.profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500")}>{fmt(row.profit)}</td>
                      <td className="py-2 pr-1 text-right text-gray-600 dark:text-gray-300">{fmtR(row.margin)}%</td>
                      <td className="py-2">
                        {bulkRows.length > 1 && (
                          <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-300 dark:border-gray-600 font-semibold">
                    <td className="pt-2 pr-2 text-gray-700 dark:text-gray-300">合計</td>
                    <td /><td />
                    <td className="pt-2 pr-2 text-right text-green-600 dark:text-green-400">{fmt(calc.totalProfit)}</td>
                    <td className="pt-2 pr-1 text-right text-blue-600 dark:text-blue-400">{fmtR(calc.avgMargin)}%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button onClick={addRow}
              className="mt-3 w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
              ＋ 商品を追加
            </button>
          </div>
        )}

        <details className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <summary className="p-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer text-sm">📊 業種別 粗利率の目安</summary>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BENCHMARKS.map(b => (
                <div key={b.name} className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{b.name}</div>
                  <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">{b.margin}</div>
                </div>
              ))}
            </div>
          </div>
        </details>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 小売・販売 値入率・粗利率 計算機
        </div>
      </div>
    </div>
  );
}
