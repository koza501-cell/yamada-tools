"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type EmploymentType = "monthly" | "hourly" | "daily";

interface FormState {
  employmentType: EmploymentType;
  monthlySalary: string;
  hourlySalary: string;
  dailySalary: string;
  workDaysPerMonth: string;
  hoursPerDay: string;
  positionAllowance: string;
  dutyAllowance: string;
  attendanceAllowance: string;
  overtimeNormal: string;
  overtimeOver60: string;
  nightWork: string;
  legalHoliday: string;
  nonLegalHoliday: string;
  hasFixedOvertime: boolean;
  fixedOvertimePay: string;
  fixedOvertimeHours: string;
}

interface CalcResult {
  baseHourlyWage: number;
  normalHours: number;
  normalOvertime: number;
  over60Hours: number;
  over60Overtime: number;
  nightHours: number;
  nightPremium: number;
  legalHolidayHours: number;
  legalHolidayPay: number;
  nonLegalHolidayHours: number;
  nonLegalHolidayPay: number;
  monthlyTotal: number;
  annualTotal: number;
  fixedCheck?: {
    requiredAmount: number;
    difference: number;
    isAdequate: boolean;
    additionalRequired: number;
  };
}

const DEFAULT_FORM: FormState = {
  employmentType: "monthly",
  monthlySalary: "",
  hourlySalary: "",
  dailySalary: "",
  workDaysPerMonth: "21",
  hoursPerDay: "8",
  positionAllowance: "",
  dutyAllowance: "",
  attendanceAllowance: "",
  overtimeNormal: "",
  overtimeOver60: "0",
  nightWork: "0",
  legalHoliday: "0",
  nonLegalHoliday: "0",
  hasFixedOvertime: false,
  fixedOvertimePay: "",
  fixedOvertimeHours: "",
};

function fmt(val: number): string {
  return Math.round(val).toLocaleString();
}

function fmtMan(val: number): string {
  return (Math.round(val / 1000) / 10).toLocaleString();
}

function calculate(form: FormState): CalcResult {
  const workDays = parseFloat(form.workDaysPerMonth) || 21;
  const hoursPerDay = parseFloat(form.hoursPerDay) || 8;
  const baseHoursPerMonth = workDays * hoursPerDay;

  const posAllowance = parseFloat(form.positionAllowance) || 0;
  const dutyAllowance = parseFloat(form.dutyAllowance) || 0;
  const attAllowance = parseFloat(form.attendanceAllowance) || 0;
  const totalAllowances = posAllowance + dutyAllowance + attAllowance;

  let baseHourlyWage = 0;
  if (form.employmentType === "monthly") {
    const monthly = parseFloat(form.monthlySalary) || 0;
    baseHourlyWage = (monthly + totalAllowances) / baseHoursPerMonth;
  } else if (form.employmentType === "hourly") {
    baseHourlyWage = parseFloat(form.hourlySalary) || 0;
  } else {
    const daily = parseFloat(form.dailySalary) || 0;
    baseHourlyWage = daily / hoursPerDay;
  }

  const overtimeNormal = parseFloat(form.overtimeNormal) || 0;
  const overtimeOver60 = parseFloat(form.overtimeOver60) || 0;
  const nightWork = parseFloat(form.nightWork) || 0;
  const legalHoliday = parseFloat(form.legalHoliday) || 0;
  const nonLegalHoliday = parseFloat(form.nonLegalHoliday) || 0;

  const normalHours = Math.max(0, overtimeNormal - overtimeOver60);
  const normalOvertime = baseHourlyWage * 1.25 * normalHours;
  const over60Overtime = baseHourlyWage * 1.50 * overtimeOver60;
  const nightPremium = baseHourlyWage * 0.25 * nightWork;
  const legalHolidayPay = baseHourlyWage * 1.35 * legalHoliday;
  const nonLegalHolidayPay = baseHourlyWage * 1.25 * nonLegalHoliday;

  const monthlyTotal = normalOvertime + over60Overtime + nightPremium + legalHolidayPay + nonLegalHolidayPay;
  const annualTotal = monthlyTotal * 12;

  let fixedCheck: CalcResult["fixedCheck"] = undefined;
  if (form.hasFixedOvertime) {
    const fixedPay = parseFloat(form.fixedOvertimePay) || 0;
    const fixedHours = parseFloat(form.fixedOvertimeHours) || 0;
    const requiredAmount = baseHourlyWage * 1.25 * fixedHours;
    const difference = fixedPay - requiredAmount;
    const isAdequate = difference >= 0;
    const additionalRequired = Math.max(0, monthlyTotal - fixedPay);
    fixedCheck = { requiredAmount, difference, isAdequate, additionalRequired };
  }

  return {
    baseHourlyWage,
    normalHours,
    normalOvertime,
    over60Hours: overtimeOver60,
    over60Overtime,
    nightHours: nightWork,
    nightPremium,
    legalHolidayHours: legalHoliday,
    legalHolidayPay,
    nonLegalHolidayHours: nonLegalHoliday,
    nonLegalHolidayPay,
    monthlyTotal,
    annualTotal,
    fixedCheck,
  };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "残業代オールインワン計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "法定時間外・深夜・休日・固定残業代を一括計算。2026年最新の割増率対応。固定残業代の適正チェック機能付き。",
      "url": "https://yamada-tools.jp/career/overtime-calculator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "残業代オールインワン計算機", "item": "https://yamada-tools.jp/career/overtime-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "残業代が出ない管理職とはどんな人ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "労働基準法上の管理監督者は残業代の対象外ですが、単に管理職という肩書があるだけでは管理監督者にはなりません。経営方針への参加権限・出退勤の自由・相応の待遇が必要です。名ばかり管理職の残業代不払いは違法です。" }
        },
        {
          "@type": "Question",
          "name": "固定残業代がある場合、実際の残業が少なくても返還しなくていいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "固定残業時間に満たない残業しかしなかった場合でも、固定残業代の返還義務はありません。ただし実際の残業が固定時間を超えた場合は、超過分の追加支払いが必要です。" }
        },
        {
          "@type": "Question",
          "name": "月60時間超の残業代割増率はいつから変わりましたか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2023年4月1日から中小企業を含む全企業で、月60時間を超える時間外労働の割増率が1.25倍から1.50倍に引き上げられました。" }
        },
        {
          "@type": "Question",
          "name": "未払い残業代はさかのぼって請求できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2020年4月以降の未払い賃金の消滅時効は3年です。最大3年分の未払い残業代を請求できます。タイムカード・PCログ・メール記録などが証拠として有効です。" }
        },
        {
          "@type": "Question",
          "name": "深夜に残業した場合の割増率はどう計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "深夜（22時〜翌5時）に法定時間外労働をした場合、時間外割増（25%）と深夜割増（25%）が重なり合計50%増（×1.50）となります。法定休日の深夜労働は合計60%増（×1.60）です。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "残業代の計算方法",
      "description": "月給・残業時間・種別から残業代を正確に計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本給与情報を入力", "text": "雇用形態・月給・所定労働時間・各種手当を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "残業時間を種別ごとに入力", "text": "法定時間外・深夜・休日それぞれの残業時間を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "固定残業代チェック（任意）", "text": "固定残業代がある場合は金額と時間を入力して適正チェックができます。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「計算する」を押すと残業代の内訳・合計・年間概算が表示されます。" }
      ]
    }
  ]
};

export default function OvertimeCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    const days = parseFloat(form.workDaysPerMonth);
    const hours = parseFloat(form.hoursPerDay);
    if (!form.workDaysPerMonth || isNaN(days) || days < 1 || days > 31) {
      setError("月の所定労働日数は1〜31の範囲で入力してください");
    setMascotState("error");
      return;
    }
    if (!form.hoursPerDay || isNaN(hours) || hours < 1 || hours > 24) {
      setError("1日の所定労働時間は1〜24の範囲で入力してください");
    setMascotState("error");
      return;
    }
    if (form.employmentType === "monthly" && (!form.monthlySalary || parseFloat(form.monthlySalary) <= 0)) {
      setError("月給を入力してください");
    setMascotState("error");
      return;
    }
    if (form.employmentType === "hourly" && (!form.hourlySalary || parseFloat(form.hourlySalary) <= 0)) {
      setError("時給を入力してください");
    setMascotState("error");
      return;
    }
    if (form.employmentType === "daily" && (!form.dailySalary || parseFloat(form.dailySalary) <= 0)) {
      setError("日給を入力してください");
    setMascotState("error");
      return;
    }
    const overtimeNormal = parseFloat(form.overtimeNormal) || 0;
    const overtimeOver60 = parseFloat(form.overtimeOver60) || 0;
    if (overtimeOver60 > overtimeNormal) {
      setError("60時間超の時間は法定時間外労働時間以下にしてください");
    setMascotState("error");
      return;
    }
    if (form.hasFixedOvertime) {
      if (!form.fixedOvertimePay || parseFloat(form.fixedOvertimePay) <= 0) {
        setError("固定残業代の金額を入力してください");
    setMascotState("error");
        return;
      }
      if (!form.fixedOvertimeHours || parseFloat(form.fixedOvertimeHours) <= 0) {
        setError("固定残業時間を入力してください");
    setMascotState("error");
        return;
      }
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


  const faqItems = [
    { question: "残業代の計算方法を教えてください", answer: "残業代は「時間外労働時間数 × 時給 × 割増率」で計算します。法定時間外（月60時間以下）は1.25倍、月60時間超は1.50倍、深夜（22時〜5時）は1.25倍、法定休日は1.35倍です。これらが重複する場合は割増率が加算されます。" },
    { question: "固定残業代が適正かどうか確認できますか？", answer: "はい、本ツールの「固定残業代チェック」機能で確認できます。実際の残業代計算額と固定残業代を比較し、不足額があれば会社は追加支払義務があります。固定残業代は法定の割増賃金を下回ることはできません。" },
    { question: "管理職でも残業代は請求できますか？", answer: "法律上の「管理監督者」に該当する場合は残業代請求権がありませんが、名ばかり管理職（実質的な管理権限がない場合）は請求できます。また管理監督者でも深夜割増賃金（22時〜5時）の請求権は残ります。" },
    { question: "残業代の時効はいつですか？", answer: "2020年4月以降の賃金債権の時効は3年（それ以前は2年）です。退職後も3年以内であれば未払い残業代を請求できます。証拠として勤怠記録・タイムカード・メール等を保管しておくことが重要です。" },
    { question: "裁量労働制の場合、残業代はどうなりますか？", answer: "裁量労働制が適法に適用されている場合、みなし労働時間制となり残業代が発生しない場合があります。ただし深夜・休日労働の割増賃金は支払われます。裁量労働制は適用要件が厳しく、要件を満たさない場合は通常の残業代が発生します。" }
  ];
  const useCases = [
    { icon: "⏰", persona: "残業が多い会社員", title: "未払い残業代がないか確認したい", benefit: "法定通りの割増賃金額を正確に計算" },
    { icon: "📋", persona: "固定残業代がある方", title: "みなし残業が実際の残業より少ないか不安", benefit: "固定残業代の不足額を自動チェック" },
    { icon: "🌙", persona: "深夜・休日勤務が多い方", title: "割増率の重複計算を正確に把握したい", benefit: "深夜×時間外などの重複割増も正確算出" }
  ];
  return (
    <>
      <IntroSection title="残業代計算機" paragraphs={["法定時間外・深夜・休日・法定休日の割増賃金を自動計算。固定残業代が適正かどうかのチェック機能も搭載しています。", "2024年4月の残業代時効3年延長・建設業などの上限規制にも対応。月給・時給・日給どの雇用形態でも計算できます。", "未払い残業代の計算や固定残業代のチェックに活用できます。登録不要・完全無料。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium bg-gray-50 text-kon px-2 py-0.5 rounded">2026年最新</span>
            <span className="text-xs text-gray-500">月60時間超1.5倍対応</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            残業代オールインワン計算機
          </h1>
          <p className="text-gray-600 text-sm">
            法定時間外・深夜・休日・固定残業代を一括計算。種別ごとの内訳と年間概算がわかります。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            {/* Section 1 */}
            <h2 className="text-base font-semibold text-kon mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              基本給与情報
            </h2>

            <div className="space-y-4">
              {/* 雇用形態 */}
              <div>
                <label className={labelClass}>雇用形態 <span className="text-danger">*</span></label>
                <div className="flex gap-2">
                  {(["monthly", "hourly", "daily"] as const).map((type) => {
                    const labels: Record<EmploymentType, string> = { monthly: "月給制", hourly: "時給制", daily: "日給制" };
                    return (
                      <button type="button"
                        key={type}
                        onClick={() => handleChange("employmentType", type)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.employmentType === type
                            ? "bg-kon text-white border-kon"
                            : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                        }`}
                      >
                        {labels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 月給 */}
              {form.employmentType === "monthly" && (
                <div>
                  <label className={labelClass}>月給 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.monthlySalary} onChange={(e) => handleChange("monthlySalary", e.target.value)} placeholder="例: 300000" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                </div>
              )}

              {/* 時給 */}
              {form.employmentType === "hourly" && (
                <div>
                  <label className={labelClass}>時給 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.hourlySalary} onChange={(e) => handleChange("hourlySalary", e.target.value)} placeholder="例: 1500" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                </div>
              )}

              {/* 日給 */}
              {form.employmentType === "daily" && (
                <div>
                  <label className={labelClass}>日給 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={form.dailySalary} onChange={(e) => handleChange("dailySalary", e.target.value)} placeholder="例: 15000" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>月の所定労働日数</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={31} value={form.workDaysPerMonth} onChange={(e) => handleChange("workDaysPerMonth", e.target.value)} className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">日</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>1日の所定労働時間</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={24} step="0.5" value={form.hoursPerDay} onChange={(e) => handleChange("hoursPerDay", e.target.value)} className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  各種手当（基礎賃金に含む）
                  <span className="ml-1 text-xs text-gray-400 font-normal" title="通勤手当・家族手当・住宅手当・別居手当・子女教育手当・臨時賃金・1ヶ月超の賞与は法律上含めません">
                    ⓘ 通勤・家族手当は除く
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 shrink-0">役職手当</span>
                    <input type="number" min={0} value={form.positionAllowance} onChange={(e) => handleChange("positionAllowance", e.target.value)} placeholder="0" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 shrink-0">職務手当</span>
                    <input type="number" min={0} value={form.dutyAllowance} onChange={(e) => handleChange("dutyAllowance", e.target.value)} placeholder="0" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 shrink-0">精皆勤手当</span>
                    <input type="number" min={0} value={form.attendanceAllowance} onChange={(e) => handleChange("attendanceAllowance", e.target.value)} placeholder="0" className={inputClass} />
                    <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <h2 className="text-base font-semibold text-kon mt-6 mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              残業時間の入力
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>法定時間外労働時間（今月）</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} step="0.5" value={form.overtimeNormal} onChange={(e) => handleChange("overtimeNormal", e.target.value)} placeholder="例: 20" className={inputClass} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  うち60時間超の時間外
                  <span className="ml-1 text-xs text-gray-400 font-normal">（月60時間超は1.5倍）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} step="0.5" value={form.overtimeOver60} onChange={(e) => handleChange("overtimeOver60", e.target.value)} placeholder="0" className={inputClass} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  深夜労働時間
                  <span className="ml-1 text-xs text-gray-400 font-normal" title="22:00〜翌5:00の労働時間。時間外と重複する場合も0.25増しで計算します">ⓘ 22:00〜翌5:00</span>
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} step="0.5" value={form.nightWork} onChange={(e) => handleChange("nightWork", e.target.value)} placeholder="0" className={inputClass} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  法定休日労働時間
                  <span className="ml-1 text-xs text-gray-400 font-normal" title="労働基準法の週1日の休日（日曜など）に働いた時間">ⓘ 週1日の法定休日</span>
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} step="0.5" value={form.legalHoliday} onChange={(e) => handleChange("legalHoliday", e.target.value)} placeholder="0" className={inputClass} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  法定外休日労働時間
                  <span className="ml-1 text-xs text-gray-400 font-normal">（土曜など所定休日）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} step="0.5" value={form.nonLegalHoliday} onChange={(e) => handleChange("nonLegalHoliday", e.target.value)} placeholder="0" className={inputClass} />
                  <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <h2 className="text-base font-semibold text-kon mt-6 mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              固定残業代チェック
              <span className="text-xs font-normal text-gray-400">（任意）</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>固定残業代（みなし残業）あり？</label>
                <div className="flex gap-3">
                  {([{ label: "あり", value: true }, { label: "なし", value: false }] as const).map((opt) => (
                    <button type="button"
                      key={String(opt.value)}
                      onClick={() => handleChange("hasFixedOvertime", opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.hasFixedOvertime === opt.value
                          ? "bg-kon text-white border-kon"
                          : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.hasFixedOvertime && (
                <>
                  <div>
                    <label className={labelClass}>固定残業代の金額 <span className="text-danger">*</span></label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={form.fixedOvertimePay} onChange={(e) => handleChange("fixedOvertimePay", e.target.value)} placeholder="例: 50000" className={inputClass} />
                      <span className="text-sm text-gray-500 whitespace-nowrap">円/月</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>固定残業時間 <span className="text-danger">*</span></label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} step="0.5" value={form.fixedOvertimeHours} onChange={(e) => handleChange("fixedOvertimeHours", e.target.value)} placeholder="例: 30" className={inputClass} />
                      <span className="text-sm text-gray-500 whitespace-nowrap">時間</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-danger text-sm bg-gray-50 rounded-lg px-3 py-2 mt-4">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button type="button"
                onClick={handleCalculate}
                className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-semibold hover:bg-ai transition-colors shadow-sm"
              >
                計算する
              </button>
            </div>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                {/* 基礎時給 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">基礎時給（割増賃金の計算ベース）</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fmt(result.baseHourlyWage)}<span className="text-base font-normal text-gray-500 ml-1">円/時</span>
                  </p>
                </div>

                {/* 合計 BIG */}
                <div className="bg-kon rounded-xl p-6 text-white shadow-sm">
                  <p className="text-sm font-medium opacity-80 mb-1">今月の残業代合計</p>
                  <p className="text-4xl font-bold mb-1">
                    {fmt(result.monthlyTotal)}<span className="text-2xl ml-1">円</span>
                  </p>
                </div>

                {/* 内訳テーブル */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">今月の残業代内訳</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs text-gray-500 font-medium">種別</th>
                          <th className="text-right py-2 text-xs text-gray-500 font-medium">時間</th>
                          <th className="text-right py-2 text-xs text-gray-500 font-medium">割増率</th>
                          <th className="text-right py-2 text-xs text-gray-500 font-medium">金額</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 text-gray-600 text-xs">法定時間外（通常）</td>
                          <td className="py-2 text-right text-gray-800">{result.normalHours}h</td>
                          <td className="py-2 text-right text-gray-500 text-xs">1.25倍</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.normalOvertime)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600 text-xs">法定時間外（60h超）</td>
                          <td className="py-2 text-right text-gray-800">{result.over60Hours}h</td>
                          <td className="py-2 text-right text-gray-500 text-xs">1.50倍</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.over60Overtime)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600 text-xs">深夜労働割増</td>
                          <td className="py-2 text-right text-gray-800">{result.nightHours}h</td>
                          <td className="py-2 text-right text-gray-500 text-xs">+0.25倍</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.nightPremium)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600 text-xs">法定休日労働</td>
                          <td className="py-2 text-right text-gray-800">{result.legalHolidayHours}h</td>
                          <td className="py-2 text-right text-gray-500 text-xs">1.35倍</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.legalHolidayPay)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600 text-xs">法定外休日労働</td>
                          <td className="py-2 text-right text-gray-800">{result.nonLegalHolidayHours}h</td>
                          <td className="py-2 text-right text-gray-500 text-xs">1.25倍</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.nonLegalHolidayPay)}円</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-2 px-2 text-kon font-semibold text-xs" colSpan={3}>合計</td>
                          <td className="py-2 px-2 text-right font-bold text-kon">{fmt(result.monthlyTotal)}円</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 年間概算 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">年間概算残業代</p>
                  <p className="text-2xl font-bold text-gray-900">
                    約{fmtMan(result.annualTotal)}<span className="text-base font-normal text-gray-500 ml-1">万円</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">（今月の残業代 × 12ヶ月）</p>
                </div>

                {/* 固定残業代診断 */}
                {result.fixedCheck && (
                  <div className={`rounded-xl shadow-sm border p-5 ${result.fixedCheck.isAdequate ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${result.fixedCheck.isAdequate ? "bg-green-500" : "bg-danger"}`}>
                        {result.fixedCheck.isAdequate ? "✓" : "!"}
                      </span>
                      <span className={result.fixedCheck.isAdequate ? "text-green-800" : "text-danger"}>
                        固定残業代診断
                      </span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">法定上の必要額</span>
                        <span className="font-medium text-gray-900">{fmt(result.fixedCheck.requiredAmount)}円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">実際の固定残業代</span>
                        <span className="font-medium text-gray-900">{fmt(parseFloat(form.fixedOvertimePay))}円</span>
                      </div>
                      {result.fixedCheck.isAdequate ? (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-green-700 font-semibold">固定残業代は適正です</p>
                          <p className="text-green-600 text-xs mt-0.5">法定割増賃金を上回っています（差額 +{fmt(result.fixedCheck.difference)}円）</p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-danger font-semibold">固定残業代が不足している可能性があります</p>
                          <p className="text-danger text-xs mt-0.5">不足額：{fmt(Math.abs(result.fixedCheck.difference))}円</p>
                        </div>
                      )}
                      {result.fixedCheck.additionalRequired > 0 && (
                        <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                          <p className="text-yellow-800 text-xs font-medium">
                            実際の残業が固定時間を超えているため、追加で{fmt(result.fixedCheck.additionalRequired)}円の支払いが必要です
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 px-1">
                  根拠法令：労働基準法第37条 / 割増率は2023年4月改正（月60時間超：1.5倍）適用済み
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">左のフォームを入力して<br />「計算する」を押してください</p>
              </div>
            )}
          </div>
        </div>

        {/* よくある計算例 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある計算例</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-kon text-white">
                    <th className="px-4 py-3 text-left font-semibold">月給</th>
                    <th className="px-4 py-3 text-left font-semibold">残業（通常）</th>
                    <th className="px-4 py-3 text-left font-semibold">深夜</th>
                    <th className="px-4 py-3 text-left font-semibold">休日</th>
                    <th className="px-4 py-3 text-left font-semibold">残業代目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { salary: "25万円", ot: "20時間", night: "0時間", holiday: "0時間", total: "約39,500円" },
                    { salary: "30万円", ot: "30時間", night: "5時間", holiday: "0時間", total: "約72,900円" },
                    { salary: "35万円", ot: "40時間", night: "8時間", holiday: "8時間", total: "約130,600円" },
                    { salary: "40万円", ot: "20時間", night: "0時間", holiday: "8時間", total: "約86,900円" },
                    { salary: "50万円", ot: "45時間", night: "10時間", holiday: "0時間", total: "約165,400円" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{row.salary}</td>
                      <td className="px-4 py-3 text-gray-800">{row.ot}</td>
                      <td className="px-4 py-3 text-gray-800">{row.night}</td>
                      <td className="px-4 py-3 text-gray-800">{row.holiday}</td>
                      <td className="px-4 py-3 font-semibold text-kon">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 px-1">※所定労働日数21日・8時間/日で計算。休日は法定休日での試算。</p>
        </div>

        {/* 残業代の計算方法と基礎知識 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">残業代の計算方法と基礎知識</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
            <p>
              残業代（割増賃金）は労働基準法第37条で定められた法定の権利です。使用者は以下の割増率で残業代を支払う義務があります。
            </p>

            <div>
              <p className="font-semibold text-gray-800 mb-2">割増率一覧（2026年最新）：</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">種別</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">割増率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-3 py-2 text-gray-600">法定時間外労働（月60時間以下）</td><td className="px-3 py-2 font-semibold text-kon">×1.25</td></tr>
                    <tr className="bg-gray-50"><td className="px-3 py-2 text-gray-600">法定時間外労働（月60時間超）</td><td className="px-3 py-2 font-semibold text-kon">×1.50 ※2023年4月〜全企業対象</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">深夜労働（22:00〜翌5:00）</td><td className="px-3 py-2 font-semibold text-kon">×1.25（+0.25割増）</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">法定休日労働</td><td className="px-3 py-2 font-semibold text-kon">×1.35</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">深夜かつ時間外</td><td className="px-3 py-2 font-semibold text-kon">×1.50（合算）</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">固定残業代（みなし残業）について：</p>
              <p className="mb-2">固定残業代とは、一定時間分の残業代をあらかじめ給与に含める制度です。ただし以下の条件を満たさなければ違法となります：</p>
              <ul className="space-y-1 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>固定残業時間と金額が明示されていること</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>実際の残業が固定時間を超えた場合は追加支払いが必要</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>固定残業代が法定の割増賃金を下回ってはならない</span></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">基礎賃金に含まれない手当：</p>
              <p>通勤手当、家族手当、別居手当、子女教育手当、住宅手当、臨時に支払われた賃金、1ヶ月を超える期間ごとに支払われる賞与などは基礎賃金に含めません（労働基準法施行規則第21条）。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "残業代が出ない「管理職」とはどんな人ですか？",
                a: "労働基準法上の「管理監督者」は残業代の対象外ですが、単に「管理職」という肩書があるだけでは管理監督者にはなりません。経営方針への参加権限・出退勤の自由・相応の待遇が必要です。名ばかり管理職の残業代不払いは違法です。"
              },
              {
                q: "固定残業代（みなし残業）がある場合、実際の残業が少なくても返還しなくていいですか？",
                a: "はい、固定残業時間に満たない残業しかしなかった場合でも、固定残業代の返還義務はありません。ただし実際の残業が固定時間を超えた場合は、超過分の追加支払いが必要です。"
              },
              {
                q: "月60時間超の残業代割増率はいつから変わりましたか？",
                a: "2023年4月1日から中小企業を含む全企業で、月60時間を超える時間外労働の割増率が1.25倍から1.50倍に引き上げられました。それ以前は大企業のみ1.50倍でした。"
              },
              {
                q: "未払い残業代はさかのぼって請求できますか？",
                a: "はい、労働基準法の改正により2020年4月以降の未払い賃金の消滅時効は3年です（改正前は2年）。最大3年分の未払い残業代を請求できます。証拠として、タイムカード・PCのログ・メールの送受信記録などが有効です。"
              },
              {
                q: "深夜に残業した場合の割増率はどう計算しますか？",
                a: "深夜（22時〜翌5時）に法定時間外労働をした場合、時間外割増（25%）と深夜割増（25%）が重なり、合計50%増（×1.50）となります。法定休日の深夜労働は休日割増（35%）と深夜割増（25%）で合計60%増（×1.60）です。"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="font-semibold text-gray-800 mb-2 flex gap-2">
                  <span className="text-kon font-bold shrink-0">Q{i + 1}.</span>
                  {item.q}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">A.</span>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* あわせて使えるツール */}
        <div className="mt-10 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職後の手取りと年収変化を計算" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税負担をシミュレーション" },
              { href: "/career/unemployment-calculator", label: "失業給付金計算機", desc: "雇用保険の給付額と受給期間を計算" },
              { href: "/blog/rougo-shikin-simulation-2026", label: "老後資金シミュレーター", desc: "老後に必要な資金と不足額を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 hover:border-ai hover:shadow-md transition-all p-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-kon group-hover:text-ai">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
