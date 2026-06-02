"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ============================================================
// Types
// ============================================================

type EmploymentType = "shakaihoken" | "kyosai" | "kumiai";
type WorkHours = "full" | "part20_30" | "part_under20";
type EmploymentInsuranceType = "general" | "agriculture" | "construction";

interface FormState {
  employmentType: EmploymentType;
  monthlySalary: string;
  bonus: string;
  age: string;
  prefecture: string;
  dependents: string;
  workHours: WorkHours;
  employmentInsuranceType: EmploymentInsuranceType;
  hasPensionFund: boolean;
}

interface InsurancePair {
  employee: number;
  employer: number;
}

interface CalcResult {
  hyojunGrade: number;
  hyojunAmount: number;
  health: InsurancePair;
  nursing: InsurancePair | null;
  pension: InsurancePair;
  employment: InsurancePair;
  bonusHealth: InsurancePair;
  bonusPension: InsurancePair;
  bonusEmployment: InsurancePair;
  monthlyEmployee: number;
  monthlyEmployer: number;
  annualEmployee: number;
  annualEmployer: number;
  pensionMonthly: number;
}

// ============================================================
// Data
// ============================================================

const HEALTH_RATES: Record<string, number> = {
  北海道: 10.21, 青森: 9.38, 岩手: 9.40, 宮城: 10.02, 秋田: 9.85,
  山形: 9.84, 福島: 9.53, 茨城: 9.52, 栃木: 9.79, 群馬: 9.76,
  埼玉: 9.80, 千葉: 9.75, 東京: 9.98, 神奈川: 10.02, 新潟: 9.35,
  富山: 9.57, 石川: 9.96, 福井: 9.88, 山梨: 9.72, 長野: 9.55,
  岐阜: 9.80, 静岡: 9.74, 愛知: 9.88, 三重: 9.79, 滋賀: 9.81,
  京都: 10.02, 大阪: 10.29, 兵庫: 10.18, 奈良: 9.96, 和歌山: 9.96,
  鳥取: 9.87, 島根: 9.88, 岡山: 10.03, 広島: 9.97, 山口: 9.87,
  徳島: 10.10, 香川: 10.24, 愛媛: 10.01, 高知: 10.07, 福岡: 10.36,
  佐賀: 10.42, 長崎: 10.24, 熊本: 10.30, 大分: 10.22, 宮崎: 10.06,
  鹿児島: 10.22, 沖縄: 9.89,
};

const PREFECTURES = [
  "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
  "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川",
  "新潟", "富山", "石川", "福井", "山梨", "長野",
  "岐阜", "静岡", "愛知", "三重",
  "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",
  "鳥取", "島根", "岡山", "広島", "山口",
  "徳島", "香川", "愛媛", "高知",
  "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄",
];

// 標準報酬月額等級表 — upper は「この等級の上限月収（未満）」
const HYOJUN_TABLE = [
  { grade: 1,  amount: 58000,  upper: 63000 },
  { grade: 2,  amount: 68000,  upper: 73000 },
  { grade: 3,  amount: 78000,  upper: 83000 },
  { grade: 4,  amount: 88000,  upper: 93000 },
  { grade: 5,  amount: 98000,  upper: 101000 },
  { grade: 6,  amount: 104000, upper: 107000 },
  { grade: 7,  amount: 110000, upper: 114000 },
  { grade: 8,  amount: 118000, upper: 122000 },
  { grade: 9,  amount: 126000, upper: 130000 },
  { grade: 10, amount: 134000, upper: 138000 },
  { grade: 11, amount: 142000, upper: 146000 },
  { grade: 12, amount: 150000, upper: 155000 },
  { grade: 13, amount: 160000, upper: 165000 },
  { grade: 14, amount: 170000, upper: 175000 },
  { grade: 15, amount: 180000, upper: 185000 },
  { grade: 16, amount: 190000, upper: 195000 },
  { grade: 17, amount: 200000, upper: 210000 },
  { grade: 18, amount: 220000, upper: 230000 },
  { grade: 19, amount: 240000, upper: 250000 },
  { grade: 20, amount: 260000, upper: 270000 },
  { grade: 21, amount: 280000, upper: 290000 },
  { grade: 22, amount: 300000, upper: 310000 },
  { grade: 23, amount: 320000, upper: 330000 },
  { grade: 24, amount: 340000, upper: 350000 },
  { grade: 25, amount: 360000, upper: 370000 },
  { grade: 26, amount: 380000, upper: 395000 },
  { grade: 27, amount: 410000, upper: 425000 },
  { grade: 28, amount: 440000, upper: 455000 },
  { grade: 29, amount: 470000, upper: 485000 },
  { grade: 30, amount: 500000, upper: 515000 },
  { grade: 31, amount: 530000, upper: 545000 },
  { grade: 32, amount: 560000, upper: 999999999999 },
];

const DEFAULT_FORM: FormState = {
  employmentType: "shakaihoken",
  monthlySalary: "",
  bonus: "0",
  age: "",
  prefecture: "東京",
  dependents: "0",
  workHours: "full",
  employmentInsuranceType: "general",
  hasPensionFund: false,
};

// ============================================================
// Calculation Logic
// ============================================================

function getHyojunHoshu(monthlyYen: number): { grade: number; amount: number } {
  for (const row of HYOJUN_TABLE) {
    if (monthlyYen < row.upper) {
      return { grade: row.grade, amount: row.amount };
    }
  }
  return { grade: 32, amount: 560000 };
}

function calcEmploymentRates(type: EmploymentInsuranceType): { employee: number; employer: number } {
  if (type === "agriculture") return { employee: 0.007, employer: 0.0105 };
  if (type === "construction") return { employee: 0.007, employer: 0.0115 };
  return { employee: 0.006, employer: 0.0095 };
}

function calculate(form: FormState): CalcResult | null {
  const monthly = parseFloat(form.monthlySalary);
  const ageVal = parseInt(form.age);
  if (isNaN(monthly) || monthly <= 0 || isNaN(ageVal) || ageVal <= 0) return null;

  const monthlyYen = monthly * 10000;
  const bonusYen = (parseFloat(form.bonus) || 0) * 10000;

  // 標準報酬月額
  const { grade, amount: hyojunAmount } = getHyojunHoshu(monthlyYen);

  // 健康保険料
  const healthRate = (HEALTH_RATES[form.prefecture] ?? 9.98) / 100;
  const healthEmployee = Math.floor(hyojunAmount * healthRate / 2);
  const healthEmployer = Math.floor(hyojunAmount * healthRate / 2);

  // 介護保険料 (40-64歳のみ)
  const needsNursing = ageVal >= 40 && ageVal <= 64;
  const nursingEmployee = needsNursing ? Math.floor(hyojunAmount * 0.008) : 0;
  const nursingEmployer = nursingEmployee;

  // 厚生年金保険料
  const pensionBase = Math.min(hyojunAmount, 650000);
  const pensionEmployee = Math.floor(pensionBase * 0.0915);
  const pensionEmployer = pensionEmployee;

  // 雇用保険料
  const empRates = calcEmploymentRates(form.employmentInsuranceType);
  const employmentEmployee = Math.floor(monthlyYen * empRates.employee);
  const employmentEmployer = Math.floor(monthlyYen * empRates.employer);

  // 賞与の社会保険料
  const bonusHealthEmployee = bonusYen > 0 ? Math.floor(Math.min(bonusYen, 5730000) * healthRate / 2) : 0;
  const bonusHealthEmployer = bonusHealthEmployee;
  const bonusPensionBase = Math.min(bonusYen, 1500000);
  const bonusPensionEmployee = bonusYen > 0 ? Math.floor(bonusPensionBase * 0.0915) : 0;
  const bonusPensionEmployer = bonusPensionEmployee;
  const bonusEmploymentEmployee = bonusYen > 0 ? Math.floor(bonusYen * empRates.employee) : 0;
  const bonusEmploymentEmployer = bonusYen > 0 ? Math.floor(bonusYen * empRates.employer) : 0;

  // 月額合計
  const monthlyEmployee = healthEmployee + nursingEmployee + pensionEmployee + employmentEmployee;
  const monthlyEmployerTotal = healthEmployer + nursingEmployer + pensionEmployer + employmentEmployer;

  // 年額合計
  const annualEmployee = monthlyEmployee * 12 + bonusHealthEmployee + bonusPensionEmployee + bonusEmploymentEmployee;
  const annualEmployer = monthlyEmployerTotal * 12 + bonusHealthEmployer + bonusPensionEmployer + bonusEmploymentEmployer;

  // 将来の年金受給額概算
  const alreadyMonths = Math.max(0, ageVal - 22) * 12;
  const remainMonths = Math.max(0, 65 - ageVal) * 12;
  const totalMonths = alreadyMonths + remainMonths;
  const pensionMonthly = Math.floor((hyojunAmount * 5.481 / 1000) * totalMonths / 12);

  return {
    hyojunGrade: grade,
    hyojunAmount,
    health: { employee: healthEmployee, employer: healthEmployer },
    nursing: needsNursing ? { employee: nursingEmployee, employer: nursingEmployer } : null,
    pension: { employee: pensionEmployee, employer: pensionEmployer },
    employment: { employee: employmentEmployee, employer: employmentEmployer },
    bonusHealth: { employee: bonusHealthEmployee, employer: bonusHealthEmployer },
    bonusPension: { employee: bonusPensionEmployee, employer: bonusPensionEmployer },
    bonusEmployment: { employee: bonusEmploymentEmployee, employer: bonusEmploymentEmployer },
    monthlyEmployee,
    monthlyEmployer: monthlyEmployerTotal,
    annualEmployee,
    annualEmployer,
    pensionMonthly,
  };
}

// ============================================================
// Helpers
// ============================================================

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "円";
}

function fmtMan(n: number): string {
  return (Math.round(n / 1000) / 10).toFixed(1) + "万円";
}

// ============================================================
// Component
// ============================================================

export default function SocialInsuranceCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
      active ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCalculate() {
    setError("");
    const monthly = parseFloat(form.monthlySalary);
    const age = parseInt(form.age);
    if (isNaN(monthly) || monthly <= 0) {
      setError("月給（額面）を入力してください。");
    setMascotState("error");
      return;
    }
    if (isNaN(age) || age < 15 || age > 75) {
      setError("年齢を正しく入力してください（15〜75歳）。");
    setMascotState("error");
      return;
    }
    const res = calculate(form);
    setResult(res);
    setMascotState("success");
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const monthlySalaryYen = parseFloat(form.monthlySalary) > 0
    ? parseFloat(form.monthlySalary) * 10000
    : 0;


  const faqItems = [
    { question: "社会保険料は毎月変わりますか？", answer: "原則として年1回（9月）改定されます。4〜6月の給与平均に基づいて標準報酬月額が決定し9月から翌8月まで適用されます。給与が大幅に変わった場合は随時改定の対象になることがあります。" },
    { question: "扶養家族がいると社会保険料は変わりますか？", answer: "本人の社会保険料は扶養家族の人数に関わらず変わりません。扶養家族（年収130万円未満）は追加保険料なしで健康保険に加入できます。" },
    { question: "転職したら社会保険料はどうなりますか？", answer: "転職先で新たに標準報酬月額が設定され社会保険料が変わります。転職して給与が上がると標準報酬月額も上がり社会保険料が増加します。" },
    { question: "フリーランスになると社会保険はどうなりますか？", answer: "健康保険は国民健康保険または任意継続に、年金は国民年金に切り替わります。厚生年金・雇用保険には加入できなくなります。国民健康保険料は前年所得に基づくため退職翌年は高額になる場合があります。" },
    { question: "社会保険料は給与から天引きされますか？", answer: "はい、健康保険料・厚生年金・雇用保険料は毎月の給与から自動的に天引きされます。介護保険料（40歳以上）も同様です。" }
  ];
  const useCases = [
    { icon: "💳", persona: "給与から天引きされる保険料を知りたい方", title: "社会保険料の内訳を正確に把握したい", benefit: "健保・厚年・雇保・介護の本人負担額を一括計算" },
    { icon: "🔄", persona: "転職・昇給後の保険料変化が気になる方", title: "年収アップで社会保険料がいくら増えるか", benefit: "転職前後の社会保険料差額を比較" },
    { icon: "🏃", persona: "フリーランス転身を検討中", title: "会社員と国民健康保険・国民年金の比較", benefit: "独立後の社会保険負担増加額を事前確認" }
  ];
  return (
    <>
      <IntroSection title="社会保険料計算機" paragraphs={["健康保険料・厚生年金・雇用保険・介護保険（40歳以上）を一括計算。本人負担額と会社負担額の内訳も表示します。", "都道府県別の健康保険料率、標準報酬月額の等級、2024年10月の社会保険適用拡大にも対応しています。", "登録不要・完全無料。手取り計算・転職検討・フリーランス転身の比較に活用できます。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs text-gin mb-2">転職・年収 &gt; 社会保険料計算機</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">社会保険料計算機</h1>
          <p className="text-gin text-sm md:text-base max-w-2xl">
            月給・都道府県・年齢を入力するだけで健康保険・厚生年金・雇用保険・介護保険を一括計算。
            本人負担と会社負担の両方を表示。2026年最新料率対応。
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 bg-white/20 rounded text-xs">47都道府県対応</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">会社負担も表示</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">年金受給額概算</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">2026年最新版</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Input Panel ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

            {/* Section 1 */}
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                Section 1 — 基本情報
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>雇用形態</label>
                  <select
                    className={inputClass}
                    value={form.employmentType}
                    onChange={(e) => handleChange("employmentType", e.target.value)}
                  >
                    <option value="shakaihoken">会社員（協会けんぽ）</option>
                    <option value="kyosai">公務員（共済組合）</option>
                    <option value="kumiai">会社員（組合健保）</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>月給（額面）</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="例：30"
                      value={form.monthlySalary}
                      onChange={(e) => handleChange("monthlySalary", e.target.value)}
                      min="0"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm pointer-events-none">万円</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>賞与（年間合計）</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="例：60"
                      value={form.bonus}
                      onChange={(e) => handleChange("bonus", e.target.value)}
                      min="0"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm pointer-events-none">万円</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>年齢</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="例：35"
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      min="15"
                      max="75"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm pointer-events-none">歳</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">※ 40〜64歳は介護保険料が加算されます</p>
                </div>

                <div>
                  <label className={labelClass}>都道府県（勤務地）</label>
                  <select
                    className={inputClass}
                    value={form.prefecture}
                    onChange={(e) => handleChange("prefecture", e.target.value)}
                  >
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>扶養家族の人数</label>
                  <select
                    className={inputClass}
                    value={form.dependents}
                    onChange={(e) => handleChange("dependents", e.target.value)}
                  >
                    {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <option key={n} value={String(n)}>{n}人</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">※ 本人の保険料額には影響しません</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="border-t pt-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                Section 2 — 詳細設定
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>週の所定労働時間</label>
                  <div className="flex gap-1">
                    <button type="button" className={toggleClass(form.workHours === "full")} onClick={() => handleChange("workHours", "full")}>
                      30時間以上
                    </button>
                    <button type="button" className={toggleClass(form.workHours === "part20_30")} onClick={() => handleChange("workHours", "part20_30")}>
                      20〜30時間
                    </button>
                    <button type="button" className={toggleClass(form.workHours === "part_under20")} onClick={() => handleChange("workHours", "part_under20")}>
                      20時間未満
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>雇用保険区分</label>
                  <select
                    className={inputClass}
                    value={form.employmentInsuranceType}
                    onChange={(e) => handleChange("employmentInsuranceType", e.target.value)}
                  >
                    <option value="general">一般の事業（労働者0.6%・事業主0.95%）</option>
                    <option value="agriculture">農林水産・清酒製造業（労働者0.7%・事業主1.05%）</option>
                    <option value="construction">建設業（労働者0.7%・事業主1.15%）</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>厚生年金基金への加入</label>
                  <div className="flex gap-2">
                    <button type="button" className={toggleClass(!form.hasPensionFund)} onClick={() => handleChange("hasPensionFund", false)}>
                      加入しない
                    </button>
                    <button type="button" className={toggleClass(form.hasPensionFund)} onClick={() => handleChange("hasPensionFund", true)}>
                      加入する
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-danger bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button type="button"
                onClick={handleCalculate}
                className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-bold hover:bg-ai transition-colors"
              >
                計算する
              </button>
            </div>
          </div>

          {/* ── Result Panel ── */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* 標準報酬月額 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">標準報酬月額</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-kon">
                      {result.hyojunGrade}等級
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-xl font-bold text-gray-800">
                      {result.hyojunAmount.toLocaleString()}円
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ※ 実際の月給 {monthlySalaryYen > 0 ? monthlySalaryYen.toLocaleString() + "円" : "—"} を基に等級を決定
                  </p>
                </div>

                {/* 月額内訳テーブル */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">月額社会保険料の内訳</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 text-gray-500 font-medium">保険種別</th>
                          <th className="text-right py-2 text-kon font-medium">本人負担</th>
                          <th className="text-right py-2 text-kon font-medium">会社負担</th>
                          <th className="text-right py-2 text-gray-500 font-medium">合計</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700">健康保険料</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.health.employee)}</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.health.employer)}</td>
                          <td className="py-2 text-right text-gray-600">{fmt(result.health.employee + result.health.employer)}</td>
                        </tr>
                        {result.nursing && (
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 text-gray-700">
                              介護保険料
                              <span className="ml-1 text-xs text-kon bg-gray-50 px-1 rounded">40歳以上</span>
                            </td>
                            <td className="py-2 text-right text-kon font-medium">{fmt(result.nursing.employee)}</td>
                            <td className="py-2 text-right text-kon font-medium">{fmt(result.nursing.employer)}</td>
                            <td className="py-2 text-right text-gray-600">{fmt(result.nursing.employee + result.nursing.employer)}</td>
                          </tr>
                        )}
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700">厚生年金保険料</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.pension.employee)}</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.pension.employer)}</td>
                          <td className="py-2 text-right text-gray-600">{fmt(result.pension.employee + result.pension.employer)}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700">雇用保険料</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.employment.employee)}</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.employment.employer)}</td>
                          <td className="py-2 text-right text-gray-600">{fmt(result.employment.employee + result.employment.employer)}</td>
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                          <td className="py-2.5 px-1 rounded-l text-gray-800">月額合計</td>
                          <td className="py-2.5 text-right text-kon text-base">{fmt(result.monthlyEmployee)}</td>
                          <td className="py-2.5 text-right text-kon text-base">{fmt(result.monthlyEmployer)}</td>
                          <td className="py-2.5 text-right rounded-r text-gray-700">{fmt(result.monthlyEmployee + result.monthlyEmployer)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 年間社会保険料 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">年間社会保険料</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 text-gray-500 font-medium"></th>
                          <th className="text-right py-2 text-kon font-medium">本人負担</th>
                          <th className="text-right py-2 text-kon font-medium">会社負担</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700">月給分（×12）</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.monthlyEmployee * 12)}</td>
                          <td className="py-2 text-right text-kon font-medium">{fmt(result.monthlyEmployer * 12)}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700">賞与分</td>
                          <td className="py-2 text-right text-kon font-medium">
                            {fmt(result.bonusHealth.employee + result.bonusPension.employee + result.bonusEmployment.employee)}
                          </td>
                          <td className="py-2 text-right text-kon font-medium">
                            {fmt(result.bonusHealth.employer + result.bonusPension.employer + result.bonusEmployment.employer)}
                          </td>
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                          <td className="py-2.5 px-1 rounded-l text-gray-800">年間合計</td>
                          <td className="py-2.5 text-right text-kon text-base">{fmt(result.annualEmployee)}</td>
                          <td className="py-2.5 text-right text-kon text-base rounded-r">{fmt(result.annualEmployer)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 実質給与コスト */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-kon mb-3">実質の給与コスト（会社視点）</h3>
                  {parseFloat(form.monthlySalary) > 0 && (
                    <>
                      <div className="text-center py-3">
                        <p className="text-xs text-gray-500 mb-1">会社があなたに支払う実質コスト</p>
                        <p className="text-3xl font-bold text-kon">
                          {fmt(parseFloat(form.monthlySalary) * 10000 + result.monthlyEmployer)}
                          <span className="text-base font-normal text-gray-500">/月</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          = 月給 {fmt(parseFloat(form.monthlySalary) * 10000)} +
                          会社負担保険料 {fmt(result.monthlyEmployer)}
                        </p>
                      </div>
                      <p className="text-xs text-kon bg-gray-50 rounded-lg p-2 mt-2">
                        💡 会社はあなたの月給以外に毎月 <strong>{fmt(result.monthlyEmployer)}</strong> の社会保険料を負担しています。
                      </p>
                    </>
                  )}
                </div>

                {/* 将来の年金受給額概算 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">将来の年金受給額概算</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b">
                      <span className="text-gray-600">厚生年金（月額概算）</span>
                      <span className="font-bold text-kon">約 {fmt(result.pensionMonthly)}/月</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b">
                      <span className="text-gray-600">国民年金（基礎年金・満額）</span>
                      <span className="font-bold text-gray-700">約 68,000円/月</span>
                    </div>
                    <div className="flex justify-between py-2 bg-gray-50 rounded-lg px-3 mt-1">
                      <span className="font-bold text-kon">合計受給見込み</span>
                      <span className="text-lg font-bold text-kon">
                        約 {fmtMan(result.pensionMonthly + 68000)}/月
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    ※ 現在の標準報酬月額が65歳まで継続すると仮定した概算です。
                    <a href="https://www.nenkin.go.jp/n_net/" target="_blank" rel="noopener noreferrer" className="text-kon underline ml-1">
                      ねんきんネット
                    </a>
                    でより正確な試算ができます。
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400 flex flex-col items-center justify-center min-h-64">
                <p className="text-4xl mb-4">🏢</p>
                <p className="text-sm">月給・年齢・都道府県を入力して</p>
                <p className="text-sm">「計算する」を押してください</p>
              </div>
            )}
          </div>
        </div>

        {/* ── SEO Content ── */}
        <div className="mt-12 space-y-8">

          {/* 早見表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">社会保険料の目安早見表（東京・会社員）</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">月給</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">健康保険</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">厚生年金</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">雇用保険</th>
                    <th className="text-right py-2.5 px-3 font-medium text-kon">合計（本人）</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { salary: "20万円", health: "約9,980円", pension: "約18,300円", emp: "約1,200円", total: "約29,480円" },
                    { salary: "25万円", health: "約12,475円", pension: "約22,875円", emp: "約1,500円", total: "約36,850円" },
                    { salary: "30万円", health: "約14,970円", pension: "約27,450円", emp: "約1,800円", total: "約44,220円" },
                    { salary: "40万円", health: "約19,960円", pension: "約36,600円", emp: "約2,400円", total: "約58,960円" },
                    { salary: "50万円", health: "約24,950円", pension: "約45,750円", emp: "約3,000円", total: "約73,700円" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium text-gray-800">{row.salary}</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{row.health}</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{row.pension}</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{row.emp}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-kon">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">※ 東京都 協会けんぽ 2025年度料率 / 40歳未満 / 一般の事業 での概算値</p>
          </div>

          {/* 社会保険の基礎知識 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">社会保険の基礎知識</h2>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              社会保険とは、病気・老齢・失業などのリスクに備えるための公的保険制度です。
              会社員は以下の4種類に加入します。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: "🏥",
                  title: "健康保険",
                  body: "病気やケガの際の医療費を保障。3割負担（70歳未満）で医療が受けられます。保険料率は都道府県によって異なり、協会けんぽ加入の場合は勤務地の料率が適用されます。",
                },
                {
                  icon: "👴",
                  title: "厚生年金",
                  body: "老齢・障害・死亡に備える年金。国民年金（基礎年金）に上乗せされます。保険料率は全国一律18.30%で労使折半（各9.15%）。将来の受給額は標準報酬月額と加入期間で決まります。",
                },
                {
                  icon: "💼",
                  title: "雇用保険",
                  body: "失業した際の生活保障（失業給付）や育児・介護休業給付を行う保険。保険料率は業種によって異なります（一般企業：労働者0.6%・事業主0.95%）。",
                },
                {
                  icon: "🛌",
                  title: "介護保険",
                  body: "40歳になると加入が義務付けられる、介護サービス利用のための保険。介護保険料率は1.60%（2025年度）で労使折半。65歳以上は年金から天引きされます。",
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    <span className="mr-2">{item.icon}</span>{item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-kon mb-2">📊 標準報酬月額とは</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                実際の月給を一定の等級に当てはめた金額で、社会保険料計算の基準となります。
                毎年4〜6月の平均月給を基に9月に改定されます。
              </p>
            </div>
          </div>

          {/* よくある質問 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "社会保険料は毎月変わりますか？",
                  a: "原則として年1回（9月）改定されます。4〜6月の給与平均に基づいて標準報酬月額が決定し、9月から翌8月まで適用されます。ただし給与が大幅に変わった場合は随時改定（月額変更）の対象になることがあります。",
                },
                {
                  q: "社会保険料は給与から天引きされますか？",
                  a: "はい、健康保険料・厚生年金・雇用保険料は毎月の給与から自動的に天引きされます。介護保険料（40歳以上）も同様です。住民税も天引きされますが、これは社会保険ではなく地方税です。",
                },
                {
                  q: "扶養家族がいると社会保険料は変わりますか？",
                  a: "本人の社会保険料は扶養家族の人数に関わらず変わりません。扶養家族（年収130万円未満）は追加保険料なしで健康保険に加入できます。これが「扶養のメリット」の一つです。",
                },
                {
                  q: "転職したら社会保険料はどうなりますか？",
                  a: "転職先で新たに標準報酬月額が設定され、社会保険料が変わります。転職直後は前職の標準報酬月額が引き継がれることもあります。転職して給与が上がると標準報酬月額も上がり、社会保険料が増加します。",
                },
                {
                  q: "フリーランスになると社会保険はどうなりますか？",
                  a: "会社員を辞めてフリーランスになると、健康保険は国民健康保険（または任意継続）に、年金は国民年金（第1号被保険者）に切り替わります。厚生年金・雇用保険には加入できなくなります。国民健康保険料は前年所得に基づくため、退職翌年は高額になる場合があります。",
                },
              ].map((item, i) => (
                <details key={i} className="group border border-gray-100 rounded-lg">
                  <summary className="flex justify-between items-center cursor-pointer px-4 py-3 font-medium text-gray-800 text-sm hover:bg-gray-50 rounded-lg list-none">
                    <span>Q. {item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    A. {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* あわせて使えるツール */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">あわせて使えるツール</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職前後の手取りを比較" },
                { href: "/career/overtime-calculator", label: "残業代計算機", desc: "法定時間外・深夜・休日に対応" },
                { href: "/tax/income-tax-calculator", label: "所得税・住民税計算機", desc: "年収から税額を試算" },
                { href: "/career/income-wall-checker", label: "年収の壁診断ツール", desc: "103・130・150万円の壁を確認" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block p-3 border border-gray-100 rounded-lg hover:border-ai hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-kon">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer note */}
      <div className="text-center py-6 text-xs text-gray-400">
        ※ 本ツールは一般的な計算方法に基づく概算です。正確な金額はお勤め先の給与明細または社労士にご確認ください。
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
