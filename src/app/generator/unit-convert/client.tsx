"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";

type Category = "length" | "weight" | "area" | "volume" | "temperature";

const categories: { id: Category; label: string }[] = [
  { id: "length", label: "長さ" },
  { id: "weight", label: "重さ" },
  { id: "area", label: "面積" },
  { id: "volume", label: "体積" },
  { id: "temperature", label: "温度" },
];

const units: Record<Category, { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { id: "mm", label: "ミリメートル (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: "cm", label: "センチメートル (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { id: "m", label: "メートル (m)", toBase: (v) => v, fromBase: (v) => v },
    { id: "km", label: "キロメートル (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: "in", label: "インチ (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { id: "ft", label: "フィート (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { id: "mi", label: "マイル (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { id: "mg", label: "ミリグラム (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { id: "g", label: "グラム (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: "kg", label: "キログラム (kg)", toBase: (v) => v, fromBase: (v) => v },
    { id: "t", label: "トン (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: "oz", label: "オンス (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { id: "lb", label: "ポンド (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  ],
  area: [
    { id: "mm2", label: "平方ミリメートル", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { id: "cm2", label: "平方センチメートル", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { id: "m2", label: "平方メートル", toBase: (v) => v, fromBase: (v) => v },
    { id: "ha", label: "ヘクタール", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { id: "km2", label: "平方キロメートル", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { id: "tsubo", label: "坪", toBase: (v) => v * 3.30579, fromBase: (v) => v / 3.30579 },
    { id: "jo", label: "畳", toBase: (v) => v * 1.65289, fromBase: (v) => v / 1.65289 },
  ],
  volume: [
    { id: "ml", label: "ミリリットル (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: "l", label: "リットル (L)", toBase: (v) => v, fromBase: (v) => v },
    { id: "m3", label: "立方メートル", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: "cup", label: "カップ (200mL)", toBase: (v) => v * 0.2, fromBase: (v) => v / 0.2 },
    { id: "go", label: "合", toBase: (v) => v * 0.1804, fromBase: (v) => v / 0.1804 },
    { id: "sho", label: "升", toBase: (v) => v * 1.804, fromBase: (v) => v / 1.804 },
  ],
  temperature: [
    { id: "c", label: "摂氏 (°C)", toBase: (v) => v, fromBase: (v) => v },
    { id: "f", label: "華氏 (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { id: "k", label: "ケルビン (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

export default function UnitConvertClient() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const from = units[category].find((u) => u.id === fromUnit);
    const to = units[category].find((u) => u.id === toUnit);
    if (!from || !to) return "";
    const base = from.toBase(num);
    const converted = to.fromBase(base);
    return converted.toLocaleString("ja-JP", { maximumFractionDigits: 10 });
  }, [category, fromUnit, toUnit, value]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(units[cat][0].id);
    setToUnit(units[cat][1].id);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">単位変換</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📏</div>
          <h1 className="text-3xl font-bold text-kon mb-2">単位変換</h1>
          <p className="text-gray-600 text-lg">長さ・重さ・面積・体積・温度</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state="idle" message="変換したい単位を選んでね！" />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === cat.id ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">変換元</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon"
              >
                {units[category].map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon text-xl"
                placeholder="0"
              />
            </div>

            <div className="flex justify-center">
              <button onClick={swap} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                ⇄
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">変換先</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon"
              >
                {units[category].map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              <div className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl text-xl font-bold">
                {result || "0"}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
