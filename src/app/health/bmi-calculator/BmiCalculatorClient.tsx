"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { CitationsSection } from "@/components/CitationsSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcResult {
  bmi: number;
  label: string;
  labelShort: string;
  degree: string;
  colorClass: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  gaugePosition: number; // 0-100%
  idealWeight: number;
  beautyWeight: number;
  minHealthWeight: number;
  maxHealthWeight: number;
  diffFromIdeal: number;
  advice: string;
  riskLevel: string;
  risks: string[];
  goalBmi: number | null;
  goalLabel: string | null;
  goalDiff: number | null;
}

// ─── BMI Gauge ─────────────────────────────────────────────────────────────────
// Scale: BMI 10 → 45 (range = 35)
const GAUGE_MIN = 10;
const GAUGE_MAX = 45;

function bmiToGaugePct(bmi: number): number {
  const clamped = Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, bmi));
  return ((clamped - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100;
}

// Segment widths as % of total bar
// <18.5 | 18.5-25 | 25-30 | 30-35 | 35-40 | 40+
const SEG = {
  lean: ((18.5 - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100,        // 0–24.3%
  normal: ((25 - 18.5) / (GAUGE_MAX - GAUGE_MIN)) * 100,             // 24.3–42.9%
  ob1: ((30 - 25) / (GAUGE_MAX - GAUGE_MIN)) * 100,                  // 42.9–57.1%
  ob2: ((35 - 30) / (GAUGE_MAX - GAUGE_MIN)) * 100,                  // 57.1–71.4%
  ob3: ((40 - 35) / (GAUGE_MAX - GAUGE_MIN)) * 100,                  // 71.4–85.7%
  ob4: ((GAUGE_MAX - 40) / (GAUGE_MAX - GAUGE_MIN)) * 100,           // 85.7–100%
};

// ─── Calculation ──────────────────────────────────────────────────────────────

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return {
    label: "低体重（やせ）", labelShort: "低体重", degree: "やせ",
    colorClass: "text-blue-600", colorBg: "bg-blue-50", colorBorder: "border-blue-400", colorText: "text-blue-700",
    riskLevel: "注意", advice: "体重がやや低めです。栄養バランスの良い食事を心がけ、タンパク質・カルシウムをしっかり摂りましょう。急激な体重増加は避け、必要に応じて医療機関にご相談ください。",
    risks: ["栄養不足・貧血のリスク", "骨粗しょう症のリスク", "免疫機能低下のリスク", "若い女性の場合は生殖機能への影響も"],
  };
  if (bmi < 25.0) return {
    label: "普通体重", labelShort: "普通体重", degree: "普通",
    colorClass: "text-green-600", colorBg: "bg-green-50", colorBorder: "border-green-400", colorText: "text-green-700",
    riskLevel: "良好", advice: "健康的な体重です。この状態を維持するために、バランスの良い食事と定期的な運動を続けましょう。定期健康診断も忘れずに受けてください。",
    risks: ["現在の体重は健康的な範囲です", "バランスの良い食事・運動で維持しましょう"],
  };
  if (bmi < 30.0) return {
    label: "肥満（1度）", labelShort: "肥満1度", degree: "肥満1度",
    colorClass: "text-yellow-600", colorBg: "bg-yellow-50", colorBorder: "border-yellow-400", colorText: "text-yellow-700",
    riskLevel: "注意", advice: "肥満1度の判定です。生活習慣病のリスクが高まっています。食事の見直し（脂質・糖質を控えめに）と、ウォーキングなどの有酸素運動を取り入れましょう。",
    risks: ["2型糖尿病のリスクが高まっています", "高血圧・脂質異常症のリスク", "心臓病・脳卒中リスクの上昇", "睡眠時無呼吸症候群のリスク"],
  };
  if (bmi < 35.0) return {
    label: "肥満（2度）", labelShort: "肥満2度", degree: "肥満2度",
    colorClass: "text-orange-600", colorBg: "bg-orange-50", colorBorder: "border-orange-400", colorText: "text-orange-700",
    riskLevel: "要注意", advice: "肥満2度の判定です。重大な健康リスクがあります。医師や管理栄養士の指導のもとで、計画的な体重管理を行うことをお勧めします。",
    risks: ["重大な生活習慣病リスク（糖尿病・高血圧）", "心臓・血管疾患のリスク大", "関節への負担が大きい", "医療機関への相談を強くお勧めします"],
  };
  if (bmi < 40.0) return {
    label: "肥満（3度）", labelShort: "肥満3度", degree: "肥満3度",
    colorClass: "text-red-600", colorBg: "bg-red-50", colorBorder: "border-red-400", colorText: "text-red-700",
    riskLevel: "要医療相談", advice: "肥満3度の判定です。重大な健康リスクがあります。速やかに医療機関を受診し、専門家の指導のもとで体重管理を開始することを強くお勧めします。",
    risks: ["高度肥満による深刻な健康リスク", "心肺機能への負担が大きい", "日常生活への支障", "専門的な医療的サポートが必要です"],
  };
  return {
    label: "肥満（4度）", labelShort: "肥満4度", degree: "肥満4度",
    colorClass: "text-red-800", colorBg: "bg-red-100", colorBorder: "border-red-600", colorText: "text-red-800",
    riskLevel: "要医療相談", advice: "肥満4度の判定です。一刻も早く医療機関を受診してください。専門家チームのサポートのもとで体重管理を行うことが不可欠です。",
    risks: ["生命に関わる重大な健康リスク", "早急な医療的介入が必要", "心臓・腎臓・肝臓への深刻な影響", "速やかに医療機関をご受診ください"],
  };
}

function calcBmi(
  heightCm: number,
  weightKg: number,
  goalWeightKg: number | null
): CalcResult {
  const hm = heightCm / 100;
  const bmi = weightKg / (hm * hm);
  const idealWeight = hm * hm * 22;
  const beautyWeight = hm * hm * 20;
  const minHealthWeight = hm * hm * 18.5;
  const maxHealthWeight = hm * hm * 24.9;
  const diffFromIdeal = weightKg - idealWeight;

  const cat = getBmiCategory(bmi);

  let goalBmi: number | null = null;
  let goalLabel: string | null = null;
  let goalDiff: number | null = null;

  if (goalWeightKg !== null) {
    goalBmi = goalWeightKg / (hm * hm);
    goalLabel = getBmiCategory(goalBmi).labelShort;
    goalDiff = goalWeightKg - weightKg;
  }

  return {
    bmi,
    label: cat.label,
    labelShort: cat.labelShort,
    degree: cat.degree,
    colorClass: cat.colorClass,
    colorBg: cat.colorBg,
    colorBorder: cat.colorBorder,
    colorText: cat.colorText,
    gaugePosition: bmiToGaugePct(bmi),
    idealWeight,
    beautyWeight,
    minHealthWeight,
    maxHealthWeight,
    diffFromIdeal,
    advice: cat.advice,
    riskLevel: cat.riskLevel,
    risks: cat.risks,
    goalBmi,
    goalLabel,
    goalDiff,
  };
}

function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

// ─── BMI Gauge Component ──────────────────────────────────────────────────────

function BmiGauge({ bmi, position }: { bmi: number; position: number }) {
  return (
    <div className="w-full">
      {/* Color bar */}
      <div className="relative h-8 rounded-full overflow-hidden flex mb-1">
        <div style={{ width: `${SEG.lean}%` }} className="bg-blue-400 flex items-center justify-center" />
        <div style={{ width: `${SEG.normal}%` }} className="bg-green-400 flex items-center justify-center" />
        <div style={{ width: `${SEG.ob1}%` }} className="bg-yellow-400 flex items-center justify-center" />
        <div style={{ width: `${SEG.ob2}%` }} className="bg-orange-400 flex items-center justify-center" />
        <div style={{ width: `${SEG.ob3}%` }} className="bg-red-400 flex items-center justify-center" />
        <div style={{ width: `${SEG.ob4}%` }} className="bg-red-700 flex items-center justify-center" />
        {/* Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gray-900 rounded-full shadow-lg"
          style={{ left: `calc(${position}% - 2px)` }}
        />
        {/* BMI label on marker */}
        <div
          className="absolute -top-7 bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
          style={{ left: `calc(${position}% - 20px)` }}
        >
          {fmt(bmi)}
        </div>
      </div>
      {/* Scale labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>10</span>
        <span style={{ position: "relative", left: `calc(${SEG.lean}% - 12px)` }}>18.5</span>
        <span style={{ position: "relative", left: `calc(${SEG.normal - 10}% - 12px)` }}>25</span>
        <span style={{ position: "relative", left: `calc(${SEG.ob1 - 18}% - 8px)` }}>30</span>
        <span style={{ position: "relative", left: `calc(${SEG.ob2 - 30}% - 4px)` }}>35</span>
        <span>40+</span>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        {[
          { color: "bg-blue-400", label: "低体重" },
          { color: "bg-green-400", label: "普通体重" },
          { color: "bg-yellow-400", label: "肥満1度" },
          { color: "bg-orange-400", label: "肥満2度" },
          { color: "bg-red-400", label: "肥満3度" },
          { color: "bg-red-700", label: "肥満4度" },
        ].map((s) => (
          <span key={s.label} className="flex items-center gap-1 text-gray-600">
            <span className={`inline-block w-3 h-3 rounded-sm ${s.color}`} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BmiCalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleCalc() {
    setError("");
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (!height || !weight || isNaN(h) || isNaN(w)) {
      setError("身長と体重を入力してください。");
      return;
    }
    if (h < 50 || h > 250) { setError("身長は50〜250cmで入力してください。"); return; }
    if (w < 10 || w > 300) { setError("体重は10〜300kgで入力してください。"); return; }
    if (age && (isNaN(a) || a < 10 || a > 100)) { setError("年齢は10〜100で入力してください。"); return; }

    const gw = goalWeight && !isNaN(parseFloat(goalWeight)) ? parseFloat(goalWeight) : null;
    if (gw !== null && (gw < 10 || gw > 300)) { setError("目標体重は10〜300kgで入力してください。"); return; }

    setResult(calcBmi(h, w, gw));
    setTimeout(() => {
      document.getElementById("bmi-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setGoalWeight("");
    setResult(null);
    setError("");
  }

  const diffSign = result ? (result.diffFromIdeal >= 0 ? "+" : "") : "";
  const goalSign = result?.goalDiff !== null && result?.goalDiff !== undefined
    ? (result.goalDiff >= 0 ? "+" : "") : "";

  const faqItems = [
    { question: "BMIが25以上になると何か問題がありますか？", answer: "BMI25以上（肥満1度）になると2型糖尿病・高血圧・脂質異常症・心臓病などの生活習慣病リスクが高まります。定期的な健康診断を受け気になる場合は医師にご相談ください。" },
    { question: "BMIが低すぎる場合のリスクは何ですか？", answer: "BMI18.5未満のやせは栄養不足・貧血・骨粗しょう症・免疫機能低下のリスクがあります。無理なダイエットは避け栄養バランスの良い食事を心がけましょう。" },
    { question: "適正体重と美容体重はどう違いますか？", answer: "適正体重（BMI=22）は医学的に最も疾病リスクが低い体重です。美容体重（BMI=20）は見た目がスリムに見えるとされる体重ですが医学的根拠はありません。健康面では適正体重を目指すことが推奨されます。" },
    { question: "BMIは年齢によって基準が変わりますか？", answer: "基準自体は変わりませんが高齢者（65歳以上）については少し高めのBMI（21.5〜24.9）が推奨されています。加齢により筋肉量が減少するためやせすぎると転倒・骨折リスクが高まります。" },
    { question: "1ヶ月で何kgまで減量するのが健康的ですか？", answer: "月1〜2kg（週0.5kg以下）が健康的な減量ペースとされています。急激な減量は筋肉量低下・栄養不足・リバウンドのリスクがあります。食事制限と運動を組み合わせた無理のない計画を立てましょう。" },
  ];

  const useCases = [
    { icon: "⚖️", persona: "体重管理・ダイエット中の方", title: "目標体重がBMI的に適正か確認したい", benefit: "日本基準で適正体重と現状のギャップを計算" },
    { icon: "🏥", persona: "健康診断を控えている方", title: "BMIが基準値内か事前に確認したい", benefit: "肥満度と判定結果を健診前にチェック" },
    { icon: "💪", persona: "筋トレ・体型改善に取り組む方", title: "理想体重への道のりを数値で把握したい", benefit: "目標BMIに必要な増減量を計算" },
  ];


  const citations = [
    { name: "日本肥満学会 肥満症診断基準2016", url: "https://www.jasso.or.jp/", description: "BMI判定基準・肥満度分類の根拠" },
    { name: "厚生労働省 e-ヘルスネット「肥満と健康」", url: "https://www.e-healthnet.mhlw.go.jp/information/food/e-02-001.html", description: "BMI22が適正体重とされる根拠" },
  ];

  return (
    <>
      <IntroSection title="BMI・適正体重計算機" paragraphs={["身長・体重を入力するだけでBMI・肥満度・適正体重を日本基準（BMI22が適正）で判定します。", "低体重・普通体重・過体重・肥満（1〜4度）の区分と、適正体重までの増減量も表示。健康診断前の確認や体重管理に役立ちます。", "登録不要・完全無料。美容体重・シンデレラ体重などの参考値も一緒に確認できます。"]} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/health" className="hover:text-blue-600">健康・ウェルネス</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-700">BMI・適正体重 計算機</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">BMI・適正体重 計算機</h1>
          <p className="text-sm text-gray-600 mt-1">
            日本肥満学会基準｜適正体重・健康リスク・アドバイス付き｜2026年最新基準対応
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Ad — top */}
        <AdUnit position="top" className="mb-6" />

        {/* ── Input Form ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            基本情報を入力
          </h2>

          {/* Gender toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
              <button
                onClick={() => setGender("male")}
                className={`px-6 py-2 text-sm font-semibold transition-colors ${
                  gender === "male" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                男性
              </button>
              <button
                onClick={() => setGender("female")}
                className={`px-6 py-2 text-sm font-semibold transition-colors ${
                  gender === "female" ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                女性
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年齢 <span className="text-gray-400 font-normal">（任意）</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="例: 35"
                  min={10}
                  max={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600 text-sm whitespace-nowrap">歳</span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                身長 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例: 165"
                  min={50}
                  max={250}
                  step={0.1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600 text-sm">cm</span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                体重 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例: 60"
                  min={10}
                  max={300}
                  step={0.1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600 text-sm">kg</span>
              </div>
            </div>

            {/* Goal weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標体重 <span className="text-gray-400 font-normal">（任意）</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="例: 55"
                  min={10}
                  max={300}
                  step={0.1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600 text-sm">kg</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCalc}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-lg transition-colors"
          >
            BMIを計算する
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div id="bmi-result">

            {/* Section 1: BMI Gauge */}
            <div className={`${result.colorBg} border-2 ${result.colorBorder} rounded-xl p-6 mb-4`}>
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">あなたのBMI（日本肥満学会基準）</div>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-bold ${result.colorClass}`}>{fmt(result.bmi)}</span>
                    <span className={`text-xl font-bold px-3 py-1 rounded-full ${result.colorBg} ${result.colorText} border ${result.colorBorder}`}>
                      {result.labelShort}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gauge */}
              <div className="mt-2">
                <BmiGauge bmi={result.bmi} position={result.gaugePosition} />
              </div>
            </div>

            {/* Section 2: Weight summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                体重サマリー
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "現在の体重", value: `${fmt(parseFloat(weight))} kg` },
                      { label: "BMI", value: fmt(result.bmi), highlight: true },
                      { label: "判定", value: result.label, colored: true },
                      { label: "適正体重（BMI 22）", value: `${fmt(result.idealWeight)} kg` },
                      { label: "健康体重範囲", value: `${fmt(result.minHealthWeight)} 〜 ${fmt(result.maxHealthWeight)} kg` },
                      { label: "美容体重（BMI 20）参考", value: `${fmt(result.beautyWeight)} kg` },
                      { label: "適正体重との差", value: `${diffSign}${fmt(result.diffFromIdeal)} kg`, diff: true },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 text-gray-600 w-1/2">{row.label}</td>
                        <td className={`py-2.5 text-right font-semibold ${
                          row.colored ? result.colorText :
                          row.diff ? (result.diffFromIdeal > 0 ? "text-red-600" : result.diffFromIdeal < 0 ? "text-blue-600" : "text-green-600") :
                          row.highlight ? result.colorClass :
                          "text-gray-900"
                        }`}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Goal analysis */}
            {result.goalBmi !== null && result.goalDiff !== null && result.goalLabel !== null && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                  目標体重の分析
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">目標体重</div>
                    <div className="text-lg font-bold text-gray-900">{fmt(parseFloat(goalWeight))} kg</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">目標BMI</div>
                    <div className={`text-lg font-bold ${getBmiCategory(result.goalBmi).colorClass}`}>
                      {fmt(result.goalBmi)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">目標の判定</div>
                    <div className={`text-sm font-bold ${getBmiCategory(result.goalBmi).colorText}`}>
                      {result.goalLabel}
                    </div>
                  </div>
                </div>
                <div className={`mt-3 rounded-lg p-3 text-center ${
                  result.goalDiff < 0 ? "bg-blue-50 border border-blue-200" :
                  result.goalDiff > 0 ? "bg-orange-50 border border-orange-200" :
                  "bg-green-50 border border-green-200"
                }`}>
                  <span className="text-sm font-medium text-gray-700">現在との差: </span>
                  <span className={`text-lg font-bold ${
                    result.goalDiff < 0 ? "text-blue-700" :
                    result.goalDiff > 0 ? "text-orange-700" : "text-green-700"
                  }`}>
                    {goalSign}{fmt(result.goalDiff)} kg
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {result.goalDiff < 0 ? "の減量が目標" : result.goalDiff > 0 ? "の増量が目標" : "（現在の体重と同じ）"}
                  </span>
                </div>
              </div>
            )}

            {/* Section 4: Health advice */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">{result.goalBmi !== null ? "3" : "2"}</span>
                健康アドバイス
              </h3>

              <div className={`${result.colorBg} border ${result.colorBorder} rounded-lg p-4 mb-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${result.colorBorder} ${result.colorText} ${result.colorBg}`}>
                    リスク: {result.riskLevel}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${result.colorText}`}>{result.advice}</p>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-2">健康リスク情報</h4>
              <ul className="space-y-1.5">
                {result.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={`mt-0.5 font-bold ${result.colorClass}`}>✦</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ad — mid */}
            <AdUnit position="bottom" className="mb-4" />

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors mb-6"
            >
              もう一度計算する
            </button>
          </div>
        )}

        {/* ─── SEO Content ──────────────────────────────────────────────────── */}

        {/* 身長別早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">身長別 適正体重・BMI早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600">身長</th>
                  <th className="py-2 px-3 text-right text-green-700">適正体重<br />(BMI 22)</th>
                  <th className="py-2 px-3 text-right text-gray-600">健康範囲</th>
                  <th className="py-2 px-3 text-right text-yellow-700">肥満基準<br />(BMI 25)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { h: 155, ideal: 52.8, min: 44.4, max: 59.9, obese: 60.1 },
                  { h: 160, ideal: 56.3, min: 47.4, max: 63.7, obese: 64.0 },
                  { h: 165, ideal: 59.9, min: 50.3, max: 67.8, obese: 68.1 },
                  { h: 170, ideal: 63.6, min: 53.5, max: 72.0, obese: 72.3 },
                  { h: 175, ideal: 67.4, min: 56.7, max: 76.3, obese: 76.6 },
                  { h: 180, ideal: 71.3, min: 59.9, max: 80.8, obese: 81.0 },
                ].map((row) => (
                  <tr key={row.h} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{row.h}cm</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-semibold">{row.ideal}kg</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{row.min}〜{row.max}kg</td>
                    <td className="py-2.5 px-3 text-right text-yellow-700 font-semibold">{row.obese}kg以上</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BMI基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">BMIの基礎知識</h2>

          <p className="text-gray-700 mb-4">
            BMI（Body Mass Index）は体格指数とも呼ばれ、体重と身長から肥満度を測る国際的な指標です。
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-center text-gray-800">
            BMI = 体重(kg) ÷ 身長(m)²
          </div>

          <h3 className="font-semibold text-gray-900 mb-2">日本肥満学会のBMI判定基準</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left text-gray-600">BMI</th>
                  <th className="py-2 px-3 text-left text-gray-600">判定</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "18.5未満", label: "低体重（やせ）", color: "text-blue-600" },
                  { range: "18.5〜25未満", label: "普通体重", color: "text-green-600" },
                  { range: "25〜30未満", label: "肥満（1度）", color: "text-yellow-600" },
                  { range: "30〜35未満", label: "肥満（2度）", color: "text-orange-600" },
                  { range: "35〜40未満", label: "肥満（3度）", color: "text-red-500" },
                  { range: "40以上", label: "肥満（4度）", color: "text-red-800" },
                ].map((row) => (
                  <tr key={row.range} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-3 font-mono text-gray-700">{row.range}</td>
                    <td className={`py-2 px-3 font-semibold ${row.color}`}>{row.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 text-gray-700 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">適正体重（BMI=22）について</h3>
              <p>日本肥満学会では、BMI=22が最も疾病（糖尿病・高血圧・高脂血症など）にかかりにくい体重とされています。身長(m)² × 22 で計算できます。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">日本基準とWHO基準の違い</h3>
              <p>日本の基準はWHOの基準（30以上を肥満）より厳しく設定されています。日本人は欧米人と比べて同じBMIでも体脂肪率が高い傾向があるためです。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">BMIの限界</h3>
              <p>BMIは体脂肪率を直接測定しないため、筋肉量の多いアスリートや高齢者では正確でない場合があります。あくまで健康管理の参考指標としてご活用ください。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {[
              {
                q: "BMIが25以上になると何か問題がありますか？",
                a: "BMI25以上（肥満1度）になると、2型糖尿病・高血圧・脂質異常症・心臓病などの生活習慣病リスクが高まります。日本人はBMI22〜24.9の範囲でもリスクが上昇し始めるという研究もあります。定期的な健康診断を受け、気になる場合は医師にご相談ください。",
              },
              {
                q: "BMIが低すぎる（やせ）場合のリスクは何ですか？",
                a: "BMI18.5未満のやせは、栄養不足・貧血・骨粗しょう症・免疫機能低下のリスクがあります。特に若い女性に多く見られ、将来的な骨折リスクや生殖機能への影響も懸念されます。無理なダイエットは避け、栄養バランスの良い食事を心がけましょう。",
              },
              {
                q: "適正体重と美容体重はどう違いますか？",
                a: "適正体重（BMI=22）は医学的に最も疾病リスクが低い体重です。美容体重（BMI=20）は見た目がスリムに見えるとされる体重ですが、医学的な根拠はありません。健康面では適正体重を目指すことが推奨されます。極端に美容体重を追求すると栄養不足になる危険性があります。",
              },
              {
                q: "BMIは年齢によって基準が変わりますか？",
                a: "日本肥満学会のBMI基準自体は年齢によって変わりませんが、高齢者（65歳以上）については少し高めのBMI（21.5〜24.9）が推奨されています。加齢により筋肉量が減少するため、やせすぎると転倒・骨折・フレイル（虚弱）のリスクが高まります。",
              },
              {
                q: "1ヶ月で何kgまで減量するのが健康的ですか？",
                a: "一般的に月1〜2kg（週0.5kg以下）が健康的な減量ペースとされています。急激な減量は筋肉量の低下・栄養不足・リバウンドのリスクがあります。1kgの脂肪を減らすには約7,200kcalの消費が必要です。食事制限と運動を組み合わせた無理のない計画を立てましょう。",
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
              { href: "/health/calorie-calculator", label: "基礎代謝・カロリー計算機" },
              { href: "/health/ideal-weight-calculator", label: "標準体重・肥満度 判定ツール" },
              { href: "/health/sleep-calculator", label: "睡眠時間 最適化ツール" },
              { href: "/insurance/medical-insurance-sim", label: "医療保険 入院給付金シミュレーター" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-blue-600 text-sm font-medium"
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
