"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface CalcResult {
  salaryCut: number;
  salaryIncome: number;
  basicDeduction: number;
  socialInsuranceDeduction: number;
  spouseDeduction: number;
  dependentDeduction: number;
  lifeInsuranceDeduction: number;
  earthquakeDeduction: number;
  disabilityDeduction: number;
  singleParentDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTaxBase: number;
  incomeTax: number;
  residentTaxableIncome: number;
  residentTax: number;
  takeHome: number;
  effectiveRate: number;
}

const LIFE_OPTIONS = [
  { label: "なし", value: 0 },
  { label: "2万円", value: 2 },
  { label: "4万円", value: 4 },
  { label: "8万円（上限）", value: 8 },
];

const EARTHQUAKE_OPTIONS = [
  { label: "なし", value: 0 },
  { label: "2.5万円（上限）", value: 2.5 },
];

function calcEmploymentDeduction(salary: number): number {
  if (salary <= 162.5) return 55;
  if (salary <= 180) return salary * 0.4 - 10;
  if (salary <= 360) return salary * 0.3 + 8;
  if (salary <= 660) return salary * 0.2 + 44;
  if (salary <= 850) return salary * 0.1 + 110;
  return 195;
}

function calcIncomeTaxBase(taxable: number): number {
  if (taxable <= 195) return taxable * 0.05;
  if (taxable <= 330) return taxable * 0.1 - 9.75;
  if (taxable <= 695) return taxable * 0.2 - 42.75;
  if (taxable <= 900) return taxable * 0.23 - 63.6;
  if (taxable <= 1800) return taxable * 0.33 - 153.6;
  if (taxable <= 4000) return taxable * 0.4 - 279.6;
  return taxable * 0.45 - 479.6;
}

function fmt1(val: number): string {
  return val.toFixed(1);
}

function calculate(
  salary: number,
  hasSpouse: boolean,
  spouseIncome: number,
  dependents: number,
  socialInsAuto: boolean,
  socialInsManual: number,
  lifeIns: number,
  earthquakeIns: number,
  disability: boolean,
  singleParent: boolean
): CalcResult {
  const salaryCut = calcEmploymentDeduction(salary);
  const salaryIncome = Math.max(0, salary - salaryCut);

  const basicDeduction = salary <= 2400 ? 48 : 0;
  const socialInsuranceDeduction = socialInsAuto ? salary * 0.1497 : socialInsManual;
  const spouseDeduction =
    !hasSpouse ? 0 : spouseIncome <= 103 ? 38 : spouseIncome <= 201 ? 26 : 0;
  const dependentDeduction = 38 * dependents;
  const lifeInsuranceDeduction = lifeIns;
  const earthquakeDeduction = earthquakeIns;
  const disabilityDeduction = disability ? 27 : 0;
  const singleParentDeduction = singleParent ? 35 : 0;

  const totalDeductions =
    basicDeduction +
    socialInsuranceDeduction +
    spouseDeduction +
    dependentDeduction +
    lifeInsuranceDeduction +
    earthquakeDeduction +
    disabilityDeduction +
    singleParentDeduction;

  const taxableIncome = Math.max(0, salaryIncome - totalDeductions);

  const incomeTaxBase = Math.max(0, calcIncomeTaxBase(taxableIncome));
  const incomeTax = incomeTaxBase * 1.021;

  const residentBasic = 43;
  const residentTotalDeductions = totalDeductions - basicDeduction + residentBasic;
  const residentTaxableIncome = Math.max(0, salaryIncome - residentTotalDeductions);
  const residentTax = Math.max(0, residentTaxableIncome * 0.1 - 0.25);

  const takeHome = salary - socialInsuranceDeduction - incomeTax - residentTax;
  const effectiveRate = salary > 0 ? ((incomeTax + residentTax) / salary) * 100 : 0;

  return {
    salaryCut,
    salaryIncome,
    basicDeduction,
    socialInsuranceDeduction,
    spouseDeduction,
    dependentDeduction,
    lifeInsuranceDeduction,
    earthquakeDeduction,
    disabilityDeduction,
    singleParentDeduction,
    totalDeductions,
    taxableIncome,
    incomeTaxBase,
    incomeTax,
    residentTaxableIncome,
    residentTax,
    takeHome,
    effectiveRate,
  };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "所得税・住民税 計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収・家族構成・各種控除から所得税・住民税・手取り額を無料で計算できるツールです。2024年度税制対応。",
      "url": "https://yamada-tools.jp/tax/income-tax-calculator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "所得税・住民税 計算機", "item": "https://yamada-tools.jp/tax/income-tax-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "所得税と住民税の違いは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "所得税は国に納める税金で累進課税（5%〜45%）です。住民税は都道府県・市区町村に納める地方税で所得に対して一律10%です。住民税は前年の収入に対して翌年6月から課税される点が異なります。" }
        },
        {
          "@type": "Question",
          "name": "年収103万円・130万円・150万円の壁とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "103万円の壁は所得税の非課税ライン（給与所得控除55万+基礎控除48万）です。130万円の壁は社会保険の扶養から外れるラインです。150万円の壁は配偶者特別控除が満額受けられる上限です。" }
        },
        {
          "@type": "Question",
          "name": "ふるさと納税をすると税金はどう変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "ふるさと納税の寄附金額から2,000円を引いた額が、所得税の還付と住民税の控除として戻ってきます。実質2,000円の自己負担で返礼品がもらえるお得な制度です。" }
        },
        {
          "@type": "Question",
          "name": "副業収入がある場合、税金はどう計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "副業収入は「雑所得」として給与所得に合算して確定申告します。副業所得が年間20万円を超える場合は確定申告が必要です。本ツールは給与収入のみの計算となります。" }
        },
        {
          "@type": "Question",
          "name": "年末調整と確定申告の違いは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "年末調整は会社が従業員に代わって行う税金の精算手続きです。確定申告は自分で税務署に申告する手続きで、副業収入がある方・医療費控除を受けたい方などは確定申告が必要です。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "所得税・住民税の計算方法",
      "description": "年収と家族構成から所得税・住民税・手取り額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "給与収入を入力", "text": "年収（給与収入）を万円単位で入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "家族構成・控除を入力", "text": "配偶者の有無・扶養人数・各種控除を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと所得税・住民税・手取り額が表示されます。" }
      ]
    }
  ]
};

export default function IncomeTaxCalculatorPage() {
  const [salary, setSalary] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState("");
  const [dependents, setDependents] = useState(0);
  const [socialInsAuto, setSocialInsAuto] = useState(true);
  const [socialInsManual, setSocialInsManual] = useState("");
  const [lifeIns, setLifeIns] = useState(0);
  const [earthquakeIns, setEarthquakeIns] = useState(0);
  const [disability, setDisability] = useState(false);
  const [singleParent, setSingleParent] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  function handleCalculate() {
    const s = parseFloat(salary);
    if (isNaN(s) || s <= 0) return;
    const si = parseFloat(spouseIncome) || 0;
    const sm = parseFloat(socialInsManual) || 0;
    setResult(
      calculate(s, hasSpouse, si, dependents, socialInsAuto, sm, lifeIns, earthquakeIns, disability, singleParent)
    );
  }

  function handleReset() {
    setSalary("");
    setHasSpouse(false);
    setSpouseIncome("");
    setDependents(0);
    setSocialInsAuto(true);
    setSocialInsManual("");
    setLifeIns(0);
    setEarthquakeIns(0);
    setDisability(false);
    setSingleParent(false);
    setResult(null);
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  const faqItems = [
    { question: "年収500万円の所得税・住民税はいくらですか？", answer: "独身・各種控除なしの場合、所得税約157,500円、住民税約284,000円（合計約44万円）です。社会保険料を含めた手取りは約395万円が目安です。" },
    { question: "配偶者控除はどれくらい節税になりますか？", answer: "配偶者の年収が103万円以下の場合、配偶者控除38万円が適用され、所得税が約5.7万〜19万円（税率15〜50%の場合）節税になります。住民税も約3.8万円の節税効果があります。" },
    { question: "所得税と住民税の計算方法はどう違いますか？", answer: "所得税は5%〜45%の累進課税。住民税は所得割10%（一律）＋均等割5,000円（自治体により異なる）の構造です。所得税は当年分をその年に納付、住民税は前年所得を翌年6月から納付します。" },
  ];

  const useCases = [
    { icon: "💴", persona: "自分の手取り額を知りたい会社員", title: "年収から税金・社会保険料を差し引いた手取りを確認", benefit: "年収別の実質手取り額を正確に計算" },
    { icon: "👨‍👩‍👧", persona: "家族がいる方・各種控除を活用したい方", title: "配偶者控除・扶養控除でいくら節税できるか", benefit: "控除適用前後の税額差を一目で比較" },
    { icon: "📋", persona: "確定申告・年末調整の準備をしている方", title: "申告前に税額の概算を把握したい", benefit: "主要控除を入力した概算税額を事前確認" },
  ];

  return (
    <>
      <IntroSection title="所得税・住民税計算機" paragraphs={["年収・家族構成・各種控除を入力すると所得税・住民税・社会保険料を一括計算。手取り額の目安も確認できます。", "配偶者控除・扶養控除・医療費控除・住宅ローン控除など主要な控除に対応。2026年税制改正（基礎控除58万円引き上げ）にも対応しています。", "登録不要・完全無料。給与所得者の確定申告前の税額確認や、年収交渉の参考数値の把握に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">所得税・住民税 計算機</h1>
          <p className="text-gin text-sm md:text-base">
            年収・家族構成・各種控除から所得税・住民税・手取り額を自動計算（2024年度税制）
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2">入力項目</h2>

            {/* 給与収入 */}
            <div>
              <label className={labelClass}>給与収入（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：500"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                min="0"
              />
            </div>

            {/* 配偶者 */}
            <div>
              <label className={labelClass}>配偶者あり？</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(!hasSpouse)} onClick={() => setHasSpouse(false)}>
                  なし
                </button>
                <button type="button" className={toggleClass(hasSpouse)} onClick={() => setHasSpouse(true)}>
                  あり
                </button>
              </div>
            </div>

            {hasSpouse && (
              <div>
                <label className={labelClass}>配偶者の年収（万円）</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="例：103"
                  value={spouseIncome}
                  onChange={(e) => setSpouseIncome(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  103万以下→控除38万、201万以下→26万、超→0
                </p>
              </div>
            )}

            {/* 扶養親族 */}
            <div>
              <label className={labelClass}>扶養親族の人数</label>
              <select
                className={inputClass}
                value={dependents}
                onChange={(e) => setDependents(parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}人
                  </option>
                ))}
              </select>
            </div>

            {/* 社会保険料 */}
            <div>
              <label className={labelClass}>社会保険料</label>
              <div className="flex gap-2 mb-2">
                <button type="button"
                  className={toggleClass(socialInsAuto)}
                  onClick={() => setSocialInsAuto(true)}
                >
                  自動計算（14.97%）
                </button>
                <button type="button"
                  className={toggleClass(!socialInsAuto)}
                  onClick={() => setSocialInsAuto(false)}
                >
                  手入力
                </button>
              </div>
              {!socialInsAuto && (
                <input
                  type="number"
                  className={inputClass}
                  placeholder="例：74.85"
                  value={socialInsManual}
                  onChange={(e) => setSocialInsManual(e.target.value)}
                  min="0"
                />
              )}
            </div>

            {/* 生命保険料控除 */}
            <div>
              <label className={labelClass}>生命保険料控除</label>
              <select
                className={inputClass}
                value={lifeIns}
                onChange={(e) => setLifeIns(parseFloat(e.target.value))}
              >
                {LIFE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 地震保険料控除 */}
            <div>
              <label className={labelClass}>地震保険料控除</label>
              <select
                className={inputClass}
                value={earthquakeIns}
                onChange={(e) => setEarthquakeIns(parseFloat(e.target.value))}
              >
                {EARTHQUAKE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 障害者控除 */}
            <div>
              <label className={labelClass}>障害者控除（27万円）</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(!disability)} onClick={() => setDisability(false)}>
                  なし
                </button>
                <button type="button" className={toggleClass(disability)} onClick={() => setDisability(true)}>
                  あり
                </button>
              </div>
            </div>

            {/* 寡婦・ひとり親控除 */}
            <div>
              <label className={labelClass}>寡婦・ひとり親控除（35万円）</label>
              <div className="flex gap-2">
                <button type="button"
                  className={toggleClass(!singleParent)}
                  onClick={() => setSingleParent(false)}
                >
                  なし
                </button>
                <button type="button"
                  className={toggleClass(singleParent)}
                  onClick={() => setSingleParent(true)}
                >
                  あり
                </button>
              </div>
            </div>

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

          {/* Result Panel */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">所得税</p>
                    <p className="text-xl font-bold text-kon">
                      {fmt1(result.incomeTax)}
                      <span className="text-sm font-normal ml-1">万円</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">住民税</p>
                    <p className="text-xl font-bold text-indigo-700">
                      {fmt1(result.residentTax)}
                      <span className="text-sm font-normal ml-1">万円</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 col-span-2 bg-gray-50">
                    <p className="text-xs text-kon mb-1">手取り概算</p>
                    <p className="text-2xl font-bold text-kon">
                      {fmt1(result.takeHome)}
                      <span className="text-sm font-normal ml-1">万円</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">実効税率（所得税＋住民税）</p>
                    <p className="text-xl font-bold text-gray-700">
                      {result.effectiveRate.toFixed(1)}
                      <span className="text-sm font-normal ml-1">%</span>
                    </p>
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">計算内訳</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">給与収入</td>
                        <td className="py-1.5 text-right font-medium">
                          {fmt1(parseFloat(salary))} 万円
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600">給与所得控除</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.salaryCut)} 万円
                        </td>
                      </tr>
                      <tr className="border-b font-semibold">
                        <td className="py-1.5">給与所得</td>
                        <td className="py-1.5 text-right">{fmt1(result.salaryIncome)} 万円</td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600 pl-3">基礎控除</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.basicDeduction)} 万円
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600 pl-3">社会保険料控除</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.socialInsuranceDeduction)} 万円
                        </td>
                      </tr>
                      {result.spouseDeduction > 0 && (
                        <tr className="border-b bg-gray-50">
                          <td className="py-1.5 text-gray-600 pl-3">配偶者控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.spouseDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      {result.dependentDeduction > 0 && (
                        <tr className="border-b">
                          <td className="py-1.5 text-gray-600 pl-3">扶養控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.dependentDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      {result.lifeInsuranceDeduction > 0 && (
                        <tr className="border-b bg-gray-50">
                          <td className="py-1.5 text-gray-600 pl-3">生命保険料控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.lifeInsuranceDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      {result.earthquakeDeduction > 0 && (
                        <tr className="border-b">
                          <td className="py-1.5 text-gray-600 pl-3">地震保険料控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.earthquakeDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      {result.disabilityDeduction > 0 && (
                        <tr className="border-b bg-gray-50">
                          <td className="py-1.5 text-gray-600 pl-3">障害者控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.disabilityDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      {result.singleParentDeduction > 0 && (
                        <tr className="border-b">
                          <td className="py-1.5 text-gray-600 pl-3">寡婦・ひとり親控除</td>
                          <td className="py-1.5 text-right text-danger">
                            − {fmt1(result.singleParentDeduction)} 万円
                          </td>
                        </tr>
                      )}
                      <tr className="border-b bg-gray-50 font-semibold">
                        <td className="py-1.5 pl-3">所得控除合計</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.totalDeductions)} 万円
                        </td>
                      </tr>
                      <tr className="border-b font-bold">
                        <td className="py-1.5">課税所得（所得税）</td>
                        <td className="py-1.5 text-right">{fmt1(result.taxableIncome)} 万円</td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600">所得税（基本）</td>
                        <td className="py-1.5 text-right">{fmt1(result.incomeTaxBase)} 万円</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">復興特別所得税（×1.021）</td>
                        <td className="py-1.5 text-right font-semibold text-kon">
                          {fmt1(result.incomeTax)} 万円
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-50 font-bold">
                        <td className="py-1.5">課税所得（住民税）</td>
                        <td className="py-1.5 text-right">
                          {fmt1(result.residentTaxableIncome)} 万円
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-gray-600">住民税（10%）</td>
                        <td className="py-1.5 text-right font-semibold text-indigo-700">
                          {fmt1(result.residentTax)} 万円
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">🧮</p>
                <p className="text-sm">給与収入を入力して「計算する」を押してください</p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 leading-relaxed">
              ※2024年度税制に基づく概算です。正確な金額は税理士にご相談ください。
            </p>
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
                    <th className="px-4 py-3 text-left font-semibold">年収</th>
                    <th className="px-4 py-3 text-left font-semibold">家族構成</th>
                    <th className="px-4 py-3 text-left font-semibold">所得税目安</th>
                    <th className="px-4 py-3 text-left font-semibold">住民税目安</th>
                    <th className="px-4 py-3 text-left font-semibold">手取り目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">300万円</td>
                    <td className="px-4 py-3 text-gray-800">独身</td>
                    <td className="px-4 py-3 text-gray-800">約5万円</td>
                    <td className="px-4 py-3 text-gray-800">約9万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約236万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">400万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者あり</td>
                    <td className="px-4 py-3 text-gray-800">約6万円</td>
                    <td className="px-4 py-3 text-gray-800">約13万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約317万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">500万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子1人</td>
                    <td className="px-4 py-3 text-gray-800">約10万円</td>
                    <td className="px-4 py-3 text-gray-800">約18万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約392万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">600万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子2人</td>
                    <td className="px-4 py-3 text-gray-800">約15万円</td>
                    <td className="px-4 py-3 text-gray-800">約23万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約472万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">800万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子2人</td>
                    <td className="px-4 py-3 text-gray-800">約40万円</td>
                    <td className="px-4 py-3 text-gray-800">約40万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約600万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 所得税・住民税の計算方法 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">所得税・住民税の計算方法</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              所得税と住民税は、年収から各種控除を差し引いた「課税所得」に税率をかけて計算します。
            </p>
            <div>
              <p className="font-semibold text-gray-800 mb-2">所得税の計算ステップ：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>給与収入から給与所得控除を差し引いて「給与所得」を求める</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>基礎控除・社会保険料控除・扶養控除などを差し引いて「課税所得」を求める</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>課税所得に累進税率（5%〜45%）を適用して所得税額を計算する</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>復興特別所得税（所得税×2.1%）を加算する</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">住民税の計算ステップ：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>所得税と同様に課税所得を計算（基礎控除額が43万円と異なる）</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>課税所得に一律10%（都道府県4%+市区町村6%）を乗じる</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>調整控除を差し引いて最終税額を算出する</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">手取り額の目安：</p>
              <p>手取り = 給与収入 - 社会保険料 - 所得税 - 住民税<br />
              一般的に年収の75〜80%程度が手取りの目安です。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "所得税と住民税の違いは何ですか？",
                a: "所得税は国に納める税金で累進課税（5%〜45%）です。住民税は都道府県・市区町村に納める地方税で、所得に対して一律10%です。所得税はその年の収入に対して同年に課税されますが、住民税は前年の収入に対して翌年6月から課税される点が異なります。"
              },
              {
                q: "年収103万円・130万円・150万円の壁とは何ですか？",
                a: "103万円の壁は所得税の非課税ライン（給与所得控除55万+基礎控除48万）です。130万円の壁は社会保険の扶養から外れるラインです。150万円の壁は配偶者特別控除が満額（38万円）受けられる上限です。それぞれ超えると税負担や保険料が発生します。"
              },
              {
                q: "ふるさと納税をすると税金はどう変わりますか？",
                a: "ふるさと納税の寄附金額から2,000円を引いた額が、所得税の還付と住民税の控除として戻ってきます。実質2,000円の自己負担で返礼品がもらえるお得な制度です。控除上限額は年収・家族構成によって異なります。"
              },
              {
                q: "副業収入がある場合、税金はどう計算しますか？",
                a: "副業収入は「雑所得」として給与所得に合算して確定申告します。副業所得が年間20万円を超える場合は確定申告が必要です。本ツールは給与収入のみの計算となります。"
              },
              {
                q: "年末調整と確定申告の違いは何ですか？",
                a: "年末調整は会社が従業員に代わって行う税金の精算手続きです。確定申告は自分で税務署に申告する手続きで、副業収入がある方・医療費控除を受けたい方・住宅ローン控除初年度の方などは確定申告が必要です。"
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
              { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "年収・家族構成から控除上限額を計算" },
              { href: "/tax/consumption-tax", label: "消費税計算機", desc: "税込・税抜の一括変換と明細計算" },
              { href: "/finance/retirement-simulator", label: "老後資金シミュレーター", desc: "老後に必要な資金と不足額を計算" },
              { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機", desc: "年収・家族構成から必要な保険金額を診断" },
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
