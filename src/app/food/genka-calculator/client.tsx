"use client";
import { useState, useMemo, useEffect } from "react";

interface Ingredient {
  name: string;
  purchaseQty: string;
  purchasePrice: string;
  usedQty: string;
}

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPrice(n: number) { return fmt(n) + "円"; }

const COST_REFS = [
  { type: "ラーメン", range: "25〜30%", note: "原材料費が比較的低い" },
  { type: "寿司", range: "40〜50%", note: "魚介類の原価が高い" },
  { type: "カフェ", range: "25〜35%", note: "ドリンクは原価が低め" },
  { type: "居酒屋", range: "30〜35%", note: "食材バリエーションが広い" },
  { type: "焼肉", range: "45〜55%", note: "肉の原価が高い" },
  { type: "パスタ", range: "25〜35%", note: "小麦粉・ソースが主原料" },
];

const STORAGE_KEY = "genka-calculator-recipe";

export default function GenkaClient() {
  const [menuName, setMenuName] = useState("新メニュー");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", purchaseQty: "1000", purchasePrice: "300", usedQty: "150" },
  ]);
  const [sellingPrice, setSellingPrice] = useState("800");
  const [laborRatio, setLaborRatio] = useState("30");
  const [targetCostRatio, setTargetCostRatio] = useState("30");
  const [showRef, setShowRef] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.menuName) setMenuName(data.menuName);
        if (data.ingredients) setIngredients(data.ingredients);
        if (data.sellingPrice) setSellingPrice(data.sellingPrice);
        if (data.laborRatio) setLaborRatio(data.laborRatio);
        if (data.targetCostRatio) setTargetCostRatio(data.targetCostRatio);
      }
    } catch {}
  }, []);

  const saveRecipe = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ menuName, ingredients, sellingPrice, laborRatio, targetCostRatio }));
      setSavedMsg("保存しました");
      setTimeout(() => setSavedMsg(""), 2000);
    } catch {}
  };

  const addIngredient = () =>
    setIngredients(prev => [...prev, { name: "", purchaseQty: "", purchasePrice: "", usedQty: "" }]);

  const removeIngredient = (i: number) =>
    setIngredients(prev => prev.filter((_, idx) => idx !== i));

  const updateIngredient = (i: number, field: keyof Ingredient, val: string) =>
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

  const r = useMemo(() => {
    const sp = parseFloat(sellingPrice) || 0;
    const lr = parseFloat(laborRatio) / 100 || 0.3;
    const target = parseFloat(targetCostRatio) / 100 || 0.3;

    const itemCosts = ingredients.map(ing => {
      const pQty = parseFloat(ing.purchaseQty) || 0;
      const pPrice = parseFloat(ing.purchasePrice) || 0;
      const uQty = parseFloat(ing.usedQty) || 0;
      return pQty > 0 ? (pPrice / pQty) * uQty : 0;
    });

    const totalCost = itemCosts.reduce((a, b) => a + b, 0);
    const costRatio = sp > 0 ? totalCost / sp : 0;
    const properPrice = target > 0 ? totalCost / target : 0;
    const laborCost = sp * lr;
    const flRatio = sp > 0 ? (totalCost + laborCost) / sp : 0;
    const profit = sp - totalCost;

    const simulations = [10, 30, 50].map(perDay => ({
      perDay,
      monthly: perDay * 30,
      revenue: sp * perDay * 30,
      food: totalCost * perDay * 30,
      labor: laborCost * perDay * 30,
      profit: profit * perDay * 30,
    }));

    return { itemCosts, totalCost, costRatio, properPrice, flRatio, profit, simulations };
  }, [ingredients, sellingPrice, laborRatio, targetCostRatio]);

  const costColor = r.costRatio < 0.3
    ? "text-emerald-600" : r.costRatio < 0.35
    ? "text-yellow-600" : "text-danger";

  const costBg = r.costRatio < 0.3
    ? "bg-emerald-50 border-emerald-200" : r.costRatio < 0.35
    ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <span>メニュー原価率計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🍽️ 飲食店 メニュー原価率計算機</h1>
        <p className="text-gray-600 text-sm">食材費からメニューの原価率・適正売価・FLコストを自動計算。飲食店経営の利益改善に。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">📋 メニュー情報</h2>
          <div className="flex items-center gap-2">
            {savedMsg && <span className="text-xs text-green-600">{savedMsg}</span>}
            <button type="button" onClick={saveRecipe}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
              💾 保存
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">メニュー名</label>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="例: ラーメン" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">現在の売価（円）</label>
          <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="800" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">目標原価率（%）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={targetCostRatio} onChange={e => setTargetCostRatio(e.target.value)} placeholder="30" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">人件費率（%）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={laborRatio} onChange={e => setLaborRatio(e.target.value)} placeholder="30" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-sm">🛒 食材リスト</h2>
          <button type="button" onClick={addIngredient}
            className="text-xs px-3 py-1.5 bg-kon hover:bg-ai text-white rounded-lg">
            ＋ 食材を追加
          </button>
        </div>

        <div className="grid grid-cols-12 gap-1 text-xs text-gray-400 mb-2 px-1">
          <span className="col-span-3">食材名</span>
          <span className="col-span-2 text-center">購入量(g)</span>
          <span className="col-span-2 text-center">購入価格</span>
          <span className="col-span-2 text-center">使用量(g)</span>
          <span className="col-span-2 text-center">使用コスト</span>
          <span className="col-span-1"></span>
        </div>

        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-12 gap-1 items-center">
              <input className="col-span-3 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-200"
                placeholder="食材名" value={ing.name} onChange={e => updateIngredient(i, "name", e.target.value)} />
              <input type="number" className="col-span-2 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-200"
                placeholder="1000" value={ing.purchaseQty} onChange={e => updateIngredient(i, "purchaseQty", e.target.value)} />
              <input type="number" className="col-span-2 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-200"
                placeholder="300" value={ing.purchasePrice} onChange={e => updateIngredient(i, "purchasePrice", e.target.value)} />
              <input type="number" className="col-span-2 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-200"
                placeholder="150" value={ing.usedQty} onChange={e => updateIngredient(i, "usedQty", e.target.value)} />
              <div className="col-span-2 text-xs font-medium text-center text-gray-700">
                {fmtPrice(Math.round(r.itemCosts[i] ?? 0))}
              </div>
              <button type="button" onClick={() => removeIngredient(i)} disabled={ingredients.length <= 1}
                className="col-span-1 text-danger hover:text-danger text-center disabled:opacity-30">✕</button>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
          <span className="text-sm font-semibold text-gray-700">食材原価合計</span>
          <span className="text-sm font-bold text-gray-900">{fmtPrice(Math.round(r.totalCost))}</span>
        </div>
      </div>

      <div className={"border rounded-xl p-5 mb-6 " + costBg}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">現在の原価率</p>
            <p className={"text-3xl font-bold " + costColor}>{(r.costRatio * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {r.costRatio < 0.3 ? "✅ 優良（30%未満）" : r.costRatio < 0.35 ? "⚠️ 要注意（30〜35%）" : "❌ 高すぎ（35%超）"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">適正売価（目標{targetCostRatio}%）</p>
            <p className="text-3xl font-bold text-kon">{fmtPrice(Math.round(r.properPrice))}</p>
            <p className="text-xs text-gray-500 mt-1">FL比率: {(r.flRatio * 100).toFixed(1)}%（目安60%以下）</p>
          </div>
        </div>
        {r.costRatio >= 0.35 && (
          <p className="text-xs text-danger mt-3 font-medium">
            ⚠️ 原価率が高すぎます。売価を {fmtPrice(Math.round(r.properPrice))} 以上に設定するか、食材コストを見直してください。
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 text-sm mb-4">📊 月間利益シミュレーション（{menuName}）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">販売数</th>
                <th className="text-right py-2 text-gray-500 font-medium">月間売上</th>
                <th className="text-right py-2 text-gray-500 font-medium">食材費</th>
                <th className="text-right py-2 text-gray-500 font-medium">人件費</th>
                <th className="text-right py-2 text-gray-500 font-medium text-green-700">月間利益</th>
              </tr>
            </thead>
            <tbody>
              {r.simulations.map(s => (
                <tr key={s.perDay} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2">{s.perDay}食/日 ({s.monthly}食/月)</td>
                  <td className="py-2 text-right">{fmtPrice(Math.round(s.revenue))}</td>
                  <td className="py-2 text-right">{fmtPrice(Math.round(s.food))}</td>
                  <td className="py-2 text-right">{fmtPrice(Math.round(s.labor))}</td>
                  <td className={"py-2 text-right font-bold " + (s.profit >= 0 ? "text-green-600" : "text-danger")}>
                    {s.profit >= 0 ? "+" : ""}{fmtPrice(Math.round(s.profit))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 利益 = (売価 - 食材原価) × 月間食数。家賃・光熱費等の固定費は含みません。</p>
      </div>

      <div className="mb-6">
        <button type="button" onClick={() => setShowRef(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span>📚 業態別 よくある原価率の目安</span>
          <span>{showRef ? "▲" : "▼"}</span>
        </button>
        {showRef && (
          <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 text-gray-600 font-medium">業態</th>
                  <th className="text-center py-2 px-4 text-gray-600 font-medium">目安原価率</th>
                  <th className="text-left py-2 px-4 text-gray-600 font-medium">備考</th>
                </tr>
              </thead>
              <tbody>
                {COST_REFS.map(r => (
                  <tr key={r.type} className="border-t border-gray-100">
                    <td className="py-2 px-4 font-medium">{r.type}</td>
                    <td className="py-2 px-4 text-center text-kon font-medium">{r.range}</td>
                    <td className="py-2 px-4 text-gray-500 text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ 本ツールは参考値を提供するものです。実際の原価率は食材の仕入れ価格・ロス率によって異なります。
      </p>

      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        山田ツール | yamada-tools.jp — 無料計算ツール集 | メニュー: {menuName}
      </div>
    </div>
  );
}
