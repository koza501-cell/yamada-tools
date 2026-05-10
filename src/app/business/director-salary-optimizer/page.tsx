"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ─── Types ───────────────────────────────────────────────────────────────────

type CapitalSize = "under1000" | "over1000";
type EstablishmentYear = "first" | "second";
type Prefecture = "tokyo" | "osaka" | "kanagawa" | "other";
type SimMode = "auto" | "manual";

interface FormState {
  revenue: string;
  expenses: string;
  capitalSize: CapitalSize;
  establishmentYear: EstablishmentYear;
  prefecture: Prefecture;
  age: string;
  hasSpouse: boolean;
  spouseIsOfficer: boolean;
  spouseSalary: string;
  dependents: string;
  hasOtherIncome: boolean;
  otherIncome: string;
  simulationMode: SimMode;
  manualSalary: string;
}

interface TaxBreakdown {
  directorSalary: number;
  monthlySalary: number;
  corpProfit: number;
  corpTax: number;
  localCorpTax: number;
  corpResidentFixed: number;
  corpResidentVar: number;
  corpBusinessTax: number;
  specialCorpBusinessTax: number;
  corpTotal: number;
  socialInsEmployee: number;
  socialInsCompany: number;
  employmentDeduction: number;
  salaryIncome: number;
  taxableIncome: number;
  incomeTax: number;
  residentTax: number;
  totalBurden: number;
  takeHome: number;
  effectiveRate: number;
}

interface OptimalResult {
  minBurden: TaxBreakdown;
  maxTakeHome: TaxBreakdown;
  current: TaxBreakdown;
  scenarios: TaxBreakdown[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMan(v: number): string {
  return Math.round(v).toLocaleString() + "万円";
}

function fmtPct(v: number): string {
  return v.toFixed(1) + "%";
}

// ─── Calculation Functions ────────────────────────────────────────────────────

function calcEmploymentDeduction(r: number): number {
  if (r <= 162.5) return 55;
  if (r <= 180) return r * 0.4 - 10;
  if (r <= 360) return r * 0.3 + 8;
  if (r <= 660) return r * 0.2 + 44;
  if (r <= 850) return r * 0.1 + 110;
  return 195;
}

function calcIncomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  const brackets: [number, number, number][] = [
    [195, 0.05, 0],
    [330, 0.10, 9.75],
    [695, 0.20, 42.75],
    [900, 0.23, 63.60],
    [1800, 0.33, 153.60],
    [4000, 0.40, 279.60],
    [Infinity, 0.45, 479.60],
  ];
  for (const [limit, rate, deduct] of brackets) {
    if (taxable <= limit) {
      tax = taxable * rate - deduct;
      break;
    }
  }
  return Math.max(0, tax) * 1.021; // 復興特別所得税
}

function calcSocialIns(
  monthly: number,
  age: number,
  prefecture: Prefecture
): { employee: number; company: number } {
  const healthRate = prefecture === "osaka" ? 0.1029 / 2 : 0.0998 / 2;
  const health = monthly * healthRate;
  const pensionBase = Math.min(monthly, 65);
  const pension = pensionBase * 0.0915;
  const nursing = age >= 40 ? (monthly * 0.016) / 2 : 0;
  const monthlyTotal = health + pension + nursing;
  const annual = monthlyTotal * 12;
  return { employee: annual, company: annual };
}

function calcCorpTaxes(profit: number): {
  corpTax: number;
  localCorpTax: number;
  corpResidentFixed: number;
  corpResidentVar: number;
  corpBusinessTax: number;
  specialCorpBusinessTax: number;
  total: number;
} {
  if (profit <= 0) {
    return {
      corpTax: 0,
      localCorpTax: 0,
      corpResidentFixed: 7,
      corpResidentVar: 0,
      corpBusinessTax: 0,
      specialCorpBusinessTax: 0,
      total: 7,
    };
  }
  const corpTax =
    Math.min(profit, 800) * 0.15 + Math.max(0, profit - 800) * 0.232;
  const localCorpTax = corpTax * 0.103;
  const corpResidentFixed = 7;
  const corpResidentVar = corpTax * 0.173;
  const corpBusinessTax =
    Math.min(profit, 400) * 0.035 +
    Math.min(Math.max(0, profit - 400), 400) * 0.053 +
    Math.max(0, profit - 800) * 0.07;
  const specialCorpBusinessTax = corpBusinessTax * 0.37;
  const total =
    corpTax +
    localCorpTax +
    corpResidentFixed +
    corpResidentVar +
    corpBusinessTax +
    specialCorpBusinessTax;
  return {
    corpTax,
    localCorpTax,
    corpResidentFixed,
    corpResidentVar,
    corpBusinessTax,
    specialCorpBusinessTax,
    total,
  };
}

function calcTaxBreakdown(r: number, form: FormState): TaxBreakdown {
  const revenue = parseFloat(form.revenue) || 0;
  const expenses = parseFloat(form.expenses) || 0;
  const spouseSalary = form.spouseIsOfficer ? parseFloat(form.spouseSalary) || 0 : 0;
  const dependents = parseInt(form.dependents) || 0;
  const age = parseInt(form.age) || 35;
  const otherIncome = form.hasOtherIncome ? parseFloat(form.otherIncome) || 0 : 0;

  const corpProfit = Math.max(0, revenue - expenses - r - spouseSalary);
  const corp = calcCorpTaxes(corpProfit);
  const monthly = r / 12;
  const social = calcSocialIns(monthly, age, form.prefecture);

  const employmentDeduction = calcEmploymentDeduction(r);
  const salaryIncome = Math.max(0, r - employmentDeduction);

  const basicDeduction = 58;
  const spouseDeduction = form.hasSpouse && !form.spouseIsOfficer ? 38 : 0;
  const dependentDeduction = dependents * 38;

  const taxableIncome = Math.max(
    0,
    salaryIncome + otherIncome - social.employee - basicDeduction - spouseDeduction - dependentDeduction
  );

  const incomeTax = calcIncomeTax(taxableIncome);
  const residentTax = taxableIncome > 0 ? taxableIncome * 0.1 + 0.5 : 0;

  const totalBurden =
    corp.total + incomeTax + residentTax + social.employee + social.company;
  const takeHome = r - incomeTax - residentTax - social.employee;
  const effectiveRate = revenue > 0 ? (totalBurden / revenue) * 100 : 0;

  return {
    directorSalary: r,
    monthlySalary: monthly,
    corpProfit,
    corpTax: corp.corpTax,
    localCorpTax: corp.localCorpTax,
    corpResidentFixed: corp.corpResidentFixed,
    corpResidentVar: corp.corpResidentVar,
    corpBusinessTax: corp.corpBusinessTax,
    specialCorpBusinessTax: corp.specialCorpBusinessTax,
    corpTotal: corp.total,
    socialInsEmployee: social.employee,
    socialInsCompany: social.company,
    employmentDeduction,
    salaryIncome,
    taxableIncome,
    incomeTax,
    residentTax,
    totalBurden,
    takeHome,
    effectiveRate,
  };
}

function calcOptimal(form: FormState): OptimalResult {
  const revenue = parseFloat(form.revenue) || 0;
  const expenses = parseFloat(form.expenses) || 0;
  const maxR = Math.max(0, revenue - expenses);

  const results: TaxBreakdown[] = [];
  for (let r = 0; r <= maxR; r += 50) {
    results.push(calcTaxBreakdown(r, form));
  }
  if (maxR > 0 && maxR % 50 !== 0) {
    results.push(calcTaxBreakdown(maxR, form));
  }

  const minBurden = results.reduce((best, cur) =>
    cur.totalBurden < best.totalBurden ? cur : best
  );
  const maxTakeHome = results.reduce((best, cur) =>
    cur.takeHome > best.takeHome ? cur : best
  );

  // 5 scenarios around optimal
  const optR = minBurden.directorSalary;
  const step = Math.max(50, Math.round(maxR / 6 / 50) * 50);
  const scenarioRSet = new Set<number>([
    0,
    Math.round((optR / 2) / 50) * 50,
    optR,
    Math.min(maxR, optR + step),
    maxR,
  ]);
  const scenarios = Array.from(scenarioRSet)
    .sort((a, b) => a - b)
    .slice(0, 5)
    .map((r) => calcTaxBreakdown(r, form));

  const manualAnnual = (parseFloat(form.manualSalary) || 0) * 12;
  const current =
    form.simulationMode === "manual"
      ? calcTaxBreakdown(manualAnnual, form)
      : minBurden;

  return { minBurden, maxTakeHome, current, scenarios };
}

// ─── Component ───────────────────────────────────────────────────────────────

const DEFAULT_FORM: FormState = {
  revenue: "",
  expenses: "",
  capitalSize: "under1000",
  establishmentYear: "second",
  prefecture: "tokyo",
  age: "",
  hasSpouse: false,
  spouseIsOfficer: false,
  spouseSalary: "",
  dependents: "0",
  hasOtherIncome: false,
  otherIncome: "",
  simulationMode: "auto",
  manualSalary: "",
};

export default function DirectorSalaryOptimizerPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<OptimalResult | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    const revenue = parseFloat(form.revenue);
    if (!revenue || revenue <= 0) return;
    setResult(calcOptimal(form));
  }

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionCls =
    "bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4";

  const faqItems = [
    { question: "役員報酬の最適額はいくらですか？", answer: "法人の利益規模によって異なりますが、一般的に法人利益（役員報酬支払前）の60〜80%を役員報酬に設定し、法人税と個人の所得税・社会保険料のバランスを最適化します。本ツールで実際の売上・経費を入力すると最適額を自動計算します。" },
    { question: "役員報酬はゼロにしてもいいですか？", answer: "可能ですが推奨しません。役員報酬ゼロの場合、法人の利益に全額法人税がかかります。また社会保険に加入できないため、国民健康保険・国民年金の自己負担が増えます。生活費が必要な場合は適切な役員報酬を設定しましょう。" },
    { question: "配偶者を役員にするとどれくらい節税できますか？", answer: "配偶者に役員報酬を支払うことで所得を分散し、個人の税率を下げる効果があります。夫婦各500万円に分散すると合計税負担が年間50〜100万円減少することがあります。ただし配偶者が実際に業務に従事していることが必要です。" },
    { question: "役員報酬を上げると社会保険料はどうなりますか？", answer: "役員報酬に応じて社会保険料も増加します。厚生年金は標準報酬月額65万円が上限のため、それ以上は保険料が増えません。健康保険は上限が高くさらに高額になります。" },
    { question: "役員報酬の変更はいつでもできますか？", answer: "原則として事業年度開始後3ヶ月以内に決定し年度中は変更できません（定期同額給与）。変更した差額分は損金として認められず法人税の対象になります。ただし業績悪化や役員の職務変更があった場合は例外的に変更が認められる場合があります。" },
  ];

  const useCases = [
    { icon: "👔", persona: "法人設立直後の社長", title: "役員報酬をいくらに設定すべきか迷っている", benefit: "売上・経費から税負担最小の報酬額を自動算出" },
    { icon: "👫", persona: "配偶者を役員にしている（したい）経営者", title: "配偶者への報酬配分で節税できるか確認したい", benefit: "所得分散による税負担軽減額を計算" },
    { icon: "🔄", persona: "役員報酬の見直しを検討中の経営者", title: "現在の報酬額が最適かチェックしたい", benefit: "複数の報酬額シナリオを税負担で比較" },
  ];


  return (
    <>
      <IntroSection title="役員報酬最適化シミュレーター" paragraphs={["法人の売上・経費を入力すると、法人税と個人の所得税・社会保険料の合計が最小になる役員報酬額を自動計算します。", "配偶者を役員にする場合の所得分散効果や、役員報酬ゼロにした場合との比較も一覧表示。", "登録不要・完全無料。新たに法人設立した方や役員報酬の見直しを検討している方に最適です。"]} />
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">無料</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">登録不要</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">2026年最新対応</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            役員報酬 最適化シミュレーター
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base">
            法人税・所得税・社会保険料の<strong className="text-white">総負担を最小化</strong>する最適役員報酬を自動計算
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Section 1 */}
        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            法人情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>法人の年間売上（税抜）</label>
              <div className="relative">
                <input
                  type="number"
                  className={inputCls}
                  placeholder="例: 1000"
                  value={form.revenue}
                  onChange={(e) => setField("revenue", e.target.value)}
                />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>年間経費（役員報酬除く）</label>
              <div className="relative">
                <input
                  type="number"
                  className={inputCls}
                  placeholder="例: 200"
                  value={form.expenses}
                  onChange={(e) => setField("expenses", e.target.value)}
                />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>資本金</label>
              <select
                className={inputCls}
                value={form.capitalSize}
                onChange={(e) => setField("capitalSize", e.target.value as CapitalSize)}
              >
                <option value="under1000">1,000万円以下</option>
                <option value="over1000">1,000万円超</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>設立年数</label>
              <select
                className={inputCls}
                value={form.establishmentYear}
                onChange={(e) => setField("establishmentYear", e.target.value as EstablishmentYear)}
              >
                <option value="first">設立1年目</option>
                <option value="second">2年目以降</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>都道府県</label>
              <select
                className={inputCls}
                value={form.prefecture}
                onChange={(e) => setField("prefecture", e.target.value as Prefecture)}
              >
                <option value="tokyo">東京都</option>
                <option value="osaka">大阪府</option>
                <option value="kanagawa">神奈川県</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            個人情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>年齢</label>
              <div className="relative">
                <input
                  type="number"
                  className={inputCls}
                  placeholder="例: 40"
                  value={form.age}
                  onChange={(e) => setField("age", e.target.value)}
                />
                <span className="absolute right-3 top-2 text-sm text-gray-500">歳</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">40歳以上は介護保険料が加算されます</p>
            </div>
            <div>
              <label className={labelCls}>扶養家族の人数</label>
              <select
                className={inputCls}
                value={form.dependents}
                onChange={(e) => setField("dependents", e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>{n}人</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>配偶者あり？</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={form.hasSpouse}
                    onChange={() => setField("hasSpouse", true)}
                    className="text-emerald-600"
                  />
                  <span className="text-sm">あり</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!form.hasSpouse}
                    onChange={() => setField("hasSpouse", false)}
                    className="text-emerald-600"
                  />
                  <span className="text-sm">なし</span>
                </label>
              </div>
            </div>
            {form.hasSpouse && (
              <div>
                <label className={labelCls}>配偶者を役員にしていますか？</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={form.spouseIsOfficer}
                      onChange={() => setField("spouseIsOfficer", true)}
                      className="text-emerald-600"
                    />
                    <span className="text-sm">はい</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!form.spouseIsOfficer}
                      onChange={() => setField("spouseIsOfficer", false)}
                      className="text-emerald-600"
                    />
                    <span className="text-sm">いいえ</span>
                  </label>
                </div>
              </div>
            )}
            {form.hasSpouse && form.spouseIsOfficer && (
              <div>
                <label className={labelCls}>配偶者役員報酬（年額）</label>
                <div className="relative">
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="例: 300"
                    value={form.spouseSalary}
                    onChange={(e) => setField("spouseSalary", e.target.value)}
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
                </div>
              </div>
            )}
            <div>
              <label className={labelCls}>他に収入はありますか？</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={form.hasOtherIncome}
                    onChange={() => setField("hasOtherIncome", true)}
                    className="text-emerald-600"
                  />
                  <span className="text-sm">あり</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!form.hasOtherIncome}
                    onChange={() => setField("hasOtherIncome", false)}
                    className="text-emerald-600"
                  />
                  <span className="text-sm">なし</span>
                </label>
              </div>
            </div>
            {form.hasOtherIncome && (
              <div>
                <label className={labelCls}>他の所得（年額）</label>
                <div className="relative">
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="例: 100"
                    value={form.otherIncome}
                    onChange={(e) => setField("otherIncome", e.target.value)}
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 */}
        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            シミュレーション設定
          </h2>
          <div className="space-y-3 mb-4">
            <label className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${form.simulationMode === "auto" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
              <input
                type="radio"
                checked={form.simulationMode === "auto"}
                onChange={() => setField("simulationMode", "auto")}
                className="mt-0.5 text-emerald-600"
              />
              <div>
                <div className="text-sm font-medium text-gray-800">自動最適化（推奨）</div>
                <div className="text-xs text-gray-500">最も税負担が少ない役員報酬を自動計算します</div>
              </div>
            </label>
            <label className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${form.simulationMode === "manual" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}>
              <input
                type="radio"
                checked={form.simulationMode === "manual"}
                onChange={() => setField("simulationMode", "manual")}
                className="mt-0.5 text-emerald-600"
              />
              <div>
                <div className="text-sm font-medium text-gray-800">手動入力</div>
                <div className="text-xs text-gray-500">役員報酬額を自分で指定して計算します</div>
              </div>
            </label>
          </div>
          {form.simulationMode === "manual" && (
            <div className="max-w-xs">
              <label className={labelCls}>役員報酬（月額）</label>
              <div className="relative">
                <input
                  type="number"
                  className={inputCls}
                  placeholder="例: 50"
                  value={form.manualSalary}
                  onChange={(e) => setField("manualSalary", e.target.value)}
                />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円/月</span>
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md"
        >
          最適役員報酬を計算する
        </button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-5">
            {/* Optimal Card */}
            <div className="bg-white rounded-xl border-2 border-emerald-500 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3">
                <h3 className="text-white font-bold text-base">最適役員報酬の計算結果</h3>
              </div>
              <div className="p-5">
                {form.simulationMode === "auto" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                      <div className="text-xs text-emerald-600 font-medium mb-1">税負担最小の役員報酬</div>
                      <div className="text-2xl font-bold text-emerald-700">
                        月額 {Math.round(result.minBurden.monthlySalary)}万円
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        年額 {fmtMan(result.minBurden.directorSalary)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        総負担: {fmtMan(result.minBurden.totalBurden)}
                      </div>
                    </div>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                      <div className="text-xs text-teal-600 font-medium mb-1">手取り最大の役員報酬</div>
                      <div className="text-2xl font-bold text-teal-700">
                        月額 {Math.round(result.maxTakeHome.monthlySalary)}万円
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        年額 {fmtMan(result.maxTakeHome.directorSalary)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        手取り: {fmtMan(result.maxTakeHome.takeHome)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-kon font-medium mb-1">入力した役員報酬</div>
                    <div className="text-2xl font-bold text-kon">
                      月額 {form.manualSalary}万円
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      年額 {fmtMan((parseFloat(form.manualSalary) || 0) * 12)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tax Breakdown Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-sm">
                  税負担内訳
                  {form.simulationMode === "auto"
                    ? `（月額 ${Math.round(result.current.monthlySalary)}万円の場合）`
                    : `（月額 ${form.manualSalary}万円の場合）`}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: "法人税", value: result.current.corpTax, indent: false, bold: false, highlight: false, positive: false },
                  { label: "地方法人税", value: result.current.localCorpTax, indent: true, bold: false, highlight: false, positive: false },
                  { label: "法人住民税（均等割）", value: result.current.corpResidentFixed, indent: true, bold: false, highlight: false, positive: false },
                  { label: "法人住民税（法人税割）", value: result.current.corpResidentVar, indent: true, bold: false, highlight: false, positive: false },
                  { label: "法人事業税", value: result.current.corpBusinessTax, indent: true, bold: false, highlight: false, positive: false },
                  { label: "特別法人事業税", value: result.current.specialCorpBusinessTax, indent: true, bold: false, highlight: false, positive: false },
                  { label: "法人税等 合計", value: result.current.corpTotal, indent: false, bold: true, highlight: false, positive: false },
                  { label: "個人所得税", value: result.current.incomeTax, indent: false, bold: false, highlight: false, positive: false },
                  { label: "個人住民税", value: result.current.residentTax, indent: false, bold: false, highlight: false, positive: false },
                  { label: "社会保険料（本人）", value: result.current.socialInsEmployee, indent: false, bold: false, highlight: false, positive: false },
                  { label: "社会保険料（会社）", value: result.current.socialInsCompany, indent: false, bold: false, highlight: false, positive: false },
                  { label: "総負担合計", value: result.current.totalBurden, indent: false, bold: true, highlight: true, positive: false },
                  { label: "手取り（役員個人）", value: result.current.takeHome, indent: false, bold: true, highlight: false, positive: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center px-5 py-2.5 text-sm ${
                      row.highlight ? "bg-gray-50" : row.positive ? "bg-green-50" : ""
                    }`}
                  >
                    <span className={`${row.indent ? "pl-4 text-gray-500" : ""} ${row.bold ? "font-bold text-gray-800" : "text-gray-600"}`}>
                      {row.label}
                    </span>
                    <span className={`font-medium ${row.highlight ? "text-danger font-bold" : row.positive ? "text-green-700 font-bold" : "text-gray-800"}`}>
                      {fmtMan(row.value)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-5 py-2.5 text-sm">
                  <span className="text-gray-600">実効総税率（総負担/売上）</span>
                  <span className="font-medium text-gray-800">{fmtPct(result.current.effectiveRate)}</span>
                </div>
              </div>
            </div>

            {/* Scenario Comparison Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-sm">役員報酬シナリオ比較</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">役員報酬（月額）</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">法人税等</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">個人税等</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">社保（計）</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">総負担</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">手取り</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.scenarios.map((s, i) => {
                      const isOptimal = Math.abs(s.directorSalary - result.minBurden.directorSalary) < 1;
                      return (
                        <tr key={i} className={isOptimal ? "bg-emerald-50" : "hover:bg-gray-50"}>
                          <td className="px-3 py-2 font-medium text-gray-800">
                            {Math.round(s.monthlySalary)}万円
                            {isOptimal && <span className="ml-1 text-emerald-600 font-bold">★推奨</span>}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmtMan(s.corpTotal)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmtMan(s.incomeTax + s.residentTax)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmtMan(s.socialInsEmployee + s.socialInsCompany)}</td>
                          <td className={`px-3 py-2 text-right font-medium ${isOptimal ? "text-emerald-700 font-bold" : "text-gray-800"}`}>
                            {fmtMan(s.totalBurden)}
                          </td>
                          <td className="px-3 py-2 text-right text-green-700 font-medium">{fmtMan(s.takeHome)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advice Cards */}
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
                役員報酬を月額<strong> {Math.round(result.minBurden.monthlySalary)}万円（年額 {fmtMan(result.minBurden.directorSalary)}）</strong>に設定することで総税負担を最小化できます。
              </div>
              {form.spouseIsOfficer && parseFloat(form.spouseSalary) > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-kon">
                  配偶者への役員報酬<strong> {fmtMan(parseFloat(form.spouseSalary) || 0)}</strong>により、所得分散効果が働いています。夫婦の合計税負担を削減できています。
                </div>
              )}
              {Math.abs(result.minBurden.directorSalary - result.maxTakeHome.directorSalary) > 50 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-kon">
                  税負担最小（月額{Math.round(result.minBurden.monthlySalary)}万円）と手取り最大（月額{Math.round(result.maxTakeHome.monthlySalary)}万円）の最適報酬が異なります。生活費や将来の資金計画に合わせてバランスを調整してください。
                </div>
              )}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                社会保険料は役員報酬増加とともに増加します（厚生年金は月額65万円で上限）。手取り最大化と税負担最小化のバランスを考慮してください。
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <strong>注意：</strong>役員報酬は事業年度開始後3ヶ月以内に決定し、原則年度中は変更できません（定期同額給与）。
              </div>
            </div>
          </div>
        )}

        {/* SEO: 早見表 */}
        <div className="mt-10 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">役員報酬別 税負担早見表</h2>
            <p className="text-xs text-gray-500 mt-0.5">法人利益（役員報酬支払前）1,000万円の場合の目安</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">役員報酬（月額）</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">法人税等</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">個人税等+社保</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">総負担</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">手取り</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { monthly: "20万円（240万/年）", corp: "約110万円", personal: "約45万円", total: "約155万円", takehome: "約195万円" },
                  { monthly: "40万円（480万/年）", corp: "約60万円", personal: "約90万円", total: "約150万円", takehome: "約390万円" },
                  { monthly: "60万円（720万/年）", corp: "約10万円", personal: "約145万円", total: "約155万円", takehome: "約575万円" },
                  { monthly: "83万円（1,000万/年）", corp: "約7万円", personal: "約225万円", total: "約232万円", takehome: "約768万円" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{row.monthly}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{row.corp}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{row.personal}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-800">{row.total}</td>
                    <td className="px-3 py-2 text-right text-green-700 font-medium">{row.takehome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: 基礎知識 */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">役員報酬の基礎知識</h2>
          <p className="text-sm text-gray-700 mb-4">
            役員報酬は法人の利益と個人の税金のバランスを最適化する重要な経営判断です。
          </p>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">役員報酬と法人税の関係</h3>
          <p className="text-sm text-gray-700 mb-4">
            役員報酬を増やすと法人の課税所得が減り、法人税が下がります。一方で役員個人の所得税・社会保険料が増加します。この2つのトレードオフの最適点を見つけることが重要です。
          </p>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">定期同額給与のルール</h3>
          <p className="text-sm text-gray-700 mb-4">
            役員報酬は「定期同額給与」として、毎月同額を支払うことが原則です。事業年度開始後3ヶ月以内に金額を決定し、原則として年度中は変更できません。変更した場合は差額分が損金（経費）として認められなくなります。
          </p>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">社会保険料の注意点</h3>
          <p className="text-sm text-gray-700 mb-4">
            法人化すると社会保険（健康保険+厚生年金）への加入が義務化されます。保険料は会社と個人が折半しますが、社長の場合は実質的に全額自己負担です。役員報酬が高いほど社会保険料も増加します（厚生年金は上限あり）。
          </p>
          <h3 className="font-bold text-gray-800 mb-2 text-sm">節税のポイント</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>配偶者・家族を役員にして報酬を分散（所得分散効果）</li>
            <li>役員社宅制度の活用（家賃の一部を法人経費に）</li>
            <li>出張日当の支給（旅費規程の整備で非課税）</li>
            <li>小規模企業共済への加入（個人の節税）</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: "役員報酬の最適額はいくらですか？",
                a: "法人の利益規模によって異なりますが、一般的に法人利益（役員報酬支払前）の60〜80%を役員報酬に設定し、法人に残る利益に対する法人税と個人の所得税・社会保険料のバランスを最適化します。本ツールで実際の売上・経費を入力すると最適額を自動計算します。",
              },
              {
                q: "役員報酬はゼロにしてもいいですか？",
                a: "可能ですが推奨しません。役員報酬ゼロの場合、法人の利益に全額法人税がかかります。また社会保険に加入できないため、国民健康保険・国民年金の自己負担が増えます。生活費が必要な場合は適切な役員報酬を設定しましょう。",
              },
              {
                q: "配偶者を役員にするとどれくらい節税できますか？",
                a: "配偶者に役員報酬を支払うことで所得を分散し、個人の税率を下げる効果があります。例えば夫の役員報酬1,000万円を夫婦各500万円に分散すると、合計税負担が年間50〜100万円減少することがあります。ただし配偶者が実際に業務に従事していることが必要です。",
              },
              {
                q: "役員報酬を上げると社会保険料はどうなりますか？",
                a: "役員報酬（標準報酬月額）に応じて社会保険料も増加します。厚生年金は標準報酬月額65万円（年収780万円）が上限のため、それ以上は保険料が増えません。健康保険は上限が高く、さらに高額になります。",
              },
              {
                q: "役員報酬の変更はいつでもできますか？",
                a: "原則として事業年度開始後3ヶ月以内に決定し、年度中は変更できません（定期同額給与）。変更した差額分は損金として認められず、法人税の対象になります。ただし業績悪化や役員の職務変更があった場合は例外的に変更が認められる場合があります。",
              },
            ].map((faq, i) => (
              <div key={i} className="border-l-4 border-emerald-400 pl-4">
                <dt className="font-bold text-gray-800 text-sm mb-1">Q. {faq.q}</dt>
                <dd className="text-sm text-gray-700 leading-relaxed">A. {faq.a}</dd>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-3">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/business/incorporation-simulator", label: "個人事業主 vs 法人化 比較ツール", desc: "法人化のメリット・デメリットを比較" },
              { href: "/business/corporate-tax-calculator", label: "法人税 計算機", desc: "法人税・住民税・事業税を一括計算" },
              { href: "/career/social-insurance-calculator", label: "社会保険料計算機", desc: "健康保険・厚生年金の保険料を計算" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "個人の所得税・住民税を計算" },
            ].map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="block p-3 border border-gray-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-800">{tool.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-400 text-center pb-6">
          ※本ツールの計算結果は概算です。実際の税額は税理士等の専門家にご相談ください。2026年（令和8年）の税率・保険料率を使用しています。
        </p>
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

  </>
  );
}
