"use client";
import { useState, useMemo, useRef } from "react";

type Year = "2025" | "2026";

interface Dependent {
  id: number;
  relation: string;
  age: string;
  income: string;
  livesTog: boolean;
  disabled: boolean;
}

function calcKyuyo(income: number): number {
  if (income <= 1625000) return 550000;
  if (income <= 1800000) return Math.floor(income * 0.4) - 100000;
  if (income <= 3600000) return Math.floor(income * 0.3) + 80000;
  if (income <= 6600000) return Math.floor(income * 0.2) + 440000;
  return Math.min(Math.floor(income * 0.1) + 1100000, 1950000);
}

function calcDeduction(dep: Dependent, year: Year): { type: string; it: number; lt: number; eligible: boolean } {
  const age = parseInt(dep.age) || 0;
  const income = parseFloat(dep.income) || 0;
  if (age < 16) return { type: "16歳未満（控除なし）", it: 0, lt: 0, eligible: false };
  const threshold = year === "2026" ? 1230000 : 1030000;
  if (year === "2026" && age >= 19 && age <= 22 && income > 1230000 && income <= 1500000) {
    let special = 0;
    if (income <= 1330000) special = 630000;
    else if (income <= 1380000) special = 510000;
    else if (income <= 1430000) special = 390000;
    else if (income <= 1480000) special = 210000;
    else special = 110000;
    return { type: "特定親族特別控除（2026年新設）", it: special + (dep.disabled ? 270000 : 0), lt: 0, eligible: true };
  }
  if (income > threshold) return { type: "扶養控除対象外（年収超過）", it: 0, lt: 0, eligible: false };
  let type = "";
  let it = 0;
  let lt = 0;
  if (age >= 70) {
    type = dep.livesTog ? "老人扶養控除（同居）" : "老人扶養控除（別居）";
    it = dep.livesTog ? 580000 : 480000;
    lt = dep.livesTog ? 450000 : 380000;
  } else if (age >= 19 && age <= 22) {
    type = "特定扶養控除（19〜22歳）";
    it = 630000; lt = 450000;
  } else {
    type = "一般扶養控除（16〜18歳・23〜69歳）";
    it = 380000; lt = 330000;
  }
  if (dep.disabled) { it += 270000; type += " ＋ 障害者控除"; }
  return { type, it, lt, eligible: true };
}

function getHeadTaxRate(annualIncome: number): number {
  const net = Math.max(0, annualIncome - calcKyuyo(annualIncome));
  if (net <= 1950000) return 0.05;
  if (net <= 3300000) return 0.10;
  if (net <= 6950000) return 0.20;
  if (net <= 9000000) return 0.23;
  return 0.33;
}

const RELATIONS = ["子", "親", "祖父母", "兄弟姉妹", "その他"];

export default function FuyouKoujoClient() {
  const nextId = useRef(2);
  const [deps, setDeps] = useState<Dependent[]>([
    { id: 1, relation: "子", age: "20", income: "800000", livesTog: true, disabled: false },
  ]);
  const [headAnnual, setHeadAnnual] = useState("6000000");
  const [year, setYear] = useState<Year>("2026");

  const addDep = () => {
    setDeps(prev => [...prev, { id: nextId.current++, relation: "子", age: "18", income: "500000", livesTog: true, disabled: false }]);
  };
  const removeDep = (id: number) => setDeps(prev => prev.filter(d => d.id !== id));
  const updateDep = (id: number, updates: Partial<Dependent>) => {
    setDeps(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const result = useMemo(() => {
    const deductions = deps.map(d => ({ dep: d, calc: calcDeduction(d, year) }));
    const totalIT = deductions.reduce((s, r) => s + r.calc.it, 0);
    const totalLT = deductions.reduce((s, r) => s + r.calc.lt, 0);
    const headRate = getHeadTaxRate(parseFloat(headAnnual) || 0);
    const saving = Math.round(totalIT * headRate + totalLT * 0.10);
    const hasSpecial = deductions.some(r => r.calc.type.includes("特定親族特別控除"));
    return { deductions, totalIT, totalLT, headRate, saving, hasSpecial };
  }, [deps, headAnnual, year]);

  const fmt = (n: number) => n.toLocaleString();
  const fmtMan = (n: number) => (n / 10000).toFixed(0);
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">扶養控除 判定・計算ツール</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">2026年改正対応・特定親族特別控除（19〜22歳）含む</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">世帯主情報</h2>
                <div className="flex gap-2">
                  {(["2025", "2026"] as Year[]).map(y => (
                    <button key={y} onClick={() => setYear(y)}
                      className={"px-3 py-1 rounded-lg text-xs border transition-colors " + (year === y ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600")}>
                      {y}年
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯主の年収</label>
                <input type="number" value={headAnnual} onChange={e => setHeadAnnual(e.target.value)} className={inp} placeholder="6000000" />
                <p className="text-xs text-gray-400 mt-1">節税額の計算に使用します</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">扶養親族の入力</h2>
              {deps.map(dep => (
                <div key={dep.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <select value={dep.relation} onChange={e => updateDep(dep.id, { relation: e.target.value })}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white">
                      {RELATIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                    {deps.length > 1 && (
                      <button onClick={() => removeDep(dep.id)} className="text-danger hover:text-danger text-lg font-bold leading-none">×</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">年齢</label>
                      <input type="number" value={dep.age} onChange={e => updateDep(dep.id, { age: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">年収（給与・円）</label>
                      <input type="number" value={dep.income} onChange={e => updateDep(dep.id, { income: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <input type="checkbox" checked={dep.livesTog} onChange={e => updateDep(dep.id, { livesTog: e.target.checked })} className="w-3 h-3" />
                      同居
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <input type="checkbox" checked={dep.disabled} onChange={e => updateDep(dep.id, { disabled: e.target.checked })} className="w-3 h-3" />
                      障害あり
                    </label>
                  </div>
                </div>
              ))}
              {deps.length < 6 && (
                <button onClick={addDep}
                  className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-ai hover:text-ai transition-colors">
                  ＋ 扶養親族を追加
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">扶養控除 判定結果</h2>
              <div className="space-y-2">
                {result.deductions.map(({ dep, calc }) => (
                  <div key={dep.id} className={"rounded-lg p-3 text-sm " + (calc.eligible ? "bg-green-50 dark:bg-green-900/10" : "bg-gray-50 dark:bg-gray-700/30")}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{dep.relation}（{dep.age}歳）</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{calc.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400">所得税控除</div>
                        <div className={"font-bold " + (calc.it > 0 ? "text-green-700 dark:text-green-300" : "text-gray-400")}>{fmtMan(calc.it)}万円</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {result.hasSpecial && (
              <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 border border-kon dark:border-kon text-xs text-kon dark:text-gray-300">
                <p className="font-semibold mb-1">2026年新設: 特定親族特別控除</p>
                <p>19〜22歳の扶養親族で年収123万超〜150万円以下の場合、段階的に控除が適用されます。従来は年収103万超で控除ゼロでしたが、2026年改正により緩和されました。</p>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">合計</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">所得税控除合計</div>
                  <div className="font-bold text-gray-800 dark:text-white">{fmtMan(result.totalIT)}万円</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">住民税控除合計</div>
                  <div className="font-bold text-gray-800 dark:text-white">{fmtMan(result.totalLT)}万円</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">世帯主の税率</div>
                  <div className="font-bold text-gray-800 dark:text-white">{Math.round(result.headRate * 100)}%</div>
                </div>
                <div className="bg-gray-50 dark:bg-kon/20 rounded-lg p-3">
                  <div className="text-xs text-kon dark:text-gray-300">年間節税額（目安）</div>
                  <div className="font-bold text-kon dark:text-gray-300 text-lg">{fmt(result.saving)}円</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">年末調整での記入</p>
              <p>「給与所得者の扶養控除等（異動）申告書」に扶養親族の氏名・続柄・年齢・所得の見積額を記入してください。配偶者は「配偶者控除等申告書」を使用します。</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-semibold mb-1">⚠️ ご注意</p>
              <p>給与収入以外の所得がある場合は実際の合計所得で判定してください。本ツールは目安計算です。</p>
            </div>
          </div>
        </div>
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 扶養控除 判定・計算ツール
        </div>
      </div>
    </div>
  );
}
