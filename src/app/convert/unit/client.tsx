"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
}

interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  baseUnit: string;
  units: Unit[];
}

const categories: UnitCategory[] = [
  {
    id: "length",
    name: "長さ",
    icon: "📏",
    baseUnit: "m",
    units: [
      { id: "km", name: "キロメートル", symbol: "km", toBase: 1000 },
      { id: "m", name: "メートル", symbol: "m", toBase: 1 },
      { id: "cm", name: "センチメートル", symbol: "cm", toBase: 0.01 },
      { id: "mm", name: "ミリメートル", symbol: "mm", toBase: 0.001 },
      { id: "mi", name: "マイル", symbol: "mi", toBase: 1609.344 },
      { id: "yd", name: "ヤード", symbol: "yd", toBase: 0.9144 },
      { id: "ft", name: "フィート", symbol: "ft", toBase: 0.3048 },
      { id: "in", name: "インチ", symbol: "in", toBase: 0.0254 },
      { id: "shaku", name: "尺", symbol: "尺", toBase: 0.303030303 },
      { id: "sun", name: "寸", symbol: "寸", toBase: 0.0303030303 },
      { id: "ken", name: "間", symbol: "間", toBase: 1.818181818 },
    ],
  },
  {
    id: "weight",
    name: "重さ",
    icon: "⚖️",
    baseUnit: "kg",
    units: [
      { id: "t", name: "トン", symbol: "t", toBase: 1000 },
      { id: "kg", name: "キログラム", symbol: "kg", toBase: 1 },
      { id: "g", name: "グラム", symbol: "g", toBase: 0.001 },
      { id: "mg", name: "ミリグラム", symbol: "mg", toBase: 0.000001 },
      { id: "lb", name: "ポンド", symbol: "lb", toBase: 0.45359237 },
      { id: "oz", name: "オンス", symbol: "oz", toBase: 0.028349523 },
      { id: "kan", name: "貫", symbol: "貫", toBase: 3.75 },
      { id: "monme", name: "匁", symbol: "匁", toBase: 0.00375 },
    ],
  },
  {
    id: "area",
    name: "面積",
    icon: "📐",
    baseUnit: "m2",
    units: [
      { id: "km2", name: "平方キロメートル", symbol: "km²", toBase: 1000000 },
      { id: "ha", name: "ヘクタール", symbol: "ha", toBase: 10000 },
      { id: "a", name: "アール", symbol: "a", toBase: 100 },
      { id: "m2", name: "平方メートル", symbol: "m²", toBase: 1 },
      { id: "cm2", name: "平方センチメートル", symbol: "cm²", toBase: 0.0001 },
      { id: "tsubo", name: "坪", symbol: "坪", toBase: 3.305785124 },
      { id: "jo", name: "畳", symbol: "畳", toBase: 1.6528926 },
      { id: "acre", name: "エーカー", symbol: "acre", toBase: 4046.8564224 },
      { id: "sqft", name: "平方フィート", symbol: "ft²", toBase: 0.09290304 },
    ],
  },
  {
    id: "volume",
    name: "体積",
    icon: "🧊",
    baseUnit: "L",
    units: [
      { id: "kl", name: "キロリットル", symbol: "kL", toBase: 1000 },
      { id: "L", name: "リットル", symbol: "L", toBase: 1 },
      { id: "mL", name: "ミリリットル", symbol: "mL", toBase: 0.001 },
      { id: "m3", name: "立方メートル", symbol: "m³", toBase: 1000 },
      { id: "cm3", name: "立方センチメートル", symbol: "cm³", toBase: 0.001 },
      { id: "gal", name: "ガロン(米)", symbol: "gal", toBase: 3.785411784 },
      { id: "qt", name: "クォート", symbol: "qt", toBase: 0.946352946 },
      { id: "sho", name: "升", symbol: "升", toBase: 1.8039 },
      { id: "go", name: "合", symbol: "合", toBase: 0.18039 },
    ],
  },
  {
    id: "temperature",
    name: "温度",
    icon: "🌡️",
    baseUnit: "C",
    units: [
      { id: "C", name: "摂氏", symbol: "°C", toBase: 1 },
      { id: "F", name: "華氏", symbol: "°F", toBase: 1 },
      { id: "K", name: "ケルビン", symbol: "K", toBase: 1 },
    ],
  },
  {
    id: "time",
    name: "時間",
    icon: "⏱️",
    baseUnit: "s",
    units: [
      { id: "yr", name: "年", symbol: "年", toBase: 31536000 },
      { id: "mo", name: "月(30日)", symbol: "月", toBase: 2592000 },
      { id: "wk", name: "週", symbol: "週", toBase: 604800 },
      { id: "d", name: "日", symbol: "日", toBase: 86400 },
      { id: "hr", name: "時間", symbol: "時間", toBase: 3600 },
      { id: "min", name: "分", symbol: "分", toBase: 60 },
      { id: "s", name: "秒", symbol: "秒", toBase: 1 },
      { id: "ms", name: "ミリ秒", symbol: "ms", toBase: 0.001 },
    ],
  },
  {
    id: "data",
    name: "データ容量",
    icon: "💾",
    baseUnit: "B",
    units: [
      { id: "TB", name: "テラバイト", symbol: "TB", toBase: 1099511627776 },
      { id: "GB", name: "ギガバイト", symbol: "GB", toBase: 1073741824 },
      { id: "MB", name: "メガバイト", symbol: "MB", toBase: 1048576 },
      { id: "KB", name: "キロバイト", symbol: "KB", toBase: 1024 },
      { id: "B", name: "バイト", symbol: "B", toBase: 1 },
      { id: "bit", name: "ビット", symbol: "bit", toBase: 0.125 },
    ],
  },
];

export default function UnitConverterClient({
 faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [selectedCategory, setSelectedCategory] = useState<string>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("cm");
  const [inputValue, setInputValue] = useState<string>("1");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("数値を入力して変換してね！");

  const currentCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategory) || categories[0];
  }, [selectedCategory]);

  const convertTemperature = (value: number, from: string, to: string): number => {
    // First convert to Celsius
    let celsius: number;
    switch (from) {
      case "F":
        celsius = (value - 32) * 5 / 9;
        break;
      case "K":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Then convert from Celsius to target
    switch (to) {
      case "F":
        return celsius * 9 / 5 + 32;
      case "K":
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    // Special handling for temperature
    if (selectedCategory === "temperature") {
      return convertTemperature(value, fromUnit, toUnit);
    }

    const fromUnitData = currentCategory.units.find(u => u.id === fromUnit);
    const toUnitData = currentCategory.units.find(u => u.id === toUnit);

    if (!fromUnitData || !toUnitData) return null;

    // Convert to base unit, then to target unit
    const baseValue = value * fromUnitData.toBase;
    return baseValue / toUnitData.toBase;
  }, [inputValue, fromUnit, toUnit, selectedCategory, currentCategory]);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
      return num.toExponential(6);
    }
    // Remove trailing zeros
    return parseFloat(num.toPrecision(10)).toString();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const newCategory = categories.find(c => c.id === categoryId);
    if (newCategory && newCategory.units.length >= 2) {
      setFromUnit(newCategory.units[0].id);
      setToUnit(newCategory.units[1].id);
    }
    setMascotMessage(`${newCategory?.name}の変換だね！`);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setMascotMessage("入れ替えたよ！");
  };

  const handleCopy = async () => {
    if (result !== null) {
      try {
        await navigator.clipboard.writeText(formatNumber(result));
        setMascotState("success")
      triggerSuccess('unit');;
        setMascotMessage("コピーしました！");
      } catch {
        setMascotMessage("コピーに失敗しました...");
      }
    }
  };

  const getUnitSymbol = (unitId: string): string => {
    const unit = currentCategory.units.find(u => u.id === unitId);
    return unit?.symbol || unitId;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📐</div>
          <h1 className="text-3xl font-bold text-kon mb-2">単位変換</h1>
          <p className="text-gray-600 text-lg">様々な単位を瞬時に変換</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🇯🇵 日本の単位対応</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">⚡ リアルタイム</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button type="button"
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-kon text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Area */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">変換元</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent mb-2"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
                className="w-full p-4 text-2xl font-bold text-right bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
              />
              <div className="text-right text-sm text-gray-500 mt-1">{getUnitSymbol(fromUnit)}</div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center pb-8">
              <button type="button"
                onClick={swapUnits}
                className="w-12 h-12 bg-kon text-white rounded-full hover:bg-ai transition-colors flex items-center justify-center text-xl"
                title="入れ替え"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">変換先</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent mb-2"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <div className="w-full p-4 text-2xl font-bold text-right bg-gradient-to-br from-kon/5 to-ai/5 border border-kon/20 rounded-xl">
                {result !== null ? formatNumber(result) : "—"}
              </div>
              <div className="text-right text-sm text-gray-500 mt-1">{getUnitSymbol(toUnit)}</div>
            </div>
          </div>

          {/* Result Summary */}
          {result !== null && (
            <div className="bg-sakura/20 rounded-xl p-4 text-center mb-6">
              <p className="text-lg">
                <span className="font-bold">{inputValue} {getUnitSymbol(fromUnit)}</span>
                <span className="mx-2">=</span>
                <span className="font-bold text-kon text-xl">{formatNumber(result)} {getUnitSymbol(toUnit)}</span>
              </p>
              <button type="button"
                onClick={handleCopy}
                className="mt-3 px-4 py-2 bg-kon text-white rounded-lg text-sm hover:bg-ai transition-colors"
              >
                結果をコピー
              </button>
            </div>
          )}

          {/* Quick Reference for Current Category */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{currentCategory.icon} {currentCategory.name}の単位一覧</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {currentCategory.units.map((unit) => (
                <div key={unit.id} className="flex justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-600">{unit.name}</span>
                  <span className="font-mono text-kon">{unit.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Japanese Units Info */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">🇯🇵 日本の単位について</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">長さ</h3>
              <ul className="space-y-1">
                <li>• 1尺 ≒ 30.3cm（約1フィート）</li>
                <li>• 1寸 = 1/10尺 ≒ 3.03cm</li>
                <li>• 1間 = 6尺 ≒ 1.82m</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">面積</h3>
              <ul className="space-y-1">
                <li>• 1坪 ≒ 3.3m²（畳約2枚分）</li>
                <li>• 1畳 ≒ 1.65m²（地域差あり）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>カテゴリ（長さ、重さなど）を選択</li>
            <li>変換元と変換先の単位を選択</li>
            <li>数値を入力すると自動で変換されます</li>
            <li>⇄ボタンで単位を入れ替え可能</li>
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
            <div className="text-2xl mb-2">🇯🇵</div>
            <h3 className="font-bold text-sm mb-1">日本の単位対応</h3>
            <p className="text-xs text-gray-500">坪・畳・尺・合など</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-sm mb-1">リアルタイム変換</h3>
            <p className="text-xs text-gray-500">入力と同時に結果表示</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai transition-colors">
            ← 変換ツール一覧に戻る
          </Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
