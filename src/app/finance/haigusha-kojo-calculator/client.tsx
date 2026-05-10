"use client";
import { useState, useMemo } from "react";

type Year = "2025" | "2026";

function calcKyuyo(income: number): number {
  if (income <= 1625000) return 550000;
  if (income <= 1800000) return Math.floor(income * 0.4) - 100000;
  if (income <= 3600000) return Math.floor(income * 0.3) + 80000;
  if (income <= 6600000) return Math.floor(income * 0.2) + 440000;
  if (income <= 8500000) return Math.floor(income * 0.1) + 1100000;
  return 1950000;
}

function calcNet(annual: number): number {
  return Math.max(0, annual - calcKyuyo(annual));
}

function getFactor(headNet: number): number {
  if (headNet <= 9000000) return 1.0;
  if (headNet <= 9500000) return 0.5;
  if (headNet <= 10000000) return 0.25;
  return 0;
}

function getDeductIT(spouseAnnual: number, headNet: number, year: Year, elderly: boolean): { type: string; amount: number } {
  const factor = getFactor(headNet);
  if (factor === 0) return { type: "対象外（世帯主所得超過）", amount: 0 };
  const threshold = year === "2026" ? 1360000 : 1230000;
  if (spouseAnnual <= threshold) {
    let base = elderly
      ? (factor === 1.0 ? 480000 : factor === 0.5 ? 320000 : 160000)
      : (factor === 1.0 ? 380000 : factor === 0.5 ? 260000 : 130000);
    return { type: "配偶者控除", amount: base };
  }
  const specialMax = year === "2026" ? 2016000 : 2010000;
  if (spouseAnnual > specialMax) return { type: "対象外", amount: 0 };
  let a = 0;
  if (year === "2026") {
    if (spouseAnnual <= 1690000) a = 380000;
    else if (spouseAnnual <= 1752000) a = 360000;
    else if (spouseAnnual <= 1812000) a = 310000;
    else if (spouseAnnual <= 1872000) a = 260000;
    else if (spouseAnnual <= 1932000) a = 210000;
    else if (spouseAnnual <= 1972000) a = 160000;
    else if (spouseAnnual <= 1992000) a = 110000;
    else a = 60000;
  } else {
    if (spouseAnnual <= 1500000) a = 380000;
    else if (spouseAnnual <= 1550000) a = 360000;
    else if (spouseAnnual <= 1600000) a = 310000;
    else if (spouseAnnual <= 1667000) a = 260000;
    else if (spouseAnnual <= 1750000) a = 210000;
    else if (spouseAnnual <= 1833000) a = 160000;
    else if (spouseAnnual <= 1900000) a = 110000;
    else if (spouseAnnual <= 1950000) a = 60000;
    else a = 30000;
  }
  return { type: "配偶者特別控除", amount: Math.floor(a * factor) };
}

function getDeductLT(spouseAnnual: number, headNet: number, year: Year): number {
  const factor = getFactor(headNet);
  if (factor === 0) return 0;
  const threshold = year === "2026" ? 1360000 : 1230000;
  if (spouseAnnual <= threshold) {
    return factor === 1.0 ? 330000 : factor === 0.5 ? 220000 : 110000;
  }
  const specialMax = year === "2026" ? 2016000 : 2010000;
  if (spouseAnnual > specialMax) return 0;
  let a = 0;
  if (year === "2026") {
    if (spouseAnnual <= 1690000) a = 330000;
    else if (spouseAnnual <= 1752000) a = 310000;
    else if (spouseAnnual <= 1812000) a = 260000;
    else if (spouseAnnual <= 1872000) a = 210000;
    else if (spouseAnnual <= 1932000) a = 160000;
    else if (spouseAnnual <= 1972000) a = 110000;
    else if (spouseAnnual <= 1992000) a = 80000;
    else a = 40000;
  } else {
    if (spouseAnnual <= 1500000) a = 330000;
    else if (spouseAnnual <= 1550000) a = 310000;
    else if (spouseAnnual <= 1600000) a = 260000;
    else if (spouseAnnual <= 1667000) a = 210000;
    else if (spouseAnnual <= 1750000) a = 160000;
    else if (spouseAnnual <= 1833000) a = 110000;
    else if (spouseAnnual <= 1900000) a = 80000;
    else if (spouseAnnual <= 1950000) a = 40000;
    else a = 20000;
  }
  return Math.floor(a * factor);
}

function getHeadRate(headNet: number): number {
  if (headNet <= 1950000) return 0.05;
  if (headNet <= 3300000) return 0.10;
  if (headNet <= 6950000) return 0.20;
  if (headNet <= 9000000) return 0.23;
  if (headNet <= 18000000) return 0.33;
  return 0.40;
}

const HEAD_OPTIONS = [
  { label: "〜300万円", value: 3000000 },
  { label: "〜400万円", value: 4000000 },
  { label: "〜600万円", value: 6000000 },
  { label: "〜800万円", value: 8000000 },
  { label: "〜1,000万円", value: 10000000 },
  { label: "〜1,200万円", value: 12000000 },
  { label: "1,200万円超", value: 15000000 },
];

const PREVIEW_2026 = [1000000, 1360000, 1500000, 1690000, 1752000, 1872000, 1932000, 2016000, 2020000];
const PREVIEW_2025 = [1000000, 1230000, 1500000, 1550000, 1667000, 1750000, 1950000, 2010000, 2020000];

export default function HaigushaKojoClient() {
  const [spouseAnnual, setSpouseAnnual] = useState(1200000);
  const [headAnnual, setHeadAnnual] = useState(6000000);
  const [elderly, setElderly] = useState(false);
  const [year, setYear] = useState<Year>("2026");

  const headNet = useMemo(() => calcNet(headAnnual), [headAnnual]);
  const headRate = useMemo(() => getHeadRate(headNet), [headNet]);

  const result = useMemo(() => {
    const it = getDeductIT(spouseAnnual, headNet, year, elderly);
    const lt = getDeductLT(spouseAnnual, headNet, year);
    const saving = Math.round(it.amount * headRate + lt * 0.10);
    return { it, lt, saving };
  }, [spouseAnnual, headNet, elderly, year, headRate]);

  const preview = useMemo(() => {
    const incomes = year === "2026" ? PREVIEW_2026 : PREVIEW_2025;
    return incomes.map(v => {
      const it = getDeductIT(v, headNet, year, elderly);
      const lt = getDeductLT(v, headNet, year);
      const saving = Math.round(it.amount * headRate + lt * 0.10);
      return { v, it, lt, saving };
    });
  }, [headNet, elderly, year, headRate]);

  const fmt = (n: number) => n.toLocaleString();
  const fmtMan = (n: number) => (n / 10000).toFixed(0);
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const positive = result.it.amount > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">配偶者控除・配偶者特別控除 計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">2026年改正（136万円・178万円の壁）対応</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">入力</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">適用年</label>
                <div className="flex gap-2">
                  {(["2025", "2026"] as Year[]).map(y => (
                    <button key={y} onClick={() => setYear(y)}
                      className={"flex-1 py-2 rounded-lg text-sm font-medium border transition-colors " + (year === y ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600")}>
                      {y}年
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  配偶者の年収: <span className="font-bold text-gray-800 dark:text-white">{fmt(spouseAnnual)}円</span>
                </label>
                <input type="range" min={0} max={2500000} step={10000} value={spouseAnnual}
                  onChange={e => setSpouseAnnual(Number(e.target.value))} className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0円</span><span>250万円</span></div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1000000, 1230000, 1360000, 1500000, 1700000, 2020000].map(v => (
                    <button key={v} onClick={() => setSpouseAnnual(v)}
                      className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:border-ai hover:text-ai dark:text-gray-400">
                      {Math.round(v / 10000)}万
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯主の年収</label>
                <select value={headAnnual} onChange={e => setHeadAnnual(Number(e.target.value))} className={inp}>
                  {HEAD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="elderly" checked={elderly} onChange={e => setElderly(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="elderly" className="text-sm text-gray-600 dark:text-gray-400">配偶者が70歳以上（老人控除対象配偶者）</label>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 text-xs text-kon dark:text-gray-300 space-y-1">
              <p className="font-semibold">2025年と2026年の主な違い</p>
              <p>・配偶者控除の上限: 2025年 123万円 → 2026年 136万円</p>
              <p>・所得税の非課税ライン: 2025年 103万円 → 2026年 178万円</p>
              <p>・住民税の非課税ライン: 2025年 100万円 → 2026年 110万円</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className={"rounded-xl p-5 border " + (positive ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" : "bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600")}>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{result.it.type}</p>
              <p className={"text-3xl font-bold mb-4 " + (positive ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400")}>
                {fmtMan(result.it.amount)}万円
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">所得税控除額</div>
                  <div className="font-bold text-gray-800 dark:text-white">{fmtMan(result.it.amount)}万円</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">住民税控除額</div>
                  <div className="font-bold text-gray-800 dark:text-white">{fmtMan(result.lt)}万円</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">世帯主の適用税率</div>
                  <div className="font-bold text-gray-800 dark:text-white">{Math.round(headRate * 100)}%</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">年間節税額（目安）</div>
                  <div className="font-bold text-kon dark:text-gray-300">{fmt(result.saving)}円</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">配偶者年収別 控除早見表（{year}年）</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left pb-2 pr-2">配偶者年収</th>
                      <th className="text-right pb-2 pr-2">控除種別</th>
                      <th className="text-right pb-2 pr-2">所得税控除</th>
                      <th className="text-right pb-2">節税目安</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-1 pr-2 text-gray-700 dark:text-gray-300">{Math.round(row.v / 10000)}万円</td>
                        <td className="py-1 pr-2 text-right text-gray-500 dark:text-gray-400">
                          {row.it.type.startsWith("対象外") ? "対象外" : row.it.type}
                        </td>
                        <td className="py-1 pr-2 text-right font-medium">{fmtMan(row.it.amount)}万円</td>
                        <td className="py-1 text-right text-kon dark:text-gray-300">{fmt(row.saving)}円</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">年末調整での記入</p>
              <p>「給与所得者の配偶者控除等申告書」に配偶者の氏名・収入・所得を記入して提出してください。配偶者特別控除の場合も同じ申告書を使用します。</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-semibold mb-1">⚠️ ご注意</p>
              <p>本ツールは目安計算です。実際の控除額は確定申告・年末調整で正確に計算してください。</p>
            </div>
          </div>
        </div>
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 配偶者控除・配偶者特別控除 計算機
        </div>
      </div>
    </div>
  );
}
