"use client";
import { useState, useMemo } from "react";

type FamilyType = "single" | "spouse" | "spouse_child1" | "spouse_child2";

function calcIncomeTax(income: number): number {
  if (income <= 0) return 0;
  if (income <= 195) return income * 0.05;
  if (income <= 330) return income * 0.10 - 9.75;
  if (income <= 695) return income * 0.20 - 42.75;
  if (income <= 900) return income * 0.23 - 63.6;
  if (income <= 1800) return income * 0.33 - 153.6;
  if (income <= 4000) return income * 0.40 - 279.6;
  return income * 0.45 - 479.6;
}

function calcCorpTax(income: number): number {
  if (income <= 0) return 0;
  const base = Math.min(income, 800) * 0.15 + Math.max(0, income - 800) * 0.232;
  return base * 1.35; // 実効税率: 法人税+法人住民税+事業税≒34%
}

export default function HojinkaClient() {
  const [revenueStr, setRevenueStr] = useState("1200");
  const [expensesStr, setExpensesStr] = useState("300");
  const [familyType, setFamilyType] = useState<FamilyType>("spouse");
  const [targetTakeHomeStr, setTargetTakeHomeStr] = useState("600");
  const [hasSpouseDir, setHasSpouseDir] = useState(false);
  const [spouseSalaryStr, setSpouseSalaryStr] = useState("80");

  const calc = useMemo(() => {
    const revenue = parseFloat(revenueStr) || 0;
    const expenses = parseFloat(expensesStr) || 0;
    const target = parseFloat(targetTakeHomeStr) || 0;
    const spouseSalary = hasSpouseDir ? (parseFloat(spouseSalaryStr) || 0) : 0;

    const dependentDed = familyType === "spouse" ? 76 : familyType === "spouse_child1" ? 114 : familyType === "spouse_child2" ? 152 : 0;
    const basicDed = 48;

    // ── 個人事業主 ──
    const soloIncome = revenue - expenses;
    const aoiro = Math.min(soloIncome, 65);
    const soloTaxable = Math.max(0, soloIncome - aoiro - basicDed - dependentDed);
    const soloIT = Math.max(0, calcIncomeTax(soloTaxable));
    const soloRT = soloTaxable * 0.10;
    const soloBizTax = Math.max(0, (soloIncome - 290) * 0.05);
    const soloNHI = soloIncome * 0.09 + 6;
    const soloNenkin = 20.4;
    const soloTax = soloIT + soloRT + soloBizTax + soloNHI + soloNenkin;
    const soloNet = soloIncome - soloTax;

    // ── 法人 ──
    const dirSalary = Math.min(Math.round(target / 0.72), revenue * 0.9);
    const corpIncome = Math.max(0, revenue - expenses - dirSalary - spouseSalary);
    const corpTax = calcCorpTax(corpIncome);
    const corpSocialIns = dirSalary * 0.143;

    const dirGiveDed = Math.min(Math.max(0, dirSalary * 0.30 - 18), 195);
    const dirTaxable = Math.max(0, dirSalary - dirGiveDed - basicDed - dependentDed);
    const dirIT = Math.max(0, calcIncomeTax(dirTaxable));
    const dirRT = dirTaxable * 0.10;
    const dirSocialInsPersonal = dirSalary * 0.143;
    const dirNet = dirSalary - dirSocialInsPersonal - dirIT - dirRT;

    const corpTotalBurden = corpTax + corpSocialIns + dirSocialInsPersonal + dirIT + dirRT;
    const taxDiff = soloTax - corpTotalBurden;
    const shouldIncorporate = taxDiff > 30;

    return {
      soloIncome, soloIT, soloRT, soloBizTax, soloNHI, soloNenkin, soloTax, soloNet,
      dirSalary, corpIncome, corpTax, corpSocialIns, dirNet, corpTotalBurden, taxDiff, shouldIncorporate,
    };
  }, [revenueStr, expensesStr, familyType, targetTakeHomeStr, hasSpouseDir, spouseSalaryStr]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const fmtM = (n: number) => `${Math.round(n).toLocaleString()}万円`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">個人事業主 法人化 節税シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">年収・経費から個人事業と法人の税負担を比較。いくら稼いだら法人化すべきか</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">事業の設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">事業年収（売上）（万円）</label>
                <input type="number" value={revenueStr} onChange={e => setRevenueStr(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">事業経費（万円）</label>
                <input type="number" value={expensesStr} onChange={e => setExpensesStr(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">家族構成</label>
                <select value={familyType} onChange={e => setFamilyType(e.target.value as FamilyType)} className={inp}>
                  <option value="single">独身</option>
                  <option value="spouse">配偶者あり</option>
                  <option value="spouse_child1">配偶者＋子1人</option>
                  <option value="spouse_child2">配偶者＋子2人</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">希望する生活費・手取り（万円/年）</label>
                <input type="number" value={targetTakeHomeStr} onChange={e => setTargetTakeHomeStr(e.target.value)} className={inp} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasSpouseDir} onChange={e => setHasSpouseDir(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">配偶者に役員報酬を支払う（所得分散）</span>
              </label>
              {hasSpouseDir && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">配偶者役員報酬（万円/年）</label>
                  <input type="number" value={spouseSalaryStr} onChange={e => setSpouseSalaryStr(e.target.value)} className={inp} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">個人事業主 vs 法人 比較</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">項目</th>
                    <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-medium">個人事業</th>
                    <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-medium">法人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-600 dark:text-gray-400">所得税</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.soloIT)}</td>
                    <td className="py-1.5 text-right text-gray-400">（役員報酬分）</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-600 dark:text-gray-400">住民税</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.soloRT)}</td>
                    <td className="py-1.5 text-right text-gray-400">—</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-600 dark:text-gray-400">社会保険・国民年金</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.soloNHI + calc.soloNenkin)}</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.corpSocialIns)}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-600 dark:text-gray-400">個人事業税</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.soloBizTax)}</td>
                    <td className="py-1.5 text-right text-gray-400">—</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-600 dark:text-gray-400">法人税等（実効税率）</td>
                    <td className="py-1.5 text-right text-gray-400">—</td>
                    <td className="py-1.5 text-right dark:text-white">{fmtM(calc.corpTax)}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 font-semibold">
                    <td className="py-2 text-gray-700 dark:text-gray-300">税負担合計</td>
                    <td className="py-2 text-right text-danger dark:text-danger">{fmtM(calc.soloTax)}</td>
                    <td className="py-2 text-right text-kon dark:text-gray-300">{fmtM(calc.corpTotalBurden)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-700 dark:text-gray-300 font-semibold">手取り（概算）</td>
                    <td className="py-2 text-right font-bold text-gray-800 dark:text-white">{fmtM(calc.soloNet)}</td>
                    <td className="py-2 text-right font-bold text-gray-800 dark:text-white">{fmtM(calc.dirNet)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`rounded-xl p-5 border-2 ${calc.shouldIncorporate ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600" : "bg-gray-50 dark:bg-gray-700/40 border-gray-300 dark:border-gray-600"}`}>
              <p className="font-bold text-lg mb-1 text-gray-800 dark:text-white">
                {calc.shouldIncorporate ? `💡 年間 ${fmtM(calc.taxDiff)} の節税効果` : "💡 法人化の節税効果は限定的"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {calc.shouldIncorporate
                  ? "法人化すると大きな節税が見込めます。"
                  : "現在の売上規模では法人設立コスト・維持費に見合わない可能性があります。"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">目安: 事業所得800万円以上で法人化を本格検討</p>
            </div>

            <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <summary className="p-4 cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">法人化のメリット・デメリット ▼</summary>
              <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-semibold text-green-600 dark:text-green-400">メリット</p>
                <p>・所得分散（配偶者・家族への役員報酬）で節税</p>
                <p>・法人税率（〜34%実効）は個人最高税率（55%）より低い</p>
                <p>・経費の範囲が広がる（法人カード・出張費等）</p>
                <p className="font-semibold text-danger mt-2">デメリット・注意点</p>
                <p>・設立コスト: 合同会社約6万円〜 / 株式会社約20万円〜</p>
                <p>・役員報酬は原則年1回しか変更不可</p>
                <p>・社会保険強制加入（コスト増加）</p>
                <p>・税理士費用・決算申告コストが増加</p>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
          <p className="font-semibold">⚠️ ご注意</p>
          <p>本シミュレーターは概算です。実際の税額は経費内容・家族状況・社会保険等により異なります。法人化の最終判断は税理士・公認会計士にご相談ください。</p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 個人事業主 法人化節税シミュレーター
        </div>
      </div>
    </div>
  );
}
