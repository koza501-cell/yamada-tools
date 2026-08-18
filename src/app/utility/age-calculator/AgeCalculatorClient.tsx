"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type InputMode = "western" | "japanese";
type Era = "令和" | "平成" | "昭和" | "大正" | "明治";

interface Milestone {
  label: string;
  age: number;
  year: number;
  done: boolean;
  yearsLeft: number;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
  kazoeDoShi: number;
  totalDays: number;
  totalHours: number;
  zodiac: string;
  zodiacReading: string;
  generation: string;
  nextBirthday: string;
  daysUntilBirthday: number;
  nextAge: number;
  birthdayWestern: string;
  birthdayJapanese: string;
  baseDateStr: string;
  milestones: Milestone[];
  isBirthdayToday: boolean;
}

// ─── Era conversion ───────────────────────────────────────────────────────────

const ERA_DATA: Record<Era, { offset: number; startYear: number; startMonth: number; startDay: number; endYear: number; endMonth: number; endDay: number }> = {
  明治: { offset: 1867, startYear: 1868, startMonth: 1, startDay: 1,  endYear: 1912, endMonth: 7,  endDay: 29 },
  大正: { offset: 1911, startYear: 1912, startMonth: 7, startDay: 30, endYear: 1926, endMonth: 12, endDay: 24 },
  昭和: { offset: 1925, startYear: 1926, startMonth: 12,startDay: 25, endYear: 1989, endMonth: 1,  endDay: 7  },
  平成: { offset: 1988, startYear: 1989, startMonth: 1, startDay: 8,  endYear: 2019, endMonth: 4,  endDay: 30 },
  令和: { offset: 2018, startYear: 2019, startMonth: 5, startDay: 1,  endYear: 9999, endMonth: 12, endDay: 31 },
};

function eraYearToWestern(era: Era, eraYear: number): number {
  return eraYear + ERA_DATA[era].offset;
}

function westernToJapanese(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  const eras: Array<{ era: Era; start: Date }> = [
    { era: "令和", start: new Date(2019, 4, 1) },
    { era: "平成", start: new Date(1989, 0, 8) },
    { era: "昭和", start: new Date(1926, 11, 25) },
    { era: "大正", start: new Date(1912, 6, 30) },
    { era: "明治", start: new Date(1868, 0, 1) },
  ];
  for (const { era, start } of eras) {
    if (d >= start) {
      const eraYear = year - ERA_DATA[era].offset;
      const eraYearStr = eraYear === 1 ? "元" : String(eraYear);
      return `${era}${eraYearStr}年${month}月${day}日`;
    }
  }
  return `${year}年${month}月${day}日`;
}

// ─── Zodiac ───────────────────────────────────────────────────────────────────

const ZODIAC_ANIMALS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC_READINGS = ["ね", "うし", "とら", "う", "たつ", "み", "うま", "ひつじ", "さる", "とり", "いぬ", "い"];

function getZodiac(year: number): { kanji: string; reading: string } {
  const idx = (year + 8) % 12;
  return { kanji: ZODIAC_ANIMALS[idx], reading: ZODIAC_READINGS[idx] };
}

// ─── Generation ───────────────────────────────────────────────────────────────

function getGeneration(year: number): string {
  if (year >= 2013) return "α世代";
  if (year >= 1995) return "Z世代";
  if (year >= 1980) return "ミレニアル世代";
  if (year >= 1965) return "バブル世代・しらけ世代";
  if (year >= 1946) return "団塊の世代";
  return "戦前・戦中世代";
}

// ─── Calculation ─────────────────────────────────────────────────────────────

function calcAge(birthYear: number, birthMonth: number, birthDay: number, baseDate: Date): AgeResult {
  const bday = new Date(birthYear, birthMonth - 1, birthDay);
  const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

  let years = base.getFullYear() - birthYear;
  let months = base.getMonth() + 1 - birthMonth;
  let days = base.getDate() - birthDay;

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(base.getFullYear(), base.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // 数え年: birth year = 1, add 1 each Jan 1
  const kazoeDoShi = base.getFullYear() - birthYear + 1;

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((base.getTime() - bday.getTime()) / msPerDay);
  const totalHours = totalDays * 24;

  const isBirthdayToday = base.getMonth() + 1 === birthMonth && base.getDate() === birthDay;

  let nextBdayDate = new Date(base.getFullYear(), birthMonth - 1, birthDay);
  if (nextBdayDate <= base) {
    nextBdayDate = new Date(base.getFullYear() + 1, birthMonth - 1, birthDay);
  }
  const daysUntilBirthday = isBirthdayToday
    ? 0
    : Math.ceil((nextBdayDate.getTime() - base.getTime()) / msPerDay);
  const nextAge = years + 1;
  const nextBirthdayStr = `${nextBdayDate.getFullYear()}年${nextBdayDate.getMonth() + 1}月${nextBdayDate.getDate()}日`;

  const zodiac = getZodiac(birthYear);
  const generation = getGeneration(birthYear);

  const milestoneAges = [
    { label: "成人", age: 20 },
    { label: "定年（60歳）", age: 60 },
    { label: "年金受給（65歳）", age: 65 },
    { label: "後期高齢者（75歳）", age: 75 },
  ];
  const milestones: Milestone[] = milestoneAges.map(({ label, age }) => {
    const done = years >= age;
    return {
      label,
      age,
      year: birthYear + age,
      done,
      yearsLeft: done ? 0 : age - years,
    };
  });

  return {
    years,
    months,
    days,
    kazoeDoShi,
    totalDays,
    totalHours,
    zodiac: zodiac.kanji,
    zodiacReading: zodiac.reading,
    generation,
    nextBirthday: nextBirthdayStr,
    daysUntilBirthday,
    nextAge,
    birthdayWestern: `${birthYear}年${birthMonth}月${birthDay}日`,
    birthdayJapanese: westernToJapanese(birthYear, birthMonth, birthDay),
    baseDateStr: `${base.getFullYear()}年${base.getMonth() + 1}月${base.getDate()}日`,
    milestones,
    isBirthdayToday,
  };
}

function todayStr(): string {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ERAS: Era[] = ["令和", "平成", "昭和", "大正", "明治"];

export default function AgeCalculatorPage() {
  const [inputMode, setInputMode] = useState<InputMode>("western");
  const [westernDate, setWesternDate] = useState("");
  const [era, setEra] = useState<Era>("昭和");
  const [eraYear, setEraYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [baseDate, setBaseDate] = useState(todayStr());
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  function handleCalc() {
    setError("");

    let bYear: number, bMonth: number, bDay: number;

    if (inputMode === "western") {
      if (!westernDate) { setError("生年月日を入力してください。"); return; }
      const parts = westernDate.split("-");
      bYear = parseInt(parts[0]);
      bMonth = parseInt(parts[1]);
      bDay = parseInt(parts[2]);
    } else {
      if (!eraYear || !birthMonth || !birthDay) { setError("元号・年・月・日をすべて入力してください。"); return; }
      const ey = parseInt(eraYear);
      if (isNaN(ey) || ey < 1) { setError("年を正しく入力してください。"); return; }
      bYear = eraYearToWestern(era, ey);
      bMonth = parseInt(birthMonth);
      bDay = parseInt(birthDay);

      const eraInfo = ERA_DATA[era];
      const startDate = new Date(eraInfo.startYear, eraInfo.startMonth - 1, eraInfo.startDay);
      const endDate = new Date(eraInfo.endYear, eraInfo.endMonth - 1, eraInfo.endDay);
      const inputDate = new Date(bYear, bMonth - 1, bDay);
      if (inputDate < startDate || inputDate > endDate) {
        setError(`${era}の範囲外の日付です。入力した元号と年を確認してください。`);
        return;
      }
    }

    if (isNaN(bYear!) || isNaN(bMonth!) || isNaN(bDay!)) { setError("日付を正しく入力してください。"); return; }
    if (bYear! < 1868 || bYear! > 2100) { setError("1868年以降の生年月日を入力してください。"); return; }
    if (bMonth! < 1 || bMonth! > 12) { setError("月は1〜12で入力してください。"); return; }
    if (bDay! < 1 || bDay! > 31) { setError("日は1〜31で入力してください。"); return; }

    const base = baseDate ? new Date(baseDate) : new Date();
    const bdate = new Date(bYear!, bMonth! - 1, bDay!);
    if (bdate > base) { setError("生年月日が計算基準日より後になっています。"); return; }

    const res = calcAge(bYear!, bMonth!, bDay!, base);
    setResult(res);
    setTimeout(() => {
      document.getElementById("age-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setInputMode("western");
    setWesternDate("");
    setEra("昭和");
    setEraYear("");
    setBirthMonth("");
    setBirthDay("");
    setBaseDate(todayStr());
    setResult(null);
    setError("");
  }

  const eraMaxYear = ERA_DATA[era].endYear - ERA_DATA[era].offset;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/utility" className="hover:text-ai">日常生活・便利ツール</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-700">年齢計算機</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">年齢計算機（和暦・西暦対応）</h1>
          <p className="text-sm text-gray-600 mt-1">
            令和・平成・昭和・大正・明治の和暦入力対応｜干支・世代・次の誕生日・マイルストーン表示
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Ad — top */}
        <AdUnit slot="age-calculator-top" className="mb-6" />

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">

          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            生年月日を入力
          </h2>

          {/* Input mode toggle */}
          <div className="mb-4">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
              <button type="button"
                onClick={() => setInputMode("western")}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  inputMode === "western" ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                西暦で入力
              </button>
              <button type="button"
                onClick={() => setInputMode("japanese")}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  inputMode === "japanese" ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                和暦で入力
              </button>
            </div>
          </div>

          {inputMode === "western" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生年月日 <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={westernDate}
                onChange={(e) => setWesternDate(e.target.value)}
                min="1868-01-01"
                max={todayStr()}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生年月日 <span className="text-danger">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={era}
                  onChange={(e) => { setEra(e.target.value as Era); setEraYear(""); }}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
                >
                  {ERAS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={eraYear}
                    onChange={(e) => setEraYear(e.target.value)}
                    placeholder="年"
                    min={1}
                    max={eraMaxYear}
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
                  />
                  <span className="text-gray-600 text-sm">年</span>
                </div>

                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>

                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
                >
                  <option value="">日</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}日</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Section 2: 計算基準日 */}
          <h2 className="font-bold text-gray-900 mb-3 mt-6 flex items-center gap-2">
            <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
            計算基準日
            <span className="text-gray-400 font-normal text-sm">（任意）</span>
          </h2>
          <div className="mb-1">
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon text-gray-900"
            />
          </div>
          <p className="text-xs text-gray-500 mb-5">
            特定の日付時点での年齢を計算したい場合に変更してください（デフォルト: 今日）
          </p>

          {error && (
            <div className="bg-gray-50 border border-gray-200 text-danger rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          <button type="button"
            onClick={handleCalc}
            className="w-full bg-kon hover:bg-ai text-white font-bold py-3.5 rounded-xl text-lg transition-colors"
          >
            年齢を計算する
          </button>
        </div>

        {/* Results */}
        {result && (
          <div id="age-result">

            {/* Big age display */}
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6 mb-4">
              {result.isBirthdayToday && (
                <div className="bg-sakura/30 border border-sakura rounded-lg px-4 py-2 mb-4 text-center text-sakura font-semibold text-sm">
                  🎂 お誕生日おめでとうございます！
                </div>
              )}
              <div className="text-xs font-semibold text-indigo-500 mb-2">現在の年齢</div>
              <div className="flex items-baseline gap-1 flex-wrap mb-4">
                <span className="text-6xl font-bold text-indigo-700">{result.years}</span>
                <span className="text-2xl font-bold text-indigo-600">歳</span>
                <span className="text-3xl font-bold text-indigo-500 ml-2">{result.months}</span>
                <span className="text-lg font-bold text-indigo-500">ヶ月</span>
                <span className="text-3xl font-bold text-indigo-500 ml-2">{result.days}</span>
                <span className="text-lg font-bold text-indigo-500">日</span>
              </div>
              <div className="space-y-1 text-sm text-indigo-700">
                <div>
                  <span className="text-indigo-500">生年月日: </span>
                  <span className="font-semibold">{result.birthdayWestern}</span>
                  <span className="text-indigo-500 ml-2">（{result.birthdayJapanese}）</span>
                </div>
                <div>
                  <span className="text-indigo-500">計算基準日: </span>
                  <span className="font-semibold">{result.baseDateStr}</span>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                詳細情報
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "満年齢", value: `${result.years}歳` },
                    { label: "数え年", value: `${result.kazoeDoShi}歳` },
                    { label: "生きた日数", value: `${result.totalDays.toLocaleString()}日` },
                    { label: "生きた時間", value: `約${result.totalHours.toLocaleString()}時間` },
                    { label: "干支", value: `${result.zodiac}（${result.zodiacReading}）` },
                    { label: "世代", value: result.generation },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 text-gray-500 w-2/5">{row.label}</td>
                      <td className="py-2.5 font-semibold text-gray-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 次の誕生日 */}
            <div className="bg-sakura/30 border border-sakura rounded-xl p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                次の誕生日
              </h3>
              {result.isBirthdayToday ? (
                <div className="text-center py-2">
                  <div className="text-2xl font-bold text-sakura mb-1">🎂 今日が誕生日です！</div>
                  <div className="text-sm text-sakura">{result.years}歳のお誕生日おめでとうございます</div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-sakura">あと{result.daysUntilBirthday}日</span>
                  </div>
                  <div className="text-sm text-sakura">
                    {result.nextBirthday} — {result.nextAge}歳になります
                  </div>
                </div>
              )}
            </div>

            {/* マイルストーン */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                年齢マイルストーン
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-gray-600">マイルストーン</th>
                      <th className="py-2 px-3 text-right text-gray-600">年齢</th>
                      <th className="py-2 px-3 text-right text-gray-600">予定年 / 状態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.milestones.map((m) => (
                      <tr key={m.label} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 px-3 text-gray-700">{m.label}</td>
                        <td className="py-2.5 px-3 text-right text-gray-900 font-medium">{m.age}歳</td>
                        <td className="py-2.5 px-3 text-right">
                          {m.done ? (
                            <span className="text-green-600 font-medium">✓ 済み（{m.year}年）</span>
                          ) : (
                            <span className="text-kon font-medium">あと{m.yearsLeft}年（{m.year}年）</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad — mid */}
            <AdUnit slot="age-calculator-mid" className="mb-4" />

            {/* Reset */}
            <button type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors mb-6"
            >
              もう一度計算する
            </button>
          </div>
        )}

        {/* SEO: 和暦・西暦 変換早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">和暦・西暦 変換早見表（昭和・平成・令和）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600">西暦</th>
                  <th className="py-2 px-3 text-left text-gray-600">和暦</th>
                  <th className="py-2 px-3 text-left text-gray-600">西暦</th>
                  <th className="py-2 px-3 text-left text-gray-600">和暦</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1926年", "昭和元年", "1989年", "平成元年"],
                  ["1930年", "昭和5年",  "1990年", "平成2年"],
                  ["1940年", "昭和15年", "1995年", "平成7年"],
                  ["1950年", "昭和25年", "2000年", "平成12年"],
                  ["1960年", "昭和35年", "2010年", "平成22年"],
                  ["1970年", "昭和45年", "2019年", "令和元年"],
                  ["1980年", "昭和55年", "2020年", "令和2年"],
                  ["1985年", "昭和60年", "2025年", "令和7年"],
                  ["1988年", "昭和63年", "2026年", "令和8年"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-700">{row[0]}</td>
                    <td className="py-2 px-3 font-medium text-gray-900">{row[1]}</td>
                    <td className="py-2 px-3 text-gray-700">{row[2]}</td>
                    <td className="py-2 px-3 font-medium text-gray-900">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: 年齢計算の基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">年齢計算の基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">満年齢と数え年の違い</h3>
              <p className="leading-relaxed">
                日本では現在「満年齢」が一般的です。満年齢は誕生日に1歳加算される数え方です。
                数え年は生まれた年を1歳として、元旦（1月1日）に1歳加算される伝統的な数え方です。
                現代では公的書類・法律ではすべて満年齢が使われます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">和暦（元号）について</h3>
              <p className="leading-relaxed">
                日本独自の年号制度で、天皇の即位に合わせて改元されます。
                現在は「令和」（2019年5月1日〜）。
                昭和・平成生まれの方は公的書類で和暦を使う場面が多くあります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">年齢計算に関する法律</h3>
              <p className="leading-relaxed">
                「年齢のとなえ方に関する法律」（1950年）により、
                日本では誕生日の前日に年齢が加算されます。
                ただし一般的な感覚では誕生日当日に加算と考えて問題ありません。
              </p>
            </div>
          </div>
        </div>

        {/* SEO: FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {[
              {
                q: "和暦と西暦の変換はどうやるのですか？",
                a: "令和は西暦から2018を引くと和暦年になります（2026年→令和8年）。平成は西暦から1988を引きます（2000年→平成12年）。昭和は西暦から1925を引きます（1980年→昭和55年）。本ツールでは自動変換されますので、どちらで入力しても正確な結果が得られます。",
              },
              {
                q: "数え年とは何ですか？",
                a: "数え年は生まれた年を「1歳」として、毎年1月1日に1歳加算する日本の伝統的な年齢の数え方です。現代では法律・公的書類では満年齢が使われますが、年祝い（還暦・古希等）や一部の慣習では数え年が使われます。満年齢より1〜2歳多くなります。",
              },
              {
                q: "誕生日の計算はいつ切り替わりますか？",
                a: "法律上は誕生日の前日の深夜0時（誕生日前日が終わる瞬間）に年齢が加算されます。例えば4月1日生まれの方は3月31日に年齢が上がるため、小学校の入学が前年生まれの子と同じになります（いわゆる「早生まれ」）。",
              },
              {
                q: "満年齢で何歳になるか素早く計算するには？",
                a: "今年の誕生日が過ぎていれば「今年の西暦 - 生まれ年の西暦」が満年齢です。誕生日がまだの場合は「今年の西暦 - 生まれ年の西暦 - 1」になります。今日の日付と誕生日を自動比較して正確に計算できます。",
              },
              {
                q: "平成から令和への切り替わりはいつですか？",
                a: "令和元年は2019年5月1日から始まりました。2019年1月1日〜4月30日は平成31年、2019年5月1日以降が令和元年です。同一年に2つの元号が存在するため、2019年生まれの方は生まれ月によって平成生まれか令和生まれかが変わります。",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <dt className="font-semibold text-gray-900 mb-1">Q. {faq.q}</dt>
                <dd className="text-gray-700 text-sm leading-relaxed">A. {faq.a}</dd>
              </div>
            ))}
          </div>
        </div>

        {/* あわせて使えるツール */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="space-y-2">
            {[
              { href: "/utility/date-calculator", label: "日付・日数 計算機" },
              { href: "/utility/hourly-to-annual", label: "時給→年収換算ツール" },
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-ai hover:bg-gray-50 transition-colors text-kon text-sm font-medium"
              >
                <span>→</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
