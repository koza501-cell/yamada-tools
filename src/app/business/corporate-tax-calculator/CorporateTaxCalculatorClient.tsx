"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type CapitalCategory = "under100" | "under1000" | "under1oku" | "over1oku";
type EmployeeCount = "under5" | "under50" | "under100" | "over100";
type CorpType = "normal" | "public" | "cooperative";
type Prefecture = "tokyo" | "osaka" | "kanagawa" | "other";

interface FormState {
  capitalCategory: CapitalCategory;
  employeeCount: EmployeeCount;
  corpType: CorpType;
  prefecture: Prefecture;
  taxableIncome: string;
  carryforwardLoss: string;
  rdCredit: string;
  hasWageIncrease: boolean;
  wageIncreaseAmount: string;
  taxRateType: "standard" | "excess";
}

interface TaxResult {
  pretaxIncome: number;
  carryforwardUsed: number;
  adjustedIncome: number;
  baseCorpTax: number;
  wageCredit: number;
  rdCreditUsed: number;
  corpTax: number;
  localCorpTax: number;
  residentVarTax: number;
  residentFixedTax: number;
  businessTax: number;
  specialBusinessTax: number;
  total: number;
  effectiveRate: number;
  afterTaxProfit: number;
  isSmall: boolean;
  isUnder3000: boolean;
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString() + "万円";
}

function fmtPct(v: number): string {
  return v.toFixed(1) + "%";
}

function isSmallCorp(cap: CapitalCategory): boolean {
  return cap !== "over1oku";
}

function isUnder3000(cap: CapitalCategory): boolean {
  return cap === "under100" || cap === "under1000";
}

function calcResidentFixed(cap: CapitalCategory, emp: EmployeeCount): number {
  const empOver50 = emp === "under100" || emp === "over100";
  if (cap === "under100" || cap === "under1000") {
    return empOver50 ? 14 : 7;
  }
  if (cap === "under1oku") {
    return empOver50 ? 29 : 18;
  }
  return empOver50 ? 121 : 41;
}

function calcBusinessTax(income: number, isSmall: boolean): number {
  if (!isSmall) {
    return income * 0.01;
  }
  const t1 = Math.min(income, 400) * 0.035;
  const t2 = Math.min(Math.max(0, income - 400), 400) * 0.053;
  const t3 = Math.max(0, income - 800) * 0.07;
  return t1 + t2 + t3;
}

function calcWageCredit(wageIncrease: number, pretaxIncome: number, isUnder3k: boolean): number {
  if (wageIncrease <= 0 || pretaxIncome <= 0) return 0;
  const wageRate = wageIncrease / pretaxIncome;
  if (isUnder3k) {
    if (wageRate >= 0.025) return wageIncrease * 0.30;
    if (wageRate >= 0.015) return wageIncrease * 0.15;
    return 0;
  } else {
    if (wageRate >= 0.04) return wageIncrease * 0.25;
    if (wageRate >= 0.03) return wageIncrease * 0.10;
    return 0;
  }
}

function calcTaxes(form: FormState): TaxResult {
  const pretaxIncome = parseFloat(form.taxableIncome) || 0;
  const carryforward = parseFloat(form.carryforwardLoss) || 0;
  const rdCreditInput = parseFloat(form.rdCredit) || 0;
  const wageIncrease = form.hasWageIncrease ? (parseFloat(form.wageIncreaseAmount) || 0) : 0;
  const small = isSmallCorp(form.capitalCategory);
  const under3k = isUnder3000(form.capitalCategory);

  const maxDeduction = small ? pretaxIncome : pretaxIncome * 0.5;
  const carryforwardUsed = Math.min(carryforward, maxDeduction, Math.max(0, pretaxIncome));
  const adjustedIncome = Math.max(0, pretaxIncome - carryforwardUsed);

  let baseCorpTax = 0;
  if (adjustedIncome > 0) {
    if (form.corpType === "cooperative") {
      baseCorpTax = adjustedIncome * 0.19;
    } else if (small) {
      baseCorpTax = Math.min(adjustedIncome, 800) * 0.15 + Math.max(0, adjustedIncome - 800) * 0.232;
    } else {
      baseCorpTax = adjustedIncome * 0.232;
    }
  }

  const wageCredit = Math.min(calcWageCredit(wageIncrease, pretaxIncome, under3k), baseCorpTax);
  const rdCreditUsed = Math.min(rdCreditInput, Math.max(0, baseCorpTax - wageCredit));
  const corpTax = Math.max(0, baseCorpTax - wageCredit - rdCreditUsed);
  const localCorpTax = corpTax * 0.103;

  const effectiveTaxRateType = form.prefecture === "tokyo" ? "excess" : form.taxRateType;
  const residentVarRate = effectiveTaxRateType === "excess" ? 0.207 : 0.173;
  const residentVarTax = corpTax * residentVarRate;
  const residentFixedTax = calcResidentFixed(form.capitalCategory, form.employeeCount);

  const businessTax = adjustedIncome > 0 ? calcBusinessTax(adjustedIncome, small) : 0;
  const specialBusinessTax = businessTax * 0.37;

  const total = corpTax + localCorpTax + residentVarTax + residentFixedTax + businessTax + specialBusinessTax;
  const effectiveRate = pretaxIncome > 0 ? (total / pretaxIncome) * 100 : 0;
  const afterTaxProfit = pretaxIncome - total;

  return {
    pretaxIncome, carryforwardUsed, adjustedIncome, baseCorpTax,
    wageCredit, rdCreditUsed, corpTax, localCorpTax,
    residentVarTax, residentFixedTax, businessTax, specialBusinessTax,
    total, effectiveRate, afterTaxProfit, isSmall: small, isUnder3000: under3k,
  };
}

const DEFAULT_FORM: FormState = {
  capitalCategory: "under1oku",
  employeeCount: "under50",
  corpType: "normal",
  prefecture: "tokyo",
  taxableIncome: "",
  carryforwardLoss: "0",
  rdCredit: "0",
  hasWageIncrease: false,
  wageIncreaseAmount: "",
  taxRateType: "standard",
};

export default function CorporateTaxCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<TaxResult | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    const income = parseFloat(form.taxableIncome);
    if (isNaN(income)) return;
    setResult(calcTaxes(form));
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionCls = "bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4";
  const effectiveTaxRateType = form.prefecture === "tokyo" ? "excess" : form.taxRateType;

  const faqItems = [
    { question: "法人税の申告・納付期限はいつですか？", answer: "法人税の申告・納付期限は事業年度終了後2ヶ月以内です。3月決算なら5月末が期限です。申告期限の延長申請で1ヶ月延長できます（納付は延長不可）。" },
    { question: "赤字の場合も法人税はかかりますか？", answer: "課税所得がゼロ以下の場合、法人税・事業税・法人税割はかかりません。ただし法人住民税の均等割（最低7万円/年）は赤字でも課税されます。赤字は翌年以降10年間繰り越せます。" },
    { question: "消費税と法人税は別々に計算しますか？", answer: "はい、消費税と法人税は別々に計算・申告します。消費税は預かり消費税から支払消費税を引いた差額を納付します。法人税は消費税を除いた所得に対して課税されます。" },
    { question: "法人税の節税で最も効果的な方法は何ですか？", answer: "代表的な節税方法は役員報酬の適正化、小規模企業共済・経営セーフティ共済の活用、賃上げ促進税制の活用、設備投資の即時償却・税額控除などです。" },
    { question: "法人税の実効税率は何%ですか？", answer: "中小法人の実効税率は課税所得800万円以下で約23〜25%、800万円超で約30〜35%です。個人の最高税率（55%）と比べると法人の税率が有利なケースが多いです。" },
  ];

  const useCases = [
    { icon: "🏢", persona: "中小企業の経営者・経理担当者", title: "今期の法人税納税額を事前把握したい", benefit: "課税所得から法人税等合計と実効税率を即計算" },
    { icon: "📊", persona: "個人事業主・法人化検討中の方", title: "法人税の実効税率を理解したい", benefit: "所得水準別の法人税率と個人との税率比較" },
    { icon: "💡", persona: "節税対策を考えている経営者", title: "合法的な節税の余地を確認したい", benefit: "軽減税率の恩恵額と主要な節税方法を確認" },
  ];


  return (
    <>
      <IntroSection title="法人税計算機" paragraphs={["課税所得を入力するだけで法人税・法人住民税・法人事業税を一括計算。中小法人の軽減税率（800万円以下）にも対応しています。", "地方税（都道府県・市区町村）の税率も反映した実効税率を自動算出。節税アドバイスと法人税申告の基礎知識も合わせて確認できます。", "登録不要・完全無料。決算期前の税額確認や法人化シミュレーションに最適です。"]} />
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">無料</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">登録不要</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">2026年最新対応</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">法人税 計算機</h1>
          <p className="text-emerald-100 text-sm sm:text-base">
            法人税・地方法人税・住民税・事業税を<strong className="text-white">一括計算</strong>。中小法人の軽減税率・賃上げ促進税制・繰越欠損金に対応。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            法人基本情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>資本金</label>
              <select className={inputCls} value={form.capitalCategory} onChange={(e) => setField("capitalCategory", e.target.value as CapitalCategory)}>
                <option value="under100">100万円以下</option>
                <option value="under1000">100万円超〜1,000万円以下</option>
                <option value="under1oku">1,000万円超〜1億円以下</option>
                <option value="over1oku">1億円超</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>従業員数</label>
              <select className={inputCls} value={form.employeeCount} onChange={(e) => setField("employeeCount", e.target.value as EmployeeCount)}>
                <option value="under5">5人以下</option>
                <option value="under50">6〜50人</option>
                <option value="under100">51〜100人</option>
                <option value="over100">101人以上</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>法人の種類</label>
              <select className={inputCls} value={form.corpType} onChange={(e) => setField("corpType", e.target.value as CorpType)}>
                <option value="normal">普通法人（株式会社・合同会社等）</option>
                <option value="public">公益法人等</option>
                <option value="cooperative">協同組合等</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>都道府県</label>
              <select className={inputCls} value={form.prefecture} onChange={(e) => setField("prefecture", e.target.value as Prefecture)}>
                <option value="tokyo">東京都</option>
                <option value="osaka">大阪府</option>
                <option value="kanagawa">神奈川県</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            当期の損益
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>
                当期の課税所得（税引前利益）
                <span title="決算書の税引前当期純利益に税務調整を加えた金額" className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs cursor-help">?</span>
              </label>
              <div className="relative">
                <input type="number" className={inputCls} placeholder="例: 1000" value={form.taxableIncome} onChange={(e) => setField("taxableIncome", e.target.value)} />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">マイナス（赤字）の場合は 0 を入力し、繰越欠損金として前期の赤字を入力してください</p>
            </div>
            <div>
              <label className={labelCls}>
                繰越欠損金（前期以前の赤字）
                <span title="前期以前の赤字で繰り越している金額。課税所得から控除できます" className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs cursor-help">?</span>
              </label>
              <div className="relative">
                <input type="number" className={inputCls} placeholder="0" value={form.carryforwardLoss} onChange={(e) => setField("carryforwardLoss", e.target.value)} />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>試験研究費税額控除</label>
              <div className="relative">
                <input type="number" className={inputCls} placeholder="0" value={form.rdCredit} onChange={(e) => setField("rdCredit", e.target.value)} />
                <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                賃上げ促進税制の適用
                <span title="2026年度：賃上げ額の最大35%を税額控除（中小企業）" className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs cursor-help">?</span>
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.hasWageIncrease} onChange={() => setField("hasWageIncrease", true)} className="text-emerald-600" />
                  <span className="text-sm">適用する</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!form.hasWageIncrease} onChange={() => setField("hasWageIncrease", false)} className="text-emerald-600" />
                  <span className="text-sm">適用しない</span>
                </label>
              </div>
            </div>
            {form.hasWageIncrease && (
              <div>
                <label className={labelCls}>賃上げ額（前年比増加分）</label>
                <div className="relative">
                  <input type="number" className={inputCls} placeholder="例: 50" value={form.wageIncreaseAmount} onChange={(e) => setField("wageIncreaseAmount", e.target.value)} />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">万円</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            地方税の設定
          </h2>
          <div>
            <label className={labelCls}>法人住民税の税率区分</label>
            {form.prefecture === "tokyo" ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mt-1">
                東京23区は自動的に<strong>超過税率（20.7%）</strong>を適用します
              </p>
            ) : (
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.taxRateType === "standard"} onChange={() => setField("taxRateType", "standard")} className="text-emerald-600" />
                  <span className="text-sm">標準税率（17.3%）</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.taxRateType === "excess"} onChange={() => setField("taxRateType", "excess")} className="text-emerald-600" />
                  <span className="text-sm">超過税率（20.7%）</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={handleCalculate} className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-sm mb-6">
          計算する
        </button>

        {result && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {result.isSmall ? (
                <p className="text-sm font-medium text-emerald-700">
                  ✅ <strong>中小法人（資本金1億円以下）</strong> — 軽減税率15%適用（課税所得800万円以下の部分）
                </p>
              ) : (
                <p className="text-sm font-medium text-kon">
                  ⚠️ <strong>大法人（資本金1億円超）</strong> — 一律23.2% ／ 外形標準課税適用
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-5">
              <h3 className="text-sm font-bold text-gray-600 mb-3">計算結果サマリー</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">課税所得</p>
                  <p className="text-xl font-bold text-gray-800">{fmt(result.adjustedIncome)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">法人税等合計</p>
                  <p className="text-xl font-bold text-emerald-700">{fmt(result.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">実効税率</p>
                  <p className="text-xl font-bold text-gray-800">{fmtPct(result.effectiveRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">税引後利益</p>
                  <p className="text-xl font-bold text-gray-800">{fmt(result.afterTaxProfit)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <h3 className="text-sm font-bold text-gray-800 px-5 py-3 border-b border-gray-100">税額内訳</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">税金の種類</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">課税標準</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">税率</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">税額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2.5 text-gray-700">法人税（国税）</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{fmt(result.adjustedIncome)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{result.isSmall ? "15% / 23.2%" : "23.2%"}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.corpTax)}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-700">地方法人税（国税）</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">法人税額</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">10.3%</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.localCorpTax)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-700">法人住民税 法人税割</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">法人税額</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{effectiveTaxRateType === "excess" ? "20.7%" : "17.3%"}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.residentVarTax)}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-700">法人住民税 均等割</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">—</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">—</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.residentFixedTax)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-700">法人事業税</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{fmt(result.adjustedIncome)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{result.isSmall ? "3.5〜7%" : "1.0%（簡易）"}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.businessTax)}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-700">特別法人事業税</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">事業税額</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">37%</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-800">{fmt(result.specialBusinessTax)}</td>
                    </tr>
                    {(result.wageCredit > 0 || result.rdCreditUsed > 0) && (
                      <tr>
                        <td className="px-4 py-2.5 text-emerald-700" colSpan={3}>税額控除（賃上げ・研究費）</td>
                        <td className="px-4 py-2.5 text-right font-medium text-emerald-700">-{fmt(result.wageCredit + result.rdCreditUsed)}</td>
                      </tr>
                    )}
                    <tr className="bg-emerald-50">
                      <td className="px-4 py-3 font-bold text-gray-900" colSpan={3}>法人税等合計</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700 text-base">{fmt(result.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-kon mb-3">💡 節税アドバイス</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {result.adjustedIncome > 800 && result.isSmall && (
                  <li className="flex items-start gap-2">
                    <span className="text-kon mt-0.5">▶</span>
                    <span>役員報酬の増額で課税所得を800万円以下に抑えると税率が15%になります（節税額の目安: 約<strong>{fmt(Math.round((result.adjustedIncome - 800) * (0.232 - 0.15)))}</strong>）</span>
                  </li>
                )}
                {!form.hasWageIncrease && (
                  <li className="flex items-start gap-2">
                    <span className="text-kon mt-0.5">▶</span>
                    <span>賃上げ促進税制を活用すると最大{result.isUnder3000 ? "35" : "25"}%の税額控除が受けられます（2026年度）</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-kon mt-0.5">▶</span>
                  <span>繰越欠損金がある場合は最大{result.isSmall ? "100%" : "50%"}（{result.isSmall ? "中小" : "大"}法人）控除できます（10年間繰越可能）</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">法人税等の実効税率早見表</h2>
          <p className="text-sm text-gray-600 mb-3">中小法人（資本金1億円以下）・東京都の場合</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">課税所得</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">法人税</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">住民税等</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">事業税等</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">合計</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">実効税率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { income: "200万円", corp: "30万円", resident: "13万円", biz: "7万円", total: "50万円", rate: "約25%" },
                  { income: "500万円", corp: "75万円", resident: "20万円", biz: "19万円", total: "114万円", rate: "約23%" },
                  { income: "800万円", corp: "120万円", resident: "29万円", biz: "33万円", total: "182万円", rate: "約23%" },
                  { income: "1,000万円", corp: "166万円", resident: "41万円", biz: "47万円", total: "254万円", rate: "約25%" },
                  { income: "2,000万円", corp: "398万円", resident: "90万円", biz: "112万円", total: "600万円", rate: "約30%" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{row.income}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{row.corp}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{row.resident}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{row.biz}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-800">{row.total}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-emerald-700">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">法人税の基礎知識</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>法人税は法人の所得（利益）に対して課税される国税です。法人には法人税のほかに地方法人税・法人住民税・法人事業税・特別法人事業税が課税されます。</p>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">中小法人の軽減税率</h3>
              <p>資本金1億円以下の中小法人は、所得800万円以下の部分に軽減税率<strong>15%</strong>が適用されます。800万円超の部分は23.2%です。この軽減税率の活用が中小企業の重要な節税ポイントです。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">実効税率とは</h3>
              <p>法人税・地方法人税・住民税・事業税を合計した実質的な税負担率です。中小法人の場合、課税所得800万円以下なら実効税率は約23〜25%です。個人の最高税率（所得税45%+住民税10%=55%）より大幅に低いため、高所得の個人事業主が法人化するメリットの一つです。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">賃上げ促進税制（2026年）</h3>
              <p>従業員の給与を前年比1.5%以上増加させた中小企業は賃上げ額の15〜35%を法人税から控除できます。積極的に活用することで大幅な節税が可能です。</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">繰越欠損金</h3>
              <p>赤字（欠損金）が発生した年度の損失は、翌年以降10年間繰り越せます。中小法人は繰越欠損金を課税所得の100%まで控除できます。</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: "法人税の申告・納付期限はいつですか？", a: "法人税の申告・納付期限は事業年度終了後2ヶ月以内です。例えば3月決算なら5月末が期限です。ただし申告期限の延長申請をすると1ヶ月延長できます（納付は延長不可）。中間申告は事業年度開始後6ヶ月経過後2ヶ月以内です。" },
              { q: "赤字の場合も法人税はかかりますか？", a: "課税所得がゼロ以下の場合、法人税・事業税・法人税割はかかりません。ただし法人住民税の均等割（最低7万円/年）は赤字でも課税されます。また赤字（欠損金）は翌年以降10年間繰り越せます。" },
              { q: "消費税と法人税は別々に計算しますか？", a: "はい、消費税と法人税は別々に計算・申告します。消費税は売上に含まれる預かり消費税から仕入れ等に含まれる支払消費税を引いた差額を納付します。法人税は消費税を除いた所得に対して課税されます。" },
              { q: "法人税の節税で最も効果的な方法は何ですか？", a: "代表的な節税方法は①役員報酬の適正化（所得分散効果）②小規模企業共済への加入③経営セーフティ共済の活用④賃上げ促進税制の活用⑤設備投資の即時償却・税額控除などです。合法的な節税は積極的に活用しましょう。" },
              { q: "法人税の実効税率は何%ですか？", a: "中小法人（資本金1億円以下）の実効税率は課税所得800万円以下で約23〜25%、800万円超で約30〜35%です。大法人は約35%前後です。個人の最高税率（55%）と比べると法人の税率が有利なケースが多いです。" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="font-medium text-gray-800 mb-1">Q. {item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/business/incorporation-simulator", title: "個人事業主 vs 法人化 比較ツール", desc: "法人化すべきかシミュレーション" },
              { href: "/business/director-salary-optimizer", title: "役員報酬 最適化シミュレーター", desc: "総税負担を最小化する役員報酬を計算" },
              { href: "/business/freelance-tax-calculator", title: "フリーランス税金計算機", desc: "個人事業の税金・社会保険料を計算" },
              { href: "/tax/consumption-tax", title: "消費税計算機", desc: "消費税額・税込/税抜を瞬時に計算" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                <p className="font-medium text-gray-800 text-sm">{tool.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
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
