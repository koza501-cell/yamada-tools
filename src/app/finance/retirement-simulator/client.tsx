"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from "recharts";
import RelatedTools from "@/components/finance/RelatedTools";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { ValueReminderInline } from "@/components/common/ValueReminder";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

// ---- Types ----
type Mode = 1 | 2 | 3 | 4;
type Gender = "male" | "female";
type JobType = "company" | "self" | "public" | "housewife";
type WithdrawalMethod = "fixed" | "percentage";
type iDeCoReceiveMethod = "lump" | "annuity" | "both";

// ---- Constants ----
const MAN = 10000;
const BASE_PENSION_ANNUAL = 78; // 満額基礎年金（万円/年）

// 所得税率（簡易版）
const INCOME_TAX_RATES = [
  { limit: 195, rate: 0.05, deduction: 0 },
  { limit: 330, rate: 0.10, deduction: 9.75 },
  { limit: 695, rate: 0.20, deduction: 42.75 },
  { limit: 900, rate: 0.23, deduction: 63.6 },
  { limit: 1800, rate: 0.33, deduction: 153.6 },
  { limit: 4000, rate: 0.40, deduction: 279.6 },
  { limit: 999999999999, rate: 0.45, deduction: 479.6 },
];

// ---- Helper Functions ----
function fmt(n: number): string { return Math.round(n).toLocaleString("ja-JP"); }
function fmtMan(n: number): string { return (n / MAN).toFixed(1); }
function fmtManR(n: number): string { return (Math.round(n / MAN * 10) / 10).toFixed(1); }

// 退職所得控除計算
function calcRetirementDeduction(years: number): number {
  if (years <= 20) {
    return 40 * years;
  } else {
    return 800 + 70 * (years - 20);
  }
}

// 所得税計算（万円ベース）
function calcIncomeTax(taxableIncome: number): number {
  for (const bracket of INCOME_TAX_RATES) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  return taxableIncome * 0.45 - 479.6;
}

// 複利計算
function compoundInterest(principal: number, monthlyContribution: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) {
    return principal + monthlyContribution * months;
  }
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
  const fvContribution = monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return fvPrincipal + fvContribution;
}

// ---- Custom Tooltip ----
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs min-w-32">
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="mb-1">
          <span style={{ color: p.color }} className="font-semibold">{p.name}: </span>
          <span>{typeof p.value === 'number' ? fmtManR(p.value * MAN) : p.value}万円</span>
        </div>
      ))}
    </div>
  );
};

// ---- Mode 1: 総合シミュレーション ----
interface Mode1Result {
  retirementAssets: number;
  requiredFunds: number;
  surplus: number;
  additionalMonthlyNeeded: number;
  yearlyData: Array<{
    age: number;
    assets: number;
    pensionIncome: number;
    otherIncome: number;
    expenses: number;
    balance: number;
  }>;
  assetDepletionAge: number | null;
}

function calcMode1(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  monthlyPension: number,
  spousePension: number,
  retirementBonus: number,
  otherIncome: number,
  currentSavings: number,
  currentIdeco: number,
  currentNisa: number,
  idecoMonthly: number,
  nisaMonthly: number,
  savingsMonthly: number,
  returnRate: number,
  monthlyExpenses: number,
  medicalExpenses: number,
  inflationRate: number
): Mode1Result {
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;
  
  // 退職時資産計算（複利）
  const savingsAtRetirement = compoundInterest(
    currentSavings * MAN,
    savingsMonthly * MAN,
    returnRate,
    yearsToRetirement
  );
  const idecoAtRetirement = compoundInterest(
    currentIdeco * MAN,
    idecoMonthly * MAN,
    returnRate,
    yearsToRetirement
  );
  const nisaAtRetirement = compoundInterest(
    currentNisa * MAN,
    nisaMonthly * MAN,
    returnRate,
    yearsToRetirement
  );
  
  const totalAssetsAtRetirement = savingsAtRetirement + idecoAtRetirement + nisaAtRetirement + retirementBonus * MAN;
  
  // 老後支出計算（インフレ考慮）
  let totalRequired = 0;
  const yearlyData = [];
  let currentAssets = totalAssetsAtRetirement;
  let assetDepletionAge: number | null = null;
  
  const totalMonthlyPension = (monthlyPension + spousePension) * MAN;
  const baseMonthlyExpenses = (monthlyExpenses + medicalExpenses) * MAN;
  
  for (let i = 0; i < retirementYears; i++) {
    const age = retirementAge + i;
    const inflationFactor = Math.pow(1 + inflationRate / 100, i);
    const yearlyPension = totalMonthlyPension * 12;
    const yearlyOtherIncome = otherIncome * MAN * 12;
    const yearlyExpenses = baseMonthlyExpenses * 12 * inflationFactor;
    const yearlyBalance = yearlyPension + yearlyOtherIncome - yearlyExpenses;
    
    currentAssets = currentAssets * (1 + returnRate / 100) + yearlyBalance;
    
    if (currentAssets < 0 && assetDepletionAge === null) {
      assetDepletionAge = age;
    }
    
    yearlyData.push({
      age,
      assets: Math.max(0, currentAssets) / MAN,
      pensionIncome: yearlyPension / MAN,
      otherIncome: yearlyOtherIncome / MAN,
      expenses: yearlyExpenses / MAN,
      balance: yearlyBalance / MAN,
    });
    
    totalRequired += Math.max(0, -yearlyBalance);
  }
  
  const requiredFunds = totalRequired / MAN;
  const surplus = totalAssetsAtRetirement / MAN - requiredFunds;
  
  // 追加積立額計算
  let additionalMonthlyNeeded = 0;
  if (surplus < 0) {
    const monthlyRate = returnRate / 100 / 12;
    const months = yearsToRetirement * 12;
    const target = -surplus * MAN;
    if (monthlyRate > 0) {
      additionalMonthlyNeeded = target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) / MAN;
    } else {
      additionalMonthlyNeeded = target / months / MAN;
    }
  }
  
  return {
    retirementAssets: totalAssetsAtRetirement / MAN,
    requiredFunds,
    surplus,
    additionalMonthlyNeeded,
    yearlyData,
    assetDepletionAge,
  };
}

// ---- Mode 2: 資産寿命・取り崩し ----
interface Mode2Result {
  assetLifespan: number;
  depletionAge: number;
  finalAssetAge: number;
  comparisonData: Array<{
    year: number;
    fixedWithdrawal: number;
    percentageWithdrawal: number;
    noWithdrawal: number;
  }>;
}

function calcMode2(
  initialAssets: number,
  monthlyPension: number,
  monthlyExpenses: number,
  returnRate: number,
  withdrawalMethod: WithdrawalMethod,
  fixedAmount: number,
  percentageRate: number,
  inflationRate: number,
  retirementAge: number
): Mode2Result {
  const comparisonData = [];
  let assetsFixed = initialAssets * MAN;
  let assetsPercentage = initialAssets * MAN;
  let assetsNoWithdrawal = initialAssets * MAN;
  
  const monthlyPensionYen = monthlyPension * MAN;
  const monthlyExpensesYen = monthlyExpenses * MAN;
  
  let depletionAge = 0;
  let finalAssetAge = retirementAge;
  
  for (let year = 0; year < 50; year++) {
    const age = retirementAge + year;
    const inflationFactor = Math.pow(1 + inflationRate / 100, year);
    const yearlyPension = monthlyPensionYen * 12;
    const yearlyExpenses = monthlyExpensesYen * 12 * inflationFactor;
    const yearlyShortfall = yearlyExpenses - yearlyPension;
    
    // 定額取り崩し
    const yearlyWithdrawalFixed = withdrawalMethod === "fixed" 
      ? fixedAmount * MAN * 12 * inflationFactor 
      : Math.max(0, yearlyShortfall);
    assetsFixed = assetsFixed * (1 + returnRate / 100) - yearlyWithdrawalFixed;
    
    // 定率取り崩し
    const yearlyWithdrawalPercentage = withdrawalMethod === "percentage"
      ? assetsPercentage * (percentageRate / 100)
      : Math.max(0, yearlyShortfall);
    assetsPercentage = assetsPercentage * (1 + returnRate / 100) - yearlyWithdrawalPercentage;
    
    // 取り崩しなし
    assetsNoWithdrawal = assetsNoWithdrawal * (1 + returnRate / 100) + yearlyPension - yearlyExpenses;
    
    if (assetsFixed <= 0 && depletionAge === 0) {
      depletionAge = age;
    }
    
    comparisonData.push({
      year: age,
      fixedWithdrawal: Math.max(0, assetsFixed) / MAN,
      percentageWithdrawal: Math.max(0, assetsPercentage) / MAN,
      noWithdrawal: Math.max(0, assetsNoWithdrawal) / MAN,
    });
    
    if (assetsFixed <= 0 && assetsPercentage <= 0) break;
    finalAssetAge = age;
  }
  
  const assetLifespan = depletionAge > 0 ? depletionAge - retirementAge : 50;
  
  return {
    assetLifespan,
    depletionAge: depletionAge > 0 ? depletionAge : retirementAge + 50,
    finalAssetAge,
    comparisonData,
  };
}

// ---- Mode 3: iDeCo出口戦略 ----
interface Mode3Scenario {
  name: string;
  deduction: number;
  taxableIncome: number;
  incomeTax: number;
  residentTax: number;
  netAmount: number;
  isBest: boolean;
}

interface Mode3Result {
  scenarios: Mode3Scenario[];
}

function calcMode3(
  idecoBalance: number,
  idecoYears: number,
  retirementBonus: number,
  retirementAge: number,
  receiveAge: number,
  receiveMethod: iDeCoReceiveMethod,
  lumpPercentage: number
): Mode3Result {
  const scenarios: Mode3Scenario[] = [];
  
  // 退職所得控除
  const retirementDeduction = calcRetirementDeduction(idecoYears);
  
  // 10年ルール適用（iDeCoを先に受け取る場合）
  const within10Years = Math.abs(retirementAge - receiveAge) < 10;
  const adjustedDeduction = within10Years && receiveMethod === "lump" 
    ? Math.max(0, calcRetirementDeduction(retirementAge - 20) - retirementDeduction)
    : retirementDeduction;
  
  // シナリオA: iDeCo先受取
  const scenarioA = (() => {
    const idecoTaxable = Math.max(0, (idecoBalance - adjustedDeduction) / 2);
    const bonusTaxable = Math.max(0, (retirementBonus - calcRetirementDeduction(retirementAge - 20)) / 2);
    const totalTaxable = idecoTaxable + bonusTaxable;
    const incomeTax = calcIncomeTax(totalTaxable);
    const residentTax = totalTaxable * 0.1;
    const netIdeco = idecoBalance - (incomeTax + residentTax) * (idecoTaxable / totalTaxable || 0);
    const netBonus = retirementBonus - (incomeTax + residentTax) * (bonusTaxable / totalTaxable || 0);
    return {
      name: "iDeCoを先に受取",
      deduction: adjustedDeduction,
      taxableIncome: totalTaxable,
      incomeTax,
      residentTax,
      netAmount: netIdeco + netBonus,
      isBest: false,
    };
  })();
  
  // シナリオB: 退職金先受取
  const scenarioB = (() => {
    const bonusTaxable = Math.max(0, (retirementBonus - calcRetirementDeduction(retirementAge - 20)) / 2);
    const idecoTaxable = Math.max(0, (idecoBalance - retirementDeduction) / 2);
    const totalTaxable = bonusTaxable + idecoTaxable;
    const incomeTax = calcIncomeTax(totalTaxable);
    const residentTax = totalTaxable * 0.1;
    const netBonus = retirementBonus - (incomeTax + residentTax) * (bonusTaxable / totalTaxable || 0);
    const netIdeco = idecoBalance - (incomeTax + residentTax) * (idecoTaxable / totalTaxable || 0);
    return {
      name: "退職金を先に受取",
      deduction: retirementDeduction,
      taxableIncome: totalTaxable,
      incomeTax,
      residentTax,
      netAmount: netIdeco + netBonus,
      isBest: false,
    };
  })();
  
  // シナリオC: 併用受取
  const scenarioC = (() => {
    if (receiveMethod !== "both") return null;
    const lumpAmount = idecoBalance * (lumpPercentage / 100);
    const annuityAmount = idecoBalance * ((100 - lumpPercentage) / 100);
    const lumpTaxable = Math.max(0, (lumpAmount - adjustedDeduction) / 2);
    const bonusTaxable = Math.max(0, (retirementBonus - calcRetirementDeduction(retirementAge - 20)) / 2);
    const totalTaxable = lumpTaxable + bonusTaxable;
    const incomeTax = calcIncomeTax(totalTaxable);
    const residentTax = totalTaxable * 0.1;
    const netLump = lumpAmount - (incomeTax + residentTax) * (lumpTaxable / totalTaxable || 0);
    const netBonus = retirementBonus - (incomeTax + residentTax) * (bonusTaxable / totalTaxable || 0);
    return {
      name: "併用受取（一時金+年金）",
      deduction: adjustedDeduction,
      taxableIncome: totalTaxable,
      incomeTax,
      residentTax,
      netAmount: netLump + netBonus + annuityAmount,
      isBest: false,
    };
  })();
  
  const validScenarios = [scenarioA, scenarioB, ...(scenarioC ? [scenarioC] : [])];
  const bestIndex = validScenarios.reduce((best, curr, i) => 
    curr.netAmount > validScenarios[best].netAmount ? i : best, 0);
  validScenarios[bestIndex].isBest = true;
  
  return { scenarios: validScenarios };
}

// ---- Mode 4: 月次収支チェック ----
interface Mode4Result {
  monthlyBalance: number;
  yearlyBalance: number;
  requiredWithdrawal: number;
  incomeBreakdown: Array<{ name: string; value: number; color: string }>;
  expenseBreakdown: Array<{ name: string; value: number; color: string }>;
}

function calcMode4(
  pensionIncome: number,
  idecoAnnuity: number,
  nisaWithdrawal: number,
  otherIncome: number,
  livingExpenses: number,
  medicalExpenses: number,
  hobbyExpenses: number,
  otherExpenses: number
): Mode4Result {
  const totalIncome = pensionIncome + idecoAnnuity + nisaWithdrawal + otherIncome;
  const totalExpenses = livingExpenses + medicalExpenses + hobbyExpenses + otherExpenses;
  const monthlyBalance = totalIncome - totalExpenses;
  const yearlyBalance = monthlyBalance * 12;
  const requiredWithdrawal = monthlyBalance < 0 ? -monthlyBalance : 0;
  
  return {
    monthlyBalance,
    yearlyBalance,
    requiredWithdrawal,
    incomeBreakdown: [
      { name: "公的年金", value: pensionIncome, color: "#3B82F6" },
      { name: "iDeCo年金", value: idecoAnnuity, color: "#10B981" },
      { name: "NISA取崩", value: nisaWithdrawal, color: "#F59E0B" },
      { name: "その他", value: otherIncome, color: "#8B5CF6" },
    ],
    expenseBreakdown: [
      { name: "生活費", value: livingExpenses, color: "#EF4444" },
      { name: "医療費", value: medicalExpenses, color: "#F97316" },
      { name: "趣味・旅行", value: hobbyExpenses, color: "#EC4899" },
      { name: "その他", value: otherExpenses, color: "#6B7280" },
    ],
  };
}

// ---- Main Component ----
export default function RetirementSimulatorClient() {
  const { triggerSuccess } = usePricingContext();
  const [mode, setMode] = useState<Mode>(1);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Mode 1 States
  const [m1CurrentAge, setM1CurrentAge] = useState(40);
  const [m1RetirementAge, setM1RetirementAge] = useState(65);
  const [m1LifeExpectancy, setM1LifeExpectancy] = useState(90);
  const [m1Gender, setM1Gender] = useState<Gender>("male");
  const [m1JobType, setM1JobType] = useState<JobType>("company");
  const [m1AnnualIncome, setM1AnnualIncome] = useState(500);
  const [m1PensionYears, setM1PensionYears] = useState(25);
  const [m1AutoEstimate, setM1AutoEstimate] = useState(true);
  const [m1MonthlyPension, setM1MonthlyPension] = useState(15);
  const [m1SpousePension, setM1SpousePension] = useState(0);
  const [m1RetirementBonus, setM1RetirementBonus] = useState(1500);
  const [m1OtherIncome, setM1OtherIncome] = useState(5);
  const [m1CurrentSavings, setM1CurrentSavings] = useState(500);
  const [m1CurrentIdeco, setM1CurrentIdeco] = useState(300);
  const [m1CurrentNisa, setM1CurrentNisa] = useState(200);
  const [m1IdecoMonthly, setM1IdecoMonthly] = useState(2);
  const [m1NisaMonthly, setM1NisaMonthly] = useState(3);
  const [m1SavingsMonthly, setM1SavingsMonthly] = useState(5);
  const [m1ReturnRate, setM1ReturnRate] = useState(3);
  const [m1MonthlyExpenses, setM1MonthlyExpenses] = useState(25);
  const [m1MedicalExpenses, setM1MedicalExpenses] = useState(2);
  const [m1InflationRate, setM1InflationRate] = useState(1);
  const [m1TableOpen, setM1TableOpen] = useState(false);
  
  // Mode 2 States
  const [m2InitialAssets, setM2InitialAssets] = useState(5000);
  const [m2MonthlyPension, setM2MonthlyPension] = useState(20);
  const [m2MonthlyExpenses, setM2MonthlyExpenses] = useState(30);
  const [m2ReturnRate, setM2ReturnRate] = useState(3);
  const [m2WithdrawalMethod, setM2WithdrawalMethod] = useState<WithdrawalMethod>("fixed");
  const [m2FixedAmount, setM2FixedAmount] = useState(10);
  const [m2PercentageRate, setM2PercentageRate] = useState(4);
  const [m2InflationRate, setM2InflationRate] = useState(1);
  const [m2RetirementAge, setM2RetirementAge] = useState(65);
  
  // Mode 3 States
  const [m3IdecoBalance, setM3IdecoBalance] = useState(1000);
  const [m3IdecoYears, setM3IdecoYears] = useState(20);
  const [m3RetirementBonus, setM3RetirementBonus] = useState(2000);
  const [m3RetirementAge, setM3RetirementAge] = useState(60);
  const [m3ReceiveAge, setM3ReceiveAge] = useState(65);
  const [m3ReceiveMethod, setM3ReceiveMethod] = useState<iDeCoReceiveMethod>("lump");
  const [m3LumpPercentage, setM3LumpPercentage] = useState(50);
  
  // Mode 4 States
  const [m4PensionIncome, setM4PensionIncome] = useState(18);
  const [m4IdecoAnnuity, setM4IdecoAnnuity] = useState(5);
  const [m4NisaWithdrawal, setM4NisaWithdrawal] = useState(3);
  const [m4OtherIncome, setM4OtherIncome] = useState(2);
  const [m4LivingExpenses, setM4LivingExpenses] = useState(25);
  const [m4MedicalExpenses, setM4MedicalExpenses] = useState(3);
  const [m4HobbyExpenses, setM4HobbyExpenses] = useState(5);
  const [m4OtherExpenses, setM4OtherExpenses] = useState(2);
  
  // SEO Sections
  const [seoOpen, setSeoOpen] = useState<number | null>(null);

  // Auto-estimate pension
  useEffect(() => {
    if (m1AutoEstimate) {
      const basePension = BASE_PENSION_ANNUAL / 12; // 月額基礎年金
      let estimated = basePension;
      
      switch (m1JobType) {
        case "company":
          estimated = basePension + (m1AnnualIncome * m1PensionYears * 0.005481) / 12;
          break;
        case "self":
          estimated = basePension;
          break;
        case "public":
          estimated = basePension + (m1AnnualIncome * m1PensionYears * 0.005481 * 1.1) / 12;
          break;
        case "housewife":
          estimated = basePension * 0.5; // 配偶者の一部
          break;
      }
      
      setM1MonthlyPension(Math.round(estimated * 10) / 10);
    }
  }, [m1AutoEstimate, m1JobType, m1AnnualIncome, m1PensionYears]);

  // Calculations
  const mode1Result = useMemo(() => calcMode1(
    m1CurrentAge, m1RetirementAge, m1LifeExpectancy,
    m1MonthlyPension, m1SpousePension, m1RetirementBonus, m1OtherIncome,
    m1CurrentSavings, m1CurrentIdeco, m1CurrentNisa,
    m1IdecoMonthly, m1NisaMonthly, m1SavingsMonthly, m1ReturnRate,
    m1MonthlyExpenses, m1MedicalExpenses, m1InflationRate
  ), [m1CurrentAge, m1RetirementAge, m1LifeExpectancy, m1MonthlyPension, m1SpousePension, m1RetirementBonus, m1OtherIncome, m1CurrentSavings, m1CurrentIdeco, m1CurrentNisa, m1IdecoMonthly, m1NisaMonthly, m1SavingsMonthly, m1ReturnRate, m1MonthlyExpenses, m1MedicalExpenses, m1InflationRate]);

  const mode2Result = useMemo(() => calcMode2(
    m2InitialAssets, m2MonthlyPension, m2MonthlyExpenses, m2ReturnRate,
    m2WithdrawalMethod, m2FixedAmount, m2PercentageRate, m2InflationRate, m2RetirementAge
  ), [m2InitialAssets, m2MonthlyPension, m2MonthlyExpenses, m2ReturnRate, m2WithdrawalMethod, m2FixedAmount, m2PercentageRate, m2InflationRate, m2RetirementAge]);

  const mode3Result = useMemo(() => calcMode3(
    m3IdecoBalance, m3IdecoYears, m3RetirementBonus, m3RetirementAge,
    m3ReceiveAge, m3ReceiveMethod, m3LumpPercentage
  ), [m3IdecoBalance, m3IdecoYears, m3RetirementBonus, m3RetirementAge, m3ReceiveAge, m3ReceiveMethod, m3LumpPercentage]);

  const mode4Result = useMemo(() => calcMode4(
    m4PensionIncome, m4IdecoAnnuity, m4NisaWithdrawal, m4OtherIncome,
    m4LivingExpenses, m4MedicalExpenses, m4HobbyExpenses, m4OtherExpenses
  ), [m4PensionIncome, m4IdecoAnnuity, m4NisaWithdrawal, m4OtherIncome, m4LivingExpenses, m4MedicalExpenses, m4HobbyExpenses, m4OtherExpenses]);

  // Handlers
  const handleCopy = useCallback(() => {
    let lines: string[] = [];
    
    if (mode === 1) {
      lines = [
        "【老後資金シミュレーション結果】",
        `退職時総資産: ${fmtManR(mode1Result.retirementAssets * MAN)}万円`,
        `必要総資金: ${fmtManR(mode1Result.requiredFunds * MAN)}万円`,
        mode1Result.surplus >= 0 
          ? `✅ 余剰: ${fmtManR(mode1Result.surplus * MAN)}万円`
          : `❌ 不足: ${fmtManR(-mode1Result.surplus * MAN)}万円`,
        mode1Result.additionalMonthlyNeeded > 0 
          ? `追加積立必要額: 月${fmtManR(mode1Result.additionalMonthlyNeeded * MAN)}万円`
          : "",
      ];
    } else if (mode === 2) {
      lines = [
        "【資産寿命シミュレーション結果】",
        `資産寿命: ${mode2Result.assetLifespan}年`,
        mode2Result.depletionAge > m2RetirementAge 
          ? `資産尽きる年齢: ${mode2Result.depletionAge}歳`
          : "資産は尽きません",
      ];
    } else if (mode === 3) {
      const best = mode3Result.scenarios.find(s => s.isBest);
      lines = [
        "【iDeCo出口戦略シミュレーション結果】",
        `最適シナリオ: ${best?.name}`,
        `手取り額: ${fmtManR((best?.netAmount || 0) * MAN)}万円`,
      ];
    } else {
      lines = [
        "【老後月次収支チェック結果】",
        `月次収支: ${mode4Result.monthlyBalance >= 0 ? "黒字" : "赤字"} ${fmtManR(Math.abs(mode4Result.monthlyBalance) * MAN)}万円`,
        `年間収支: ${fmtManR(Math.abs(mode4Result.yearlyBalance) * MAN)}万円`,
      ];
    }
    
    navigator.clipboard.writeText(lines.filter(Boolean).join("\n")).then(() => alert("コピーしました！"));
  }, [mode, mode1Result, mode2Result, mode3Result, mode4Result, m2RetirementAge]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const h2c = (await import("html2canvas")).default;
      const canvas = await h2c(resultRef.current, { scale: 2, useCORS: true });
      const a = document.createElement("a");
      a.download = `retirement-simulator-mode${mode}.png`;
      a.href = canvas.toDataURL();
      a.click();
      triggerSuccess('retirement-simulator');
    } catch { alert("画像保存に失敗しました。"); }
  }, [mode]);

  // Preset buttons for expenses
  const expensePresets = [
    { label: "質素", value: 20 },
    { label: "標準", value: 25 },
    { label: "ゆとり", value: 35 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">老後資金シミュレーター</h1>
          <p className="text-emerald-100 text-sm">年金・iDeCo・NISA・退職金・取り崩し完全対応 | インフレ対応・2026年10年ルール対応</p>
        </div>
      </div>

      {/* Sticky Mode Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {([
              [1, "老後資金総合シミュ"],
              [2, "資産寿命・取り崩し"],
              [3, "iDeCo出口戦略"],
              [4, "月次収支チェック"],
            ] as const).map(([m, label]) => (
              <button type="button" key={m} onClick={() => setMode(m as Mode)}
                className={"whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 transition-all " + (mode === m ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AdSense slot 1: after mode tabs */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="adsense-slot my-6" data-ad-slot="auto"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6" ref={resultRef}>
        {/* ===== MODE 1: 総合シミュレーション ===== */}
        {mode === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Inputs */}
              <div className="lg:col-span-1 space-y-5">
                {/* Section A: 基本情報 */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">A</span>
                    基本情報
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        現在の年齢: <span className="font-bold text-emerald-600">{m1CurrentAge}歳</span>
                      </label>
                      <input type="range" min={20} max={65} step={1} value={m1CurrentAge}
                        onChange={e => setM1CurrentAge(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>20歳</span><span>65歳</span></div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        退職予定年齢: <span className="font-bold text-emerald-600">{m1RetirementAge}歳</span>
                      </label>
                      <input type="range" min={55} max={70} step={1} value={m1RetirementAge}
                        onChange={e => setM1RetirementAge(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>55歳</span><span>70歳</span></div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        想定寿命: <span className="font-bold text-emerald-600">{m1LifeExpectancy}歳</span>
                      </label>
                      <input type="range" min={70} max={100} step={1} value={m1LifeExpectancy}
                        onChange={e => setM1LifeExpectancy(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>70歳</span><span>100歳</span></div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">性別</label>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        {([["male", "男性"], ["female", "女性"]] as const).map(([val, label]) => (
                          <button type="button" key={val} onClick={() => setM1Gender(val)}
                            className={"flex-1 py-1.5 text-xs transition-all " + (m1Gender === val ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: 収入源 */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">B</span>
                    収入源（老後）
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">年金自動見積</label>
                      <button type="button" onClick={() => setM1AutoEstimate(!m1AutoEstimate)}
                        className={"relative inline-flex h-5 w-10 rounded-full transition-colors " + (m1AutoEstimate ? "bg-emerald-500" : "bg-gray-300")}>
                        <span className={"inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 " + (m1AutoEstimate ? "translate-x-5" : "translate-x-1")} />
                      </button>
                    </div>
                    
                    {m1AutoEstimate ? (
                      <>
                        <div>
                          <label className="text-sm text-gray-600 block mb-2">職業</label>
                          <select value={m1JobType} onChange={e => setM1JobType(e.target.value as JobType)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="company">会社員</option>
                            <option value="self">自営業</option>
                            <option value="public">公務員</option>
                            <option value="housewife">専業主婦/夫</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 block mb-1">
                            現在の年収: <span className="font-bold text-emerald-600">{m1AnnualIncome}万円</span>
                          </label>
                          <input type="range" min={200} max={2000} step={50} value={m1AnnualIncome}
                            onChange={e => setM1AnnualIncome(Number(e.target.value))}
                            className="w-full accent-emerald-600" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 block mb-1">
                            年金加入年数: <span className="font-bold text-emerald-600">{m1PensionYears}年</span>
                          </label>
                          <input type="range" min={10} max={45} step={1} value={m1PensionYears}
                            onChange={e => setM1PensionYears(Number(e.target.value))}
                            className="w-full accent-emerald-600" />
                        </div>
                      </>
                    ) : null}
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        公的年金（月額）: <span className="font-bold text-emerald-600">{m1MonthlyPension}万円</span>
                      </label>
                      <input type="number" min={0} max={50} step={0.1} value={m1MonthlyPension}
                        onChange={e => setM1MonthlyPension(Number(e.target.value))}
                        disabled={m1AutoEstimate}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100" />
                      <p className="text-xs text-gray-400 mt-1">ねんきん定期便の金額を入力</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        配偶者の年金（月額）: <span className="font-bold text-emerald-600">{m1SpousePension}万円</span>
                      </label>
                      <input type="number" min={0} max={50} step={0.1} value={m1SpousePension}
                        onChange={e => setM1SpousePension(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        退職金: <span className="font-bold text-emerald-600">{m1RetirementBonus}万円</span>
                      </label>
                      <input type="number" min={0} max={10000} step={100} value={m1RetirementBonus}
                        onChange={e => setM1RetirementBonus(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        その他収入（月額）: <span className="font-bold text-emerald-600">{m1OtherIncome}万円</span>
                      </label>
                      <input type="number" min={0} max={50} step={0.5} value={m1OtherIncome}
                        onChange={e => setM1OtherIncome(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <p className="text-xs text-gray-400 mt-1">アルバイト等</p>
                    </div>
                  </div>
                </div>

                {/* Section C: 資産 */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">C</span>
                    資産・積立
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        現在の貯蓄額: <span className="font-bold text-emerald-600">{m1CurrentSavings}万円</span>
                      </label>
                      <input type="range" min={0} max={5000} step={100} value={m1CurrentSavings}
                        onChange={e => setM1CurrentSavings(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        現在のiDeCo残高: <span className="font-bold text-emerald-600">{m1CurrentIdeco}万円</span>
                      </label>
                      <input type="range" min={0} max={3000} step={50} value={m1CurrentIdeco}
                        onChange={e => setM1CurrentIdeco(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        現在のNISA残高: <span className="font-bold text-emerald-600">{m1CurrentNisa}万円</span>
                      </label>
                      <input type="range" min={0} max={3000} step={50} value={m1CurrentNisa}
                        onChange={e => setM1CurrentNisa(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">毎月積立額</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">iDeCo: {m1IdecoMonthly}万円</label>
                          <input type="range" min={0} max={10} step={0.5} value={m1IdecoMonthly}
                            onChange={e => setM1IdecoMonthly(Number(e.target.value))}
                            className="w-full accent-emerald-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">NISA: {m1NisaMonthly}万円</label>
                          <input type="range" min={0} max={10} step={0.5} value={m1NisaMonthly}
                            onChange={e => setM1NisaMonthly(Number(e.target.value))}
                            className="w-full accent-emerald-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">普通貯蓄: {m1SavingsMonthly}万円</label>
                          <input type="range" min={0} max={20} step={0.5} value={m1SavingsMonthly}
                            onChange={e => setM1SavingsMonthly(Number(e.target.value))}
                            className="w-full accent-emerald-600" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        想定運用利回り: <span className="font-bold text-emerald-600">{m1ReturnRate}%</span>
                      </label>
                      <input type="range" min={0} max={8} step={0.5} value={m1ReturnRate}
                        onChange={e => setM1ReturnRate(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>0%</span><span>8%</span></div>
                    </div>
                  </div>
                </div>

                {/* Section D: 支出 */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">D</span>
                    支出（老後）
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">
                        老後の毎月生活費: <span className="font-bold text-emerald-600">{m1MonthlyExpenses}万円</span>
                      </label>
                      <div className="flex gap-2 mb-2">
                        {expensePresets.map(preset => (
                          <button type="button" key={preset.label} onClick={() => setM1MonthlyExpenses(preset.value)}
                            className={"px-3 py-1 rounded-lg text-xs transition-all " + (m1MonthlyExpenses === preset.value ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                            {preset.label} {preset.value}万
                          </button>
                        ))}
                      </div>
                      <input type="range" min={10} max={100} step={1} value={m1MonthlyExpenses}
                        onChange={e => setM1MonthlyExpenses(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        医療・介護費（月額）: <span className="font-bold text-emerald-600">{m1MedicalExpenses}万円</span>
                      </label>
                      <input type="range" min={0} max={20} step={0.5} value={m1MedicalExpenses}
                        onChange={e => setM1MedicalExpenses(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        インフレ率: <span className="font-bold text-emerald-600">{m1InflationRate}%</span>
                        <span className="ml-2 text-xs bg-gray-50 text-kon px-2 py-0.5 rounded">他社未対応機能</span>
                      </label>
                      <input type="range" min={0} max={3} step={0.5} value={m1InflationRate}
                        onChange={e => setM1InflationRate(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                      <div className="flex justify-between text-xs text-gray-400"><span>0%</span><span>3%</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Results */}
              <div className="lg:col-span-2 space-y-4">
                {/* Results Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">退職時の総資産額</p>
                    <p className="text-2xl font-bold text-emerald-700">{fmtManR(mode1Result.retirementAssets * MAN)}<span className="text-sm font-normal">万円</span></p>
                    <p className="text-xs text-gray-400 mt-1">
                      貯蓄+{fmtManR(compoundInterest(m1CurrentSavings * MAN, m1SavingsMonthly * MAN, m1ReturnRate, m1RetirementAge - m1CurrentAge))}万 
                      / iDeCo+{fmtManR(compoundInterest(m1CurrentIdeco * MAN, m1IdecoMonthly * MAN, m1ReturnRate, m1RetirementAge - m1CurrentAge))}万
                      / NISA+{fmtManR(compoundInterest(m1CurrentNisa * MAN, m1NisaMonthly * MAN, m1ReturnRate, m1RetirementAge - m1CurrentAge))}万
                      / 退職金{m1RetirementBonus}万
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">老後に必要な総資金</p>
                    <p className="text-2xl font-bold text-kon">{fmtManR(mode1Result.requiredFunds * MAN)}<span className="text-sm font-normal">万円</span></p>
                    <p className="text-xs text-gray-400 mt-1">インフレ{m1InflationRate}%考慮</p>
                  </div>
                </div>

                {/* Surplus/Deficit Banner */}
                {mode1Result.surplus >= 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold text-green-800">老後資金は十分です</p>
                      <p className="text-sm text-green-700">余剰額: {fmtManR(mode1Result.surplus * MAN)}万円</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">❌</span>
                      <p className="font-bold text-danger">老後資金が不足します</p>
                    </div>
                    <p className="text-sm text-danger mb-2">不足額: {fmtManR(-mode1Result.surplus * MAN)}万円</p>
                    {mode1Result.additionalMonthlyNeeded > 0 && (
                      <div className="bg-white rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-700">
                          不足を補うには、今から毎月<span className="font-bold text-danger text-lg">{fmtManR(mode1Result.additionalMonthlyNeeded * MAN)}万円</span>追加積立が必要です
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Asset Depletion Warning */}
                {mode1Result.assetDepletionAge && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-bold text-kon">資産が尽きる年齢: {mode1Result.assetDepletionAge}歳</p>
                      <p className="text-sm text-kon">その後は年金のみでの生活になります</p>
                    </div>
                  </div>
                )}

                {/* AdSense slot 2: between results and chart */}
                <div className="adsense-slot my-6" data-ad-slot="auto"></div>

                {/* Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">資産推移シミュレーション</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mode1Result.yearlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="age" tickFormatter={v => v + "歳"} tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => v + "万"} tick={{ fontSize: 11 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <ReferenceLine y={0} stroke="#666" />
                      {mode1Result.assetDepletionAge && (
                        <ReferenceLine x={mode1Result.assetDepletionAge} stroke="#EF4444" strokeDasharray="5 5" label={{ value: "資産尽きる", fill: "#EF4444", fontSize: 10 }} />
                      )}
                      <Area type="monotone" dataKey="assets" name="総資産" stroke="#10B981" fillOpacity={1} fill="url(#colorAssets)" strokeWidth={2} />
                      <Line type="monotone" dataKey="pensionIncome" name="年金収入" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="expenses" name="支出" stroke="#EF4444" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Yearly Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <button type="button" onClick={() => setM1TableOpen(!m1TableOpen)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700">
                    <span>年別シミュレーション詳細</span>
                    <span>{m1TableOpen ? "▲" : "▼"}</span>
                  </button>
                  {m1TableOpen && (
                    <div className="overflow-x-auto px-4 pb-4">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-2 text-left">年齢</th>
                            <th className="py-2 px-2 text-right">年金収入</th>
                            <th className="py-2 px-2 text-right">その他収入</th>
                            <th className="py-2 px-2 text-right">生活費</th>
                            <th className="py-2 px-2 text-right">収支</th>
                            <th className="py-2 px-2 text-right">残資産</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mode1Result.yearlyData.map((row, i) => (
                            <tr key={i} className={"border-t border-gray-100 " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                              <td className="py-1.5 px-2">{row.age}歳</td>
                              <td className="py-1.5 px-2 text-right">{fmtManR(row.pensionIncome * MAN)}万</td>
                              <td className="py-1.5 px-2 text-right">{fmtManR(row.otherIncome * MAN)}万</td>
                              <td className="py-1.5 px-2 text-right">{fmtManR(row.expenses * MAN)}万</td>
                              <td className={"py-1.5 px-2 text-right " + (row.balance >= 0 ? "text-green-600" : "text-danger")}>
                                {row.balance >= 0 ? "+" : ""}{fmtManR(row.balance * MAN)}万
                              </td>
                              <td className="py-1.5 px-2 text-right font-medium">{fmtManR(row.assets * MAN)}万</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODE 2: 資産寿命・取り崩し ===== */}
        {mode === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">取り崩し条件</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      退職時資産総額: <span className="font-bold text-emerald-600">{m2InitialAssets}万円</span>
                    </label>
                    <input type="range" min={1000} max={20000} step={100} value={m2InitialAssets}
                      onChange={e => setM2InitialAssets(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      毎月の年金収入: <span className="font-bold text-emerald-600">{m2MonthlyPension}万円</span>
                    </label>
                    <input type="range" min={0} max={50} step={1} value={m2MonthlyPension}
                      onChange={e => setM2MonthlyPension(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      毎月の生活費: <span className="font-bold text-emerald-600">{m2MonthlyExpenses}万円</span>
                    </label>
                    <input type="range" min={10} max={100} step={1} value={m2MonthlyExpenses}
                      onChange={e => setM2MonthlyExpenses(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      運用利回り（取崩中）: <span className="font-bold text-emerald-600">{m2ReturnRate}%</span>
                    </label>
                    <input type="range" min={0} max={5} step={0.5} value={m2ReturnRate}
                      onChange={e => setM2ReturnRate(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      インフレ率: <span className="font-bold text-emerald-600">{m2InflationRate}%</span>
                    </label>
                    <input type="range" min={0} max={3} step={0.5} value={m2InflationRate}
                      onChange={e => setM2InflationRate(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">取り崩し方法</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      {([["fixed", "定額取崩"], ["percentage", "定率取崩(4%ルール)"]] as const).map(([val, label]) => (
                        <button type="button" key={val} onClick={() => setM2WithdrawalMethod(val)}
                          className={"flex-1 py-1.5 text-xs transition-all " + (m2WithdrawalMethod === val ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {m2WithdrawalMethod === "fixed" ? (
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        毎月取り崩し額: <span className="font-bold text-emerald-600">{m2FixedAmount}万円</span>
                      </label>
                      <input type="range" min={0} max={50} step={1} value={m2FixedAmount}
                        onChange={e => setM2FixedAmount(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        年率（4%ルール）: <span className="font-bold text-emerald-600">{m2PercentageRate}%</span>
                      </label>
                      <input type="range" min={1} max={10} step={0.5} value={m2PercentageRate}
                        onChange={e => setM2PercentageRate(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {/* Results */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-1">資産寿命</p>
                  <p className="text-2xl font-bold text-emerald-700">{mode2Result.assetLifespan}<span className="text-sm font-normal">年</span></p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-1">資産尽きる年齢</p>
                  <p className="text-2xl font-bold text-kon">{mode2Result.depletionAge}<span className="text-sm font-normal">歳</span></p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-1">月間不足額</p>
                  <p className="text-2xl font-bold text-kon">
                    {Math.max(0, m2MonthlyExpenses - m2MonthlyPension - (m2WithdrawalMethod === "fixed" ? m2FixedAmount : Math.round(m2InitialAssets * m2PercentageRate / 100 / 12)))}
                    <span className="text-sm font-normal">万円</span>
                  </p>
                </div>
              </div>

              {/* AdSense slot 2 */}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>

              {/* Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">資産残高推移比較</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mode2Result.comparisonData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tickFormatter={v => v + "歳"} tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => v + "万"} tick={{ fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="fixedWithdrawal" name="定額取崩し" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="percentageWithdrawal" name="定率取崩し" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="noWithdrawal" name="取崩しなし（運用のみ）" stroke="#9CA3AF" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Explanation */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-kon mb-2">取り崩し方法の比較</h4>
                <div className="space-y-2 text-sm text-kon">
                  <p><strong>定額取り崩し：</strong>毎月決まった額を取り崩す。予算管理がしやすいが、インフレに弱い。</p>
                  <p><strong>定率取り崩し（4%ルール）：</strong>資産の一定率を取り崩す。資産に応じて調整されるが、収入が変動する。</p>
                  <p><strong>取り崩しなし：</strong>年金と運用収入のみで生活。資産を残せるが、生活水準が制限される。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODE 3: iDeCo出口戦略 ===== */}
        {mode === 3 && (
          <div className="space-y-6">
            {/* 10年ルール Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-kon">
                <span className="font-bold">📢 2025年改正 10年ルール対応</span><br />
                2026年1月より、iDeCoの一時金受取から10年以内に退職金を受け取ると、退職所得控除が制限されます。受取タイミングを工夫することで節税効果が大きく変わります。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4">iDeCo・退職金情報</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        iDeCo残高: <span className="font-bold text-emerald-600">{m3IdecoBalance}万円</span>
                      </label>
                      <input type="range" min={0} max={5000} step={50} value={m3IdecoBalance}
                        onChange={e => setM3IdecoBalance(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        iDeCo積立年数: <span className="font-bold text-emerald-600">{m3IdecoYears}年</span>
                      </label>
                      <input type="range" min={1} max={40} step={1} value={m3IdecoYears}
                        onChange={e => setM3IdecoYears(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        退職金額: <span className="font-bold text-emerald-600">{m3RetirementBonus}万円</span>
                      </label>
                      <input type="range" min={0} max={10000} step={100} value={m3RetirementBonus}
                        onChange={e => setM3RetirementBonus(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        退職予定年齢: <span className="font-bold text-emerald-600">{m3RetirementAge}歳</span>
                      </label>
                      <input type="range" min={50} max={70} step={1} value={m3RetirementAge}
                        onChange={e => setM3RetirementAge(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        iDeCo受取開始年齢: <span className="font-bold text-emerald-600">{m3ReceiveAge}歳</span>
                      </label>
                      <input type="range" min={60} max={75} step={1} value={m3ReceiveAge}
                        onChange={e => setM3ReceiveAge(Number(e.target.value))}
                        className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">受取方法</label>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        {([["lump", "一時金"], ["annuity", "年金"], ["both", "併用"]] as const).map(([val, label]) => (
                          <button type="button" key={val} onClick={() => setM3ReceiveMethod(val)}
                            className={"flex-1 py-1.5 text-xs transition-all " + (m3ReceiveMethod === val ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {m3ReceiveMethod === "both" && (
                      <div>
                        <label className="text-sm text-gray-600 block mb-1">
                          一時金割合: <span className="font-bold text-emerald-600">{m3LumpPercentage}%</span>
                        </label>
                        <input type="range" min={0} max={100} step={10} value={m3LumpPercentage}
                          onChange={e => setM3LumpPercentage(Number(e.target.value))}
                          className="w-full accent-emerald-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 退職所得控除説明 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-kon mb-2">退職所得控除の計算</h4>
                  <p className="text-sm text-kon mb-2">
                    勤続20年以下: 40万円 × 年数<br />
                    勤続20年超: 800万円 + 70万円 × (年数 - 20)
                  </p>
                  <p className="text-sm text-kon">
                    退職所得 = (一時金 - 退職所得控除) × 1/2
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {/* Scenario Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mode3Result.scenarios.map((scenario, idx) => (
                    <div key={idx} className={`rounded-xl shadow-sm border p-4 ${scenario.isBest ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                      {scenario.isBest && (
                        <div className="mb-2">
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">💰 最も節税できます</span>
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-800 mb-3">{scenario.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">控除額</span>
                          <span className="font-medium">{fmtManR(scenario.deduction * MAN)}万円</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">課税所得</span>
                          <span className="font-medium">{fmtManR(scenario.taxableIncome * MAN)}万円</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">所得税</span>
                          <span className="font-medium">{fmtManR(scenario.incomeTax * MAN)}万円</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">住民税</span>
                          <span className="font-medium">{fmtManR(scenario.residentTax * MAN)}万円</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">手取り額</span>
                            <span className="font-bold text-emerald-700">{fmtManR(scenario.netAmount * MAN)}万円</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 10年ルール警告 */}
                {Math.abs(m3RetirementAge - m3ReceiveAge) < 10 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-danger">
                      <span className="font-bold">⚠️ 10年ルールが適用されます</span><br />
                      iDeCo一時金受取から10年以内に退職金を受け取るため、退職所得控除からiDeCo積立年数分を控除して計算されます。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== MODE 4: 月次収支チェック ===== */}
        {mode === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              {/* Income Inputs */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">入</span>
                  月収入
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      公的年金: <span className="font-bold text-emerald-600">{m4PensionIncome}万円</span>
                    </label>
                    <input type="range" min={0} max={50} step={1} value={m4PensionIncome}
                      onChange={e => setM4PensionIncome(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      iDeCo年金: <span className="font-bold text-emerald-600">{m4IdecoAnnuity}万円</span>
                    </label>
                    <input type="range" min={0} max={20} step={0.5} value={m4IdecoAnnuity}
                      onChange={e => setM4IdecoAnnuity(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      NISA取り崩し: <span className="font-bold text-emerald-600">{m4NisaWithdrawal}万円</span>
                    </label>
                    <input type="range" min={0} max={20} step={0.5} value={m4NisaWithdrawal}
                      onChange={e => setM4NisaWithdrawal(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      その他収入: <span className="font-bold text-emerald-600">{m4OtherIncome}万円</span>
                    </label>
                    <input type="range" min={0} max={20} step={0.5} value={m4OtherIncome}
                      onChange={e => setM4OtherIncome(Number(e.target.value))}
                      className="w-full accent-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Expense Inputs */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 text-danger flex items-center justify-center text-xs">出</span>
                  月支出
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      生活費: <span className="font-bold text-danger">{m4LivingExpenses}万円</span>
                    </label>
                    <input type="range" min={10} max={100} step={1} value={m4LivingExpenses}
                      onChange={e => setM4LivingExpenses(Number(e.target.value))}
                      className="w-full accent-red-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      医療費: <span className="font-bold text-danger">{m4MedicalExpenses}万円</span>
                    </label>
                    <input type="range" min={0} max={20} step={0.5} value={m4MedicalExpenses}
                      onChange={e => setM4MedicalExpenses(Number(e.target.value))}
                      className="w-full accent-red-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      趣味・旅行: <span className="font-bold text-danger">{m4HobbyExpenses}万円</span>
                    </label>
                    <input type="range" min={0} max={30} step={0.5} value={m4HobbyExpenses}
                      onChange={e => setM4HobbyExpenses(Number(e.target.value))}
                      className="w-full accent-red-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      その他支出: <span className="font-bold text-danger">{m4OtherExpenses}万円</span>
                    </label>
                    <input type="range" min={0} max={20} step={0.5} value={m4OtherExpenses}
                      onChange={e => setM4OtherExpenses(Number(e.target.value))}
                      className="w-full accent-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Balance Summary */}
              <div className={`rounded-xl shadow-sm border p-5 ${mode4Result.monthlyBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-semibold text-gray-800 mb-4">収支サマリー</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">月次収支</p>
                    <p className={`text-2xl font-bold ${mode4Result.monthlyBalance >= 0 ? 'text-green-700' : 'text-danger'}`}>
                      {mode4Result.monthlyBalance >= 0 ? '+' : ''}{fmtManR(mode4Result.monthlyBalance * MAN)}<span className="text-sm font-normal">万円</span>
                    </p>
                    <p className="text-xs text-gray-400">{mode4Result.monthlyBalance >= 0 ? '黒字' : '赤字'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">年間収支</p>
                    <p className={`text-2xl font-bold ${mode4Result.yearlyBalance >= 0 ? 'text-green-700' : 'text-danger'}`}>
                      {mode4Result.yearlyBalance >= 0 ? '+' : ''}{fmtManR(mode4Result.yearlyBalance * MAN)}<span className="text-sm font-normal">万円</span>
                    </p>
                    <p className="text-xs text-gray-400">年間</p>
                  </div>
                </div>
                {mode4Result.requiredWithdrawal > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      資産からの補填が必要: <span className="font-bold text-danger">月{fmtManR(mode4Result.requiredWithdrawal * MAN)}万円</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Income vs Expense Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">収入・支出内訳</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">収入内訳（合計: {m4PensionIncome + m4IdecoAnnuity + m4NisaWithdrawal + m4OtherIncome}万円）</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={mode4Result.incomeBreakdown} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => [`${v}万円`, '']} />
                        <Bar dataKey="value">
                          {mode4Result.incomeBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">支出内訳（合計: {m4LivingExpenses + m4MedicalExpenses + m4HobbyExpenses + m4OtherExpenses}万円）</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={mode4Result.expenseBreakdown} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => [`${v}万円`, '']} />
                        <Bar dataKey="value">
                          {mode4Result.expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share/Export Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button type="button" onClick={handleCopy}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <span>📋</span> 結果をコピー
          </button>
          <button type="button" onClick={handleSaveImage}
            className="px-6 py-3 bg-kon text-white rounded-xl font-medium hover:bg-ai transition-colors flex items-center gap-2">
            <span>💾</span> 画像として保存
          </button>
        </div>

        <ValueReminderInline />

        {/* AdSense slot 3: below withdrawal simulation section */}
        <div className="adsense-slot my-8" data-ad-slot="auto"></div>

        {/* SEO Collapsible Sections */}
        <div className="mt-12 space-y-3">
          <h2 className="text-xl font-bold text-gray-800 mb-4">老後資金に関する知識</h2>
          
          {[
            {
              id: 1,
              title: "老後2000万円問題とは",
              content: "金融庁が2019年に発表した報告書で指摘された問題で、定年後に公的年金だけでは生活費が不足し、約2000万円の資金が必要となる可能性があるとされました。寿命の延伸やインフレの影響を考慮すると、実際にはそれ以上の準備が必要な場合もあります。早めの資産形成が重要です。"
            },
            {
              id: 2,
              title: "老後 公的年金 いくらもらえる 計算",
              content: "公的年金は「基礎年金」と「厚生年金」の2つから構成されます。基礎年金は満額で年間約78万円（月約6.5万円）です。厚生年金は年収と加入年数に応じて増加し、会社員の場合は年収400万円・加入40年で月約14万円程度の見込みとなります。ねんきん定期便で自分の見込み額を確認しましょう。"
            },
            {
              id: 3,
              title: "老後資金 インフレ 影響 計算",
              content: "年率2%のインフレが30年続くと、物価は約1.8倍に上昇します。つまり、現在月25万円で生活できても、30年後には月45万円が必要になります。現金だけで資産を保有していると購買力が大きく低下するため、インフレに強い資産運用（株式・不動産等）が重要となります。"
            },
            {
              id: 4,
              title: "老後 資産寿命 何年持つ 計算",
              content: "資産寿命は、保有資産と毎月の収支から計算できます。例えば退職時に3000万円の資産があり、毎月10万円の赤字なら25年間（90歳まで）資産が持ちます。4%ルールに従えば、資産の年間4%を取り崩せば30年以上持続する経験則があります。"
            },
            {
              id: 5,
              title: "iDeCo 出口戦略 退職金 10年ルール 2026",
              content: "iDeCoは掛金が所得控除され、運用益も非課税、受取時も退職所得控除の対象となる「トリプルメリット」があります。NISAは運用益が非課税で、老後に取り崩す際も課税されません。iDeCoは60歳以降の受取が基本ですが、2026年1月から10年ルールが適用され、iDeCo一時金受取から10年以内に退職金を受け取ると控除が制限されます。受取タイミングを工夫することが重要です。"
            },
            {
              id: 6,
              title: "老後 取り崩し 定額 定率 どちらがいい",
              content: "老後の資産取り崩しには「定額取り崩し」と「定率取り崩し（4%ルール）」があります。定額は毎月決まった額を取り崩すため予算管理がしやすいが、インフレに弱いです。定率は資産の一定率を取り崩すため資産に応じて調整されるが、収入が変動します。ライフスタイルに合わせて選択しましょう。"
            }
          ].map((section) => (
            <div key={section.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button type="button"
                onClick={() => setSeoOpen(seoOpen === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{section.title}</span>
                <span className="text-gray-400">{seoOpen === section.id ? '▲' : '▼'}</span>
              </button>
              {seoOpen === section.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <RelatedTools currentTool="/finance/retirement-simulator" />

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>免責事項：</strong>本ツールの計算結果はあくまで参考値です。実際の年金額は日本年金機構にご確認ください。税務・資産運用の判断は専門家にご相談ください。インフレ率や運用利回りは将来の予測値であり、実際の結果を保証するものではありません。
          </p>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
