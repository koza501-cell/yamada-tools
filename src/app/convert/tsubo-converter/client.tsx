"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface AreaUnit {
  id: string;
  nameJa: string;
  nameEn: string;
  symbol: string;
  toSqm: number; // conversion factor to square meters
  flag?: string;
  description: string;
}

const units: AreaUnit[] = [
  {
    id: "tsubo",
    nameJa: "坪",
    nameEn: "Tsubo",
    symbol: "坪",
    toSqm: 3.305785124,
    flag: "🇯🇵",
    description: "日本の伝統皰な面積単位 / Japanese traditional area unit"
  },
  {
    id: "jo",
    nameJa: "畳",
    nameEn: "Jō (Tatami)",
    symbol: "畳",
    toSqm: 1.62,
    flag: "🇯🇵",
    description: "不動産標準: 1畳=1.62㎡ / Standard tatami mat"
  },
  {
    id: "sqm",
    nameJa: "平方メートル",
    nameEn: "Square Meter",
    symbol: "㎡",
    toSqm: 1,
    flag: "🌐",
    description: "国際標準単位 / International standard (SI)"
  },
  {
    id: "sqft",
    nameJa: "平方フィート",
    nameEn: "Square Feet",
    symbol: "sq ft",
    toSqm: 0.09290304,
    flag: "🇺🇸",
    description: "米国・英国の不動産 / US & UK real estate"
  },
  {
    id: "sqyd",
    nameJa: "平方ヤード",
    nameEn: "Square Yard",
    symbol: "sq yd",
    toSqm: 0.83612736,
    flag: "🇬🇧",
    description: "英国・インドの土地面積 / UK & India land"
  },
  {
    id: "acre",
    nameJa: "エーカー",
    nameEn: "Acre",
    symbol: "ac",
    toSqm: 4046.8564224,
    flag: "🇺🇸",
    description: "米国・苵国の大規模土地 / US & UK large land"
  },
  {
    id: "hectare",
    nameJa: "ヘクタール",
    nameEn: "Hectare",
    symbol: "ha",
    toSqm: 10000,
    flag: "🌐",
    description: "農地・大規模土地の国際単位 / International large area"
  },
  {
    id: "are",
    nameJa: "アール",
    nameEn: "Are",
    symbol: "a",
    toSqm: 100,
    flag: "🌐",
    description: "100㎡ = 1アール / 100 sqm = 1 are"
  },
  {
    id: "pyeong",
    nameJa: "평（ピョン）",
    nameEn: "Pyeong",
    symbol: "평",
    toSqm: 3.305785124,
    flag: "🇰🇷",
    description: "韓国の面積単位（坪と同じ） / Korean area unit (same as tsubo)"
  },
  {
    id: "ping",
    nameJa: "坪（ピン）",
    nameEn: "Ping",
    symbol: "坪(台)",
    toSqm: 3.305785124,
    flag: "🇹🇼",
    description: "台湾の面積単位（坪と同じ） / Taiwanese area unit (same as tsubo)"
  },
];

// Quick reference values for common tsubo conversions
const quickReference = [
  { tsubo: 1, label: "1坪 (約2畳)" },
  { tsubo: 5, label: "5坪" },
  { tsubo: 10, label: "10坪 (ワンルーム)" },
  { tsubo: 15, label: "15坪 (1LDK)" },
  { tsubo: 20, label: "20坪 (2LDK)" },
  { tsubo: 25, label: "25坪 (3LDK)" },
  { tsubo: 30, label: "30坪 (小さな一戸建て)" },
  { tsubo: 40, label: "40坪 (一般的な一戸建て)" },
  { tsubo: 50, label: "50坪 (広めの一戸建て)" },
  { tsubo: 100, label: "100坪 (大きな土地)" },
];

export default function TsuboConverterClient({ faq }: Props) {
  const [inputValue, setInputValue] = useState<string>("1");
  const [selectedUnit, setSelectedUnit] = useState<string>("tsubo");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllUnits, setShowAllUnits] = useState<boolean>(false);

  const numericValue = useMemo(() => {
    const val = parseFloat(inputValue);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [inputValue]);

  // Convert input to square meters first, then to all other units
  const conversions = useMemo(() => {
    const sourceUnit = units.find(u => u.id === selectedUnit);
    if (!sourceUnit || numericValue === 0) {
      return units.map(u => ({ ...u, value: 0 }));
    }
    const sqm = numericValue * sourceUnit.toSqm;
    return units.map(u => ({
      ...u,
      value: sqm / u.toSqm
    }));
  }, [numericValue, selectedUnit]);

  const formatNumber = useCallback((num: number): string => {
    if (num === 0) return "0";
    if (num >= 1000000) return num.toLocaleString("ja-JP", { maximumFractionDigits: 2 });
    if (num >= 100) return num.toLocaleString("ja-JP", { maximumFractionDigits: 4 });
    if (num >= 1) return num.toLocaleString("ja-JP", { maximumFractionDigits: 6 });
    if (num >= 0.001) return num.toLocaleString("ja-JP", { maximumFractionDigits: 8 });
    return num.toExponential(4);
  }, []);

  const handleQuickRef = (tsubo: number) => {
    setSelectedUnit("tsubo");
    setInputValue(tsubo.toString());
  };

  // Determine which units to display
  const displayUnits = showAllUnits ? conversions : conversions.filter(u => u.id !== selectedUnit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Mascot state={numericValue && numericValue > 0 ? "success" : "idle"} />
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              📐 坪・面積変換ツール
            </h1>
            <p className="text-base sm:text-lg opacity-90 mb-1">
              Tsubo / Area Unit Converter
            </p>
            <p className="text-sm opacity-75">
              坪 ⇄ ㎡ ⇄ sq ft ⇄ acres ⇄ 畳 ⇄ hectares — 一括変換
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">

        {/* Main Converter Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 mb-6">

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              変換する値を入力 / Enter value to convert
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="any"
                className="flex-1 text-2xl sm:text-3xl font-bold text-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="1"
              />
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="text-lg font-medium border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors cursor-pointer"
              >
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.flag} {unit.nameJa} ({unit.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                変換結果 / Conversion Results
              </h2>
              <button type="button"
                onClick={() => setShowAllUnits(!showAllUnits)}
                className="text-xs text-green-600 hover:text-green-700 dark:text-green-400"
              >
                {showAllUnits ? "入力単位を非表示" : "すべて表示"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayUnits.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedUnit(conv.id);
                    setInputValue(formatNumber(conv.value).replace(/,/g, ""));
                  }}
                  className={`rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    conv.id === selectedUnit
                      ? "bg-green-50 dark:bg-green-900/30 border-2 border-green-400"
                      : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {conv.flag} {conv.nameJa}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {conv.nameEn}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                      {formatNumber(conv.value)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {conv.symbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            📊 坪数 早見表 / Tsubo Quick Reference
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            クリックで変換 / Click to convert
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">坪 (Tsubo)</th>
                  <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400">㎡</th>
                  <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400">畳</th>
                  <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400">sq ft</th>
                  <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">acres</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((ref) => {
                  const sqm = ref.tsubo * 3.305785124;
                  return (
                    <tr
                      key={ref.tsubo}
                      onClick={() => handleQuickRef(ref.tsubo)}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-2 font-medium text-gray-800 dark:text-white">
                        {ref.label}
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700 dark:text-gray-300">
                        {sqm.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700 dark:text-gray-300">
                        {(sqm / 1.62).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700 dark:text-gray-300">
                        {(sqm / 0.09290304).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                        {(sqm / 4046.8564224).toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* About Section - bilingual SEO content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            📖 坪（つぼ）とは？ / What is Tsubo?
          </h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              <strong>坪（つぼ / tsubo）</strong>は、日本の伝統的な面積の単位です。
              1坪は約<strong>3.306平方メートル（㎡）</strong>、つまり<strong>約35.58平方フィート（square feet）</strong>に相当します。
              畳2枚分の広さとして、日本人には直感的にイメージしやすい単位です。
            </p>
            <p>
              <strong>Tsubo (坪)</strong> is a traditional Japanese unit of area. 
              1 tsubo ≈ <strong>3.306 square meters</strong> ≈ <strong>35.58 square feet</strong> ≈ <strong>0.000817 acres</strong>.
              It equals the area of two standard tatami mats and is still widely used in Japanese real estate 
              for land pricing, property listings, and construction.
            </p>
            <p>
              昭和41年（1966年）以降、日本の計量法では坪は正式な単位として使用できなくなりましたが、
              不動産業界では現在も広く使われています。「坪単価」は土地や建物の価格を比較する重要な指標です。
            </p>
            <p>
              Similar units exist across East Asia: <strong>Korean pyeong (평)</strong> and <strong>Taiwanese ping (坪)</strong> 
              are essentially identical to the Japanese tsubo, all derived from the same historical measurement system.
              This converter supports all three.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
                💡 変換の基本公式 / Conversion Formulas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div>坪 → ㎡: × 3.30579</div>
                <div>㎡ → 坪: × 0.3025</div>
                <div>坪 → sq ft: × 35.5832</div>
                <div>sq ft → 坪: × 0.02810</div>
                <div>坪 → acres: × 0.000817</div>
                <div>acres → 坪: × 1224.17</div>
                <div>坪 → 畳: × 2.0405</div>
                <div>畳 → 坪: × 0.4901</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            ❓ よくある質問 / FAQ
          </h2>
          <div className="space-y-2">
            {faq.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
              >
                <button type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <span className="text-gray-400 flex-shrink-0 text-lg">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            🔗 関連ツール / Related Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "和暦西暦変換", nameEn: "Date Converter", path: "/convert/date-converter", icon: "📅" },
              { name: "単位変換", nameEn: "Unit Converter", path: "/convert/unit", icon: "🔄" },
              { name: "ふりがな変換", nameEn: "Furigana", path: "/convert/furigana", icon: "あ" },
              { name: "全角半角変換", nameEn: "Zenkaku / Hankaku", path: "/convert/zenkaku-hankaku", icon: "Ａ" },
              { name: "文字数カウント", nameEn: "Char Counter", path: "/generator/text-counter", icon: "🔢" },
              { name: "QRコード作成", nameEn: "QR Code", path: "/image/qr-code", icon: "📱" },
            ].map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm"
              >
                <span className="text-lg">{tool.icon}</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{tool.name}</div>
                  <div className="text-xs text-gray-400">{tool.nameEn}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
          <p>坪・面積変換ツール by <Link href="/" className="text-green-600 hover:underline">山田ツール (Yamada Tools)</Link></p>
          <p className="mt-1">Tsubo to Square Feet / Acres / Square Meters Converter — Free, No Registration Required</p>
        </div>

        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
