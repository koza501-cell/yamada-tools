"use client";

import { useState } from "react";
import Link from "next/link";
import { DISCLAIMER } from "../data";

interface Property {
  id: number;
  name: string;
  value: string;
}

function calcTax(valueStr: string): { tax: number; exempt: boolean; breakdown: string } {
  const value = parseFloat(valueStr.replace(/,/g, "")) || 0;
  if (value <= 0) return { tax: 0, exempt: false, breakdown: "" };
  if (value <= 1_000_000) return { tax: 0, exempt: true, breakdown: `固定資産税評価額 ${value.toLocaleString()}円 ≤ 100万円 → 免税` };
  const raw = value * 0.004;
  const floored = Math.floor(raw / 100) * 100;
  const final = Math.max(floored, 1000);
  return {
    tax: final,
    exempt: false,
    breakdown: `${value.toLocaleString()}円 × 0.4% = ${raw.toFixed(0)}円 → 100円未満切捨て = ${floored.toLocaleString()}円${final === 1000 && floored < 1000 ? " → 最低1,000円" : ""}`,
  };
}

export default function TaxPage() {
  const [properties, setProperties] = useState<Property[]>([{ id: 1, name: "不動産1", value: "" }]);

  function addProperty() {
    setProperties((prev) => [...prev, { id: Date.now(), name: `不動産${prev.length + 1}`, value: "" }]);
  }

  function removeProperty(id: number) {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  function updateProperty(id: number, field: "name" | "value", val: string) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  }

  const totalValue = properties.reduce((sum, p) => sum + (parseFloat(p.value.replace(/,/g, "")) || 0), 0);
  const totalTaxResult = calcTax(totalValue.toString());
  const individualResults = properties.map((p) => ({ ...p, result: calcTax(p.value) }));

  function formatNumber(val: string): string {
    const num = val.replace(/[^\d]/g, "");
    return num ? parseInt(num, 10).toLocaleString() : "";
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 登録免許税計算機
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">🧮 登録免許税計算機</h1>
          <p className="text-gray-200 mt-2 text-sm">固定資産評価額を入力すると登録免許税を自動計算します</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Formula explanation */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-blue-800 dark:text-blue-300 mb-3">計算式</h2>
          <div className="space-y-1.5 text-sm text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900 rounded px-2 py-0.5 font-mono font-bold">登録免許税 = 固定資産税評価額合計 × 0.4%</span>
            </div>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 ml-1">
              <li>100円未満は切り捨て</li>
              <li>最低1,000円（切捨て後が1,000円未満の場合）</li>
              <li>固定資産税評価額が100万円以下の土地は免税</li>
              <li>固定資産評価証明書の「価格」欄の金額を使用</li>
            </ul>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">不動産の固定資産税評価額を入力</h2>
          <div className="space-y-3">
            {properties.map((prop) => (
              <div key={prop.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={prop.name}
                  onChange={(e) => updateProperty(prop.id, "name", e.target.value)}
                  className="w-24 sm:w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ai"
                  placeholder="名称"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={prop.value ? formatNumber(prop.value) : ""}
                    onChange={(e) => updateProperty(prop.id, "value", e.target.value.replace(/,/g, ""))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ai pr-8"
                    placeholder="例：15,000,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">円</span>
                </div>
                {properties.length > 1 && (
                  <button
                    onClick={() => removeProperty(prop.id)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm flex-shrink-0"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addProperty}
            className="mt-4 text-sm text-ai hover:text-blue-600 font-medium flex items-center gap-1"
          >
            + 不動産を追加
          </button>
        </div>

        {/* Results */}
        {totalValue > 0 && (
          <div className="space-y-4">
            {/* Individual */}
            {properties.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">不動産別 計算結果</h3>
                <div className="space-y-3">
                  {individualResults.map((p) => {
                    const v = parseFloat(p.value.replace(/,/g, "")) || 0;
                    if (v === 0) return null;
                    return (
                      <div key={p.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{p.result.breakdown}</div>
                          </div>
                          <div className="text-right">
                            {p.result.exempt ? (
                              <span className="text-green-600 dark:text-green-400 font-bold text-sm">免税</span>
                            ) : (
                              <span className="text-gray-900 dark:text-white font-bold">{p.result.tax.toLocaleString()}円</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total */}
            <div className={`rounded-2xl shadow-md p-6 ${totalTaxResult.exempt ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" : "bg-ai text-white"}`}>
              <div className="text-center">
                <div className={`text-sm font-medium mb-2 ${totalTaxResult.exempt ? "text-green-700 dark:text-green-300" : "text-white/80"}`}>
                  登録免許税（合計）
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-3 ${totalTaxResult.exempt ? "text-green-600 dark:text-green-400" : "text-white"}`}>
                  {totalTaxResult.exempt ? "免税" : `${totalTaxResult.tax.toLocaleString()}円`}
                </div>
                <div className={`text-xs ${totalTaxResult.exempt ? "text-green-600 dark:text-green-400" : "text-white/70"}`}>
                  {totalTaxResult.exempt ? totalTaxResult.breakdown : totalTaxResult.breakdown}
                </div>
                {!totalTaxResult.exempt && (
                  <div className={`text-xs mt-1 text-white/70`}>
                    評価額合計: {totalValue.toLocaleString()}円
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-300">
              <p className="font-bold mb-1">注意事項</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>固定資産評価証明書（市区町村役場発行）の「価格」欄の金額を使用してください</li>
                <li>土地と建物は別々に評価証明書が発行されます。それぞれ入力してください</li>
                <li>農地・山林など固定資産評価額が極端に低い場合でも最低1,000円かかります</li>
                <li>この計算結果はあくまで目安です。正確な税額は法務局にご確認ください</li>
              </ul>
            </div>
          </div>
        )}

        {totalValue === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center text-gray-400">
            <div className="text-5xl mb-3">🧮</div>
            <p className="text-sm">固定資産税評価額を入力すると税額が表示されます</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/souzoku-touki/checklist" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">📋</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">書類チェックリスト</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">必要書類を一覧で確認</div>
          </Link>
          <Link href="/souzoku-touki/houmukyoku" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🏛️</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">管轄法務局を調べる</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">都道府県・市区町村から検索</div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">⚠️ {DISCLAIMER}</p>
      </div>
    </div>
  );
}
