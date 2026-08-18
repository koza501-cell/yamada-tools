"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { CitationsSection } from "@/components/CitationsSection";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_LEVELS = [
  { value: "1.2", label: "ほぼ座っている（デスクワーク中心）", short: "座り仕事中心" },
  { value: "1.375", label: "軽い運動（週1〜2回）", short: "軽い運動" },
  { value: "1.55", label: "中程度の運動（週3〜5回）", short: "中程度の運動" },
  { value: "1.725", label: "ハードな運動（週6〜7回）", short: "ハードな運動" },
  { value: "1.9", label: "アスリートレベル（1日2回以上）", short: "アスリート" },
];

const PACE_OPTIONS_LOSS = [
  { value: "240", label: "ゆっくり（月1kg）" },
  { value: "480", label: "標準（月2kg）" },
  { value: "720", label: "速め（月3kg）※健康的な上限" },
];

const PACE_OPTIONS_GAIN = [
  { value: "240", label: "ゆっくり（月1kg）" },
  { value: "480", label: "標準（月2kg）" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcResult {
  bmr: number;
  tdee: number;
  targetCal: number;
  calDiff: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  proteinKcal: number;
  fatKcal: number;
  carbKcal: number;
  goalDays: number | null;
  goalDate: string | null;
  goalMonths: number | null;
  goalKgDiff: number | null;
  calorieWarning: boolean;
  activityLabel: string;
  goal: string;
  paceLabel: string;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calcCalories(
  gender: "male" | "female",
  age: number,
  heightCm: number,
  weightKg: number,
  activityMultiplier: number,
  goal: "lose" | "maintain" | "gain",
  pace: number,
  goalWeightKg: number | null,
  activityLabel: string,
  paceLabel: string
): CalcResult {
  // BMR (Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * activityMultiplier;

  const minCal = gender === "male" ? 1200 : 1000;
  let targetCal: number;
  let calorieWarning = false;

  if (goal === "maintain") {
    targetCal = tdee;
  } else if (goal === "lose") {
    targetCal = Math.max(minCal, tdee - pace);
    if (tdee - pace < minCal) calorieWarning = true;
  } else {
    targetCal = tdee + pace;
  }

  const calDiff = targetCal - tdee;

  // PFC — derive rounded grams from ratio, then kcal from rounded grams
  // so displayed "Xg × multiplier = Ykcal" is always consistent
  const proteinG = Math.round(targetCal * 0.25 / 4);
  const fatG = Math.round(targetCal * 0.25 / 9);
  const carbG = Math.round(targetCal * 0.50 / 4);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = carbG * 4;

  // Goal simulation
  let goalDays: number | null = null;
  let goalDate: string | null = null;
  let goalMonths: number | null = null;
  let goalKgDiff: number | null = null;

  if (goalWeightKg !== null && goal !== "maintain") {
    goalKgDiff = goalWeightKg - weightKg;
    const dailyDiff = Math.abs(calDiff);
    if (dailyDiff > 0) {
      const totalKcal = Math.abs(goalKgDiff) * 7200;
      goalDays = Math.round(totalKcal / dailyDiff);
      goalMonths = Math.round(goalDays / 30 * 10) / 10;
      const d = new Date();
      d.setDate(d.getDate() + goalDays);
      goalDate = `${d.getFullYear()}年${d.getMonth() + 1}月頃`;
    }
  }

  const goalLabel = goal === "lose" ? "減量" : goal === "gain" ? "増量" : "維持";

  return {
    bmr, tdee, targetCal, calDiff,
    proteinG, fatG, carbG,
    proteinKcal, fatKcal, carbKcal,
    goalDays, goalDate, goalMonths, goalKgDiff,
    calorieWarning,
    activityLabel,
    goal: goalLabel,
    paceLabel,
  };
}

function fmt(n: number, d = 0): string {
  return n.toFixed(d);
}

function fmtKcal(n: number): string {
  return Math.round(n).toLocaleString();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("lose");
  const [goalWeight, setGoalWeight] = useState("");
  const [pace, setPace] = useState("480");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleCalc() {
    setError("");
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const act = parseFloat(activity);
    const p = parseFloat(pace);

    if (!age || !height || !weight || isNaN(a) || isNaN(h) || isNaN(w)) {
      setError("年齢・身長・体重を入力してください。");
      return;
    }
    if (a < 10 || a > 90) { setError("年齢は10〜90で入力してください。"); return; }
    if (h < 50 || h > 250) { setError("身長は50〜250cmで入力してください。"); return; }
    if (w < 10 || w > 300) { setError("体重は10〜300kgで入力してください。"); return; }

    let gw: number | null = null;
    if (goal !== "maintain" && goalWeight) {
      gw = parseFloat(goalWeight);
      if (isNaN(gw) || gw < 10 || gw > 300) {
        setError("目標体重は10〜300kgで入力してください。");
        return;
      }
    }

    const actLabel = ACTIVITY_LEVELS.find((l) => l.value === activity)?.short ?? "";
    const paceOpts = goal === "gain" ? PACE_OPTIONS_GAIN : PACE_OPTIONS_LOSS;
    const paceLabel = paceOpts.find((l) => l.value === pace)?.label ?? "";

    setResult(calcCalories(gender, a, h, w, act, goal, p, gw, actLabel, paceLabel));
    setTimeout(() => {
      document.getElementById("calorie-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setActivity("1.55");
    setGoal("lose");
    setGoalWeight("");
    setPace("480");
    setResult(null);
    setError("");
  }

  const paceOptions = goal === "gain" ? PACE_OPTIONS_GAIN : PACE_OPTIONS_LOSS;

  const goalColor = result
    ? result.goal === "減量" ? "text-kon"
    : result.goal === "増量" ? "text-kon"
    : "text-green-600"
    : "";

  const faqItems = [
    { question: "基礎代謝を上げる方法はありますか？", answer: "最も効果的な方法は筋肉量を増やすことです。筋力トレーニングを週2〜3回行うことで基礎代謝を長期的に高めることができます。十分な睡眠・タンパク質の摂取も重要です。" },
    { question: "カロリー計算だけで痩せられますか？", answer: "カロリー収支が基本ですがPFCバランスも重要です。同じカロリーでもタンパク質・脂質・炭水化物の比率によって筋肉量維持やホルモンバランスが変わります。" },
    { question: "1日1,200kcal以下に減らしても大丈夫ですか？", answer: "女性で1,000kcal・男性で1,200kcal以下の極端な制限は推奨されません。栄養不足・筋肉量低下・代謝低下・リバウンドのリスクが高まります。" },
    { question: "運動しないで食事制限だけで痩せることはできますか？", answer: "カロリー制限だけでも体重は減りますが筋肉量も減少しやすく痩せにくい体になるリスクがあります。有酸素運動と筋トレを組み合わせることが理想です。" },
    { question: "年齢とともに太りやすくなるのはなぜですか？", answer: "加齢により基礎代謝が低下するためです。筋肉量は20代をピークに年間0.5〜1%減少します。対策として筋力トレーニングで筋肉量を維持することが最も効果的です。" },
  ];

  const useCases = [
    { icon: "🥗", persona: "ダイエット中の方", title: "摂取カロリーの目安が知りたい", benefit: "TDEE基準の適切な食事制限カロリーを計算" },
    { icon: "🏋️", persona: "筋トレ・バルクアップ中の方", title: "増量に必要なカロリーとPFC比を知りたい", benefit: "体重・活動量から最適な増量カロリーを算出" },
    { icon: "📊", persona: "健康的な体重維持を目指す方", title: "自分のカロリー消費量を正確に知りたい", benefit: "活動レベル別のTDEEと維持カロリーを確認" },
  ];


  const citations = [
    { name: "厚生労働省「日本人の食事摂取基準（2020年版）」", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html", description: "エネルギー・栄養素の基準値の根拠" },
    { name: "国立健康・栄養研究所", url: "https://www.nibiohn.go.jp/", description: "基礎代謝基準値・身体活動レベル区分の根拠" },
  ];

  return (
    <>
      <IntroSection title="基礎代謝・カロリー計算機" paragraphs={["性別・年齢・身長・体重・活動量から基礎代謝（BMR）と1日の総消費カロリー（TDEE）がわかります。", "目標（減量・維持・増量）に合わせた目標摂取カロリーとPFCバランス（タンパク質・脂質・炭水化物比率）も自動算出。", "登録不要・完全無料。ダイエット・筋肥大・維持食のカロリー管理に最適です。"]} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/health" className="hover:text-ai">健康・ウェルネス</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-700">基礎代謝・カロリー計算機</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">基礎代謝・カロリー計算機</h1>
          <p className="text-sm text-gray-600 mt-1">
            BMR・TDEE・目標カロリー・PFCバランス・達成予定日を自動計算｜登録不要・無料
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Ad — top */}
        <AdUnit slot="calorie-calculator-top" className="mb-6" />

        {/* ── Input Form ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            基本情報を入力
          </h2>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
              <button type="button"
                onClick={() => setGender("male")}
                className={`px-6 py-2 text-sm font-semibold transition-colors ${
                  gender === "male" ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                男性
              </button>
              <button type="button"
                onClick={() => setGender("female")}
                className={`px-6 py-2 text-sm font-semibold transition-colors ${
                  gender === "female" ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                女性
              </button>
            </div>
          </div>

          {/* Age / Height / Weight */}
          <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
            {[
              { label: "年齢", unit: "歳", val: age, set: setAge, placeholder: "35", min: 10, max: 90 },
              { label: "身長", unit: "cm", val: height, set: setHeight, placeholder: "165", min: 50, max: 250 },
              { label: "体重", unit: "kg", val: weight, set: setWeight, placeholder: "60", min: 10, max: 300 },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label} <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    min={f.min}
                    max={f.max}
                    step={f.unit === "歳" ? 1 : 0.1}
                    className="w-full border border-gray-300 rounded-lg px-2 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-kon"
                  />
                  <span className="text-gray-500 text-sm whitespace-nowrap">{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              活動レベル <span className="text-danger">*</span>
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon bg-white"
            >
              {ACTIVITY_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}（×{l.value}）</option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">目標</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "lose", label: "体重を減らしたい", color: "bg-kon" },
                { val: "maintain", label: "体重を維持したい", color: "bg-green-600" },
                { val: "gain", label: "体重を増やしたい", color: "bg-kon" },
              ].map((g) => (
                <button type="button"
                  key={g.val}
                  onClick={() => { setGoal(g.val as "lose" | "maintain" | "gain"); setPace("480"); }}
                  className={`py-2.5 px-2 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    goal === g.val
                      ? `${g.color} text-white border-transparent`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal weight + pace (if not maintain) */}
          {goal !== "maintain" && (
            <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目標体重 <span className="text-gray-400 font-normal">（任意）</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder="例: 55"
                    min={10}
                    max={300}
                    step={0.1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-kon"
                  />
                  <span className="text-gray-500 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目標達成ペース
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-kon bg-white text-sm"
                >
                  {paceOptions.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-gray-50 border border-gray-200 text-danger rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          <button type="button"
            onClick={handleCalc}
            className="w-full bg-kon hover:bg-ai text-white font-bold py-3.5 rounded-xl text-lg transition-colors"
          >
            カロリーを計算する
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div id="calorie-result">

            {/* Warning */}
            {result.calorieWarning && (
              <div className="bg-yellow-50 border border-yellow-400 rounded-xl p-4 mb-4">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ 選択したペースでの目標カロリーが最低摂取カロリーを下回るため、安全な下限（{gender === "male" ? "男性1,200" : "女性1,000"}kcal）に調整しました。
                </p>
              </div>
            )}

            {/* Section 1: 4 metric cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                {
                  label: "基礎代謝（BMR）",
                  value: fmtKcal(result.bmr),
                  sub: "何もしなくても消費するカロリー",
                  bg: "bg-gray-50",
                  textColor: "text-gray-800",
                },
                {
                  label: "消費カロリー（TDEE）",
                  value: fmtKcal(result.tdee),
                  sub: "活動込みの1日の消費カロリー",
                  bg: "bg-gray-50",
                  textColor: "text-kon",
                },
                {
                  label: "目標カロリー",
                  value: fmtKcal(result.targetCal),
                  sub: `目標達成のための摂取カロリー`,
                  bg: result.goal === "減量" ? "bg-green-50" : result.goal === "増量" ? "bg-gray-50" : "bg-green-50",
                  textColor: result.goal === "減量" ? "text-green-800" : result.goal === "増量" ? "text-kon" : "text-green-800",
                },
                {
                  label: "カロリー差",
                  value: `${result.calDiff >= 0 ? "+" : ""}${fmtKcal(result.calDiff)}`,
                  sub: "TDEEとの差（1日あたり）",
                  bg: result.calDiff < 0 ? "bg-gray-50" : result.calDiff > 0 ? "bg-gray-50" : "bg-green-50",
                  textColor: result.calDiff < 0 ? "text-kon" : result.calDiff > 0 ? "text-kon" : "text-green-700",
                },
              ].map((card) => (
                <div key={card.label} className={`${card.bg} rounded-xl p-4 border border-gray-200`}>
                  <div className="text-xs text-gray-500 mb-1">{card.label}</div>
                  <div className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value} <span className="text-sm font-normal">kcal/日</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Section 2: Goal simulation */}
            {result.goalDays !== null && result.goalDate !== null && result.goalKgDiff !== null && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                  目標達成シミュレーション
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">目標体重</div>
                    <div className="text-lg font-bold text-gray-900">{fmt(parseFloat(goalWeight), 1)}kg</div>
                    <div className={`text-xs font-medium mt-0.5 ${goalColor}`}>
                      {result.goalKgDiff >= 0 ? "+" : ""}{fmt(result.goalKgDiff, 1)}kg
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">達成予定</div>
                    <div className="text-base font-bold text-gray-900">{result.goalDate}</div>
                    <div className="text-xs text-gray-400 mt-0.5">約{result.goalDays}日後</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">必要期間</div>
                    <div className="text-lg font-bold text-gray-900">約{result.goalMonths}ヶ月</div>
                    <div className="text-xs text-gray-400 mt-0.5">{result.paceLabel}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: PFC table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                  {result.goalDays !== null ? "2" : "1"}
                </span>
                PFCバランス（1日の目標栄養素）
              </h3>
              {/* PFC visual bars */}
              <div className="flex rounded-full overflow-hidden h-4 mb-3">
                <div className="bg-danger" style={{ width: "25%" }} title="タンパク質 25%" />
                <div className="bg-yellow-400" style={{ width: "25%" }} title="脂質 25%" />
                <div className="bg-kon" style={{ width: "50%" }} title="炭水化物 50%" />
              </div>
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-danger inline-block" />タンパク質 25%</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />脂質 25%</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-kon inline-block" />炭水化物 50%</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-gray-600">栄養素</th>
                      <th className="py-2 px-3 text-right text-gray-600">目標量</th>
                      <th className="py-2 px-3 text-right text-gray-600">カロリー</th>
                      <th className="py-2 px-3 text-right text-gray-600">割合</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-danger font-medium">タンパク質</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{fmt(result.proteinG, 0)}g</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{fmtKcal(result.proteinKcal)}kcal</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">25%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-yellow-600 font-medium">脂質</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{fmt(result.fatG, 0)}g</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{fmtKcal(result.fatKcal)}kcal</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">25%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-kon font-medium">炭水化物</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{fmt(result.carbG, 0)}g</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{fmtKcal(result.carbKcal)}kcal</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">50%</td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-2.5 px-3 text-gray-700">合計</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">—</td>
                      <td className="py-2.5 px-3 text-right text-gray-900">{fmtKcal(result.targetCal)}kcal</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: 食事アドバイス */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                  {result.goalDays !== null ? "3" : "2"}
                </span>
                食事アドバイス
              </h3>
              <div className={`rounded-lg p-4 mb-4 ${
                result.goal === "減量" ? "bg-gray-50 border border-gray-200" :
                result.goal === "増量" ? "bg-gray-50 border border-gray-200" :
                "bg-green-50 border border-green-200"
              }`}>
                <p className={`text-sm leading-relaxed ${
                  result.goal === "減量" ? "text-kon" :
                  result.goal === "増量" ? "text-kon" :
                  "text-green-800"
                }`}>
                  {result.goal === "減量" && (
                    <>1日{fmtKcal(result.targetCal)}kcalを目標に食事管理をしましょう。タンパク質（{fmt(result.proteinG, 0)}g/日）をしっかり摂ることで筋肉量を維持しながら体脂肪を減らせます。急激な制限は避け、無理のないペースで続けることが大切です。</>
                  )}
                  {result.goal === "増量" && (
                    <>1日{fmtKcal(result.targetCal)}kcalを目標に食事をとりましょう。筋肉をつけるためにタンパク質（{fmt(result.proteinG, 0)}g/日）を意識して摂りましょう。筋力トレーニングと組み合わせることで、効率よく筋肉量を増やせます。</>
                  )}
                  {result.goal === "維持" && (
                    <>現在の体重を維持するには1日{fmtKcal(result.targetCal)}kcalが目安です。PFCバランスを意識した食事で、健康的な体重を保ちましょう。定期的な運動も忘れずに。</>
                  )}
                </p>
              </div>
            </div>

            {/* Section 5: 運動カロリー目安 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-kon text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                  {result.goalDays !== null ? "4" : "3"}
                </span>
                目標達成をサポートする運動例
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-gray-600">運動</th>
                      <th className="py-2 px-3 text-right text-gray-600">30分の消費カロリー目安</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "ウォーキング", kcal: "約100〜150kcal" },
                      { name: "ジョギング", kcal: "約200〜300kcal" },
                      { name: "水泳", kcal: "約200〜350kcal" },
                      { name: "自転車", kcal: "約150〜250kcal" },
                      { name: "筋力トレーニング", kcal: "約100〜200kcal" },
                    ].map((ex) => (
                      <tr key={ex.name} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 px-3 text-gray-700">{ex.name}</td>
                        <td className="py-2.5 px-3 text-right text-gray-600">{ex.kcal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad — mid */}
            <AdUnit slot="calorie-calculator-mid" className="mb-4" />

            {/* Reset */}
            <button type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors mb-6"
            >
              もう一度計算する
            </button>
          </div>
        )}

        {/* ─── SEO Content ──────────────────────────────────────────────────── */}

        {/* 年齢別基礎代謝 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">年齢・性別別 基礎代謝の目安</h2>
          <p className="text-xs text-gray-400 mb-4">※身長165cm・体重60kg・中程度の活動レベルの場合</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600">年齢</th>
                  <th className="py-2 px-3 text-right text-kon">男性BMR</th>
                  <th className="py-2 px-3 text-right text-sakura">女性BMR</th>
                  <th className="py-2 px-3 text-right text-kon">男性TDEE</th>
                  <th className="py-2 px-3 text-right text-sakura">女性TDEE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { age: "20代", mBmr: "約1,650", fBmr: "約1,490", mTdee: "約1,980", fTdee: "約1,790" },
                  { age: "30代", mBmr: "約1,600", fBmr: "約1,440", mTdee: "約1,920", fTdee: "約1,730" },
                  { age: "40代", mBmr: "約1,550", fBmr: "約1,390", mTdee: "約1,860", fTdee: "約1,670" },
                  { age: "50代", mBmr: "約1,500", fBmr: "約1,340", mTdee: "約1,800", fTdee: "約1,610" },
                ].map((row) => (
                  <tr key={row.age} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{row.age}</td>
                    <td className="py-2.5 px-3 text-right text-kon">{row.mBmr}kcal</td>
                    <td className="py-2.5 px-3 text-right text-sakura">{row.fBmr}kcal</td>
                    <td className="py-2.5 px-3 text-right text-kon">{row.mTdee}kcal</td>
                    <td className="py-2.5 px-3 text-right text-sakura">{row.fTdee}kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">基礎代謝・カロリーの基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">基礎代謝（BMR）とは</h3>
              <p>呼吸・体温調節・臓器の活動など、生命維持に最低限必要なエネルギー量です。一日中何もしなくても、この分のカロリーは消費されます。体重・身長・年齢・性別によって異なり、加齢とともに低下する傾向があります。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">TDEE（総消費カロリー）とは</h3>
              <p>基礎代謝に日常の活動量を加えた、1日の総エネルギー消費量です。デスクワーク中心の人と運動習慣がある人では同じ体格でも200〜500kcal以上の差があります。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">効果的なダイエットのポイント</h3>
              <p>1日500kcalの摂取制限で月約2kgの減量が理論上可能です。ただし急激な制限は筋肉量低下・リバウンドの原因になります。タンパク質を体重×1.5〜2g/日摂ることで筋肉を守りながら体脂肪だけを減らすことができます。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">PFCバランスとは</h3>
              <p>Protein（タンパク質）・Fat（脂質）・Carbohydrate（炭水化物）の割合のことです。一般的な推奨比率はP:F:C = 25:25:50です。ダイエット時はタンパク質を増やし（30%以上）、炭水化物を若干減らすアプローチが効果的とされています。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {[
              {
                q: "基礎代謝を上げる方法はありますか？",
                a: "基礎代謝を上げる最も効果的な方法は筋肉量を増やすことです。筋肉は脂肪より多くのエネルギーを消費します。筋力トレーニングを週2〜3回行うことで、基礎代謝を長期的に高めることができます。また十分な睡眠・タンパク質の摂取・体を冷やさないことも基礎代謝維持に重要です。",
              },
              {
                q: "カロリー計算だけで痩せられますか？",
                a: "カロリー収支（消費カロリー > 摂取カロリー）が体重減少の基本原則ですが、カロリーだけでなく栄養素のバランスも重要です。同じカロリーでもタンパク質・脂質・炭水化物の比率によって筋肉量の維持・ホルモンバランス・満腹感が変わります。PFCバランスを意識した食事管理がより効果的です。",
              },
              {
                q: "1日1,200kcal以下に減らしても大丈夫ですか？",
                a: "女性で1,000kcal、男性で1,200kcal以下の極端な制限は推奨されません。栄養不足・筋肉量の低下・代謝の低下・リバウンドのリスクが高まります。本ツールでは最低カロリーの下限を設定し、安全な範囲での目標カロリーを表示しています。",
              },
              {
                q: "運動しないで食事制限だけで痩せることはできますか？",
                a: "カロリー制限だけでも体重は減りますが、運動なしでは筋肉量も一緒に減少しやすく「痩せにくい体」になるリスクがあります。理想は有酸素運動（脂肪燃焼）と筋トレ（筋肉維持・代謝向上）を組み合わせることです。運動が難しい場合は、まず食事のPFCバランスを意識することから始めましょう。",
              },
              {
                q: "年齢とともに太りやすくなるのはなぜですか？",
                a: "加齢により基礎代謝が低下するためです。筋肉量は20代をピークに年間0.5〜1%減少し、基礎代謝も10年ごとに約2〜3%低下します。40代以降に同じ食事量でも太りやすくなるのはこのためです。対策としては筋力トレーニングで筋肉量を維持・増加させることが最も効果的です。",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <dt className="font-semibold text-gray-900 mb-2">Q. {faq.q}</dt>
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
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機" },
              { href: "/health/ideal-weight-calculator", label: "標準体重・肥満度 判定ツール" },
              { href: "/health/sleep-calculator", label: "睡眠時間 最適化ツール" },
              { href: "/health/alcohol-calculator", label: "アルコール分解時間計算機" },
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
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
