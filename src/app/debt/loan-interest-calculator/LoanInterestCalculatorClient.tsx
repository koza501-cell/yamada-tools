"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

const MAN = 10000;
const MAX_LOANS = 4;

interface LoanItem {
  id: number;
  name: string;
  balanceMan: string;
  rate: string;
  monthlyPayment: string;
}

interface LoanResult {
  id: number;
  name: string;
  balance: number;
  rate: number;
  monthlyPayment: number;
  monthlyInterest: number;
  dailyInterest: number;
  principalPayment: number;
  completionMonths: number;
  totalInterest: number;
  totalPayment: number;
  danger: boolean;
  monthlyGrowth: number;
}

interface RefinanceResult {
  newRate: number;
  fee: number;
  combinedBalance: number;
  newMonthly: number;
  newTotalInterest: number;
  newCompletionMonths: number;
  savingsInterest: number;
  savedMonths: number;
}

interface AdditionalResult {
  extraMonths: number;
  extraInterest: number;
  newTotalMonthly: number;
  newCompletionMonths: number;
  newTotalInterest: number;
  usedFallbackPayment: boolean;
  fallbackMonthly: number;
  negativeAmortization: boolean;
  nearZeroAmortization: boolean;
}

interface SimResult {
  loans: LoanResult[];
  totalBalance: number;
  totalMonthlyPayment: number;
  totalMonthlyInterest: number;
  totalInterest: number;
  totalPayment: number;
  completionMonths: number;
  refinance: RefinanceResult | null;
  additional: AdditionalResult | null;
}

function calcLoan(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): Pick<LoanResult, "monthlyInterest" | "dailyInterest" | "principalPayment" | "completionMonths" | "totalInterest" | "totalPayment" | "danger" | "monthlyGrowth"> {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyInterest = balance * monthlyRate;
  const dailyInterest = balance * (annualRate / 100) / 365;
  const principalPayment = monthlyPayment - monthlyInterest;
  const danger = principalPayment <= 0;
  const monthlyGrowth = danger ? Math.abs(principalPayment) : 0;

  if (danger) {
    return { monthlyInterest, dailyInterest, principalPayment, completionMonths: 601, totalInterest: 0, totalPayment: 0, danger: true, monthlyGrowth };
  }

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;
  while (remaining > 0 && months < 600) {
    const interest = remaining * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, remaining);
    totalInterest += interest;
    remaining -= principal;
    months++;
  }

  if (remaining > 0) {
    return { monthlyInterest, dailyInterest, principalPayment, completionMonths: 601, totalInterest: 0, totalPayment: 0, danger: false, monthlyGrowth: 0 };
  }

  return {
    monthlyInterest,
    dailyInterest,
    principalPayment,
    completionMonths: months,
    totalInterest,
    totalPayment: balance + totalInterest,
    danger: false,
    monthlyGrowth: 0,
  };
}

function calcCompletion(balance: number, annualRate: number, monthlyPayment: number): { months: number; totalInterest: number } {
  const monthlyRate = annualRate / 12 / 100;
  const interest1 = balance * monthlyRate;
  if (monthlyPayment <= interest1) return { months: 601, totalInterest: 0 };

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;
  while (remaining > 0 && months < 600) {
    const interest = remaining * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, remaining);
    totalInterest += interest;
    remaining -= principal;
    months++;
  }
  if (remaining > 0) return { months: 601, totalInterest: 0 };
  return { months, totalInterest };
}

function formatMonths(months: number): string {
  if (months > 600) return "返済不能";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return y + m + "ヶ月";
  if (m === 0) return y + "年";
  return y + "年" + m + "ヶ月";
}

function completionDate(months: number): string {
  if (months > 600) return "返済不能";
  const d = new Date(2026, 2, 1);
  d.setMonth(d.getMonth() + months);
  return d.getFullYear() + "年" + (d.getMonth() + 1) + "月";
}

function fmt(yen: number): string {
  return Math.round(yen).toLocaleString();
}

function fmtMan(yen: number): string {
  if (yen >= MAN) {
    const man = Math.round(yen / MAN * 10) / 10;
    return man.toLocaleString() + "万円";
  }
  return Math.round(yen).toLocaleString() + "円";
}

function dangerLevel(loan: LoanResult): "red" | "orange" | "green" {
  if (loan.danger) return "red";
  if (loan.completionMonths > 120) return "orange";
  return "green";
}


const FAQS = [
  {
    q: "カードローンの金利はどうやって計算するの？",
    a: "カードローンの利息は「借入残高 × 年利 ÷ 365 × 利用日数」で計算します。例えば100万円を年刑15%で 30日借りると、1,000,000 × 0.15 ÷ 365 × 30 = 12,328円の利息が発生します。"
  },
  {
    q: "複数のカードローンがある場合、どれから返すべき？",
    a: "金利の高いローンから優先的に返済するのが最も効率的です（アバランチ法）。最低返済額以上を高金利ローンに集中させることで、総支払利息を最小化できます。"
  },
  {
    q: "借り換えはいつすべき？",
    a: "現在の金利より2%以上低い金利で借り換えできる場合、また残高くが50万円以上ある場合は借り換えの効果が出やすいです。借り換え手数料と節約できる利息を比較して判断してください。"
  },
  {
    q: "最低返済額だけ払い続けるとどうなる？",
    a: "最低返済額は残高の1～3%程度に設定されており、利息の割合が高く元金がなかなか減りません。100万円を年刑18%で最低返済額（残高の1%）のみ払い続けると、完済まで約100年かかる計算になります。"
  },
  {
    q: "総量規制とは何ですか？",
    a: "貸金業法により、個人の借入総額は年収の1/3以内に制限されています（総量規制）。銀行カードローンは対象外ですが、消費者金融・クレジット会社は規制対象です。年収300万円なら最大100万円まで借入可能です。"
  }
];

export default function LoanInterestCalculator() {
  const [loans, setLoans] = useState<LoanItem[]>([
    { id: 1, name: "ローン1", balanceMan: "", rate: "", monthlyPayment: "" }
  ]);
  const [enableRefinance, setEnableRefinance] = useState(false);
  const [refinanceRate, setRefinanceRate] = useState("");
  const [refinanceFee, setRefinanceFee] = useState("0");
  const [enableAdditional, setEnableAdditional] = useState(false);
  const [additionalBalanceMan, setAdditionalBalanceMan] = useState("");
  const [additionalRate, setAdditionalRate] = useState("");
  const [additionalMonthly, setAdditionalMonthly] = useState("");
  const [result, setResult] = useState<SimResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function addLoan() {
    if (loans.length >= MAX_LOANS) return;
    const id = Math.max(...loans.map(l => l.id)) + 1;
    setLoans([...loans, { id, name: "ローン" + id, balanceMan: "", rate: "", monthlyPayment: "" }]);
  }

  function removeLoan(id: number) {
    if (loans.length <= 1) return;
    setLoans(loans.filter(l => l.id !== id));
  }

  function updateLoan(id: number, field: keyof LoanItem, value: string) {
    setLoans(loans.map(l => l.id === id ? { ...l, [field]: value } : l));
  }

  function handleCalculate() {
    const loanResults: LoanResult[] = [];

    for (const loan of loans) {
      const balance = parseFloat(loan.balanceMan) * MAN;
      const rate = parseFloat(loan.rate);
      const monthly = parseFloat(loan.monthlyPayment);
      if (isNaN(balance) || balance <= 0 || isNaN(rate) || rate <= 0 || isNaN(monthly) || monthly <= 0) continue;
      const r = calcLoan(balance, rate, monthly);
      loanResults.push({
        id: loan.id,
        name: loan.name || "ローン" + loan.id,
        balance,
        rate,
        monthlyPayment: monthly,
        ...r
      });
    }

    if (loanResults.length === 0) return;

    const totalBalance = loanResults.reduce((s, l) => s + l.balance, 0);
    const totalMonthlyPayment = loanResults.reduce((s, l) => s + l.monthlyPayment, 0);
    const totalMonthlyInterest = loanResults.reduce((s, l) => s + l.monthlyInterest, 0);
    const totalInterest = loanResults.reduce((s, l) => s + l.totalInterest, 0);
    const totalPayment = loanResults.reduce((s, l) => s + l.totalPayment, 0);
    const blendedRate = totalBalance > 0 ? totalMonthlyInterest / totalBalance * 12 * 100 : 0;
    const { months: completionMonths } = calcCompletion(totalBalance, blendedRate, totalMonthlyPayment);

    let refinance: RefinanceResult | null = null;
    if (enableRefinance && refinanceRate) {
      const newRate = parseFloat(refinanceRate);
      const fee = parseFloat(refinanceFee) || 0;
      if (!isNaN(newRate) && newRate > 0) {
        const combinedBalance = totalBalance + fee;
        const { months: newMonths, totalInterest: newTotalInterest } = calcCompletion(combinedBalance, newRate, totalMonthlyPayment);
        refinance = {
          newRate,
          fee,
          combinedBalance,
          newMonthly: totalMonthlyPayment,
          newTotalInterest,
          newCompletionMonths: newMonths,
          savingsInterest: totalInterest - newTotalInterest,
          savedMonths: completionMonths - newMonths
        };
      }
    }

    let additional: AdditionalResult | null = null;
    if (enableAdditional && additionalBalanceMan) {
      const addBalance = parseFloat(additionalBalanceMan) * MAN;
      const addRate = parseFloat(additionalRate);
      if (!isNaN(addBalance) && addBalance > 0 && !isNaN(addRate) && addRate > 0) {
        const addMonthlyInterest = addBalance * addRate / 12 / 100;
        const inputMonthly = parseFloat(additionalMonthly);
        const usedFallbackPayment = isNaN(inputMonthly) || inputMonthly <= 0;
        const fallbackMonthly = Math.max(addMonthlyInterest, addBalance * 0.01);
        const addMonthly = usedFallbackPayment ? fallbackMonthly : inputMonthly;
        const negativeAmortization = addMonthly <= addMonthlyInterest;
        const nearZeroAmortization = !negativeAmortization && addMonthly <= addMonthlyInterest * 1.2;
        const newTotalBalance = totalBalance + addBalance;
        const newTotalMonthly = totalMonthlyPayment + addMonthly;
        const blendedRate2 = (totalMonthlyInterest + addMonthlyInterest) / newTotalBalance * 12 * 100;
        const { months: newMonths, totalInterest: newTotalInterest } = calcCompletion(newTotalBalance, blendedRate2, newTotalMonthly);
        additional = {
          extraMonths: negativeAmortization ? 601 : newMonths - completionMonths,
          extraInterest: negativeAmortization ? 0 : newTotalInterest - totalInterest,
          newTotalMonthly,
          newCompletionMonths: negativeAmortization ? 601 : newMonths,
          newTotalInterest: negativeAmortization ? 0 : newTotalInterest,
          usedFallbackPayment,
          fallbackMonthly,
          negativeAmortization,
          nearZeroAmortization
        };
      }
    }

    setResult({
      loans: loanResults,
      totalBalance,
      totalMonthlyPayment,
      totalMonthlyInterest,
      totalInterest,
      totalPayment,
      completionMonths,
      refinance,
      additional
    });
  }

  function handleReset() {
    setLoans([{ id: 1, name: "ローン1", balanceMan: "", rate: "", monthlyPayment: "" }]);
    setEnableRefinance(false);
    setRefinanceRate("");
    setRefinanceFee("0");
    setEnableAdditional(false);
    setAdditionalBalanceMan("");
    setAdditionalRate("");
    setAdditionalMonthly("");
    setResult(null);
  }

  const sortedByRate = result ? [...result.loans].sort((a, b) => b.rate - a.rate) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">カードローン利息計算機</h1>
      <p className="text-sm text-gray-500 mb-6">複数ローンを一括比較・借り換え効果・追加借入の影響をシミュレーション</p>

      <div className="space-y-4 mb-4">
        {loans.map((loan) => (
          <div key={loan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={loan.name}
                onChange={e => updateLoan(loan.id, "name", e.target.value)}
                className="font-semibold text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-kon w-32 text-sm"
              />
              {loans.length > 1 && (
                <button type="button" onClick={() => removeLoan(loan.id)} className="text-gray-400 hover:text-danger text-sm">削除</button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">借入残高（万円）</label>
                <input type="number" value={loan.balanceMan} onChange={e => updateLoan(loan.id, "balanceMan", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="50" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">年利（%）</label>
                <input type="number" value={loan.rate} onChange={e => updateLoan(loan.id, "rate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="15.0" step="0.1" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">月返済額（円）</label>
                <input type="number" value={loan.monthlyPayment} onChange={e => updateLoan(loan.id, "monthlyPayment", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="15000" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {loans.length < MAX_LOANS && (
        <button type="button" onClick={addLoan} className="w-full mb-4 py-3 border-2 border-dashed border-kon rounded-xl text-kon text-sm hover:border-ai hover:bg-gray-50 transition">
          + ローンを追加（最大{MAX_LOANS}件）
        </button>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enableRefinance} onChange={e => setEnableRefinance(e.target.checked)}
            className="w-4 h-4 accent-blue-600" data-testid="refinance-toggle" />
          <span className="font-medium text-gray-700 text-sm">借り換えシミュレーションを有効にする</span>
        </label>
        {enableRefinance && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">借り換え後の年利（%）</label>
              <input type="number" value={refinanceRate} onChange={e => setRefinanceRate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="10.0" step="0.1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">借り換え手数料（円）</label>
              <input type="number" value={refinanceFee} onChange={e => setRefinanceFee(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="0" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enableAdditional} onChange={e => setEnableAdditional(e.target.checked)}
            className="w-4 h-4 accent-blue-600" data-testid="additional-borrow-toggle" />
          <span className="font-medium text-gray-700 text-sm">追加借入シミュレーションを有効にする（危険度チェック）</span>
        </label>
        {enableAdditional && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">追加借入額（万円）</label>
              <input type="number" value={additionalBalanceMan} onChange={e => setAdditionalBalanceMan(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="10" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">年利（%）</label>
              <input type="number" value={additionalRate} onChange={e => setAdditionalRate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="18.0" step="0.1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">月返済額（円）<span className="text-gray-400">任意</span></label>
              <input type="number" value={additionalMonthly} onChange={e => setAdditionalMonthly(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon" placeholder="未入力で自動計算" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        <button type="button" onClick={handleCalculate} className="flex-1 bg-kon hover:bg-ai text-white font-semibold py-3 rounded-xl transition text-sm">
          計算する
        </button>
        <button type="button" onClick={handleReset} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 rounded-xl transition text-sm">
          リセット
        </button>
      </div>

      {result && (
        <div className="space-y-6">

          {result.loans.length > 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">ローン別比較</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.loans.map(loan => {
                  const lvl = dangerLevel(loan);
                  const borderColor = lvl === "red" ? "border-danger" : lvl === "orange" ? "border-gray-200" : "border-green-400";
                  const badge = lvl === "red" ? "bg-gray-50 text-danger" : lvl === "orange" ? "bg-gray-50 text-kon" : "bg-green-100 text-green-700";
                  const icon = lvl === "red" ? "⚠️" : lvl === "orange" ? "⚠️" : "✓";
                  return (
                    <div key={loan.id} className={"bg-white rounded-xl p-4 border-2 " + borderColor}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700 text-sm">{loan.name}</span>
                        <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + badge}>{icon} {lvl === "red" ? "危険" : lvl === "orange" ? "注意" : "良好"}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between"><span>残高</span><span className="font-medium text-gray-700">{fmtMan(loan.balance)}</span></div>
                        <div className="flex justify-between"><span>年利</span><span className="font-medium text-gray-700">{loan.rate}%</span></div>
                        <div className="flex justify-between"><span>月利息</span><span className="font-medium text-danger">{fmt(loan.monthlyInterest)}円</span></div>
                        <div className="flex justify-between"><span>月元金</span><span className="font-medium text-kon">{loan.danger ? "減らない" : fmt(loan.principalPayment) + "円"}</span></div>
                        <div className="flex justify-between"><span>完済予定</span><span className="font-medium text-gray-700">{loan.danger ? "完済不能" : completionDate(loan.completionMonths) + "(" + formatMonths(loan.completionMonths) + ")"}</span></div>
                        <div className="flex justify-between"><span>総利息</span><span className="font-medium text-danger">{loan.danger ? "∞" : fmt(loan.totalInterest) + "円"}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">全ローン合計</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2 text-gray-500">総残高</td><td className="py-2 text-right font-semibold text-gray-800">{fmtMan(result.totalBalance)}</td></tr>
                <tr><td className="py-2 text-gray-500">月返済合計</td><td className="py-2 text-right font-semibold text-gray-800">{fmt(result.totalMonthlyPayment)}円</td></tr>
                <tr><td className="py-2 text-gray-500">月利息合計</td><td className="py-2 text-right font-semibold text-danger">{fmt(result.totalMonthlyInterest)}円</td></tr>
                <tr><td className="py-2 text-gray-500">月元金返済</td><td className="py-2 text-right font-semibold text-kon">{fmt(result.totalMonthlyPayment - result.totalMonthlyInterest)}円</td></tr>
                <tr><td className="py-2 text-gray-500">完済予定</td><td className="py-2 text-right font-semibold text-gray-800">{result.completionMonths > 600 ? "完済不能" : completionDate(result.completionMonths) + "(" + formatMonths(result.completionMonths) + ")"}</td></tr>
                <tr><td className="py-2 text-gray-500">総利息</td><td className="py-2 text-right font-semibold text-danger">{result.completionMonths > 600 ? "試算不能" : fmt(result.totalInterest) + "円"}</td></tr>
                <tr className="bg-gray-50"><td className="py-2 text-gray-700 font-medium">総支払額</td><td className="py-2 text-right font-bold text-danger text-base">{result.completionMonths > 600 ? "試算不能" : fmt(result.totalPayment) + "円"}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-kon mb-3">あなたの借金の利息は…</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">1日あたり</div>
                <div className="text-lg font-bold text-danger">{fmt(result.totalMonthlyInterest * 12 / 365)}円</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">1ヶ月あたり</div>
                <div className="text-lg font-bold text-danger">{fmt(result.totalMonthlyInterest)}円</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">1年あたり</div>
                <div className="text-lg font-bold text-danger">{fmt(result.totalMonthlyInterest * 12)}円</div>
              </div>
            </div>
          </div>

          {result.loans.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">返済優先度アドバイス</h2>
              <p className="text-xs text-gray-500 mb-3">金利の高い順に優先返済することで総利息を最小化できます</p>
              <ol className="space-y-2">
                {sortedByRate.map((loan, i) => (
                  <li key={loan.id} className="flex items-center gap-3 text-sm">
                    <span className={"w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 " + (i === 0 ? "bg-danger" : i === 1 ? "bg-kon" : "bg-yellow-400")}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-700">{loan.name}</span>
                    <span className="text-gray-400">年利 {loan.rate}%</span>
                    <span className="ml-auto text-danger font-medium">月利息 {fmt(loan.monthlyInterest)}円</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result.refinance && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-6">
              <h2 className="text-lg font-bold text-green-800 mb-4">借り換え効果</h2>
              <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">現在</div>
                  <div className="font-semibold text-gray-700">{result.completionMonths > 600 ? "試算不能" : formatMonths(result.completionMonths)}</div>
                  <div className="text-danger font-medium">{result.completionMonths > 600 ? "試算不能" : fmt(result.totalInterest) + "円"}</div>
                </div>
                <div className="flex items-center justify-center text-gray-400 text-2xl">&rarr;</div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">借り換え後</div>
                  <div className="font-semibold text-gray-700">{result.refinance.newCompletionMonths > 600 ? "試算不能" : formatMonths(result.refinance.newCompletionMonths)}</div>
                  <div className="text-green-600 font-medium">{result.refinance.newCompletionMonths > 600 ? "試算不能" : fmt(result.refinance.newTotalInterest) + "円"}</div>
                </div>
              </div>
              {result.refinance.savingsInterest > 0 ? (
                <div className="bg-green-100 rounded-lg p-3 text-center">
                  <div className="text-sm text-green-700">利息の節約額</div>
                  <div className="text-2xl font-bold text-green-700">{fmt(result.refinance.savingsInterest)}円</div>
                  {result.refinance.savedMonths > 0 && <div className="text-sm text-green-600">{formatMonths(result.refinance.savedMonths)}早く完済</div>}
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-3 text-center text-sm text-yellow-700">
                  この借り換えでは利息の節約効果がありません。金利や手数料を再確認してください。
                </div>
              )}
            </div>
          )}

          {result.additional && (
            <div className={"border-2 rounded-xl p-6 " + (result.additional.negativeAmortization ? "bg-gray-50 border-danger" : result.additional.nearZeroAmortization ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-200")}>
              <h2 className="text-lg font-bold text-danger mb-3">
                ⚠️ 追加で{fmtMan(parseFloat(additionalBalanceMan) * MAN)}借りると：
              </h2>
              {result.additional.negativeAmortization && (
                <div className="mb-3 p-3 bg-gray-50 border border-danger rounded-lg text-sm font-bold text-danger">
                  【警告】返済額が利息を下回っています。このままでは完済できません
                </div>
              )}
              {result.additional.nearZeroAmortization && !result.additional.negativeAmortization && (
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-kon">
                  ⚠️ 返済額が利息をほぼカバーしていないため、完済まで非常に長くかかります
                </div>
              )}
              {result.additional.usedFallbackPayment && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-700">
                  ※ 月返済額未入力のため利息相当額（{fmt(result.additional.fallbackMonthly)}円/月）で試算しています
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">月返済合計</span>
                  <span className="font-semibold">{fmt(result.additional.newTotalMonthly)}円</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">完済予定</span>
                  <span className="font-semibold">{result.additional.negativeAmortization ? "完済不能" : completionDate(result.additional.newCompletionMonths) + "(" + formatMonths(result.additional.newCompletionMonths) + ")"}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700 font-medium">追加利息負担</span>
                  <span className="font-bold text-danger">{result.additional.negativeAmortization ? "試算不能" : "+" + fmt(result.additional.extraInterest) + "円"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">完済延長</span>
                  <span className="font-bold text-danger">{result.additional.negativeAmortization ? "完済不能" : "+" + formatMonths(result.additional.extraMonths)}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      <div className="mt-12 space-y-8 text-sm text-gray-700">

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">主要カードローン金利比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left">会社名</th>
                  <th className="border border-gray-200 px-3 py-2">金利（年率）</th>
                  <th className="border border-gray-200 px-3 py-2">限度額</th>
                  <th className="border border-gray-200 px-3 py-2">審査時間</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-3 py-2">楽天銀行スーパーローン</td><td className="border border-gray-200 px-3 py-2 text-center">1.9～14.5%</td><td className="border border-gray-200 px-3 py-2 text-center">800万円</td><td className="border border-gray-200 px-3 py-2 text-center">当日～翔日</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-200 px-3 py-2">三菱UFJ銀行バンクイック</td><td className="border border-gray-200 px-3 py-2 text-center">1.8～14.6%</td><td className="border border-gray-200 px-3 py-2 text-center">500万円</td><td className="border border-gray-200 px-3 py-2 text-center">最短翔日</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2">アコム</td><td className="border border-gray-200 px-3 py-2 text-center">3.0～18.0%</td><td className="border border-gray-200 px-3 py-2 text-center">800万円</td><td className="border border-gray-200 px-3 py-2 text-center">最短20分</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-200 px-3 py-2">プロミス</td><td className="border border-gray-200 px-3 py-2 text-center">4.5～17.8%</td><td className="border border-gray-200 px-3 py-2 text-center">500万円</td><td className="border border-gray-200 px-3 py-2 text-center">最短3分</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2">アイフル</td><td className="border border-gray-200 px-3 py-2 text-center">3.0～18.0%</td><td className="border border-gray-200 px-3 py-2 text-center">800万円</td><td className="border border-gray-200 px-3 py-2 text-center">最短25分</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-200 px-3 py-2">SMBCモビット</td><td className="border border-gray-200 px-3 py-2 text-center">3.0～18.0%</td><td className="border border-gray-200 px-3 py-2 text-center">800万円</td><td className="border border-gray-200 px-3 py-2 text-center">最短30分</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-1">※ 金利・限度額は変更される場合があります。最新情報は各社公式サイトをご確認ください。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">カードローンの基礎知識</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">カードローンの種類</h3>
              <p className="text-gray-600 leading-relaxed">カードローンは大きく銀行系と消費者金融系に分かれます。銀行系は金利が低め（1～15%程度）ですが審査に時間がかかります。消費者金融系は金利がやや高め（3～18%）ですが審査が早く、即日融資にも対応しています。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">法定金利（上限金利）</h3>
              <p className="text-gray-600 leading-relaxed">利息制限法により、借入金額に応じて上限金利が定められています。10万円未満は年20%、10万円以上100万円未満は年18%、100万円以上は年15%が上限です。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">総量規制</h3>
              <p className="text-gray-600 leading-relaxed">貸金業法の総量規制により、消費者金融・クレジット会社からの借入合計は年収の1/3が上限です。銀行カードローンは対象外ですが、多くの銀行が年収の1/3以内の審査基準を設けています。</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">よくある質問</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 font-medium text-sm hover:bg-gray-50"
                >
                  <span>Q. {faq.q}</span>
                  <span className="text-gray-400 ml-2">{openFaq === i ? "▲" : "▼"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                    A. {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">あわせて使えるツール</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/debt/repayment-simulator" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-ai hover:shadow-sm transition">
              <div className="font-medium text-gray-700 text-sm mb-1">借金返済シミュレーター</div>
              <div className="text-xs text-gray-400">完済日・総利息を詳細計算</div>
            </Link>
            <Link href="/debt/debt-free-calculator" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-ai hover:shadow-sm transition">
              <div className="font-medium text-gray-700 text-sm mb-1">借金完済計算機</div>
              <div className="text-xs text-gray-400">目標期間から必要返済額を逆算</div>
            </Link>
            <Link href="/loan/mortgage-calculator" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-ai hover:shadow-sm transition">
              <div className="font-medium text-gray-700 text-sm mb-1">住宅ローン計算機</div>
              <div className="text-xs text-gray-400">月々返済額・総返済額を計算</div>
            </Link>
            <Link href="/savings/interest-calculator" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-ai hover:shadow-sm transition">
              <div className="font-medium text-gray-700 text-sm mb-1">預金利息計算機</div>
              <div className="text-xs text-gray-400">預金の利息を複利・単利で計算</div>
            </Link>
          </div>
        </section>

      </div>

      <AdUnit slot="loan-interest-calculator" />
    </div>
  );
}
