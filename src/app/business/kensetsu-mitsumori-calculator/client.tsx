"use client";
import { useState, useMemo, useRef } from "react";

interface WorkType {
  label: string;
  category: string;
  unitMin: number;
  unitMax: number;
  unit: string;
  lossRate: number;
  wasteMin: number;
  wasteMax: number;
  wasteUnit: string;
  note?: string;
}

const WORK_TYPES: WorkType[] = [
  { label: "フローリング張替え", category: "床工事", unitMin: 4000, unitMax: 8000, unit: "㎡", lossRate: 1.10, wasteMin: 500, wasteMax: 500, wasteUnit: "㎡" },
  { label: "畳表替え", category: "床工事", unitMin: 5000, unitMax: 12000, unit: "枚", lossRate: 1.0, wasteMin: 0, wasteMax: 0, wasteUnit: "枚", note: "1枚≒1.62㎡" },
  { label: "クッションフロア", category: "床工事", unitMin: 1500, unitMax: 3000, unit: "㎡", lossRate: 1.10, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "タイル張り（浴室等）", category: "床工事", unitMin: 3000, unitMax: 6000, unit: "㎡", lossRate: 1.15, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "クロス張替え", category: "壁工事", unitMin: 1000, unitMax: 1500, unit: "㎡", lossRate: 1.10, wasteMin: 5000, wasteMax: 5000, wasteUnit: "一式", note: "糊・道具代含む" },
  { label: "外壁塗装", category: "壁工事", unitMin: 800, unitMax: 2000, unit: "㎡", lossRate: 1.30, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "タイル貼り（内壁）", category: "壁工事", unitMin: 2500, unitMax: 5000, unit: "㎡", lossRate: 1.15, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "スレート屋根塗装", category: "屋根工事", unitMin: 600, unitMax: 1500, unit: "㎡", lossRate: 1.10, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "防水工事（ウレタン）", category: "屋根工事", unitMin: 2000, unitMax: 4000, unit: "㎡", lossRate: 1.10, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "断熱材施工", category: "その他", unitMin: 1500, unitMax: 3000, unit: "㎡", lossRate: 1.10, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
  { label: "石膏ボード（下地）", category: "その他", unitMin: 600, unitMax: 900, unit: "㎡", lossRate: 1.10, wasteMin: 0, wasteMax: 0, wasteUnit: "㎡" },
];

const CATEGORIES = [...new Set(WORK_TYPES.map(w => w.category))];

interface WorkItem {
  id: number;
  workTypeLabel: string;
  area: string;
}

export default function KensetsuMitsumoriClient() {
  const nextIdRef = useRef(2);
  const [items, setItems] = useState<WorkItem[]>([{ id: 1, workTypeLabel: WORK_TYPES[0].label, area: "" }]);

  const addItem = () => {
    const id = nextIdRef.current++;
    setItems(prev => [...prev, { id, workTypeLabel: WORK_TYPES[0].label, area: "" }]);
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(it => it.id !== id));

  const updateItem = (id: number, field: keyof WorkItem, value: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));

  const results = useMemo(() => items.map(item => {
    const wt = WORK_TYPES.find(w => w.label === item.workTypeLabel) || WORK_TYPES[0];
    const area = parseFloat(item.area) || 0;
    const materialArea = area * wt.lossRate;
    const matMin = Math.round(materialArea * wt.unitMin);
    const matMax = Math.round(materialArea * wt.unitMax);
    const matMid = Math.round((matMin + matMax) / 2);
    const wasteMin = wt.wasteUnit === "一式" ? wt.wasteMin : Math.round(area * wt.wasteMin);
    const wasteMax = wt.wasteUnit === "一式" ? wt.wasteMax : Math.round(area * wt.wasteMax);
    const wasteMid = Math.round((wasteMin + wasteMax) / 2);
    return { ...item, wt, area, matMin, matMax, matMid, wasteMid };
  }), [items]);

  const totalMat = results.reduce((s, r) => s + r.matMid, 0);
  const totalWaste = results.reduce((s, r) => s + r.wasteMid, 0);
  const totalAll = totalMat + totalWaste;
  const laborEstimate = Math.round(totalAll * 2.5);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">建設・内装工事 材料費見積もり計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">工事種別・面積から材料費の目安を計算。複数工事の合計も一括算出。</p>

        <div className="space-y-3 mb-4">
          {items.map((item, idx) => {
            const r = results[idx];
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">工事内容</label>
                    <select value={item.workTypeLabel} onChange={e => updateItem(item.id, "workTypeLabel", e.target.value)} className={`${inp} w-full`}>
                      {CATEGORIES.map(cat => (
                        <optgroup key={cat} label={`── ${cat}`}>
                          {WORK_TYPES.filter(w => w.category === cat).map(w => (
                            <option key={w.label} value={w.label}>{w.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      面積（{r.wt.unit}）{r.wt.note ? <span className="text-blue-500"> {r.wt.note}</span> : ""}
                    </label>
                    <input type="number" value={item.area} onChange={e => updateItem(item.id, "area", e.target.value)} placeholder="0" className={`${inp} w-full`} />
                  </div>
                  {r.area > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 min-w-48">
                      材料費: <span className="font-semibold text-gray-800 dark:text-white">¥{fmt(r.matMin)}〜¥{fmt(r.matMax)}</span>
                      <span className="text-xs ml-1">(目安¥{fmt(r.matMid)})</span>
                    </div>
                  )}
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded border border-red-200 dark:border-red-800">削除</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={addItem} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl hover:border-blue-400 hover:text-blue-500 text-sm transition-colors mb-6">
          ＋ 工事項目を追加
        </button>

        {totalAll > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300">見積もり集計</h2>
            <div className="space-y-2 text-sm">
              {results.filter(r => r.area > 0).map(r => (
                <div key={r.id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{r.wt.label}（{r.area}{r.wt.unit}）</span>
                  <span className="dark:text-white">¥{fmt(r.matMid)}</span>
                </div>
              ))}
              {totalWaste > 0 && (
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>廃材処分費・諸経費合計</span>
                  <span>¥{fmt(totalWaste)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">材料費合計（目安）</span>
                  <span className="font-bold text-xl text-gray-800 dark:text-white">¥{fmt(totalAll)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
              <p className="text-blue-700 dark:text-blue-300 text-xs mb-1">⚠️ 職人工賃は含まれていません。工賃は材料費の1〜3倍が目安です。</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 dark:text-blue-300 font-semibold">工賃込み概算（材料費×2.5倍）</span>
                <span className="font-bold text-lg text-blue-700 dark:text-blue-300">¥{fmt(laborEstimate)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-300">
              複数の業者から見積もりを取ることをお勧めします。実際の費用は工事条件・地域・施工時期により異なります。
            </div>
          </div>
        )}

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 建設・内装工事 材料費見積もり計算機
        </div>
      </div>
    </div>
  );
}
