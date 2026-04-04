"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Inline SVG Icons
const Icons = {
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  Receipt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  ChevronUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  Lightbulb: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Building2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};

interface ExpenseInputs {
  communication: number;
  transportation: number;
  books: number;
  equipment: number;
  outsourcing: number;
  rent: number;
  rentRatio: number;
  utilities: number;
  utilitiesRatio: number;
  advertising: number;
  other: number;
}

interface CalculationInputs {
  annualRevenue: number;
  withholdingTax: number;
  consumptionTaxType: "exempt" | "standard" | "simplified" | "special20";
  expenses: ExpenseInputs;
  filingType: "blue65" | "blue55" | "blue10" | "white";
  hasSpouse: boolean;
  dependents: number;
  smallBusinessMutualAid: number;
  ideco: number;
  lifeInsurance: "none" | "20000" | "40000" | "80000";
  nationalHealthInsurance: number;
  autoCalcNHI: boolean;
}

interface CalculationResults {
  totalExpenses: number;
  businessIncome: number;
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
  businessTax: number;
  nationalHealthInsurance: number;
  nationalPension: number;
  consumptionTax: number;
  totalTaxes: number;
  netIncome: number;
  taxBurdenRate: number;
  blueVsWhiteDifference: number;
  refundAmount: number;
}

const NATIONAL_PENSION_2026 = 203760;

// Tax brackets - use large number instead of Infinity
const TAX_BRACKETS = [
  { limit: 1950000, rate: 0.05, deduction: 0 },
  { limit: 3300000, rate: 0.1, deduction: 97500 },
  { limit: 6950000, rate: 0.2, deduction: 427500 },
  { limit: 9000000, rate: 0.23, deduction: 636000 },
  { limit: 18000000, rate: 0.33, deduction: 1536000 },
  { limit: 40000000, rate: 0.4, deduction: 2796000 },
  { limit: 999999999999, rate: 0.45, deduction: 4796000 },
];

const EXAMPLE_RESULTS = [
  { revenue: 300, expenseRate: 20, filing: "青色65万", netIncome: 230, taxRate: 23 },
  { revenue: 500, expenseRate: 25, filing: "青色65万", netIncome: 355, taxRate: 29 },
  { revenue: 800, expenseRate: 30, filing: "青色65万", netIncome: 520, taxRate: 35 },
  { revenue: 1000, expenseRate: 30, filing: "青色65万", netIncome: 620, taxRate: 38 },
  { revenue: 1500, expenseRate: 35, filing: "青色65万", netIncome: 870, taxRate: 42 },
];

// Calculate income tax helper function
function calculateIncomeTax(taxableIncome: number): number {
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      tax = Math.floor(taxableIncome * bracket.rate - bracket.deduction);
      break;
    }
  }
  return Math.max(0, tax);
}

export default function FreelanceTaxCalculatorPage() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    annualRevenue: 500,
    withholdingTax: 0,
    consumptionTaxType: "exempt",
    expenses: {
      communication: 12,
      transportation: 10,
      books: 5,
      equipment: 20,
      outsourcing: 0,
      rent: 30,
      rentRatio: 30,
      utilities: 5,
      utilitiesRatio: 20,
      advertising: 5,
      other: 10,
    },
    filingType: "blue65",
    hasSpouse: false,
    dependents: 0,
    smallBusinessMutualAid: 0,
    ideco: 0,
    lifeInsurance: "none",
    nationalHealthInsurance: 0,
    autoCalcNHI: true,
  });

  const [showExpenses, setShowExpenses] = useState(true);
  const [showDeductions, setShowDeductions] = useState(true);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const totalExpenses = useMemo(() => {
    const e = inputs.expenses;
    return (
      e.communication +
      e.transportation +
      e.books +
      e.equipment +
      e.outsourcing +
      (e.rent * e.rentRatio) / 100 +
      (e.utilities * e.utilitiesRatio) / 100 +
      e.advertising +
      e.other
    );
  }, [inputs.expenses]);

  const handleCalculate = () => {
    try {
      const revenueYen = inputs.annualRevenue * 10000;
      const expensesYen = totalExpenses * 10000;

      // Blue filing deduction
      let blueDeduction = 0;
      if (inputs.filingType === "blue65") blueDeduction = 650000;
      else if (inputs.filingType === "blue55") blueDeduction = 550000;
      else if (inputs.filingType === "blue10") blueDeduction = 100000;

      // Business income
      const businessIncome = Math.max(0, revenueYen - expensesYen - blueDeduction);

      // National Health Insurance
      let nhiAmount = inputs.nationalHealthInsurance * 10000;
      if (inputs.autoCalcNHI) {
        const nhiBase = Math.max(0, businessIncome - 430000);
        nhiAmount = Math.min(1060000, Math.round(nhiBase * 0.11 + 50000));
      }

      const socialInsurance = nhiAmount + NATIONAL_PENSION_2026;

      // Basic deduction
      let basicDeduction = 480000;
      if (businessIncome > 24000000) basicDeduction = 320000;
      if (businessIncome > 24500000) basicDeduction = 160000;
      if (businessIncome > 25000000) basicDeduction = 0;

      const spouseDeduction = inputs.hasSpouse ? 380000 : 0;
      const dependentDeduction = inputs.dependents * 380000;
      const mutualAidDeduction = Math.min(inputs.smallBusinessMutualAid * 10000, 840000);
      const idecoDeduction = Math.min(inputs.ideco * 10000, 816000);

      let lifeInsuranceDeduction = 0;
      if (inputs.lifeInsurance === "20000") lifeInsuranceDeduction = 20000;
      else if (inputs.lifeInsurance === "40000") lifeInsuranceDeduction = 40000;
      else if (inputs.lifeInsurance === "80000") lifeInsuranceDeduction = 80000;

      const totalDeductions =
        socialInsurance +
        basicDeduction +
        spouseDeduction +
        dependentDeduction +
        mutualAidDeduction +
        idecoDeduction +
        lifeInsuranceDeduction;

      const taxableIncome = Math.max(0, businessIncome - totalDeductions);

      // Income tax
      const incomeTax = calculateIncomeTax(taxableIncome);
      const reconstructionTax = Math.floor(incomeTax * 0.021);
      const residentTax = Math.floor(taxableIncome * 0.1) + 5000;
      const businessTax = Math.max(0, Math.floor((businessIncome - 2900000) * 0.05));

      // Consumption tax
      let consumptionTax = 0;
      if (inputs.consumptionTaxType === "standard") {
        consumptionTax = Math.floor(revenueYen * 0.1 * 0.3);
      } else if (inputs.consumptionTaxType === "simplified") {
        consumptionTax = Math.floor(revenueYen * 0.1 * 0.5);
      } else if (inputs.consumptionTaxType === "special20") {
        consumptionTax = Math.floor(revenueYen * 0.1 * 0.2);
      }

      const totalTaxes =
        incomeTax +
        reconstructionTax +
        residentTax +
        businessTax +
        nhiAmount +
        NATIONAL_PENSION_2026 +
        consumptionTax;

      const netIncome = revenueYen - expensesYen - totalTaxes;
      const taxBurdenRate = revenueYen > 0 ? (totalTaxes / revenueYen) * 100 : 0;

      // Blue vs white comparison
      const whiteTaxableIncome = Math.max(0, revenueYen - expensesYen - totalDeductions + blueDeduction);
      const whiteIncomeTax = calculateIncomeTax(whiteTaxableIncome);
      const blueVsWhiteDifference = inputs.filingType.startsWith("blue")
        ? Math.max(0, whiteIncomeTax - incomeTax)
        : 0;

      const withholdingYen = inputs.withholdingTax * 10000;
      const refundAmount = Math.max(0, withholdingYen - incomeTax - reconstructionTax);

      setResults({
        totalExpenses: expensesYen,
        businessIncome,
        taxableIncome,
        incomeTax,
        reconstructionTax,
        residentTax,
        businessTax,
        nationalHealthInsurance: nhiAmount,
        nationalPension: NATIONAL_PENSION_2026,
        consumptionTax,
        totalTaxes,
        netIncome,
        taxBurdenRate,
        blueVsWhiteDifference,
        refundAmount,
      });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  const taxAdvice = useMemo(() => {
    if (!results) return [];
    const advice: { title: string; description: string; savings?: number }[] = [];

    if (inputs.smallBusinessMutualAid < 84) {
      const potential = Math.min(84 - inputs.smallBusinessMutualAid, 84) * 10000 * 0.2;
      advice.push({
        title: "小規模企業共済に加入する",
        description: "月7万円（年84万円）まで全額所得控除。廃業時に退職金として受け取れます。",
        savings: Math.round(potential),
      });
    }

    if (inputs.ideco < 81.6) {
      const potential = Math.min(81.6 - inputs.ideco, 81.6) * 10000 * 0.2;
      advice.push({
        title: "iDeCoに加入する",
        description: "月6.8万円（年81.6万円）まで全額所得控除。65歳以降の年金になります。",
        savings: Math.round(potential),
      });
    }

    if (inputs.filingType === "white") {
      advice.push({
        title: "青色申告に切り替える",
        description: "最大65万円の特別控除で年間10万円以上の節税効果。赤字の3年繰越も可能。",
        savings: results.blueVsWhiteDifference > 0 ? results.blueVsWhiteDifference : 100000,
      });
    }

    if (inputs.consumptionTaxType === "exempt" && inputs.annualRevenue > 500) {
      advice.push({
        title: "インボイス登録の検討",
        description: "法人取引が多い場合は登録を検討。2割特例で消費税負担を軽減できます。",
      });
    }

    if (inputs.annualRevenue >= 1000) {
      advice.push({
        title: "法人化を検討する",
        description: "売上1,000万円以上なら法人化で節税できる可能性があります。",
      });
    }

    return advice;
  }, [results, inputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.round(value));
  };

  const formatManYen = (value: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.round(value / 10000));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">ホーム</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/business" className="hover:text-blue-600">ビジネス・法人</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">フリーランス税金計算機</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <div className="w-8 h-8 text-emerald-600">
                <Icons.Calculator />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                フリーランス 税金・経費 計算機
              </h1>
              <p className="text-gray-600">2026年最新税制対応</p>
            </div>
          </div>
          <p className="text-gray-700">
            フリーランス・個人事業主の税金（所得税・住民税・事業税・国保・年金）と手取りを自動計算。
            青色申告vs白色申告の比較、経費カテゴリ別入力、インボイス制度の影響計算、節税アドバイス機能付き。
          </p>
        </div>

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Section 1: Revenue */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600"><Icons.TrendingUp /></span>
              売上・収入
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年間売上（税抜）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.annualRevenue}
                    onChange={(e) => setInputs({ ...inputs, annualRevenue: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  源泉徴収された金額（年間）
                  <span className="ml-1 text-gray-400 text-xs">※任意</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.withholdingTax}
                    onChange={(e) => setInputs({ ...inputs, withholdingTax: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">消費税の扱い</label>
                <select
                  value={inputs.consumptionTaxType}
                  onChange={(e) => setInputs({ ...inputs, consumptionTaxType: e.target.value as CalculationInputs["consumptionTaxType"] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exempt">免税事業者（売上1,000万円以下）</option>
                  <option value="standard">課税事業者（本則課税）</option>
                  <option value="simplified">課税事業者（簡易課税）</option>
                  <option value="special20">インボイス登録済み（2割特例）</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Expenses */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowExpenses(!showExpenses)}
              className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
            >
              <span className="flex items-center gap-2">
                <span className="text-orange-600"><Icons.Receipt /></span>
                経費（カテゴリ別入力）
                <span className="text-sm font-normal text-gray-500">合計: {totalExpenses.toFixed(1)}万円</span>
              </span>
              {showExpenses ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>

            {showExpenses && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">通信費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.communication}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, communication: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">交通費・旅費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.transportation}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, transportation: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">書籍・セミナー費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.books}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, books: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">消耗品費（PC等）</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.equipment}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, equipment: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">外注費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.outsourcing}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, outsourcing: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">広告宣伝費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.advertising}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, advertising: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">家賃（年額）</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.expenses.rent}
                        onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, rent: Number(e.target.value) || 0 } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">按分</label>
                    <select
                      value={inputs.expenses.rentRatio}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, rentRatio: Number(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={10}>10%</option>
                      <option value={20}>20%</option>
                      <option value={30}>30%</option>
                      <option value={50}>50%</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">光熱費（年額）</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.expenses.utilities}
                        onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, utilities: Number(e.target.value) || 0 } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">按分</label>
                    <select
                      value={inputs.expenses.utilitiesRatio}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, utilitiesRatio: Number(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={10}>10%</option>
                      <option value={20}>20%</option>
                      <option value={30}>30%</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">その他経費</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.expenses.other}
                      onChange={(e) => setInputs({ ...inputs, expenses: { ...inputs.expenses, other: Number(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Filing & Deductions */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowDeductions(!showDeductions)}
              className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600"><Icons.FileText /></span>
                申告方法・控除
              </span>
              {showDeductions ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>

            {showDeductions && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">申告方法</label>
                  <select
                    value={inputs.filingType}
                    onChange={(e) => setInputs({ ...inputs, filingType: e.target.value as CalculationInputs["filingType"] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="blue65">青色申告（65万円控除）</option>
                    <option value="blue55">青色申告（55万円控除）</option>
                    <option value="blue10">青色申告（10万円控除）</option>
                    <option value="white">白色申告</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配偶者控除</label>
                  <select
                    value={inputs.hasSpouse ? "yes" : "no"}
                    onChange={(e) => setInputs({ ...inputs, hasSpouse: e.target.value === "yes" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="no">なし</option>
                    <option value="yes">あり</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">扶養家族</label>
                  <select
                    value={inputs.dependents}
                    onChange={(e) => setInputs({ ...inputs, dependents: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}人</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">小規模企業共済（年額）</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.smallBusinessMutualAid}
                      onChange={(e) => setInputs({ ...inputs, smallBusinessMutualAid: Math.min(84, Number(e.target.value) || 0) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      max={84}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">iDeCo（年額）</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.ideco}
                      onChange={(e) => setInputs({ ...inputs, ideco: Math.min(81.6, Number(e.target.value) || 0) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      max={81.6}
                      step={0.1}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生命保険料控除</label>
                  <select
                    value={inputs.lifeInsurance}
                    onChange={(e) => setInputs({ ...inputs, lifeInsurance: e.target.value as CalculationInputs["lifeInsurance"] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="none">なし</option>
                    <option value="20000">2万円</option>
                    <option value="40000">4万円</option>
                    <option value="80000">8万円</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    国民健康保険料
                    <span className="ml-1 text-gray-400 text-xs">{inputs.autoCalcNHI ? "自動計算" : "手動"}</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={inputs.nationalHealthInsurance}
                        onChange={(e) => setInputs({ ...inputs, nationalHealthInsurance: Number(e.target.value) || 0, autoCalcNHI: false })}
                        disabled={inputs.autoCalcNHI}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInputs({ ...inputs, autoCalcNHI: !inputs.autoCalcNHI })}
                      className={`px-4 py-3 rounded-lg text-sm font-medium ${inputs.autoCalcNHI ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      自動
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Icons.Calculator /> 計算する
            </button>
            {results && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
              >
                リセット
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Main Summary Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-medium mb-4 opacity-90">計算結果</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-emerald-100 text-sm">年間手取り</p>
                  <p className="text-3xl font-bold">{formatManYen(results.netIncome)}万円</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">税負担率</p>
                  <p className="text-3xl font-bold">{results.taxBurdenRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">
                    {inputs.filingType.startsWith("blue") ? "青色申告による節税" : "—"}
                  </p>
                  <p className="text-3xl font-bold">
                    {results.blueVsWhiteDifference > 0 ? `+${formatManYen(results.blueVsWhiteDifference)}万円` : "—"}
                  </p>
                </div>
              </div>
              {results.refundAmount > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-400">
                  <p className="flex items-center gap-2">
                    <Icons.CheckCircle />
                    源泉徴収の還付見込み: <span className="font-bold">{formatCurrency(results.refundAmount)}円</span>
                  </p>
                </div>
              )}
            </div>

            {/* Tax Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">税金・社会保険料の内訳</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">項目</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-4">所得税</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.incomeTax)}円</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">復興特別所得税</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.reconstructionTax)}円</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">住民税</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.residentTax)}円</td>
                    </tr>
                    {results.businessTax > 0 && (
                      <tr>
                        <td className="py-3 px-4">個人事業税</td>
                        <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.businessTax)}円</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 px-4">国民健康保険</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.nationalHealthInsurance)}円</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">国民年金</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.nationalPension)}円</td>
                    </tr>
                    {results.consumptionTax > 0 && (
                      <tr>
                        <td className="py-3 px-4">消費税納付</td>
                        <td className="text-right py-3 px-4 font-medium">{formatCurrency(results.consumptionTax)}円</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-3 px-4">合計</td>
                      <td className="text-right py-3 px-4 text-red-600">{formatCurrency(results.totalTaxes)}円</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Warning Card */}
            {inputs.consumptionTaxType === "exempt" && inputs.annualRevenue > 300 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-amber-600 flex-shrink-0"><Icons.AlertCircle /></span>
                  <div>
                    <h3 className="font-bold text-amber-800 mb-2">インボイス制度の影響</h3>
                    <p className="text-amber-700 text-sm mb-3">
                      インボイス登録すると消費税の申告・納付が必要になります。
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-600">本則課税の場合</p>
                        <p className="text-lg font-bold text-red-600">
                          約{formatManYen(inputs.annualRevenue * 10000 * 0.1 * 0.3)}万円/年
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-600">2割特例の場合</p>
                        <p className="text-lg font-bold text-amber-600">
                          約{formatManYen(inputs.annualRevenue * 10000 * 0.1 * 0.2)}万円/年
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Saving Advice */}
            {taxAdvice.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Icons.Lightbulb /> 節税アドバイス
                </h3>
                <div className="space-y-4">
                  {taxAdvice.map((advice, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{advice.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{advice.description}</p>
                        </div>
                        {advice.savings && (
                          <span className="text-emerald-600 font-bold whitespace-nowrap ml-4">
                            約{formatCurrency(advice.savings)}円節税
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Results Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">様々な売上での概算（参考）</h2>
          <p className="text-gray-600 text-sm mb-4">※独身・扶養なし・青色申告65万円控除での目安</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">年間売上</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">経費率</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">申告</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">手取り</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">税負担率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {EXAMPLE_RESULTS.map((row, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4">{row.revenue}万円</td>
                    <td className="py-3 px-4">{row.expenseRate}%</td>
                    <td className="py-3 px-4">{row.filing}</td>
                    <td className="text-right py-3 px-4 font-medium text-emerald-600">約{row.netIncome}万円</td>
                    <td className="text-right py-3 px-4">{row.taxRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="space-y-4">
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">フリーランスの税金はいくら？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                売上の25%〜40%が税金・社会保険料になります。年収500万円・経費率25%・青色申告の場合、手取りは約260万円です。
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">青色申告と白色申告どちらがお得？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                青色申告がお得です。最大65万円の特別控除で年間10万円以上の節税になります。
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">インボイス登録すべき？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                法人取引が多い場合は検討を。2割特例で消費税負担を軽減できます。
              </div>
            </details>
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/business/incorporation-simulator"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-blue-600"><Icons.Building2 /></span>
              <div>
                <h3 className="font-medium text-gray-900">個人事業主 vs 法人化</h3>
                <p className="text-sm text-gray-500">どちらがお得か比較</p>
              </div>
              <span className="text-gray-400 ml-auto"><Icons.ArrowRight /></span>
            </Link>
            <Link
              href="/business/simplified-tax-calculator"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-orange-600"><Icons.Receipt /></span>
              <div>
                <h3 className="font-medium text-gray-900">消費税 簡易課税 判定</h3>
                <p className="text-sm text-gray-500">本則vs簡易vs2割特例</p>
              </div>
              <span className="text-gray-400 ml-auto"><Icons.ArrowRight /></span>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 mt-8 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5"><Icons.Info /></span>
            <span>
              本ツールは概算計算です。正確な計算については税理士にご相談ください。
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
