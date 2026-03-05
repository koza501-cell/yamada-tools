"use client";
import { useState } from "react";
import FinancialDisclaimer from "@/components/common/FinancialDisclaimer";

interface FAQ {
  question: string;
  answer: string;
}

export default function TaxCalculatorClient({ faq }: { faq?: FAQ[] }) {
  const [amount, setAmount] = useState<string>("");
  const [taxRate, setTaxRate] = useState<number>(10);
  const [mode, setMode] = useState<"exclude" | "include">("exclude");

  const numAmount = parseFloat(amount) || 0;
  
  let taxExcluded: number, taxIncluded: number, taxAmount: number;
  
  if (mode === "exclude") {
    taxExcluded = numAmount;
    taxAmount = Math.floor(numAmount * (taxRate / 100));
    taxIncluded = numAmount + taxAmount;
  } else {
    taxIncluded = numAmount;
    taxExcluded = Math.floor(numAmount / (1 + taxRate / 100));
    taxAmount = taxIncluded - taxExcluded;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FinancialDisclaimer type="tax" />
      
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🧮</span>
            <h1 className="text-2xl font-bold text-gray-900">消費税計算</h1>
            <p className="text-gray-600 mt-2">税込・税抜価格を瞬時に計算</p>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("exclude")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                mode === "exclude"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              税抜→税込
            </button>
            <button
              onClick={() => setMode("include")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                mode === "include"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              税込→税抜
            </button>
          </div>

          {/* Tax Rate Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTaxRate(10)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                taxRate === 10
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              10%（標準税率）
            </button>
            <button
              onClick={() => setTaxRate(8)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                taxRate === 8
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              8%（軽減税率）
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "exclude" ? "税抜価格" : "税込価格"}（円）
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="金額を入力"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Results */}
          {numAmount > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">税抜価格</span>
                <span className="text-xl font-bold text-gray-900">
                  ¥{taxExcluded.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">消費税（{taxRate}%）</span>
                <span className="text-xl font-bold text-red-600">
                  ¥{taxAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-gray-900 font-medium">税込価格</span>
                <span className="text-2xl font-bold text-blue-600">
                  ¥{taxIncluded.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
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
        {/* Direct Answer Block for AI/SEO */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 よくある計算例</h2>
          <p className="text-gray-600 mb-4">消費税計算の早見表です。コピーしてご活用ください。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">税抜価格</th>
                  <th className="px-4 py-2 text-left">税率</th>
                  <th className="px-4 py-2 text-left">消費税</th>
                  <th className="px-4 py-2 text-left">税込価格</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-2">1,000円</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">100円</td><td className="px-4 py-2 font-bold">1,100円</td></tr>
                <tr><td className="px-4 py-2">1,000円</td><td className="px-4 py-2">8%</td><td className="px-4 py-2">80円</td><td className="px-4 py-2 font-bold">1,080円</td></tr>
                <tr><td className="px-4 py-2">5,000円</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">500円</td><td className="px-4 py-2 font-bold">5,500円</td></tr>
                <tr><td className="px-4 py-2">10,000円</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">1,000円</td><td className="px-4 py-2 font-bold">11,000円</td></tr>
                <tr><td className="px-4 py-2">50,000円</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">5,000円</td><td className="px-4 py-2 font-bold">55,000円</td></tr>
                <tr><td className="px-4 py-2">100,000円</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">10,000円</td><td className="px-4 py-2 font-bold">110,000円</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">※ 軽減税率8%は飲食料品（外食・酒類除く）と週2回以上発行の新聞に適用されます。</p>
        </div>
      </div>
    </div>
  );
}
