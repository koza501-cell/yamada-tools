"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ============================================================
// Types
// ============================================================

type BusinessType = "type1" | "type2" | "type3" | "exempt";
type Prefecture = "tokyo" | "osaka" | "kanagawa" | "other";
type CapitalAmount = "100" | "300" | "500" | "1000";
type IncorporationCost = "self" | "professional";

interface FormState {
  revenue: string;
  expenses: string;
  businessType: BusinessType;
  isTaxable: boolean;
  age: string;
  hasSpouse: boolean;
  dependents: string;
  desiredTakeHome: string;
  prefecture: Prefecture;
  capitalAmount: CapitalAmount;
  hasFamilyEmployee: boolean;
  familyEmployeeSalary: string;
  incorporationCost: IncorporationCost;
}

interface SoloResult {
  businessIncome: number;
  jigyozei: number;
  nationalHealth: number;
  nationalPension: number;
  incomeTax: number;
  residentTax: number;
  totalBurden: number;
  takeHome: number;
  effectiveRate: number;
}

interface CorpResult {
  officerSalary: number;
  corporateTax: number;
  localCorporateTax: number;
  corporateResidentTax: number;
  corporateBusinessTax: number;
  specialBusinessTax: number;
  totalCorpTax: number;
  socialInsEmployee: number;
  socialInsCompany: number;
  personalIncomeTax: number;
  personalResidentTax: number;
  totalBurden: number;
  takeHome: number;
  effectiveRate: number;
}

interface CalcResult {
  solo: SoloResult;
  corp: CorpResult;
  savings: number;
  breakEvenRevenue: number | null;
  incorporationCostAmount: number;
}

// ============================================================
// Calculation helpers
// ============================================================

// 所得税（累進）+ 復興特別所得税 — 単位：万円
function calcIncomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  if (taxable <= 195) tax = taxable * 0.05;
  else if (taxable <= 330) tax = taxable * 0.10 - 9.75;
  else if (taxable <= 695) tax = taxable * 0.20 - 42.75;
  else if (taxable <= 900) tax = taxable * 0.23 - 63.6;
  else if (taxable <= 1800) tax = taxable * 0.33 - 153.6;
  else tax = taxable * 0.40 - 279.6;
  return Math.max(0, tax * 1.021);
}

// 給与所得控除 — 単位：万円
function calcEmploymentDeduction(salary: number): number {
  if (salary <= 0) return 0;
  if (salary <= 180) return Math.max(55, salary * 0.40);
  if (salary <= 360) return salary * 0.30 + 18;
  if (salary <= 660) return salary * 0.20 + 54;
  if (salary <= 850) return salary * 0.10 + 120;
  return 195;
}

// 国民健康保険料（東京都基準） — 単位：万円
function calcNationalHealth(businessIncome: number, age: number, prefecture: Prefecture): number {
  const base = Math.max(0, businessIncome - 43); // 所得割基準
  const multiplier = prefecture === "tokyo" ? 1.0 : 0.95;

  // 医療分
  const iryoShotoku = base * 0.0738;
  const iryoKinto = 5.24; // 52,400円 → 万円
  const iryo = iryoShotoku + iryoKinto;

  // 支援金分
  const shienShotoku = base * 0.0247;
  const shienKinto = 1.86; // 18,600円 → 万円
  const shien = shienShotoku + shienKinto;

  // 介護分（40〜64歳）
  let kaigo = 0;
  if (age >= 40 && age < 65) {
    const kaigoShotoku = base * 0.0210;
    const kaigoKinto = 1.80; // 18,000円 → 万円
    kaigo = Math.min(kaigoShotoku + kaigoKinto, 24);
  }

  const iryoShienCapped = Math.min(iryo + shien, 106);
  return (iryoShienCapped + kaigo) * multiplier;
}

// 個人事業税 — 単位：万円
function calcJigyozei(businessIncome: number, businessType: BusinessType): number {
  const base = Math.max(0, businessIncome - 290);
  if (base <= 0) return 0;
  switch (businessType) {
    case "type1": return base * 0.05;
    case "type2": return base * 0.04;
    case "type3": return base * 0.05;
    case "exempt": return 0;
  }
}

// 法人税等の計算 — 単位：万円
function calcCorpTaxes(profit: number): {
  corporateTax: number;
  localCorporateTax: number;
  corporateResidentTax: number;
  corporateBusinessTax: number;
  specialBusinessTax: number;
  total: number;
} {
  if (profit <= 0) {
    // 赤字でも均等割7万円は発生
    return { corporateTax: 0, localCorporateTax: 0, corporateResidentTax: 0.7, corporateBusinessTax: 0, specialBusinessTax: 0, total: 0.7 };
  }

  // 法人税（中小法人）
  let corporateTax = 0;
  if (profit <= 800) {
    corporateTax = profit * 0.15;
  } else {
    corporateTax = 800 * 0.15 + (profit - 800) * 0.232;
  }

  // 地方法人税
  const localCorporateTax = corporateTax * 0.103;

  // 法人住民税（法人税割 + 均等割7万円）
  const corporateResidentTax = corporateTax * 0.173 + 0.7;

  // 法人事業税
  let corporateBusinessTax = 0;
  if (profit <= 400) {
    corporateBusinessTax = profit * 0.035;
  } else if (profit <= 800) {
    corporateBusinessTax = 400 * 0.035 + (profit - 400) * 0.053;
  } else {
    corporateBusinessTax = 400 * 0.035 + 400 * 0.053 + (profit - 800) * 0.070;
  }

  // 特別法人事業税
  const specialBusinessTax = corporateBusinessTax * 0.37;

  const total = corporateTax + localCorporateTax + corporateResidentTax + corporateBusinessTax + specialBusinessTax;
  return { corporateTax, localCorporateTax, corporateResidentTax, corporateBusinessTax, specialBusinessTax, total };
}

// 社会保険料（役員個人分と会社負担分）— 単位：万円/年
function calcSocialIns(monthlyOfficerSalary: number, age: number, prefecture: Prefecture): { employee: number; employer: number } {
  const hyojun = Math.min(Math.max(monthlyOfficerSalary, 5.8), 65); // 標準報酬月額（概算）
  const healthRate = prefecture === "tokyo" ? 0.0998 : 0.1003;
  const health = hyojun * (healthRate / 2);
  const pension = Math.min(hyojun, 65) * 0.0915;
  const nursing = age >= 40 && age < 65 ? hyojun * 0.0080 : 0;
  const monthlyEach = health + pension + nursing;
  return {
    employee: monthlyEach * 12,
    employer: monthlyEach * 12,
  };
}

function calcSolo(form: FormState): SoloResult {
  const revenue = parseFloat(form.revenue) || 0;
  const expenses = parseFloat(form.expenses) || 0;
  const age = parseInt(form.age) || 40;
  const dependents = parseInt(form.dependents) || 0;

  const businessIncome = Math.max(0, revenue - expenses - 65); // 青色申告65万控除

  const jigyozei = calcJigyozei(businessIncome, form.businessType);
  const nationalHealth = calcNationalHealth(businessIncome, age, form.prefecture);
  const nationalPension = 24.684; // 20,570円×12ヶ月

  const socialDeduction = nationalHealth + nationalPension;
  const basicDeduction = 58; // 2026年改正
  const spouseDeduction = form.hasSpouse ? 38 : 0;
  const dependentDeduction = 38 * dependents;

  const taxableIncome = Math.max(0, businessIncome - socialDeduction - basicDeduction - spouseDeduction - dependentDeduction);
  const incomeTax = calcIncomeTax(taxableIncome);

  const residentTaxableBase = Math.max(0, businessIncome - socialDeduction - 43 - spouseDeduction - dependentDeduction);
  const residentTax = Math.max(0, residentTaxableBase * 0.10 + 0.5); // +均等割5,000円

  const totalBurden = jigyozei + nationalHealth + nationalPension + incomeTax + residentTax;
  const takeHome = businessIncome - totalBurden;
  const effectiveRate = businessIncome > 0 ? (totalBurden / businessIncome) * 100 : 0;

  return { businessIncome, jigyozei, nationalHealth, nationalPension, incomeTax, residentTax, totalBurden, takeHome, effectiveRate };
}

function calcCorp(form: FormState): CorpResult {
  const revenue = parseFloat(form.revenue) || 0;
  const expenses = parseFloat(form.expenses) || 0;
  const age = parseInt(form.age) || 40;
  const dependents = parseInt(form.dependents) || 0;
  const desiredTakeHome = parseFloat(form.desiredTakeHome) || 500;
  const familySalary = form.hasFamilyEmployee ? (parseFloat(form.familyEmployeeSalary) || 0) : 0;

  // 役員報酬の推定：希望手取りから逆算（概算）
  let officerSalary = Math.max(desiredTakeHome / 0.72, desiredTakeHome + 50);
  // 法人利益がマイナスにならないよう制限
  const maxSalary = Math.max(0, revenue - expenses - familySalary - 10);
  officerSalary = Math.min(officerSalary, maxSalary);

  // 社会保険料
  const monthlyOfficerSalary = officerSalary / 12;
  const socialIns = calcSocialIns(monthlyOfficerSalary, age, form.prefecture);

  // 役員個人の税金
  const salaryIncome = Math.max(0, officerSalary - calcEmploymentDeduction(officerSalary));
  const basicDeduction = 58;
  const spouseDeduction = form.hasSpouse ? 38 : 0;
  const dependentDeduction = 38 * dependents;
  const personalTaxable = Math.max(0, salaryIncome - socialIns.employee - basicDeduction - spouseDeduction - dependentDeduction);
  const personalIncomeTax = calcIncomeTax(personalTaxable);

  const residentTaxableBase = Math.max(0, salaryIncome - socialIns.employee - 43 - spouseDeduction - dependentDeduction);
  const personalResidentTax = Math.max(0, residentTaxableBase * 0.10 + 0.5);

  // 法人利益
  const corpProfit = Math.max(0, revenue - expenses - officerSalary - familySalary);
  const corpTaxes = calcCorpTaxes(corpProfit);

  const totalCorpTax = corpTaxes.total;
  const totalBurden = totalCorpTax + socialIns.employee + socialIns.employer + personalIncomeTax + personalResidentTax;

  const takeHome = officerSalary - socialIns.employee - personalIncomeTax - personalResidentTax;
  const totalIncome = revenue - expenses - familySalary;
  const effectiveRate = totalIncome > 0 ? (totalBurden / totalIncome) * 100 : 0;

  return {
    officerSalary,
    corporateTax: corpTaxes.corporateTax,
    localCorporateTax: corpTaxes.localCorporateTax,
    corporateResidentTax: corpTaxes.corporateResidentTax,
    corporateBusinessTax: corpTaxes.corporateBusinessTax,
    specialBusinessTax: corpTaxes.specialBusinessTax,
    totalCorpTax,
    socialInsEmployee: socialIns.employee,
    socialInsCompany: socialIns.employer,
    personalIncomeTax,
    personalResidentTax,
    totalBurden,
    takeHome,
    effectiveRate,
  };
}

function calcBreakEven(form: FormState): number | null {
  for (let rev = 300; rev <= 3000; rev += 10) {
    const f = { ...form, revenue: String(rev) };
    const s = calcSolo(f);
    const c = calcCorp(f);
    if (c.totalBurden < s.totalBurden) return rev;
  }
  return null;
}

// ============================================================
// Formatters
// ============================================================

function fmtMan(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "万円";
}
function fmtManSigned(n: number): string {
  return (n >= 0 ? "+" : "") + Math.round(n).toLocaleString("ja-JP") + "万円";
}
function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}
function fmtPctSigned(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

// ============================================================
// Initial state
// ============================================================

const initialForm: FormState = {
  revenue: "",
  expenses: "",
  businessType: "type1",
  isTaxable: false,
  age: "",
  hasSpouse: false,
  dependents: "0",
  desiredTakeHome: "",
  prefecture: "tokyo",
  capitalAmount: "300",
  hasFamilyEmployee: false,
  familyEmployeeSalary: "",
  incorporationCost: "professional",
};

// ============================================================
// Component
// ============================================================

export default function IncorporationSimulatorPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  function handleCalculate() {
    const solo = calcSolo(form);
    const corp = calcCorp(form);
    const savings = solo.totalBurden - corp.totalBurden;
    const breakEvenRevenue = calcBreakEven(form);
    const incorporationCostAmount = form.incorporationCost === "self" ? 10 : 25;
    setResult({ solo, corp, savings, breakEvenRevenue, incorporationCostAmount });
    setMascotState("success");
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setForm(initialForm);
    setResult(null);
  }

  const canCalculate = !!form.revenue && !!form.age && !!form.desiredTakeHome;

  function getVerdict() {
    if (!result) return null;
    const diff = result.savings;
    if (diff > 50) return { type: "green", icon: "🟢", message: `法人化で年間約${Math.round(diff)}万円の節税が見込めます` };
    if (diff <= 0) return { type: "yellow", icon: "🟡", message: "現状は個人事業主の方が有利です" };
    return { type: "blue", icon: "🔵", message: "税負担の差は小さく、法人維持コストを考慮して判断しましょう" };
  }

  const verdict = getVerdict();

  const faqItems = [
    { question: "法人化（法人成り）はいくらから有利ですか？", answer: "一般的に事業所得が600〜700万円を超えると法人化が有利になり始めます。ただし税理士顧問料などの法人維持コストも考慮する必要があります。" },
    { question: "個人事業主と法人ではどちらが社会保険料が安いですか？", answer: "低い所得では国民健康保険+国民年金の方が安い場合があります。法人の場合は会社が保険料の半分を負担するため実質的な個人負担は同程度になることが多いです。" },
    { question: "合同会社と株式会社どちらで設立すべきですか？", answer: "税金面での違いはありません。設立費用は合同会社約10万円、株式会社約25万円です。銀行融資や取引先からの信用を重視する場合は株式会社が有利な場合があります。" },
    { question: "法人化後に個人事業主に戻ることはできますか？", answer: "法人を解散することは可能ですが、解散・清算の手続きに費用と時間がかかります。法人化は中長期的な視点で決断することが重要です。" },
    { question: "一人社長の場合も社会保険に加入しなければなりませんか？", answer: "はい、一人会社でも役員報酬を支払う場合は社会保険への加入が義務です。ただし役員報酬をゼロにすれば加入義務はありません。" },
  ];

  const useCases = [
    { icon: "📈", persona: "売上が増えてきた個人事業主", title: "そろそろ法人化すべきか数字で判断したい", benefit: "売上別の個人vs法人の税負担差額を一目で比較" },
    { icon: "👨‍👩‍👦", persona: "配偶者と一緒に事業をしている方", title: "法人化して配偶者を役員にする節税効果を確認", benefit: "所得分散による節税額と社会保険の変化を計算" },
    { icon: "🏦", persona: "融資・取引拡大を考えている事業者", title: "法人化の信用力向上と税負担のトレードオフを知りたい", benefit: "法人化メリット・デメリットを総合的に試算" },
  ];


  return (
    <>
      <IntroSection title="個人事業主 vs 法人化 比較ツール" paragraphs={["年間売上・経費・家族構成を入力すると、個人事業主と法人の税負担・社会保険料・手取りを比較します。法人化することで節税できる金額と、税理士費用などのコストも含めた判断ができます。", "売上規模ごとの推奨判定（個人事業主のまま/法人化推奨）も表示。合同会社と株式会社の違いも解説します。", "登録不要・完全無料。法人化のタイミングを数字で判断したい方に最適です。"]} />
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-emerald-200 text-xs mb-2">ビジネス・法人 &gt; 個人事業主 vs 法人化 比較ツール</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">個人事業主 vs 法人化 比較ツール</h1>
          <p className="text-emerald-100 text-sm md:text-base">
            所得税・事業税・社会保険料・法人税を一括計算。法人化が有利になる売上ラインも自動算出。登録不要・完全無料。2026年最新税制対応。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-emerald-700 text-emerald-100 text-xs px-2 py-1 rounded">登録不要</span>
            <span className="bg-emerald-700 text-emerald-100 text-xs px-2 py-1 rounded">完全無料</span>
            <span className="bg-emerald-700 text-emerald-100 text-xs px-2 py-1 rounded">2026年最新税制</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">

          {/* Section 1: 事業情報 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">Section 1：事業情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>年間売上（税抜）（万円）<span className="text-red-500 ml-1">*</span></label>
                <input type="number" className={inputClass} placeholder="例：1000"
                  value={form.revenue} onChange={(e) => setForm((p) => ({ ...p, revenue: e.target.value }))} min="0" />
              </div>
              <div>
                <label className={labelClass}>年間経費（万円）</label>
                <input type="number" className={inputClass} placeholder="例：200"
                  value={form.expenses} onChange={(e) => setForm((p) => ({ ...p, expenses: e.target.value }))} min="0" />
                <p className="text-xs text-gray-500 mt-1">人件費・仕入れ・家賃・通信費など。役員報酬・青色申告控除は除く</p>
              </div>
              <div>
                <label className={labelClass}>事業の種類</label>
                <select className={inputClass} value={form.businessType}
                  onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value as BusinessType }))}>
                  <option value="type1">第1種（物販・製造・サービス等）5%</option>
                  <option value="type2">第2種（畜産・水産等）4%</option>
                  <option value="type3">第3種（医師・弁護士等）5%</option>
                  <option value="exempt">対象外業種</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">個人事業税の税率が異なります</p>
              </div>
              <div>
                <label className={labelClass}>消費税課税事業者ですか？</label>
                <div className="flex gap-2">
                  {(["いいえ", "はい"] as const).map((label, i) => (
                    <button key={label}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${form.isTaxable === (i === 1) ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      onClick={() => setForm((p) => ({ ...p, isTaxable: i === 1 }))}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">2年前の売上が1,000万円超の場合は課税事業者</p>
              </div>
            </div>
          </div>

          {/* Section 2: 個人情報 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">Section 2：個人情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>年齢（歳）<span className="text-red-500 ml-1">*</span></label>
                <input type="number" className={inputClass} placeholder="例：38"
                  value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} min="18" max="80" />
                <p className="text-xs text-gray-500 mt-1">40〜64歳は介護保険料が加算されます</p>
              </div>
              <div>
                <label className={labelClass}>配偶者あり？</label>
                <div className="flex gap-2">
                  {(["なし", "あり"] as const).map((label, i) => (
                    <button key={label}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${form.hasSpouse === (i === 1) ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      onClick={() => setForm((p) => ({ ...p, hasSpouse: i === 1 }))}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>扶養家族の人数</label>
                <select className={inputClass} value={form.dependents}
                  onChange={(e) => setForm((p) => ({ ...p, dependents: e.target.value }))}>
                  {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}人</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>希望する手取り年収（万円）<span className="text-red-500 ml-1">*</span></label>
                <input type="number" className={inputClass} placeholder="例：500"
                  value={form.desiredTakeHome} onChange={(e) => setForm((p) => ({ ...p, desiredTakeHome: e.target.value }))} min="0" />
                <p className="text-xs text-gray-500 mt-1">法人化した場合の役員報酬の目安として使用します。役員報酬額が高いほど社会保険料（厚生年金・健康保険）が増加し、法人化のメリットが小さくなる場合があります。</p>
              </div>
              <div>
                <label className={labelClass}>居住地域</label>
                <select className={inputClass} value={form.prefecture}
                  onChange={(e) => setForm((p) => ({ ...p, prefecture: e.target.value as Prefecture }))}>
                  <option value="tokyo">東京都</option>
                  <option value="osaka">大阪府</option>
                  <option value="kanagawa">神奈川県</option>
                  <option value="other">その他</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">国民健康保険料の計算に使用します</p>
              </div>
            </div>
          </div>

          {/* Section 3: 法人化の条件 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">Section 3：法人化の条件（任意）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>法人の資本金</label>
                <select className={inputClass} value={form.capitalAmount}
                  onChange={(e) => setForm((p) => ({ ...p, capitalAmount: e.target.value as CapitalAmount }))}>
                  <option value="100">100万円</option>
                  <option value="300">300万円</option>
                  <option value="500">500万円</option>
                  <option value="1000">1,000万円</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>法人設立費用（司法書士等）</label>
                <select className={inputClass} value={form.incorporationCost}
                  onChange={(e) => setForm((p) => ({ ...p, incorporationCost: e.target.value as IncorporationCost }))}>
                  <option value="self">自分で設立（約10万円）</option>
                  <option value="professional">専門家依頼（約25万円）</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>家族従業員はいますか？</label>
                <div className="flex gap-2 mb-3">
                  {(["いいえ", "はい"] as const).map((label, i) => (
                    <button key={label}
                      className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${form.hasFamilyEmployee === (i === 1) ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      onClick={() => setForm((p) => ({ ...p, hasFamilyEmployee: i === 1 }))}>
                      {label}
                    </button>
                  ))}
                </div>
                {form.hasFamilyEmployee && (
                  <div>
                    <label className={labelClass}>家族役員報酬（万円/年）</label>
                    <input type="number" className={inputClass} placeholder="例：240"
                      value={form.familyEmployeeSalary} onChange={(e) => setForm((p) => ({ ...p, familyEmployeeSalary: e.target.value }))} min="0" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={handleReset}
              className="flex-none px-6 py-3 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              リセット
            </button>
            <button onClick={handleCalculate} disabled={!canCalculate}
              className="flex-1 py-3 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              比較計算する
            </button>
          </div>
          {!canCalculate && (
            <p className="text-xs text-gray-400 text-center">年間売上・年齢・希望手取り年収を入力してください</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div id="results-section" className="space-y-6">

            {/* 判定カード */}
            <div className={
              verdict?.type === "green" ? "rounded-xl shadow-sm border p-6 bg-green-50 border-green-200"
              : verdict?.type === "yellow" ? "rounded-xl shadow-sm border p-6 bg-yellow-50 border-yellow-200"
              : "rounded-xl shadow-sm border p-6 bg-blue-50 border-blue-200"
            }>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{verdict?.icon}</span>
                <p className={
                  verdict?.type === "green" ? "text-xl font-bold text-green-800"
                  : verdict?.type === "yellow" ? "text-xl font-bold text-yellow-800"
                  : "text-xl font-bold text-blue-800"
                }>{verdict?.message}</p>
              </div>
              <p className="text-sm text-gray-600">
                {verdict?.type === "green"
                  ? "法人化への切り替えを税理士と相談することをお勧めします。"
                  : verdict?.type === "yellow"
                  ? "事業所得が増えるにつれ法人化のメリットが大きくなります。"
                  : "法人維持コスト（顧問税理士費・均等割等）も考慮した上で判断してください。"}
              </p>
            </div>

            {/* 税負担の比較表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">税負担の比較表</h2>
              {/* Desktop table — hidden on mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-3 text-gray-600 font-medium">項目</th>
                      <th className="text-right py-3 px-3 text-gray-600 font-medium">個人事業主</th>
                      <th className="text-right py-3 px-3 text-gray-600 font-medium">法人化</th>
                      <th className="text-right py-3 px-3 text-gray-600 font-medium">差額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "所得税・住民税",
                        solo: result.solo.incomeTax + result.solo.residentTax,
                        corp: result.corp.personalIncomeTax + result.corp.personalResidentTax,
                      },
                      {
                        label: "事業税 / 法人税等",
                        solo: result.solo.jigyozei,
                        corp: result.corp.totalCorpTax,
                      },
                      {
                        label: "健康保険料",
                        solo: result.solo.nationalHealth,
                        corp: result.corp.socialInsEmployee + result.corp.socialInsCompany,
                      },
                      {
                        label: "年金保険料",
                        solo: result.solo.nationalPension,
                        corp: 0,
                      },
                    ].map((row) => {
                      const diff = row.corp - row.solo;
                      return (
                        <tr key={row.label} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3 text-gray-700 font-medium">{row.label}</td>
                          <td className="text-right py-3 px-3">{fmtMan(row.solo)}</td>
                          <td className="text-right py-3 px-3">{fmtMan(row.corp)}</td>
                          <td className={"text-right py-3 px-3 font-bold " + (diff < 0 ? "text-green-600" : diff > 0 ? "text-red-600" : "text-gray-500")}>
                            {fmtManSigned(diff)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-bold border-b">
                      <td className="py-3 px-3 text-gray-900">総負担合計</td>
                      <td className="text-right py-3 px-3 text-gray-900">{fmtMan(result.solo.totalBurden)}</td>
                      <td className="text-right py-3 px-3 text-gray-900">{fmtMan(result.corp.totalBurden)}</td>
                      <td className={"text-right py-3 px-3 " + (result.savings > 0 ? "text-green-600" : "text-red-600")}>
                        {fmtManSigned(-result.savings)}
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3 text-gray-700 font-medium">手取り</td>
                      <td className="text-right py-3 px-3 font-bold text-emerald-700">{fmtMan(result.solo.takeHome)}</td>
                      <td className="text-right py-3 px-3 font-bold text-emerald-700">{fmtMan(result.corp.takeHome)}</td>
                      <td className={"text-right py-3 px-3 font-bold " + (result.corp.takeHome - result.solo.takeHome >= 0 ? "text-green-600" : "text-red-600")}>
                        {fmtManSigned(result.corp.takeHome - result.solo.takeHome)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-3 text-gray-700 font-medium">実効税率</td>
                      <td className="text-right py-3 px-3">{fmtPct(result.solo.effectiveRate)}</td>
                      <td className="text-right py-3 px-3">{fmtPct(result.corp.effectiveRate)}</td>
                      <td className={"text-right py-3 px-3 font-bold " + (result.corp.effectiveRate - result.solo.effectiveRate < 0 ? "text-green-600" : "text-red-600")}>
                        {fmtPctSigned(result.corp.effectiveRate - result.solo.effectiveRate)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile card layout — hidden on sm+ */}
              <div className="sm:hidden space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-3 gap-1 text-center pb-1 border-b border-gray-200">
                  <div />
                  <p className="text-xs font-medium text-gray-500">個人</p>
                  <p className="text-xs font-medium text-gray-500">法人</p>
                </div>
                {[
                  {
                    label: "所得税・住民税",
                    solo: result.solo.incomeTax + result.solo.residentTax,
                    corp: result.corp.personalIncomeTax + result.corp.personalResidentTax,
                  },
                  {
                    label: "事業税 / 法人税等",
                    solo: result.solo.jigyozei,
                    corp: result.corp.totalCorpTax,
                  },
                  {
                    label: "健康保険料",
                    solo: result.solo.nationalHealth,
                    corp: result.corp.socialInsEmployee + result.corp.socialInsCompany,
                  },
                  {
                    label: "年金保険料",
                    solo: result.solo.nationalPension,
                    corp: 0,
                  },
                ].map((row) => {
                  const diff = row.corp - row.solo;
                  return (
                    <div key={row.label} className="border border-gray-100 rounded-lg p-2">
                      <p className="text-xs font-medium text-gray-600 mb-1.5">{row.label}</p>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div className="bg-gray-50 rounded p-1.5">
                          <p className="text-xs font-semibold text-gray-800">{fmtMan(row.solo)}</p>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5">
                          <p className="text-xs font-semibold text-gray-800">{fmtMan(row.corp)}</p>
                        </div>
                        <div className="rounded p-1.5">
                          <p className={"text-xs font-bold " + (diff < 0 ? "text-green-600" : diff > 0 ? "text-red-600" : "text-gray-500")}>{fmtManSigned(diff)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* 総負担合計 */}
                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <p className="text-xs font-bold text-gray-900 mb-1.5">総負担合計</p>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-white rounded p-1.5">
                      <p className="text-xs font-bold text-gray-900">{fmtMan(result.solo.totalBurden)}</p>
                    </div>
                    <div className="bg-white rounded p-1.5">
                      <p className="text-xs font-bold text-gray-900">{fmtMan(result.corp.totalBurden)}</p>
                    </div>
                    <div className="rounded p-1.5">
                      <p className={"text-xs font-bold " + (result.savings > 0 ? "text-green-600" : "text-red-600")}>{fmtManSigned(-result.savings)}</p>
                    </div>
                  </div>
                </div>
                {/* 手取り */}
                <div className="border border-emerald-200 rounded-lg p-2 bg-emerald-50">
                  <p className="text-xs font-bold text-emerald-800 mb-1.5">手取り</p>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-white rounded p-1.5">
                      <p className="text-xs font-bold text-emerald-700">{fmtMan(result.solo.takeHome)}</p>
                    </div>
                    <div className="bg-white rounded p-1.5">
                      <p className="text-xs font-bold text-emerald-700">{fmtMan(result.corp.takeHome)}</p>
                    </div>
                    <div className="rounded p-1.5">
                      <p className={"text-xs font-bold " + (result.corp.takeHome - result.solo.takeHome >= 0 ? "text-green-600" : "text-red-600")}>{fmtManSigned(result.corp.takeHome - result.solo.takeHome)}</p>
                    </div>
                  </div>
                </div>
                {/* 実効税率 */}
                <div className="border border-gray-100 rounded-lg p-2">
                  <p className="text-xs font-medium text-gray-600 mb-1.5">実効税率</p>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-gray-50 rounded p-1.5">
                      <p className="text-xs font-semibold text-gray-800">{fmtPct(result.solo.effectiveRate)}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-1.5">
                      <p className="text-xs font-semibold text-gray-800">{fmtPct(result.corp.effectiveRate)}</p>
                    </div>
                    <div className="rounded p-1.5">
                      <p className={"text-xs font-bold " + (result.corp.effectiveRate - result.solo.effectiveRate < 0 ? "text-green-600" : "text-red-600")}>{fmtPctSigned(result.corp.effectiveRate - result.solo.effectiveRate)}</p>
                    </div>
                  </div>
                </div>
                {/* Mobile diff legend */}
                <p className="text-xs text-gray-400 pt-1">差額 = 法人化 − 個人事業主（マイナスは法人化が有利）</p>
              </div>
              <p className="text-xs text-gray-400 mt-3">※法人化の健康保険料は会社負担分（折半）を含みます。厚生年金は役員報酬に含まれる前提。</p>
            </div>

            {/* 法人化コスト回収期間 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">法人化コスト回収期間</h2>
              {result.savings > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">設立費用</p>
                    <p className="text-xl font-bold text-gray-800">約{result.incorporationCostAmount}万円</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">年間節税額</p>
                    <p className="text-xl font-bold text-green-600">約{Math.round(result.savings)}万円</p>
                  </div>
                  {(() => {
                    const months = (result.incorporationCostAmount / result.savings) * 12;
                    const isLong = months > 60;
                    const y = Math.floor(months / 12);
                    const m = Math.round(months % 12);
                    return (
                      <div className={`text-center rounded-lg p-4 border ${isLong ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                        <p className="text-xs text-gray-500 mb-1">回収期間</p>
                        <p className={`text-xl font-bold ${isLong ? "text-amber-700" : "text-emerald-700"}`}>
                          {y > 0 ? `約${y}年${m}ヶ月` : `約${m}ヶ月`}
                        </p>
                        {isLong && <p className="text-xs text-amber-600 mt-1">回収に時間がかかります</p>}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">現在の条件では法人化による節税メリットがないため、設立費用（約{result.incorporationCostAmount}万円）の回収見込みがありません。条件が変わった時の参考にご活用ください。</p>
                </div>
              )}
            </div>

            {/* 法人化が有利になる売上ライン */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-3">法人化が有利になる売上ライン</h2>
              {result.breakEvenRevenue ? (
                result.savings > 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-lg font-bold text-blue-800">
                      売上 <span className="text-2xl">{result.breakEvenRevenue.toLocaleString("ja-JP")}</span>万円以上で法人化が有利になります
                    </p>
                    <p className="text-sm text-blue-600 mt-1">※入力した経費率・家族構成での試算値です</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-base font-bold text-gray-700">
                      あなたの条件では売上 <span className="text-xl text-gray-800">{result.breakEvenRevenue.toLocaleString("ja-JP")}</span>万円を超えると法人化が有利になります
                    </p>
                    <p className="text-sm text-gray-500 mt-1">（現在の売上：{(parseFloat(form.revenue) || 0).toLocaleString("ja-JP")}万円）</p>
                    {(parseFloat(form.revenue) || 0) >= result.breakEvenRevenue && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded p-2 mt-2 border border-amber-200">
                        ※ 社会保険料の影響により、売上がこのラインを超えても個人事業主が有利な場合があります
                      </p>
                    )}
                  </div>
                )
              ) : (
                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  試算範囲（売上3,000万円以内）では法人化が有利になるラインが見つかりませんでした。経費・家族構成により異なります。
                </p>
              )}
            </div>

            {/* アドバイス */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">アドバイス</h2>
              <div className="space-y-3">
                {(() => {
                  const advices: { title: string; body: string }[] = [];
                  const bi = result.solo.businessIncome;
                  if (bi < 400) {
                    advices.push({
                      title: "現状では法人化のメリットは限定的です",
                      body: "事業所得が400万円未満の場合、法人維持コスト（税理士顧問料年30〜60万円、法人住民税均等割7万円など）が節税額を上回る可能性が高いです。まずは売上拡大を優先しましょう。",
                    });
                  } else if (bi < 700) {
                    advices.push({
                      title: "法人化を検討し始める売上水準です",
                      body: "事業所得が400〜700万円の範囲は法人化のメリットが出始める段階です。税理士に相談し、法人維持コストとのバランスを確認することをお勧めします。",
                    });
                  } else {
                    advices.push({
                      title: "法人化による節税効果が大きくなっています",
                      body: "事業所得700万円超では所得税の高税率（23〜33%）が適用され、法人税率（実効約30%）との差が拡大します。早めの法人化を税理士と相談しましょう。",
                    });
                  }
                  if (form.hasSpouse) {
                    advices.push({
                      title: "家族役員報酬による所得分散が有効です",
                      body: "法人化すると配偶者に役員報酬を支払うことで所得を分散でき、給与所得控除を2人分活用できます。扶養の範囲を超えて報酬を設定することで節税効果が高まります。",
                    });
                  }
                  advices.push({
                    title: "役員社宅・出張日当の活用を検討しましょう",
                    body: "法人化すると役員社宅（家賃の一部を法人経費に）や出張日当（非課税）など、個人では難しい経費計上が可能になります。これらは計算に含めていないため実際の節税額はさらに大きくなる可能性があります。",
                  });
                  return advices.map((adv, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-sm font-bold text-blue-800 mb-1">{adv.title}</p>
                      <p className="text-sm text-blue-700 leading-relaxed">{adv.body}</p>
                    </div>
                  ));
                })()}
                {(() => {
                  const corpHealthIns = result.corp.socialInsEmployee + result.corp.socialInsCompany;
                  const healthInsDiff = corpHealthIns - result.solo.nationalHealth;
                  const totalBurdenDiff = result.corp.totalBurden - result.solo.totalBurden;
                  if (result.savings <= 0 && healthInsDiff > 0 && healthInsDiff >= totalBurdenDiff) {
                    return (
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <p className="text-sm font-bold text-amber-800 mb-1">社会保険料が法人化コストの主な要因です</p>
                        <p className="text-sm text-amber-700 leading-relaxed mb-2">法人化の税負担（法人税等）は有利ですが、社会保険料の増加により総負担では個人事業主が有利です。役員報酬を下げることで社会保険料を抑えられる場合があります。</p>
                        <Link href="/business/director-salary-optimizer" className="text-sm font-medium text-emerald-700 underline">役員報酬 最適化シミュレーターで最適額を確認 →</Link>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed text-center">
              ※2026年度税制に基づく概算です。実際の税額は個別の状況・控除により異なります。正確な判断は税理士にご相談ください。
            </p>
          </div>
        )}

        {/* SEO Content */}
        <div className="space-y-10 pt-6 border-t border-gray-200">

          {/* 売上別早見表 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">売上別 法人化メリット早見表</h2>
            <p className="text-sm text-gray-600 mb-3">独身・経費率20%・東京都の場合の目安：</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {["事業所得", "個人事業主の税負担", "法人化の税負担", "節税額目安"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-medium text-gray-700 border border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["300万円", "約55万円", "約65万円", "-10万円（個人有利）"],
                    ["500万円", "約95万円", "約80万円", "約15万円"],
                    ["700万円", "約150万円", "約110万円", "約40万円"],
                    ["1,000万円", "約235万円", "約155万円", "約80万円"],
                    ["1,500万円", "約390万円", "約245万円", "約145万円"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, j) => (
                        <td key={j} className={
                          "px-3 py-2 border border-gray-200 " +
                          (j === 0 ? "font-medium text-gray-800" : "text-gray-700") +
                          (j === 3 && cell.startsWith("約") ? " font-bold text-green-700" : "") +
                          (j === 3 && cell.startsWith("-") ? " text-red-600" : "")
                        }>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 個人と法人の違い */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">個人事業主と法人化の違い</h2>
            <div className="text-gray-700 space-y-5 text-sm leading-relaxed">
              <p>個人事業主と法人（株式会社・合同会社）では課税される税金の種類と税率が大きく異なります。</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">個人事業主の税金</h3>
                  <ul className="space-y-1 text-xs">
                    <li>・所得税（5〜45%の累進課税）</li>
                    <li>・住民税（一律10%）</li>
                    <li>・個人事業税（3〜5%）</li>
                    <li>・国民健康保険料（所得に応じて変動）</li>
                    <li>・国民年金（固定額）</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">法人の税金</h3>
                  <ul className="space-y-1 text-xs">
                    <li>・法人税（15〜23.2%）</li>
                    <li>・地方法人税（法人税の10.3%）</li>
                    <li>・法人住民税（均等割+法人税割）</li>
                    <li>・法人事業税（3.5〜7%）</li>
                    <li>・特別法人事業税（法人事業税の37%）</li>
                    <li>・役員報酬にかかる所得税・住民税</li>
                    <li>・社会保険料（会社と個人で折半）</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">法人化のメリット</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><strong>所得分散効果：</strong>役員報酬に給与所得控除が適用され課税所得が下がる</li>
                  <li><strong>税率の低下：</strong>法人税率（実効約30%）は個人の高税率帯（40〜45%）より低い</li>
                  <li><strong>経費の拡大：</strong>役員社宅、出張日当、法人保険など個人では難しい経費が計上できる</li>
                  <li><strong>消費税の免税期間：</strong>新設法人は最大2年間消費税が免税</li>
                </ol>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">法人化のデメリット</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><strong>設立費用：</strong>株式会社約25万円、合同会社約10万円</li>
                  <li><strong>維持費：</strong>税理士顧問料（年30〜60万円）、法人住民税均等割（最低7万円/年）</li>
                  <li><strong>社会保険料の増加：</strong>国保から社会保険に切り替えで負担が増える場合も</li>
                  <li><strong>事務作業の増加：</strong>決算書作成・法人税申告が必要</li>
                </ol>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-emerald-800 mb-1">法人化が有利になる目安</h3>
                <p>一般的に事業所得（売上-経費）が<strong>600〜700万円</strong>を超えると法人化による節税メリットが法人維持コストを上回り始めます。</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "法人化（法人成り）はいくらから有利ですか？",
                  a: "一般的に事業所得（売上から経費を引いた利益）が600〜700万円を超えると法人化が有利になり始めます。ただし税理士顧問料（年30〜60万円）などの法人維持コストも考慮する必要があります。本ツールで実際の条件を入力して確認することをお勧めします。",
                },
                {
                  q: "個人事業主と法人ではどちらが社会保険料が安いですか？",
                  a: "低い所得では国民健康保険+国民年金の方が安い場合があります。高い役員報酬を設定すると社会保険料（厚生年金+健康保険）の方が高くなる傾向があります。ただし法人の場合は会社が保険料の半分を負担するため、実質的な個人負担は同程度になることが多いです。",
                },
                {
                  q: "合同会社と株式会社どちらで設立すべきですか？",
                  a: "税金面での違いはありません。主な違いは設立費用（合同会社約10万円、株式会社約25万円）と対外的な信用力です。スタートアップや個人事業の法人化では合同会社が増えています。銀行融資や取引先からの信用を重視する場合は株式会社が有利な場合があります。",
                },
                {
                  q: "法人化後に個人事業主に戻ることはできますか？",
                  a: "法人を解散することは可能ですが、解散・清算の手続きに費用と時間がかかります（通常数ヶ月〜1年以上）。法人化は中長期的な視点で決断することが重要です。",
                },
                {
                  q: "一人社長の場合も社会保険に加入しなければなりませんか？",
                  a: "はい、一人会社でも役員報酬を支払う場合は社会保険（健康保険・厚生年金）への加入が義務です。ただし役員報酬をゼロにすれば加入義務はありません（その場合、個人として国民健康保険・国民年金に加入）。",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-bold text-gray-800 mb-2">Q. {item.q}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">A. {item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related tools */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/business/director-salary-optimizer", label: "役員報酬 最適化シミュレーター", desc: "法人化後の最適な役員報酬額を計算" },
                { href: "/business/corporate-tax-calculator", label: "法人税 計算機", desc: "法人税・地方税の実効税率を計算" },
                { href: "/career/side-income-tax-calculator", label: "副業収入税金計算機", desc: "副業収入の追加税負担・手取りを計算" },
                { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から所得税・住民税・手取りを計算" },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href}
                  className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-4 hover:border-emerald-400 hover:shadow-sm transition-all">
                  <div>
                    <p className="text-sm font-bold text-emerald-700">{tool.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/houjinka-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】法人化シミュレーション｜個人事業主が会社設立すべき年収</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
        </div>
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit position="mid" format="horizontal" />
      </div>

  </>
  );
}
