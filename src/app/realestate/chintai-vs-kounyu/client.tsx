"use client";
import { useState, useMemo } from "react";

const PERIODS = [35, 50] as const;
type Period = typeof PERIODS[number];

export default function ChintaiVsKounyuClient() {
  // 賃貸
  const [rent, setRent] = useState("80000");
  const [rentMgmt, setRentMgmt] = useState("5000");
  const [renewal, setRenewal] = useState("80000");
  const [rentRise, setRentRise] = useState("0.5");
  const [moves, setMoves] = useState("1");
  const [moveCost, setMoveCost] = useState("400000");

  // 購入
  const [price, setPrice] = useState("40000000");
  const [downPayment, setDownPayment] = useState("4000000");
  const [rate, setRate] = useState("0.6");
  const [loanYears, setLoanYears] = useState("35");
  const [hoaFee, setHoaFee] = useState("20000");
  const [propTax, setPropTax] = useState("");
  const [repairFund, setRepairFund] = useState("0");
  const [hasDeduction, setHasDeduction] = useState(true);
  const [sellYear, setSellYear] = useState("none");
  const [sellRate, setSellRate] = useState("70");

  // 共通
  const [period, setPeriod] = useState<Period>(35);

  const result = useMemo(() => {
    const priceNum = parseFloat(price) || 0;
    const downNum = parseFloat(downPayment) || 0;
    const rateNum = (parseFloat(rate) || 0) / 100 / 12;
    const loanYearsNum = parseFloat(loanYears) || 35;
    const loanMonths = loanYearsNum * 12;
    const loanAmt = priceNum - downNum;
    const rentNum = parseFloat(rent) || 0;
    const rentMgmtNum = parseFloat(rentMgmt) || 0;
    const renewalNum = parseFloat(renewal) || 0;
    const rentRiseNum = (parseFloat(rentRise) || 0) / 100;
    const movesNum = parseInt(moves) || 0;
    const moveCostNum = parseFloat(moveCost) || 0;
    const hoaNum = parseFloat(hoaFee) || 0;
    const propTaxNum = parseFloat(propTax) || priceNum * 0.014 / 3;
    const repairNum = parseFloat(repairFund) || 0;

    // Monthly mortgage payment (equal installment)
    let monthlyLoan = 0;
    if (loanAmt > 0 && rateNum > 0) {
      monthlyLoan = loanAmt * rateNum * Math.pow(1 + rateNum, loanMonths) / (Math.pow(1 + rateNum, loanMonths) - 1);
    } else if (loanAmt > 0) {
      monthlyLoan = loanAmt / loanMonths;
    }

    // Build yearly arrays
    const rentYearly: number[] = [];
    const buyYearly: number[] = [];
    let cumRent = 0;
    let cumBuy = downNum; // down payment is day-1 cost

    // move count: spread evenly
    const moveYears = new Set<number>();
    for (let i = 1; i <= movesNum; i++) {
      moveYears.add(Math.round((period / (movesNum + 1)) * i));
    }

    // loan deduction: 0.7% of year-end balance, 13 years
    const loanDeductions: number[] = [];
    let balance = loanAmt;
    for (let y = 1; y <= period; y++) {
      let yearlyPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * rateNum;
        const principal = monthlyLoan - interest;
        yearlyPrincipal += principal;
        balance = Math.max(0, balance - principal);
      }
      const yearEndBal = balance;
      const ded = hasDeduction && y <= 13 ? yearEndBal * 0.007 : 0;
      loanDeductions.push(ded);
    }

    // Recalculate balance for sell
    let balanceForSell = loanAmt;
    for (let y = 1; y <= period; y++) {
      for (let m = 0; m < 12; m++) {
        const interest = balanceForSell * rateNum;
        const principal = monthlyLoan - interest;
        balanceForSell = Math.max(0, balanceForSell - principal);
      }
    }

    let totalRent = 0;
    let totalBuy = downNum;
    let crossoverYear = -1;
    const chartData: { year: number; cumRent: number; cumBuy: number }[] = [];

    let runningRent = rentNum + rentMgmtNum;
    let prevCumBuy = downNum;
    let prevCumRent = 0;

    for (let y = 1; y <= period; y++) {
      // Rent side
      const yearRent = runningRent * 12 + (y % 2 === 0 ? renewalNum : 0) + (moveYears.has(y) ? moveCostNum : 0);
      totalRent += yearRent;
      prevCumRent = totalRent;
      rentYearly.push(totalRent);

      // Buy side
      const yearBuyBase = (y <= loanYearsNum ? monthlyLoan * 12 : 0) + hoaNum * 12 + propTaxNum + repairNum;
      const yearBuy = yearBuyBase - loanDeductions[y - 1];
      totalBuy += yearBuy;
      prevCumBuy = totalBuy;
      buyYearly.push(totalBuy);

      // Rent increase every year
      runningRent *= (1 + rentRiseNum);

      // Crossover
      if (crossoverYear === -1 && y > 1 && totalBuy < totalRent) crossoverYear = y;
    }

    // Sell adjustment
    let finalBuyCost = totalBuy;
    if (sellYear !== "none") {
      const sy = parseInt(sellYear);
      if (sy <= period) {
        let balAtSell = loanAmt;
        for (let y = 1; y <= sy; y++) {
          for (let m = 0; m < 12; m++) {
            const interest = balAtSell * rateNum;
            const principal = monthlyLoan - interest;
            balAtSell = Math.max(0, balAtSell - principal);
          }
        }
        const sellPrice = priceNum * (parseFloat(sellRate) || 70) / 100;
        finalBuyCost = buyYearly[sy - 1] - sellPrice + balAtSell;
      }
    }

    // Chart: every 5 years
    const chartPoints: { year: number; r: number; b: number }[] = [];
    for (let y = 5; y <= period; y += 5) {
      chartPoints.push({ year: y, r: rentYearly[y - 1] || 0, b: buyYearly[y - 1] || 0 });
    }
    const maxVal = Math.max(...chartPoints.map(p => Math.max(p.r, p.b)));

    const buyWins = finalBuyCost < totalRent;
    const diff = Math.abs(finalBuyCost - totalRent);

    return {
      totalRent,
      finalBuyCost,
      monthlyLoan,
      crossoverYear,
      buyWins,
      diff,
      chartPoints,
      maxVal,
      loanDeductionTotal: loanDeductions.reduce((a, b) => a + b, 0),
    };
  }, [rent, rentMgmt, renewal, rentRise, moves, moveCost, price, downPayment, rate, loanYears, hoaFee, propTax, repairFund, hasDeduction, sellYear, sellRate, period]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const fmtM = (n: number) => (n / 10000).toFixed(0) + "万";
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const lbl = "block text-sm text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">賃貸 vs 購入 比較シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">中立・バイアスなし。生涯コストがわかります。</p>
        <div className="flex gap-3 mb-6">
          {PERIODS.map(p => (
            <button type="button" key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${period === p ? "bg-kon text-white" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600"}`}>
              {p}年間
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Rent inputs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="bg-gray-50 dark:bg-kon text-kon dark:text-gray-300 rounded px-2 py-0.5 text-xs">賃貸</span>
                賃貸の条件
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>家賃（円/月）</label><input type="number" value={rent} onChange={e => setRent(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>管理費（円/月）</label><input type="number" value={rentMgmt} onChange={e => setRentMgmt(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>更新料（円/2年）</label><input type="number" value={renewal} onChange={e => setRenewal(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>年間家賃上昇率（%）</label><input type="number" value={rentRise} step="0.1" onChange={e => setRentRise(e.target.value)} className={inp} /></div>
                <div>
                  <label className={lbl}>住み替え回数</label>
                  <select value={moves} onChange={e => setMoves(e.target.value)} className={inp}>
                    {["0", "1", "2", "3"].map(v => <option key={v} value={v}>{v}回</option>)}
                  </select>
                </div>
                <div><label className={lbl}>住み替え費用（円）</label><input type="number" value={moveCost} onChange={e => setMoveCost(e.target.value)} className={inp} /></div>
              </div>
            </div>

            {/* Buy inputs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs">購入</span>
                購入の条件
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>物件価格（円）</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>頭金（円）</label><input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>金利（%）</label><input type="number" value={rate} step="0.1" onChange={e => setRate(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>ローン期間（年）</label><input type="number" value={loanYears} min="1" max="35" onChange={e => setLoanYears(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>管理費・修繕積立（円/月）</label><input type="number" value={hoaFee} onChange={e => setHoaFee(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>固定資産税（円/年）</label><input type="number" value={propTax} placeholder={`≒${Math.round((parseFloat(price)||0)*0.014/3/10000)}万`} onChange={e => setPropTax(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>大規模修繕積立（円/年）</label><input type="number" value={repairFund} placeholder="一戸建ては10万目安" onChange={e => setRepairFund(e.target.value)} className={inp} /></div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={hasDeduction} onChange={e => setHasDeduction(e.target.checked)} className="w-4 h-4 rounded" />
                    住宅ローン控除（0.7%×13年）
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>売却予定</label>
                  <select value={sellYear} onChange={e => setSellYear(e.target.value)} className={inp}>
                    <option value="none">売らない</option>
                    <option value="10">10年後</option>
                    <option value="20">20年後</option>
                    <option value="35">35年後</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>想定売却価格（購入時の%）</label>
                  <input type="number" value={sellRate} min="0" max="200" onChange={e => setSellRate(e.target.value)} className={inp} />
                </div>
              </div>
              {result.monthlyLoan > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">月々のローン返済: <span className="font-semibold text-gray-700 dark:text-gray-300">¥{fmt(Math.round(result.monthlyLoan))}</span></p>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Verdict */}
            <div className={`rounded-xl p-5 border-2 ${result.buyWins ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "bg-gray-50 dark:bg-kon/20 border-kon"}`}>
              <p className="text-lg font-bold mb-1">
                {result.buyWins ? "🏠 購入の方が生涯コストが低い" : "🏢 賃貸の方が生涯コストが低い"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {period}年間の差額: <span className="font-bold">¥{fmt(result.diff)}</span>
              </p>
              {result.crossoverYear > 0 && !result.buyWins && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">購入累計コストが賃貸を下回るのは<span className="font-semibold">{result.crossoverYear}年目</span>以降（今回の期間内では逆転なし）</p>
              )}
              {result.crossoverYear > 0 && result.buyWins && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="font-semibold">{result.crossoverYear}年目</span>から購入コストが賃貸を下回ります</p>
              )}
            </div>

            {/* Cost summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">{period}年間 総費用比較</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-kon dark:text-gray-300 font-medium">賃貸 総費用</span>
                  <span className="font-bold text-xl text-gray-800 dark:text-white">¥{fmt(result.totalRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">購入 実質総費用</span>
                  <span className="font-bold text-xl text-gray-800 dark:text-white">¥{fmt(result.finalBuyCost)}</span>
                </div>
                {hasDeduction && (
                  <p className="text-xs text-gray-400">※住宅ローン控除 累計 ¥{fmt(result.loanDeductionTotal)} を控除済み</p>
                )}
                {sellYear !== "none" && (
                  <p className="text-xs text-gray-400">※{sellYear}年後売却・物件価格の{sellRate}%で売却想定</p>
                )}
              </div>
            </div>

            {/* Bar chart */}
            {result.chartPoints.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">累計費用の推移</h2>
                <div className="space-y-3">
                  {result.chartPoints.map(p => (
                    <div key={p.year}>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{p.year}年後</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-8 text-kon dark:text-gray-300">賃貸</span>
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div className="bg-kon h-4 rounded-full" style={{ width: `${result.maxVal > 0 ? (p.r / result.maxVal) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-16 text-right">{fmtM(p.r)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-8 text-green-600 dark:text-green-400">購入</span>
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div className="bg-green-400 h-4 rounded-full" style={{ width: `${result.maxVal > 0 ? (p.b / result.maxVal) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-16 text-right">{fmtM(p.b)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">あなたはどちら向き？</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-1">🏠 購入向き</p>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>✓ 同じ場所に長く住む予定</li>
                    <li>✓ 老後の住居費を抑えたい</li>
                    <li>✓ 資産形成・相続を考えている</li>
                    <li>✓ 転勤や転居の可能性が低い</li>
                  </ul>
                </div>
                <div>
                  <p className="text-kon dark:text-gray-300 font-medium mb-1">🏢 賃貸向き</p>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>✓ 転勤・転職の可能性あり</li>
                    <li>✓ ライフスタイルが変わりやすい</li>
                    <li>✓ 手元資金を投資に回したい</li>
                    <li>✓ 修繕リスクを避けたい</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ 免責事項</p>
              <p>経済的側面のみを計算対象としています。物件価値の変動リスク・金利変動・生活の質・心理的な満足度は含まれません。実際の意思決定には専門家にご相談ください。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 賃貸 vs 購入 比較シミュレーター
        </div>
      </div>
    </div>
  );
}
