"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

type CalculationMode = "exclude-to-include" | "include-to-exclude";
type TaxRate = 8 | 10;

export default function TaxCalculatorClient({ faq }: Props) {
  const [mode, setMode] = useState<CalculationMode>("exclude-to-include");
  const [amount, setAmount] = useState<string>("");
  const [taxRate, setTaxRate] = useState<TaxRate>(10);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("金額を入力してね！");
  
  // Multi-item calculation
  const [items, setItems] = useState<{ amount: string; rate: TaxRate }[]>([]);

  const result = useMemo(() => {
    const value = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(value) || value < 0) return null;

    const rate = taxRate / 100;

    if (mode === "exclude-to-include") {
      const tax = Math.floor(value * rate);
      const total = value + tax;
      return {
        original: value,
        tax,
        result: total,
        originalLabel: "税抜価格",
        resultLabel: "税込価格",
      };
    } else {
      const original = Math.floor(value / (1 + rate));
      const tax = value - original;
      return {
        original: value,
        tax,
        result: original,
        originalLabel: "税込価格",
        resultLabel: "税抜価格",
      };
    }
  }, [amount, taxRate, mode]);

  // Multi-item total calculation
  const multiItemResult = useMemo(() => {
    if (items.length === 0) return null;

    let total8 = 0;
    let total10 = 0;
    let tax8 = 0;
    let tax10 = 0;

    items.forEach(item => {
      const value = parseFloat(item.amount.replace(/,/g, "")) || 0;
      if (item.rate === 8) {
        total8 += value;
        tax8 += Math.floor(value * 0.08);
      } else {
        total10 += value;
        tax10 += Math.floor(value * 0.10);
      }
    });

    return {
      subtotal8: total8,
      subtotal10: total10,
      tax8,
      tax10,
      totalTax: tax8 + tax10,
      grandTotal: total8 + total10 + tax8 + tax10,
    };
  }, [items]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString("ja-JP");
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and commas
    const cleaned = value.replace(/[^\d,]/g, "");
    setAmount(cleaned);
    
    if (cleaned && parseFloat(cleaned.replace(/,/g, "")) > 0) {
      setMascotState("success");
      setMascotMessage("計算できたよ！");
    } else {
      setMascotState("idle");
      setMascotMessage("金額を入力してね！");
    }
  };

  const handleClear = () => {
    setAmount("");
    setMascotState("idle");
    setMascotMessage("金額を入力してね！");
  };

  const addItem = () => {
    if (!amount || parseFloat(amount.replace(/,/g, "")) <= 0) return;
    setItems([...items, { amount, rate: taxRate }]);
    setAmount("");
    setMascotMessage(`${taxRate}%の品目を追加したよ！`);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearItems = () => {
    setItems([]);
    setMascotMessage("リストをクリアしたよ！");
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMascotMessage("コピーしました！");
    } catch {
      setMascotMessage("コピーに失敗しました...");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">消費税計算</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🧮</div>
          <h1 className="text-3xl font-bold text-kon mb-2">消費税計算</h1>
          <p className="text-gray-600 text-lg">8%・10%の税込・税抜価格を瞬時に計算</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📊 軽減税率対応</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">計算モード</label>
            <div className="flex gap-4">
              <button
                onClick={() => { setMode("exclude-to-include"); handleClear(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "exclude-to-include"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                税抜 → 税込
              </button>
              <button
                onClick={() => { setMode("include-to-exclude"); handleClear(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "include-to-exclude"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                税込 → 税抜
              </button>
            </div>
          </div>

          {/* Tax Rate Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">消費税率</label>
            <div className="flex gap-4">
              <button
                onClick={() => setTaxRate(10)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  taxRate === 10
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="text-lg font-bold">10%</div>
                <div className="text-xs opacity-80">標準税率</div>
              </button>
              <button
                onClick={() => setTaxRate(8)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  taxRate === 8
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="text-lg font-bold">8%</div>
                <div className="text-xs opacity-80">軽減税率</div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "exclude-to-include" ? "税抜価格" : "税込価格"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">¥</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="w-full p-4 pl-10 text-2xl font-bold text-right bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
              />
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-gradient-to-br from-kon/5 to-ai/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">{result.originalLabel}</div>
                  <div className="text-xl font-bold text-gray-700">¥{formatNumber(result.original)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">消費税（{taxRate}%）</div>
                  <div className="text-xl font-bold text-orange-500">¥{formatNumber(result.tax)}</div>
                </div>
                <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">{result.resultLabel}</div>
                  <div className="text-3xl font-bold text-kon">¥{formatNumber(result.result)}</div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleCopy(formatNumber(result.result))}
                  className="px-4 py-2 bg-kon text-white rounded-lg text-sm hover:bg-ai transition-colors"
                >
                  結果をコピー
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addItem}
              disabled={!amount || parseFloat(amount.replace(/,/g, "")) <= 0}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                amount && parseFloat(amount.replace(/,/g, "")) > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              📋 リストに追加
            </button>
            <button
              onClick={handleClear}
              className="py-3 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              クリア
            </button>
          </div>
        </section>

        {/* Multi-item List */}
        {items.length > 0 && (
          <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-kon text-lg">📋 計算リスト</h2>
              <button
                onClick={clearItems}
                className="text-sm text-red-500 hover:text-red-700"
              >
                すべてクリア
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.rate === 8 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {item.rate}%
                    </span>
                    <span className="font-medium">¥{item.amount}</span>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Multi-item Total */}
            {multiItemResult && (
              <div className="bg-gradient-to-br from-sakura/30 to-ai/10 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  {multiItemResult.subtotal8 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">8%対象小計:</span>
                      <span>¥{formatNumber(multiItemResult.subtotal8)}</span>
                    </div>
                  )}
                  {multiItemResult.subtotal10 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">10%対象小計:</span>
                      <span>¥{formatNumber(multiItemResult.subtotal10)}</span>
                    </div>
                  )}
                  {multiItemResult.tax8 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">消費税(8%):</span>
                      <span className="text-green-600">¥{formatNumber(multiItemResult.tax8)}</span>
                    </div>
                  )}
                  {multiItemResult.tax10 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">消費税(10%):</span>
                      <span className="text-red-600">¥{formatNumber(multiItemResult.tax10)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-medium">合計（税込）</span>
                  <span className="text-2xl font-bold text-kon">¥{formatNumber(multiItemResult.grandTotal)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  （うち消費税 ¥{formatNumber(multiItemResult.totalTax)}）
                </div>
              </div>
            )}
          </section>
        )}

        {/* Quick Reference */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">📌 軽減税率（8%）対象品目</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-green-600 mb-2">✓ 8%対象</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 飲食料品（持ち帰り・宅配）</li>
                <li>• スーパー・コンビニの食品</li>
                <li>• 定期購読の新聞（週2回以上発行）</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-red-600 mb-2">✗ 10%対象</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 外食・ケータリング</li>
                <li>• 酒類</li>
                <li>• 医薬品・日用品</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>計算モード（税抜→税込 または 税込→税抜）を選択</li>
            <li>消費税率（10% または 8%）を選択</li>
            <li>金額を入力すると自動で計算されます</li>
            <li>複数品目は「リストに追加」で合計計算できます</li>
          </ol>
        </section>

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                >
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1">完全無料</h3>
            <p className="text-xs text-gray-500">登録不要、制限なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-sm mb-1">リアルタイム計算</h3>
            <p className="text-xs text-gray-500">入力と同時に結果表示</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold text-sm mb-1">複数品目対応</h3>
            <p className="text-xs text-gray-500">8%・10%混合計算</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai transition-colors">
            ← 計算・生成ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
