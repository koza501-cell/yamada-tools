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

interface FormState {
  // Section 1: 現在の職場
  currentAnnual: string;
  currentMonthly: string;
  currentBonus: string;
  currentOvertime: string;
  currentYears: string;
  // Section 2: 転職後の条件
  newAnnual: string;
  newMonthly: string;
  newBonus: string;
  newOvertime: string;
  hasProbation: boolean;
  probationMonths: string;
  probationMonthly: string;
  // Section 3: 個人情報
  age: string;
  hasSpouse: boolean;
  dependents: string;
  prefecture: string;
  insuranceType: string;
}

interface JobCalc {
  annualIncome: number;
  monthlyIncome: number;
  healthInsurance: number;
  pension: number;
  employment: number;
  nursing: number;
  totalSocialInsurance: number;
  incomeTax: number;
  residentTax: number;
  monthlyTakeHome: number;
}

interface CalcResult {
  current: JobCalc;
  newJob: JobCalc;
  probation?: {
    monthlyTakeHome: number;
    totalLoss: number;
    months: number;
  };
  monthlyDiff: number;
  annualDiff: number;
  fiveYearDiff: number;
  breakEvenMonths?: number;
}

// ============================================================
// Prefectures
// ============================================================

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

// ============================================================
// Calculation helpers
// ============================================================

function getHealthInsuranceRate(prefecture: string): number {
  const rates: Record<string, number> = {
    "東京都": 9.98,
    "神奈川県": 10.02,
    "大阪府": 10.29,
    "埼玉県": 9.78,
    "千葉県": 9.77,
    "愛知県": 9.84,
    "北海道": 10.21,
    "福岡県": 10.20,
    "兵庫県": 10.13,
    "京都府": 9.90,
  };
  return (rates[prefecture] ?? 10.00) / 100;
}

function calcEmploymentDeduction(annual: number): number {
  // annual in 万円
  const a = annual * 10000;
  if (a <= 1625000) return 550000;
  if (a <= 1800000) return a * 0.4 - 100000;
  if (a <= 3600000) return a * 0.3 + 80000;
  if (a <= 6600000) return a * 0.2 + 440000;
  if (a <= 8500000) return a * 0.1 + 1100000;
  return 1950000;
}

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  if (taxableIncome <= 1950000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3300000) {
    tax = taxableIncome * 0.10 - 97500;
  } else if (taxableIncome <= 6950000) {
    tax = taxableIncome * 0.20 - 427500;
  } else if (taxableIncome <= 9000000) {
    tax = taxableIncome * 0.23 - 636000;
  } else if (taxableIncome <= 18000000) {
    tax = taxableIncome * 0.33 - 1536000;
  } else {
    tax = taxableIncome * 0.40 - 2796000;
  }
  return Math.max(0, tax * 1.021);
}

function calcJob(
  annualMan: number,
  monthlyMan: number,
  bonusMan: number,
  overtimeHours: number,
  age: number,
  prefecture: string,
  hasSpouse: boolean,
  dependents: number,
): JobCalc {
  const annualIncome = annualMan * 10000;
  const baseMonthly = monthlyMan * 10000;

  const hourlyWage = baseMonthly / 160;
  const overtimePay = overtimeHours * hourlyWage * 1.25;
  const monthlyIncome = baseMonthly + (bonusMan * 10000) / 12 + overtimePay;

  const hyojun = baseMonthly;
  const healthRate = getHealthInsuranceRate(prefecture);
  const healthInsurance = Math.round(hyojun * healthRate * 0.5);
  const pension = Math.round(hyojun * 0.0915);
  const employment = Math.round(monthlyIncome * 0.006);
  const nursing = age >= 40 ? Math.round(hyojun * 0.008) : 0;
  const totalSocialInsurance = healthInsurance + pension + employment + nursing;

  const empDeduction = calcEmploymentDeduction(annualMan);
  const salaryIncome = Math.max(0, annualIncome - empDeduction);
  const annualSocialInsurance = totalSocialInsurance * 12;
  const spouseDeduction = hasSpouse ? 380000 : 0;
  const dependentDeduction = dependents * 380000;
  const taxableIncome = Math.max(0,
    salaryIncome - 480000 - annualSocialInsurance - spouseDeduction - dependentDeduction
  );
  const annualIncomeTax = calcIncomeTax(taxableIncome);
  const incomeTax = Math.round(annualIncomeTax / 12);

  const spouseDeductionResident = hasSpouse ? 330000 : 0;
  const dependentDeductionResident = dependents * 330000;
  const taxableIncomeResident = Math.max(0,
    salaryIncome - 430000 - annualSocialInsurance - spouseDeductionResident - dependentDeductionResident
  );
  const annualResidentTax = taxableIncomeResident * 0.10;
  const residentTax = Math.round(annualResidentTax / 12);

  const monthlyTakeHome = Math.round(monthlyIncome - totalSocialInsurance - incomeTax - residentTax);

  return {
    annualIncome,
    monthlyIncome,
    healthInsurance,
    pension,
    employment,
    nursing,
    totalSocialInsurance,
    incomeTax,
    residentTax,
    monthlyTakeHome,
  };
}

function calculate(form: FormState): CalcResult {
  const age = parseInt(form.age) || 30;
  const dependents = parseInt(form.dependents) || 0;

  const current = calcJob(
    parseFloat(form.currentAnnual) || 0,
    parseFloat(form.currentMonthly) || 0,
    parseFloat(form.currentBonus) || 0,
    parseFloat(form.currentOvertime) || 0,
    age, form.prefecture, form.hasSpouse, dependents,
  );

  const newJob = calcJob(
    parseFloat(form.newAnnual) || 0,
    parseFloat(form.newMonthly) || 0,
    parseFloat(form.newBonus) || 0,
    parseFloat(form.newOvertime) || 0,
    age, form.prefecture, form.hasSpouse, dependents,
  );

  const monthlyDiff = newJob.monthlyTakeHome - current.monthlyTakeHome;
  const annualDiff = monthlyDiff * 12;
  const fiveYearDiff = annualDiff * 5;

  let probation: CalcResult["probation"] = undefined;
  let breakEvenMonths: number | undefined = undefined;

  if (form.hasProbation) {
    const probMonths = parseInt(form.probationMonths) || 3;
    const probMonthlyMan = parseFloat(form.probationMonthly) || 0;
    const probAnnualEst = probMonthlyMan * 12;
    const probCalc = calcJob(
      probAnnualEst, probMonthlyMan, 0,
      parseFloat(form.newOvertime) || 0,
      age, form.prefecture, form.hasSpouse, dependents,
    );
    const probLossPerMonth = newJob.monthlyTakeHome - probCalc.monthlyTakeHome;
    const totalLoss = probLossPerMonth * probMonths;
    probation = {
      monthlyTakeHome: probCalc.monthlyTakeHome,
      totalLoss: Math.max(0, totalLoss),
      months: probMonths,
    };
    if (monthlyDiff > 0 && totalLoss > 0) {
      breakEvenMonths = Math.ceil(totalLoss / monthlyDiff);
    }
  }

  return { current, newJob, probation, monthlyDiff, annualDiff, fiveYearDiff, breakEvenMonths };
}

// ============================================================
// Schema
// ============================================================

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "転職年収シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "転職前後の年収・手取り・社会保険料・税金を比較計算。試用期間の収入損失や損益分岐点も自動算出。2026年税制対応。",
      "url": "https://yamada-tools.jp/career/job-change-simulator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "転職年収シミュレーター", "item": "https://yamada-tools.jp/career/job-change-simulator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "転職で年収が100万円上がったら手取りはいくら増えますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "年収帯によって異なりますが、年収増加額の65〜78%程度が手取り増加の目安です。年収500万円から600万円への転職の場合、手取り増加は約70〜75万円程度になります。" }
        },
        {
          "@type": "Question",
          "name": "転職後に住民税が高く感じるのはなぜですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "住民税は前年の収入に基づいて計算され翌年6月から課税されます。年収が下がった場合も前職の高い年収ベースで翌年6月まで住民税が続くため、手取りが少なく感じます。" }
        },
        {
          "@type": "Question",
          "name": "試用期間中の社会保険料はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "試用期間中も正社員と同様に社会保険（健康保険・厚生年金・雇用保険）に加入するのが一般的です。給与が低い場合は社会保険料も低くなります。" }
        },
        {
          "@type": "Question",
          "name": "転職のベストタイミングはいつですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に12月末退職・1月入社が手続き面でシンプルです。年末調整が前職で完了し住民税の切り替えも比較的スムーズです。ただし転職先の採用スケジュールを優先することが重要です。" }
        },
        {
          "@type": "Question",
          "name": "年収が下がる転職でも手取りが変わらないことはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "あります。残業が大幅に減る場合、残業代込みの年収は下がっても基本給ベースの手取りは変わらないケースがあります。残業時間も含めた計算をお試しください。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "転職前後の手取り比較計算方法",
      "description": "現在と転職後の年収・条件から手取り差額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "現在の職場情報を入力", "text": "現在の年収・月給・ボーナス・残業時間を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "転職後の条件を入力", "text": "転職後の年収・月給・試用期間の有無を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "個人情報を入力", "text": "年齢・家族構成・都道府県を入力します。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「計算する」を押すと転職前後の手取り比較表と差額が表示されます。" }
      ]
    }
  ]
};

// ============================================================
// Formatting helpers
// ============================================================

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function fmtYen(n: number): string {
  return Math.round(n).toLocaleString() + "円";
}

function fmtMan(n: number): string {
  const man = Math.round(n / 10000);
  return man.toLocaleString() + "万円";
}

function diffColor(n: number): string {
  if (n > 0) return "text-green-600";
  if (n < 0) return "text-danger";
  return "text-gray-600";
}

function fmtDiff(n: number, unit = "円"): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${Math.round(n).toLocaleString()}${unit}`;
}

// ============================================================
// Default form
// ============================================================

const DEFAULT_FORM: FormState = {
  currentAnnual: "",
  currentMonthly: "",
  currentBonus: "0",
  currentOvertime: "0",
  currentYears: "",
  newAnnual: "",
  newMonthly: "",
  newBonus: "0",
  newOvertime: "0",
  hasProbation: false,
  probationMonths: "3",
  probationMonthly: "",
  age: "",
  hasSpouse: false,
  dependents: "0",
  prefecture: "東京都",
  insuranceType: "協会けんぽ",
};

// ============================================================
// Component
// ============================================================

export default function JobChangeSimulatorClient() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    if (!form.currentAnnual || parseFloat(form.currentAnnual) <= 0) {
      setError("現在の年収を入力してください");
    setMascotState("error");
      return;
    }
    if (!form.currentMonthly || parseFloat(form.currentMonthly) <= 0) {
      setError("現在の月給を入力してください");
    setMascotState("error");
      return;
    }
    if (!form.newAnnual || parseFloat(form.newAnnual) <= 0) {
      setError("転職後の年収を入力してください");
    setMascotState("error");
      return;
    }
    if (!form.newMonthly || parseFloat(form.newMonthly) <= 0) {
      setError("転職後の月給を入力してください");
    setMascotState("error");
      return;
    }
    if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 75) {
      setError("年齢を正しく入力してください（18〜75歳）");
    setMascotState("error");
      return;
    }
    if (form.hasProbation && (!form.probationMonthly || parseFloat(form.probationMonthly) <= 0)) {
      setError("試用期間中の給与を入力してください");
    setMascotState("error");
      return;
    }
    setResult(calculate(form));
    setError("");
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const unitClass = "text-sm text-gray-500 whitespace-nowrap";

  const faqs = [
    {
      q: "転職で年収が100万円上がったら手取りはいくら増えますか？",
      a: "年収帯によって異なりますが、一般的に年収増加額の65〜78%程度が手取り増加の目安です。例えば年収500万円から600万円への転職（+100万円）の場合、手取り増加は約70〜75万円程度になります。所得税の累進課税と社会保険料の増加が差額を吸収します。",
    },
    {
      q: "転職後に住民税が高く感じるのはなぜですか？",
      a: "住民税は前年の収入に基づいて計算され、翌年6月から1年間課税されます。転職後に年収が増えた場合、転職した翌年6月から住民税が増加します。逆に年収が下がった場合も、前職の高い年収ベースで翌年6月まで住民税が続くため、手取りが少なく感じます。",
    },
    {
      q: "試用期間中の社会保険料はどうなりますか？",
      a: "試用期間中も正社員と同様に社会保険（健康保険・厚生年金・雇用保険）に加入するのが一般的です。給与が低い場合は社会保険料も低くなりますが、加入自体は変わりません。",
    },
    {
      q: "転職のベストタイミングはいつですか？",
      a: "一般的に12月末退職・1月入社が手続き面でシンプルです。年末調整が前職で完了し、住民税の切り替えも比較的スムーズです。ただし転職先の採用スケジュールを優先することが重要で、最適なタイミングは個人の状況によります。",
    },
    {
      q: "年収が下がる転職でも手取りが変わらないことはありますか？",
      a: "あります。例えば残業が大幅に減る場合、残業代込みの年収は下がっても基本給ベースの手取りは変わらないケースがあります。また各種手当の充実や福利厚生の改善により、実質的な生活水準が維持される場合もあります。本ツールで残業時間も含めた計算をお試しください。",
    },
  ];


  const faqItems = [
    { question: "年収が上がっても手取りが増えないことはありますか？", answer: "はい、いわゆる「年収の壁」を超えると社会保険料や税金が急増し、手取りが逆転することがあります。特に103万・106万・130万円の壁は注意が必要です。本ツールで転職後の正確な手取りを確認することをお勧めします。" },
    { question: "転職で年収が下がる場合のデメリットは？", answer: "年収が下がると社会保険料（翌年9月から改定）・住民税（翌年6月から改定）・雇用保険給付額・将来の厚生年金額が減少します。また退職金の基礎となる給与が下がります。本ツールでは短期的な手取り差だけでなく、回収期間まで計算できます。" },
    { question: "試用期間中の給与減額は考慮されますか？", answer: "はい、試用期間の月数と給与額を入力すると、試用期間中の収入損失と損益分岐点（何ヶ月後に転職が割に合うか）がわかります。" },
    { question: "転職後の住民税はいつから変わりますか？", answer: "住民税は前年の所得に基づいて計算されるため、転職後すぐには変わりません。転職した年の翌年6月から新しい給与に基づいた住民税が適用されます。転職直後は前職の高い年収に基づく住民税が続くため注意が必要です。" },
    { question: "年収以外に何を比較すべきですか？", answer: "賞与の有無・退職金制度・社宅や通勤手当などの福利厚生・残業時間・有給消化率なども重要な比較ポイントです。見えない収入（フリンジベネフィット）を含めた実質的な待遇を比較することをお勧めします。" }
  ];
  const useCases = [
    { icon: "💼", persona: "転職活動中の方", title: "内定年収の手取りを正確に知りたい", benefit: "税・社会保険料込みの手取り差を一発計算" },
    { icon: "📉", persona: "年収が下がる転職を検討中", title: "ダウン転職が長期的に割に合うか不安", benefit: "損益分岐点と回収月数を自動算出" },
    { icon: "🏢", persona: "年収が上がる転職を検討中", title: "手取りが本当に増えるか確認したい", benefit: "年収の壁・住民税タイムラグを含めて比較" }
  ];
  return (
    <>
      <IntroSection title="転職年収シミュレーター" paragraphs={["転職前後の手取り額・社会保険料・税金の変化を正確に比較できます。年収が上がっても手取りが減る「年収の壁」の影響や試用期間の収入損失も自動計算。", "損益分岐点（転職が何ヶ月後に割に合うか）まで算出し、転職の時期判断をサポートします。", "登録不要・完全無料。転職を検討中の方が「本当の手取り差」を把握するのに最適なツールです。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium bg-gray-50 text-kon px-2 py-0.5 rounded">2026年最新</span>
            <span className="text-xs text-gray-500">社会保険・税制対応</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            転職年収シミュレーター
          </h1>
          <p className="text-gray-600 text-sm">
            転職前後の手取り・社会保険料・税金を正確に比較。試用期間の収入損失と損益分岐点まで確認できます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ========== INPUT CARD ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

            {/* Section 1: 現在の職場 */}
            <div>
              <h2 className="text-base font-semibold text-kon mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                現在の職場（転職前）
              </h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>現在の年収 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.currentAnnual} onChange={(e) => handleChange("currentAnnual", e.target.value)} placeholder="例: 500" className={inputClass} />
                    <span className={unitClass}>万円</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>現在の月給（基本給） <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.currentMonthly} onChange={(e) => handleChange("currentMonthly", e.target.value)} placeholder="例: 30" className={inputClass} />
                    <span className={unitClass}>万円</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>年間ボーナス</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={form.currentBonus} onChange={(e) => handleChange("currentBonus", e.target.value)} placeholder="0" className={inputClass} />
                      <span className={unitClass}>万円</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>月の残業時間</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={form.currentOvertime} onChange={(e) => handleChange("currentOvertime", e.target.value)} placeholder="0" className={inputClass} />
                      <span className={unitClass}>時間</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>勤続年数</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.currentYears} onChange={(e) => handleChange("currentYears", e.target.value)} placeholder="例: 3" className={inputClass} />
                    <span className={unitClass}>年</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 転職後の条件 */}
            <div>
              <h2 className="text-base font-semibold text-kon mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                転職後の条件
              </h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>転職後の年収 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.newAnnual} onChange={(e) => handleChange("newAnnual", e.target.value)} placeholder="例: 600" className={inputClass} />
                    <span className={unitClass}>万円</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>転職後の月給（基本給） <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.newMonthly} onChange={(e) => handleChange("newMonthly", e.target.value)} placeholder="例: 36" className={inputClass} />
                    <span className={unitClass}>万円</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>年間ボーナス</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={form.newBonus} onChange={(e) => handleChange("newBonus", e.target.value)} placeholder="0" className={inputClass} />
                      <span className={unitClass}>万円</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>想定残業時間</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={form.newOvertime} onChange={(e) => handleChange("newOvertime", e.target.value)} placeholder="0" className={inputClass} />
                      <span className={unitClass}>時間</span>
                    </div>
                  </div>
                </div>

                {/* 試用期間 */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-sm font-medium text-gray-700">試用期間あり？</label>
                    <button type="button"
                      onClick={() => handleChange("hasProbation", !form.hasProbation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.hasProbation ? "bg-kon" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.hasProbation ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className="text-sm text-gray-500">{form.hasProbation ? "あり" : "なし"}</span>
                  </div>
                  {form.hasProbation && (
                    <div className="pl-3 border-l-2 border-gray-200 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>試用期間</label>
                          <select value={form.probationMonths} onChange={(e) => handleChange("probationMonths", e.target.value)} className={inputClass}>
                            {[1,2,3,4,5,6].map(m => (
                              <option key={m} value={m}>{m}ヶ月</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>試用期間中の月給 <span className="text-danger">*</span></label>
                          <div className="flex items-center gap-2">
                            <input type="number" min={0} value={form.probationMonthly} onChange={(e) => handleChange("probationMonthly", e.target.value)} placeholder="例: 28" className={inputClass} />
                            <span className={unitClass}>万円</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: 個人情報 */}
            <div>
              <h2 className="text-base font-semibold text-kon mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                個人情報（控除計算用）
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>年齢 <span className="text-danger">*</span></label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={18} max={75} value={form.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="例: 30" className={inputClass} />
                      <span className={unitClass}>歳</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">40歳以上は介護保険料加算</p>
                  </div>
                  <div>
                    <label className={labelClass}>扶養家族の人数</label>
                    <select value={form.dependents} onChange={(e) => handleChange("dependents", e.target.value)} className={inputClass}>
                      {[0,1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n}人</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">配偶者あり？</label>
                    <button type="button"
                      onClick={() => handleChange("hasSpouse", !form.hasSpouse)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.hasSpouse ? "bg-kon" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.hasSpouse ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className="text-sm text-gray-500">{form.hasSpouse ? "あり（配偶者控除適用）" : "なし"}</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>居住都道府県</label>
                  <select value={form.prefecture} onChange={(e) => handleChange("prefecture", e.target.value)} className={inputClass}>
                    {PREFECTURES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">健康保険料率の計算に使用</p>
                </div>

                <div>
                  <label className={labelClass}>社会保険</label>
                  <select value={form.insuranceType} onChange={(e) => handleChange("insuranceType", e.target.value)} className={inputClass}>
                    <option value="協会けんぽ">会社員（協会けんぽ）</option>
                    <option value="組合健保">組合健保（平均）</option>
                    <option value="共済">公務員（共済）</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button type="button"
                onClick={handleCalculate}
                className="flex-1 bg-kon hover:bg-ai text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
              >
                計算する
              </button>
              <button type="button"
                onClick={handleReset}
                className="px-4 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
            </div>
          </div>

          {/* ========== RESULTS CARD ========== */}
          <div>
            {!result && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-sm">左のフォームに入力して<br />「計算する」を押してください</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">

                {/* Comparison Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">転職前後の比較</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium w-28"></th>
                          <th className="text-right py-2 text-gray-700 font-medium">現在</th>
                          <th className="text-right py-2 text-gray-700 font-medium">転職後</th>
                          <th className="text-right py-2 text-gray-700 font-medium">差額</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 text-gray-600">年収</td>
                          <td className="py-2 text-right">{fmtMan(result.current.annualIncome)}</td>
                          <td className="py-2 text-right">{fmtMan(result.newJob.annualIncome)}</td>
                          <td className={`py-2 text-right font-medium ${diffColor(result.newJob.annualIncome - result.current.annualIncome)}`}>
                            {fmtDiff(result.newJob.annualIncome - result.current.annualIncome)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">月収（残業込）</td>
                          <td className="py-2 text-right">{fmtMan(result.current.monthlyIncome)}</td>
                          <td className="py-2 text-right">{fmtMan(result.newJob.monthlyIncome)}</td>
                          <td className={`py-2 text-right font-medium ${diffColor(result.newJob.monthlyIncome - result.current.monthlyIncome)}`}>
                            {fmtDiff(result.newJob.monthlyIncome - result.current.monthlyIncome)}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-2 text-gray-500 pl-2 text-xs">└ 健康保険料</td>
                          <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.current.healthInsurance)}</td>
                          <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.newJob.healthInsurance)}</td>
                          <td className="py-2 text-right text-gray-500 text-xs">
                            {fmtDiff(result.newJob.healthInsurance - result.current.healthInsurance)}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-2 text-gray-500 pl-2 text-xs">└ 厚生年金</td>
                          <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.current.pension)}</td>
                          <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.newJob.pension)}</td>
                          <td className="py-2 text-right text-gray-500 text-xs">
                            {fmtDiff(result.newJob.pension - result.current.pension)}
                          </td>
                        </tr>
                        {(result.current.nursing > 0 || result.newJob.nursing > 0) && (
                          <tr className="bg-gray-50">
                            <td className="py-2 text-gray-500 pl-2 text-xs">└ 介護保険料</td>
                            <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.current.nursing)}</td>
                            <td className="py-2 text-right text-gray-500 text-xs">{fmtYen(result.newJob.nursing)}</td>
                            <td className="py-2 text-right text-gray-500 text-xs">
                              {fmtDiff(result.newJob.nursing - result.current.nursing)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-2 text-gray-600 font-medium">社会保険料計</td>
                          <td className="py-2 text-right">{fmtYen(result.current.totalSocialInsurance)}</td>
                          <td className="py-2 text-right">{fmtYen(result.newJob.totalSocialInsurance)}</td>
                          <td className={`py-2 text-right font-medium ${diffColor(-(result.newJob.totalSocialInsurance - result.current.totalSocialInsurance))}`}>
                            {fmtDiff(result.newJob.totalSocialInsurance - result.current.totalSocialInsurance)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">所得税（月概算）</td>
                          <td className="py-2 text-right">{fmtYen(result.current.incomeTax)}</td>
                          <td className="py-2 text-right">{fmtYen(result.newJob.incomeTax)}</td>
                          <td className={`py-2 text-right font-medium ${diffColor(-(result.newJob.incomeTax - result.current.incomeTax))}`}>
                            {fmtDiff(result.newJob.incomeTax - result.current.incomeTax)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">住民税（月概算）</td>
                          <td className="py-2 text-right">{fmtYen(result.current.residentTax)}</td>
                          <td className="py-2 text-right">{fmtYen(result.newJob.residentTax)}</td>
                          <td className={`py-2 text-right font-medium ${diffColor(-(result.newJob.residentTax - result.current.residentTax))}`}>
                            {fmtDiff(result.newJob.residentTax - result.current.residentTax)}
                          </td>
                        </tr>
                        <tr className="border-t-2 border-gray-200 bg-gray-50">
                          <td className="py-3 text-kon font-bold">月手取り</td>
                          <td className="py-3 text-right font-bold text-kon">{fmtYen(result.current.monthlyTakeHome)}</td>
                          <td className="py-3 text-right font-bold text-kon">{fmtYen(result.newJob.monthlyTakeHome)}</td>
                          <td className={`py-3 text-right font-bold text-lg ${diffColor(result.monthlyDiff)}`}>
                            {fmtDiff(result.monthlyDiff)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Big Result Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">月手取り増加</p>
                    <p className={`text-xl font-bold ${diffColor(result.monthlyDiff)}`}>
                      {fmtDiff(result.monthlyDiff)}
                    </p>
                    <p className="text-xs text-gray-400">/月</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">年間手取り増加</p>
                    <p className={`text-xl font-bold ${diffColor(result.annualDiff)}`}>
                      {fmtDiff(result.annualDiff / 10000, "万円")}
                    </p>
                    <p className="text-xs text-gray-400">/年</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">5年間累計</p>
                    <p className={`text-xl font-bold ${diffColor(result.fiveYearDiff)}`}>
                      {fmtDiff(result.fiveYearDiff / 10000, "万円")}
                    </p>
                    <p className="text-xs text-gray-400">5年累計</p>
                  </div>
                </div>

                {/* 試用期間 */}
                {result.probation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-kon mb-3">試用期間の影響</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-kon">試用期間中の月手取り（概算）</span>
                        <span className="font-medium">{fmtYen(result.probation.monthlyTakeHome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kon">試用期間の収入損失（{result.probation.months}ヶ月分）</span>
                        <span className="font-medium text-danger">約 {fmt(Math.round(result.probation.totalLoss / 10000))}万円</span>
                      </div>
                      {result.breakEvenMonths !== undefined && (
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                          <span className="text-kon font-medium">損益分岐点</span>
                          <span className="font-bold text-kon">転職後 約{result.breakEvenMonths}ヶ月</span>
                        </div>
                      )}
                      {result.breakEvenMonths !== undefined && (
                        <p className="text-xs text-kon mt-1">
                          転職後{result.breakEvenMonths}ヶ月で試用期間の収入損失を回収できます
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 転職タイミングアドバイス */}
                <div className="bg-gray-50 border-l-4 border-kon rounded-r-xl p-4">
                  <h3 className="text-sm font-semibold text-kon mb-2">転職タイミングアドバイス</h3>
                  <ul className="text-xs text-kon space-y-1.5">
                    <li>• 住民税は前年収入に基づくため、転職直後も現年収ベースで課税されます</li>
                    <li>• <span className="font-medium">12月退職→1月入社</span>が最も手続きがシンプルです</li>
                    <li>• 月末退職で当月分・月中退職で前月分まで社会保険料が発生します</li>
                    <li>• 年収が上がる転職の場合、<span className="font-medium">翌年6月から住民税が増加</span>します</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== SEO CONTENT ========== */}

        {/* パターン計算例 */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある転職パターンの計算例</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">転職前年収</th>
                  <th className="text-left py-2 text-gray-500 font-medium">転職後年収</th>
                  <th className="text-left py-2 text-gray-500 font-medium">年代</th>
                  <th className="text-right py-2 text-gray-500 font-medium">月手取り増加</th>
                  <th className="text-right py-2 text-gray-500 font-medium">年間差額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { before: "400万円", after: "450万円", age: "30代", monthly: "約+2.8万円", annual: "約+34万円", pos: true },
                  { before: "500万円", after: "600万円", age: "30代", monthly: "約+5.8万円", annual: "約+70万円", pos: true },
                  { before: "600万円", after: "500万円", age: "40代", monthly: "約-5.2万円", annual: "約-62万円", pos: false },
                  { before: "700万円", after: "800万円", age: "40代", monthly: "約+6.1万円", annual: "約+73万円", pos: true },
                  { before: "400万円", after: "380万円", age: "20代", monthly: "約-1.4万円", annual: "約-17万円", pos: false },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 text-gray-700">{row.before}</td>
                    <td className="py-2 text-gray-700">{row.after}</td>
                    <td className="py-2 text-gray-500">{row.age}</td>
                    <td className={`py-2 text-right font-medium ${row.pos ? "text-green-600" : "text-danger"}`}>{row.monthly}</td>
                    <td className={`py-2 text-right font-medium ${row.pos ? "text-green-600" : "text-danger"}`}>{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">※ 東京都在住・配偶者なし・扶養なし・残業なし・ボーナスなしの場合の概算です</p>
        </div>

        {/* 基礎知識 */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">転職時の年収・手取りの基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">転職で年収が上がっても手取りが思ったより増えない理由</h3>
              <p className="mb-2">年収が上がると所得税の税率が上がる（累進課税）ため、額面の増加ほど手取りは増えません。また社会保険料も年収に比例して増加するため、実際の手取り増加率は年収増加率より低くなります。</p>
              <ul className="space-y-1 text-gray-600">
                <li>• 年収300〜500万円帯：年収増加の約75〜78%が手取り増加に</li>
                <li>• 年収500〜700万円帯：年収増加の約70〜75%が手取り増加に</li>
                <li>• 年収700万円超：年収増加の約65〜70%が手取り増加に</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">住民税の注意点</h3>
              <p>住民税は前年の収入に基づいて計算され、翌年6月から課税されます。転職後に年収が下がった場合でも、翌年6月まで前職年収ベースの住民税が続きます。転職後に一時的に手取りが減る主な原因の一つです。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">試用期間中の給与について</h3>
              <p>多くの企業で試用期間中は本給より低い給与が設定されています。試用期間が3〜6ヶ月ある場合、その期間の収入損失を考慮した上で転職の判断をしましょう。本ツールの損益分岐点計算をご活用ください。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">Q{i + 1}. {faq.q}</span>
                  <span className={`text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/career/overtime-calculator", label: "残業代オールインワン計算機", desc: "法定時間外・深夜・休日・固定残業を一括計算" },
              { href: "/career/unemployment-calculator", label: "失業給付金計算機", desc: "離職後の失業手当受給額をシミュレーション" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "各種控除を反映した正確な税額を計算" },
              { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "自分の控除上限額を簡単に計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex flex-col gap-1 p-3 border border-gray-200 rounded-lg hover:border-ai hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-kon">{tool.label}</span>
                <span className="text-xs text-gray-500">{tool.desc}</span>
              </Link>
            ))}
          </div>
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/tenshoku-nenshu-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】転職で年収はいくら上がる？年収アップシミュレーション</p>
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
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

  </>
  );
}
