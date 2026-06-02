"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, AreaChart, Area
} from "recharts";
import RelatedTools from "@/components/finance/RelatedTools";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { ValueReminderInline } from "@/components/common/ValueReminder";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

// ---- Constants ----
const MAN = 10000;
const DEDUCTION_RATE = 0.007; // 0.7%
const JYUMIN_CAP = 97500; // max 住民税 credit per year

const NISA_LIMITS: Record<string, number> = {
  "認定住宅": 45_000_000,
  "ZEH水準": 35_000_000,
  "省エネ基準": 30_000_000,
  "一般新築": 20_000_000,
  "中古": 20_000_000,
};

const INSHI_TAX = (loan: number): number => {
  if (loan <= 10_000_000) return 10_000;
  if (loan <= 50_000_000) return 20_000;
  if (loan <= 100_000_000) return 60_000;
  return 100_000;
};

// ---- Types ----
interface MonthData {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  unpaidInterest: number;
  rate: number;
}

interface LoanResult {
  monthlyData: MonthData[];
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  monthlyPayment: number; // first month
  finalMonth: number;
  unpaidInterestOccurred: boolean;
}

interface PrepayEvent {
  yearOffset: number;
  amount: number;
}

// ---- Calculation: PMT ----
function calcPMT(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

// ---- Mode 1: Amortization schedule ----
function calcLoan(
  principalYen: number,
  months: number,
  annualRate: number,
  repayType: "equal" | "principal",
  apply5nen: boolean,
  bonusMonthly: number,
  rateChanges: Array<{ fromMonth: number; rate: number }>
): LoanResult {
  let balance = principalYen;
  let unpaidInterest = 0;
  let unpaidInterestOccurred = false;
  const data: MonthData[] = [];
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;

  // Build rate schedule
  const getRate = (m: number): number => {
    let r = annualRate;
    for (const rc of rateChanges) {
      if (m >= rc.fromMonth) r = rc.rate;
    }
    return r / 100 / 12;
  };

  // Initial PMT for equal installment
  let currentPMT = repayType === "equal" ? calcPMT(principalYen, annualRate / 100 / 12, months) : 0;
  let fiveYearStartMonth = 0;
  let fiveYearStartPMT = currentPMT;

  for (let m = 1; m <= months; m++) {
    const r = getRate(m);
    const interest = Math.round(balance * r);
    let payment: number;
    let principal: number;

    if (repayType === "equal") {
      // Check 5-year rule: recalculate PMT every 60 months
      if (apply5nen && (m - fiveYearStartMonth) % 60 === 1 && m > 1) {
        fiveYearStartMonth = m - 1;
        currentPMT = calcPMT(balance, r, months - m + 1);
        fiveYearStartPMT = currentPMT;
      }
      payment = currentPMT + (bonusMonthly > 0 && (m % 6 === 0) ? bonusMonthly : 0);
      if (interest > currentPMT && apply5nen) {
        // Unpaid interest situation
        unpaidInterestOccurred = true;
        unpaidInterest += interest - currentPMT;
        principal = 0;
      } else {
        principal = Math.max(0, Math.round(currentPMT - interest));
        if (principal > balance) principal = balance;
      }
    } else {
      // Equal principal
      principal = Math.round(principalYen / months);
      if (principal > balance) principal = balance;
      payment = principal + interest + (bonusMonthly > 0 && (m % 6 === 0) ? bonusMonthly : 0);
    }

    balance = Math.max(0, balance - principal);
    totalPayment += payment;
    totalInterest += interest;
    totalPrincipal += principal;

    data.push({
      month: m,
      year: Math.ceil(m / 12),
      payment: Math.round(payment),
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.round(balance),
      unpaidInterest: Math.round(unpaidInterest),
      rate: getRate(m) * 12 * 100,
    });

    if (balance <= 0) {
      return { monthlyData: data, totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest), totalPrincipal: Math.round(totalPrincipal), monthlyPayment: Math.round(data[0].payment), finalMonth: m, unpaidInterestOccurred };
    }
  }

  return { monthlyData: data, totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest), totalPrincipal: Math.round(totalPrincipal), monthlyPayment: Math.round(data[0]?.payment ?? 0), finalMonth: months, unpaidInterestOccurred };
}

// ---- Mode 2: Refinance ----
function calcRefinance(
  currentBalance: number,
  currentRate: number,
  currentRemMonths: number,
  newRate: number,
  newMonths: number,
  fees: number
) {
  const r1 = currentRate / 100 / 12;
  const r2 = newRate / 100 / 12;
  const pmt1 = calcPMT(currentBalance, r1, currentRemMonths);
  const pmt2 = calcPMT(currentBalance, r2, newMonths);
  const total1 = pmt1 * currentRemMonths;
  const total2 = pmt2 * newMonths + fees;
  const monthlyDiff = Math.round(pmt1 - pmt2);
  const totalDiff = Math.round(total1 - total2);
  const breakEven = monthlyDiff > 0 ? Math.ceil(fees / monthlyDiff) : 9999;

  // Build chart data
  const chartData: Array<{ year: number; current: number; newLoan: number }> = [];
  let b1 = currentBalance; let b2 = currentBalance;
  const maxYears = Math.max(Math.ceil(currentRemMonths / 12), Math.ceil(newMonths / 12));
  for (let y = 0; y <= maxYears; y++) {
    for (let m = 0; m < 12; m++) {
      const idx = y * 12 + m;
      if (idx < currentRemMonths) b1 = Math.max(0, b1 - Math.max(0, pmt1 - b1 * r1));
      if (idx < newMonths) b2 = Math.max(0, b2 - Math.max(0, pmt2 - b2 * r2));
    }
    chartData.push({ year: y, current: Math.round(b1 / MAN * 10) / 10, newLoan: Math.round(b2 / MAN * 10) / 10 });
  }

  return { pmt1: Math.round(pmt1), pmt2: Math.round(pmt2), monthlyDiff, totalDiff, breakEven, isWorthIt: totalDiff > 0, chartData };
}

// ---- Mode 3: Prepayment ----
interface PrepayResult {
  withoutData: Array<{ year: number; balance: number }>;
  withData: Array<{ year: number; balance: number }>;
  savedInterest: number;
  monthsSaved: number;
  newMonthlyPayment: number;
  originalMonths: number;
  newMonths: number;
}

function calcPrepayment(
  principalYen: number,
  months: number,
  annualRate: number,
  prepayType: "shorten" | "reduce",
  events: PrepayEvent[]
): PrepayResult {
  const r = annualRate / 100 / 12;
  const originalPMT = calcPMT(principalYen, r, months);

  // Without prepayment
  const withoutData: Array<{ year: number; balance: number }> = [];
  let b = principalYen;
  for (let y = 0; y <= Math.ceil(months / 12); y++) {
    withoutData.push({ year: y, balance: Math.round(b / MAN * 10) / 10 });
    for (let m = 0; m < 12 && b > 0; m++) {
      const interest = b * r;
      b = Math.max(0, b - (originalPMT - interest));
    }
  }

  // With prepayment
  const sortedEvents = [...events].sort((a, b2) => a.yearOffset - b2.yearOffset);
  let balance2 = principalYen;
  let currentPMT = originalPMT;
  let remainingMonths = months;
  let totalInterest = 0;
  let monthIdx = 0;
  const withData: Array<{ year: number; balance: number }> = [{ year: 0, balance: Math.round(principalYen / MAN * 10) / 10 }];

  let nextEventIdx = 0;
  let currentYear = 0;
  let yearBalance = balance2;

  while (remainingMonths > 0 && balance2 > 0) {
    monthIdx++;
    // Check for prepayment event at this month
    for (let ei = nextEventIdx; ei < sortedEvents.length; ei++) {
      if (sortedEvents[ei].yearOffset * 12 <= monthIdx - 1) {
        const prepayAmt = Math.min(sortedEvents[ei].amount, balance2);
        balance2 -= prepayAmt;
        if (prepayType === "shorten") {
          remainingMonths = Math.ceil(Math.log(currentPMT / (currentPMT - balance2 * r)) / Math.log(1 + r));
        } else {
          currentPMT = calcPMT(balance2, r, remainingMonths);
        }
        nextEventIdx = ei + 1;
      }
    }
    const interest = balance2 * r;
    const principal = Math.min(balance2, currentPMT - interest);
    balance2 = Math.max(0, balance2 - principal);
    totalInterest += interest;
    remainingMonths--;

    const year = Math.ceil(monthIdx / 12);
    if (year !== currentYear) {
      currentYear = year;
      withData.push({ year, balance: Math.round(balance2 / MAN * 10) / 10 });
    }
  }

  const originalInterest = originalPMT * months - principalYen;
  const savedInterest = Math.round(originalInterest - totalInterest);
  const newMonths = monthIdx;

  return {
    withoutData,
    withData,
    savedInterest,
    monthsSaved: months - newMonths,
    newMonthlyPayment: Math.round(currentPMT),
    originalMonths: months,
    newMonths,
  };
}

// ---- Mode 4: Tax deduction ----
function calcDeduction(
  principalYen: number,
  annualRate: number,
  months: number,
  housingType: string,
  entryYear: number,
  incomeTaxYen: number,
  residentTaxYen: number
) {
  const limit = NISA_LIMITS[housingType] ?? 20_000_000;
  const isPeriod13 = !(housingType === "中古" || (housingType === "一般新築" && entryYear >= 2026));
  const deductYears = isPeriod13 ? 13 : 10;
  const r = annualRate / 100 / 12;
  const pmt = calcPMT(principalYen, r, months);

  const yearlyData: Array<{
    year: number;
    balance: number;
    base: number;
    incomeTaxCredit: number;
    residentCredit: number;
    total: number;
  }> = [];

  let balance = principalYen;
  let totalCredit = 0;

  for (let y = 1; y <= deductYears; y++) {
    // Balance at year end (after 12 months of payments)
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      balance = Math.max(0, balance - Math.max(0, pmt - interest));
    }
    const yearEndBalance = balance;
    const base = Math.round(Math.min(yearEndBalance, limit) * DEDUCTION_RATE);
    const incomeTaxCredit = Math.min(base, incomeTaxYen);
    const remaining = Math.max(0, base - incomeTaxCredit);
    const residentCredit = Math.min(remaining, JYUMIN_CAP, residentTaxYen);
    const total = incomeTaxCredit + residentCredit;
    totalCredit += total;
    yearlyData.push({ year: y, balance: Math.round(yearEndBalance / MAN * 10) / 10, base, incomeTaxCredit, residentCredit, total });
  }

  return { yearlyData, totalCredit, deductYears };
}

// ---- Helpers ----
function fmt(n: number): string { return Math.round(n).toLocaleString("ja-JP"); }
function fmtMan(n: number): string { return (n / MAN).toFixed(1); }
function fmtManR(n: number): string { return (Math.round(n / MAN * 10) / 10).toFixed(1); }

// ---- Custom Tooltip ----
const LoanTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs min-w-32">
      <p className="font-bold mb-2">{label}年目</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="mb-1">
          <span style={{ color: p.color }} className="font-semibold">{p.name}: </span>
          <span>{Number(p.value).toFixed(1)}万円</span>
        </div>
      ))}
    </div>
  );
};

// ---- Main Component ----
export default function JutakuLoanClient() {
  const { triggerSuccess } = usePricingContext();
  const [mode, setMode] = useState<1 | 2 | 3 | 4>(1);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [loanAmt, setLoanAmt] = useState(3000);
  const [loanYears, setLoanYears] = useState(35);
  const [repayType, setRepayType] = useState<"equal" | "principal">("equal");
  const [rateType, setRateType] = useState<"fixed" | "variable" | "compare">("variable");
  const [fixedRate, setFixedRate] = useState(1.5);
  const [varRate, setVarRate] = useState(0.5);
  const [rateScenario, setRateScenario] = useState<"hold" | "slow" | "fast" | "custom">("slow");
  const [customRates, setCustomRates] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.0]);
  const [apply5nen, setApply5nen] = useState(false);
  const [show5nenInfo, setShow5nenInfo] = useState(false);
  const [bonusOn, setBonusOn] = useState(false);
  const [bonusAmt, setBonusAmt] = useState(50);
  const [feesOn, setFeesOn] = useState(false);
  const [feeRate, setFeeRate] = useState(2.2);
  const [hosho, setHosho] = useState(0);
  const [toki, setToki] = useState(30);
  const [tableOpen1, setTableOpen1] = useState(false);
  const [tableScenario, setTableScenario] = useState(0);
  const [showEqualInfo, setShowEqualInfo] = useState(false);
  const [m2balance, setM2balance] = useState(2500);
  const [m2curRate, setM2curRate] = useState(1.5);
  const [m2remYears, setM2remYears] = useState(25);
  const [m2newRate, setM2newRate] = useState(0.8);
  const [m2newYears, setM2newYears] = useState(25);
  const [m2feeRate, setM2feeRate] = useState(2.2);
  const [m2hosho, setM2hosho] = useState(0);
  const [m2toki, setM2toki] = useState(20);
  const [m3loan, setM3loan] = useState(3000);
  const [m3years, setM3years] = useState(35);
  const [m3rate, setM3rate] = useState(0.5);
  const [m3type, setM3type] = useState<"shorten" | "reduce">("shorten");
  const [m3events, setM3events] = useState<PrepayEvent[]>([{ yearOffset: 5, amount: 100 * MAN }]);
  const [m4loan, setM4loan] = useState(3000);
  const [m4years, setM4years] = useState(35);
  const [m4rate, setM4rate] = useState(0.5);
  const [m4type, setM4type] = useState<string>("認定住宅");
  const [m4entryYear, setM4entryYear] = useState(2025);
  const [m4income, setM4income] = useState(500);
  const [m4incomeTax, setM4incomeTax] = useState(0);
  const [m4residentTax, setM4residentTax] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const loanYen = loanAmt * MAN;
  const loanMonths = loanYears * 12;
  const bonusMonthly = bonusOn ? bonusAmt * MAN : 0;
  const inshiTax = INSHI_TAX(loanYen);
  const fees = feesOn ? Math.round(loanYen * feeRate / 100) + hosho * MAN + toki * MAN + inshiTax : 0;

  const buildRateChanges = (baseRate: number, scenario: "hold" | "slow" | "fast" | "custom", customR: number[]) => {
    if (scenario === "hold") return [];
    if (scenario === "slow") return Array.from({ length: 6 }, (_, i) => ({ fromMonth: (i + 1) * 60, rate: baseRate + (i + 1) * 0.25 }));
    if (scenario === "fast") return Array.from({ length: 10 }, (_, i) => ({ fromMonth: (i + 1) * 36, rate: baseRate + (i + 1) * 0.5 }));
    return customR.map((r, i) => ({ fromMonth: i * 60, rate: r }));
  };

  const scenarios = (() => {
    if (rateType === "fixed") {
      return [{ label: "固定 " + fixedRate + "%", color: "#3B82F6", result: calcLoan(loanYen, loanMonths, fixedRate, repayType, false, bonusMonthly, []) }];
    }
    if (rateType === "variable") {
      const changes = buildRateChanges(varRate, rateScenario, customRates);
      return [{ label: "変動 " + varRate + "%", color: "#10B981", result: calcLoan(loanYen, loanMonths, varRate, repayType, apply5nen, bonusMonthly, changes) }];
    }
    const fixedR = calcLoan(loanYen, loanMonths, fixedRate, repayType, false, bonusMonthly, []);
    const holdR = calcLoan(loanYen, loanMonths, varRate, repayType, false, bonusMonthly, []);
    const slowR = calcLoan(loanYen, loanMonths, varRate, repayType, apply5nen, bonusMonthly, buildRateChanges(varRate, "slow", []));
    const fastR = calcLoan(loanYen, loanMonths, varRate, repayType, apply5nen, bonusMonthly, buildRateChanges(varRate, "fast", []));
    return [
      { label: "固定 " + fixedRate + "%", color: "#3B82F6", result: fixedR },
      { label: "変動(現状維持)", color: "#10B981", result: holdR },
      { label: "変動(緩漫上昇)", color: "#F59E0B", result: slowR },
      { label: "変動(急激上昇)", color: "#EF4444", result: fastR },
    ];
  })();

  const chartData1 = (() => {
    const maxY = Math.max(...scenarios.map(s => Math.ceil(s.result.finalMonth / 12)));
    return Array.from({ length: maxY + 1 }, (_, y) => {
      const entry: any = { year: y };
      scenarios.forEach((s, si) => {
        const md = s.result.monthlyData[y * 12];
        entry["balance" + si] = md ? Math.round(md.balance / MAN * 10) / 10 : 0;
      });
      return entry;
    });
  })();

  const yearlyTable1 = (() => {
    const sc = scenarios[Math.min(tableScenario, scenarios.length - 1)];
    return Array.from({ length: Math.ceil(sc.result.finalMonth / 12) }, (_, yi) => {
      const mData = sc.result.monthlyData.slice(yi * 12, (yi + 1) * 12);
      return { year: yi + 1, monthlyPayment: mData[0]?.payment ?? 0, principal: mData.reduce((a, m) => a + m.principal, 0), interest: mData.reduce((a, m) => a + m.interest, 0), balance: mData[mData.length - 1]?.balance ?? 0 };
    });
  })();

  const m2fees = Math.round(m2balance * MAN * m2feeRate / 100) + m2hosho * MAN + m2toki * MAN;
  const refi = calcRefinance(m2balance * MAN, m2curRate, m2remYears * 12, m2newRate, m2newYears * 12, m2fees);
  const prepay = calcPrepayment(m3loan * MAN, m3years * 12, m3rate, m3type, m3events);
  const autoIT = m4incomeTax > 0 ? m4incomeTax * MAN : Math.round(m4income * MAN * 0.1 * 0.9);
  const autoRT = m4residentTax > 0 ? m4residentTax * MAN : Math.round(m4income * MAN * 0.1);
  const deduction = calcDeduction(m4loan * MAN, m4rate, m4years * 12, m4type, m4entryYear, autoIT, autoRT);

  const handleCopy = useCallback(() => {
    const s = scenarios[0];
    const lines = ["【住宅ローン計算結果】", "借入金額: " + loanAmt + "万円 / 期間: " + loanYears + "年", "毎月返済額: " + fmt(s.result.monthlyPayment) + "円", "総返済額: " + fmt(s.result.totalPayment) + "円", "利息総額: " + fmt(s.result.totalInterest) + "円"];
    navigator.clipboard.writeText(lines.join(String.fromCharCode(10))).then(() => alert("コピーしました！"));
  }, [scenarios, loanAmt, loanYears]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const h2c = (await import("html2canvas")).default;
      const canvas = await h2c(resultRef.current, { scale: 2, useCORS: true });
      const a = document.createElement("a");
      a.download = "jutaku-loan.png"; a.href = canvas.toDataURL(); a.click();
      triggerSuccess('jutaku-loan');
    } catch { alert("画像保存に失敗しました。"); }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-kon text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">住宅ローン計算機</h1>
          <p className="text-gin text-sm">固定・変動・繰上返済・控除・借り換え 完全対応 | 変動金利将来シナリオ・5年ルール対応</p>
        </div>
      </div>

      {/* Sticky Mode Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {([
              [1, "新規借入"],
              [2, "借り換え"],
              [3, "繰上返済"],
              [4, "控除計算"],
            ] as const).map(([m, label]) => (
              <button type="button" key={m} onClick={() => setMode(m as 1|2|3|4)}
                className={"whitespace-nowrap px-5 py-4 text-sm font-medium border-b-2 transition-all " + (mode === m ? "border-kon text-kon" : "border-transparent text-gray-500 hover:text-gray-700")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AdSense slot 1: after mode tabs */}
      <div className="adsense-slot my-6" data-ad-slot="auto"></div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ===== MODE 1 ===== */}
        {mode === 1 && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Inputs */}
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4">主要条件</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        借入金額: <span className="font-bold text-kon">{loanAmt}万円</span>
                      </label>
                      <input type="range" min={500} max={10000} step={100} value={loanAmt}
                        onChange={e => setLoanAmt(Number(e.target.value))}
                        className="w-full accent-blue-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>500万</span><span>1億</span></div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        借入期間: <span className="font-bold text-kon">{loanYears}年</span>
                      </label>
                      <input type="range" min={5} max={35} step={1} value={loanYears}
                        onChange={e => setLoanYears(Number(e.target.value))}
                        className="w-full accent-blue-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>5年</span><span>35年</span></div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">返済方法</label>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        {(["equal", "principal"] as const).map(t => (
                          <button type="button" key={t} onClick={() => setRepayType(t)}
                            className={"flex-1 py-1.5 text-xs transition-all " + (repayType === t ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                            {t === "equal" ? "元利均等" : "元金均等"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">金利タイプ</label>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        {([["variable", "変動"], ["fixed", "固定"], ["compare", "比較"]] as const).map(([t, l]) => (
                          <button type="button" key={t} onClick={() => setRateType(t)}
                            className={"flex-1 py-1.5 text-xs transition-all " + (rateType === t ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(rateType === "variable" || rateType === "compare") && (
                      <div>
                        <label className="text-sm text-gray-600 block mb-1">変動金利</label>
                        <div className="relative">
                          <input type="number" min={0.1} max={10} step={0.05} value={varRate}
                            onChange={e => setVarRate(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                        </div>
                      </div>
                    )}
                    {(rateType === "fixed" || rateType === "compare") && (
                      <div>
                        <label className="text-sm text-gray-600 block mb-1">固定金利</label>
                        <div className="relative">
                          <input type="number" min={0.1} max={10} step={0.05} value={fixedRate}
                            onChange={e => setFixedRate(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {(rateType === "variable" || rateType === "compare") && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">変動金利シナリオ</label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {([["現状維持", "hold"], ["緩やか上昇", "slow"], ["急激上昇", "fast"], ["カスタム", "custom"]] as const).map(([label, val]) => (
                        <button type="button" key={val} onClick={() => setRateScenario(val as any)}
                          className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (rateScenario === val ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {rateScenario === "hold" && (
                      <p className="text-xs text-gray-500">現在の変動金利が返済期間中ずっと維持されるシナリオです。</p>
                    )}
                    {rateScenario === "slow" && (
                      <p className="text-xs text-gray-500">5年ごとに+0.25%ずつ金利が上昇するシナリオです。</p>
                    )}
                    {rateScenario === "fast" && (
                      <p className="text-xs text-gray-500">3年ごとに+0.5%ずつ金利が上昇するシナリオです。</p>
                    )}
                    {rateScenario === "custom" && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">5年ごとの金利を入力してください。</p>
                        {customRates.map((r, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-20">{(i * 5 + 1)}年目～</span>
                            <input type="number" min={0.1} max={15} step={0.05} value={r}
                              onChange={e => { const n = [...customRates]; n[i] = Number(e.target.value); setCustomRates(n); }}
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {(rateType === "variable" || rateType === "compare") && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">5年ルール</label>
                      <button type="button" onClick={() => setApply5nen(!apply5nen)}
                        className={"relative inline-flex h-5 w-10 rounded-full transition-colors " + (apply5nen ? "bg-kon" : "bg-gray-300")}>
                        <span className={"inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 " + (apply5nen ? "translate-x-5" : "translate-x-1")} />
                      </button>
                    </div>
                    {apply5nen && (
                      <p className="text-xs text-gray-500">金利が上昇しても、5年間は月々の返済額が固定されます。未払利息が発生する場合があります。</p>
                    )}
                  </div>
                )}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">ボーナス返済</label>
                    <button type="button" onClick={() => setBonusOn(!bonusOn)}
                      className={"relative inline-flex h-5 w-10 rounded-full transition-colors " + (bonusOn ? "bg-kon" : "bg-gray-300")}>
                      <span className={"inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 " + (bonusOn ? "translate-x-5" : "translate-x-1")} />
                    </button>
                  </div>
                  {bonusOn && (
                    <div className="mt-2">
                      <label className="text-xs text-gray-600 block mb-1">年ボーナス返済額</label>
                      <div className="relative">
                        <input type="number" min={10} max={500} step={10} value={bonusAmt}
                          onChange={e => setBonusAmt(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 text-sm" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">万円</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">諸費用を含める</label>
                    <button type="button" onClick={() => setFeesOn(!feesOn)}
                      className={"relative inline-flex h-5 w-10 rounded-full transition-colors " + (feesOn ? "bg-kon" : "bg-gray-300")}>
                      <span className={"inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 " + (feesOn ? "translate-x-5" : "translate-x-1")} />
                    </button>
                  </div>
                  {feesOn && (
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">事務手数料率 (%)</label>
                        <input type="number" min={0} max={3} step={0.1} value={feeRate}
                          onChange={e => setFeeRate(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">保証料 (万円)</label>
                        <input type="number" min={0} max={100} step={1} value={hosho}
                          onChange={e => setHosho(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">登記費用 (万円)</label>
                        <input type="number" min={0} max={50} step={1} value={toki}
                          onChange={e => setToki(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                        <span>印紙税：{fmt(INSHI_TAX(loanYen))}円（自動計算）</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right panel - results */}
            <div className="lg:col-span-2 space-y-4">
              <div className={"grid gap-4 " + (rateType === "compare" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                {scenarios.map((sc, idx) => {
                  const r = sc.result;
                  if (!r) return null;
                  return (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">{sc.label}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">月々の返済額</p>
                          <p className="text-xl font-bold text-kon">{fmt(r.monthlyPayment)}<span className="text-xs font-normal">円</span></p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">総返済額</p>
                          <p className="text-xl font-bold text-kon">{fmtManR(r.totalPayment)}<span className="text-xs font-normal">万円</span></p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">総利息</p>
                          <p className="text-xl font-bold text-danger">{fmtManR(r.totalInterest)}<span className="text-xs font-normal">万円</span></p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">返済期間</p>
                          <p className="text-xl font-bold text-green-700">{Math.ceil(r.finalMonth / 12)}<span className="text-xs font-normal">年</span></p>
                        </div>
                      </div>
                      {feesOn && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">諸費用合計：<span className="font-semibold text-gray-700">{fmt(fees)}円</span></p>
                        </div>
                      )}
                      {r.unpaidInterestOccurred && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <p className="text-xs text-yellow-700">⚠ 5年ルール適用中に未払利息が発生しています。</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* AdSense 2 */}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">返済グラフ</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData1} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tickFormatter={v => v + "年"} tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => v + "万"} tick={{ fontSize: 11 }} />
                    <Tooltip content={<LoanTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <ReferenceLine y={0} stroke="#666" />
                    {scenarios.map((sc, i) => (
                      <Line key={"bal" + i} type="monotone" dataKey={"balance" + i}
                        name={sc.label + " 残債"} stroke={sc.color} strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <button type="button" onClick={() => setTableOpen1(!tableOpen1)}
                  className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700">
                  <span>年別返済詳細</span>
                  <span>{tableOpen1 ? "▲" : "▼"}</span>
                </button>
                {tableOpen1 && (
                  <div className="overflow-x-auto px-4 pb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-2 text-left">年</th>
                          <th className="py-2 px-2 text-right">月返額</th>
                          <th className="py-2 px-2 text-right">元金</th>
                          <th className="py-2 px-2 text-right">利息</th>
                          <th className="py-2 px-2 text-right">残債</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearlyTable1.map((row: any, i: number) => (
                          <tr key={i} className={"border-t border-gray-100 " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                            <td className="py-1.5 px-2">{row.year}年</td>
                            <td className="py-1.5 px-2 text-right">{fmt(row.monthlyPayment)}</td>
                            <td className="py-1.5 px-2 text-right">{fmtManR(row.principal)}万</td>
                            <td className="py-1.5 px-2 text-right">{fmtManR(row.interest)}万</td>
                            <td className="py-1.5 px-2 text-right">{row.balance.toFixed(1)}万</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* AdSense 3 */}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>
            </div>
          </div>
        )}
        {/* Mode 2: Refinance */}
        {mode === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">現在のローン</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">残債 ({m2balance}万円)</label>
                    <input type="range" min={100} max={10000} step={100} value={m2balance}
                      onChange={e => setM2balance(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">残り返済期間 ({m2remYears}年)</label>
                    <input type="range" min={1} max={35} step={1} value={m2remYears}
                      onChange={e => setM2remYears(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">現在の金利 ({m2curRate}%)</label>
                    <input type="number" min={0.1} max={10} step={0.05} value={m2curRate}
                      onChange={e => setM2curRate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">借り換え後</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">新金利 ({m2newRate}%)</label>
                    <input type="number" min={0.1} max={10} step={0.05} value={m2newRate}
                      onChange={e => setM2newRate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">新返済期間 ({m2newYears}年)</label>
                    <input type="range" min={1} max={35} step={1} value={m2newYears}
                      onChange={e => setM2newYears(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">諸費用率 ({m2feeRate}%)</label>
                    <input type="number" min={0} max={5} step={0.1} value={m2feeRate}
                      onChange={e => setM2feeRate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {refi && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">借り換え分析</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">現在の月返</p>
                      <p className="text-lg font-bold text-gray-700">{fmt(refi.pmt1)}円</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">新月返</p>
                      <p className="text-lg font-bold text-kon">{fmt(refi.pmt2)}円</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">月刀削減額</p>
                      <p className="text-lg font-bold text-green-700">{fmt(refi.monthlyDiff)}円</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">総節約額</p>
                      <p className={"text-lg font-bold " + (refi.totalDiff > 0 ? "text-kon" : "text-danger")}>{fmtManR(refi.totalDiff)}万円</p>
                    </div>
                    <div className={"rounded-lg p-3 col-span-2 " + (refi.isWorthIt ? "bg-green-50" : "bg-gray-50")}>
                      <p className="text-xs text-gray-500">損益分岐点</p>
                      <p className={"text-lg font-bold " + (refi.isWorthIt ? "text-green-700" : "text-danger")}>
                        {refi.isWorthIt ? refi.breakEven + "か月後（" + Math.ceil(refi.breakEven / 12) + "年）" : "未回収"}
                      </p>
                    </div>
                  </div>
                  {refi.isWorthIt && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-kon">{refi.breakEven}か月後に損益分岐点を迈えます。残り返済期間が十分にある場合に借り換えが有利です。</p>
                    </div>
                  )}
                  {!refi.isWorthIt && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-danger">借り換え諸費用が大きすぎて、返済完了までに回収できません。</p>
                    </div>
                  )}
                </div>
              )}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>
            </div>
          </div>
        )}
        {/* Mode 3: Prepayment */}
        {mode === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">ローン基本情報</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">借入額 ({m3loan}万円)</label>
                    <input type="range" min={500} max={10000} step={100} value={m3loan}
                      onChange={e => setM3loan(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">返済期間 ({m3years}年)</label>
                    <input type="range" min={5} max={35} step={1} value={m3years}
                      onChange={e => setM3years(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">金利 ({m3rate}%)</label>
                    <input type="number" min={0.1} max={10} step={0.05} value={m3rate}
                      onChange={e => setM3rate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">繰上げ式</label>
                    <div className="flex gap-2">
                      {([["shorten", "期間短縮型"], ["reduce", "返済額軽減型"]] as const).map(([val, label]) => (
                        <button type="button" key={val} onClick={() => setM3type(val)}
                          className={"flex-1 py-2 rounded-lg text-xs font-medium transition-all " + (m3type === val ? "bg-kon text-white" : "bg-gray-100 text-gray-600")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">繰上げ返済イベント</h3>
                {m3events.map((ev, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">{ev.yearOffset}年目</label>
                      <input type="range" min={1} max={m3years - 1} step={1} value={ev.yearOffset}
                        onChange={e => { const n = [...m3events]; n[i] = { ...n[i], yearOffset: Number(e.target.value) }; setM3events(n); }}
                        className="w-full accent-blue-600" />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-gray-500">{Math.round(ev.amount / MAN)}万円</label>
                      <input type="range" min={10 * 10000} max={1000 * 10000} step={10 * 10000} value={ev.amount}
                        onChange={e => { const n = [...m3events]; n[i] = { ...n[i], amount: Number(e.target.value) }; setM3events(n); }}
                        className="w-full accent-blue-600" />
                    </div>
                    <button type="button" onClick={() => setM3events(m3events.filter((_, j) => j !== i))}
                      className="text-danger hover:text-danger text-lg leading-none">x</button>
                  </div>
                ))}
                <button type="button" onClick={() => setM3events([...m3events, { yearOffset: 5, amount: 100 * MAN }])}
                  className="mt-1 w-full py-2 border border-dashed border-kon text-kon text-sm rounded-lg hover:bg-gray-50">
                  + イベント追加
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {prepay && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <h4 className="text-xs text-gray-500 mb-2">繰上げなし</h4>
                      <p className="text-xs text-gray-600">元の返済期間</p>
                      <p className="text-xl font-bold text-gray-700">{Math.ceil(prepay.originalMonths / 12)}年</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <h4 className="text-xs text-gray-500 mb-2">繰上げあり</h4>
                      <p className="text-xs text-gray-600">新返済期間</p>
                      <p className="text-xl font-bold text-kon">{Math.ceil(prepay.newMonths / 12)}年</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl border border-green-200 p-5">
                    <h4 className="text-sm font-semibold text-green-800 mb-3">繰上げ返済効果</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-green-700">利息節約額</p>
                        <p className="text-2xl font-bold text-green-800">{fmtManR(prepay.savedInterest)}万円</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">
                          {m3type === "shorten" ? "期間短縮" : "月返軽減"}
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {m3type === "shorten"
                            ? Math.floor(prepay.monthsSaved / 12) + "年" + (prepay.monthsSaved % 12) + "か月"
                            : fmt(prepay.newMonthlyPayment) + "円"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">残債推移</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="year" tickFormatter={v => v + "年"} tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={v => v + "万"} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: any) => [Number(v).toFixed(1) + "万円"]} />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line data={prepay.withoutData} type="monotone" dataKey="balance" name="繰上げなし" stroke="#94a3b8" strokeWidth={2} dot={false} />
                        <Line data={prepay.withData} type="monotone" dataKey="balance" name="繰上げあり" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>
            </div>
          </div>
        )}
        {/* Mode 4: Tax Deduction */}
        {mode === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">貴宅情報</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">住宅種別</label>
                    <select value={m4type} onChange={e => setM4type(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      {Object.keys(NISA_LIMITS).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">入居年</label>
                    <input type="number" min={2020} max={2030} step={1} value={m4entryYear}
                      onChange={e => setM4entryYear(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">借入額 ({m4loan}万円)</label>
                    <input type="range" min={500} max={10000} step={100} value={m4loan}
                      onChange={e => setM4loan(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">返済期間 ({m4years}年)</label>
                    <input type="range" min={5} max={35} step={1} value={m4years}
                      onChange={e => setM4years(Number(e.target.value))}
                      className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">金利 ({m4rate}%)</label>
                    <input type="number" min={0.1} max={10} step={0.05} value={m4rate}
                      onChange={e => setM4rate(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">年間所得税額 ({m4incomeTax}万円、未入力=自動計算)</label>
                    <input type="number" min={0} max={200} step={1} value={m4incomeTax}
                      onChange={e => setM4incomeTax(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {deduction && deduction.yearlyData.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-xs text-kon mb-1">総控除額 (減税期間合計)</p>
                      <p className="text-2xl font-bold text-kon">{fmtManR(deduction.totalCredit)}万円</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5">
                      <p className="text-xs text-green-600 mb-1">控除期間</p>
                      <p className="text-2xl font-bold text-green-800">{deduction.deductYears}年間</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700">年別控除詳細</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-3 text-left">年次</th>
                            <th className="py-2 px-3 text-right">年末残高</th>
                            <th className="py-2 px-3 text-right">控除率</th>
                            <th className="py-2 px-3 text-right">所得税控除</th>
                            <th className="py-2 px-3 text-right">住民税控除</th>
                            <th className="py-2 px-3 text-right">合計控除</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deduction.yearlyData.map((y: any, i: number) => (
                            <tr key={i} className={"border-t border-gray-100 " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                              <td className="py-2 px-3">{i + 1}年目 ({m4entryYear + i})</td>
                              <td className="py-2 px-3 text-right">{y.balance.toFixed(1)}万円</td>
                              <td className="py-2 px-3 text-right">0.7%</td>
                              <td className="py-2 px-3 text-right">{fmt(y.incomeTaxCredit)}円</td>
                              <td className="py-2 px-3 text-right">{fmt(y.residentCredit)}円</td>
                              <td className="py-2 px-3 text-right font-semibold text-kon">{fmt(y.total)}円</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>
            </div>
          </div>
        )}
        {/* Share buttons */}
        <div className="flex gap-3 justify-center py-4">
          <button type="button" onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm">
            コピー
          </button>
          <button type="button" onClick={handleSaveImage}
            className="flex items-center gap-2 px-5 py-2.5 bg-kon text-white rounded-lg hover:bg-ai text-sm">
            画像保存
          </button>
        </div>
      </div>
      <ValueReminderInline />

      {/* Educational Content Section */}
      <div className="max-w-4xl mx-auto mt-12 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">住宅ローン計算の基礎知識</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <p>
              住宅ローンは、多くの人にとって人生最大の買い物です。この計算機では、
              月々の返済額、総返済額、利息総額、さらには借り換え効果や繰り上げ返済の節約額まで
              シミュレーションできます。固定金利と変動金利の比較、5年ルールの影響、
              住宅ローン控除の試算も可能です。
            </p>

            <h3 className="text-lg font-bold text-gray-800">固定金利と変動金利の比較</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">比較項目</th>
                    <th className="px-4 py-3 text-center font-semibold text-kon">固定金利</th>
                    <th className="px-4 py-3 text-center font-semibold text-green-700">変動金利</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">金利水準（2026年）</td>
                    <td className="px-4 py-3 text-center">1.0%～1.8%</td>
                    <td className="px-4 py-3 text-center">0.3%～0.6%</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">金利変動リスク</td>
                    <td className="px-4 py-3 text-center">なし（期間中一定）</td>
                    <td className="px-4 py-3 text-center">あり（6か月ごと見直し）</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">返済額の予測</td>
                    <td className="px-4 py-3 text-center">簡単（毎月一定）</td>
                    <td className="px-4 py-3 text-center">困難（金利変動による）</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">適している人</td>
                    <td className="px-4 py-3 text-center">金利上昇を懸念する人</td>
                    <td className="px-4 py-3 text-center">金利低下を期待する人</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">選べる期間</td>
                    <td className="px-4 py-3 text-center">2年～35年（選択制）</td>
                    <td className="px-4 py-3 text-center">35年（一括）</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-bold text-gray-800">日本の住宅ローンの典型的な条件</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-kon mb-2">一般的な借入条件</h4>
                <ul className="text-sm space-y-1">
                  <li>• 借入期間：最長35年（完済時年齢80歳まで）</li>
                  <li>• 頭金：物件価格の10%～20%が目安</li>
                  <li>• 借入限度：年収の5～7倍程度</li>
                  <li>• 返済比率：年収の25%～35%以内</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-700 mb-2">諸費用の目安</h4>
                <ul className="text-sm space-y-1">
                  <li>• 事務手数料：借入額の1%～2%</li>
                  <li>• 保証料：借入額の0.2%～1%</li>
                  <li>• 登記費用：20万～40万円</li>
                  <li>• 印紙税：1万～10万円</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800">月々返済額の目安（金利0.5%・35年返済）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">借入金額</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">月々返済額</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">総返済額</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">利息総額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">3,000万円</td>
                    <td className="px-4 py-3 text-right">約77,900円</td>
                    <td className="px-4 py-3 text-right">約3,272万円</td>
                    <td className="px-4 py-3 text-right">約272万円</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">4,000万円</td>
                    <td className="px-4 py-3 text-right">約103,900円</td>
                    <td className="px-4 py-3 text-right">約4,363万円</td>
                    <td className="px-4 py-3 text-right">約363万円</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">5,000万円</td>
                    <td className="px-4 py-3 text-right">約129,800円</td>
                    <td className="px-4 py-3 text-right">約5,454万円</td>
                    <td className="px-4 py-3 text-right">約454万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              ※元利均等返済、ボーナス返済なしの場合。実際の返済額は金融機関によって異なります。
            </p>

            <h3 className="text-lg font-bold text-gray-800">元利均等返済と元金均等返済の違い</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <h4 className="font-bold text-indigo-700 mb-2">元利均等返済</h4>
                <p className="text-sm mb-2">
                  毎月の返済額が一定。返済初期は利息の割合が高く、元金の減りは遅い。
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ 毎月の支払いが同額で計画しやすい</li>
                  <li>✅ 初期の返済負担が軽い</li>
                  <li>⚠️ 総利息が元金均等より多い</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-kon mb-2">元金均等返済</h4>
                <p className="text-sm mb-2">
                  毎月の元金返済額が一定。返済額は毎月減少していく。
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ 総利息を抑えられる</li>
                  <li>✅ 元金が確実に減っていく</li>
                  <li>⚠️ 初期の返済負担が重い</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800">5年ルールとは？</h3>
            <p>
              変動金利で元利均等返済を選んだ場合、多くの金融機関で「5年ルール」が適用されます。
              これは、金利が変動しても5年間は月々の返済額を変更せず、内部で元金と利息の配分を調整する仕組みです。
              金利が大幅に上昇した場合、利息が返済額を上回り「未払利息」が発生するリスクがあります。
              未払利息が発生すると、将来の返済負担が増加するため注意が必要です。
            </p>

            <h3 className="text-lg font-bold text-gray-800">よくある質問</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: 住宅ローンの借り換えはいつがベストタイミングですか？</h4>
                <p className="text-sm">
                  A: 一般的に、残り返済期間が10年以上あり、金利差が0.5%以上ある場合が借り換えの目安です。
                  ただし、借り換え諸費用（事務手数料、保証料、登記費用等）が数十万円かかるため、
                  損益分岐点をしっかり計算することが重要です。本シミュレーターで具体的な損益分岐点を確認できます。
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: 繰り上げ返済はいつ行うのが最も効果的ですか？</h4>
                <p className="text-sm">
                  A: 繰り上げ返済は、返済初期に行うほど効果が大きくなります。
                  ローンの初年度は利息の割合が高いため、元金を減らすことでその後の利息負担を大幅に削減できます。
                  例えば3000万円・35年・金利0.5%のローンで、初年度に100万円繰り上げ返済すると、
                  期間短縮型で約1年2か月の期間短縮、約45万円の利息節約が見込めます。
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: 住宅ローン控除はいくら戻ってきますか？</h4>
                <p className="text-sm">
                  A: 2024年以降入居の場合、年末ローン残高の0.7%が所得税から控除されます。
                  省エネ基準適合住宅であれば13年間、一般住宅で10年間控除が受けられます。
                  借入額3000万円の場合、年間最大約21万円、累計約273万円の控除が期待できます。
                  所得税から引ききれない分は、住民税から上限97,500円まで控除されます。
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentTool="/finance/jutaku-loan" />

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-xs text-yellow-800">
          <p><strong>免責事項：</strong>本ツールの計算結果は参考情報であり、実際の返済額と異なる場合があります。金融機関や税理士にご相談の上、最終的な判断はご自身で行ってください。</p>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
