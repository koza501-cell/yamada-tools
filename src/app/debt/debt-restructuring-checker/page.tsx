"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

const DEBT_TYPES = [
  { id: "consumer", label: "消費者金融・カードローン" },
  { id: "credit", label: "クレジットカード（ショッピング）" },
  { id: "housing", label: "住宅ローン" },
  { id: "auto", label: "自動車ローン" },
  { id: "scholarship", label: "奨学金" },
  { id: "tax", label: "税金・社会保険料の滞納" },
  { id: "rent", label: "家賃滞納" },
  { id: "personal", label: "知人・家族からの借金" },
];

const LENDER_OPTIONS = [
  { value: "1", label: "1社" },
  { value: "2", label: "2社" },
  { value: "3-5", label: "3〜5社" },
  { value: "6+", label: "6社以上" },
];

const CAR_OPTIONS = [
  { value: "none", label: "なし" },
  { value: "paid", label: "あり（ローン完済）" },
  { value: "loan", label: "あり（ローン残あり）" },
];

const ASSET_OPTIONS = [
  { value: "low", label: "ほぼなし（20万円以下）" },
  { value: "mid", label: "20〜100万円" },
  { value: "high", label: "100万円以上" },
];

const JOB_OPTIONS = [
  { value: "employee", label: "会社員・公務員" },
  { value: "self", label: "自営業・フリーランス" },
  { value: "part", label: "パート・アルバイト" },
  { value: "licensed", label: "弁護士・司法書士・士業" },
  { value: "unemployed", label: "無職・求職中" },
  { value: "other", label: "その他" },
];

const CAUSE_OPTIONS = [
  { value: "living", label: "生活費の不足" },
  { value: "medical", label: "医療費" },
  { value: "business", label: "事業の失敗" },
  { value: "gambling", label: "ギャンブル・投資の失敗" },
  { value: "spending", label: "浪費・衝動買い" },
  { value: "income", label: "失業・収入減少" },
  { value: "other", label: "その他" },
];

interface FormState {
  totalDebt: string;
  monthlyIncome: string;
  monthlyRepayable: string;
  lenders: string;
  debtTypes: string[];
  hasHouse: string;
  hasHousingLoan: string;
  car: string;
  assets: string;
  job: string;
  hasGuarantor: string;
  wantPrivacy: string;
  cause: string;
}

interface Scores {
  ninni: number;
  kojin: number;
  hasan: number;
}

interface Result {
  scores: Scores;
  recommended: "ninni" | "kojin" | "hasan";
  second: "ninni" | "kojin" | "hasan";
  warnings: string[];
  hasBankruptcyPenalty: boolean;
  hasTaxDebt: boolean;
  monthlyAfter: number;
  currentMonthly: number;
}

const METHOD_NAMES: Record<string, string> = {
  ninni: "任意整理",
  kojin: "個人再生",
  hasan: "自己破産",
};

function calcResult(f: FormState): Result {
  const totalDebt = parseFloat(f.totalDebt) || 0;
  const monthlyIncome = parseFloat(f.monthlyIncome) || 0;
  const monthlyRepayable = parseFloat(f.monthlyRepayable) || 0;

  let ninni = 0;
  let kojin = 0;
  let hasan = 0;

  const warnings: string[] = [];
  const hasBankruptcyPenalty = f.job === "licensed";
  let hasTaxDebt = false;

  // 任意整理スコア
  if (totalDebt < 500) ninni += 30;
  if (f.job === "employee" || f.job === "self" || f.job === "licensed") ninni += 20;
  if (totalDebt > 0 && monthlyRepayable >= totalDebt / 60) ninni += 25;
  if (f.hasHouse === "yes") ninni += 30;
  if (f.hasGuarantor === "yes") ninni += 20;
  if (f.wantPrivacy === "yes") ninni += 10;

  // 個人再生スコア
  if (totalDebt >= 500 && totalDebt <= 3000) kojin += 30;
  if (f.job === "employee" || f.job === "self" || f.job === "part" || f.job === "licensed") kojin += 25;
  if (f.hasHouse === "yes") kojin += 35;
  const minPayKojin = totalDebt > 0 ? (totalDebt * 0.2) / 60 : 0;
  if (monthlyRepayable >= minPayKojin) kojin += 20;
  if (totalDebt >= 500 && monthlyRepayable < totalDebt / 60) kojin += 15;

  // 自己破産スコア
  if (totalDebt > 1000 || (monthlyIncome > 0 && totalDebt > monthlyIncome * 5)) hasan += 30;
  if (monthlyRepayable <= 2) hasan += 35;
  if (f.assets === "low") hasan += 20;
  if (f.hasHouse !== "yes") hasan += 15;
  hasan += 25;

  // ペナルティ
  if (f.debtTypes.includes("tax")) {
    hasan -= 20;
    ninni -= 15;
    kojin -= 15;
    hasTaxDebt = true;
    warnings.push("税金・社会保険料は債務整理で免除されません。別途対応が必要です。");
  }

  // 住宅警告
  if (f.hasHouse === "yes") {
    warnings.push("住宅を守るには任意整理または個人再生（住宅ローン特則）が有効です。");
  }
  // 保証人警告
  if (f.hasGuarantor === "yes") {
    warnings.push("債務整理をすると保証人への請求が始まります。事前に相談を。");
  }
  // プライバシー警告
  if (f.wantPrivacy === "yes") {
    warnings.push("任意整理は最も家族に知られにくい方法です。");
  }

  // 推奨順位決定
  const sorted = (["ninni", "kojin", "hasan"] as ("ninni" | "kojin" | "hasan")[]).sort((a, b) => {
    const scoreA = a === "ninni" ? ninni : a === "kojin" ? kojin : hasan;
    const scoreB = b === "ninni" ? ninni : b === "kojin" ? kojin : hasan;
    return scoreB - scoreA;
  });

  const monthlyAfter = totalDebt > 0 ? Math.round((totalDebt * 10000) / 60) : 0;
  const currentMonthly = monthlyRepayable;

  return {
    scores: { ninni, kojin, hasan },
    recommended: sorted[0],
    second: sorted[1],
    warnings,
    hasBankruptcyPenalty,
    hasTaxDebt,
    monthlyAfter,
    currentMonthly,
  };
}

function StarRating({ score, max }: { score: number; max: number }) {
  const stars = Math.round((score / max) * 5);
  return (
    <span className="text-yellow-400">
      {"★".repeat(Math.max(0, stars))}
      <span className="text-gray-300">{"★".repeat(5 - Math.max(0, stars))}</span>
    </span>
  );
}

export default function DebtRestructuringChecker() {
  const [form, setForm] = useState<FormState>({
    totalDebt: "",
    monthlyIncome: "",
    monthlyRepayable: "",
    lenders: "",
    debtTypes: [],
    hasHouse: "",
    hasHousingLoan: "",
    car: "",
    assets: "",
    job: "",
    hasGuarantor: "",
    wantPrivacy: "",
    cause: "",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDebtType = (id: string) => {
    setForm((prev) => ({
      ...prev,
      debtTypes: prev.debtTypes.includes(id)
        ? prev.debtTypes.filter((t) => t !== id)
        : [...prev.debtTypes, id],
    }));
  };

  const validate = () => {
    if (!form.totalDebt || parseFloat(form.totalDebt) <= 0) return "借金の総額を入力してください。";
    if (!form.monthlyIncome || parseFloat(form.monthlyIncome) <= 0) return "月収（手取り）を入力してください。";
    if (!form.monthlyRepayable) return "毎月返済できる金額を入力してください。";
    if (!form.lenders) return "借入先の数を選択してください。";
    if (!form.hasHouse) return "持ち家の有無を選択してください。";
    if (!form.car) return "自動車の所有状況を選択してください。";
    if (!form.assets) return "金融資産の状況を選択してください。";
    if (!form.job) return "職業を選択してください。";
    if (!form.hasGuarantor) return "保証人の有無を選択してください。";
    if (!form.wantPrivacy) return "家族への非公開希望を選択してください。";
    return "";
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setResult(calcResult(form));
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const maxScore = Math.max(
    result?.scores.ninni ?? 1,
    result?.scores.kojin ?? 1,
    result?.scores.hasan ?? 1,
    1
  );

  const methodDetails = {
    ninni: {
      label: "任意整理",
      color: "blue",
      reduction: "将来利息カット",
      procedure: "弁護士が交渉",
      duration: "3〜5年で完済",
      property: "なし",
      house: "守れる",
      credit: "5〜7年",
      jobRestrict: "なし",
      guarantor: "あり",
      kanpo: "なし",
      cost: "1社3〜5万円",
    },
    kojin: {
      label: "個人再生",
      color: "purple",
      reduction: "最大80%減額",
      procedure: "裁判所",
      duration: "3〜5年で完済",
      property: "原則なし",
      house: "守れる（住宅ローン特則）",
      credit: "5〜10年",
      jobRestrict: "なし",
      guarantor: "あり",
      kanpo: "あり",
      cost: "30〜50万円",
    },
    hasan: {
      label: "自己破産",
      color: "red",
      reduction: "全額免除",
      procedure: "裁判所",
      duration: "約6ヶ月",
      property: "処分される場合あり",
      house: "失う可能性",
      credit: "5〜10年",
      jobRestrict: "一部あり（士業等）",
      guarantor: "あり",
      kanpo: "あり",
      cost: "20〜50万円",
    },
  };

  const colorMap: Record<string, string> = {
    blue: "border-blue-500 bg-blue-50",
    purple: "border-purple-500 bg-purple-50",
    red: "border-red-500 bg-red-50",
  };
  const badgeColorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span>›</span>
            <Link href="/debt" className="hover:text-blue-600">借金・債務整理</Link>
            <span>›</span>
            <span>任意整理 vs 自己破産 比較ツール</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            任意整理 vs 個人再生 vs 自己破産 比較ツール
          </h1>
          <p className="text-gray-600 text-sm">
            あなたの状況から最適な債務整理方法を中立的に判定します。
            弁護士・司法書士事務所のご相談前の参考情報としてお使いください。
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span>✓</span>
            <span>登録不要・完全無料・2026年最新対応</span>
          </div>
        </div>

        <AdUnit slot="debt-restructuring-top" className="mb-6" />

        {/* Empathy banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <p className="font-semibold mb-1">💛 まず、あなたの状況を正直に入力してください</p>
          <p>借金の問題は一人で抱え込まないでください。このツールは情報提供のみを目的としており、
          法律的なアドバイスではありません。結果は必ず弁護士・司法書士にご相談ください。</p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
            借金の状況
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                借金の総額 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="例：150"
                  value={form.totalDebt}
                  onChange={(e) => set("totalDebt", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600">万円</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                月収（手取り） <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="例：25"
                  value={form.monthlyIncome}
                  onChange={(e) => set("monthlyIncome", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600">万円/月</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                毎月返済できる金額 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="例：3"
                  value={form.monthlyRepayable}
                  onChange={(e) => set("monthlyRepayable", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-600">万円/月</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                借入先の数 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {LENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => set("lenders", opt.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.lenders === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                借金の種類（複数選択可）
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEBT_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.debtTypes.includes(type.id)}
                      onChange={() => toggleDebtType(type.id)}
                      className="rounded text-blue-600 focus:ring-blue-400"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
            資産・生活状況
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                持ち家はありますか？ <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[{ v: "yes", l: "はい" }, { v: "no", l: "いいえ" }].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => set("hasHouse", opt.v)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.hasHouse === opt.v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
              {form.hasHouse === "yes" && (
                <div className="mt-3 ml-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    住宅ローンは残っていますか？
                  </label>
                  <div className="flex gap-3">
                    {[{ v: "yes", l: "はい" }, { v: "no", l: "いいえ" }].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => set("hasHousingLoan", opt.v)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                          form.hasHousingLoan === opt.v
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                自動車を所有していますか？ <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => set("car", opt.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.car === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                預貯金・株などの金融資産 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ASSET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => set("assets", opt.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.assets === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                職業 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => set("job", opt.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.job === opt.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                保証人になっている借金がありますか？ <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[{ v: "yes", l: "はい" }, { v: "no", l: "いいえ" }].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => set("hasGuarantor", opt.v)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.hasGuarantor === opt.v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                家族（配偶者・子）に借金を知られたくない <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[{ v: "yes", l: "はい" }, { v: "no", l: "いいえ" }].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => set("wantPrivacy", opt.v)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.wantPrivacy === opt.v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-gray-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
            借金の原因
            <span className="text-xs text-gray-500 font-normal">（任意）</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {CAUSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("cause", opt.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  form.cause === opt.value
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md mb-8"
        >
          判定する →
        </button>

        {/* RESULT */}
        {result && (
          <div id="result-section" className="space-y-6">
            {/* Recommended */}
            <div className={`rounded-xl border-2 p-6 ${colorMap[methodDetails[result.recommended].color]}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColorMap[methodDetails[result.recommended].color]}`}>
                  推奨
                </span>
                <span className="text-xs text-gray-500">あなたの状況への適合度が最も高い方法</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                【{METHOD_NAMES[result.recommended]}】が最も適している可能性があります
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {result.recommended === "ninni" &&
                  "借金の総額や月収のバランスから、弁護士・司法書士が債権者と直接交渉する任意整理が有効と判定されました。裁判所を使わず、将来利息をカットして元金のみを3〜5年で返済する方法です。財産への影響がなく、家族に知られにくいのも特徴です。"}
                {result.recommended === "kojin" &&
                  "借金の規模や住宅を守りたい状況から、個人再生が有効と判定されました。裁判所に申立てを行い、借金を最大80%減額できます。安定収入があり、住宅ローン特則を利用して自宅を守りながら他の借金を整理できます。"}
                {result.recommended === "hasan" &&
                  "返済が極めて困難な状況から、自己破産が有効と判定されました。裁判所に申立てを行い、借金の支払い義務を免除（免責）してもらう方法です。約6ヶ月で手続きが完了し、早期に生活を立て直せます。"}
              </p>
              {result.second && (
                <p className="text-sm text-gray-500 mt-3">
                  次善策：<strong>{METHOD_NAMES[result.second]}</strong>（状況によっては検討価値あり）
                </p>
              )}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                ⚠️ このツールはあくまで参考情報です。必ず弁護士・司法書士にご相談ください。
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">3つの方法の比較</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-600 w-28">項目</th>
                      {(["ninni", "kojin", "hasan"] as const).map((m) => (
                        <th
                          key={m}
                          className={`text-center px-3 py-2 border border-gray-200 font-bold ${
                            m === result.recommended ? "bg-blue-50 text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {METHOD_NAMES[m]}
                          {m === result.recommended && (
                            <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1">推奨</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "減額効果", key: "reduction" },
                      { label: "手続き", key: "procedure" },
                      { label: "期間", key: "duration" },
                      { label: "財産への影響", key: "property" },
                      { label: "自宅", key: "house" },
                      { label: "信用情報", key: "credit" },
                      { label: "職業制限", key: "jobRestrict" },
                      { label: "保証人への影響", key: "guarantor" },
                      { label: "官報掲載", key: "kanpo" },
                      { label: "費用目安", key: "cost" },
                    ].map((row) => (
                      <tr key={row.label} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border border-gray-200 font-medium text-gray-600 bg-gray-50">
                          {row.label}
                        </td>
                        {(["ninni", "kojin", "hasan"] as const).map((m) => (
                          <td
                            key={m}
                            className={`px-3 py-2 border border-gray-200 text-center ${
                              m === result.recommended ? "bg-blue-50" : ""
                            }`}
                          >
                            {methodDetails[m][row.key as keyof typeof methodDetails.ninni]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-medium text-gray-600">適合度</td>
                      {(["ninni", "kojin", "hasan"] as const).map((m) => (
                        <td key={m} className={`px-3 py-2 border border-gray-200 text-center ${m === result.recommended ? "bg-blue-50" : ""}`}>
                          <StarRating
                            score={m === "ninni" ? result.scores.ninni : m === "kojin" ? result.scores.kojin : result.scores.hasan}
                            max={maxScore}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warnings */}
            {(result.warnings.length > 0 || result.hasBankruptcyPenalty) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">あなたの状況への影響</h3>
                <ul className="space-y-2">
                  {result.hasBankruptcyPenalty && (
                    <li className="flex items-start gap-2 text-sm bg-red-100 border border-red-200 rounded-lg p-3">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">⚠️</span>
                      <span className="text-red-800 font-medium">
                        自己破産すると、弁護士・司法書士・警備員・保険外交員など一部の職業に就けない期間（免責確定まで）があります。職業への影響は必ず専門家にご確認ください。
                      </span>
                    </li>
                  )}
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0">⚠️</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  ※ 自己破産すると弁護士・司法書士・警備員・保険外交員等の一部職業に就けない期間があります。
                  ご自身の職業への影響は専門家にご確認ください。
                </div>
              </div>
            )}

            {/* Monthly estimate */}
            {result.monthlyAfter > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">月々の返済額目安（任意整理の場合）</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">任意整理後の月々の返済額目安</p>
                  <p className="text-2xl font-bold text-blue-700 mb-1">
                    {parseFloat(form.totalDebt).toFixed(0)}万円 ÷ 60ヶ月 ={" "}
                    <span className="text-3xl">
                      {result.monthlyAfter.toLocaleString()}円/月
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">（元金のみ・利息なし・5年返済の場合）</p>
                  {result.currentMonthly > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      現在の返済可能額（{result.currentMonthly}万円/月 ={" "}
                      {(result.currentMonthly * 10000).toLocaleString()}円）との比較：
                      <span className={result.currentMonthly * 10000 >= result.monthlyAfter ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {result.currentMonthly * 10000 >= result.monthlyAfter
                          ? `月${((result.currentMonthly * 10000) - result.monthlyAfter).toLocaleString()}円の余裕が生まれます`
                          : `月${(result.monthlyAfter - result.currentMonthly * 10000).toLocaleString()}円不足する可能性があります`}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Next steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">次のステップ</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-medium text-gray-800">弁護士または司法書士に無料相談する</p>
                    <p className="text-sm text-gray-500">多くの事務所が初回無料相談を実施。費用・手続き・期間を確認しましょう。</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-medium text-gray-800">法テラスを利用する</p>
                    <p className="text-sm text-gray-500">収入が少ない場合は弁護士費用の立替制度あり。電話：0570-078374</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-medium text-gray-800">このツールの判定結果を相談時に見せる</p>
                    <p className="text-sm text-gray-500">スクリーンショットを撮って、専門家との相談の参考にしてください。</p>
                  </div>
                </li>
              </ol>
            </div>

            <AdUnit slot="debt-restructuring-result" className="my-4" />
          </div>
        )}

        {/* SEO content */}
        <div className="mt-12 space-y-8">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">債務整理3つの方法 詳細比較</h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 border border-gray-200 font-medium text-gray-600">項目</th>
                    <th className="text-center px-3 py-2 border border-gray-200 font-bold text-blue-700">任意整理</th>
                    <th className="text-center px-3 py-2 border border-gray-200 font-bold text-purple-700">個人再生</th>
                    <th className="text-center px-3 py-2 border border-gray-200 font-bold text-red-700">自己破産</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["借金の減額効果", "将来利息のカット", "元本を最大80%減額", "全額免除（免責）"],
                    ["手続き費用目安", "1社3〜5万円", "30〜50万円", "20〜50万円"],
                    ["手続き期間", "3〜6ヶ月", "6ヶ月〜1年", "6ヶ月〜1年"],
                    ["住宅の扱い", "失わない", "守れる（特則適用時）", "失う可能性あり"],
                    ["官報掲載", "なし", "あり", "あり"],
                    ["家族への影響", "少ない", "比較的少ない", "保証人に影響"],
                    ["向いている人", "安定収入あり・借金比較的少額", "住宅を守りたい・借金多め", "返済の見込みなし"],
                  ].map(([label, ...vals]) => (
                    <tr key={label} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-medium bg-gray-50">{label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="px-3 py-2 border border-gray-200 text-center">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">債務整理の基礎知識</h2>
            <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
              <p>
                債務整理とは、借金を法的な手続きによって整理・減額・免除する制度です。
                返済が困難になった場合の法律的な救済手段であり、正しく利用すれば借金問題を解決できます。
              </p>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">任意整理</h3>
                <p>弁護士・司法書士が債権者（借入先）と直接交渉し、将来の利息をカットして元金だけを3〜5年で分割返済する方法です。裁判所を利用しないため、官報に掲載されず、職業制限もありません。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">個人再生</h3>
                <p>裁判所に申立てを行い、借金を最大1/5（20%）に減額する方法です。住宅ローン特則を利用すれば、自宅を守りながら他の借金を減額できます。安定収入があることが条件です。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">自己破産</h3>
                <p>裁判所に申立てを行い、借金の支払い義務を免除（免責）してもらう方法です。持ち家や一定額以上の財産は処分されますが、99万円以下の現金や生活必需品は手元に残せます。</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">信用情報への影響</h3>
                <p>債務整理をすると信用情報機関に「事故情報」として登録され、一定期間（5〜10年）はローンやクレジットカードの新規利用が難しくなります。これを「ブラックリスト」と俗に呼びます。</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: "債務整理をすると家族にバレますか？",
                  a: "任意整理は最も家族に知られにくい方法です。個人再生・自己破産は裁判所を通じた手続きのため、官報（国の公告）に名前が掲載されますが、一般の方が官報を確認することはほとんどありません。ただし、保証人がいる借金の場合は保証人（家族の場合も）に影響が出ます。",
                },
                {
                  q: "借金の保証人になっている家族への影響はありますか？",
                  a: "債務整理をすると、連帯保証人には借金全額の請求が行くことになります。家族が保証人の場合、家族関係に影響が出る可能性があります。保証人への影響を最小化するためには、早めに専門家に相談し、保証人も含めた解決策を検討することが重要です。",
                },
                {
                  q: "税金の滞納がある場合、債務整理できますか？",
                  a: "税金・社会保険料などの公租公課は、自己破産でも免除されません（非免責債権）。ただし、消費者金融やカードローンなどの民事上の借金と一緒に手続きすることは可能です。税金の滞納については税務署・市区町村への分割払いの相談を並行して進めましょう。",
                },
                {
                  q: "債務整理の費用はどのくらいかかりますか？",
                  a: "任意整理は1社につき3〜5万円（複数社の場合は割引あり）、個人再生・自己破産は30〜50万円程度が相場です。収入が少ない場合は「法テラス」（日本司法支援センター）の費用立替制度を利用できます。",
                },
                {
                  q: "債務整理後は普通の生活に戻れますか？",
                  a: "はい、戻れます。信用情報への影響（いわゆるブラックリスト）は5〜10年で解除されます。その間はローンやクレジットカードが使えませんが、日常生活は普通に送れます。多くの方が債務整理後に生活を立て直し、数年後には安定した生活を取り戻しています。",
                },
              ].map(({ q, a }, i) => (
                <details key={i} className="group border border-gray-200 rounded-lg">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-gray-800 text-sm hover:bg-gray-50 rounded-lg">
                    <span>Q. {q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-1 pt-3">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">あわせて使えるツール</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/debt/repayment-simulator", label: "借金返済シミュレーター" },
                { href: "/debt/revolving-calculator", label: "リボ払い恐怖計算機" },
                { href: "/debt/loan-interest-calculator", label: "カードローン利息計算機" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700"
                >
                  <span className="text-blue-500">→</span>
                  {tool.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
