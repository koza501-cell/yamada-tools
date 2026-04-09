"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type SideIncomeType =
  | "freelance"
  | "baito"
  | "net_sales"
  | "blog"
  | "real_estate"
  | "crypto"
  | "stock"
  | "other";

type AoiroOption = "0" | "10" | "55" | "65";

interface SideIncomeEntry {
  enabled: boolean;
  income: string;
  expenses: string;
  aoiro: AoiroOption;
}

interface FormState {
  salary: string;
  age: string;
  hasSpouse: boolean;
  spouseIncome: string;
  dependents: string;
  sideIncomes: Record<SideIncomeType, SideIncomeEntry>;
  residentialTaxMethod: "tokubetsu" | "futsu";
  hasWithholding: boolean;
  withholdingAmount: string;
}

interface MainJobTax {
  salaryIncome: number;
  socialIns: number;
  totalDed: number;
  taxableIncome: number;
  incomeTax: number;
  residentTax: number;
  totalTax: number;
}

interface SideResult {
  type: SideIncomeType;
  label: string;
  incomeAmount: number;
  expenseAmount: number;
  netIncome: number;
}

interface CombinedTax {
  incomeTax: number;
  residentTax: number;
  totalTax: number;
}

interface FilingVerdict {
  label: "必要" | "推奨" | "不要";
  color: "red" | "yellow" | "green";
  reasons: string[];
}

interface TaxAdvice {
  title: string;
  body: string;
}

interface CalcResult {
  mainJobTax: MainJobTax;
  combinedTax: CombinedTax;
  sideResults: SideResult[];
  additionalIncomeTax: number;
  additionalResidentTax: number;
  additionalTotalTax: number;
  totalSideIncome: number;
  totalSideExpenses: number;
  netTakeHome: number;
  effectiveTaxRate: number;
  filing: FilingVerdict;
  advices: TaxAdvice[];
}

interface SideConfig {
  type: SideIncomeType;
  label: string;
  incomeLabel: string;
  showExpenses: boolean;
  showAoiro: boolean;
  note?: string;
}

const SIDE_CONFIG: SideConfig[] = [
  {
    type: "freelance",
    label: "フリーランス・業務委託（雑所得または事業所得）",
    incomeLabel: "年間収入",
    showExpenses: true,
    showAoiro: true,
  },
  {
    type: "baito",
    label: "アルバイト・パート（給与所得）",
    incomeLabel: "給与収入",
    showExpenses: false,
    showAoiro: false,
    note: "給与所得控除が自動適用されます。本業給与と合算して計算します。",
  },
  {
    type: "net_sales",
    label: "ネット販売・メルカリ等（雑所得）",
    incomeLabel: "売上",
    showExpenses: true,
    showAoiro: false,
  },
  {
    type: "blog",
    label: "ブログ・YouTube・アフィリエイト（雑所得）",
    incomeLabel: "収入",
    showExpenses: true,
    showAoiro: false,
  },
  {
    type: "real_estate",
    label: "不動産賃貸（不動産所得）",
    incomeLabel: "賃料収入",
    showExpenses: true,
    showAoiro: false,
    note: "経費が収入を超える場合（赤字）、給与所得と損益通算できます。",
  },
  {
    type: "crypto",
    label: "仮想通貨（雑所得）",
    incomeLabel: "売却益・収入",
    showExpenses: true,
    showAoiro: false,
    note: "雑所得のため損益通算不可。税率は最大55%になります。",
  },
  {
    type: "stock",
    label: "株式・投資信託（申告分離課税）",
    incomeLabel: "",
    showExpenses: false,
    showAoiro: false,
    note: "申告分離課税（一律20.315%）のため本ツールの計算対象外です。特定口座（源泉徴収あり）なら確定申告不要です。",
  },
  {
    type: "other",
    label: "その他（雑所得）",
    incomeLabel: "収入",
    showExpenses: true,
    showAoiro: false,
  },
];

const SIDE_LABELS: Record<SideIncomeType, string> = {
  freelance: "フリーランス・業務委託",
  baito: "アルバイト・パート",
  net_sales: "ネット販売・メルカリ",
  blog: "ブログ・アフィリエイト",
  real_estate: "不動産賃貸",
  crypto: "仮想通貨",
  stock: "株式・投資信託",
  other: "その他雑所得",
};

function calcEmploymentDeduction(salary: number): number {
  if (salary <= 162.5) return 55;
  if (salary <= 180) return salary * 0.4 - 10;
  if (salary <= 360) return salary * 0.3 + 8;
  if (salary <= 660) return salary * 0.2 + 44;
  if (salary <= 850) return salary * 0.1 + 110;
  return 195;
}

function calcIncomeTaxBase(taxable: number): number {
  if (taxable <= 0) return 0;
  if (taxable <= 195) return taxable * 0.05;
  if (taxable <= 330) return taxable * 0.1 - 9.75;
  if (taxable <= 695) return taxable * 0.2 - 42.75;
  if (taxable <= 900) return taxable * 0.23 - 63.6;
  if (taxable <= 1800) return taxable * 0.33 - 153.6;
  if (taxable <= 4000) return taxable * 0.4 - 279.6;
  return taxable * 0.45 - 479.6;
}

function calcSpouseDeduction(spouseIncome: number): number {
  if (spouseIncome <= 103) return 38;
  if (spouseIncome <= 201) return 26;
  return 0;
}

function calcMainJobTax(
  salary: number,
  hasSpouse: boolean,
  spouseIncome: number,
  dependents: number
): MainJobTax {
  const salaryIncome = Math.max(0, salary - calcEmploymentDeduction(salary));
  const socialIns = salary * 0.1497;
  const basicDed = salaryIncome <= 2400 ? 48 : 0;
  const spouseDed = hasSpouse ? calcSpouseDeduction(spouseIncome) : 0;
  const dependentDed = 38 * dependents;
  const totalDed = basicDed + socialIns + spouseDed + dependentDed;
  const taxableIncome = Math.max(0, salaryIncome - totalDed);
  const incomeTax = Math.max(0, calcIncomeTaxBase(taxableIncome) * 1.021);
  const residentTotalDed = 43 + socialIns + spouseDed + dependentDed;
  const residentTaxable = Math.max(0, salaryIncome - residentTotalDed);
  const residentTax = Math.max(0, residentTaxable * 0.1 - 0.25);
  return {
    salaryIncome, socialIns, totalDed, taxableIncome, incomeTax, residentTax,
    totalTax: incomeTax + residentTax,
  };
}

function calcCombined(
  salary: number,
  baitoRaw: number,
  freelanceNet: number,
  otherMiscNet: number,
  realEstateNet: number,
  hasSpouse: boolean,
  spouseIncome: number,
  dependents: number,
  socialIns: number
): CombinedTax {
  const combinedSalary = salary + baitoRaw;
  const combinedSalaryIncome = Math.max(0, combinedSalary - calcEmploymentDeduction(combinedSalary));
  const totalAllIncome = combinedSalaryIncome + freelanceNet + otherMiscNet + realEstateNet;
  const basicDed = totalAllIncome <= 2400 ? 48 : 0;
  const spouseDed = hasSpouse ? calcSpouseDeduction(spouseIncome) : 0;
  const dependentDed = 38 * dependents;
  const totalDed = basicDed + socialIns + spouseDed + dependentDed;
  const taxableIncome = Math.max(0, totalAllIncome - totalDed);
  const incomeTax = Math.max(0, calcIncomeTaxBase(taxableIncome) * 1.021);
  const residentTotalDed = 43 + socialIns + spouseDed + dependentDed;
  const residentTaxable = Math.max(0, totalAllIncome - residentTotalDed);
  const residentTax = Math.max(0, residentTaxable * 0.1 - 0.25);
  return { incomeTax, residentTax, totalTax: incomeTax + residentTax };
}

function calcFilingVerdict(
  salary: number,
  sideResults: SideResult[],
  hasWithholding: boolean
): FilingVerdict {
  const reasons: string[] = [];
  if (salary > 2000) {
    reasons.push("給与収入が2,000万円を超えるため確定申告が必要です。");
  }
  const baitoNet = sideResults.find((r) => r.type === "baito")?.netIncome ?? 0;
  if (baitoNet > 20) {
    reasons.push("アルバイト・パートの給与収入が20万円を超えるため確定申告が必要です。");
  }
  const miscSum = sideResults
    .filter((r) => ["freelance", "net_sales", "blog", "real_estate", "crypto", "other"].includes(r.type))
    .reduce((s, r) => s + r.netIncome, 0);
  if (miscSum > 20) {
    reasons.push("副業所得（雑所得・不動産所得等）の合計が20万円を超えるため確定申告が必要です。");
  }
  if (reasons.length > 0) return { label: "必要", color: "red", reasons };
  if (hasWithholding) {
    return {
      label: "推奨", color: "yellow",
      reasons: ["源泉徴収されている副業収入があります。確定申告することで還付を受けられる可能性があります。"],
    };
  }
  return {
    label: "不要", color: "green",
    reasons: [
      "副業所得が20万円以下のため確定申告は不要です。",
      "ただし住民税の申告は市区町村の窓口で必要です。",
    ],
  };
}

function generateAdvices(sideResults: SideResult[], form: FormState): TaxAdvice[] {
  const advices: TaxAdvice[] = [];
  const types = sideResults.map((r) => r.type);
  if (types.includes("freelance")) {
    const entry = form.sideIncomes.freelance;
    if (entry.aoiro === "0") {
      advices.push({
        title: "青色申告特別控除（最大65万円）を活用しましょう",
        body: "フリーランス収入を事業所得として青色申告すると最大65万円の特別控除が受けられます（電子申告の場合）。帳簿の作成が必要ですが税負担を大きく減らせます。",
      });
    } else if (entry.aoiro === "10" || entry.aoiro === "55") {
      advices.push({
        title: "青色申告65万円控除への切り替えを検討しましょう",
        body: "複式簿記で帳簿を作成しe-Taxで電子申告すると控除額を65万円に引き上げられます。",
      });
    }
  }
  const re = sideResults.find((r) => r.type === "real_estate");
  if (re && re.netIncome < 0) {
    advices.push({
      title: "不動産所得の赤字を給与所得と損益通算できます",
      body: `不動産所得の赤字${fmtMan(Math.abs(re.netIncome))}は給与所得と損益通算済みです。減価償却費・修繕費・管理費などを漏れなく経費計上しましょう。`,
    });
  }
  if (types.includes("crypto")) {
    advices.push({
      title: "仮想通貨の損益は雑所得扱い・損益通算不可です",
      body: "仮想通貨の利益は雑所得として総合課税（最高税率55%）の対象です。株式・FXとの損益通算はできません。取引履歴を年間を通じて正確に記録しましょう。",
    });
  }
  if (types.includes("stock")) {
    advices.push({
      title: "株式・投資信託は特定口座（源泉徴収あり）が便利です",
      body: "特定口座（源泉徴収あり）を利用すると確定申告が不要になります。損失が出た場合は確定申告で損益通算・繰越控除（3年間）が可能です。",
    });
  }
  if (form.residentialTaxMethod === "tokubetsu") {
    advices.push({
      title: "普通徴収を選択すると副業が会社にバレにくくなります",
      body: "確定申告の際に住民税の徴収方法を「普通徴収（自分で納付）」にすると副業分の住民税が給与から天引きされなくなります。ただし確実ではありません。",
    });
  }
  const hasNoExpenses = sideResults
    .filter((r) => r.type !== "stock" && r.type !== "baito")
    .some((r) => r.expenseAmount === 0 && r.incomeAmount > 0);
  if (hasNoExpenses) {
    advices.push({
      title: "経費を漏れなく計上しましょう",
      body: "副業に関連する通信費・交通費・機材費・書籍代などは経費として計上できます。領収書・レシートを保管し所得を正確に計算しましょう。",
    });
  }
  return advices;
}

function fmtMan(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "万円";
}
function fmtManSigned(n: number): string {
  return (n >= 0 ? "+" : "") + Math.round(n).toLocaleString("ja-JP") + "万円";
}
function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

const initEntry: SideIncomeEntry = { enabled: false, income: "", expenses: "", aoiro: "0" };
const initialForm: FormState = {
  salary: "", age: "", hasSpouse: false, spouseIncome: "", dependents: "0",
  sideIncomes: {
    freelance: { ...initEntry }, baito: { ...initEntry }, net_sales: { ...initEntry },
    blog: { ...initEntry }, real_estate: { ...initEntry }, crypto: { ...initEntry },
    stock: { ...initEntry }, other: { ...initEntry },
  },
  residentialTaxMethod: "tokubetsu",
  hasWithholding: false, withholdingAmount: "",
};

export default function SideIncomeTaxCalculatorPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  function updateSide(type: SideIncomeType, field: keyof SideIncomeEntry, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      sideIncomes: { ...prev.sideIncomes, [type]: { ...prev.sideIncomes[type], [field]: value } },
    }));
  }

  function handleCalculate() {
    const salary = parseFloat(form.salary) || 0;
    const spouseIncome = form.hasSpouse ? parseFloat(form.spouseIncome) || 0 : 999;
    const dependents = Math.max(0, parseInt(form.dependents) || 0);
    const withholdingAmt = form.hasWithholding ? parseFloat(form.withholdingAmount) || 0 : 0;
    const mainJobTax = calcMainJobTax(salary, form.hasSpouse, spouseIncome, dependents);
    const sideResults: SideResult[] = SIDE_CONFIG.filter(
      (cfg) => form.sideIncomes[cfg.type].enabled
    ).map((cfg) => {
      const entry = form.sideIncomes[cfg.type];
      const incomeAmount = parseFloat(entry.income) || 0;
      const expenseAmount = parseFloat(entry.expenses) || 0;
      let netIncome = 0;
      if (cfg.type === "baito") {
        const baitoSalaryIncome = Math.max(0, incomeAmount - calcEmploymentDeduction(incomeAmount));
        netIncome = baitoSalaryIncome;
      } else if (cfg.type === "freelance") {
        const aoiro = parseFloat(entry.aoiro) || 0;
        netIncome = Math.max(0, incomeAmount - expenseAmount - aoiro);
      } else if (cfg.type === "real_estate") {
        netIncome = incomeAmount - expenseAmount;
      } else if (cfg.type === "stock") {
        netIncome = 0;
      } else {
        netIncome = Math.max(0, incomeAmount - expenseAmount);
      }
      return { type: cfg.type, label: SIDE_LABELS[cfg.type], incomeAmount, expenseAmount, netIncome };
    });
    const baitoRaw = form.sideIncomes.baito.enabled ? parseFloat(form.sideIncomes.baito.income) || 0 : 0;
    const freelanceNet = sideResults.find((r) => r.type === "freelance")?.netIncome ?? 0;
    const realEstateNet = sideResults.find((r) => r.type === "real_estate")?.netIncome ?? 0;
    const otherMiscNet = sideResults
      .filter((r) => ["net_sales", "blog", "crypto", "other"].includes(r.type))
      .reduce((s, r) => s + r.netIncome, 0);
    const combinedTax = calcCombined(salary, baitoRaw, freelanceNet, otherMiscNet, realEstateNet,
      form.hasSpouse, spouseIncome, dependents, mainJobTax.socialIns);
    const additionalIncomeTax = combinedTax.incomeTax - mainJobTax.incomeTax;
    const additionalResidentTax = combinedTax.residentTax - mainJobTax.residentTax;
    const additionalTotalTax = combinedTax.totalTax - mainJobTax.totalTax;
    const totalSideIncome = sideResults.filter((r) => r.type !== "stock").reduce((s, r) => s + r.incomeAmount, 0);
    const totalSideExpenses = sideResults.filter((r) => r.type !== "stock").reduce((s, r) => s + r.expenseAmount, 0);
    const adjustedAdditionalTax = Math.max(0, additionalTotalTax - withholdingAmt);
    const netTakeHome = totalSideIncome - totalSideExpenses - adjustedAdditionalTax;
    const netSideIncome = totalSideIncome - totalSideExpenses;
    const effectiveTaxRate = netSideIncome > 0 ? (adjustedAdditionalTax / netSideIncome) * 100 : 0;
    const filing = calcFilingVerdict(salary, sideResults, form.hasWithholding);
    const advices = generateAdvices(sideResults, form);
    setResult({
      mainJobTax, combinedTax, sideResults,
      additionalIncomeTax, additionalResidentTax, additionalTotalTax,
      totalSideIncome, totalSideExpenses, netTakeHome, effectiveTaxRate, filing, advices,
    });
    setMascotState("success");
  }

  function handleReset() { setForm(initialForm); setResult(null); }

  const anyEnabled = Object.values(form.sideIncomes).some((e) => e.enabled);


  const faqItems = [
    { question: "副業収入が20万円以下なら税金はかかりませんか？", answer: "副業所得が20万円以下の場合確定申告は不要ですが税金がゼロになるわけではなく住民税の申告は市区町村に必要です。源泉徴収されている場合は確定申告で還付を受けられる場合があります。" },
    { question: "副業がバレないようにするにはどうすればいいですか？", answer: "確定申告の際に住民税の徴収方法を普通徴収にすることで副業分の住民税が給与から天引きされなくなります。ただし完全に発覚を防げるわけではありません。就業規則で副業が禁止されている場合は会社への確認が必要です。" },
    { question: "フリーランス収入は雑所得と事業所得どちらで申告しますか？", answer: "継続的・安定的に副業収入があり帳簿を作成している場合は事業所得として申告できます。事業所得は青色申告特別控除（最大65万円）が使え赤字の場合は給与所得と損益通算できる点が有利です。" },
    { question: "メルカリやネット販売の利益にも税金はかかりますか？", answer: "営利目的の継続的な販売は雑所得として課税対象です。自分が使っていた生活用品を売った場合は非課税となります。年間の利益が20万円を超えると確定申告が必要です。" },
    { question: "副業で赤字が出た場合、本業の税金は減りますか？", answer: "不動産所得・事業所得の赤字は給与所得と損益通算できるため本業の税金が減る可能性があります。一方雑所得の赤字は損益通算できません。" }
  ];
  const useCases = [
    { icon: "💻", persona: "副業を始めた会社員", title: "確定申告が必要か知りたい", benefit: "年収・副業収入・経費から申告要否を自動判定" },
    { icon: "🤫", persona: "副業が会社にバレるか心配", title: "住民税普通徴収で発覚リスクを下げたい", benefit: "住民税の申告方法と注意点を確認" },
    { icon: "📝", persona: "フリーランス収入がある方", title: "青色申告vs白色申告の節税額を比較したい", benefit: "青色申告特別控除65万円の実際の節税効果を計算" }
  ];
  return (
    <>
      <IntroSection title="副業収入税金計算機" paragraphs={["副業収入に対する追加税負担（所得税・住民税）と確定申告の要否を自動判定します。本業の年収と合わせた実質手取りも計算。", "フリーランス・アフィリエイト・メルカリ・不動産収入など副業の種類別に対応。青色申告特別控除の節税効果も試算できます。", "登録不要・完全無料。副業を始める前に税金の影響を把握したい方に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-emerald-200 text-xs mb-2">転職・年収 &gt; 副業収入税金計算機</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">副業収入税金計算機</h1>
          <p className="text-emerald-100 text-sm md:text-base">
            フリーランス・アルバイト・ネット販売・不動産など全ての副業タイプに対応。追加税負担・実質手取り・確定申告要否を自動計算。2026年最新税制対応。
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Section 1 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">本業情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>本業の年収（万円）</label>
                <input type="number" className={inputClass} placeholder="例：500"
                  value={form.salary} onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))} min="0" />
              </div>
              <div>
                <label className={labelClass}>年齢（歳）</label>
                <input type="number" className={inputClass} placeholder="例：35"
                  value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} min="18" max="80" />
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
              {form.hasSpouse && (
                <div>
                  <label className={labelClass}>配偶者の年収（万円）</label>
                  <input type="number" className={inputClass} placeholder="例：103"
                    value={form.spouseIncome} onChange={(e) => setForm((p) => ({ ...p, spouseIncome: e.target.value }))} min="0" />
                  <p className="text-xs text-gray-500 mt-1">103万以下→控除38万、201万以下→26万</p>
                </div>
              )}
              <div>
                <label className={labelClass}>扶養家族の人数</label>
                <select className={inputClass} value={form.dependents}
                  onChange={(e) => setForm((p) => ({ ...p, dependents: e.target.value }))}>
                  {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}人</option>)}
                </select>
              </div>
            </div>
          </div>
          {/* Section 2 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">副業情報</h2>
            <p className="text-xs text-gray-500 mb-3">副業の種類を選択してください（複数選択可）</p>
            <div className="space-y-3">
              {SIDE_CONFIG.map((cfg) => {
                const entry = form.sideIncomes[cfg.type];
                return (
                  <div key={cfg.type} className="border border-gray-200 rounded-lg overflow-hidden">
                    <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-600 flex-shrink-0"
                        checked={entry.enabled} onChange={(e) => updateSide(cfg.type, "enabled", e.target.checked)} />
                      <span className="text-sm font-medium text-gray-800">{cfg.label}</span>
                    </label>
                    {entry.enabled && (
                      <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100 space-y-3">
                        {cfg.note && (
                          <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1.5 mt-2">{cfg.note}</p>
                        )}
                        {cfg.type !== "stock" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            <div>
                              <label className={labelClass}>{cfg.incomeLabel}（万円）</label>
                              <input type="number" className={inputClass} placeholder="例：50"
                                value={entry.income} onChange={(e) => updateSide(cfg.type, "income", e.target.value)} min="0" />
                            </div>
                            {cfg.showExpenses && (
                              <div>
                                <label className={labelClass}>必要経費（万円）</label>
                                <input type="number" className={inputClass} placeholder="例：10"
                                  value={entry.expenses} onChange={(e) => updateSide(cfg.type, "expenses", e.target.value)} min="0" />
                              </div>
                            )}
                            {cfg.showAoiro && (
                              <div>
                                <label className={labelClass}>青色申告特別控除</label>
                                <select className={inputClass} value={entry.aoiro}
                                  onChange={(e) => updateSide(cfg.type, "aoiro", e.target.value)}>
                                  <option value="0">対象外（0万円）</option>
                                  <option value="10">10万円</option>
                                  <option value="55">55万円</option>
                                  <option value="65">65万円（電子申告）</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Section 3 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">確定申告設定</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>住民税の徴収方法</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-start gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="residentialTaxMethod" className="mt-0.5 accent-emerald-600"
                      checked={form.residentialTaxMethod === "tokubetsu"}
                      onChange={() => setForm((p) => ({ ...p, residentialTaxMethod: "tokubetsu" }))} />
                    <div>
                      <p className="text-sm font-medium">特別徴収（給与天引き）</p>
                      <p className="text-xs text-gray-500">会社に副業がバレる可能性あり</p>
                    </div>
                  </label>
                  <label className="flex-1 flex items-start gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="residentialTaxMethod" className="mt-0.5 accent-emerald-600"
                      checked={form.residentialTaxMethod === "futsu"}
                      onChange={() => setForm((p) => ({ ...p, residentialTaxMethod: "futsu" }))} />
                    <div>
                      <p className="text-sm font-medium">普通徴収（自分で納付）</p>
                      <p className="text-xs text-gray-500">会社にバレにくい（確実ではない）</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 accent-emerald-600"
                    checked={form.hasWithholding} onChange={(e) => setForm((p) => ({ ...p, hasWithholding: e.target.checked }))} />
                  <span className="text-sm font-medium text-gray-700">源泉徴収されている副業収入がある</span>
                </label>
                {form.hasWithholding && (
                  <div className="mt-2">
                    <label className={labelClass}>源泉徴収額（万円）</label>
                    <input type="number" className={inputClass} placeholder="例：5"
                      value={form.withholdingAmount} onChange={(e) => setForm((p) => ({ ...p, withholdingAmount: e.target.value }))} min="0" />
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
            <button onClick={handleCalculate} disabled={!form.salary || !anyEnabled}
              className="flex-1 py-3 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              計算する
            </button>
          </div>
          {!form.salary && <p className="text-xs text-gray-400 text-center">本業の年収を入力してください</p>}
          {form.salary && !anyEnabled && <p className="text-xs text-gray-400 text-center">副業の種類を1つ以上選択してください</p>}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* 副業の所得内訳 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">副業の所得内訳</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 text-gray-600 font-medium">副業種別</th>
                      <th className="text-right py-2 px-2 text-gray-600 font-medium">収入</th>
                      <th className="text-right py-2 px-2 text-gray-600 font-medium">経費等</th>
                      <th className="text-right py-2 pl-2 text-gray-600 font-medium">所得</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sideResults.map((r) => (
                      <tr key={r.type} className="border-b last:border-0">
                        <td className="py-2 pr-4 text-gray-700">{r.label}</td>
                        <td className="text-right py-2 px-2">{r.type === "stock" ? "—" : fmtMan(r.incomeAmount)}</td>
                        <td className="text-right py-2 px-2 text-gray-500">
                          {r.type === "stock" ? "—" : r.type === "baito" ? "(給与所得控除)" : fmtMan(r.expenseAmount)}
                        </td>
                        <td className="text-right py-2 pl-2 font-medium">
                          {r.type === "stock"
                            ? <span className="text-gray-400 text-xs">計算対象外</span>
                            : <span className={r.netIncome < 0 ? "text-green-600" : ""}>{fmtMan(r.netIncome)}</span>}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-2 pr-4">合計副業所得</td>
                      <td className="text-right py-2 px-2">{fmtMan(result.totalSideIncome)}</td>
                      <td className="text-right py-2 px-2 text-gray-500">{fmtMan(result.totalSideExpenses)}</td>
                      <td className="text-right py-2 pl-2">{fmtMan(result.totalSideIncome - result.totalSideExpenses)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* 税金比較表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">税金の比較表</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 pr-4 text-gray-600 font-medium"></th>
                    <th className="text-right py-2 px-2 text-gray-600 font-medium">副業なし</th>
                    <th className="text-right py-2 px-2 text-gray-600 font-medium">副業あり</th>
                    <th className="text-right py-2 pl-2 text-gray-600 font-medium">増加額</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { label: "所得税", main: result.mainJobTax.incomeTax, combined: result.combinedTax.incomeTax, diff: result.additionalIncomeTax },
                      { label: "住民税", main: result.mainJobTax.residentTax, combined: result.combinedTax.residentTax, diff: result.additionalResidentTax },
                      { label: "合計税負担", main: result.mainJobTax.totalTax, combined: result.combinedTax.totalTax, diff: result.additionalTotalTax },
                    ].map((row) => (
                      <tr key={row.label} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-medium text-gray-700">{row.label}</td>
                        <td className="text-right py-2.5 px-2">{fmtMan(row.main)}</td>
                        <td className="text-right py-2.5 px-2">{fmtMan(row.combined)}</td>
                        <td className={"text-right py-2.5 pl-2 font-bold " + (row.diff > 0 ? "text-red-600" : "text-green-600")}>
                          {fmtManSigned(row.diff)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* 収支サマリー */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">副業の収支サマリー</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { label: "副業収入合計", value: fmtMan(result.totalSideIncome), color: "text-gray-900", large: false },
                  { label: "副業経費合計", value: fmtMan(result.totalSideExpenses), color: "text-gray-600", large: false },
                  { label: "追加税負担", value: fmtMan(result.additionalTotalTax), color: "text-red-600", large: false },
                  { label: "副業の実質手取り", value: fmtMan(result.netTakeHome), color: result.netTakeHome >= 0 ? "text-emerald-600" : "text-red-600", large: true },
                  { label: "副業の実効税率", value: (result.totalSideIncome - result.totalSideExpenses) > 0 ? fmtPct(result.effectiveTaxRate) : "—", color: "text-orange-600", large: false },
                ].map((card) => (
                  <div key={card.label}
                    className={"bg-gray-50 rounded-lg p-3 text-center " + (card.large ? "col-span-2 lg:col-span-1 bg-emerald-50 border border-emerald-200" : "")}>
                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                    <p className={"font-bold " + (card.large ? "text-2xl" : "text-lg") + " " + card.color}>{card.value}</p>
                  </div>
                ))}
              </div>
              {result.netTakeHome < 0 && (
                <p className="text-xs text-red-600 mt-3 bg-red-50 rounded p-2">
                  副業コストと税負担が収入を上回っています。経費の見直しや節税対策をご検討ください。
                </p>
              )}
            </div>
            {/* 確定申告判定 */}
            <div className={
              result.filing.color === "red" ? "rounded-xl shadow-sm border p-6 bg-red-50 border-red-200"
              : result.filing.color === "yellow" ? "rounded-xl shadow-sm border p-6 bg-yellow-50 border-yellow-200"
              : "rounded-xl shadow-sm border p-6 bg-green-50 border-green-200"
            }>
              <h2 className="text-base font-bold text-gray-800 mb-3">確定申告の要否</h2>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {result.filing.color === "red" ? "🔴" : result.filing.color === "yellow" ? "⚠️" : "✅"}
                </span>
                <p className={
                  result.filing.color === "red" ? "text-xl font-bold text-red-700"
                  : result.filing.color === "yellow" ? "text-xl font-bold text-yellow-700"
                  : "text-xl font-bold text-green-700"
                }>
                  確定申告 {result.filing.label}
                </p>
              </div>
              <ul className="space-y-1">
                {result.filing.reasons.map((r, i) => <li key={i} className="text-sm text-gray-700">{r}</li>)}
              </ul>
            </div>
            {/* 節税アドバイス */}
            {result.advices.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4">節税アドバイス</h2>
                <div className="space-y-3">
                  {result.advices.map((adv, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-sm font-bold text-blue-800 mb-1">{adv.title}</p>
                      <p className="text-sm text-blue-700 leading-relaxed">{adv.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 leading-relaxed text-center">
              ※2026年度税制に基づく概算です。実際の税額は控除・状況により異なります。正確な申告は税理士にご相談ください。
            </p>
          </div>
        )}

        {/* SEO Content */}
        <div className="space-y-10 pt-6 border-t border-gray-200">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">副業収入別の税金早見表</h2>
            <p className="text-sm text-gray-600 mb-3">本業年収500万円・独身の場合の副業税金目安：</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-3 py-2 font-medium text-gray-700 border border-gray-200">副業所得</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700 border border-gray-200">追加所得税</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700 border border-gray-200">追加住民税</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700 border border-gray-200">合計追加税</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700 border border-gray-200">実質手取り</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["20万円", "約2万円", "約2万円", "約4万円", "約16万円"],
                    ["50万円", "約5万円", "約5万円", "約10万円", "約40万円"],
                    ["100万円", "約20万円", "約10万円", "約30万円", "約70万円"],
                    ["200万円", "約50万円", "約20万円", "約70万円", "約130万円"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, j) => (
                        <td key={j} className={
                          "px-3 py-2 border border-gray-200 " +
                          (j === 0 ? "font-medium text-gray-800" : "text-right text-gray-700") +
                          (j === 4 ? " font-bold text-emerald-700" : "")
                        }>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">副業の税金の基礎知識</h2>
            <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
              <p>副業収入は本業の給与所得と合算して税金が計算されます（総合課税）。所得税は累進課税のため、本業で既に高い税率が適用されている場合、副業収入にも同じ高い税率が適用されます。</p>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">確定申告が必要なケース</h3>
                <p>給与所得者で副業による所得（収入から経費を引いた額）が年間20万円を超える場合は確定申告が義務です。20万円以下でも住民税の申告は市区町村に必要です。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">副業の所得区分</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>雑所得：</strong>継続的でない副業、ネット販売、アフィリエイトなど</li>
                  <li><strong>事業所得：</strong>継続的・安定的な副業（帳簿が必要）</li>
                  <li><strong>給与所得：</strong>アルバイト・パートなど雇用関係がある副業</li>
                  <li><strong>不動産所得：</strong>賃貸収入など</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">青色申告のメリット</h3>
                <p>事業所得または不動産所得がある場合、青色申告を選択すると最大65万円の青色申告特別控除が受けられます（電子申告の場合）。また赤字を翌年以降3年間繰り越すことができます。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">住民税と会社への副業バレ対策</h3>
                <p>副業の住民税を「普通徴収」にすることで、副業分の住民税が給与から天引きされるのを防げます。確定申告の際に選択できます。</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "副業収入が20万円以下なら税金はかかりませんか？",
                  a: "副業所得（収入から経費を引いた額）が20万円以下の場合、確定申告は不要です。ただし税金がゼロになるわけではなく、住民税の申告は市区町村に必要です。また源泉徴収されている場合は確定申告で還付を受けられる場合があります。",
                },
                {
                  q: "副業がバレないようにするにはどうすればいいですか？",
                  a: "確定申告の際に住民税の徴収方法を「普通徴収（自分で納付）」にすることで、副業分の住民税が給与から天引きされなくなります。ただし会社が独自に住民税を確認する場合や他の理由で発覚する可能性は排除できません。就業規則で副業が禁止されている場合は確認が必要です。",
                },
                {
                  q: "フリーランス収入は雑所得と事業所得どちらで申告しますか？",
                  a: "継続的・安定的に副業収入があり帳簿を作成している場合は事業所得として申告できます。事業所得は青色申告特別控除（最大65万円）が使え赤字の場合は給与所得と損益通算できる点が有利です。国税庁は収入300万円以下は原則雑所得としていますが実態が事業であれば事業所得も認められます。",
                },
                {
                  q: "メルカリやネット販売の利益にも税金はかかりますか？",
                  a: "はい、営利目的の継続的な販売は雑所得として課税対象です。ただし自分が使っていた生活用品を売った場合は非課税となります。年間の利益（売上から仕入れ・送料等の経費を引いた額）が20万円を超えると確定申告が必要です。",
                },
                {
                  q: "副業で赤字が出た場合、本業の税金は減りますか？",
                  a: "副業の種類によります。不動産所得・事業所得の赤字は給与所得と損益通算できるため本業の税金が減る可能性があります。一方雑所得の赤字は損益通算できません。フリーランス副業は事業所得として申告できれば損益通算が可能です。",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-bold text-gray-800 mb-2">Q. {item.q}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">A. {item.a}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から所得税・住民税・手取りを計算" },
                { href: "/career/retirement-bonus-calculator", label: "退職金計算機", desc: "退職金の手取り・税額を計算" },
                { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "ふるさと納税の限度額を計算" },
                { href: "/career/social-insurance-calculator", label: "社会保険料計算機", desc: "年収から社会保険料を計算" },
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
        </div>
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
