"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";
import RelatedTools from "@/components/finance/RelatedTools";

// ============================================
// Constants
// ============================================
const TAX_RATE = 0.20315; // 20.315% (所得税15.315% + 住民税5%)
const NISA_LIMIT = 18_000_000; // 生涯非課税限度額

// iDeCo 年間上限額（職業別）
const IDECO_LIMITS: Record<string, number> = {
  "自営業・フリーランス": 816000,
  "会社員（企業年金なし）": 276000,
  "会社員（企業年金あり）": 144000,
  "公務員": 144000,
  "専業主婦・主夫": 0,
};

// 所得税率（簡易計算用）
const getIncomeTaxRate = (income: number): number => {
  if (income <= 1950000) return 0.05;
  if (income <= 3300000) return 0.10;
  if (income <= 6950000) return 0.20;
  if (income <= 9000000) return 0.23;
  if (income <= 18000000) return 0.33;
  if (income <= 40000000) return 0.40;
  return 0.45;
};

// 住民税率（固定）
const RESIDENT_TAX_RATE = 0.10;

// ============================================
// Types
// ============================================
interface SimulationResult {
  // iDeCo
  idecoAnnualTaxSaving: number;
  ideco10YearTaxSaving: number;
  idecoFinalValue: number;
  idecoTotalPrincipal: number;
  idecoProfit: number;
  // NISA
  nisaFinalValue: number;
  nisaTotalPrincipal: number;
  nisaProfit: number;
  nisaTaxSaved: number;
  // 併用
  combinedFinalValue: number;
  combinedTaxSaved: number;
  // 比較
  recommended: "ideco" | "nisa" | "both";
  recommendationReason: string;
}

interface YearlyData {
  year: number;
  idecoValue: number;
  nisaValue: number;
  combinedValue: number;
}

// ============================================
// Helper Functions
// ============================================
function fmt(val: number): string {
  return val.toLocaleString("ja-JP");
}

function fmtMan(val: number): string {
  return (val / 10000).toFixed(1) + "万円";
}

function calculateSimulation(
  annualIncome: number,
  occupation: string,
  monthlyBudget: number,
  idecoAmount: number,
  nisaAmount: number,
  years: number,
  returnRate: number
): SimulationResult {
  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;

  // iDeCo上限
  const idecoMax = IDECO_LIMITS[occupation] || 0;
  const actualIdecoAmount = Math.min(idecoAmount, idecoMax / 12);

  // 所得税率
  const incomeTaxRate = getIncomeTaxRate(annualIncome);
  const totalTaxRate = incomeTaxRate + RESIDENT_TAX_RATE;

  // ===== iDeCo計算 =====
  const idecoAnnualContribution = actualIdecoAmount * 12;
  const idecoAnnualTaxSaving = Math.round(idecoAnnualContribution * totalTaxRate);
  const ideco10YearTaxSaving = idecoAnnualTaxSaving * 10;

  let idecoValue = 0;
  let idecoPrincipal = 0;
  for (let m = 0; m < months; m++) {
    idecoValue = idecoValue * (1 + monthlyRate) + actualIdecoAmount;
    idecoPrincipal += actualIdecoAmount;
  }
  // 受取時課税（簡易的に控除後の税率で計算）
  const idecoTaxAtWithdrawal = Math.max(0, (idecoValue - idecoPrincipal) * 0.05);
  const idecoFinalValue = Math.round(idecoValue - idecoTaxAtWithdrawal);

  // ===== NISA計算 =====
  let nisaValue = 0;
  let nisaPrincipal = 0;
  for (let m = 0; m < months; m++) {
    nisaValue = nisaValue * (1 + monthlyRate) + nisaAmount;
    nisaPrincipal += nisaAmount;
  }
  const nisaProfit = nisaValue - nisaPrincipal;
  const nisaTaxSaved = Math.round(nisaProfit * TAX_RATE);
  const nisaFinalValue = Math.round(nisaValue);

  // ===== 併用計算 =====
  const combinedFinalValue = idecoFinalValue + nisaFinalValue;
  const combinedTaxSaved = ideco10YearTaxSaving + nisaTaxSaved;

  // ===== おすすめ診断 =====
  let recommended: "ideco" | "nisa" | "both" = "both";
  let recommendationReason = "";

  if (actualIdecoAmount === 0) {
    recommended = "nisa";
    recommendationReason = "iDeCoの掛金上限が0円のため、NISAでの投資をおすすめします。";
  } else if (incomeTaxRate >= 0.20) {
    recommended = "both";
    recommendationReason = `あなたの所得税率は${(incomeTaxRate * 100).toFixed(0)}%と高めです。iDeCoの掛金控除とNISAの運用益非課税を併用することで、最大限の節税効果が期待できます。`;
  } else if (idecoAnnualTaxSaving > nisaTaxSaved) {
    recommended = "ideco";
    recommendationReason = "iDeCoの節税効果がNISAを上回っています。まずはiDeCoを最大限活用することをおすすめします。";
  } else {
    recommended = "nisa";
    recommendationReason = "NISAの運用益非課税の方が節税効果が高い見込みです。長期的な資産形成にはNISAが適しています。";
  }

  return {
    idecoAnnualTaxSaving,
    ideco10YearTaxSaving,
    idecoFinalValue: Math.round(idecoFinalValue),
    idecoTotalPrincipal: Math.round(idecoPrincipal),
    idecoProfit: Math.round(idecoFinalValue - idecoPrincipal),
    nisaFinalValue,
    nisaTotalPrincipal: Math.round(nisaPrincipal),
    nisaProfit: Math.round(nisaProfit),
    nisaTaxSaved,
    combinedFinalValue,
    combinedTaxSaved,
    recommended,
    recommendationReason,
  };
}

function generateYearlyData(
  idecoMonthly: number,
  nisaMonthly: number,
  years: number,
  returnRate: number
): YearlyData[] {
  const monthlyRate = returnRate / 100 / 12;
  const data: YearlyData[] = [];

  let idecoValue = 0;
  let nisaValue = 0;

  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      data.push({ year: 0, idecoValue: 0, nisaValue: 0, combinedValue: 0 });
    } else {
      for (let m = 0; m < 12; m++) {
        idecoValue = idecoValue * (1 + monthlyRate) + idecoMonthly;
        nisaValue = nisaValue * (1 + monthlyRate) + nisaMonthly;
      }
      data.push({
        year,
        idecoValue: Math.round(idecoValue / 10000),
        nisaValue: Math.round(nisaValue / 10000),
        combinedValue: Math.round((idecoValue + nisaValue) / 10000),
      });
    }
  }
  return data;
}

// ============================================
// Components
// ============================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-bold text-gray-700 mb-2">{label}年後</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="mb-1">
            <span style={{ color: p.color }} className="font-semibold">{p.name}: </span>
            <span>{p.value}万円</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// Main Component
// ============================================
export default function IdecoNisaComparisonClient() {
  // Input states
  const [annualIncome, setAnnualIncome] = useState(5000000);
  const [occupation, setOccupation] = useState("会社員（企業年金なし）");
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [idecoAmount, setIdecoAmount] = useState(23000);
  const [nisaAmount, setNisaAmount] = useState(27000);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(5);
  const [sliderIdecoAmount, setSliderIdecoAmount] = useState(23000);

  // UI states
  const [activeTab, setActiveTab] = useState<"input" | "result">("input");
  const [seoOpen, setSeoOpen] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Calculations
  const idecoMax = IDECO_LIMITS[occupation] || 0;
  const idecoMaxMonthly = Math.floor(idecoMax / 12);

  const result = useMemo(() => {
    return calculateSimulation(
      annualIncome,
      occupation,
      monthlyBudget,
      idecoAmount,
      nisaAmount,
      years,
      returnRate
    );
  }, [annualIncome, occupation, monthlyBudget, idecoAmount, nisaAmount, years, returnRate]);

  const sliderResult = useMemo(() => {
    return calculateSimulation(
      annualIncome,
      occupation,
      monthlyBudget,
      sliderIdecoAmount,
      monthlyBudget - sliderIdecoAmount,
      years,
      returnRate
    );
  }, [annualIncome, occupation, monthlyBudget, sliderIdecoAmount, years, returnRate]);

  const chartData = useMemo(() => {
    return generateYearlyData(idecoAmount, nisaAmount, years, returnRate);
  }, [idecoAmount, nisaAmount, years, returnRate]);

  // Handlers
  const handleBudgetChange = (newBudget: number) => {
    setMonthlyBudget(newBudget);
    // Auto-adjust iDeCo and NISA allocation
    const maxIdeco = Math.min(idecoMaxMonthly, newBudget);
    setIdecoAmount(maxIdeco);
    setNisaAmount(newBudget - maxIdeco);
    setSliderIdecoAmount(maxIdeco);
  };

  const handleIdecoChange = (newIdeco: number) => {
    const clampedIdeco = Math.min(newIdeco, idecoMaxMonthly, monthlyBudget);
    setIdecoAmount(clampedIdeco);
    setNisaAmount(monthlyBudget - clampedIdeco);
  };

  const handleCopy = useCallback(() => {
    const text = [
      "【iDeCo vs NISA 比較結果】",
      `年収: ${fmt(annualIncome)}円`,
      `職業: ${occupation}`,
      `運用期間: ${years}年`,
      `想定利回り: ${returnRate}%`,
      "",
      "【iDeCo】",
      `・月額掛金: ${fmt(idecoAmount)}円`,
      `・年間節税額: ${fmt(result.idecoAnnualTaxSaving)}円`,
      `・10年節税累計: ${fmt(result.ideco10YearTaxSaving)}円`,
      `・最終評価額: ${fmtMan(result.idecoFinalValue)}`,
      "",
      "【NISA】",
      `・月額投資: ${fmt(nisaAmount)}円`,
      `・最終評価額: ${fmtMan(result.nisaFinalValue)}`,
      `・運用益非課税: ${fmtMan(result.nisaTaxSaved)}`,
      "",
      `【おすすめ】${result.recommended === "ideco" ? "iDeCo優先" : result.recommended === "nisa" ? "NISA優先" : "併用推奨"}`,
      `詳細: https://yamada-tools.jp/tools/ideco-nisa-comparison`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => alert("コピーしました！"));
  }, [result, annualIncome, occupation, years, returnRate, idecoAmount, nisaAmount]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = "ideco-nisa-comparison.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("画像の保存に失敗しました。");
    }
  }, []);

  // SEO content
  const seoContent = [
    {
      title: "iDeCoとNISAの最大の違いとは",
      content: "iDeCoは掛けたお金が所得控除される「掛金控除」が最大のメリット。NISAは運用益が非課税になるのが特徴。iDeCoは原則60歳まで引き出せませんが、NISAはいつでも売却可能です。iDeCo NISA どっちを先に始めるべきかは、年収と資金の使いやすさで決まります。",
    },
    {
      title: "iDeCoの節税効果はいくら？年収別シミュレーション",
      content: "iDeCo 節税 いくら 年収400万 500万 600万で比較すると、年収400万円で約5万円、500万円で約8万円、600万円で約11万円の年間節税効果があります。所得税率が高いほどiDeCoの節税効果は大きくなります。",
    },
    {
      title: "iDeCo NISA 年収別 どちらがお得 比較",
      content: "iDeCo NISA 年収別 どちらがお得かは、年収500万円を境に変わります。年収500万円以上の会社員はiDeCoの節税効果が大きく、年収400万円以下や専業主婦の方はNISAの柔軟性が有利です。",
    },
    {
      title: "会社員 iDeCo NISA 毎月 配分 おすすめ",
      content: "会社員の場合、毎月の投資予算が5万円ならiDeCoに2.3万円（上限）＋NISAに2.7万円の配分がおすすめです。iDeCoで節税しつつ、NISAで柔軟性を確保できます。予算が3万円以下ならiDeCoのみに集中するのが効率的です。",
    },
    {
      title: "iDeCo NISA 併用 シミュレーション 30年後",
      content: "iDeCo NISA 併用 シミュレーション 30年後を見ると、年収500万円で毎月5万円ずつ投資した場合、iDeCo単独よりも併用の方が最終手取りが多くなるケースがほとんどです。iDeCoの節税効果とNISAの運用益非課税を両立させることで、資産形成を最大化できます。",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">iDeCo vs NISA 徹底比較ツール</h1>
          </div>
          <p className="text-indigo-100 text-sm md:text-base">
            あなたの年収・職業に合わせて節税額・最終手取り・最適配分を自動計算
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "input"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            ① 情報入力
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "result"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            ② 結果比較
          </button>
        </div>

        {/* SECTION 1: Input Form */}
        {activeTab === "input" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">1</span>
              基本情報入力
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年収（万円）
                </label>
                <select
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={3000000}>300万円</option>
                  <option value={4000000}>400万円</option>
                  <option value={5000000}>500万円</option>
                  <option value={6000000}>600万円</option>
                  <option value={7000000}>700万円</option>
                  <option value={8000000}>800万円</option>
                  <option value={10000000}>1000万円</option>
                  <option value={12000000}>1200万円</option>
                  <option value={15000000}>1500万円</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  職業・加入状況
                </label>
                <select
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                    const newMax = Math.floor((IDECO_LIMITS[e.target.value] || 0) / 12);
                    const newIdeco = Math.min(newMax, monthlyBudget);
                    setIdecoAmount(newIdeco);
                    setNisaAmount(monthlyBudget - newIdeco);
                    setSliderIdecoAmount(newIdeco);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {Object.keys(IDECO_LIMITS).map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  iDeCo上限: 月{fmt(idecoMaxMonthly)}円（年{fmt(idecoMax)}円）
                </p>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                毎月の投資予算: <span className="text-indigo-600 font-bold">{fmt(monthlyBudget)}円</span>
              </label>
              <input
                type="range"
                min={10000}
                max={300000}
                step={5000}
                value={monthlyBudget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1万円</span>
                <span>30万円</span>
              </div>
            </div>

            {/* Allocation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  iDeCo月額掛金（上限 {fmt(idecoMaxMonthly)}円）
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                  <input
                    type="number"
                    min={0}
                    max={idecoMaxMonthly}
                    step={1000}
                    value={idecoAmount}
                    onChange={(e) => handleIdecoChange(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.min(idecoMaxMonthly, monthlyBudget)}
                  step={1000}
                  value={idecoAmount}
                  onChange={(e) => handleIdecoChange(Number(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NISA月額投資（残り {fmt(monthlyBudget - idecoAmount)}円）
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                  <input
                    type="number"
                    min={0}
                    max={monthlyBudget}
                    step={1000}
                    value={nisaAmount}
                    readOnly
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ※予算からiDeCo分を差し引いた残りがNISA投資額になります
                </p>
              </div>
            </div>

            {/* Years & Return Rate */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  運用期間: <span className="text-indigo-600 font-bold">{years}年</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5年</span>
                  <span>40年</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  想定利回り: <span className="text-indigo-600 font-bold">{returnRate}%</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("result")}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              結果を見る →
            </button>

            {/* Ad Slot 1: After input section */}
            <div className="adsense-slot my-6" data-ad-slot="auto"></div>
          </section>
        )}

        {/* SECTION 2: Recommendation */}
        {activeTab === "result" && (
          <>
            <div ref={resultRef}>
              {/* Recommendation Card */}
              <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  あなたへのおすすめ
                </h2>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-indigo-700 mb-2">
                    {result.recommended === "ideco" && "iDeCo優先"}
                    {result.recommended === "nisa" && "NISA優先"}
                    {result.recommended === "both" && "iDeCo + NISA 併用"}
                  </p>
                  <p className="text-gray-700 text-sm max-w-lg mx-auto">
                    {result.recommendationReason}
                  </p>
                </div>
              </section>

              {/* SECTION 3: Comparison Cards */}
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">3パターン比較</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* iDeCo Only */}
                  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-indigo-500 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="font-bold text-gray-700">iDeCoのみ</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">最終評価額</p>
                        <p className="text-xl font-bold text-gray-900">
                          {fmtMan(result.idecoFinalValue)}
                        </p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">年間節税額</p>
                        <p className="font-semibold text-indigo-700">
                          ¥{fmt(result.idecoAnnualTaxSaving)}
                        </p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">10年節税累計</p>
                        <p className="font-semibold text-amber-700">
                          ¥{fmt(result.ideco10YearTaxSaving)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NISA Only */}
                  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-green-500 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-bold text-gray-700">NISAのみ</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">最終評価額</p>
                        <p className="text-xl font-bold text-gray-900">
                          {fmtMan(result.nisaFinalValue)}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">運用益非課税</p>
                        <p className="font-semibold text-green-700">
                          {fmtMan(result.nisaTaxSaved)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">元本合計</p>
                        <p className="font-semibold text-gray-700">
                          {fmtMan(result.nisaTotalPrincipal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Combined */}
                  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-purple-500 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="font-bold text-gray-700">併用パターン</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">最終評価額</p>
                        <p className="text-xl font-bold text-gray-900">
                          {fmtMan(result.combinedFinalValue)}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">総節税額</p>
                        <p className="font-semibold text-purple-700">
                          {fmtMan(result.combinedTaxSaved)}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">iDeCo + NISA</p>
                        <p className="font-semibold text-green-700">
                          ¥{fmt(idecoAmount)} + ¥{fmt(nisaAmount)}/月
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ad Slot 2: Between results and chart */}
              <div className="adsense-slot my-6" data-ad-slot="auto"></div>

              {/* SECTION 4: Chart */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">資産推移比較</h2>
                <div className="w-full" style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" tickFormatter={(v) => v + "年"} tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => v + "万"} tick={{ fontSize: 11 }} width={55} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="idecoValue"
                        stroke="#6366F1"
                        strokeWidth={2.5}
                        dot={false}
                        name="iDeCoのみ"
                      />
                      <Line
                        type="monotone"
                        dataKey="nisaValue"
                        stroke="#22C55E"
                        strokeWidth={2.5}
                        dot={false}
                        name="NISAのみ"
                      />
                      <Line
                        type="monotone"
                        dataKey="combinedValue"
                        stroke="#A855F7"
                        strokeWidth={2.5}
                        dot={false}
                        name="併用"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* SECTION 5: iDeCo Slider Simulation */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                もしiDeCoを¥{fmt(sliderIdecoAmount)}にしたら…
              </h2>
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={Math.min(idecoMaxMonthly, monthlyBudget)}
                  step={1000}
                  value={sliderIdecoAmount}
                  onChange={(e) => setSliderIdecoAmount(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0円</span>
                  <span>{fmt(Math.min(idecoMaxMonthly, monthlyBudget))}円</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">iDeCo年間節税額</p>
                  <p className="text-xl font-bold text-indigo-700">
                    ¥{fmt(sliderResult.idecoAnnualTaxSaving)}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">10年後の予想節税累計</p>
                  <p className="text-xl font-bold text-amber-700">
                    {fmtMan(sliderResult.ideco10YearTaxSaving)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">NISA投資額</p>
                  <p className="text-xl font-bold text-green-700">
                    ¥{fmt(monthlyBudget - sliderIdecoAmount)}
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 6: Comparison Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">iDeCo vs NISA 制度比較表</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">項目</th>
                      <th className="px-4 py-3 text-center font-semibold text-indigo-700">iDeCo</th>
                      <th className="px-4 py-3 text-center font-semibold text-green-700">新NISA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">年間上限</td>
                      <td className="px-4 py-3 text-center">職業による</td>
                      <td className="px-4 py-3 text-center">360万円</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-medium">非課税期間</td>
                      <td className="px-4 py-3 text-center">運用中のみ</td>
                      <td className="px-4 py-3 text-center">無期限</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">引き出し</td>
                      <td className="px-4 py-3 text-center">原則60歳まで不可</td>
                      <td className="px-4 py-3 text-center">いつでも可</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-medium">掛金控除</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">全額所得控除 ✅</td>
                      <td className="px-4 py-3 text-center">なし</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">運用益</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">非課税 ✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">非課税 ✅</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-medium">受取時課税</td>
                      <td className="px-4 py-3 text-center">あり（控除あり）</td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">なし ✅</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">手数料</td>
                      <td className="px-4 py-3 text-center">月171円〜</td>
                      <td className="px-4 py-3 text-center">なし</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-medium">対象商品</td>
                      <td className="px-4 py-3 text-center">投資信託・定期預金</td>
                      <td className="px-4 py-3 text-center">株・投信・ETF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                結果をコピー
              </button>
              <button
                onClick={handleSaveImage}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                画像として保存
              </button>
              <button
                onClick={() => setActiveTab("input")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                ← 入力を修正
              </button>
            </div>
          </>
        )}

        {/* SECTION 7: SEO Collapsible Content */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {seoContent.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setSeoOpen(seoOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{item.title}</span>
                  <span className="text-gray-400">{seoOpen === idx ? "▲" : "▼"}</span>
                </button>
                {seoOpen === idx && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ad Slot 3: At the bottom before disclaimer */}
        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        <RelatedTools currentTool="/finance/ideco-nisa-comparison" />

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 mb-8">
          <p className="font-semibold mb-1">免責事項</p>
          <p>
            本ツールの計算結果はあくまで参考値です。実際の税額・制度内容は税理士または金融機関にご確認ください。
            投資にはリスクがあり、元本割れの可能性もあります。運用成果を保証するものではありません。
          </p>
        </div>
      </div>
    </div>
  );
}
