"use client";
import { useState, useMemo } from "react";

type Job = "emp_no_corp" | "emp_corp" | "civil" | "home" | "self";

interface JobInfo { key: Job; label: string; limit: number }
const JOBS: JobInfo[] = [
  { key: "emp_no_corp", label: "会社員（企業年金なし）", limit: 23000 },
  { key: "emp_corp", label: "会社員（企業年金あり）", limit: 12000 },
  { key: "civil", label: "公務員", limit: 12000 },
  { key: "home", label: "専業主婦(夫)", limit: 23000 },
  { key: "self", label: "自営業・フリーランス", limit: 68000 },
];

function compoundFV(monthly: number, annualRate: number, years: number): number {
  if (annualRate <= 0) return monthly * 12 * years;
  const r = annualRate / 12;
  return Math.round(monthly * ((Math.pow(1 + r, years * 12) - 1) / r));
}

export default function IDeCoNisaClient() {
  const [useIdeco, setUseIdeco] = useState(true);
  const [job, setJob] = useState<Job>("emp_no_corp");
  const [idecoMonthlyStr, setIdecoMonthlyStr] = useState("23000");
  const [taxRateStr, setTaxRateStr] = useState("20");
  const [idecoReturnStr, setIdecoReturnStr] = useState("3");
  const [idecoYearsStr, setIdecoYearsStr] = useState("20");

  const [useNisa, setUseNisa] = useState(true);
  const [nisaMonthlyStr, setNisaMonthlyStr] = useState("30000");
  const [nisaReturnStr, setNisaReturnStr] = useState("5");
  const [nisaYearsStr, setNisaYearsStr] = useState("20");

  const calc = useMemo(() => {
    const taxRate = (parseInt(taxRateStr) || 20) / 100;
    const jobInfo = JOBS.find(j => j.key === job)!;

    const idecoM = Math.min(parseInt(idecoMonthlyStr) || 0, jobInfo.limit);
    const idecoY = parseInt(idecoYearsStr) || 20;
    const idecoR = (parseFloat(idecoReturnStr) || 3) / 100;
    const idecoAnnual = idecoM * 12;
    const idecoTaxSavingPerYear = Math.round(idecoAnnual * (taxRate + 0.10));
    const idecoTotalTaxSaving = idecoTaxSavingPerYear * idecoY;
    const idecoPrincipal = idecoAnnual * idecoY;
    const idecoFV = compoundFV(idecoM, idecoR, idecoY);
    const idecoGain = idecoFV - idecoPrincipal;

    const nisaM = Math.min(parseInt(nisaMonthlyStr) || 0, 100000);
    const nisaY = parseInt(nisaYearsStr) || 20;
    const nisaR = (parseFloat(nisaReturnStr) || 5) / 100;
    const nisaPrincipal = nisaM * 12 * nisaY;
    const nisaFV = compoundFV(nisaM, nisaR, nisaY);
    const nisaGain = nisaFV - nisaPrincipal;
    const nisaTaxBenefit = Math.round(nisaGain * 0.20315);

    const totalBenefit = (useIdeco ? idecoTotalTaxSaving : 0) + (useNisa ? nisaTaxBenefit : 0);
    const totalFV = (useIdeco ? idecoFV : 0) + (useNisa ? nisaFV : 0);
    const totalPrincipal = (useIdeco ? idecoPrincipal : 0) + (useNisa ? nisaPrincipal : 0);

    return {
      jobLimit: jobInfo.limit, idecoM, idecoAnnual, idecoTaxSavingPerYear,
      idecoTotalTaxSaving, idecoPrincipal, idecoFV, idecoGain,
      nisaM, nisaPrincipal, nisaFV, nisaGain, nisaTaxBenefit,
      totalBenefit, totalFV, totalPrincipal,
    };
  }, [useIdeco, job, idecoMonthlyStr, taxRateStr, idecoReturnStr, idecoYearsStr,
      useNisa, nisaMonthlyStr, nisaReturnStr, nisaYearsStr]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const fmtM = (n: number) => `約${Math.round(n / 10000).toLocaleString()}万円`;
  const fmtY = (n: number) => `${Math.round(n).toLocaleString()}円/年`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">iDeCo・NISA 節税効果計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">【2025年最新】金融機関バイアスなし。実際の節税・資産形成効果を中立的に計算</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="useIdeco" checked={useIdeco} onChange={e => setUseIdeco(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                <label htmlFor="useIdeco" className="font-semibold text-gray-700 dark:text-gray-300">iDeCo（個人型確定拠出年金）</label>
              </div>
              {useIdeco && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">職業</label>
                    <select value={job} onChange={e => setJob(e.target.value as Job)} className={inp}>
                      {JOBS.map(j => <option key={j.key} value={j.key}>{j.label}（上限 {j.limit.toLocaleString()}円/月）</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">月々の掛金（上限 {calc.jobLimit.toLocaleString()}円）</label>
                    <input type="number" value={idecoMonthlyStr} onChange={e => setIdecoMonthlyStr(e.target.value)} max={calc.jobLimit} className={inp} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">所得税率</label>
                    <select value={taxRateStr} onChange={e => setTaxRateStr(e.target.value)} className={inp}>
                      <option value="5">5%（年収〜195万円）</option>
                      <option value="10">10%（年収195〜330万円）</option>
                      <option value="20">20%（年収330〜695万円）</option>
                      <option value="23">23%（年収695〜900万円）</option>
                      <option value="33">33%（年収900〜1800万円）</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">運用利回り（%/年）</label>
                      <input type="number" value={idecoReturnStr} step="0.1" onChange={e => setIdecoReturnStr(e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">運用期間（年）</label>
                      <input type="number" value={idecoYearsStr} onChange={e => setIdecoYearsStr(e.target.value)} className={inp} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="useNisa" checked={useNisa} onChange={e => setUseNisa(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                <label htmlFor="useNisa" className="font-semibold text-gray-700 dark:text-gray-300">NISA（非課税投資）</label>
              </div>
              {useNisa && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">月々の積立額（つみたて投資枠: 上限10万円/月）</label>
                    <input type="number" value={nisaMonthlyStr} onChange={e => setNisaMonthlyStr(e.target.value)} max={100000} className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">運用利回り（%/年）</label>
                      <input type="number" value={nisaReturnStr} step="0.1" onChange={e => setNisaReturnStr(e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">運用期間（年）</label>
                      <input type="number" value={nisaYearsStr} onChange={e => setNisaYearsStr(e.target.value)} className={inp} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {useIdeco && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">iDeCo 効果</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">年間節税額（所得税＋住民税）</span><span className="font-semibold text-green-600 dark:text-green-400">+{fmtY(calc.idecoTaxSavingPerYear)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">期間合計節税額</span><span className="font-semibold text-green-600 dark:text-green-400">+{fmtM(calc.idecoTotalTaxSaving)}</span></div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-1">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">積立元本</span><span className="dark:text-white">{fmtM(calc.idecoPrincipal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">運用後残高（概算）</span><span className="font-bold text-lg text-gray-800 dark:text-white">{fmtM(calc.idecoFV)}</span></div>
                    <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400"><span>うち運用益</span><span>+{fmtM(calc.idecoGain)}</span></div>
                  </div>
                </div>
              </div>
            )}

            {useNisa && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">NISA 効果</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">非課税メリット（運用益への課税免除）</span><span className="font-semibold text-green-600 dark:text-green-400">+{fmtM(calc.nisaTaxBenefit)}</span></div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-1">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">積立元本</span><span className="dark:text-white">{fmtM(calc.nisaPrincipal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">運用後残高（概算）</span><span className="font-bold text-lg text-gray-800 dark:text-white">{fmtM(calc.nisaFV)}</span></div>
                    <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400"><span>うち運用益</span><span>+{fmtM(calc.nisaGain)}</span></div>
                  </div>
                </div>
              </div>
            )}

            {(useIdeco || useNisa) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
                <h2 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">iDeCo + NISA 合計効果</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-blue-700 dark:text-blue-400">積立元本合計</span><span className="font-semibold dark:text-white">{fmtM(calc.totalPrincipal)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-blue-700 dark:text-blue-400">運用後総資産（概算）</span><span className="font-bold text-xl text-blue-800 dark:text-blue-300">{fmtM(calc.totalFV)}</span></div>
                  <div className="flex justify-between border-t border-blue-200 dark:border-blue-800 pt-2"><span className="font-semibold text-blue-700 dark:text-blue-400">節税・非課税メリット合計</span><span className="font-bold text-green-600 dark:text-green-400">+{fmtM(calc.totalBenefit)}</span></div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">通常の課税口座と比べて約{fmtM(calc.totalBenefit)}多く手元に残ります</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <p className="font-semibold">⚠️ ご注意</p>
          <p>iDeCoは60歳まで原則引き出し不可です。運用は元本割れリスクがあります。利回りは将来を保証しません。受取時は退職所得控除または公的年金等控除が適用されます（税額が発生する場合あり）。本計算は概算です。</p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | iDeCo・NISA節税効果計算機
        </div>
      </div>
    </div>
  );
}
