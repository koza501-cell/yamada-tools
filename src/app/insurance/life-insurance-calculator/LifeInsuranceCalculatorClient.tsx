"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

interface FormState {
  age: string;
  hasSpouse: boolean;
  numChildren: string;
  youngestChildAge: string;
  annualIncome: string;
  savings: string;
  mortgage: string;
  spouseWorking: boolean;
}

interface CalcResult {
  survivorLiving: number;
  education: number;
  funeral: number;
  mortgage: number;
  pension: number;
  totalNeeds: number;
  totalDeductions: number;
  required: number;
  years: number;
}

const DEFAULT_FORM: FormState = {
  age: "",
  hasSpouse: false,
  numChildren: "0",
  youngestChildAge: "",
  annualIncome: "",
  savings: "",
  mortgage: "",
  spouseWorking: false,
};

function fmt(val: number): string {
  return val.toLocaleString();
}

function getAdvice(required: number): { text: string; color: string } {
  if (required < 1000) return { text: "比較的保障は少額で済みます", color: "text-green-300" };
  if (required < 3000) return { text: "一般的な保障額の範囲です", color: "text-gin" };
  if (required < 5000) return { text: "まとまった保障が必要です", color: "text-yellow-200" };
  return { text: "手厚い保障を検討してください", color: "text-gin" };
}

function calculate(form: FormState): CalcResult | null {
  const age = parseInt(form.age);
  const numChildren = parseInt(form.numChildren);
  const youngestChildAge = parseInt(form.youngestChildAge) || 0;
  const annualIncome = parseFloat(form.annualIncome) || 0;
  const savings = parseFloat(form.savings) || 0;
  const mortgage = parseFloat(form.mortgage) || 0;

  if (isNaN(age) || isNaN(annualIncome)) return null;

  let years: number;
  if (numChildren > 0 && form.youngestChildAge !== "") {
    years = Math.max(0, 18 - youngestChildAge);
  } else {
    years = 10;
  }

  const survivorLiving = annualIncome * 0.7 * years;
  const education = numChildren * 500;
  const funeral = 200;
  const pension = annualIncome * 0.3 * years;

  const totalNeeds = survivorLiving + education + funeral + mortgage;
  const totalDeductions = savings + pension;
  const required = Math.max(0, totalNeeds - totalDeductions);

  return {
    survivorLiving,
    education,
    funeral,
    mortgage,
    pension,
    totalNeeds,
    totalDeductions,
    required,
    years,
  };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "生命保険 必要保障額計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収・家族構成・貯蓄・住宅ローンから生命保険の必要保障額を無料で計算できるツールです。",
      "url": "https://yamada-tools.jp/insurance/life-insurance-calculator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "保険・税金計算", "item": "https://yamada-tools.jp/insurance" },
        { "@type": "ListItem", "position": 3, "name": "生命保険 必要保障額計算機", "item": "https://yamada-tools.jp/insurance/life-insurance-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "生命保険の必要保障額の平均はどのくらいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "日本では一般的に2,000万円〜4,000万円が目安とされています。子供の人数・年齢、住宅ローンの有無、貯蓄額によって大きく異なります。共働き家庭では1,000万円〜2,000万円程度で済む場合もあります。" }
        },
        {
          "@type": "Question",
          "name": "必要保障額はいつ見直すべきですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "結婚・出産・住宅購入・子供の独立・定年退職などライフイベントのタイミングで見直しましょう。一般的に5年ごとの定期的な見直しも推奨されています。" }
        },
        {
          "@type": "Question",
          "name": "遺族年金はどのくらいもらえますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "遺族基礎年金は子供がいる場合に支給され、年額約100万円前後です。遺族厚生年金は加入期間と収入により異なりますが、一般的に年収の20〜30%程度が目安です。" }
        },
        {
          "@type": "Question",
          "name": "住宅ローンがある場合、生命保険は必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "住宅ローンには通常「団体信用生命保険（団信）」が付帯しており、死亡時にローン残高が相殺されます。ただし団信でカバーされない場合や、ローン以外の生活費・教育費を考慮すると、別途生命保険が必要な場合があります。" }
        },
        {
          "@type": "Question",
          "name": "共働きの場合、必要保障額は少なくなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。配偶者が就労している場合、一方が亡くなっても収入が完全にゼロにはならないため、必要保障額は減少します。配偶者就労の有無を考慮した計算が可能です。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "生命保険の必要保障額の計算方法",
      "description": "年収・家族構成・貯蓄額から必要保障額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "年齢と家族構成を入力", "text": "年齢・配偶者の有無・子供の人数・末子の年齢を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "収入と資産を入力", "text": "年収・現在の貯蓄額・住宅ローン残高を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと必要保障額と内訳が表示されます。" }
      ]
    }
  ]
};

export default function LifeInsuranceCalculatorPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    if (!form.age || parseInt(form.age) < 20 || parseInt(form.age) > 70) {
      setError("年齢は20〜70の範囲で入力してください");
      return;
    }
    if (!form.annualIncome || parseFloat(form.annualIncome) <= 0) {
      setError("年収を入力してください");
      return;
    }
    if (form.savings === "") {
      setError("現在の貯蓄額を入力してください");
      return;
    }
    if (form.mortgage === "") {
      setError("住宅ローン残高を入力してください（なければ0）");
      return;
    }
    if (parseInt(form.numChildren) > 0 && !form.youngestChildAge) {
      setError("末子の年齢を入力してください");
      return;
    }
    const r = calculate(form);
    if (r) {
      setResult(r);
      setError("");
    }
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const numChildren = parseInt(form.numChildren) || 0;
  const advice = result ? getAdvice(result.required) : null;

  const faqItems = [
    { question: "生命保険の必要保障額はどう計算しますか？", answer: "必要保障額 = 遺族の生活費（末子独立まで） + 教育費 + 葬儀費用 + 住宅ローン残高 − 貯蓄 − 遺族年金受給額です。年収・家族構成・ローン残高を入力すると自動計算できます。" },
    { question: "子どもがいる場合、生命保険はいくら必要ですか？", answer: "子ども1人（0歳）・年収500万円・住宅ローンなしの場合、必要保障額は約3,000〜5,000万円が目安です。ただし配偶者の就労状況・遺族年金額・貯蓄によって大きく変わります。" },
    { question: "遺族年金はいくらもらえますか？", answer: "遺族基礎年金は子のある配偶者に年額約102万円＋子の加算。会社員の場合は遺族厚生年金も加わり、年収によって異なりますが月10〜20万円程度が受給できます。この金額を保険金で補う部分を試算します。" },
  ];

  const useCases = [
    { icon: "👨‍👩‍👦", persona: "子どもがいる・生命保険を検討中の方", title: "自分に必要な死亡保障額を正確に知りたい", benefit: "遺族の生活費・教育費・年金を考慮した必要額を計算" },
    { icon: "🏠", persona: "住宅ローンがある方", title: "ローン残高を考慮した適切な保障額を確認したい", benefit: "団体信用生命保険との兼ね合いを含めた保障額を算出" },
    { icon: "🔄", persona: "既存の生命保険を見直したい方", title: "現在の保険金額が多すぎ・少なすぎか確認したい", benefit: "必要保障額と現在の保険金額の過不足を可視化" },
  ];

  return (
    <>
      <IntroSection title="生命保険 必要保障額計算機" paragraphs={["万が一の際に遺族が生活を維持するために必要な生命保険の保障額を計算します。年収・家族構成・住宅ローン・貯蓄・遺族年金見込みを入力するだけで算出。", "子どもの教育費・遺族の生活費・葬儀費用などを加味した必要保障額と、現在の保険との過不足も確認できます。", "登録不要・完全無料。生命保険の見直しや新規加入を検討している方に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            生命保険 必要保障額計算機
          </h1>
          <p className="text-gray-600 text-sm">
            家族構成・年収・貯蓄・住宅ローンを入力して、万が一に必要な保険金額を診断します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              基本情報の入力
            </h2>

            <div className="space-y-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年齢 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={70}
                    value={form.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="例: 35"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">歳</span>
                </div>
              </div>

              {/* Has Spouse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配偶者あり？
                </label>
                <div className="flex gap-3">
                  {([{ label: "あり", value: true }, { label: "なし", value: false }] as const).map((opt) => (
                    <button type="button"
                      key={String(opt.value)}
                      onClick={() => handleChange("hasSpouse", opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.hasSpouse === opt.value
                          ? "bg-kon text-white border-kon"
                          : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spouse working */}
              {form.hasSpouse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    配偶者の就労状況
                  </label>
                  <div className="flex gap-3">
                    {([{ label: "就労中", value: true }, { label: "専業主婦/主夫", value: false }] as const).map((opt) => (
                      <button type="button"
                        key={String(opt.value)}
                        onClick={() => handleChange("spouseWorking", opt.value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.spouseWorking === opt.value
                            ? "bg-kon text-white border-kon"
                            : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of children */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  子供の人数
                </label>
                <select
                  value={form.numChildren}
                  onChange={(e) => handleChange("numChildren", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}人</option>
                  ))}
                </select>
              </div>

              {/* Youngest child age */}
              {numChildren > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    末子の年齢 <span className="text-danger">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={17}
                      value={form.youngestChildAge}
                      onChange={(e) => handleChange("youngestChildAge", e.target.value)}
                      placeholder="例: 5"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">歳</span>
                  </div>
                </div>
              )}

              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年収 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.annualIncome}
                    onChange={(e) => handleChange("annualIncome", e.target.value)}
                    placeholder="例: 500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                </div>
              </div>

              {/* Savings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  現在の貯蓄額 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.savings}
                    onChange={(e) => handleChange("savings", e.target.value)}
                    placeholder="例: 200"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                </div>
              </div>

              {/* Mortgage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住宅ローン残高 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.mortgage}
                    onChange={(e) => handleChange("mortgage", e.target.value)}
                    placeholder="なければ0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-danger text-sm bg-gray-50 rounded-lg px-3 py-2">{error}</p>
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
                  className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-semibold hover:bg-ai transition-colors shadow-sm"
                >
                  計算する
                </button>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                {/* Big result */}
                <div className="bg-kon rounded-xl p-6 text-white shadow-sm">
                  <p className="text-sm font-medium opacity-80 mb-1">必要保障額</p>
                  <p className="text-4xl font-bold mb-3">
                    {fmt(result.required)}<span className="text-2xl ml-1">万円</span>
                  </p>
                  <span className={`text-sm font-semibold bg-white/20 rounded-lg px-3 py-1.5 inline-block ${advice?.color}`}>
                    {advice?.text}
                  </span>
                  {numChildren > 0 && (
                    <p className="text-xs opacity-70 mt-3">
                      ※ 末子が18歳になるまでの年数: {result.years}年を使用
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">内訳</h3>

                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 text-gray-600">遺族生活費</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          {fmt(result.survivorLiving)} 万円
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">教育費</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          {fmt(result.education)} 万円
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">葬儀費用</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          {fmt(result.funeral)} 万円
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">住宅ローン残高</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          {fmt(result.mortgage)} 万円
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-2 text-kon font-medium">必要額 合計</td>
                        <td className="py-2 px-2 text-right font-bold text-kon">
                          {fmt(result.totalNeeds)} 万円
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">差し引き（控除額）</p>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 text-gray-600">現在の貯蓄額</td>
                          <td className="py-2 text-right font-medium text-green-700">
                            − {fmt(parseFloat(form.savings) || 0)} 万円
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">遺族年金（推定）</td>
                          <td className="py-2 text-right font-medium text-green-700">
                            − {fmt(result.pension)} 万円
                          </td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="py-2 px-2 text-green-700 font-medium">控除額 合計</td>
                          <td className="py-2 px-2 text-right font-bold text-green-700">
                            − {fmt(result.totalDeductions)} 万円
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 pt-3 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">必要保障額</span>
                      <span className="text-xl font-bold text-kon">
                        {fmt(result.required)} 万円
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 px-1">
                  ※ 本計算はあくまでも目安です。実際の保険設計は保険会社やFPにご相談ください。
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                    <th className="px-4 py-3 text-left font-semibold">年収</th>
                    <th className="px-4 py-3 text-left font-semibold">家族構成</th>
                    <th className="px-4 py-3 text-left font-semibold">貯蓄</th>
                    <th className="px-4 py-3 text-left font-semibold">必要保障額の目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">400万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子1人(5歳)</td>
                    <td className="px-4 py-3 text-gray-800">200万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約2,800万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">500万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子2人(5歳・8歳)</td>
                    <td className="px-4 py-3 text-gray-800">300万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約3,500万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">600万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者のみ</td>
                    <td className="px-4 py-3 text-gray-800">500万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約1,200万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">700万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子1人(10歳)</td>
                    <td className="px-4 py-3 text-gray-800">800万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約2,100万円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">800万円</td>
                    <td className="px-4 py-3 text-gray-800">配偶者+子3人</td>
                    <td className="px-4 py-3 text-gray-800">1,000万円</td>
                    <td className="px-4 py-3 font-semibold text-kon">約4,200万円</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 生命保険の必要保障額とは */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">生命保険の必要保障額とは</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              必要保障額とは、万が一の際に遺された家族が生活に困らないために必要な保険金額のことです。
              必要保障額は「遺族が必要とする金額」から「すでにある資産・公的保障」を差し引いて計算します。
            </p>
            <div>
              <p className="font-semibold text-gray-800 mb-2">主な構成要素：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">遺族生活費：</span>配偶者・子供が生活するために必要な費用</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">教育費：</span>子供一人あたり大学卒業まで約500万円</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">住宅ローン残高：</span>団体信用生命保険で相殺される場合もあります</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">葬儀費用：</span>平均約200万円</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">遺族年金：</span>国の公的保障として受け取れる年金</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">一般的な目安：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>子供が小さいほど必要保障額は大きくなります</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>共働き家庭は専業主婦(夫)家庭より少額で済む傾向があります</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>貯蓄が多いほど必要保障額は少なくなります</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "生命保険の必要保障額の平均はどのくらいですか？",
                a: "日本では一般的に2,000万円〜4,000万円が目安とされています。子供の人数・年齢、住宅ローンの有無、貯蓄額によって大きく異なります。共働き家庭では1,000万円〜2,000万円程度で済む場合もあります。"
              },
              {
                q: "必要保障額はいつ見直すべきですか？",
                a: "結婚・出産・住宅購入・子供の独立・定年退職などライフイベントのタイミングで見直しましょう。一般的に5年ごとの定期的な見直しも推奨されています。"
              },
              {
                q: "遺族年金はどのくらいもらえますか？",
                a: "遺族基礎年金は子供がいる場合に支給され、年額約100万円前後です。遺族厚生年金は加入期間と収入により異なりますが、一般的に年収の20〜30%程度が目安です。本ツールでは年収の30%を概算として使用しています。"
              },
              {
                q: "住宅ローンがある場合、生命保険は必要ですか？",
                a: "住宅ローンには通常「団体信用生命保険（団信）」が付帯しており、死亡時にローン残高が相殺されます。ただし団信でカバーされない場合や、ローン以外の生活費・教育費を考慮すると、別途生命保険が必要な場合があります。"
              },
              {
                q: "共働きの場合、必要保障額は少なくなりますか？",
                a: "はい。配偶者が就労している場合、一方が亡くなっても収入が完全にゼロにはならないため、必要保障額は減少します。本ツールでは配偶者就労の有無を考慮した計算が可能です。"
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
              { href: "/insurance/medical-insurance-sim", label: "医療保険 入院給付金シミュレーター", desc: "入院日数・手術から給付金を試算" },
              { href: "/finance/retirement-simulator", label: "老後資金シミュレーター", desc: "老後に必要な資金と不足額を計算" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税負担をシミュレーション" },
              { href: "/finance/ideco-nisa-comparison", label: "iDeCo・NISA 比較ツール", desc: "非課税制度の節税効果を比較" },
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
