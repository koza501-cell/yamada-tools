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

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface Props {
  faq: FAQ[];
  seoContent?: SeoContent;
}

type ConversionMode = "seireki-to-wareki" | "wareki-to-seireki";
type Era = "meiji" | "taisho" | "showa" | "heisei" | "reiwa";

interface EraInfo {
  name: string;
  nameKanji: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number | null;
  endMonth: number | null;
  endDay: number | null;
}

const eras: Record<Era, EraInfo> = {
  meiji: {
    name: "meiji",
    nameKanji: "明治",
    startYear: 1868,
    startMonth: 1,
    startDay: 25,
    endYear: 1912,
    endMonth: 7,
    endDay: 29,
  },
  taisho: {
    name: "taisho",
    nameKanji: "大正",
    startYear: 1912,
    startMonth: 7,
    startDay: 30,
    endYear: 1926,
    endMonth: 12,
    endDay: 24,
  },
  showa: {
    name: "showa",
    nameKanji: "昭和",
    startYear: 1926,
    startMonth: 12,
    startDay: 25,
    endYear: 1989,
    endMonth: 1,
    endDay: 7,
  },
  heisei: {
    name: "heisei",
    nameKanji: "平成",
    startYear: 1989,
    startMonth: 1,
    startDay: 8,
    endYear: 2019,
    endMonth: 4,
    endDay: 30,
  },
  reiwa: {
    name: "reiwa",
    nameKanji: "令和",
    startYear: 2019,
    startMonth: 5,
    startDay: 1,
    endYear: null,
    endMonth: null,
    endDay: null,
  },
};

const eraOrder: Era[] = ["meiji", "taisho", "showa", "heisei", "reiwa"];

export default function WarekiSeirekiClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [mode, setMode] = useState<ConversionMode>("seireki-to-wareki");
  const [seirekiYear, setSeirekiYear] = useState<string>("");
  const [seirekiMonth, setSeirekiMonth] = useState<string>("");
  const [seirekiDay, setSeirekiDay] = useState<string>("");
  const [selectedEra, setSelectedEra] = useState<Era>("reiwa");
  const [warekiYear, setWarekiYear] = useState<string>("");
  const [warekiMonth, setWarekiMonth] = useState<string>("");
  const [warekiDay, setWarekiDay] = useState<string>("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("日付を選んで変換してね！");

  // Seireki to Wareki conversion
  const seirekiToWarekiResult = useMemo(() => {
    const year = parseInt(seirekiYear);
    const month = parseInt(seirekiMonth) || 1;
    const day = parseInt(seirekiDay) || 1;
    
    if (isNaN(year) || year < 1868) return null;
    
    const inputDate = new Date(year, month - 1, day);
    
    // Find matching era
    for (let i = eraOrder.length - 1; i >= 0; i--) {
      const era = eras[eraOrder[i]];
      const eraStart = new Date(era.startYear, era.startMonth - 1, era.startDay);
      
      if (inputDate >= eraStart) {
        const eraYear = year - era.startYear + 1;
        return {
          era: era.nameKanji,
          year: eraYear,
          yearDisplay: eraYear === 1 ? "元" : eraYear.toString(),
          month,
          day,
          fullDisplay: `${era.nameKanji}${eraYear === 1 ? "元" : eraYear}年${month}月${day}日`,
        };
      }
    }
    return null;
  }, [seirekiYear, seirekiMonth, seirekiDay]);

  // Wareki to Seireki conversion
  const warekiToSeirekiResult = useMemo(() => {
    const year = parseInt(warekiYear);
    const month = parseInt(warekiMonth) || 1;
    const day = parseInt(warekiDay) || 1;
    
    if (isNaN(year) || year < 1) return null;
    
    const era = eras[selectedEra];
    const seirekiYearValue = era.startYear + year - 1;
    
    // Check if date is valid for the era
    const inputDate = new Date(seirekiYearValue, month - 1, day);
    const eraStart = new Date(era.startYear, era.startMonth - 1, era.startDay);
    
    if (inputDate < eraStart) return null;
    
    if (era.endYear) {
      const eraEnd = new Date(era.endYear, era.endMonth! - 1, era.endDay!);
      if (inputDate > eraEnd) return null;
    }
    
    return {
      year: seirekiYearValue,
      month,
      day,
      fullDisplay: `${seirekiYearValue}年${month}月${day}日`,
    };
  }, [selectedEra, warekiYear, warekiMonth, warekiDay]);

  // Calculate age
  const calculateAge = (year: number, month: number, day: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = useMemo(() => {
    if (mode === "seireki-to-wareki" && seirekiToWarekiResult) {
      return calculateAge(parseInt(seirekiYear), parseInt(seirekiMonth) || 1, parseInt(seirekiDay) || 1);
    } else if (mode === "wareki-to-seireki" && warekiToSeirekiResult) {
      return calculateAge(warekiToSeirekiResult.year, warekiToSeirekiResult.month, warekiToSeirekiResult.day);
    }
    return null;
  }, [mode, seirekiYear, seirekiMonth, seirekiDay, seirekiToWarekiResult, warekiToSeirekiResult]);

  // Update mascot
  const hasResult = mode === "seireki-to-wareki" ? seirekiToWarekiResult : warekiToSeirekiResult;
  
  const handleConvert = () => {
    if (hasResult) {
      setMascotState("success")
      triggerSuccess('wareki-seireki');;
      if (age !== null && age >= 0) {
        setMascotMessage(`変換完了！${age}歳だね！`);
      } else {
        setMascotMessage("変換完了！");
      }
    } else {
      setMascotState("error");
      setMascotMessage("正しい日付を入力してね！");
    }
  };

  const handleClear = () => {
    setSeirekiYear("");
    setSeirekiMonth("");
    setSeirekiDay("");
    setWarekiYear("");
    setWarekiMonth("");
    setWarekiDay("");
    setMascotState("idle");
    setMascotMessage("日付を選んで変換してね！");
  };

  const handleCopy = async () => {
    let text = "";
    if (mode === "seireki-to-wareki" && seirekiToWarekiResult) {
      text = seirekiToWarekiResult.fullDisplay;
    } else if (mode === "wareki-to-seireki" && warekiToSeirekiResult) {
      text = warekiToSeirekiResult.fullDisplay;
    }
    
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setMascotMessage("コピーしました！");
      } catch {
        setMascotMessage("コピーに失敗しました...");
      }
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const seirekiYears = Array.from({ length: currentYear - 1868 + 2 }, (_, i) => currentYear + 1 - i);
  
  const getWarekiMaxYear = (era: Era): number => {
    const eraInfo = eras[era];
    if (eraInfo.endYear) {
      return eraInfo.endYear - eraInfo.startYear + 1;
    }
    return currentYear - eraInfo.startYear + 2;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-kon mb-2">和暦・西暦変換</h1>
          <p className="text-gray-600 text-lg">令和・平成・昭和・大正・明治 ↔ 西暦</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">🎂 年齢計算</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">変換モード</label>
            <div className="flex gap-4">
              <button
                onClick={() => { setMode("seireki-to-wareki"); handleClear(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "seireki-to-wareki"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                西暦 → 和暦
              </button>
              <button
                onClick={() => { setMode("wareki-to-seireki"); handleClear(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "wareki-to-seireki"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                和暦 → 西暦
              </button>
            </div>
          </div>

          {/* Input Area */}
          {mode === "seireki-to-wareki" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">西暦</label>
              <div className="flex gap-2 items-center flex-wrap">
                <select
                  value={seirekiYear}
                  onChange={(e) => setSeirekiYear(e.target.value)}
                  className="w-28 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">年</option>
                  {seirekiYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="text-gray-600">年</span>
                <select
                  value={seirekiMonth}
                  onChange={(e) => setSeirekiMonth(e.target.value)}
                  className="w-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="text-gray-600">月</span>
                <select
                  value={seirekiDay}
                  onChange={(e) => setSeirekiDay(e.target.value)}
                  className="w-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">日</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="text-gray-600">日</span>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">和暦</label>
              <div className="flex gap-2 items-center flex-wrap">
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value as Era)}
                  className="w-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  {eraOrder.map(era => (
                    <option key={era} value={era}>{eras[era].nameKanji}</option>
                  ))}
                </select>
                <select
                  value={warekiYear}
                  onChange={(e) => setWarekiYear(e.target.value)}
                  className="w-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">年</option>
                  <option value="1">元</option>
                  {Array.from({ length: getWarekiMaxYear(selectedEra) - 1 }, (_, i) => i + 2).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="text-gray-600">年</span>
                <select
                  value={warekiMonth}
                  onChange={(e) => setWarekiMonth(e.target.value)}
                  className="w-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="text-gray-600">月</span>
                <select
                  value={warekiDay}
                  onChange={(e) => setWarekiDay(e.target.value)}
                  className="w-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                >
                  <option value="">日</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="text-gray-600">日</span>
              </div>
            </div>
          )}

          {/* Result Area */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-700 mb-4 text-center">変換結果</h3>
            
            {mode === "seireki-to-wareki" ? (
              <div className="text-center">
                {seirekiToWarekiResult ? (
                  <>
                    <div className="text-4xl font-bold text-kon mb-2">
                      {seirekiToWarekiResult.fullDisplay}
                    </div>
                    <div className="text-gray-500">
                      西暦 {seirekiYear}年{seirekiMonth || 1}月{seirekiDay || 1}日
                    </div>
                    {age !== null && age >= 0 && (
                      <div className="mt-4 inline-block bg-sakura px-4 py-2 rounded-full">
                        <span className="text-kon font-bold">🎂 {age}歳</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">西暦を選択してください</div>
                )}
              </div>
            ) : (
              <div className="text-center">
                {warekiToSeirekiResult ? (
                  <>
                    <div className="text-4xl font-bold text-kon mb-2">
                      {warekiToSeirekiResult.fullDisplay}
                    </div>
                    <div className="text-gray-500">
                      {eras[selectedEra].nameKanji}{warekiYear === "1" ? "元" : warekiYear}年{warekiMonth || 1}月{warekiDay || 1}日
                    </div>
                    {age !== null && age >= 0 && (
                      <div className="mt-4 inline-block bg-sakura px-4 py-2 rounded-full">
                        <span className="text-kon font-bold">🎂 {age}歳</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">和暦を選択してください</div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConvert}
              className="flex-1 py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
            >
              変換する
            </button>
            <button
              onClick={handleCopy}
              disabled={!hasResult}
              className={`flex-1 py-4 rounded-xl font-bold transition-colors ${
                hasResult
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              結果をコピー
            </button>
            <button
              onClick={handleClear}
              className="py-4 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              クリア
            </button>
          </div>
        </section>

        {/* Era Reference Table */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">元号早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-3 text-left">元号</th>
                  <th className="py-2 px-3 text-left">開始</th>
                  <th className="py-2 px-3 text-left">終了</th>
                  <th className="py-2 px-3 text-left">期間</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-medium">明治</td>
                  <td className="py-2 px-3">1868年1月25日</td>
                  <td className="py-2 px-3">1912年7月29日</td>
                  <td className="py-2 px-3">45年間</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-medium">大正</td>
                  <td className="py-2 px-3">1912年7月30日</td>
                  <td className="py-2 px-3">1926年12月24日</td>
                  <td className="py-2 px-3">15年間</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-medium">昭和</td>
                  <td className="py-2 px-3">1926年12月25日</td>
                  <td className="py-2 px-3">1989年1月7日</td>
                  <td className="py-2 px-3">64年間</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 font-medium">平成</td>
                  <td className="py-2 px-3">1989年1月8日</td>
                  <td className="py-2 px-3">2019年4月30日</td>
                  <td className="py-2 px-3">31年間</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">令和</td>
                  <td className="py-2 px-3">2019年5月1日</td>
                  <td className="py-2 px-3">現在</td>
                  <td className="py-2 px-3">継続中</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>変換モード（西暦→和暦 または 和暦→西暦）を選択</li>
            <li>年・月・日を選択</li>
            <li>「変換する」ボタンをクリック</li>
            <li>結果と年齢が表示されます</li>
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
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-bold text-sm mb-1">プライバシー保護</h3>
            <p className="text-xs text-gray-500">データはサーバーに送信されません</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🎂</div>
            <h3 className="font-bold text-sm mb-1">年齢計算</h3>
            <p className="text-xs text-gray-500">生年月日から年齢も自動計算</p>
          </div>
        </section>
        {/* Direct Answer Block for AI/SEO */}
        <section className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold text-kon mb-4">📊 和暦・西暦 変換早見表</h2>
          <p className="text-gray-600 mb-4 text-sm">主要な年号の変換表です。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">和暦</th>
                  <th className="px-3 py-2 text-left">西暦</th>
                  <th className="px-3 py-2 text-left">期間</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-3 py-2 font-bold">令和1年</td><td className="px-3 py-2">2019年</td><td className="px-3 py-2 text-gray-500">2019年5月1日〜</td></tr>
                <tr><td className="px-3 py-2 font-bold">平成1年</td><td className="px-3 py-2">1989年</td><td className="px-3 py-2 text-gray-500">1989年1月8日〜2019年4月30日</td></tr>
                <tr><td className="px-3 py-2 font-bold">昭和1年</td><td className="px-3 py-2">1926年</td><td className="px-3 py-2 text-gray-500">1926年12月25日〜1989年1月7日</td></tr>
                <tr><td className="px-3 py-2 font-bold">大正1年</td><td className="px-3 py-2">1912年</td><td className="px-3 py-2 text-gray-500">1912年7月30日〜1926年12月24日</td></tr>
                <tr><td className="px-3 py-2 font-bold">明治1年</td><td className="px-3 py-2">1868年</td><td className="px-3 py-2 text-gray-500">1868年1月25日〜1912年7月29日</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">※ 例: 令和6年 = 2024年、平成10年 = 1998年、昭和50年 = 1975年</p>
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
