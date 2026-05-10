"use client";
import { useState, useMemo, useCallback, useRef } from "react";

interface IngredientData {
  energy: number; protein: number; fat: number; carb: number; salt: number;
}

const DB: Record<string, IngredientData> = {
  "小麦粉（薄力粉）": { energy: 368, protein: 8.3, fat: 1.5, carb: 75.8, salt: 0 },
  "バター": { energy: 745, protein: 0.6, fat: 81.0, carb: 0.2, salt: 1.9 },
  "砂糖": { energy: 384, protein: 0, fat: 0, carb: 99.3, salt: 0 },
  "卵（全卵）": { energy: 151, protein: 12.3, fat: 10.3, carb: 0.3, salt: 0.4 },
  "牛乳": { energy: 67, protein: 3.3, fat: 3.8, carb: 4.8, salt: 0.1 },
  "片栗粉": { energy: 338, protein: 0.1, fat: 0.1, carb: 84.7, salt: 0 },
  "醤油": { energy: 71, protein: 5.8, fat: 0, carb: 10.1, salt: 14.5 },
  "味噌": { energy: 198, protein: 12.5, fat: 6.0, carb: 21.9, salt: 12.4 },
  "豚肉（ロース）": { energy: 263, protein: 19.3, fat: 19.2, carb: 0.2, salt: 0.1 },
  "鶏肉（むね）": { energy: 191, protein: 21.3, fat: 11.6, carb: 0, salt: 0.1 },
  "キャベツ": { energy: 23, protein: 1.3, fat: 0.2, carb: 5.2, salt: 0 },
  "人参": { energy: 39, protein: 0.7, fat: 0.2, carb: 9.3, salt: 0.1 },
  "玉ねぎ": { energy: 37, protein: 1.0, fat: 0.1, carb: 8.8, salt: 0 },
  "じゃがいも": { energy: 76, protein: 1.8, fat: 0.1, carb: 17.6, salt: 0 },
  "米（精白米）": { energy: 358, protein: 6.1, fat: 0.9, carb: 77.9, salt: 0 },
  "食塩": { energy: 0, protein: 0, fat: 0, carb: 0, salt: 99.0 },
  "サラダ油": { energy: 921, protein: 0, fat: 100, carb: 0, salt: 0 },
  "その他（手入力）": { energy: 0, protein: 0, fat: 0, carb: 0, salt: 0 },
};

const DB_KEYS = Object.keys(DB);

interface IngredientRow {
  id: number;
  name: string;
  amount: string;
  custom: IngredientData;
}

const createRow = (id: number, name = "小麦粉（薄力粉）"): IngredientRow => ({
  id, name, amount: "", custom: { energy: 0, protein: 0, fat: 0, carb: 0, salt: 0 },
});

function fmt1(n: number): string {
  return n < 0.05 ? "0" : n < 10 ? n.toFixed(1) : Math.round(n).toString();
}

export default function NutritionClient() {
  const [productName, setProductName] = useState("サンプル商品");
  const [servingSize, setServingSize] = useState("100");
  const [yieldRate, setYieldRate] = useState("100");
  const nextIdRef = useRef(2);
  const [rows, setRows] = useState<IngredientRow[]>([createRow(1)]);
  const [viewMode, setViewMode] = useState<"100g" | "serving">("100g");
  const [copied, setCopied] = useState(false);

  const addRow = () => {
    const id = nextIdRef.current++;
    setRows(r => [...r, createRow(id)]);
  };
  const removeRow = (id: number) => setRows(r => r.filter(row => row.id !== id));
  const updateRow = (id: number, field: keyof IngredientRow | keyof IngredientData, value: string | number) => {
    setRows(r => r.map(row => {
      if (row.id !== id) return row;
      if (field === "name") return { ...row, name: String(value), custom: { energy: 0, protein: 0, fat: 0, carb: 0, salt: 0 } };
      if (field === "amount") return { ...row, amount: String(value) };
      return { ...row, custom: { ...row.custom, [field]: Number(value) } };
    }));
  };

  const result = useMemo(() => {
    const yr = (parseFloat(yieldRate) || 100) / 100;
    const totalRawG = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const totalG = totalRawG * yr;

    const totals = rows.reduce((acc, r) => {
      const g = parseFloat(r.amount) || 0;
      const data = r.name === "その他（手入力）" ? r.custom : (DB[r.name] ?? DB["小麦粉（薄力粉）"]);
      const factor = g / 100;
      return {
        energy: acc.energy + data.energy * factor,
        protein: acc.protein + data.protein * factor,
        fat: acc.fat + data.fat * factor,
        carb: acc.carb + data.carb * factor,
        salt: acc.salt + data.salt * factor,
      };
    }, { energy: 0, protein: 0, fat: 0, carb: 0, salt: 0 });

    const per100g: IngredientData = totalG > 0 ? {
      energy: totals.energy / totalG * 100,
      protein: totals.protein / totalG * 100,
      fat: totals.fat / totalG * 100,
      carb: totals.carb / totalG * 100,
      salt: totals.salt / totalG * 100,
    } : { energy: 0, protein: 0, fat: 0, carb: 0, salt: 0 };

    const sv = parseFloat(servingSize) || 100;
    const perServing: IngredientData = {
      energy: per100g.energy * sv / 100,
      protein: per100g.protein * sv / 100,
      fat: per100g.fat * sv / 100,
      carb: per100g.carb * sv / 100,
      salt: per100g.salt * sv / 100,
    };

    return { per100g, perServing, totalG };
  }, [rows, yieldRate, servingSize]);

  const display = viewMode === "100g" ? result.per100g : result.perServing;
  const displayUnit = viewMode === "100g" ? "100gあたり" : `1食（${servingSize}g）あたり`;

  const labelText = `栄養成分表示
${displayUnit}
エネルギー　${Math.round(display.energy)}kcal
たんぱく質　${fmt1(display.protein)}g
脂質　　　　${fmt1(display.fat)}g
炭水化物　　${fmt1(display.carb)}g
食塩相当量　${fmt1(display.salt)}g`;

  const copyLabel = useCallback(() => {
    navigator.clipboard.writeText(labelText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [labelText]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">食品 栄養成分表示 計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">原材料の配合量から栄養成分表示5項目を自動計算。食品表示法対応。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">製品情報</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">製品名</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">1食あたりの量 (g)</label>
                  <input type="number" value={servingSize} onChange={e => setServingSize(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">歩留まり率 (%)</label>
                  <input type="number" value={yieldRate} onChange={e => setYieldRate(e.target.value)} className={inp} placeholder="100" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">原材料リスト</h2>
                <button onClick={addRow} className="text-sm bg-kon hover:bg-ai text-white px-3 py-1 rounded-lg">＋ 追加</button>
              </div>
              <div className="space-y-3">
                {rows.map(row => (
                  <div key={row.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <select value={row.name} onChange={e => updateRow(row.id, "name", e.target.value)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white mr-2">
                        {DB_KEYS.map(k => <option key={k}>{k}</option>)}
                      </select>
                      {rows.length > 1 && (
                        <button onClick={() => removeRow(row.id)} className="text-xs text-danger hover:text-danger flex-shrink-0">削除</button>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">配合量 (g)</label>
                      <input type="number" value={row.amount} onChange={e => updateRow(row.id, "amount", e.target.value)}
                        placeholder="0" className={inp} />
                    </div>
                    {row.name === "その他（手入力）" && (
                      <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
                        {(["energy","protein","fat","carb","salt"] as (keyof IngredientData)[]).map(k => (
                          <div key={k}>
                            <div className="text-gray-400 text-center">{
                              k === "energy" ? "kcal" : k === "protein" ? "タン" : k === "fat" ? "脂質" : k === "carb" ? "炭水" : "塩"
                            }</div>
                            <input type="number" value={row.custom[k]}
                              onChange={e => updateRow(row.id, k, e.target.value)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded px-1 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white" />
                          </div>
                        ))}
                        <div className="col-span-5 text-gray-400 text-center">※ 100gあたりの値を入力</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">原材料合計: {result.totalG.toFixed(1)}g（歩留まり後）</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Toggle */}
            <div className="flex gap-2">
              {(["100g","serving"] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === m ? "bg-kon text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600"}`}>
                  {m === "100g" ? "100gあたり" : `1食（${servingSize}g）あたり`}
                </button>
              ))}
            </div>

            {/* Nutrition Label */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">栄養成分表示ラベル</h2>
                <button onClick={copyLabel}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg">
                  {copied ? "✓ コピー済み" : "📋 コピー"}
                </button>
              </div>

              <div className="border-2 border-black dark:border-gray-200 max-w-xs mx-auto font-mono text-sm">
                <div className="bg-black dark:bg-gray-200 text-white dark:text-black text-center py-1 font-bold text-base">
                  栄養成分表示
                </div>
                <div className="text-center text-xs py-1 border-b border-black dark:border-gray-200 text-gray-700 dark:text-gray-300">
                  {displayUnit}
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["エネルギー", `${Math.round(display.energy)}kcal`],
                      ["たんぱく質", `${fmt1(display.protein)}g`],
                      ["脂質", `${fmt1(display.fat)}g`],
                      ["炭水化物", `${fmt1(display.carb)}g`],
                      ["食塩相当量", `${fmt1(display.salt)}g`],
                    ].map(([l, v], idx) => (
                      <tr key={l} className={`border-b border-black dark:border-gray-200 ${idx === 0 ? "font-bold" : ""}`}>
                        <td className="px-2 py-1 text-gray-800 dark:text-gray-200">{l}</td>
                        <td className="px-2 py-1 text-right font-semibold text-gray-800 dark:text-gray-200">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparison table */}
              {viewMode !== "100g" && (
                <div className="mt-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left pb-1">栄養素</th>
                        <th className="text-right pb-1">100g</th>
                        <th className="text-right pb-1">1食({servingSize}g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["エネルギー", `${Math.round(result.per100g.energy)}kcal`, `${Math.round(result.perServing.energy)}kcal`],
                        ["たんぱく質", `${fmt1(result.per100g.protein)}g`, `${fmt1(result.perServing.protein)}g`],
                        ["脂質", `${fmt1(result.per100g.fat)}g`, `${fmt1(result.perServing.fat)}g`],
                        ["炭水化物", `${fmt1(result.per100g.carb)}g`, `${fmt1(result.perServing.carb)}g`],
                        ["食塩相当量", `${fmt1(result.per100g.salt)}g`, `${fmt1(result.perServing.salt)}g`],
                      ].map(([l, v1, v2]) => (
                        <tr key={l} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-1 text-gray-600 dark:text-gray-400">{l}</td>
                          <td className="py-1 text-right dark:text-white">{v1}</td>
                          <td className="py-1 text-right font-semibold dark:text-white">{v2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ この計算は目安です。実際の食品表示には公的試験機関での分析が推奨されます。食品表示法に基づく正確な表示は専門機関にご相談ください。
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 食品 栄養成分表示 計算機 | {productName}
        </div>
      </div>
    </div>
  );
}
