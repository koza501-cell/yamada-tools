"use client";

import { useState, useEffect } from "react";
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

// Japanese era definitions
const eras = [
  { name: "令和", romaji: "Reiwa", startYear: 2019, startMonth: 5, startDay: 1 },
  { name: "平成", romaji: "Heisei", startYear: 1989, startMonth: 1, startDay: 8 },
  { name: "昭和", romaji: "Showa", startYear: 1926, startMonth: 12, startDay: 25 },
  { name: "大正", romaji: "Taisho", startYear: 1912, startMonth: 7, startDay: 30 },
  { name: "明治", romaji: "Meiji", startYear: 1868, startMonth: 1, startDay: 25 },
];

// Zodiac animals
const zodiacAnimals = [
  { name: "子", animal: "ねずみ", emoji: "🐭" },
  { name: "丑", animal: "うし", emoji: "🐮" },
  { name: "寅", animal: "とら", emoji: "🐯" },
  { name: "卯", animal: "うさぎ", emoji: "🐰" },
  { name: "辰", animal: "たつ", emoji: "🐲" },
  { name: "巳", animal: "へび", emoji: "🐍" },
  { name: "午", animal: "うま", emoji: "🐴" },
  { name: "未", animal: "ひつじ", emoji: "🐑" },
  { name: "申", animal: "さる", emoji: "🐵" },
  { name: "酉", animal: "とり", emoji: "🐔" },
  { name: "戌", animal: "いぬ", emoji: "🐶" },
  { name: "亥", animal: "いのしし", emoji: "🐗" },
];

const getZodiac = (year: number) => {
  const index = (year - 4) % 12;
  return zodiacAnimals[index >= 0 ? index : index + 12];
};

const isValidDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const warekiToSeireki = (era: string, eraYear: number, month: number, day: number): { year: number; valid: boolean; error?: string } => {
  const eraInfo = eras.find(e => e.name === era);
  if (!eraInfo) return { year: 0, valid: false, error: "不明な年号です" };
  
  const year = eraInfo.startYear + eraYear - 1;
  
  if (!isValidDate(year, month, day)) {
    return { year: 0, valid: false, error: "無効な日付です" };
  }
  
  // Check if date is within era range
  const inputDate = new Date(year, month - 1, day);
  const eraStart = new Date(eraInfo.startYear, eraInfo.startMonth - 1, eraInfo.startDay);
  
  if (inputDate < eraStart) {
    return { year: 0, valid: false, error: `${era}${eraYear}年${month}月${day}日は存在しません` };
  }
  
  // Check if date is before next era
  const eraIndex = eras.findIndex(e => e.name === era);
  if (eraIndex > 0) {
    const nextEra = eras[eraIndex - 1];
    const nextEraStart = new Date(nextEra.startYear, nextEra.startMonth - 1, nextEra.startDay);
    if (inputDate >= nextEraStart) {
      return { year: 0, valid: false, error: `この日付は${nextEra.name}に該当します` };
    }
  }
  
  return { year, valid: true };
};

const seirekiToWareki = (year: number, month: number, day: number): { era: string; eraYear: number; valid: boolean; error?: string } => {
  if (!isValidDate(year, month, day)) {
    return { era: "", eraYear: 0, valid: false, error: "無効な日付です" };
  }
  
  const inputDate = new Date(year, month - 1, day);
  
  for (const era of eras) {
    const eraStart = new Date(era.startYear, era.startMonth - 1, era.startDay);
    if (inputDate >= eraStart) {
      const eraYear = year - era.startYear + 1;
      return { era: era.name, eraYear, valid: true };
    }
  }
  
  return { era: "", eraYear: 0, valid: false, error: "明治以前の日付には対応していません" };
};

export default function DateConverterClient({
 faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [mode, setMode] = useState<"wareki-to-seireki" | "seireki-to-wareki">("wareki-to-seireki");
  
  // Wareki inputs
  const [selectedEra, setSelectedEra] = useState("令和");
  const [eraYear, setEraYear] = useState(1);
  const [warekiMonth, setWarekiMonth] = useState(1);
  const [warekiDay, setWarekiDay] = useState(1);
  
  // Seireki inputs
  const [seirekiYear, setSeirekiYear] = useState(2019);
  const [seirekiMonth, setSeirekiMonth] = useState(1);
  const [seirekiDay, setSeirekiDay] = useState(1);
  
  // Results
  const [result, setResult] = useState<string>("");
  const [zodiac, setZodiac] = useState<typeof zodiacAnimals[0] | null>(null);
  const [error, setError] = useState<string>("");
  
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("和暦と西暦を変換するよ！");

  const convert = () => {
    setError("");
    setResult("");
    setZodiac(null);
    
    if (mode === "wareki-to-seireki") {
      const converted = warekiToSeireki(selectedEra, eraYear, warekiMonth, warekiDay);
      if (converted.valid) {
        const z = getZodiac(converted.year);
        setResult(`西暦 ${converted.year}年${warekiMonth}月${warekiDay}日`);
        setZodiac(z);
        setMascotState("success")
      triggerSuccess('date-converter');;
        setMascotMessage(`${converted.year}年は${z.animal}年だよ！${z.emoji}`);
      } else {
        setError(converted.error || "変換エラー");
        setMascotState("error");
        setMascotMessage(converted.error || "変換できなかったよ...");
      }
    } else {
      const converted = seirekiToWareki(seirekiYear, seirekiMonth, seirekiDay);
      if (converted.valid) {
        const z = getZodiac(seirekiYear);
        const yearDisplay = converted.eraYear === 1 ? "元" : converted.eraYear.toString();
        setResult(`${converted.era}${yearDisplay}年${seirekiMonth}月${seirekiDay}日`);
        setZodiac(z);
        setMascotState("success")
      triggerSuccess('date-converter');;
        setMascotMessage(`${converted.era}${yearDisplay}年だよ！${z.emoji}`);
      } else {
        setError(converted.error || "変換エラー");
        setMascotState("error");
        setMascotMessage(converted.error || "変換できなかったよ...");
      }
    }
  };

  const setToday = () => {
    const today = new Date();
    if (mode === "wareki-to-seireki") {
      const converted = seirekiToWareki(today.getFullYear(), today.getMonth() + 1, today.getDate());
      if (converted.valid) {
        setSelectedEra(converted.era);
        setEraYear(converted.eraYear);
        setWarekiMonth(today.getMonth() + 1);
        setWarekiDay(today.getDate());
      }
    } else {
      setSeirekiYear(today.getFullYear());
      setSeirekiMonth(today.getMonth() + 1);
      setSeirekiDay(today.getDate());
    }
    setMascotMessage("今日の日付をセットしたよ！");
  };

  // Quick era presets
  const quickDates = [
    { label: "今日", action: setToday },
    { label: "令和元年", action: () => { setMode("wareki-to-seireki"); setSelectedEra("令和"); setEraYear(1); setWarekiMonth(5); setWarekiDay(1); }},
    { label: "平成元年", action: () => { setMode("wareki-to-seireki"); setSelectedEra("平成"); setEraYear(1); setWarekiMonth(1); setWarekiDay(8); }},
    { label: "昭和64年", action: () => { setMode("wareki-to-seireki"); setSelectedEra("昭和"); setEraYear(64); setWarekiMonth(1); setWarekiDay(7); }},
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-kon mb-2">和暦西暦変換</h1>
          <p className="text-gray-600 text-lg">令和・平成・昭和・大正・明治を変換</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔄 双方向変換</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🐲 干支表示</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("wareki-to-seireki"); setResult(""); setError(""); setMascotState("idle"); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                mode === "wareki-to-seireki"
                  ? "bg-kon text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              和暦 → 西暦
            </button>
            <button
              onClick={() => { setMode("seireki-to-wareki"); setResult(""); setError(""); setMascotState("idle"); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                mode === "seireki-to-wareki"
                  ? "bg-kon text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              西暦 → 和暦
            </button>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">クイック入力</label>
            <div className="flex flex-wrap gap-2">
              {quickDates.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="px-3 py-1 bg-sakura/30 text-kon rounded-full text-sm hover:bg-sakura/50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          {mode === "wareki-to-seireki" ? (
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">年号</label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  >
                    {eras.map(era => (
                      <option key={era.name} value={era.name}>{era.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">年</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={eraYear}
                    onChange={(e) => setEraYear(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月</label>
                  <select
                    value={warekiMonth}
                    onChange={(e) => setWarekiMonth(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}月</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日</label>
                  <select
                    value={warekiDay}
                    onChange={(e) => setWarekiDay(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}日</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">西暦年</label>
                <input
                  type="number"
                  min="1868"
                  max="2100"
                  value={seirekiYear}
                  onChange={(e) => setSeirekiYear(parseInt(e.target.value) || 2019)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月</label>
                  <select
                    value={seirekiMonth}
                    onChange={(e) => setSeirekiMonth(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}月</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日</label>
                  <select
                    value={seirekiDay}
                    onChange={(e) => setSeirekiDay(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}日</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={convert}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            🔄 変換する
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-danger">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && !error && (
            <div className="mt-6 bg-gradient-to-br from-sakura/30 to-kon/10 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">変換結果</p>
              <p className="text-2xl font-bold text-kon mb-4">{result}</p>
              
              {zodiac && (
                <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-3xl">{zodiac.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-kon">{zodiac.name}年（{zodiac.animal}どし）</p>
                    <p className="text-sm text-gray-500">干支</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Era Reference Table */}
        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">📋 年号早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left text-gray-600">年号</th>
                  <th className="py-2 text-left text-gray-600">開始日</th>
                  <th className="py-2 text-left text-gray-600">西暦</th>
                </tr>
              </thead>
              <tbody>
                {eras.map(era => (
                  <tr key={era.name} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{era.name}（{era.romaji}）</td>
                    <td className="py-2">{era.startYear}年{era.startMonth}月{era.startDay}日</td>
                    <td className="py-2">{era.startYear}年〜</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">💡 こんな時に使えます</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <span>📄</span>
              <span>書類作成時の日付確認</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎂</span>
              <span>生年月日の変換</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📝</span>
              <span>履歴書の年号記入</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏛️</span>
              <span>歴史的な日付の確認</span>
            </div>
          </div>
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
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-bold text-sm mb-1">双方向変換</h3>
            <p className="text-xs text-gray-500">和暦↔西暦どちらも</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🐲</div>
            <h3 className="font-bold text-sm mb-1">干支表示</h3>
            <p className="text-xs text-gray-500">十二支も確認可能</p>
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
