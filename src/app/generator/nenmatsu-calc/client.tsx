"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface CalcResult {
  grossIncome: number;
  incomeDeduction: number;
  taxableIncome: number;
  calculatedTax: number;
  withheldTax: number;
  difference: number;
  isRefund: boolean;
}

export default function NenmatsuCalcClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("年末調整を計算するよ！");

  // Input values
  const [annualIncome, setAnnualIncome] = useState("");
  const [withheldTax, setWithheldTax] = useState("");
  const [socialInsurance, setSocialInsurance] = useState("");
  const [lifeInsurance, setLifeInsurance] = useState("");
  const [earthquakeInsurance, setEarthquakeInsurance] = useState("");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState("");
  const [dependents, setDependents] = useState("0");
  const [housingLoan, setHousingLoan] = useState("");

  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate income deduction based on income (給与所得控除)
  const calcIncomeDeduction = (income: number): number => {
    if (income <= 1625000) return 550000;
    if (income <= 1800000) return income * 0.4 - 100000;
    if (income <= 3600000) return income * 0.3 + 80000;
    if (income <= 6600000) return income * 0.2 + 440000;
    if (income <= 8500000) return income * 0.1 + 1100000;
    return 1950000; // Max deduction
  };

  // Calculate life insurance deduction (生命保険料控除)
  const calcLifeInsuranceDeduction = (premium: number): number => {
    // Simplified calculation (new system)
    if (premium <= 20000) return premium;
    if (premium <= 40000) return premium * 0.5 + 10000;
    if (premium <= 80000) return premium * 0.25 + 20000;
    return 40000; // Max for each category
  };

  // Calculate spouse deduction (配偶者控除)
  const calcSpouseDeduction = (taxpayerIncome: number, spouseIncome: number): number => {
    if (taxpayerIncome > 10000000) return 0; // 本人の所得1000万超は対象外
    
    const spouseEarnedIncome = spouseIncome - Math.min(spouseIncome * 0.3 + 80000, 550000);
    
    if (spouseEarnedIncome <= 480000) {
      // 配偶者控除
      if (taxpayerIncome <= 9000000) return 380000;
      if (taxpayerIncome <= 9500000) return 260000;
      return 130000;
    } else if (spouseEarnedIncome <= 1330000) {
      // 配偶者特別控除 (simplified)
      return Math.max(0, 380000 - Math.floor((spouseEarnedIncome - 480000) / 50000) * 30000);
    }
    return 0;
  };

  // Calculate income tax (所得税)
  const calcIncomeTax = (taxableIncome: number): number => {
    if (taxableIncome <= 1950000) return taxableIncome * 0.05;
    if (taxableIncome <= 3300000) return taxableIncome * 0.1 - 97500;
    if (taxableIncome <= 6950000) return taxableIncome * 0.2 - 427500;
    if (taxableIncome <= 9000000) return taxableIncome * 0.23 - 636000;
    if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
    if (taxableIncome <= 40000000) return taxableIncome * 0.4 - 2796000;
    return taxableIncome * 0.45 - 4796000;
  };

  const handleCalculate = () => {
    const income = parseInt(annualIncome.replace(/,/g, "")) || 0;
    const withheld = parseInt(withheldTax.replace(/,/g, "")) || 0;
    const social = parseInt(socialInsurance.replace(/,/g, "")) || 0;
    const life = parseInt(lifeInsurance.replace(/,/g, "")) || 0;
    const earthquake = parseInt(earthquakeInsurance.replace(/,/g, "")) || 0;
    const spouseInc = parseInt(spouseIncome.replace(/,/g, "")) || 0;
    const numDependents = parseInt(dependents) || 0;
    const housing = parseInt(housingLoan.replace(/,/g, "")) || 0;

    if (income === 0) {
      setMascotState("error");
      setMascotMessage("年収を入力してね！");
      return;
    }

    // Calculate deductions
    const incomeDeduction = calcIncomeDeduction(income);
    const earnedIncome = income - incomeDeduction; // 給与所得

    // 所得控除
    const basicDeduction = earnedIncome <= 24000000 ? 480000 : 0; // 基礎控除
    const lifeDeduction = calcLifeInsuranceDeduction(life);
    const earthquakeDeduction = Math.min(earthquake, 50000);
    const spouseDeduction = hasSpouse ? calcSpouseDeduction(earnedIncome, spouseInc) : 0;
    const dependentDeduction = numDependents * 380000; // 扶養控除（一般）

    const totalDeductions = basicDeduction + social + lifeDeduction + earthquakeDeduction + spouseDeduction + dependentDeduction;

    // Calculate taxable income
    const taxableIncome = Math.max(0, earnedIncome - totalDeductions);

    // Calculate tax
    let calculatedTax = calcIncomeTax(taxableIncome);
    
    // 住宅ローン控除
    const housingDeduction = Math.min(housing * 0.007, 210000); // 0.7%, max 21万
    calculatedTax = Math.max(0, calculatedTax - housingDeduction);
    
    // 復興特別所得税 2.1%
    calculatedTax = Math.floor(calculatedTax * 1.021);

    const difference = withheld - calculatedTax;

    setResult({
      grossIncome: income,
      incomeDeduction,
      taxableIncome,
      calculatedTax,
      withheldTax: withheld,
      difference: Math.abs(difference),
      isRefund: difference > 0,
    });

    if (difference > 0) {
      setMascotState("success");
      setMascotMessage(`${difference.toLocaleString()}円還付だね！`);
    } else if (difference < 0) {
      setMascotState("error");
      setMascotMessage(`${Math.abs(difference).toLocaleString()}円追加徴収...`);
    } else {
      setMascotState("success");
      setMascotMessage("ぴったりだね！");
    }
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num ? parseInt(num).toLocaleString() : "";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">年末調整計算</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">💴</div>
          <h1 className="text-3xl font-bold text-kon mb-2">年末調整計算</h1>
          <p className="text-gray-600 text-lg">還付金シミュレーター</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-kon mb-4">基本情報</h3>
          
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年収（税込）<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(formatNumber(e.target.value))}
                  placeholder="5,000,000"
                  className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                源泉徴収税額（1年間合計）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={withheldTax}
                  onChange={(e) => setWithheldTax(formatNumber(e.target.value))}
                  placeholder="150,000"
                  className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                社会保険料（1年間合計）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={socialInsurance}
                  onChange={(e) => setSocialInsurance(formatNumber(e.target.value))}
                  placeholder="750,000"
                  className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-kon mb-4">保険料控除</h3>
          
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生命保険料（年間支払額）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lifeInsurance}
                  onChange={(e) => setLifeInsurance(formatNumber(e.target.value))}
                  placeholder="120,000"
                  className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地震保険料（年間支払額）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={earthquakeInsurance}
                  onChange={(e) => setEarthquakeInsurance(formatNumber(e.target.value))}
                  placeholder="30,000"
                  className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-kon mb-4">扶養控除</h3>
          
          <div className="grid gap-4 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasSpouse"
                checked={hasSpouse}
                onChange={(e) => setHasSpouse(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-kon focus:ring-kon"
              />
              <label htmlFor="hasSpouse" className="text-sm font-medium text-gray-700">
                配偶者あり
              </label>
            </div>

            {hasSpouse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  配偶者の年収
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={spouseIncome}
                    onChange={(e) => setSpouseIncome(formatNumber(e.target.value))}
                    placeholder="1,030,000"
                    className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                扶養親族の人数（16歳以上）
              </label>
              <select
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}人</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="font-bold text-kon mb-4">住宅ローン控除</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住宅ローン年末残高
            </label>
            <div className="relative">
              <input
                type="text"
                value={housingLoan}
                onChange={(e) => setHousingLoan(formatNumber(e.target.value))}
                placeholder="30,000,000"
                className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">※ 2022年以降入居の場合（控除率0.7%）</p>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            計算する
          </button>
        </section>

        {result && (
          <section className={`rounded-2xl p-6 mb-6 ${result.isRefund ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">
                {result.isRefund ? "還付金額" : "追加徴収額"}
              </p>
              <p className={`text-4xl font-bold ${result.isRefund ? "text-green-600" : "text-red-600"}`}>
                {result.isRefund ? "+" : "-"}{result.difference.toLocaleString()}円
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">年収</span>
                <span>{result.grossIncome.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">給与所得控除</span>
                <span>-{result.incomeDeduction.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">課税所得</span>
                <span>{result.taxableIncome.toLocaleString()}円</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">計算上の所得税</span>
                <span>{result.calculatedTax.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">源泉徴収済み</span>
                <span>{result.withheldTax.toLocaleString()}円</span>
              </div>
            </div>
          </section>
        )}

        <section className="bg-yellow-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ この計算結果は概算です。実際の年末調整は会社の計算が正式となります。
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
