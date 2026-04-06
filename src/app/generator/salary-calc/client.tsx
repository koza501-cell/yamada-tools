"use client";
import FinancialDisclaimer from "@/components/common/FinancialDisclaimer";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

// Simplified 2024 rates (approximations)
const HEALTH_INSURANCE_RATE = 0.05; // 健康保険 約10% (会社と折半)
const PENSION_RATE = 0.0915; // 厚生年金 18.3% (会社と折半)
const EMPLOYMENT_INSURANCE_RATE = 0.006; // 雇用保険 0.6%
const RESIDENT_TAX_RATE = 0.10; // 住民税 約10%

// Income tax brackets (2024)
const INCOME_TAX_BRACKETS = [
  { min: 0, max: 1950000, rate: 0.05, deduction: 0 },
  { min: 1950001, max: 3300000, rate: 0.10, deduction: 97500 },
  { min: 3300001, max: 6950000, rate: 0.20, deduction: 427500 },
  { min: 6950001, max: 9000000, rate: 0.23, deduction: 636000 },
  { min: 9000001, max: 18000000, rate: 0.33, deduction: 1536000 },
  { min: 18000001, max: 40000000, rate: 0.40, deduction: 2796000 },
  { min: 40000001, max: Infinity, rate: 0.45, deduction: 4796000 },
];

export default function SalaryCalcClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("給与計算してみよう！");

  const [inputType, setInputType] = useState<"monthly" | "annual">("monthly");
  const [grossAmount, setGrossAmount] = useState<number>(300000);
  const [age, setAge] = useState<number>(30);
  const [dependents, setDependents] = useState<number>(0);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [bonusMonths, setBonusMonths] = useState<number>(2);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate annual gross
  const annualGross = inputType === "monthly" 
    ? grossAmount * (12 + bonusMonths)
    : grossAmount;
  
  const monthlyGross = inputType === "monthly"
    ? grossAmount
    : Math.floor(grossAmount / (12 + bonusMonths));

  // Social insurance (monthly)
  const healthInsurance = Math.floor(monthlyGross * HEALTH_INSURANCE_RATE);
  const pension = age < 70 ? Math.floor(monthlyGross * PENSION_RATE) : 0;
  const employmentInsurance = Math.floor(monthlyGross * EMPLOYMENT_INSURANCE_RATE);
  const totalSocialInsurance = healthInsurance + pension + employmentInsurance;

  // Taxable income calculation
  const basicDeduction = 480000; // 基礎控除
  const salaryDeduction = Math.min(annualGross * 0.3 + 80000, 1950000); // 給与所得控除 (simplified)
  const spouseDeduction = hasSpouse ? 380000 : 0;
  const dependentDeduction = dependents * 380000;
  
  const taxableIncome = Math.max(0, 
    annualGross - (totalSocialInsurance * 12) - basicDeduction - salaryDeduction - spouseDeduction - dependentDeduction
  );

  // Income tax (annual)
  const bracket = INCOME_TAX_BRACKETS.find(b => taxableIncome >= b.min && taxableIncome <= b.max) || INCOME_TAX_BRACKETS[0];
  const annualIncomeTax = Math.floor(taxableIncome * bracket.rate - bracket.deduction);
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);

  // Resident tax (monthly, simplified)
  const monthlyResidentTax = Math.floor((taxableIncome * RESIDENT_TAX_RATE) / 12);

  // Net amounts
  const monthlyDeductions = totalSocialInsurance + monthlyIncomeTax + monthlyResidentTax;
  const monthlyNet = monthlyGross - monthlyDeductions;
  const annualNet = monthlyNet * 12;

  const deductionRate = ((monthlyDeductions / monthlyGross) * 100).toFixed(1);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8"><FinancialDisclaimer type="salary" />
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">給与手取り計算</h1>
          <p className="text-gray-600">額面から手取りをシミュレーション</p>
        </header>

        <div className="mb-6 flex justify-center">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">入力</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">入力方法</label>
              <div className="flex gap-2">
                <button onClick={() => setInputType("monthly")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${inputType === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  月給で入力
                </button>
                <button onClick={() => setInputType("annual")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${inputType === "annual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                  年収で入力
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {inputType === "monthly" ? "月給（額面）" : "年収（額面）"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(Number(e.target.value))}
                  className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg text-xl text-right"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">円</span>
              </div>
            </div>

            {inputType === "monthly" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">ボーナス（月給の何ヶ月分）</label>
                <select value={bonusMonths} onChange={(e) => setBonusMonths(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value={0}>なし</option>
                  <option value={1}>1ヶ月</option>
                  <option value={2}>2ヶ月</option>
                  <option value={3}>3ヶ月</option>
                  <option value={4}>4ヶ月</option>
                  <option value={5}>5ヶ月</option>
                  <option value={6}>6ヶ月</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">扶養親族（16歳以上）</label>
              <input type="number" min={0} value={dependents} onChange={(e) => setDependents(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="spouse" checked={hasSpouse} onChange={(e) => setHasSpouse(e.target.checked)} className="w-4 h-4" />
              <label htmlFor="spouse" className="text-sm text-gray-700">配偶者控除あり</label>
            </div>
          </div>

          {/* Result */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">計算結果</h2>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-6 text-center">
              <p className="text-sm opacity-80 mb-1">月々の手取り（税引後）</p>
              <p className="text-4xl font-bold">{monthlyNet.toLocaleString()}<span className="text-lg ml-1">円</span></p>
              <p className="text-sm opacity-80 mt-2">年間手取り: 約 {annualNet.toLocaleString()}円</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">額面</span>
                  <span className="font-medium">{monthlyGross.toLocaleString()}円</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">健康保険</span>
                  <span className="text-red-600">-{healthInsurance.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">厚生年金</span>
                  <span className="text-red-600">-{pension.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">雇用保険</span>
                  <span className="text-red-600">-{employmentInsurance.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">所得税</span>
                  <span className="text-red-600">-{monthlyIncomeTax.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">住民税</span>
                  <span className="text-red-600">-{monthlyResidentTax.toLocaleString()}円</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">控除合計</span>
                  <span className="font-medium text-red-600">-{monthlyDeductions.toLocaleString()}円</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">（額面の約{deductionRate}%）</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ この計算は概算です。実際の金額は勤務先・地域・加入保険により異なります。
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">控除の内訳について</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-600 mb-1">社会保険料</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• 健康保険: 約10%（会社と折半で約5%）</li>
                <li>• 厚生年金: 18.3%（会社と折半で約9.15%）</li>
                <li>• 雇用保険: 約0.6%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-600 mb-1">税金</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• 所得税: 5%〜45%（累進課税）</li>
                <li>• 住民税: 約10%（翌年6月から徴収）</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Direct Answer Block for AI/SEO */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">📊 月給別の手取り早見表</h2>
          <p className="text-gray-600 mb-4 text-sm">額面月給から手取りの目安です（独身・扶養なし・東京都の場合）。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">額面月給</th>
                  <th className="px-3 py-2 text-left">社会保険料</th>
                  <th className="px-3 py-2 text-left">所得税</th>
                  <th className="px-3 py-2 text-left">手取り目安</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-3 py-2">20万円</td><td className="px-3 py-2">約2.9万円</td><td className="px-3 py-2">約0.4万円</td><td className="px-3 py-2 font-bold text-blue-600">約16.7万円</td></tr>
                <tr><td className="px-3 py-2">25万円</td><td className="px-3 py-2">約3.7万円</td><td className="px-3 py-2">約0.5万円</td><td className="px-3 py-2 font-bold text-blue-600">約20.8万円</td></tr>
                <tr><td className="px-3 py-2">30万円</td><td className="px-3 py-2">約4.4万円</td><td className="px-3 py-2">約0.8万円</td><td className="px-3 py-2 font-bold text-blue-600">約24.8万円</td></tr>
                <tr><td className="px-3 py-2">40万円</td><td className="px-3 py-2">約5.9万円</td><td className="px-3 py-2">約1.5万円</td><td className="px-3 py-2 font-bold text-blue-600">約32.6万円</td></tr>
                <tr><td className="px-3 py-2">50万円</td><td className="px-3 py-2">約7.4万円</td><td className="px-3 py-2">約2.5万円</td><td className="px-3 py-2 font-bold text-blue-600">約40.1万円</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">※ 住民税は含まれていません（翌年6月から月約1〜3万円程度）。実際の金額は加入保険や地域により異なります。</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-blue-600 hover:text-blue-800">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
