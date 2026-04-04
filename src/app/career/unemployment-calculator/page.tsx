"use client";

import { useState } from "react";
import Link from "next/link";

type SeparationReason = "voluntary" | "company" | "tokutei_jukyuu" | "tokutei_riyuu" | "shougaisha";
type InsuredPeriod = "lt1" | "1to5" | "5to10" | "10to20" | "gte20";
type SalaryInputMode = "auto" | "manual";

interface FormState {
  age: string;
  separationReason: SeparationReason;
  insuredPeriod: InsuredPeriod;
  salaryInputMode: SalaryInputMode;
  last6MonthsSalary: string;
  dailyWageManual: string;
  isHardToEmploy: boolean;
  hadShortWorkHours: boolean;
}

interface CalcResult {
  dailyWage: number;
  benefitDailyAmount: number;
  benefitRate: number;
  prescribedDays: number;
  restrictionDays: number;
  daysUntilStart: number;
  totalBenefit: number;
  monthlyEstimate: number;
  months: number;
  hasEntitlement: boolean;
}

const DEFAULT_FORM: FormState = {
  age: "",
  separationReason: "voluntary",
  insuredPeriod: "1to5",
  salaryInputMode: "auto",
  last6MonthsSalary: "",
  dailyWageManual: "",
  isHardToEmploy: false,
  hadShortWorkHours: false,
};

function getDailyWageUpperLimit(age: number): number {
  if (age < 30) return 13670;
  if (age < 45) return 15190;
  if (age < 60) return 16710;
  return 16000;
}

function getBenefitDailyUpperLimit(age: number): number {
  if (age < 30) return 6835;
  if (age < 45) return 7595;
  if (age < 60) return 8355;
  return 7186;
}

function getBenefitRate(w: number): number {
  if (w <= 5030) return 0.8;
  if (w <= 12380) return 0.8 - ((w - 5030) * 0.3) / (12380 - 5030);
  return 0.5;
}

function getPrescribedDays(
  age: number,
  reason: SeparationReason,
  period: InsuredPeriod,
  isHard: boolean
): number {
  if (isHard || reason === "shougaisha") {
    return age < 45 ? 300 : 360;
  }
  if (reason === "voluntary") {
    if (period === "lt1") return 0;
    if (period === "1to5" || period === "5to10") return 90;
    if (period === "10to20") return 120;
    return 150;
  }
  // company / tokutei_jukyuu / tokutei_riyuu
  const table: Record<string, Record<InsuredPeriod, number>> = {
    lt30:     { lt1: 90, "1to5": 90,  "5to10": 120, "10to20": 180, gte20: 240 },
    "30to34": { lt1: 90, "1to5": 120, "5to10": 180, "10to20": 210, gte20: 240 },
    "35to44": { lt1: 90, "1to5": 150, "5to10": 180, "10to20": 240, gte20: 270 },
    "45to59": { lt1: 90, "1to5": 180, "5to10": 240, "10to20": 270, gte20: 330 },
    "60to64": { lt1: 90, "1to5": 150, "5to10": 180, "10to20": 210, gte20: 240 },
  };
  const ag =
    age < 30 ? "lt30" :
    age < 35 ? "30to34" :
    age < 45 ? "35to44" :
    age < 60 ? "45to59" : "60to64";
  return table[ag][period];
}

function calculate(form: FormState): CalcResult | null {
  const age = parseInt(form.age);
  if (isNaN(age) || age < 15 || age > 70) return null;

  let dailyWage: number;
  if (form.salaryInputMode === "auto") {
    const v = parseFloat(form.last6MonthsSalary);
    if (isNaN(v) || v <= 0) return null;
    dailyWage = (v * 10000) / 180;
  } else {
    const v = parseFloat(form.dailyWageManual);
    if (isNaN(v) || v <= 0) return null;
    dailyWage = v;
  }

  dailyWage = Math.min(getDailyWageUpperLimit(age), Math.max(2869, dailyWage));

  const benefitRate = getBenefitRate(dailyWage);
  let benefitDailyAmount = Math.round(dailyWage * benefitRate);
  benefitDailyAmount = Math.min(getBenefitDailyUpperLimit(age), benefitDailyAmount);

  const isHard = form.isHardToEmploy || form.separationReason === "shougaisha";
  const prescribedDays = getPrescribedDays(age, form.separationReason, form.insuredPeriod, isHard);

  if (prescribedDays === 0) {
    return {
      dailyWage, benefitDailyAmount, benefitRate,
      prescribedDays: 0, restrictionDays: 0, daysUntilStart: 0,
      totalBenefit: 0, monthlyEstimate: 0, months: 0,
      hasEntitlement: false,
    };
  }

  const restrictionDays = form.separationReason === "voluntary" ? 60 : 0;
  const daysUntilStart = 7 + restrictionDays;
  const totalBenefit = benefitDailyAmount * prescribedDays;
  const monthlyEstimate = benefitDailyAmount * 30;
  const months = prescribedDays / 30;

  return {
    dailyWage, benefitDailyAmount, benefitRate,
    prescribedDays, restrictionDays, daysUntilStart,
    totalBenefit, monthlyEstimate, months,
    hasEntitlement: true,
  };
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString();
}

function fmtMan(v: number): string {
  return (Math.round(v / 1000) / 10).toLocaleString();
}

export default function UnemploymentCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleCalculate() {
    setError("");
    const age = parseInt(form.age);
    if (isNaN(age) || age < 15 || age > 70) {
      setError("年齢を正しく入力してください（15〜70歳）");
      return;
    }
    if (form.salaryInputMode === "auto") {
      const v = parseFloat(form.last6MonthsSalary);
      if (isNaN(v) || v <= 0) { setError("直近6ヶ月の総支給額を入力してください"); return; }
    } else {
      const v = parseFloat(form.dailyWageManual);
      if (isNaN(v) || v <= 0) { setError("賃金日額を入力してください"); return; }
    }
    setResult(calculate(form));
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const advisoryContent: Record<SeparationReason, { color: string; bg: string; border: string; text: string }> = {
    voluntary: {
      color: "text-orange-800",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "給付制限期間中も求職活動を積極的に行いましょう。ハローワークでの求職活動実績が2回以上あれば給付制限が2ヶ月→1ヶ月に短縮されます（2023年改正）。認定日には必ず出席してください。",
    },
    company: {
      color: "text-green-800",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "特定受給資格者として給付制限なし・手厚い給付日数が受けられます。離職票を受け取り次第、早めにハローワークへ求職申込みを行いましょう。",
    },
    tokutei_jukyuu: {
      color: "text-green-800",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "倒産・大量解雇などによる特定受給資格者として、給付制限なし・優遇された給付日数が適用されます。ハローワークで特定受給資格者として認定してもらいましょう。",
    },
    tokutei_riyuu: {
      color: "text-blue-800",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "特定理由離職者として給付制限なしで受給できます。契約期間満了・健康上の理由・家族の介護などが該当します。ハローワークで確認してください。",
    },
    shougaisha: {
      color: "text-purple-800",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "就職困難者として最大360日の手厚い給付が受けられます。障害者就業・生活支援センターや、ハローワークの専門援助部門も積極的に活用しましょう。",
    },
  };

  const advisory = advisoryContent[form.separationReason];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/career" className="hover:text-blue-600">転職・年収</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">失業給付金計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">失業給付金計算機</h1>
          <p className="text-gray-600 text-sm">
            離職理由・年齢・被保険者期間を入力するだけで、給付日数と総受給額を自動計算。2026年最新版。
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">登録不要</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">2026年最新</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">全離職理由対応</span>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">給付スケジュール表示</span>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Section 1 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-100">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <h2 className="font-bold text-gray-800">基本情報</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>離職時の年齢 <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={15} max={70}
                    value={form.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="例: 35"
                    className={inputClass + " max-w-[140px]"}
                  />
                  <span className="text-sm text-gray-500">歳</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>離職理由 <span className="text-red-500">*</span></label>
                <select
                  value={form.separationReason}
                  onChange={(e) => handleChange("separationReason", e.target.value as SeparationReason)}
                  className={selectClass}
                >
                  <option value="voluntary">自己都合退職</option>
                  <option value="company">会社都合退職・解雇</option>
                  <option value="tokutei_jukyuu">特定受給資格者（倒産・大量解雇など）</option>
                  <option value="tokutei_riyuu">特定理由離職者（契約満了・健康・介護など）</option>
                  <option value="shougaisha">障害者・就職困難者</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>雇用保険 被保険者期間 <span className="text-red-500">*</span></label>
                <select
                  value={form.insuredPeriod}
                  onChange={(e) => handleChange("insuredPeriod", e.target.value as InsuredPeriod)}
                  className={selectClass}
                >
                  <option value="lt1">1年未満</option>
                  <option value="1to5">1年以上5年未満</option>
                  <option value="5to10">5年以上10年未満</option>
                  <option value="10to20">10年以上20年未満</option>
                  <option value="gte20">20年以上</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-100">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <h2 className="font-bold text-gray-800">賃金情報</h2>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleChange("salaryInputMode", "auto")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.salaryInputMode === "auto" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >自動計算</button>
              <button
                onClick={() => handleChange("salaryInputMode", "manual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.salaryInputMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >手動入力</button>
            </div>
            {form.salaryInputMode === "auto" ? (
              <div>
                <label className={labelClass}>直近6ヶ月の総支給額（ボーナス除く） <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0}
                    value={form.last6MonthsSalary}
                    onChange={(e) => handleChange("last6MonthsSalary", e.target.value)}
                    placeholder="例: 180"
                    className={inputClass}
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">賃金日額 = 6ヶ月総支給額 × 10,000 ÷ 180</p>
              </div>
            ) : (
              <div>
                <label className={labelClass}>賃金日額 <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0}
                    value={form.dailyWageManual}
                    onChange={(e) => handleChange("dailyWageManual", e.target.value)}
                    placeholder="例: 10000"
                    className={inputClass}
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">円/日</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-100">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <h2 className="font-bold text-gray-800">追加情報</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">就職困難者に該当しますか？</p>
                  <p className="text-xs text-gray-400">障害者手帳所持者など</p>
                </div>
                <button
                  onClick={() => handleChange("isHardToEmploy", !form.isHardToEmploy)}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.isHardToEmploy ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isHardToEmploy ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">離職前に育児・介護で時短勤務していましたか？</p>
                </div>
                <button
                  onClick={() => handleChange("hadShortWorkHours", !form.hadShortWorkHours)}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.hadShortWorkHours ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.hadShortWorkHours ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button onClick={handleReset} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              リセット
            </button>
            <button onClick={handleCalculate} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              計算する
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mb-8">
            {!result.hasEntitlement ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-bold text-lg mb-2">受給資格なし</p>
                <p className="text-red-600 text-sm">
                  自己都合退職の場合、被保険者期間が1年未満だと失業給付金は受け取れません。<br />
                  受給には離職前2年間で12ヶ月以上の被保険者期間が必要です。
                </p>
              </div>
            ) : (
              <>
                {/* Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">賃金日額</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(result.dailyWage)}<span className="text-sm font-normal text-gray-500">円/日</span></p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">基本手当日額</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(result.benefitDailyAmount)}<span className="text-sm font-normal text-gray-500">円/日</span></p>
                    <p className="text-xs text-blue-600 mt-0.5">給付率 {Math.round(result.benefitRate * 100)}%</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">所定給付日数</p>
                    <p className="text-xl font-bold text-gray-900">{result.prescribedDays}<span className="text-sm font-normal text-gray-500">日</span></p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">給付制限期間</p>
                    <p className="text-xl font-bold text-gray-900">{result.restrictionDays > 0 ? `${result.restrictionDays}日` : "なし"}</p>
                    {result.restrictionDays > 0 && <p className="text-xs text-orange-500 mt-0.5">※求職活動で1ヶ月短縮可</p>}
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">受給開始目安</p>
                    <p className="text-xl font-bold text-gray-900">約{result.daysUntilStart}<span className="text-sm font-normal text-gray-500">日後</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">待期7日 + 制限{result.restrictionDays}日</p>
                  </div>
                  <div className="bg-blue-600 rounded-xl shadow-sm p-4">
                    <p className="text-xs text-blue-100 mb-1">総受給可能額</p>
                    <p className="text-2xl font-bold text-white">約{fmtMan(result.totalBenefit)}万円</p>
                    <p className="text-xs text-blue-200 mt-0.5">約{fmt(result.monthlyEstimate)}円/月 × {result.months.toFixed(1)}ヶ月</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm">受給スケジュール（目安）</h3>
                  <div className="flex items-center text-xs overflow-x-auto pb-1 gap-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium mt-1 whitespace-nowrap">離職日</span>
                    </div>
                    <div className="flex-shrink-0 min-w-[56px] flex flex-col">
                      <div className="h-3 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 whitespace-nowrap text-xs leading-none px-1">7日</span>
                      </div>
                      <span className="text-gray-400 text-center text-xs mt-0.5">待期</span>
                    </div>
                    {result.restrictionDays > 0 && (
                      <>
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0" />
                          <span className="text-orange-600 font-medium mt-1 whitespace-nowrap">制限開始</span>
                        </div>
                        <div className="flex-shrink-0 min-w-[72px] flex flex-col">
                          <div className="h-3 bg-orange-200 flex items-center justify-center">
                            <span className="text-orange-600 whitespace-nowrap text-xs leading-none px-1">{result.restrictionDays}日</span>
                          </div>
                          <span className="text-orange-400 text-center text-xs mt-0.5">給付制限</span>
                        </div>
                      </>
                    )}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-green-700 font-medium mt-1 whitespace-nowrap">受給開始</span>
                    </div>
                    <div className="flex-1 min-w-[80px] flex flex-col">
                      <div className="h-3 bg-green-200 flex items-center justify-center">
                        <span className="text-green-700 whitespace-nowrap text-xs leading-none px-1">{result.prescribedDays}日</span>
                      </div>
                      <span className="text-green-500 text-center text-xs mt-0.5">受給期間</span>
                    </div>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-red-600 font-medium mt-1 whitespace-nowrap">終了</span>
                    </div>
                  </div>
                </div>

                {/* Advisory */}
                <div className={`rounded-xl border p-4 ${advisory.bg} ${advisory.border}`}>
                  <p className={`text-sm font-bold mb-1 ${advisory.color}`}>アドバイス</p>
                  <p className={`text-sm ${advisory.color}`}>{advisory.text}</p>
                  {form.hadShortWorkHours && (
                    <p className={`text-sm mt-2 ${advisory.color}`}>
                      ※ 育児・介護による時短勤務期間がある場合、賃金日額の計算に特例が適用されることがあります。ハローワークで確認してください。
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* SEO Content */}
        <div className="space-y-8">
          {/* よくある計算例 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">よくある計算例</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">月給</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">離職理由</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">被保険者期間</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">年齢</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">給付日数</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">総受給額目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["25万円","自己都合","5年以上","30代","90日","約56万円"],
                    ["30万円","会社都合","3年","40代","180日","約95万円"],
                    ["35万円","会社都合","10年以上","50代","270日","約155万円"],
                    ["40万円","自己都合","15年","40代","120日","約86万円"],
                    ["20万円","特定理由","2年","20代","90日","約40万円"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2 px-3 ${j === 5 ? "text-blue-700 font-bold" : ""} ${j === 4 ? "font-medium" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 基礎知識 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">失業給付金（基本手当）の基礎知識</h2>
            <p className="text-sm text-gray-700 mb-4">
              失業給付金（正式名称：雇用保険の基本手当）は、失業中の生活を支援するための給付です。受給するには以下の条件を満たす必要があります。
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">受給資格の条件</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>雇用保険に加入していたこと</li>
                  <li>自己都合の場合：離職前2年間に被保険者期間が通算12ヶ月以上</li>
                  <li>会社都合の場合：離職前1年間に被保険者期間が通算6ヶ月以上</li>
                  <li>積極的に就職活動をしていること</li>
                  <li>働く意思と能力があること</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">手続きの流れ</h3>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>離職票をもらう（会社に依頼）</li>
                  <li>ハローワークに求職申込み</li>
                  <li>7日間の待期期間（全員）</li>
                  <li>給付制限期間（自己都合は2ヶ月）</li>
                  <li>認定日ごとに求職活動実績を報告</li>
                  <li>受給開始</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">賃金日額の計算方法</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-mono">賃金日額 = 離職前6ヶ月間の賃金総額 ÷ 180</p>
                  <p className="text-xs text-gray-500 mt-1">※ 賞与・臨時の賃金は除く</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "自己都合退職と会社都合退職で給付はどう違いますか？",
                  a: "最も大きな違いは給付制限期間と給付日数です。自己都合では2ヶ月の給付制限があり、その間は給付を受けられません。また給付日数も会社都合より少なくなります。会社都合（特定受給資格者）は給付制限なしで、年齢・勤続年数に応じた手厚い給付日数が適用されます。",
                },
                {
                  q: "失業給付をもらいながらアルバイトはできますか？",
                  a: "条件付きで可能です。ハローワークへの申告が必須で、週20時間未満・かつ31日以上雇用される予定がないことが条件です。申告せずに働いた場合は不正受給となり、給付金の3倍返還が求められます。",
                },
                {
                  q: "雇用保険に何年加入していれば失業給付がもらえますか？",
                  a: "自己都合退職の場合は離職前2年間で12ヶ月以上、会社都合・特定受給資格者の場合は離職前1年間で6ヶ月以上の被保険者期間が必要です。",
                },
                {
                  q: "失業給付に税金はかかりますか？",
                  a: "いいえ、雇用保険の基本手当（失業給付）は非課税です。所得税・住民税の課税対象外であり、確定申告も不要です。",
                },
                {
                  q: "再就職手当とは何ですか？",
                  a: "所定給付日数の3分の1以上を残して再就職した場合に受け取れる一時金です。残日数が3分の2以上なら残日数×日額×70%、3分の1以上なら残日数×日額×60%が支給されます。早期再就職のインセンティブとして重要な給付です。",
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    <span className="text-blue-600 mr-2">Q.</span>{item.q}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="text-green-600 font-semibold mr-2">A.</span>{item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/career/overtime-calculator", label: "残業代オールインワン計算機", desc: "法定時間外・深夜・休日残業代を一括計算" },
                { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職後の手取り変化をシミュレーション" },
                { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税額と手取りを自動計算" },
                { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機", desc: "万一の時に必要な保険金額を計算" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
