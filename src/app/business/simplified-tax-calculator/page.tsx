"use client";
import { AdUnit } from "@/components/common/AdUnit";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// Inline SVG Icons
const Icons = {
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  Receipt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};

// Industry types with deemed purchase rates (みなし仕入率)
const INDUSTRY_TYPES = [
  { id: "1", name: "第1種事業（卸売業）", rate: 90, description: "商品を仕入れて他の事業者に販売" },
  { id: "2", name: "第2種事業（小売業）", rate: 80, description: "商品を仕入れて消費者に販売" },
  { id: "3", name: "第3種事業（製造業等）", rate: 70, description: "製造業、建設業、農林水産業など" },
  { id: "4", name: "第4種事業（その他）", rate: 60, description: "飲食業、金融保険業など" },
  { id: "5", name: "第5種事業（サービス業等）", rate: 50, description: "運輸通信業、サービス業など" },
  { id: "6", name: "第6種事業（不動産業）", rate: 40, description: "不動産業" },
];

// Example comparison results for GEO
const EXAMPLE_COMPARISONS = [
  { revenue: 500, purchases: 150, industry: "サービス業", standard: 35, simplified: 25, special20: 10, best: "2割特例" },
  { revenue: 800, purchases: 400, industry: "小売業", standard: 40, simplified: 16, special20: 16, best: "簡易課税" },
  { revenue: 1000, purchases: 300, industry: "サービス業", standard: 70, simplified: 50, special20: 20, best: "2割特例" },
  { revenue: 1500, purchases: 900, industry: "製造業", standard: 60, simplified: 45, special20: 30, best: "2割特例" },
  { revenue: 3000, purchases: 2000, industry: "卸売業", standard: 100, simplified: 30, special20: 60, best: "簡易課税" },
];

interface CalculationInputs {
  annualRevenue: number;
  taxablePurchases: number;
  industryType: string;
  invoiceStatus: "exempt" | "registered" | "special20eligible";
}

interface CalculationResults {
  standardTax: number;
  simplifiedTax: number;
  special20Tax: number;
  bestMethod: "standard" | "simplified" | "special20" | "exempt";
  savings: number;
  deemedPurchaseRate: number;
  actualPurchaseRate: number;
}

export default function SimplifiedTaxCalculatorPage() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    annualRevenue: 500,
    taxablePurchases: 150,
    industryType: "5",
    invoiceStatus: "special20eligible",
  });
  const [mascotState, setMascotState] = useState<MascotState>("welcome");

  const [results, setResults] = useState<CalculationResults | null>(null);

  const selectedIndustry = useMemo(() => {
    return INDUSTRY_TYPES.find((i) => i.id === inputs.industryType) || INDUSTRY_TYPES[4];
  }, [inputs.industryType]);

  const handleCalculate = () => {
    try {
      const revenueYen = inputs.annualRevenue * 10000;
      const purchasesYen = inputs.taxablePurchases * 10000;
      const deemedRate = selectedIndustry.rate;

      // 売上消費税 (10%)
      const salesTax = Math.floor(revenueYen * 0.1);
      
      // 仕入消費税 (実際)
      const purchaseTax = Math.floor(purchasesYen * 0.1);

      // 本則課税: 売上消費税 - 仕入消費税
      const standardTax = Math.max(0, salesTax - purchaseTax);

      // 簡易課税: 売上消費税 × (1 - みなし仕入率)
      const simplifiedTax = Math.floor(salesTax * (1 - deemedRate / 100));

      // 2割特例: 売上消費税 × 20%
      const special20Tax = Math.floor(salesTax * 0.2);

      // 実際の仕入率
      const actualPurchaseRate = revenueYen > 0 ? (purchasesYen / revenueYen) * 100 : 0;

      // 最も有利な方式を判定
      let bestMethod: CalculationResults["bestMethod"] = "standard";
      let lowestTax = standardTax;

      if (inputs.invoiceStatus === "exempt") {
        bestMethod = "exempt";
        lowestTax = 0;
      } else {
        if (simplifiedTax < lowestTax && inputs.annualRevenue * 10000 <= 50000000) {
          bestMethod = "simplified";
          lowestTax = simplifiedTax;
        }
        if (inputs.invoiceStatus === "special20eligible" && special20Tax < lowestTax) {
          bestMethod = "special20";
          lowestTax = special20Tax;
        }
      }

      // 節税額（最も不利な方式との差）
      const maxTax = Math.max(standardTax, simplifiedTax, special20Tax);
      const savings = maxTax - lowestTax;

      setResults({
        standardTax,
        simplifiedTax,
        special20Tax,
        bestMethod,
        savings,
        deemedPurchaseRate: deemedRate,
        actualPurchaseRate,
      });
    setMascotState("success");
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.round(value));
  };

  const formatManYen = (value: number) => {
    return new Intl.NumberFormat("ja-JP").format(Math.round(value / 10000));
  };

  const faqItems = [
    { question: "簡易課税と本則課税、どちらが有利ですか？", answer: "実際の仕入率がみなし仕入率より低い場合は簡易課税が有利、高い場合は本則課税が有利です。例えばサービス業（みなし仕入率50%）で実際の仕入率が30%なら簡易課税が有利。設備投資が多い年は本則課税で還付を受けられる場合もあります。" },
    { question: "2割特例とは何ですか？いつまで使えますか？", answer: "2割特例は、インボイス制度開始に伴い免税事業者から課税事業者になった方向けの経過措置です。売上消費税の2割のみを納付すればよく、2026年9月30日を含む課税期間まで適用できます。届出不要で確定申告時に選択可能です。" },
    { question: "簡易課税を選択する条件は何ですか？", answer: "簡易課税を選択するには、基準期間（2年前）の課税売上高が5,000万円以下であること、適用を受けようとする課税期間の開始日の前日までに届出書を提出することが必要です。一度選択すると2年間は変更できません。" },
    { question: "みなし仕入率は業種によってどう違いますか？", answer: "第1種（卸売業）90%、第2種（小売業）80%、第3種（製造業等）70%、第4種（飲食業等）60%、第5種（サービス業等）50%、第6種（不動産業）40%です。複数の事業を営む場合は、売上割合に応じた加重平均か、主たる事業の区分を適用します。" },
    { question: "インボイス登録すべきか判断する基準は？", answer: "取引先が法人や課税事業者中心なら登録を検討すべきです。登録しないと取引先が仕入税額控除できず、取引継続に影響する可能性があります。個人消費者向けビジネスなら登録しなくても影響は少ないでしょう。2割特例を活用すれば、登録後も消費税負担を抑えられます。" },
  ];

  const useCases = [
    { icon: "🧾", persona: "インボイス登録した個人事業主", title: "簡易課税と本則課税どちらが有利か判断したい", benefit: "売上・業種から3方式の納税額を一括比較" },
    { icon: "⏰", persona: "2割特例の期限が迫っている方", title: "2割特例終了後にどの方式に切り替えるべきか", benefit: "2026年10月以降の最適な課税方式を確認" },
    { icon: "🏪", persona: "飲食・小売などの事業者", title: "みなし仕入率が自社に有利か確認したい", benefit: "業種別みなし仕入率と実際の仕入率を比較" },
  ];


  return (
    <>
      <IntroSection title="消費税 簡易課税・判定ツール" paragraphs={["消費税の課税方式（本則課税・簡易課税・2割特例）を比較し、どれが最も有利かを自動判定します。業種・売上・仕入率を入力するだけで納税額の差額を計算。", "2023年インボイス制度開始後の2割特例（2026年9月まで）にも対応。適用条件と期限も確認できます。", "登録不要・完全無料。消費税の確定申告を控えた個人事業主・法人に最適なツールです。"]} />
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/business" className="hover:text-blue-600">ビジネス・法人</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">消費税 簡易課税 判定</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <div className="w-8 h-8 text-orange-600"><Icons.Receipt /></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">消費税 簡易課税 判定・比較ツール</h1>
              <p className="text-gray-600">2026年最新税制対応</p>
            </div>
          </div>
          <p className="text-gray-700">
            本則課税・簡易課税・2割特例の3パターンを同時比較。業種別みなし仕入率に対応し、
            最も有利な課税方式を自動判定します。インボイス登録の影響も計算可能。
          </p>
        </div>

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Section 1: Revenue */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600"><Icons.TrendingUp /></span>
              売上・仕入情報
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年間売上（税抜）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.annualRevenue}
                    onChange={(e) => setInputs({ ...inputs, annualRevenue: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  課税仕入（税抜）
                  <span className="ml-1 text-gray-400 text-xs">※消費税がかかる経費</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.taxablePurchases}
                    onChange={(e) => setInputs({ ...inputs, taxablePurchases: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  仕入、外注費、広告費、通信費、消耗品費など
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Industry & Invoice Status */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600"><Icons.Calculator /></span>
              業種・インボイス状況
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業種区分
                </label>
                <select
                  value={inputs.industryType}
                  onChange={(e) => setInputs({ ...inputs, industryType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {INDUSTRY_TYPES.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}（みなし仕入率 {industry.rate}%）
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{selectedIndustry.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  インボイス登録状況
                </label>
                <select
                  value={inputs.invoiceStatus}
                  onChange={(e) => setInputs({ ...inputs, invoiceStatus: e.target.value as CalculationInputs["invoiceStatus"] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exempt">未登録（免税事業者）</option>
                  <option value="registered">登録済み（通常課税）</option>
                  <option value="special20eligible">登録済み（2割特例適用可）</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  2割特例は2026年9月30日を含む課税期間まで
                </p>
              </div>
            </div>
          </div>

          {/* Info Card: Deemed Purchase Rate */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 flex-shrink-0 mt-0.5"><Icons.Info /></span>
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">みなし仕入率について</p>
                <p className="text-blue-700">
                  簡易課税では、業種ごとに定められた「みなし仕入率」を使って消費税を計算します。
                  現在選択中: <span className="font-bold">{selectedIndustry.name}</span> = みなし仕入率 <span className="font-bold">{selectedIndustry.rate}%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Icons.Calculator /> 比較する
            </button>
            {results && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
              >
                リセット
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Best Method Highlight */}
            {results.bestMethod !== "exempt" && (
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Star />
                  <span className="text-emerald-100">最も有利な課税方式</span>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {results.bestMethod === "standard" && "本則課税"}
                  {results.bestMethod === "simplified" && "簡易課税"}
                  {results.bestMethod === "special20" && "2割特例"}
                </p>
                <p className="text-emerald-100">
                  この方式を選択すると、年間 <span className="text-white font-bold">{formatCurrency(results.savings)}円</span> の節税になります
                </p>
              </div>
            )}

            {results.bestMethod === "exempt" && (
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.CheckCircle />
                  <span className="text-gray-600">現在の状況</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">免税事業者</p>
                <p className="text-gray-600">消費税の申告・納付は不要です</p>
              </div>
            )}

            {/* 3-Way Comparison Table */}
            {results.bestMethod !== "exempt" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">課税方式の比較</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* 本則課税 */}
                  <div className={`rounded-xl p-4 border-2 ${results.bestMethod === "standard" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50"}`}>
                    {results.bestMethod === "standard" && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium mb-2">
                        <Icons.Star /> おすすめ
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 mb-1">本則課税</h4>
                    <p className="text-xs text-gray-500 mb-3">実際の仕入税額を控除</p>
                    <p className={`text-2xl font-bold ${results.bestMethod === "standard" ? "text-emerald-600" : "text-gray-900"}`}>
                      {formatManYen(results.standardTax)}万円
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      仕入率: {results.actualPurchaseRate.toFixed(1)}%
                    </p>
                  </div>

                  {/* 簡易課税 */}
                  <div className={`rounded-xl p-4 border-2 ${results.bestMethod === "simplified" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50"}`}>
                    {results.bestMethod === "simplified" && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium mb-2">
                        <Icons.Star /> おすすめ
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 mb-1">簡易課税</h4>
                    <p className="text-xs text-gray-500 mb-3">みなし仕入率で計算</p>
                    <p className={`text-2xl font-bold ${results.bestMethod === "simplified" ? "text-emerald-600" : "text-gray-900"}`}>
                      {formatManYen(results.simplifiedTax)}万円
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      みなし仕入率: {results.deemedPurchaseRate}%
                    </p>
                    {inputs.annualRevenue * 10000 > 50000000 && (
                      <p className="text-xs text-red-500 mt-1">※売上5,000万円超は適用不可</p>
                    )}
                  </div>

                  {/* 2割特例 */}
                  <div className={`rounded-xl p-4 border-2 ${results.bestMethod === "special20" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50"} ${inputs.invoiceStatus !== "special20eligible" ? "opacity-50" : ""}`}>
                    {results.bestMethod === "special20" && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium mb-2">
                        <Icons.Star /> おすすめ
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 mb-1">2割特例</h4>
                    <p className="text-xs text-gray-500 mb-3">売上税額の20%のみ</p>
                    <p className={`text-2xl font-bold ${results.bestMethod === "special20" ? "text-emerald-600" : "text-gray-900"}`}>
                      {formatManYen(results.special20Tax)}万円
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      一律20%納付
                    </p>
                    {inputs.invoiceStatus !== "special20eligible" && (
                      <p className="text-xs text-amber-600 mt-1">※適用要件を確認</p>
                    )}
                  </div>
                </div>

                {/* Comparison Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">計算の内訳</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-600">項目</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">金額</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 px-3">売上消費税（税抜売上 × 10%）</td>
                          <td className="text-right py-2 px-3">{formatCurrency(inputs.annualRevenue * 10000 * 0.1)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3">仕入消費税（実際）</td>
                          <td className="text-right py-2 px-3">{formatCurrency(inputs.taxablePurchases * 10000 * 0.1)}円</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3">仕入消費税（みなし：売上×{results.deemedPurchaseRate}%×10%）</td>
                          <td className="text-right py-2 px-3">{formatCurrency(inputs.annualRevenue * 10000 * (results.deemedPurchaseRate / 100) * 0.1)}円</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Advice Cards */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 flex-shrink-0"><Icons.AlertCircle /></span>
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">選択時の注意点</h3>
                  <ul className="text-amber-700 text-sm space-y-2">
                    <li>• <strong>簡易課税</strong>: 適用開始年度の前日までに届出が必要。一度選択すると2年間は変更不可。</li>
                    <li>• <strong>2割特例</strong>: 届出不要。確定申告時に選択可能。2026年9月30日を含む課税期間まで。</li>
                    <li>• <strong>本則課税</strong>: 設備投資が多い年は還付を受けられる場合あり。</li>
                    <li>• 複数の事業を営む場合は、売上割合に応じたみなし仕入率の計算が必要です。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Invoice Registration Impact */}
            {inputs.invoiceStatus === "exempt" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3">インボイス登録した場合の影響</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 mb-1">本則課税を選択</p>
                    <p className="text-xl font-bold text-gray-900">{formatManYen(results.standardTax)}万円/年</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 mb-1">簡易課税を選択</p>
                    <p className="text-xl font-bold text-gray-900">{formatManYen(results.simplifiedTax)}万円/年</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 mb-1">2割特例を適用</p>
                    <p className="text-xl font-bold text-emerald-600">{formatManYen(results.special20Tax)}万円/年</p>
                    <p className="text-xs text-emerald-600">最も負担が軽い</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Comparison Table (for GEO) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">業種・売上別の比較例（参考）</h2>
          <p className="text-gray-600 text-sm mb-4">※2割特例適用可能な場合の比較</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-medium text-gray-600">売上</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">仕入</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">業種</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">本則</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">簡易</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">2割特例</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-600">有利</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {EXAMPLE_COMPARISONS.map((row, index) => (
                  <tr key={index}>
                    <td className="py-3 px-3">{row.revenue}万円</td>
                    <td className="py-3 px-3">{row.purchases}万円</td>
                    <td className="py-3 px-3">{row.industry}</td>
                    <td className="text-right py-3 px-3">{row.standard}万円</td>
                    <td className="text-right py-3 px-3">{row.simplified}万円</td>
                    <td className="text-right py-3 px-3">{row.special20}万円</td>
                    <td className="text-center py-3 px-3">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        {row.best}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanatory Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">消費税の課税方式について</h2>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">3つの課税方式の違い</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">本則課税</h4>
                  <p className="text-sm text-blue-700">
                    売上にかかる消費税から、実際に支払った仕入消費税を差し引いて納付額を計算。
                    設備投資が多い年は還付の可能性も。
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">簡易課税</h4>
                  <p className="text-sm text-purple-700">
                    業種ごとの「みなし仕入率」で計算。経理が簡単で、仕入が少ない業種ほど有利。
                    売上5,000万円以下が条件。
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 mb-2">2割特例</h4>
                  <p className="text-sm text-emerald-700">
                    売上消費税の20%のみを納付。インボイス制度で課税事業者になった方向けの経過措置。
                    届出不要で最も簡単。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">業種別みなし仕入率一覧</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 font-medium text-gray-600 border-b">区分</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 border-b">業種</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-600 border-b">みなし仕入率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {INDUSTRY_TYPES.map((industry) => (
                      <tr key={industry.id}>
                        <td className="py-2 px-3 font-medium">{industry.name.split("（")[0]}</td>
                        <td className="py-2 px-3">{industry.description}</td>
                        <td className="text-center py-2 px-3 font-bold text-blue-600">{industry.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="space-y-4">
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">簡易課税と本則課税、どちらが有利？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                実際の仕入率がみなし仕入率より低い場合は簡易課税が有利、高い場合は本則課税が有利です。
                例えばサービス業（みなし仕入率50%）で実際の仕入率が30%なら簡易課税が有利です。
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">2割特例はいつまで使えますか？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                2026年9月30日を含む課税期間まで適用できます。届出不要で確定申告時に選択可能です。
                インボイス制度で免税事業者から課税事業者になった方が対象です。
              </div>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium text-gray-900">簡易課税を選択する条件は？</span>
                <Icons.ChevronDown />
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                基準期間（2年前）の課税売上高が5,000万円以下であること、適用開始年度の前日までに届出書を提出することが必要です。
                一度選択すると2年間は変更できません。
              </div>
            </details>
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/business/freelance-tax-calculator"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-emerald-600"><Icons.Users /></span>
              <div>
                <h3 className="font-medium text-gray-900">フリーランス税金計算機</h3>
                <p className="text-sm text-gray-500">所得税・住民税・国保を計算</p>
              </div>
              <span className="text-gray-400 ml-auto"><Icons.ArrowRight /></span>
            </Link>
            <Link
              href="/business/incorporation-simulator"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-blue-600"><Icons.Building /></span>
              <div>
                <h3 className="font-medium text-gray-900">個人事業主 vs 法人化</h3>
                <p className="text-sm text-gray-500">どちらがお得か比較</p>
              </div>
              <span className="text-gray-400 ml-auto"><Icons.ArrowRight /></span>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 mt-8 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5"><Icons.Info /></span>
            <span>
              本ツールは概算計算です。実際の税額は取引内容により異なります。
              正確な計算については税理士にご相談ください。
            </span>
          </p>
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
