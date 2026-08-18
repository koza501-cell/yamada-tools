"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { CitationsSection } from "@/components/CitationsSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CycleRow {
  cycles: number;
  time: string;
  sleepHours: number;
  label: string;
  emoji: string;
  isRecommended: boolean;
}

interface CalcResult {
  mode: "wake" | "sleep";
  fixedTime: string;
  rows: CycleRow[];
  hasSleepData: boolean;
  weeklyDebt: number;
  dailyShortageMin: number;
  socialJetlag: number;
  ageGroup: string;
  recommendedHours: number;
  minHours: number;
  weekdaySleepHours: number;
  weekendSleepHours: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AGE_RECS: Record<string, { label: string; recommended: number; min: number; range: string }> = {
  teen:     { label: "10代",    recommended: 9,   min: 8,   range: "8〜10時間" },
  twenties: { label: "20〜30代", recommended: 8,   min: 7,   range: "7〜9時間" },
  forties:  { label: "40〜50代", recommended: 7.5, min: 7,   range: "7〜8時間" },
  sixties:  { label: "60代以上", recommended: 7.5, min: 7,   range: "7〜8時間" },
};

const FALL_ASLEEP_OPTIONS = [
  { value: 15, label: "約15分" },
  { value: 30, label: "約30分（標準）" },
  { value: 45, label: "約45分" },
  { value: 60, label: "約60分" },
];

const CYCLE_META: Record<number, { label: string; emoji: string; isRecommended: boolean }> = {
  3: { label: "非推奨",   emoji: "⚠️", isRecommended: false },
  4: { label: "最低限",   emoji: "✅", isRecommended: false },
  5: { label: "最適",     emoji: "⭐", isRecommended: true },
  6: { label: "たっぷり", emoji: "😴", isRecommended: false },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentTimeHHMM(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(totalMin: number): string {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatSleepHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}時間0分`;
  return `${h}時間${m}分`;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calculate(
  mode: "wake" | "sleep",
  wakeTime: string,
  sleepTime: string,
  fallAsleepMin: number,
  ageGroup: string,
  weekdaySleepStr: string,
  weekendSleepStr: string
): CalcResult {
  const ageRec = AGE_RECS[ageGroup];
  let rows: CycleRow[];

  if (mode === "wake") {
    const wakeMin = timeToMinutes(wakeTime);
    const fallAsleepAt = wakeMin - fallAsleepMin;
    rows = [6, 5, 4, 3].map((cycles) => {
      const bedtimeMin = fallAsleepAt - cycles * 90;
      const meta = CYCLE_META[cycles];
      return {
        cycles,
        time: minutesToHHMM(bedtimeMin),
        sleepHours: cycles * 1.5,
        label: meta.label,
        emoji: meta.emoji,
        isRecommended: meta.isRecommended,
      };
    });
  } else {
    const sleepMin = timeToMinutes(sleepTime);
    const fallAsleepAt = sleepMin + fallAsleepMin;
    rows = [3, 4, 5, 6].map((cycles) => {
      const wakeAtMin = fallAsleepAt + cycles * 90;
      const meta = CYCLE_META[cycles];
      return {
        cycles,
        time: minutesToHHMM(wakeAtMin),
        sleepHours: cycles * 1.5,
        label: meta.label,
        emoji: meta.emoji,
        isRecommended: meta.isRecommended,
      };
    });
  }

  const weekdaySleepHours = parseFloat(weekdaySleepStr);
  const weekendSleepHours = parseFloat(weekendSleepStr);
  const hasSleepData = !isNaN(weekdaySleepHours) && weekdaySleepStr !== "";

  let weeklyDebt = 0;
  let dailyShortageMin = 0;
  let socialJetlag = 0;

  if (hasSleepData) {
    const shortage = ageRec.recommended - weekdaySleepHours;
    if (shortage > 0) {
      weeklyDebt = shortage * 5;
      dailyShortageMin = Math.round(shortage * 60);
    }
    if (!isNaN(weekendSleepHours) && weekendSleepStr !== "") {
      socialJetlag = weekendSleepHours - weekdaySleepHours;
    }
  }

  return {
    mode,
    fixedTime: mode === "wake" ? wakeTime : sleepTime,
    rows,
    hasSleepData,
    weeklyDebt,
    dailyShortageMin,
    socialJetlag,
    ageGroup,
    recommendedHours: ageRec.recommended,
    minHours: ageRec.min,
    weekdaySleepHours: hasSleepData ? weekdaySleepHours : 0,
    weekendSleepHours: !isNaN(weekendSleepHours) ? weekendSleepHours : 0,
  };
}

// ─── Static SEO Table ─────────────────────────────────────────────────────────

const SEO_TABLE_ROWS = [
  { wake: "5:00", c4: "22:30", c5: "21:00", c6: "19:30" },
  { wake: "6:00", c4: "23:30", c5: "22:00", c6: "20:30" },
  { wake: "6:30", c4: "0:00",  c5: "22:30", c6: "21:00" },
  { wake: "7:00", c4: "0:30",  c5: "23:00", c6: "21:30" },
  { wake: "7:30", c4: "1:00",  c5: "23:30", c6: "22:00" },
  { wake: "8:00", c4: "1:30",  c5: "0:00",  c6: "22:30" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SleepCalculatorPage() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState(getCurrentTimeHHMM);
  const [fallAsleepMin, setFallAsleepMin] = useState(30);
  const [ageGroup, setAgeGroup] = useState("twenties");
  const [weekdaySleep, setWeekdaySleep] = useState("");
  const [weekendSleep, setWeekendSleep] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    const timeVal = mode === "wake" ? wakeTime : sleepTime;
    if (!timeVal) {
      setError("時刻を入力してください。");
      return;
    }
    const res = calculate(mode, wakeTime, sleepTime, fallAsleepMin, ageGroup, weekdaySleep, weekendSleep);
    setResult(res);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setWakeTime("07:00");
    setSleepTime(getCurrentTimeHHMM());
    setFallAsleepMin(30);
    setAgeGroup("twenties");
    setWeekdaySleep("");
    setWeekendSleep("");
    setResult(null);
    setError("");
  }

  const faqItems = [
    { question: "何時間寝れば十分ですか？", answer: "成人（20〜60代）は6〜8時間が推奨です。睡眠サイクル（90分×5回＝7.5時間）を意識すると目覚めがスッキリします。昼間に眠気を感じず集中力が維持できる時間が個人の適正睡眠時間です。" },
    { question: "休日に寝溜めをしても大丈夫ですか？", answer: "平日と休日で2時間以上ずれると社会的時差ぼけが起きます。月曜朝がつらい原因になります。毎日同じ時間に起きることが体内時計を整える最善の方法です。" },
    { question: "短時間睡眠でも大丈夫な人がいるのはなぜですか？", answer: "遺伝的なショートスリーパーは人口の1〜3%程度です。多くの人は睡眠不足に慣れているだけで認知機能が低下していることを自覚できていないケースが多いです。" },
    { question: "昼寝はどのくらいの時間が理想ですか？", answer: "15〜30分（最長45分以内）が理想です。30分以上眠ると深い睡眠に入り目覚めが悪くなります。正午〜午後3時の間に取ることをお勧めします。" },
    { question: "寝つきが悪い場合の対策はありますか？", answer: "就寝1〜2時間前のぬるめのお風呂・スマートフォンのブルーライトを避ける・部屋を18〜22℃に保つ・午後2時以降のカフェインを控える、などが効果的です。" },
  ];

  const useCases = [
    { icon: "⏰", persona: "スッキリ目覚めたい方", title: "起床時刻から逆算した就寝時刻を知りたい", benefit: "90分サイクルに合わせた最適な就寝タイミングを提案" },
    { icon: "💤", persona: "睡眠時間が短い方", title: "限られた時間で最大限休む方法を知りたい", benefit: "4.5時間・6時間など短い睡眠の最適パターンを確認" },
    { icon: "🌞", persona: "昼寝を活用したい方", title: "仮眠の最適な長さと時刻を知りたい", benefit: "パワーナップ20分vs90分の効果の違いを確認" },
  ];


  const citations = [
    { name: "厚生労働省「健康づくりのための睡眠ガイド2023」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/suimin/index.html", description: "成人・高齢者・子どもの推奨睡眠時間の根拠" },
  ];

  return (
    <>
      <IntroSection title="睡眠時間最適化ツール" paragraphs={["起床時刻から逆算した最適な就寝時刻、または就寝時刻から最適な起床時刻がわかります。90分の睡眠サイクル（レム睡眠・ノンレム睡眠）に基づいて複数の候補時刻を提示。", "目覚めやすいタイミングで起きることで、スッキリ目覚められます。仮眠（パワーナップ）の最適時間も確認できます。", "登録不要・完全無料。睡眠の質改善や早起きの習慣化に取り組む方に最適です。"]} />
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/health" className="hover:text-ai">健康・ウェルネス</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-800">睡眠時間 最適化ツール</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">睡眠時間 最適化ツール</h1>
          <p className="text-gray-600 mt-1 text-sm">
            90分の睡眠サイクルに合わせた最適な就寝・起床時刻を計算。睡眠負債チェック・ソーシャルジェットラグ診断付き。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AdUnit slot="top" className="my-2" />

        {/* Calculator Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Mode Toggle */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">計算モードを選択</p>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 w-full">
              <button type="button"
                onClick={() => { setMode("wake"); setResult(null); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  mode === "wake"
                    ? "bg-kon text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                起きる時刻 → 就寝時刻を計算
              </button>
              <button type="button"
                onClick={() => { setMode("sleep"); setResult(null); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-l border-gray-200 ${
                  mode === "sleep"
                    ? "bg-kon text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                寝る時刻 → 起床時刻を計算
              </button>
            </div>
          </div>

          {/* Time Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {mode === "wake" ? "起床予定時刻" : "就寝予定時刻"}
              </label>
              {mode === "wake" ? (
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-kon"
                />
              ) : (
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-kon"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                入眠までの時間
                <span className="ml-1 text-xs font-normal text-gray-400 cursor-help" title="布団に入ってから眠りにつくまでの時間">(?)</span>
              </label>
              <select
                value={fallAsleepMin}
                onChange={(e) => setFallAsleepMin(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon bg-white"
              >
                {FALL_ASLEEP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">布団に入ってから眠りにつくまでの時間</p>
            </div>
          </div>

          {/* Sleep Debt Section */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">睡眠負債チェック（任意）</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">年齢層</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon bg-white"
                >
                  <option value="teen">10代（推奨8〜10時間）</option>
                  <option value="twenties">20〜30代（推奨7〜9時間）</option>
                  <option value="forties">40〜50代（推奨7〜8時間）</option>
                  <option value="sixties">60代以上（推奨7〜8時間）</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">平日の平均睡眠時間</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={weekdaySleep}
                      onChange={(e) => setWeekdaySleep(e.target.value)}
                      placeholder="例: 6.5"
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-28 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon"
                    />
                    <span className="text-gray-600 text-sm">時間</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">休日の平均睡眠時間</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={weekendSleep}
                      onChange={(e) => setWeekendSleep(e.target.value)}
                      placeholder="例: 8.0"
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-28 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon"
                    />
                    <span className="text-gray-600 text-sm">時間</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="button"
              onClick={handleCalculate}
              className="flex-1 bg-kon hover:bg-ai text-white font-bold py-3 rounded-xl text-base transition-colors"
            >
              計算する
            </button>
            <button type="button"
              onClick={handleReset}
              className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section id="results" className="space-y-4">
            {/* Section 1: Cycle Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {result.mode === "wake"
                  ? `${result.fixedTime} に起きるなら、就寝時刻は...`
                  : `${result.fixedTime} に寝るなら、起床時刻は...`}
              </h2>
              <p className="text-xs text-gray-400 mb-4">90分サイクルに合わせた最適時刻</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 text-gray-500 font-medium">睡眠サイクル</th>
                      <th className="text-center py-2 px-2 text-gray-500 font-medium">
                        {result.mode === "wake" ? "就寝時刻" : "起床時刻"}
                      </th>
                      <th className="text-center py-2 px-2 text-gray-500 font-medium">睡眠時間</th>
                      <th className="text-center py-2 px-2 text-gray-500 font-medium">おすすめ度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row) => (
                      <tr
                        key={row.cycles}
                        className={`border-b last:border-0 ${
                          row.isRecommended
                            ? "bg-green-50 border-green-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-2 font-medium text-gray-700">
                          {row.cycles}サイクル
                          {row.isRecommended && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">推奨</span>
                          )}
                        </td>
                        <td className={`py-3 px-2 text-center font-mono font-bold text-xl ${row.isRecommended ? "text-green-700" : "text-gray-800"}`}>
                          {row.time}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-600">
                          {formatSleepHours(row.sleepHours)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            row.isRecommended
                              ? "bg-green-100 text-green-700"
                              : row.cycles === 3
                              ? "bg-gray-50 text-danger"
                              : row.cycles === 4
                              ? "bg-gray-50 text-kon"
                              : "bg-gray-50 text-kon"
                          }`}>
                            {row.emoji} {row.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Sleep Debt */}
            {result.hasSleepData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">睡眠負債チェック</h2>
                <div className="space-y-3">
                  {result.weeklyDebt > 0 ? (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-2xl flex-shrink-0">🔴</span>
                      <div>
                        <p className="font-semibold text-danger">週に約{result.weeklyDebt.toFixed(1)}時間の睡眠負債があります</p>
                        <p className="text-sm text-danger mt-0.5">
                          毎日約{result.dailyShortageMin}分の睡眠不足が積み重なっています
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                      <span className="text-2xl flex-shrink-0">🟢</span>
                      <div>
                        <p className="font-semibold text-green-700">十分な睡眠が取れています。この習慣を続けましょう！</p>
                      </div>
                    </div>
                  )}
                  {result.socialJetlag > 2 && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-2xl flex-shrink-0">🟠</span>
                      <div>
                        <p className="font-semibold text-kon">「社会的時差ぼけ」の状態です</p>
                        <p className="text-sm text-kon mt-0.5">
                          休日に平日より{result.socialJetlag.toFixed(1)}時間多く寝ているため、週明けに頭が重い・だるい原因かもしれません。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Age Recommendation Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">年齢別推奨睡眠時間</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 text-gray-500 font-medium">年齢層</th>
                      <th className="text-center py-2 px-2 text-gray-500 font-medium">推奨睡眠時間</th>
                      {result.hasSleepData && (
                        <>
                          <th className="text-center py-2 px-2 text-gray-500 font-medium">あなたの睡眠</th>
                          <th className="text-center py-2 px-2 text-gray-500 font-medium">判定</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(AGE_RECS).map(([key, rec]) => {
                      const isSelected = key === result.ageGroup;
                      let judgment = "";
                      let judgmentColor = "";
                      if (isSelected && result.hasSleepData) {
                        if (result.weekdaySleepHours >= rec.recommended) {
                          judgment = "◎"; judgmentColor = "text-green-600";
                        } else if (result.weekdaySleepHours >= rec.min) {
                          judgment = "△"; judgmentColor = "text-yellow-500";
                        } else {
                          judgment = "×"; judgmentColor = "text-danger";
                        }
                      }
                      return (
                        <tr
                          key={key}
                          className={`border-b last:border-0 ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="py-2.5 px-2 font-medium text-gray-700">
                            {rec.label}
                            {isSelected && <span className="ml-1 text-xs text-kon">（あなた）</span>}
                          </td>
                          <td className="py-2.5 px-2 text-center text-gray-600">{rec.range}</td>
                          {result.hasSleepData && (
                            <>
                              <td className="py-2.5 px-2 text-center text-gray-600">
                                {isSelected ? `${result.weekdaySleepHours}時間` : "—"}
                              </td>
                              <td className={`py-2.5 px-2 text-center font-bold text-lg ${isSelected ? judgmentColor : "text-gray-300"}`}>
                                {isSelected ? judgment : "—"}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Sleep Quality Advice */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">睡眠の質を上げるアドバイス</h2>
              <ul className="space-y-3">
                {[
                  "毎日同じ時間に起きることが体内時計を整える最重要ポイントです。",
                  "就寝1〜2時間前のスマートフォン・PCの使用を控えましょう。",
                  "寝室の温度は18〜22℃、湿度50〜60%が理想的です。",
                  "カフェインは就寝6時間前から控えましょう。",
                  ...(result.weeklyDebt > 0
                    ? ["週末に一気に寝坊して補おうとすると社会的時差ぼけになります。毎日30分早く寝る方が効果的です。"]
                    : []),
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-kon mt-0.5 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <AdUnit slot="mid" className="my-2" />

        {/* SEO Section 1: Reference Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">睡眠サイクル 起床時刻別 最適就寝時刻早見表</h2>
          <p className="text-xs text-gray-400 mb-4">入眠まで30分として計算</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-2.5 px-3 text-gray-600 font-semibold">起床時刻</th>
                  <th className="text-center py-2.5 px-3 text-gray-600 font-semibold">
                    6時間後<br /><span className="text-xs font-normal text-gray-400">（4サイクル）</span>
                  </th>
                  <th className="text-center py-2.5 px-3 text-kon font-semibold">
                    7.5時間後<br /><span className="text-xs font-normal text-kon">（5サイクル）推奨</span>
                  </th>
                  <th className="text-center py-2.5 px-3 text-gray-600 font-semibold">
                    9時間後<br /><span className="text-xs font-normal text-gray-400">（6サイクル）</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {SEO_TABLE_ROWS.map((r, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-semibold text-gray-800">{r.wake}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{r.c4}就寝</td>
                    <td className="py-2.5 px-3 text-center text-kon font-medium">{r.c5}就寝</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{r.c6}就寝</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO Section 2: Basics */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">睡眠サイクルの基礎知識</h2>
          <div className="space-y-5 text-gray-700 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">睡眠サイクルとは</h3>
              <p>
                人間の睡眠は約90分を1サイクルとして繰り返されます。1サイクルの中にノンレム睡眠（深い眠り）とレム睡眠（浅い眠り・夢を見る）が含まれています。サイクルの境目（レム睡眠の終わり）に起きると、スッキリと目覚めやすくなります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">なぜ睡眠サイクルに合わせると良いのか</h3>
              <p>
                深いノンレム睡眠中に無理やり起きると、「睡眠慣性」と呼ばれる強い眠気・だるさが生じます。一方、サイクルの切れ目（浅い眠り）で起きると自然に目が覚め、頭もスッキリします。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">理想的な睡眠時間</h3>
              <p>
                厚生労働省の睡眠指針では、成人に6〜8時間の睡眠を推奨しています。睡眠サイクルで考えると、4サイクル（6時間）が最低限、5サイクル（7.5時間）が最も一般的な推奨、6サイクル（9時間）がたっぷり睡眠（休日等）です。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">睡眠負債とは</h3>
              <p>
                毎日少しずつ睡眠が不足することで積み重なる「睡眠の借金」です。週に10時間の睡眠負債は、認知機能・集中力・免疫機能に影響することが研究で示されています。週末に寝溜めをしても、睡眠負債は完全には解消されません。
              </p>
            </div>
          </div>
        </section>

        {/* SEO Section 3: FAQ */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: "何時間寝れば十分ですか？",
                a: "厚生労働省の推奨では成人（20〜60代）は6〜8時間です。ただし個人差があり、6時間で十分な人もいれば9時間必要な人もいます。目安は昼間に眠気を感じず、集中力が維持できる睡眠時間です。睡眠サイクル（90分×5回＝7.5時間）を意識すると目覚めがスッキリします。",
              },
              {
                q: "休日に寝溜めをしても大丈夫ですか？",
                a: "短期的な睡眠負債の補填には効果がありますが、平日と休日で睡眠時間が2時間以上ずれると「社会的時差ぼけ（ソーシャルジェットラグ）」が起きます。月曜日の朝がつらい・頭が重いのはこれが原因の場合があります。毎日同じ時間に起きることが体内時計を整える最善の方法です。",
              },
              {
                q: "短時間睡眠でも大丈夫な人がいるのはなぜですか？",
                a: "遺伝的に短時間睡眠で問題ない「ショートスリーパー」は人口の1〜3%程度存在すると言われています。しかし多くの人が「睡眠不足に慣れている」だけで、実際には認知機能が低下していることを自覚できていないケースが多いです。自分がショートスリーパーだと過信しないことが重要です。",
              },
              {
                q: "昼寝はどのくらいの時間が理想ですか？",
                a: "昼寝は15〜30分（最長でも45分以内）が理想です。30分以上眠ると深いノンレム睡眠に入り、目覚めが悪くなります。また夕方以降の昼寝は夜の睡眠を妨げます。昼寝は正午〜午後3時の間に取ることをお勧めします。",
              },
              {
                q: "寝つきが悪い場合の対策はありますか？",
                a: "効果的な対策は①就寝1〜2時間前にぬるめのお風呂（38〜40℃）に入る（深部体温が下がり眠くなる）②スマートフォンのブルーライトを避ける③部屋を暗くして18〜22℃に保つ④カフェインを午後2時以降控える⑤寝床でスマホを見ない、などです。",
              },
            ].map((item, i) => (
              <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-4 py-3.5 font-semibold text-gray-800 text-sm hover:bg-gray-50 list-none flex justify-between items-center">
                  <span>Q. {item.q}</span>
                  <span className="text-gray-400 ml-2 flex-shrink-0">▾</span>
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* SEO Section 4: Related Tools */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機", desc: "身長・体重からBMIと肥満度を判定" },
              { href: "/health/calorie-calculator", label: "基礎代謝・カロリー計算機", desc: "TDEE・目標カロリー・PFC比率を自動計算" },
              { href: "/health/alcohol-calculator", label: "アルコール分解時間計算機", desc: "飲酒量から分解時間を計算" },
              { href: "/health/ideal-weight-calculator", label: "標準体重・肥満度 判定ツール", desc: "年齢・性別別の標準体重を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:border-ai hover:bg-gray-50 transition-colors group"
              >
                <span className="text-kon mt-0.5 flex-shrink-0 group-hover:text-ai">→</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-ai">{tool.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit slot="bottom" className="my-2" />
      </div>
    </main>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
