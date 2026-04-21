"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

// ─── Quiz Data ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: "現在の借金の返済状況を教えてください",
    options: [
      { value: "A", label: "返済が苦しいが、なんとか続けられている" },
      { value: "B", label: "返済が遅れることがある（延滞がある）" },
      { value: "C", label: "もう返済できない状態だ" },
      { value: "D", label: "督促・取り立ての連絡が来ている" },
    ],
  },
  {
    id: 2,
    question: "借金の総額はどのくらいですか？",
    options: [
      { value: "A", label: "100万円未満" },
      { value: "B", label: "100万円〜300万円未満" },
      { value: "C", label: "300万円〜500万円未満" },
      { value: "D", label: "500万円〜1,000万円未満" },
      { value: "E", label: "1,000万円以上" },
    ],
  },
  {
    id: 3,
    question: "毎月の手取り収入はどのくらいですか？",
    options: [
      { value: "A", label: "収入がない（無職・求職中）" },
      { value: "B", label: "15万円未満" },
      { value: "C", label: "15万円〜25万円未満" },
      { value: "D", label: "25万円〜40万円未満" },
      { value: "E", label: "40万円以上" },
    ],
  },
  {
    id: 4,
    question: "持ち家（マイホーム）はありますか？",
    options: [
      { value: "A", label: "はい、住宅ローンを返済中" },
      { value: "B", label: "はい、住宅ローンは完済している" },
      { value: "C", label: "いいえ、賃貸です" },
      { value: "D", label: "いいえ、その他" },
    ],
  },
  {
    id: 5,
    question: "借金の原因を教えてください（任意）",
    options: [
      { value: "A", label: "生活費・医療費の不足" },
      { value: "B", label: "失業・収入減少" },
      { value: "C", label: "事業の失敗" },
      { value: "D", label: "ギャンブル・投資" },
      { value: "E", label: "その他・答えたくない" },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisResult {
  type: "任意整理" | "個人再生" | "自己破産" | "緊急相談" | "返済継続";
  icon: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  title: string;
  message: string;
  details: string[];
  monthlyReduction: number | null;
}

// ─── Diagnosis Logic ──────────────────────────────────────────────────────────

const DEBT_MIDPOINTS: Record<string, number> = {
  A: 50,
  B: 200,
  C: 400,
  D: 750,
  E: 1500,
};

const INCOME_LABELS: Record<string, string> = {
  A: "なし（無職・求職中）",
  B: "15万円未満",
  C: "15〜25万円未満",
  D: "25〜40万円未満",
  E: "40万円以上",
};

const HOUSING_LABELS: Record<string, string> = {
  A: "持ち家（住宅ローン返済中）",
  B: "持ち家（ローン完済）",
  C: "賃貸",
  D: "その他",
};

const DEBT_LABELS: Record<string, string> = {
  A: "100万円未満",
  B: "100〜300万円未満",
  C: "300〜500万円未満",
  D: "500〜1,000万円未満",
  E: "1,000万円以上",
};

function diagnose(answers: string[]): DiagnosisResult {
  const [a0, a1, a2, a3] = answers;
  const debtMidpoint = DEBT_MIDPOINTS[a1] ?? 200;

  // Case 4: 督促 → 緊急
  if (a0 === "D") {
    return {
      type: "緊急相談",
      icon: "🚨",
      colorBg: "bg-red-50",
      colorText: "text-red-700",
      colorBorder: "border-red-400",
      title: "今すぐ弁護士に相談してください",
      message:
        "督促・取り立てがある場合、弁護士に依頼すると即日停止できます。放置するほど状況は悪化します。まず無料相談の電話一本が、生活を取り戻す第一歩です。一人で抱え込まないでください。",
      details: [
        "弁護士依頼後、即日で督促・取り立てを止められる",
        "給与・預金の差し押さえを防げる",
        "無料相談後に依頼するかどうか決められる",
        "費用が心配なら法テラスの立替制度が利用できる",
      ],
      monthlyReduction: null,
    };
  }

  // Case 3: 自己破産
  if (a0 === "C" && (a2 === "A" || a2 === "B") && a3 !== "A") {
    return {
      type: "自己破産",
      icon: "🔴",
      colorBg: "bg-orange-50",
      colorText: "text-orange-700",
      colorBorder: "border-orange-400",
      title: "「自己破産」の検討をお勧めします",
      message:
        "借金問題は一人で抱え込まず、専門家に相談することで必ず解決の道があります。あなたの状況からは自己破産が有効な選択肢の一つです。自己破産により借金の支払い義務がなくなり、生活を再スタートできます。",
      details: [
        "すべての借金の支払い義務がなくなる（免責）",
        "手続き中も生活に必要な財産は守られる",
        "免責確定後は新たなローンも組める（5〜10年後）",
        "費用が心配なら法テラスの費用立替制度が利用できる",
        "免責後は職業制限もなくなる",
      ],
      monthlyReduction: null,
    };
  }

  // Case 2: 個人再生
  if (
    a3 === "A" ||
    ((a1 === "D" || a1 === "E") && (a0 === "B" || a0 === "C") && a2 !== "A")
  ) {
    return {
      type: "個人再生",
      icon: "🟠",
      colorBg: "bg-amber-50",
      colorText: "text-amber-700",
      colorBorder: "border-amber-400",
      title: "「個人再生」の検討をお勧めします",
      message:
        "借金問題は一人で抱え込まず、専門家に相談することで必ず解決の道があります。あなたの状況からは個人再生が有効な選択肢の一つです。個人再生で借金を最大1/5に減額しながら、マイホームを守れる可能性があります。",
      details: [
        "借金を最大1/5〜1/10程度に大幅減額できる",
        "住宅ローン特則でマイホームを守れる",
        "減額後の残りを3〜5年で分割返済",
        "職業への制限なし",
        "費用目安：弁護士費用30〜50万円程度",
      ],
      monthlyReduction: Math.round((debtMidpoint * 10000 * 0.8) / 60 / 1000) * 1000,
    };
  }

  // Case 1: 任意整理
  if (
    (a0 === "A" || a0 === "B") &&
    (a2 === "C" || a2 === "D" || a2 === "E") &&
    (a1 === "A" || a1 === "B" || a1 === "C")
  ) {
    const reduction = Math.round((debtMidpoint * 10000) / 60 / 1000) * 1000;
    return {
      type: "任意整理",
      icon: "🟡",
      colorBg: "bg-yellow-50",
      colorText: "text-yellow-700",
      colorBorder: "border-yellow-400",
      title: "「任意整理」の検討をお勧めします",
      message:
        "借金問題は一人で抱え込まず、専門家に相談することで必ず解決の道があります。あなたの状況からは任意整理が有効な選択肢の一つです。将来利息をカットすれば、月々の返済を大幅に減らせる可能性があります。",
      details: [
        "将来の利息をカット（元金のみ返済）",
        "元金を3〜5年で分割返済",
        "家・車・財産を失わない",
        "職業への制限なし",
        "費用目安：1社あたり3〜5万円",
      ],
      monthlyReduction: reduction,
    };
  }

  // Case 5: 返済継続
  return {
    type: "返済継続",
    icon: "🟢",
    colorBg: "bg-green-50",
    colorText: "text-green-700",
    colorBorder: "border-green-400",
    title: "返済計画の見直しをお勧めします",
    message:
      "現状では債務整理より、返済計画の見直しや繰り上げ返済が効果的かもしれません。ただし状況は変わることがあります。不安に感じることがあれば、早めに専門家に相談することをお勧めします。",
    details: [
      "繰り上げ返済で総利息を大幅削減できる",
      "低金利ローンへの借り換えを検討する",
      "家計の見直しで返済余力を作る",
      "複数社からの借入は任意整理で整理できる場合も",
    ],
    monthlyReduction: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DebtDiagnosisPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const currentQuestion = QUESTIONS[step - 1];
  const progress = step > 0 ? (step / 5) * 100 : 0;

  function handleStart() {
    setStep(1);
    setAnswers([]);
    setSelected("");
    setResult(null);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected("");
    if (step === 5) {
      setResult(diagnose(newAnswers));
      setStep(6);
    } else {
      setStep(step + 1);
    }
  }

  function handleRetry() {
    setStep(0);
    setAnswers([]);
    setSelected("");
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/debt" className="hover:text-blue-600">借金・債務整理</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-700">債務整理 診断ツール</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">
            債務整理 診断ツール
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            5つの質問に答えるだけ｜最適な方法を無料診断｜2026年最新対応
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Ad — top */}
        <AdUnit slot="debt-diagnosis-top" className="mb-6" />

        {/* ── Step 0: Intro ── */}
        {step === 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💬</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  あなたに最適な<br />債務整理方法を診断します
                </h2>
                <p className="text-gray-600">
                  5つの質問に答えるだけで、任意整理・個人再生・自己破産の中から
                  あなたの状況に合った方法をご提案します。
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  ✅ 登録不要・完全無料&nbsp;&nbsp;✅ 所要時間：約1分&nbsp;&nbsp;✅ 個人情報の入力なし
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: "🟡", label: "任意整理", sub: "利息カット" },
                  { icon: "🟠", label: "個人再生", sub: "大幅減額" },
                  { icon: "🔴", label: "自己破産", sub: "支払い免除" },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="text-sm font-semibold text-gray-800">{m.label}</div>
                    <div className="text-xs text-gray-500">{m.sub}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleStart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
              >
                診断を始める →
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                ※ 本診断は参考情報です。実際の判断は専門家にご相談ください。
              </p>
            </div>

            {/* Empathy message */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
              <p className="text-gray-700 leading-relaxed">
                借金問題で悩んでいるのはあなただけではありません。毎年多くの方が債務整理を通じて生活を立て直しています。
                まず自分の状況を知ることが、解決への第一歩です。一人で抱え込まず、専門家に相談することで必ず道は開けます。
              </p>
            </div>
          </>
        )}

        {/* ── Steps 1–5: Quiz ── */}
        {step >= 1 && step <= 5 && currentQuestion && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  質問 {step} / 5
                </span>
                <span className="text-sm text-blue-600 font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Q{step}. {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-gray-800 ${
                    selected === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span className="inline-block w-7 h-7 rounded-full border-2 border-current mr-3 text-center text-sm leading-6 font-bold">
                    {opt.value}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (step === 1) {
                    setStep(0);
                  } else {
                    setAnswers(answers.slice(0, -1));
                    setStep(step - 1);
                    setSelected(answers[step - 2] ?? "");
                  }
                }}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ← 戻る
              </button>
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  selected
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {step === 5 ? "診断結果を見る →" : "次の質問へ →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 6: Result ── */}
        {step === 6 && result && (
          <>
            {/* Section 1: 診断結果カード */}
            <div className={`${result.colorBg} border-2 ${result.colorBorder} rounded-xl p-6 mb-4`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{result.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">診断結果</div>
                  <h2 className={`text-xl font-bold ${result.colorText}`}>{result.title}</h2>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.message}</p>
            </div>

            {/* Section 2: 状況サマリー */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                あなたの状況サマリー
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>借金総額: 約{DEBT_LABELS[answers[1]] ?? "不明"}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>月収: {INCOME_LABELS[answers[2]] ?? "不明"}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>住宅: {HOUSING_LABELS[answers[3]] ?? "不明"}</span>
                </div>
              </div>
              {result.monthlyReduction !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700 mb-1">推定月返済削減額</div>
                  <div className="text-2xl font-bold text-blue-800">
                    月約 {result.monthlyReduction.toLocaleString()}円 の削減が見込める可能性
                  </div>
                  <div className="text-xs text-blue-500 mt-1">※ 概算です。実際は弁護士にご確認ください</div>
                </div>
              )}
            </div>

            {/* Section 3: 推奨方法の詳細 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                {result.type === "緊急相談" ? "今すぐ取るべき行動" : `${result.type}の特徴`}
              </h3>
              <ul className="space-y-2">
                {result.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-500 font-bold mt-0.5">✦</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ad — mid */}
            <AdUnit slot="debt-diagnosis-mid" className="mb-4" />

            {/* Section 4: 今すぐできること */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                今すぐできること（3ステップ）
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "まず無料相談を予約する",
                    desc: "弁護士・司法書士事務所の多くが無料相談を提供しています。電話一本で予約できます。相談しただけで手続きが始まることはありません。",
                  },
                  {
                    step: 2,
                    title: "借金の一覧を用意する",
                    desc: "借入先の名前・残高・月返済額をメモしておくと相談がスムーズです。通帳や明細書があれば持参しましょう。",
                  },
                  {
                    step: 3,
                    title: "法テラスを活用する（収入が少ない場合）",
                    desc: "法テラス（0570-078374）では費用の立替制度があります。収入が少なくても弁護士に依頼できます。",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {s.step}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">「{s.title}」</div>
                      <p className="text-sm text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: 関連ツールリンク */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-4">より詳しく知りたい方はこちら</h3>
              <div className="space-y-2">
                {[
                  { href: "/debt/debt-restructuring-checker", label: "任意整理 vs 個人再生 vs 自己破産 詳細比較" },
                  { href: "/debt/repayment-simulator", label: "借金返済シミュレーターで現状を確認する" },
                  { href: "/debt/revolving-calculator", label: "リボ払いの危険度を確認する" },
                  { href: "/debt/loan-interest-calculator", label: "カードローン利息計算機" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    <span>→</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-xs text-gray-500">
              ※ 本診断はあくまで参考情報です。実際の債務整理の可否・最適な方法は個人の状況により異なります。必ず弁護士・司法書士にご相談ください。
            </div>

            {/* Retry */}
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors mb-6"
            >
              もう一度診断する
            </button>
          </>
        )}

        {/* ─── SEO Content ─────────────────────────────────────────────────────── */}

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            債務整理が向いている状況チェックリスト
          </h2>
          <ul className="space-y-2 mb-4">
            {[
              "毎月の返済が収入の3割を超えている",
              "複数のカードやローンから借りている",
              "最低返済額しか払えていない",
              "新たな借入で返済している",
              "督促状・電話が来ている",
              "家族や職場に知られることを恐れている",
              "眠れない・食欲がないなど心身に影響が出ている",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-gray-400 mt-0.5">□</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800 font-medium">
              3つ以上当てはまる場合は、専門家への相談を強くお勧めします
            </p>
          </div>
        </div>

        {/* 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            債務整理に関する基礎知識
          </h2>
          <p className="text-gray-700 mb-4">
            借金問題は放置すると悪化します。早めの対処が重要です。
          </p>

          <h3 className="font-semibold text-gray-900 mb-2">放置した場合のリスク</h3>
          <ol className="space-y-1 mb-5 text-gray-700">
            {[
              "延滞損害金の発生（年14.6%の遅延利息）",
              "信用情報への傷（滞納2〜3ヶ月で登録）",
              "督促・取り立て電話",
              "裁判所からの支払督促",
              "給与・預金の差し押さえ",
            ].map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500 font-bold">{i + 1}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>

          <h3 className="font-semibold text-gray-900 mb-2">債務整理をすべき目安</h3>
          <ul className="space-y-1 mb-5 text-gray-700">
            {[
              "毎月の返済が収入の3分の1以上",
              "返済のために新たな借金をしている",
              "生活費が借金で賄えない状態",
            ].map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500">●</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold text-gray-900 mb-2">無料で相談できる場所</h3>
          <ul className="space-y-1 mb-5 text-gray-700">
            {[
              "法テラス（日本司法支援センター）: 0570-078374",
              "各地の弁護士会・司法書士会の無料相談",
              "市区町村の消費生活センター",
            ].map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-500">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <p className="text-gray-700 text-sm">
            借金問題に悩む人は思っている以上に多いです。2025年の個人破産申立件数は約6万件。
            債務整理（任意整理・個人再生含む）はさらに多くの件数があります。
            一人で抱え込まず、専門家に相談することが解決への第一歩です。
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {[
              {
                q: "債務整理をすると会社にバレますか？",
                a: "任意整理・個人再生・自己破産いずれも、原則として勤務先に通知されることはありません。ただし給与差し押さえが先に行われていた場合は、勤務先が関係することがあります。また官報（国の公告紙）への掲載がありますが、一般の方が確認することはほとんどありません。",
              },
              {
                q: "債務整理後に就職・転職はできますか？",
                a: "任意整理・個人再生は職業制限がなく、ほぼすべての職業に就けます。自己破産は免責が確定するまでの期間（数ヶ月）、弁護士・司法書士・警備員・保険外交員など一部の職業に就けません。免責後は制限が解除されます。",
              },
              {
                q: "借金を1社だけ任意整理することはできますか？",
                a: "はい、任意整理は特定の債権者だけを選んで手続きできます。例えば金利の高い消費者金融だけを整理して、住宅ローンや自動車ローンは整理しないことも可能です。どの借入先を整理するかは弁護士・司法書士と相談して決めます。",
              },
              {
                q: "弁護士への依頼費用はどう工面すればいいですか？",
                a: "いくつかの方法があります。①法テラスの費用立替制度（収入基準を満たせば費用を立て替えてもらえる）②弁護士事務所の分割払い（多くの事務所で対応）③着手金が不要の事務所を選ぶ。依頼後は債権者への返済を止められるため、その分を費用に充てることもできます。",
              },
              {
                q: "債務整理の相談をしただけで手続きが始まりますか？",
                a: "いいえ、相談しただけでは手続きは始まりません。弁護士・司法書士に正式に依頼（委任契約を締結）して初めて手続きが始まります。無料相談は何回でも相談だけで終わることができます。相談後に断ることも自由です。",
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
              { href: "/debt/debt-restructuring-checker", label: "任意整理vs自己破産 詳細比較ツール" },
              { href: "/debt/repayment-simulator", label: "借金返済シミュレーター" },
              { href: "/debt/revolving-calculator", label: "リボ払い恐怖計算機" },
              { href: "/debt/loan-interest-calculator", label: "カードローン利息計算機" },
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
  );
}
