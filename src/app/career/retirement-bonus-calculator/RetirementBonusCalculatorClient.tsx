"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type RetirementType = "general" | "officer" | "early";
type ResignationType = "teinen" | "jiko" | "kaisha" | "shougai";
type WithholdingMethod = "withhold" | "self";

interface FormState {
  retirementType: RetirementType;
  amount: string;
  yearsOfService: string;
  resignationType: ResignationType;
  isDisabled: boolean;
  hadPreviousRetirement: boolean;
  previousYears: string;
  otherIncome: boolean;
  withholdingMethod: WithholdingMethod;
}

interface CalcResult {
  deduction: number;
  taxableBase: number;
  taxableIncome: number;
  incomeTax: number;
  revivalTax: number;
  totalIncomeTax: number;
  residentTax: number;
  totalTax: number;
  netAmount: number;
  effectiveRate: number;
  isOfficerShortTerm: boolean;
  isShortTermSpecial: boolean;
  taxIsZero: boolean;
}

const DEFAULT_FORM: FormState = {
  retirementType: "general",
  amount: "",
  yearsOfService: "",
  resignationType: "teinen",
  isDisabled: false,
  hadPreviousRetirement: false,
  previousYears: "",
  otherIncome: false,
  withholdingMethod: "withhold",
};

function calcDeduction(years: number, isDisabled: boolean): number {
  let d: number;
  if (years <= 20) {
    d = Math.max(80, 40 * years);
  } else {
    d = 800 + 70 * (years - 20);
  }
  if (isDisabled) d += 100;
  return d; // 万円
}

function calcIncomeTax(taxableMan: number): number {
  const v = taxableMan * 10000;
  // floor to 1000
  const x = Math.floor(v / 1000) * 1000;
  if (x <= 0) return 0;
  let tax: number;
  if (x <= 1950000) {
    tax = x * 0.05;
  } else if (x <= 3300000) {
    tax = x * 0.10 - 97500;
  } else if (x <= 6950000) {
    tax = x * 0.20 - 427500;
  } else if (x <= 9000000) {
    tax = x * 0.23 - 636000;
  } else if (x <= 18000000) {
    tax = x * 0.33 - 1536000;
  } else if (x <= 40000000) {
    tax = x * 0.40 - 2796000;
  } else {
    tax = x * 0.45 - 4796000;
  }
  return Math.max(0, Math.floor(tax));
}

function calculate(form: FormState): CalcResult | null {
  const amountMan = parseFloat(form.amount);
  const years = Math.floor(parseFloat(form.yearsOfService));
  if (isNaN(amountMan) || amountMan <= 0) return null;
  if (isNaN(years) || years < 1 || years > 50) return null;

  const deduction = calcDeduction(years, form.isDisabled);
  const excess = amountMan - deduction; // 万円

  const isOfficerShortTerm = form.retirementType === "officer" && years <= 5;
  const isShortTermSpecial = form.retirementType !== "officer" && years <= 5;

  let taxableIncome: number; // 万円 (課税退職所得)
  if (excess <= 0) {
    taxableIncome = 0;
  } else if (isOfficerShortTerm) {
    taxableIncome = excess;
  } else if (isShortTermSpecial) {
    if (excess <= 300) {
      taxableIncome = excess / 2;
    } else {
      taxableIncome = 150 + (excess - 300);
    }
  } else {
    taxableIncome = excess / 2;
  }

  const taxableBase = excess <= 0 ? 0 : excess;
  const taxIsZero = taxableIncome <= 0;

  const incomeTax = calcIncomeTax(taxableIncome);
  const revivalTax = Math.floor(incomeTax * 0.021);
  const totalIncomeTax = incomeTax + revivalTax;
  const residentTax = Math.floor(taxableIncome * 10000 * 0.10);
  const totalTax = totalIncomeTax + residentTax;
  const netAmount = amountMan - totalTax / 10000;
  const effectiveRate = totalTax / (amountMan * 10000) * 100;

  return {
    deduction,
    taxableBase,
    taxableIncome,
    incomeTax,
    revivalTax,
    totalIncomeTax,
    residentTax,
    totalTax,
    netAmount,
    effectiveRate,
    isOfficerShortTerm,
    isShortTermSpecial,
    taxIsZero,
  };
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString();
}

function fmtMan(v: number): string {
  return (Math.round(v * 10) / 10).toLocaleString();
}

function fmtManRound(yen: number): string {
  return fmtMan(yen / 10000);
}

const QUICK_TABLE = [
  { years: 5, deduction: 200 },
  { years: 10, deduction: 400 },
  { years: 15, deduction: 600 },
  { years: 20, deduction: 800 },
  { years: 25, deduction: 1150 },
  { years: 30, deduction: 1500 },
  { years: 35, deduction: 1850 },
];

export default function RetirementBonusCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent bg-white";

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleCalculate() {
    setError("");
    const amountMan = parseFloat(form.amount);
    if (isNaN(amountMan) || amountMan <= 0) {
      setError("退職金の額を正しく入力してください");
    setMascotState("error");
      return;
    }
    const years = parseFloat(form.yearsOfService);
    if (isNaN(years) || years < 1 || years > 50) {
      setError("勤続年数を1〜50年の範囲で入力してください");
    setMascotState("error");
      return;
    }
    setResult(calculate(form));
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const amountForTable = parseFloat(form.amount) || 0;

  function calcTaxForTable(years: number, amountMan: number): string {
    if (amountMan <= 0) return "—";
    const d = calcDeduction(years, false);
    const excess = amountMan - d;
    if (excess <= 0) return "0円";
    const taxableIncome = excess / 2;
    const incomeTax = calcIncomeTax(taxableIncome);
    const revivalTax = Math.floor(incomeTax * 0.021);
    const residentTax = Math.floor(taxableIncome * 10000 * 0.10);
    const totalTax = incomeTax + revivalTax + residentTax;
    return `約${fmtMan(totalTax / 10000)}万円`;
  }


  const faqItems = [
    { question: "退職金に税金がかからないケースはありますか？", answer: "退職金の額が退職所得控除額以下であれば税金はかかりません。例えば勤続10年で退職金400万円以下なら退職所得控除400万円が適用されるため所得税・住民税ともにゼロです。" },
    { question: "退職金の税金はいつ払うのですか？", answer: "会社が源泉徴収する場合は退職金受取時に自動的に差し引かれます。自分で確定申告する場合は翌年2〜3月の確定申告時に納税します。" },
    { question: "転職を繰り返した場合、退職金の税金はどうなりますか？", answer: "同一年に複数の退職金を受け取った場合や前回の受取から5年以内に再度受け取る場合は計算が複雑になります。前回の勤続期間と重複する場合は退職所得控除の調整が必要です。" },
    { question: "退職金を一時金と年金に分けて受け取ることはできますか？", answer: "企業によっては一時金と年金に分けて受け取れる制度があります。一時金は退職所得として有利な課税、年金は雑所得として総合課税されます。" },
    { question: "iDeCoの受取も退職金と同じ税率ですか？", answer: "iDeCoを一時金で受け取る場合は退職所得として退職所得控除が適用されます。同年に会社の退職金も受け取る場合は控除枠を共有するため、受取時期を5年以上ずらすことで控除を別々に使える場合があります。" }
  ];
  const useCases = [
    { icon: "🎌", persona: "定年退職が近い方", title: "退職金の手取り額を正確に把握したい", benefit: "退職所得控除後の実際の税額・手取りを計算" },
    { icon: "🔄", persona: "転職を繰り返した方", title: "複数の退職金受取で税金が複雑", benefit: "前回受取との期間重複を考慮した計算" },
    { icon: "💰", persona: "iDeCoも受け取る予定の方", title: "iDeCoと会社退職金の受取時期を最適化", benefit: "控除枠の共有を避ける5年ルールをシミュレーション" }
  ];
  return (
    <>
      <IntroSection title="退職金計算機" paragraphs={["退職金の手取り額を正確に計算。退職所得控除・所得税・住民税を自動算出し、一覧で確認できます。", "勤続年数・退職理由（自己都合・会社都合）・前回の退職金受取との関係も考慮。iDeCoの一時金受取との税金比較にも使えます。", "転職・定年退職・早期退職どのケースでも対応。登録不要・完全無料。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/career" className="hover:text-ai">転職・年収</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">退職金計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">退職金計算機（手取りシミュレーター）</h1>
          <p className="text-gray-600 text-sm">
            退職金額・勤続年数を入力するだけで、退職所得控除・所得税・住民税を自動計算。実際の手取り額を表示します。2026年最新税制対応。
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">登録不要</span>
            <span className="text-xs bg-gray-50 text-kon px-2 py-1 rounded-full font-medium">2026年最新税制</span>
            <span className="text-xs bg-gray-50 text-kon px-2 py-1 rounded-full font-medium">一般・役員・早期退職対応</span>
            <span className="text-xs bg-gray-50 text-kon px-2 py-1 rounded-full font-medium">手取り額まで計算</span>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Section 1 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
              <div className="bg-kon text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <h2 className="font-bold text-gray-800">基本情報</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>退職金の種類 <span className="text-danger">*</span></label>
                <select
                  value={form.retirementType}
                  onChange={(e) => handleChange("retirementType", e.target.value as RetirementType)}
                  className={selectClass}
                >
                  <option value="general">一般退職（会社員・従業員）</option>
                  <option value="officer">役員退職金</option>
                  <option value="early">早期退職優遇制度による退職</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>退職金の額 <span className="text-danger">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    placeholder="例: 1000"
                    className={inputClass + " max-w-[200px]"}
                  />
                  <span className="text-sm text-gray-500">万円</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>勤続年数 <span className="text-danger">*</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.yearsOfService}
                    onChange={(e) => handleChange("yearsOfService", e.target.value)}
                    placeholder="例: 20"
                    className={inputClass + " max-w-[140px]"}
                  />
                  <span className="text-sm text-gray-500">年</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">端数は切り捨て（例：10年3ヶ月 → 10年）</p>
              </div>

              <div>
                <label className={labelClass}>退職の種類</label>
                <select
                  value={form.resignationType}
                  onChange={(e) => handleChange("resignationType", e.target.value as ResignationType)}
                  className={selectClass}
                >
                  <option value="teinen">定年退職</option>
                  <option value="jiko">自己都合退職</option>
                  <option value="kaisha">会社都合退職（解雇・希望退職）</option>
                  <option value="shougai">障害による退職</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>障害者退職ですか？</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("isDisabled", true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.isDisabled ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    はい（控除+100万円）
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("isDisabled", false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!form.isDisabled ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    いいえ
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>前年以前に退職金を受け取りましたか？</label>
                <div className="flex gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => handleChange("hadPreviousRetirement", true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.hadPreviousRetirement ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    はい
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("hadPreviousRetirement", false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!form.hadPreviousRetirement ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    いいえ
                  </button>
                </div>
                {form.hadPreviousRetirement && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <p className="text-xs text-yellow-700 font-medium mb-2">
                      ⚠ 前回退職金との重複期間がある場合は退職所得控除の調整が必要です。正確な計算には税理士にご相談ください。
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 whitespace-nowrap">前回の勤続年数:</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={form.previousYears}
                        onChange={(e) => handleChange("previousYears", e.target.value)}
                        placeholder="例: 5"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                      />
                      <span className="text-xs text-gray-500">年</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
              <div className="bg-kon text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <h2 className="font-bold text-gray-800">税額計算用</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className={labelClass + " mb-0"}>他の所得はありますか？（同年）</label>
                  <span className="relative group">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs cursor-help">?</span>
                    <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-6 w-56 bg-gray-800 text-white text-xs rounded p-2 z-10 shadow-lg">
                      退職所得は分離課税のため、給与所得など他の所得と合算されません。税率への影響はありません。
                    </span>
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("otherIncome", true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.otherIncome ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    はい
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("otherIncome", false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!form.otherIncome ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai"}`}
                  >
                    いいえ
                  </button>
                </div>
                {form.otherIncome && (
                  <p className="text-xs text-kon mt-1">退職所得は分離課税のため、他の所得の税率には影響しません。</p>
                )}
              </div>

              <div>
                <label className={labelClass}>所得税の源泉徴収</label>
                <select
                  value={form.withholdingMethod}
                  onChange={(e) => handleChange("withholdingMethod", e.target.value as WithholdingMethod)}
                  className={selectClass}
                >
                  <option value="withhold">会社が源泉徴収する（一般的）</option>
                  <option value="self">自分で確定申告する</option>
                </select>
                {form.withholdingMethod === "self" && (
                  <p className="text-xs text-gray-500 mt-1">確定申告の場合は翌年2〜3月に納税します。税額は同じです。</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          {error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 bg-kon text-white py-3 rounded-lg font-bold text-base hover:bg-ai transition-colors shadow-sm"
            >
              計算する
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-lg font-medium text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mb-8">
            {result.isOfficerShortTerm && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <p className="text-kon font-bold text-sm">⚠ 役員退職金・勤続5年以下の特例</p>
                <p className="text-kon text-sm mt-1">役員で勤続5年以下の場合、退職所得の1/2課税が適用されません。課税退職所得 = 退職金 − 退職所得控除（1/2計算なし）</p>
              </div>
            )}
            {result.isShortTermSpecial && !result.isOfficerShortTerm && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-yellow-800 font-bold text-sm">📋 短期退職所得の特例（2022年改正）</p>
                <p className="text-yellow-700 text-sm mt-1">勤続5年以下の一般従業員は、退職所得控除超過分が300万円を超える部分については1/2計算が適用されません。</p>
              </div>
            )}

            {/* Result Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">退職所得控除額</p>
                <p className="text-xl font-bold text-gray-900">{fmtMan(result.deduction)}<span className="text-sm font-normal text-gray-500">万円</span></p>
                <p className="text-xs text-kon mt-0.5">勤続{form.yearsOfService}年の控除額</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">課税退職所得</p>
                <p className="text-xl font-bold text-gray-900">{fmtMan(result.taxableIncome)}<span className="text-sm font-normal text-gray-500">万円</span></p>
                <p className="text-xs text-gray-400 mt-0.5">{result.isOfficerShortTerm ? "(1/2計算なし)" : "(退職金−控除)×1/2"}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">所得税（復興税込）</p>
                <p className="text-xl font-bold text-gray-900">{fmtManRound(result.totalIncomeTax)}<span className="text-sm font-normal text-gray-500">万円</span></p>
                <p className="text-xs text-gray-400 mt-0.5">復興税 {fmtManRound(result.revivalTax)}万円含む</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">住民税</p>
                <p className="text-xl font-bold text-gray-900">{fmtManRound(result.residentTax)}<span className="text-sm font-normal text-gray-500">万円</span></p>
                <p className="text-xs text-gray-400 mt-0.5">課税退職所得×10%</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 mb-1">税金合計</p>
                <p className="text-xl font-bold text-gray-900">{fmtManRound(result.totalTax)}<span className="text-sm font-normal text-gray-500">万円</span></p>
                <p className="text-xs text-gray-400 mt-0.5">所得税+住民税</p>
              </div>
              <div className="bg-kon rounded-xl shadow-sm p-4">
                <p className="text-xs text-gin mb-1">手取り退職金</p>
                <p className="text-2xl font-bold text-white">約{fmtMan(result.netAmount)}万円</p>
                <p className="text-xs text-gin mt-0.5">実効税率 {result.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            {result.taxIsZero && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-800 font-bold text-sm">税金0円</p>
                <p className="text-green-700 text-sm mt-1">退職金が退職所得控除額以下のため、所得税・住民税ともにかかりません。</p>
              </div>
            )}

            {/* Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">計算内訳</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    { label: "退職金総額", value: `${fmtMan(parseFloat(form.amount) || 0)}万円`, highlight: false },
                    { label: "退職所得控除", value: `−${fmtMan(result.deduction)}万円`, highlight: false },
                    { label: result.isOfficerShortTerm ? "課税退職所得（1/2なし）" : "1/2課税後の退職所得", value: `${fmtMan(result.taxableIncome)}万円`, highlight: false },
                    { label: "所得税（復興税込）", value: `−${fmtManRound(result.totalIncomeTax)}万円`, highlight: false },
                    { label: "住民税", value: `−${fmtManRound(result.residentTax)}万円`, highlight: false },
                    { label: "手取り額", value: `約${fmtMan(result.netAmount)}万円`, highlight: true },
                  ].map((row, i) => (
                    <tr key={i} className={row.highlight ? "bg-gray-50" : ""}>
                      <td className={`py-2.5 px-3 ${row.highlight ? "font-bold text-kon" : "text-gray-600"}`}>{row.label}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${row.highlight ? "text-kon text-base" : "text-gray-800"}`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Reference Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">勤続年数別 退職所得控除額早見表</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">勤続年数</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">退職所得控除額</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        退職金{amountForTable > 0 ? `${fmtMan(amountForTable)}万円` : "入力値"}の税金目安
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {QUICK_TABLE.map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                        <td className="py-2 px-3 font-medium text-gray-700">{row.years}年</td>
                        <td className="py-2 px-3 text-gray-700">{fmt(row.deduction)}万円</td>
                        <td className="py-2 px-3 text-kon font-medium">{calcTaxForTable(row.years, amountForTable)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">退職金</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">勤続年数</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">退職所得控除</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">手取り目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["500万円", "10年", "400万円", "約495万円"],
                    ["1,000万円", "20年", "800万円", "約991万円"],
                    ["2,000万円", "25年", "1,150万円", "約1,936万円"],
                    ["3,000万円", "30年", "1,500万円", "約2,874万円"],
                    ["5,000万円", "35年", "1,850万円", "約4,622万円"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2 px-3 ${j === 3 ? "text-kon font-bold" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 基礎知識 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">退職金の税金の基礎知識</h2>
            <div className="space-y-5 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">退職所得は分離課税</h3>
                <p>退職金は「退職所得」として、他の所得と分離して課税される分離課税です。給与所得とは別に計算されるため、退職金が多くても他の所得の税率には影響しません。</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">退職所得控除の優遇</h3>
                <p>退職金には「退職所得控除」という大きな控除が認められています。</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                  <li>勤続20年以下：1年につき40万円（最低80万円）</li>
                  <li>勤続20年超：800万円 ＋ 超過年数×70万円</li>
                </ul>
                <p className="mt-2">さらに控除後の金額を1/2にしてから税率を適用するため、実質的な税負担は非常に軽くなっています。</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2022年税制改正（短期退職所得）</h3>
                <p>2022年から勤続5年以下の従業員の退職金は特例が変更されました。退職所得控除超過分が300万円を超える部分については1/2計算が適用されなくなりました。転職が増えた現代に合わせた改正です。</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">受け取り方による税額の違い</h3>
                <p>退職金を一時金で受け取る場合と、年金形式で受け取る場合で税金が異なります。</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                  <li>一時金：退職所得として分離課税（本ツールで計算）</li>
                  <li>年金形式：雑所得として総合課税（公的年金等控除が適用）</li>
                </ul>
                <p className="mt-2">どちらが有利かは個人の状況によって異なります。</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "退職金に税金がかからないケースはありますか？",
                  a: "はい、退職金の額が退職所得控除額以下であれば税金はかかりません。例えば勤続10年で退職金400万円以下なら退職所得控除400万円が適用されるため、所得税・住民税ともにゼロです。",
                },
                {
                  q: "退職金の税金はいつ払うのですか？",
                  a: "会社が源泉徴収する場合は退職金受取時に自動的に差し引かれます。自分で確定申告する場合は翌年2〜3月の確定申告時に納税します。多くの企業では源泉徴収されるため、手続きは会社が行います。",
                },
                {
                  q: "転職を繰り返した場合、退職金の税金はどうなりますか？",
                  a: "同一年に複数の退職金を受け取った場合や、前回の退職金受取から5年以内に再度受け取る場合は計算が複雑になります。前回の勤続期間と重複する場合は退職所得控除の調整が必要です。詳しくは税理士にご相談ください。",
                },
                {
                  q: "退職金を一時金と年金に分けて受け取ることはできますか？",
                  a: "企業によっては退職金を一時金と年金（企業年金）に分けて受け取れる制度があります。一時金は退職所得として有利な課税、年金は雑所得として総合課税されます。どちらが有利かは年金受給額・他の所得・加入年数によって異なります。",
                },
                {
                  q: "iDeCoの受取も退職金と同じ税率ですか？",
                  a: "iDeCo（個人型確定拠出年金）を一時金で受け取る場合は退職所得として扱われ、退職所得控除が適用されます。ただし同年に会社の退職金も受け取る場合は控除枠を共有するため注意が必要です。iDeCoの受取時期を退職金と5年以上ずらすことで控除を別々に使える場合があります。",
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    <span className="text-kon mr-2">Q.</span>{item.q}
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
                { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職後の手取り変化をシミュレーション" },
                { href: "/career/unemployment-calculator", label: "失業給付金計算機", desc: "給付日数・受給額を自動計算" },
                { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税額と手取りを自動計算" },
                { href: "/finance/retirement-simulator", label: "老後資金シミュレーター", desc: "老後に必要な資金を試算" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-ai hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-ai">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
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
