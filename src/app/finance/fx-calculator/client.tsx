"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import FinancialDisclaimer from "@/components/common/FinancialDisclaimer";
import RelatedTools from "@/components/finance/RelatedTools";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

interface FAQ {
  question: string;
  answer: string;
}

type Mode = "profit" | "margin" | "swap" | "batch" | "tax";
type TradeType = "buy" | "sell";
type LotUnit = "currency" | "lot";
type EmploymentType = "employee" | "self" | "unemployed";

interface Trade {
  id: number;
  pair: string;
  type: TradeType;
  quantity: number;
  entryRate: number;
  exitRate: number;
  swap: number;
}

const CURRENCY_PAIRS = [
  "USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY", "NZD/JPY", "CAD/JPY", "CHF/JPY",
  "EUR/USD", "GBP/USD", "AUD/USD"
];

const isJpyPair = (pair: string) => pair.includes("/JPY");

const TAX_RATE = 0.20315;

export default function FXCalculatorClient({ faq }: { faq?: FAQ[] }) {
  const [mode, setMode] = useState<Mode>("profit");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [stickyTabs, setStickyTabs] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Mode 1: Profit Calculation
  const [profitPair, setProfitPair] = useState("USD/JPY");
  const [profitType, setProfitType] = useState<TradeType>("buy");
  const [profitQuantity, setProfitQuantity] = useState<number>(100000);
  const [profitUnit, setProfitUnit] = useState<LotUnit>("currency");
  const [entryRate, setEntryRate] = useState<string>("150.000");
  const [exitRate, setExitRate] = useState<string>("151.500");
  const [spread, setSpread] = useState<number>(0);
  const [crossRate, setCrossRate] = useState<string>("150.000");

  // Mode 2: Margin Calculation
  const [marginPair, setMarginPair] = useState("USD/JPY");
  const [currentRate, setCurrentRate] = useState<string>("150.000");
  const [marginQuantity, setMarginQuantity] = useState<number>(100000);
  const [leverage, setLeverage] = useState<number>(10);
  const [accountBalance, setAccountBalance] = useState<number>(1000000);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(50);

  // Mode 3: Swap Calculation
  const [swapPair, setSwapPair] = useState("USD/JPY");
  const [swapType, setSwapType] = useState<TradeType>("buy");
  const [swapQuantity, setSwapQuantity] = useState<number>(100000);
  const [swapPoint, setSwapPoint] = useState<number>(50);
  const [holdingDays, setHoldingDays] = useState<number>(30);
  const [compoundSwap, setCompoundSwap] = useState<boolean>(false);

  // Mode 4: Batch Calculation
  const [trades, setTrades] = useState<Trade[]>([
    { id: 1, pair: "USD/JPY", type: "buy", quantity: 100000, entryRate: 150.0, exitRate: 151.0, swap: 0 },
  ]);

  // Mode 5: Tax Simulation
  const [employmentType, setEmploymentType] = useState<EmploymentType>("employee");
  const [salaryIncome, setSalaryIncome] = useState<number>(5000000);
  const [fxProfit, setFxProfit] = useState<number>(300000);
  const [fxSwapIncome, setFxSwapIncome] = useState<number>(50000);
  const [cfdLoss, setCfdLoss] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [carryoverLoss, setCarryoverLoss] = useState<number>(0);
  const [thisYearLoss, setThisYearLoss] = useState<number>(0);

  // Scroll handler for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      setStickyTabs(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mode 1 Calculations
  const calculateProfit = () => {
    const entry = parseFloat(entryRate) || 0;
    const exit = parseFloat(exitRate) || 0;
    const quantity = profitUnit === "lot" ? profitQuantity * 100000 : profitQuantity;
    
    if (entry === 0) return { pips: 0, profit: 0, profitPercent: 0, isProfit: false };
    
    const spreadCost = spread * (quantity / 10000);
    
    let pips = 0;
    let profit = 0;
    
    if (isJpyPair(profitPair)) {
      const rateDiff = profitType === "buy" ? exit - entry : entry - exit;
      pips = rateDiff * 100;
      profit = rateDiff * quantity - spreadCost;
    } else {
      const cross = parseFloat(crossRate) || 150;
      const rateDiff = profitType === "buy" ? exit - entry : entry - exit;
      pips = rateDiff * 10000;
      const profitUsd = rateDiff * quantity;
      profit = profitUsd * cross - spreadCost;
    }
    
    const margin = (quantity * entry) / leverage;
    const profitPercent = margin > 0 ? (profit / margin) * 100 : 0;
    
    return { pips: Math.round(pips * 100) / 100, profit: Math.round(profit), profitPercent: Math.round(profitPercent * 100) / 100, isProfit: profit > 0 };
  };

  // Mode 2 Calculations
  const calculateMargin = () => {
    const rate = parseFloat(currentRate) || 0;
    if (rate === 0) return { requiredMargin: 0, effectiveLeverage: 0, losscutRate: 0, losscutPips: 0 };
    
    const requiredMargin = (marginQuantity * rate) / leverage;
    const maintenanceMargin = requiredMargin * (maintenanceRate / 100);
    const effectiveLeverage = accountBalance > 0 ? (marginQuantity * rate) / accountBalance : 0;
    
    // Losscut calculation (simplified)
    const losscutRate = rate - ((accountBalance - maintenanceMargin) / marginQuantity);
    const losscutPips = (rate - losscutRate) * 100;
    
    return {
      requiredMargin: Math.round(requiredMargin),
      effectiveLeverage: Math.round(effectiveLeverage * 10) / 10,
      losscutRate: Math.round(losscutRate * 1000) / 1000,
      losscutPips: Math.round(losscutPips)
    };
  };

  // Mode 3 Calculations
  const calculateSwap = () => {
    const dailySwap = (swapPoint * swapQuantity) / 100000;
    let totalSwap = 0;
    let monthlyData: { month: string; cumulative: number }[] = [];
    
    for (let i = 1; i <= holdingDays; i++) {
      if (compoundSwap) {
        totalSwap += dailySwap * Math.pow(1 + swapPoint / 100000, i - 1);
      } else {
        totalSwap += dailySwap;
      }
      if (i % 30 === 0 || i === holdingDays) {
        monthlyData.push({ month: `${Math.ceil(i / 30)}ヶ月目`, cumulative: Math.round(totalSwap) });
      }
    }
    
    const annualRate = (totalSwap / (swapQuantity * (parseFloat(currentRate) || 150))) * (365 / holdingDays) * 100;
    
    return { totalSwap: Math.round(totalSwap), annualRate: Math.round(annualRate * 100) / 100, monthlyData };
  };

  // Mode 4 Calculations
  const calculateBatch = () => {
    let totalProfit = 0;
    let winCount = 0;
    let lossCount = 0;
    let totalWin = 0;
    let totalLoss = 0;
    
    const results = trades.map(trade => {
      const rateDiff = trade.type === "buy" ? trade.exitRate - trade.entryRate : trade.entryRate - trade.exitRate;
      const profit = rateDiff * trade.quantity + trade.swap;
      
      if (profit > 0) {
        winCount++;
        totalWin += profit;
      } else {
        lossCount++;
        totalLoss += Math.abs(profit);
      }
      totalProfit += profit;
      
      return { ...trade, profit: Math.round(profit) };
    });
    
    const winRate = winCount + lossCount > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;
    const profitFactor = totalLoss > 0 ? totalWin / totalLoss : totalWin > 0 ? Infinity : 0;
    
    return { results, totalProfit: Math.round(totalProfit), winCount, lossCount, winRate: Math.round(winRate * 10) / 10, avgWin: winCount > 0 ? Math.round(totalWin / winCount) : 0, avgLoss: lossCount > 0 ? Math.round(totalLoss / lossCount) : 0, profitFactor: Math.round(profitFactor * 100) / 100 };
  };

  // Mode 5 Calculations
  const calculateTax = () => {
    const taxableIncome = Math.max(0, fxProfit + fxSwapIncome + cfdLoss - expenses - carryoverLoss);
    const taxAmount = Math.round(taxableIncome * TAX_RATE);
    
    let filingRequired = false;
    let filingMessage = "";
    
    if (employmentType === "employee") {
      filingRequired = taxableIncome > 200000;
      filingMessage = filingRequired ? "確定申告が必要です" : "申告不要ですが住民税申告は必要な場合があります";
    } else if (employmentType === "unemployed") {
      filingRequired = taxableIncome > 480000;
      filingMessage = filingRequired ? "確定申告が必要です" : "申告不要ですが住民税申告は必要な場合があります";
    } else {
      filingRequired = true;
      filingMessage = "自営業・フリーランスは確定申告が必要です";
    }
    
    const savingsFromCarryover = Math.round(carryoverLoss * TAX_RATE);
    const savingsFromCfd = cfdLoss < 0 ? Math.round(Math.abs(cfdLoss) * TAX_RATE) : 0;
    
    // 3-year carryover simulation
    const carryoverData = [
      { year: "来年", amount: Math.round(thisYearLoss * 0.7), taxSavings: Math.round(thisYearLoss * 0.7 * TAX_RATE) },
      { year: "再来年", amount: Math.round(thisYearLoss * 0.4), taxSavings: Math.round(thisYearLoss * 0.4 * TAX_RATE) },
      { year: "3年後", amount: Math.round(thisYearLoss * 0.1), taxSavings: Math.round(thisYearLoss * 0.1 * TAX_RATE) },
    ];
    
    return { taxableIncome, taxAmount, filingRequired, filingMessage, savingsFromCarryover, savingsFromCfd, carryoverData };
  };

  // Handlers
  const addTrade = () => {
    if (trades.length < 20) {
      setTrades([...trades, { id: Date.now(), pair: "USD/JPY", type: "buy", quantity: 100000, entryRate: 150.0, exitRate: 151.0, swap: 0 }]);
    }
  };

  const updateTrade = (id: number, field: keyof Trade, value: any) => {
    setTrades(trades.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTrade = (id: number) => {
    if (trades.length > 1) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  const handleCopy = useCallback(() => {
    let text = "【FX計算結果】\n";
    
    if (mode === "profit") {
      const result = calculateProfit();
      text += `通貨ペア: ${profitPair}\n損益: ¥${result.profit.toLocaleString()} (${result.isProfit ? "利益" : "損失"})\n獲得pips: ${result.pips}`;
    } else if (mode === "margin") {
      const result = calculateMargin();
      text += `必要証拠金: ¥${result.requiredMargin.toLocaleString()}\n実効レバレッジ: ${result.effectiveLeverage}x\nロスカットレート: ${result.losscutRate}`;
    } else if (mode === "swap") {
      const result = calculateSwap();
      text += `累計スワップ: ¥${result.totalSwap.toLocaleString()}\n年換算利回り: ${result.annualRate}%`;
    } else if (mode === "batch") {
      const result = calculateBatch();
      text += `合計損益: ¥${result.totalProfit.toLocaleString()}\n勝率: ${result.winRate}%\nPF: ${result.profitFactor}`;
    } else if (mode === "tax") {
      const result = calculateTax();
      text += `課税所得: ¥${result.taxableIncome.toLocaleString()}\n税額: ¥${result.taxAmount.toLocaleString()}\n${result.filingMessage}`;
    }
    
    text += "\n詳細: https://yamada-tools.jp/fx-calculator";
    navigator.clipboard.writeText(text).then(() => alert("コピーしました！"));
  }, [mode, profitPair, profitType, profitQuantity, profitUnit, entryRate, exitRate, spread, crossRate, marginPair, currentRate, marginQuantity, leverage, accountBalance, maintenanceRate, swapPair, swapType, swapQuantity, swapPoint, holdingDays, compoundSwap, trades, employmentType, salaryIncome, fxProfit, fxSwapIncome, cfdLoss, expenses, carryoverLoss, thisYearLoss]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = "fx-calculation.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { alert("画像の保存に失敗しました。"); }
  }, []);

  const modeLabels: Record<Mode, string> = {
    profit: "損益計算",
    margin: "証拠金・ロスカット",
    swap: "スワップ計算",
    batch: "複数取引 一括計算",
    tax: "確定申告シミュレーター"
  };

  const profitResult = calculateProfit();
  const marginResult = calculateMargin();
  const swapResult = calculateSwap();
  const batchResult = calculateBatch();
  const taxResult = calculateTax();

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <FinancialDisclaimer type="tax" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">FX損益計算機 Pro</h1>
          <p className="text-blue-100 text-sm md:text-base mt-2">損益・証拠金・ロスカット・スワップ・確定申告 完全対応</p>
        </div>
      </div>

      {/* Sticky Mode Tabs */}
      <div className={`${stickyTabs ? "sticky top-0 z-40 shadow-lg" : ""} bg-white border-b border-gray-200`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-3 no-scrollbar">
            {(Object.keys(modeLabels) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Ad Slot 1 */}
        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        <div ref={resultRef} className="space-y-6">
          {/* MODE 1: Profit Calculation */}
          {mode === "profit" && (
            <>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">損益計算</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">通貨ペア</label>
                    <select
                      value={profitPair}
                      onChange={(e) => setProfitPair(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">売買区分</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setProfitType("buy")}
                        className={`flex-1 py-2 text-sm transition-all ${profitType === "buy" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        買い（ロング）
                      </button>
                      <button
                        onClick={() => setProfitType("sell")}
                        className={`flex-1 py-2 text-sm transition-all ${profitType === "sell" ? "bg-red-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        売り（ショート）
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">取引数量</label>
                    <div className="flex">
                      <input
                        type="number"
                        value={profitQuantity}
                        onChange={(e) => setProfitQuantity(Number(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setProfitUnit(profitUnit === "currency" ? "lot" : "currency")}
                        className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm"
                      >
                        {profitUnit === "currency" ? "通貨" : "ロット"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      FX ドル円 1ロット いくら？標準ロット=100,000通貨（約1,500万円相当）、ミニ=10,000、マイクロ=1,000
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">スプレッド（pips）</label>
                    <input
                      type="number"
                      value={spread}
                      onChange={(e) => setSpread(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">エントリーレート</label>
                    <input
                      type="number"
                      step="0.001"
                      value={entryRate}
                      onChange={(e) => setEntryRate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">決済レート</label>
                    <input
                      type="number"
                      step="0.001"
                      value={exitRate}
                      onChange={(e) => setExitRate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {!isJpyPair(profitPair) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">USD/JPY クロスレート</label>
                    <input
                      type="number"
                      step="0.001"
                      value={crossRate}
                      onChange={(e) => setCrossRate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">ドル建て通貨ペアの損益を円換算するために必要です</p>
                  </div>
                )}

                {/* Results */}
                <div className={`rounded-xl p-6 ${profitResult.isProfit ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{profitResult.isProfit ? "✅" : "❌"}</span>
                    <span className={`text-xl font-bold ${profitResult.isProfit ? "text-green-700" : "text-red-700"}`}>
                      {profitResult.isProfit ? "利益" : "損失"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">獲得pips</p>
                      <p className={`text-xl font-bold ${profitResult.isProfit ? "text-green-700" : "text-red-700"}`}>
                        {profitResult.pips > 0 ? "+" : ""}{profitResult.pips}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">損益（円）</p>
                      <p className={`text-xl font-bold ${profitResult.isProfit ? "text-green-700" : "text-red-700"}`}>
                        ¥{profitResult.profit.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">損益（%）</p>
                      <p className={`text-xl font-bold ${profitResult.isProfit ? "text-green-700" : "text-red-700"}`}>
                        {profitResult.profitPercent > 0 ? "+" : ""}{profitResult.profitPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SEO Content */}
              <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <summary className="font-bold text-gray-800 cursor-pointer">FX損益の計算方法とは（スプレッド込み）</summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  FXの損益計算は基本的に「（決済レート－エントリーレート）×取引数量」で求めます。
                  円建て通貨ペア（USD/JPY等）の場合はそのまま円換算されますが、
                  ドル建て通貨ペア（EUR/USD等）の場合はUSD/JPYのレートを掛けて円換算します。
                  スプレッド（売値と買値の差）は取引コストとして差し引かれます。
                  FX 損益計算 スプレッド 込みで正確な損益を把握しましょう。
                </p>
              </details>
            </>
          )}

          {/* MODE 2: Margin Calculation */}
          {mode === "margin" && (
            <>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">証拠金・ロスカット計算</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">通貨ペア</label>
                    <select
                      value={marginPair}
                      onChange={(e) => setMarginPair(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">現在レート</label>
                    <input
                      type="number"
                      step="0.001"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">取引数量（通貨）</label>
                    <input
                      type="number"
                      value={marginQuantity}
                      onChange={(e) => setMarginQuantity(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">口座残高（円）</label>
                    <input
                      type="number"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    レバレッジ: <span className="text-blue-600 font-bold">{leverage}x</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1x</span>
                    <span>25x（国内最大）</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    維持証拠金率: <span className="text-blue-600 font-bold">{maintenanceRate}%</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={maintenanceRate}
                    onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* Warning Banner */}
                {marginResult.effectiveLeverage > 10 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="text-yellow-800 font-medium">ハイレバレッジ注意：実効レバレッジが10倍以上です</span>
                  </div>
                )}

                {/* Results */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">必要証拠金</p>
                      <p className="text-lg font-bold text-blue-700">¥{marginResult.requiredMargin.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">実効レバレッジ</p>
                      <p className={`text-lg font-bold ${marginResult.effectiveLeverage > 10 ? "text-red-600" : "text-blue-700"}`}>
                        {marginResult.effectiveLeverage}x
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">ロスカットレート</p>
                      <p className="text-lg font-bold text-red-600">{marginResult.losscutRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">ロスカットまで</p>
                      <p className="text-lg font-bold text-red-600">{marginResult.losscutPips}pips</p>
                    </div>
                  </div>
                </div>
              </section>

              <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <summary className="font-bold text-gray-800 cursor-pointer">FX ロスカット 証拠金 維持率 計算方法</summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  ロスカット（強制決済）は、口座残高が維持証拠金（必要証拠金の一定割合、通常50%）を下回った時に、
                  自動的にポジションが決済される仕組みです。これにより、口座残高がマイナスになることを防ぎます。
                  実効レバレッジが高いほど、ロスカットが近づくリスクが高まります。
                  FX ロスカット 証拠金 維持率 計算方法は、本シミュレーターで簡単に確認できます。
                </p>
              </details>
            </>
          )}

          {/* MODE 3: Swap Calculation */}
          {mode === "swap" && (
            <>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">スワップ計算</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">通貨ペア</label>
                    <select
                      value={swapPair}
                      onChange={(e) => setSwapPair(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">売買区分</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setSwapType("buy")}
                        className={`flex-1 py-2 text-sm transition-all ${swapType === "buy" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        買い
                      </button>
                      <button
                        onClick={() => setSwapType("sell")}
                        className={`flex-1 py-2 text-sm transition-all ${swapType === "sell" ? "bg-red-600 text-white" : "bg-white text-gray-600"}`}
                      >
                        売り
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">取引数量（通貨）</label>
                    <input
                      type="number"
                      value={swapQuantity}
                      onChange={(e) => setSwapQuantity(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">スワップポイント（円/日）</label>
                    <input
                      type="number"
                      value={swapPoint}
                      onChange={(e) => setSwapPoint(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">証券会社のスワップポイントを入力</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    保有日数: <span className="text-blue-600 font-bold">{holdingDays}日</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={365}
                    value={holdingDays}
                    onChange={(e) => setHoldingDays(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1日</span>
                    <span>365日</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compoundSwap}
                      onChange={(e) => setCompoundSwap(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">スワップを再投資する（複利）</span>
                  </label>
                </div>

                {/* Results */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">累計スワップ収益</p>
                      <p className="text-2xl font-bold text-green-700">¥{swapResult.totalSwap.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">年換算利回り</p>
                      <p className="text-2xl font-bold text-blue-700">{swapResult.annualRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                {swapResult.monthlyData.length > 0 && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={swapResult.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => "¥" + (v / 1000) + "k"} />
                        <Tooltip formatter={(v) => typeof v === "number" ? "¥" + v.toLocaleString() : v} />
                        <Bar dataKey="cumulative" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <summary className="font-bold text-gray-800 cursor-pointer">FX スワップ 毎日 いくらもらえる 計算</summary>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  スワップポイントは、異なる金利の通貨を取引する際に発生する利息調整額です。
                  高金利通貨を買い・低金利通貨を売りの場合、スワップポイントを受け取ります。
                  逆の場合は支払いが発生します。長期保有戦略（スワップ狙い）の場合、
                  スワップポイントは重要な収益源となります。
                  FX スワップ 毎日 いくらもらえる 計算は、保有数量とスワップポイントを掛けて求めます。
                </p>
              </details>
            </>
          )}

          {/* MODE 4: Batch Calculation */}
          {mode === "batch" && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">複数取引 一括計算</h2>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left">通貨ペア</th>
                      <th className="px-3 py-2 text-left">売買</th>
                      <th className="px-3 py-2 text-right">数量</th>
                      <th className="px-3 py-2 text-right">エントリー</th>
                      <th className="px-3 py-2 text-right">決済</th>
                      <th className="px-3 py-2 text-right">スワップ</th>
                      <th className="px-3 py-2 text-center">削除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.id} className="border-b">
                        <td className="px-2 py-2">
                          <select
                            value={trade.pair}
                            onChange={(e) => updateTrade(trade.id, "pair", e.target.value)}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={trade.type}
                            onChange={(e) => updateTrade(trade.id, "type", e.target.value)}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="buy">買い</option>
                            <option value="sell">売り</option>
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={trade.quantity}
                            onChange={(e) => updateTrade(trade.id, "quantity", Number(e.target.value))}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            step="0.001"
                            value={trade.entryRate}
                            onChange={(e) => updateTrade(trade.id, "entryRate", Number(e.target.value))}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            step="0.001"
                            value={trade.exitRate}
                            onChange={(e) => updateTrade(trade.id, "exitRate", Number(e.target.value))}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={trade.swap}
                            onChange={(e) => updateTrade(trade.id, "swap", Number(e.target.value))}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            onClick={() => removeTrade(trade.id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={trades.length <= 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={addTrade}
                disabled={trades.length >= 20}
                className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                + 取引を追加 ({trades.length}/20)
              </button>

              {/* Results */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">一括計算結果</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">合計損益</p>
                    <p className={`text-xl font-bold ${batchResult.totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                      ¥{batchResult.totalProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">勝ち/負け</p>
                    <p className="text-xl font-bold text-blue-700">{batchResult.winCount}/{batchResult.lossCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">勝率</p>
                    <p className="text-xl font-bold text-blue-700">{batchResult.winRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">PF</p>
                    <p className="text-xl font-bold text-blue-700">{batchResult.profitFactor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">平均利益</p>
                    <p className="font-bold text-green-700">¥{batchResult.avgWin.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">平均損失</p>
                    <p className="font-bold text-red-700">¥{batchResult.avgLoss.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* MODE 5: Tax Simulation */}
          {mode === "tax" && (
            <>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">確定申告シミュレーター</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">雇用形態</label>
                  <div className="flex flex-wrap gap-2">
                    {(["employee", "self", "unemployed"] as EmploymentType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setEmploymentType(t)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          employmentType === t
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t === "employee" ? "会社員" : t === "self" ? "自営業・フリーランス" : "無職・専業主婦"}
                      </button>
                    ))}
                  </div>
                </div>

                {employmentType === "employee" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">給与収入（円/年）</label>
                    <input
                      type="number"
                      value={salaryIncome}
                      onChange={(e) => setSalaryIncome(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FX為替差益（円）</label>
                    <input
                      type="number"
                      value={fxProfit}
                      onChange={(e) => setFxProfit(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FXスワップポイント収益（円）</label>
                    <input
                      type="number"
                      value={fxSwapIncome}
                      onChange={(e) => setFxSwapIncome(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CFD・先物損益（円）</label>
                    <input
                      type="number"
                      value={cfdLoss}
                      onChange={(e) => setCfdLoss(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">損失の場合はマイナス値で入力（損益通算）</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">必要経費（円）</label>
                    <input
                      type="number"
                      value={expenses}
                      onChange={(e) => setExpenses(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">書籍代、セミナー費、インターネット代（按分）、ソフトウェア代 等</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">前年繰越損失（円）</label>
                  <input
                    type="number"
                    value={carryoverLoss}
                    onChange={(e) => setCarryoverLoss(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">損失繰越控除（過去3年間の損失）</p>
                </div>

                {/* Results */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">FX課税所得</p>
                      <p className="text-xl font-bold text-blue-700">¥{taxResult.taxableIncome.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">税額（20.315%）</p>
                      <p className="text-xl font-bold text-red-600">¥{taxResult.taxAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">内訳</p>
                      <p className="text-xs text-gray-600">所得税15% + 復興税0.315% + 住民税5%</p>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 text-center ${taxResult.filingRequired ? "bg-red-100" : "bg-green-100"}`}>
                    <p className={`font-bold ${taxResult.filingRequired ? "text-red-700" : "text-green-700"}`}>
                      {taxResult.filingMessage}
                    </p>
                  </div>
                </div>

                {/* Tax Savings Tips */}
                {(taxResult.savingsFromCarryover > 0 || taxResult.savingsFromCfd > 0) && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
                    <h4 className="font-bold text-green-800 mb-2">💡 節税ポイント</h4>
                    {taxResult.savingsFromCarryover > 0 && (
                      <p className="text-green-700 text-sm">
                        損失繰越控除を適用し ¥{taxResult.savingsFromCarryover.toLocaleString()} 節税できました
                      </p>
                    )}
                    {taxResult.savingsFromCfd > 0 && (
                      <p className="text-green-700 text-sm">
                        損益通算により ¥{taxResult.savingsFromCfd.toLocaleString()} 節税できました
                      </p>
                    )}
                  </div>
                )}

                {/* 3-Year Carryover Simulator */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-800 mb-4">3年繰越控除シミュレーター</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">今年の損失（円）</label>
                    <input
                      type="number"
                      value={thisYearLoss}
                      onChange={(e) => setThisYearLoss(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {thisYearLoss > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">年度</th>
                            <th className="px-4 py-2 text-right">控除可能額</th>
                            <th className="px-4 py-2 text-right">節税額（20.315%）</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxResult.carryoverData.map((row, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="px-4 py-2">{row.year}</td>
                              <td className="px-4 py-2 text-right">¥{row.amount.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right text-green-700 font-bold">¥{row.taxSavings.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <summary className="font-bold text-gray-800 cursor-pointer">FX 確定申告 損失 繰越控除 3年</summary>
                <div className="text-gray-600 text-sm mt-4 leading-relaxed space-y-2">
                  <p>FXの確定申告が必要かどうかは、雇用形態と利益額によって異なります：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>会社員：</strong>雑所得（FX利益）が20万円を超える場合に確定申告が必要</li>
                    <li><strong>無職・専業主婦：</strong>所得が48万円（基礎控除）を超える場合に確定申告が必要</li>
                    <li><strong>自営業・フリーランス：</strong>確定申告が必要（白色申告の場合、損失繰越控除が可能）</li>
                  </ul>
                  <p>FXの税率は20.315%（所得税15%＋復興特別所得税0.315%＋住民税5%）で、給与所得と分離課税されます。</p>
                  <p>FXで損失が出た場合は、FX 確定申告 損失 繰越控除 3年間、翌年以降の利益と通算できます。損失が出た年も確定申告をしておくことで、将来の節税に活用できます。</p>
                </div>
              </details>
            </>
          )}
        </div>

        {/* Ad Slot 2 */}
        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 my-8">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            結果をコピー
          </button>
          <button
            onClick={handleSaveImage}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            画像として保存
          </button>
        </div>

        {/* Ad Slot 3 */}
        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h3 className="font-medium text-gray-900 mb-2">Q: {item.question}</h3>
                  <p className="text-gray-600 text-sm">A: {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FX Educational Content Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">FX証拠金・損益計算の基礎知識</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <p>
              このFX損益計算機は、通貨ペアのエントリーレートと決済レート、取引数量から損益を計算するツールです。
              スプレッド（売値と買値の差）を考慮した正確な損益計算に加え、証拠金計算、ロスカット予測、
              スワップポイント計算、複数取引の一括計算、確定申告シミュレーションまで対応しています。
            </p>

            <h3 className="text-lg font-bold text-gray-800">日本でのFXレバレッジ規制</h3>
            <p>
              日本国内のFX業者では、個人投資家向けに最大25倍のレバレッジが適用されます。
              これは2010年の金融先物取引法改正により導入された規制で、投資家保護の目的があります。
              例えば100万円の証拠金で、最大2500万円分の取引が可能です。
              レバレッジが高いほど少ない資金で大きなポジションを持てますが、リスクも比例して高まります。
            </p>

            <h3 className="text-lg font-bold text-gray-800">FXのpips（ピップス）とは</h3>
            <p>
              pipsはFX取引における価格変動の最小単位です。円建て通貨ペア（USD/JPY等）の場合、
              0.01円（1銭）＝1pipです。ドル建て通貨ペア（EUR/USD等）の場合、0.0001ドル＝1pipです。
              例えばUSD/JPYが150.00円から150.50円に上昇した場合、50pipsの上昇となります。
            </p>

            <h3 className="text-lg font-bold text-gray-800">標準的なロットサイズ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-700 mb-2">スタンダードロット</h4>
                <p className="text-sm">100,000通貨単位</p>
                <p className="text-xs text-gray-500 mt-1">USD/JPYで約1,500万円相当</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-700 mb-2">ミニロット</h4>
                <p className="text-sm">10,000通貨単位</p>
                <p className="text-xs text-gray-500 mt-1">USD/JPYで約150万円相当</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-purple-700 mb-2">マイクロロット</h4>
                <p className="text-sm">1,000通貨単位</p>
                <p className="text-xs text-gray-500 mt-1">USD/JPYで約15万円相当</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800">計算例：5つのシナリオ</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">シナリオ</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">通貨ペア</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">エントリー</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">決済</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">数量</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">損益</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">① ドル円買い</td>
                    <td className="px-4 py-3 text-center">USD/JPY</td>
                    <td className="px-4 py-3 text-right">150.00円</td>
                    <td className="px-4 py-3 text-right">151.50円</td>
                    <td className="px-4 py-3 text-right">10万通貨</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">+150,000円</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">② ドル円売り</td>
                    <td className="px-4 py-3 text-center">USD/JPY</td>
                    <td className="px-4 py-3 text-right">150.00円</td>
                    <td className="px-4 py-3 text-right">149.00円</td>
                    <td className="px-4 py-3 text-right">10万通貨</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">+100,000円</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">③ ユーロドル買い</td>
                    <td className="px-4 py-3 text-center">EUR/USD</td>
                    <td className="px-4 py-3 text-right">1.0800ドル</td>
                    <td className="px-4 py-3 text-right">1.1000ドル</td>
                    <td className="px-4 py-3 text-right">10万通貨</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">+300,000円</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">④ ポンド円買い（損失）</td>
                    <td className="px-4 py-3 text-center">GBP/JPY</td>
                    <td className="px-4 py-3 text-right">190.00円</td>
                    <td className="px-4 py-3 text-right">188.50円</td>
                    <td className="px-4 py-3 text-right">10万通貨</td>
                    <td className="px-4 py-3 text-right text-red-600 font-bold">-150,000円</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">⑤ 豪ドル円売り</td>
                    <td className="px-4 py-3 text-center">AUD/JPY</td>
                    <td className="px-4 py-3 text-right">98.00円</td>
                    <td className="px-4 py-3 text-right">96.00円</td>
                    <td className="px-4 py-3 text-right">10万通貨</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">+200,000円</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              ※スプレッドは考慮していません。USD/JPY換算レートは150円で計算。
            </p>

            <h3 className="text-lg font-bold text-gray-800">よくある質問</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: FXの証拠金はいくら必要ですか？</h4>
                <p className="text-sm">
                  A: 必要証拠金は「取引金額÷レバレッジ倍率」で計算されます。
                  例えばUSD/JPYが150円で10万通貨（1,500万円相当）を25倍レバレッジで取引する場合、
                  必要証拠金は60万円です。ただし、ロスカットを避けるため、余裕を持った証拠金が推奨されます。
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: ロスカットはどのように計算されますか？</h4>
                <p className="text-sm">
                  A: ロスカットレートは、口座残高が維持証拠金（通常は必要証拠金の50%）を下回ると発生します。
                  買いポジションの場合：ロスカットレート＝エントリーレート－（口座残高－維持証拠金）÷取引数量。
                  実効レバレッジが10倍以上になると、ロスカットリスクが急増します。
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q: スワップポイントは毎日いくらもらえますか？</h4>
                <p className="text-sm">
                  A: スワップポイントは通貨ペアの金利差と保有数量によって決まります。
                  例えばUSD/JPYでスワップポイントが50円/日の場合、10万通貨保有で毎日50円、
                  年間で約18,000円のスワップ収入になります。水曜日は3日分（週末分）が支払われます。
                  ただし、売りポジションの場合は支払いが発生することもあります。
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentTool="/finance/fx-calculator" />

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500">
          <p className="font-semibold mb-1">免責事項</p>
          <p>
            本ツールの計算結果はあくまで参考値です。実際の税務については税理士または最寄りの税務署にご確認ください。
            FX取引にはリスクが伴います。レバレッジをかけすぎると大きな損失を被る可能性があります。
          </p>
        </div>
        <AdUnit position="mid" format="horizontal" />
      </div>
    </div>
  );
}
