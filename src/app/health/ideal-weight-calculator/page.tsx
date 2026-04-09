"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { CitationsSection } from "@/components/CitationsSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcResult {
  bmi: number;
  bmiWeight: number;
  beautyWeight: number;
  minHealthWeight: number;
  maxHealthWeight: number;
  brokaWeight: number;
  lorreiIndex: number;
  lorreiLabel: string;
  obesityDegree: number;
  obesityLabel: string;
  obesityColorClass: string;
  obesityColorBg: string;
  obesityColorBorder: string;
  obesityColorText: string;
  bmiLabel: string;
  bmiColorClass: string;
  bmiColorBg: string;
  bmiColorBorder: string;
  bmiColorText: string;
  waistRisk: boolean | null;
  waistThreshold: number;
  bodyFatJudge: string | null;
  bodyFatRange: string | null;
  bodyFatColorClass: string | null;
  overallRisk: "low" | "medium" | "high";
  advice: string;
  diffFromBmi: number;
  diffFromBroka: number;
  diffFromBeauty: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

function sign(n: number): string {
  return n >= 0 ? "+" : "";
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5)
    return {
      label: "低体重（やせ）",
      colorClass: "text-blue-600",
      colorBg: "bg-blue-50",
      colorBorder: "border-blue-400",
      colorText: "text-blue-700",
    };
  if (bmi < 25.0)
    return {
      label: "普通体重",
      colorClass: "text-green-600",
      colorBg: "bg-green-50",
      colorBorder: "border-green-400",
      colorText: "text-green-700",
    };
  if (bmi < 30.0)
    return {
      label: "肥満（1度）",
      colorClass: "text-yellow-600",
      colorBg: "bg-yellow-50",
      colorBorder: "border-yellow-400",
      colorText: "text-yellow-700",
    };
  if (bmi < 35.0)
    return {
      label: "肥満（2度）",
      colorClass: "text-orange-600",
      colorBg: "bg-orange-50",
      colorBorder: "border-orange-400",
      colorText: "text-orange-700",
    };
  if (bmi < 40.0)
    return {
      label: "肥満（3度）",
      colorClass: "text-red-600",
      colorBg: "bg-red-50",
      colorBorder: "border-red-400",
      colorText: "text-red-700",
    };
  return {
    label: "肥満（4度）",
    colorClass: "text-red-800",
    colorBg: "bg-red-100",
    colorBorder: "border-red-600",
    colorText: "text-red-800",
  };
}

function getObesityCategory(degree: number) {
  if (degree < -20)
    return {
      label: "やせすぎ",
      colorClass: "text-blue-700",
      colorBg: "bg-blue-100",
      colorBorder: "border-blue-500",
      colorText: "text-blue-800",
    };
  if (degree < -10)
    return {
      label: "やせ",
      colorClass: "text-blue-600",
      colorBg: "bg-blue-50",
      colorBorder: "border-blue-400",
      colorText: "text-blue-700",
    };
  if (degree <= 10)
    return {
      label: "標準",
      colorClass: "text-green-600",
      colorBg: "bg-green-50",
      colorBorder: "border-green-400",
      colorText: "text-green-700",
    };
  if (degree <= 20)
    return {
      label: "過体重",
      colorClass: "text-yellow-600",
      colorBg: "bg-yellow-50",
      colorBorder: "border-yellow-400",
      colorText: "text-yellow-700",
    };
  if (degree <= 30)
    return {
      label: "軽度肥満",
      colorClass: "text-orange-500",
      colorBg: "bg-orange-50",
      colorBorder: "border-orange-400",
      colorText: "text-orange-700",
    };
  if (degree <= 50)
    return {
      label: "中程度肥満",
      colorClass: "text-orange-600",
      colorBg: "bg-orange-100",
      colorBorder: "border-orange-500",
      colorText: "text-orange-800",
    };
  return {
    label: "高度肥満",
    colorClass: "text-red-600",
    colorBg: "bg-red-50",
    colorBorder: "border-red-400",
    colorText: "text-red-700",
  };
}

function getLorreiLabel(index: number): string {
  if (index < 100) return "やせすぎ";
  if (index < 115) return "やせ";
  if (index < 145) return "普通";
  if (index < 160) return "太りぎみ";
  return "太りすぎ";
}

function getBodyFatJudge(
  pct: number,
  gender: "male" | "female"
): { judge: string; range: string; colorClass: string } {
  if (gender === "male") {
    if (pct < 10)
      return { judge: "アスリート体型", range: "10〜20%", colorClass: "text-blue-600" };
    if (pct <= 20)
      return { judge: "標準・健康的", range: "10〜20%", colorClass: "text-green-600" };
    if (pct <= 25)
      return { judge: "やや高め", range: "10〜20%", colorClass: "text-yellow-600" };
    return { judge: "高体脂肪（肥満）", range: "10〜20%", colorClass: "text-red-600" };
  } else {
    if (pct < 18)
      return { judge: "やや低め", range: "18〜28%", colorClass: "text-blue-600" };
    if (pct <= 28)
      return { judge: "標準・健康的", range: "18〜28%", colorClass: "text-green-600" };
    if (pct <= 35)
      return { judge: "やや高め", range: "18〜28%", colorClass: "text-yellow-600" };
    return { judge: "高体脂肪（肥満）", range: "18〜28%", colorClass: "text-red-600" };
  }
}

function calcIdealWeight(
  gender: "male" | "female",
  heightCm: number,
  weightKg: number,
  waistCm: number | null,
  bodyFatPct: number | null
): CalcResult {
  const hm = heightCm / 100;
  const bmi = weightKg / (hm * hm);

  const bmiWeight = hm * hm * 22;
  const beautyWeight = hm * hm * 20;
  const minHealthWeight = hm * hm * 18.5;
  const maxHealthWeight = hm * hm * 25;

  let brokaWeight: number;
  if (heightCm >= 150) {
    brokaWeight = gender === "male"
      ? (heightCm - 100) * 0.9
      : (heightCm - 100) * 0.85;
  } else {
    brokaWeight = heightCm - 100;
  }

  const lorreiIndex = (weightKg / Math.pow(heightCm, 3)) * 1e7;
  const lorreiLabel = getLorreiLabel(lorreiIndex);

  const obesityDegree = ((weightKg - bmiWeight) / bmiWeight) * 100;
  const obCat = getObesityCategory(obesityDegree);
  const bmiCat = getBmiCategory(bmi);

  const waistThreshold = gender === "male" ? 85 : 90;
  const waistRisk = waistCm !== null ? waistCm >= waistThreshold : null;

  let bodyFatJudge: string | null = null;
  let bodyFatRange: string | null = null;
  let bodyFatColorClass: string | null = null;
  if (bodyFatPct !== null) {
    const bfResult = getBodyFatJudge(bodyFatPct, gender);
    bodyFatJudge = bfResult.judge;
    bodyFatRange = bfResult.range;
    bodyFatColorClass = bfResult.colorClass;
  }

  let riskScore = 0;
  if (bmi >= 25) riskScore += 2;
  else if (bmi >= 23) riskScore += 1;
  if (bmi < 18.5) riskScore += 1;
  if (waistRisk === true) riskScore += 2;
  if (bodyFatPct !== null) {
    const bfR = getBodyFatJudge(bodyFatPct, gender);
    if (bfR.judge === "高体脂肪（肥満）") riskScore += 2;
    else if (bfR.judge === "やや高め") riskScore += 1;
  }
  const overallRisk: "low" | "medium" | "high" =
    riskScore >= 4 ? "high" : riskScore >= 2 ? "medium" : "low";

  let advice: string;
  if (obesityDegree < -10) {
    advice = `現在の体重はやや低めです。標準体重（${fmt(bmiWeight)}kg）まであと${fmt(bmiWeight - weightKg)}kgです。十分な栄養摂取を心がけ、必要であれば医療機関にご相談ください。`;
  } else if (obesityDegree <= 10) {
    advice = `現在の体重は健康的な範囲内です。バランスの良い食事と適度な運動でこの状態を維持しましょう。`;
  } else {
    advice = `標準体重（${fmt(bmiWeight)}kg）まであと${fmt(weightKg - bmiWeight)}kgです。月1〜2kgのペースで無理なく減量しましょう。食事の見直しと有酸素運動を組み合わせることが効果的です。`;
  }

  return {
    bmi,
    bmiWeight,
    beautyWeight,
    minHealthWeight,
    maxHealthWeight,
    brokaWeight,
    lorreiIndex,
    lorreiLabel,
    obesityDegree,
    obesityLabel: obCat.label,
    obesityColorClass: obCat.colorClass,
    obesityColorBg: obCat.colorBg,
    obesityColorBorder: obCat.colorBorder,
    obesityColorText: obCat.colorText,
    bmiLabel: bmiCat.label,
    bmiColorClass: bmiCat.colorClass,
    bmiColorBg: bmiCat.colorBg,
    bmiColorBorder: bmiCat.colorBorder,
    bmiColorText: bmiCat.colorText,
    waistRisk,
    waistThreshold,
    bodyFatJudge,
    bodyFatRange,
    bodyFatColorClass,
    overallRisk,
    advice,
    diffFromBmi: weightKg - bmiWeight,
    diffFromBroka: weightKg - brokaWeight,
    diffFromBeauty: weightKg - beautyWeight,
  };
}

// ─── Tooltip Component ────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs font-bold inline-flex items-center justify-center leading-none"
        aria-label="説明"
      >
        ?
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10 leading-relaxed">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </span>
      )}
    </span>
  );
}

// ─── Risk Badge ───────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low")
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        総合リスク: 低
      </span>
    );
  if (level === "medium")
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        総合リスク: 中
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
      <span className="w-2 h-2 rounded-full bg-red-500" />
      総合リスク: 高
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IdealWeightCalculatorPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [bodyFat, setBodyFat] = useState("");
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
    if (h < 50 || h > 250) {
      setError("身長は50〜250cmで入力してください。");
      return;
    }
    if (w < 10 || w > 300) {
      setError("体重は10〜300kgで入力してください。");
      return;
    }
    if (age && (isNaN(a) || a < 10 || a > 100)) {
      setError("年齢は10〜100で入力してください。");
      return;
    }

    const waistVal = waist && !isNaN(parseFloat(waist)) ? parseFloat(waist) : null;
    const bodyFatVal = bodyFat && !isNaN(parseFloat(bodyFat)) ? parseFloat(bodyFat) : null;

    if (waistVal !== null && (waistVal < 40 || waistVal > 200)) {
      setError("腹囲は40〜200cmで入力してください。");
      return;
    }
    if (bodyFatVal !== null && (bodyFatVal < 1 || bodyFatVal > 70)) {
      setError("体脂肪率は1〜70%で入力してください。");
      return;
    }

    setResult(calcIdealWeight(gender, h, w, waistVal, bodyFatVal));
    setTimeout(() => {
      document.getElementById("ideal-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setWaist("");
    setBodyFat("");
    setResult(null);
    setError("");
  }

  const optionalSectionOffset =
    (result?.waistRisk !== null && result?.waistRisk !== undefined ? 1 : 0) +
    (result?.bodyFatJudge !== null && result?.bodyFatJudge !== undefined ? 1 : 0);

  const faqItems = [
    { question: "標準体重と適正体重はどう違いますか？", answer: "一般的に同じ意味で使われますが計算方法によって若干異なります。医学的に最も推奨されるのはBMI式（身長m² × 22）による標準体重です。" },
    { question: "BMIと肥満度はどう違いますか？", answer: "BMIは体重と身長から計算した絶対的な指標です。肥満度は標準体重（BMI22）からの偏差率（%）で標準体重からどれだけ乖離しているかを示します。" },
    { question: "メタボリックシンドロームの腹囲基準はなぜ男女で違うのですか？", answer: "男性と女性では内臓脂肪のつき方が異なるためです。男性は内臓脂肪がつきやすく女性は皮下脂肪がつきやすいため同じ腹囲でも内臓脂肪量が異なり基準値が異なります。" },
    { question: "体脂肪率が高いのにBMIが正常な場合はどう考えればいいですか？", answer: "隠れ肥満（内臓脂肪型肥満）の状態です。BMIだけでなく体脂肪率や腹囲も確認することが重要です。筋力トレーニングで筋肉量を増やすことが改善への近道です。" },
    { question: "子供の肥満度はどう計算しますか？", answer: "子供の肥満度は主にローレル指数（体重kg÷身長cm³×10⁷）で評価します。115〜145が標準とされ学校の健康診断でも使われる指標です。" },
  ];

  const useCases = [
    { icon: "📏", persona: "自分の標準体重を知りたい方", title: "BMI以外の計算式でも確認したい", benefit: "3つの計算方式を比較して標準体重を把握" },
    { icon: "🔍", persona: "メタボ診断が気になる方", title: "腹囲とBMIでメタボリスクを確認したい", benefit: "腹囲基準値との差とメタボ判定を表示" },
    { icon: "👨‍👩‍👧", persona: "子どもの体重が気になる親御さん", title: "子どもの肥満度を正確に評価したい", benefit: "年齢・身長・体重から子どもの肥満度を計算" },
  ];


  const citations = [
    { name: "日本肥満学会 肥満症診断基準2016", url: "https://www.jasso.or.jp/", description: "BMI・肥満度判定基準の根拠" },
    { name: "厚生労働省 e-ヘルスネット「肥満と健康」", url: "https://www.e-healthnet.mhlw.go.jp/information/food/e-02-001.html", description: "メタボリックシンドローム腹囲基準の根拠" },
  ];

  return (
    <>
      <IntroSection title="標準体重・肥満度判定ツール" paragraphs={["BMI式・ブローカ式・ブローカ桂変法など複数の計算方式で標準体重を算出。肥満度の判定と腹囲によるメタボリックシンドロームのチェックも行います。", "男女別・年齢別の詳細な判定基準に対応。体脂肪率の目安も参考表示します。", "登録不要・完全無料。健康診断前の予備確認や体型改善の目標設定に活用できます。"]} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/health" className="hover:text-blue-600">健康・ウェルネス</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-700">標準体重・肥満度 判定ツール</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">標準体重・肥満度 判定ツール</h1>
          <p className="text-sm text-gray-600 mt-1">
            BMI式・ブローカ式など複数の計算方法で比較｜腹囲メタボ判定・体脂肪率チェック対応｜無料
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Ad — top */}
        <AdUnit slot="ideal-weight-calculator-top" className="mb-6" />

        {/* ── Input Form ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            基本情報を入力
          </h2>

          {/* Gender toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-full">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  gender === "male" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                男性
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  gender === "female" ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                女性
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

            {/* Waist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                腹囲（ウエスト）
                <span className="text-gray-400 font-normal text-xs">（任意）</span>
                <Tooltip text="おへその高さで計測した腹囲。メタボリックシンドロームの判定に使用します" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="例: 80"
                  min={40}
                  max={200}
                  step={0.1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600 text-sm">cm</span>
              </div>
            </div>
          </div>

          {/* Body fat */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体脂肪率
              <span className="text-gray-400 font-normal text-xs">（任意）</span>
              <Tooltip text="体重計や健康診断で計測した体脂肪率があれば入力してください" />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="例: 22"
                min={1}
                max={70}
                step={0.1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-600 text-sm">%</span>
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
            判定する
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div id="ideal-result">

            {/* Section 1: 現在の状態サマリー */}
            <div className={`${result.obesityColorBg} border-2 ${result.obesityColorBorder} rounded-xl p-4 sm:p-6 mb-4`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">BMI</div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${result.bmiColorClass}`}>{fmt(result.bmi)}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${result.bmiColorBg} ${result.bmiColorText} ${result.bmiColorBorder}`}>
                      {result.bmiLabel}
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <RiskBadge level={result.overallRisk} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left font-medium text-gray-600">項目</th>
                      <th className="py-2 text-right font-medium text-gray-600 w-20 whitespace-nowrap">数値</th>
                      <th className="py-2 text-right font-medium text-gray-600 w-16 whitespace-nowrap">判定</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">BMI</td>
                      <td className={`py-2.5 text-right font-bold whitespace-nowrap ${result.bmiColorClass}`}>{fmt(result.bmi)}</td>
                      <td className={`py-2.5 text-right font-semibold whitespace-nowrap ${result.bmiColorText}`}>{result.bmiLabel}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">肥満度</td>
                      <td className={`py-2.5 text-right font-bold whitespace-nowrap ${result.obesityColorClass}`}>{sign(result.obesityDegree)}{fmt(result.obesityDegree)}%</td>
                      <td className={`py-2.5 text-right font-semibold whitespace-nowrap ${result.obesityColorText}`}>{result.obesityLabel}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">現在体重</td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(parseFloat(weight))} kg</td>
                      <td className="py-2.5 text-right text-gray-400">—</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">標準体重（BMI22）</td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(result.bmiWeight)} kg</td>
                      <td className="py-2.5 text-right text-gray-400">—</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-gray-600">標準体重との差</td>
                      <td className={`py-2.5 text-right font-bold whitespace-nowrap ${result.diffFromBmi > 0 ? "text-red-600" : result.diffFromBmi < 0 ? "text-blue-600" : "text-green-600"}`}>
                        {sign(result.diffFromBmi)}{fmt(result.diffFromBmi)} kg
                      </td>
                      <td className="py-2.5 text-right text-gray-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: 各種標準体重の比較 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                各種標準体重の比較
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-gray-600 min-w-[130px]">計算方法</th>
                      <th className="py-2 px-3 text-right text-gray-600">標準体重</th>
                      <th className="py-2 px-3 text-right text-gray-600">現在との差</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-gray-700">BMI式（BMI=22）</div>
                        <div className="text-xs text-gray-400">日本肥満学会推奨・最も医学的根拠が強い</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-green-700">{fmt(result.bmiWeight)} kg</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${result.diffFromBmi > 0 ? "text-red-600" : result.diffFromBmi < 0 ? "text-blue-600" : "text-green-600"}`}>
                        {sign(result.diffFromBmi)}{fmt(result.diffFromBmi)} kg
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-gray-700">BMI美容体重（BMI=20）</div>
                        <div className="text-xs text-gray-400">スリムに見える目安（医学的根拠なし）</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-purple-600">{fmt(result.beautyWeight)} kg</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${result.diffFromBeauty > 0 ? "text-red-600" : result.diffFromBeauty < 0 ? "text-blue-600" : "text-green-600"}`}>
                        {sign(result.diffFromBeauty)}{fmt(result.diffFromBeauty)} kg
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-gray-700">ブローカ式</div>
                        <div className="text-xs text-gray-400">古くから使われる経験則的な計算式</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{fmt(result.brokaWeight)} kg</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${result.diffFromBroka > 0 ? "text-red-600" : result.diffFromBroka < 0 ? "text-blue-600" : "text-green-600"}`}>
                        {sign(result.diffFromBroka)}{fmt(result.diffFromBroka)} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-gray-700">健康体重範囲（BMI18.5〜25）</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-700">{fmt(result.minHealthWeight)}〜{fmt(result.maxHealthWeight)} kg</td>
                      <td className="py-2.5 px-3 text-right text-gray-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ローレル指数 */}
              <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  ローレル指数
                  <span className="text-xs text-gray-400 ml-1">（主に子供向け・参考値）</span>
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {fmt(result.lorreiIndex, 1)}
                  <span className="ml-2 text-xs font-medium text-gray-500">({result.lorreiLabel})</span>
                </span>
              </div>
            </div>

            {/* Section 3: 腹囲・メタボ判定 */}
            {result.waistRisk !== null && (
              <div className={`rounded-xl border-2 p-4 sm:p-5 mb-4 ${result.waistRisk ? "bg-orange-50 border-orange-400" : "bg-green-50 border-green-400"}`}>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                  腹囲・メタボリックシンドローム判定
                </h3>
                {result.waistRisk ? (
                  <div>
                    <p className="text-orange-800 font-semibold mb-1">
                      🟠 腹囲{waist}cm — メタボリックシンドロームの基準値（{gender === "male" ? "男性85cm" : "女性90cm"}）を超えています
                    </p>
                    <p className="text-orange-700 text-sm">内臓脂肪型肥満の可能性があります。医療機関での検査をお勧めします。</p>
                  </div>
                ) : (
                  <p className="text-green-800 font-semibold">
                    🟢 腹囲{waist}cm — メタボリックシンドロームの基準値（{gender === "male" ? "男性85cm" : "女性90cm"}）内です
                  </p>
                )}
              </div>
            )}

            {/* Section 4: 体脂肪率判定 */}
            {result.bodyFatJudge !== null && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                    {result.waistRisk !== null ? "4" : "3"}
                  </span>
                  体脂肪率判定
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">体脂肪率</div>
                    <div className="text-2xl font-bold text-gray-900">{bodyFat}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">判定</div>
                    <div className={`text-base font-bold ${result.bodyFatColorClass}`}>{result.bodyFatJudge}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">健康的な範囲</div>
                    <div className="text-base font-semibold text-gray-700">{result.bodyFatRange}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: 総合アドバイス */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                  {2 + optionalSectionOffset + 1}
                </span>
                総合アドバイス
              </h3>
              <div className={`${result.obesityColorBg} border ${result.obesityColorBorder} rounded-lg p-4`}>
                <p className={`text-sm leading-relaxed ${result.obesityColorText}`}>{result.advice}</p>
              </div>
            </div>

            {/* Ad — mid */}
            <AdUnit slot="ideal-weight-calculator-mid" className="mb-4" />

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">身長別 標準体重・肥満度早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600">身長</th>
                  <th className="py-2 px-3 text-right text-green-700">標準体重<br />(BMI22)</th>
                  <th className="py-2 px-3 text-right text-purple-600">美容体重<br />(BMI20)</th>
                  <th className="py-2 px-3 text-right text-blue-600">ブローカ式<br />（男性）</th>
                  <th className="py-2 px-3 text-right text-yellow-700">肥満開始<br />(BMI25)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { h: 150, bmi22: 49.5, bmi20: 45.0, broka: 45.0, bmi25: 56.3 },
                  { h: 155, bmi22: 52.8, bmi20: 48.1, broka: 49.5, bmi25: 60.1 },
                  { h: 160, bmi22: 56.3, bmi20: 51.2, broka: 54.0, bmi25: 64.0 },
                  { h: 165, bmi22: 59.9, bmi20: 54.5, broka: 58.5, bmi25: 68.1 },
                  { h: 170, bmi22: 63.6, bmi20: 57.8, broka: 63.0, bmi25: 72.3 },
                  { h: 175, bmi22: 67.4, bmi20: 61.3, broka: 67.5, bmi25: 76.6 },
                  { h: 180, bmi22: 71.3, bmi20: 64.8, broka: 72.0, bmi25: 81.0 },
                ].map((row) => (
                  <tr key={row.h} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{row.h}cm</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-semibold">{row.bmi22}kg</td>
                    <td className="py-2.5 px-3 text-right text-purple-600 font-semibold">{row.bmi20}kg</td>
                    <td className="py-2.5 px-3 text-right text-blue-600">{row.broka}kg</td>
                    <td className="py-2.5 px-3 text-right text-yellow-700">{row.bmi25}kg以上</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">標準体重・肥満度の基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">標準体重とは</h3>
              <p>医学的に最も疾病リスクが低いとされる体重です。計算方法はいくつかあり、日本では主にBMI式（身長m² × 22）が使われています。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">BMI式（日本肥満学会推奨）</h3>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-center text-gray-800 mb-2">標準体重 = 身長(m)² × 22</div>
              <p>日本人の疫学データに基づき、最も疾病にかかりにくいBMI値（22）から算出。最も医学的根拠が強い方法です。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">ブローカ式</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-center text-gray-800 mb-2">
                男性: (身長cm − 100) × 0.9　／　女性: (身長cm − 100) × 0.85
              </div>
              <p>古くから使われてきた経験則的な計算式。身長が高い人ではBMI式より高めの値が出る傾向があります。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">美容体重（BMI20）</h3>
              <p>医学的な推奨ではなく、見た目がスリムに見えるとされる体重の目安です。BMI20は標準範囲内ですが、やせ傾向に近い数値です。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">メタボリックシンドロームとは</h3>
              <p>内臓脂肪の蓄積に加えて、高血糖・高血圧・脂質異常症のうち2つ以上を合併した状態です。腹囲（男性85cm・女性90cm以上）が判定基準の一つです。メタボは心臓病・脳卒中のリスクを大幅に高めます。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {[
              {
                q: "標準体重と適正体重はどう違いますか？",
                a: "一般的に同じ意味で使われますが、計算方法によって若干異なります。医学的に最も推奨されるのはBMI式（身長m² × 22）による標準体重です。ブローカ式は古くから知られる計算式で、身長が高い人では標準体重が高めに出る傾向があります。",
              },
              {
                q: "BMIと肥満度はどう違いますか？",
                a: "BMIは体重と身長から計算した絶対的な指標で、肥満かどうかを判断します。肥満度は標準体重（BMI22）からの偏差率（%）です。例えば標準体重55kgの人が60kgの場合、肥満度は+9.1%（標準体重より9.1%重い）と表現されます。",
              },
              {
                q: "メタボリックシンドロームの腹囲基準はなぜ男女で違うのですか？",
                a: "男性と女性では内臓脂肪のつき方と蓄積パターンが異なるためです。男性は内臓脂肪がつきやすく、女性は皮下脂肪がつきやすい傾向があります。そのため同じ腹囲でも内臓脂肪量が異なり、基準値が異なります。女性は90cm以上（男性より大きい値）が基準です。",
              },
              {
                q: "体脂肪率が高いのにBMIが正常な場合はどう考えればいいですか？",
                a: "「隠れ肥満（内臓脂肪型肥満）」の状態です。体重は標準でも体脂肪率が高い場合、外見では太って見えなくても代謝疾患のリスクがあります。BMIだけでなく体脂肪率や腹囲も確認することが重要です。筋力トレーニングで筋肉量を増やすことが改善への近道です。",
              },
              {
                q: "子供の肥満度はどう計算しますか？",
                a: "子供（学童期）の肥満度は主にローレル指数で評価します。ローレル指数 = 体重(kg) ÷ 身長(cm)³ × 10⁷ で計算し、115〜145が標準とされます。学校の健康診断でも使われる指標です。本ツールでも参考値として表示しています。中学生以上はBMI式での評価も行われます。",
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="space-y-2">
            {[
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機" },
              { href: "/health/calorie-calculator", label: "基礎代謝・カロリー計算機" },
              { href: "/health/sleep-calculator", label: "睡眠時間 最適化ツール" },
              { href: "/insurance/medical-insurance-sim", label: "医療保険シミュレーター" },
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
