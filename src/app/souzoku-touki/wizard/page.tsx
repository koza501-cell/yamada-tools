"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DISCLAIMER } from "../data";

const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

const QUESTIONS = [
  {
    id: "deceased_relation",
    q: "亡くなった方との関係は？",
    options: [
      { value: "spouse_child", label: "配偶者・子" },
      { value: "parent", label: "父母・祖父母" },
      { value: "sibling", label: "兄弟姉妹" },
      { value: "other", label: "その他（甥姪等）" },
    ],
  },
  {
    id: "has_will",
    q: "遺言書はありますか？",
    options: [
      { value: "none", label: "ない" },
      { value: "kosho", label: "ある（公正証書遺言）" },
      { value: "jihitsu", label: "ある（自筆証書遺言）" },
      { value: "unknown", label: "わからない" },
    ],
  },
  {
    id: "heirs_count",
    q: "相続人は何人いますか？",
    options: [
      { value: "one", label: "1人のみ" },
      { value: "few", label: "2〜3人" },
      { value: "many", label: "4人以上" },
    ],
  },
  {
    id: "agreement",
    q: "相続人全員で話し合いは済んでいますか？",
    options: [
      { value: "agreed", label: "全員合意済み" },
      { value: "in_progress", label: "話し合い中" },
      { value: "not_yet", label: "まだ話し合っていない" },
    ],
  },
  {
    id: "multiple_deaths",
    q: "被相続人の前に亡くなった相続人はいますか？（数次相続）",
    options: [
      { value: "no", label: "いない" },
      { value: "yes", label: "いる" },
      { value: "unknown", label: "わからない" },
    ],
  },
  {
    id: "renunciation",
    q: "相続放棄した人はいますか？",
    options: [
      { value: "no", label: "いない" },
      { value: "yes", label: "いる" },
    ],
  },
  {
    id: "foreign_heir",
    q: "外国在住の相続人はいますか？",
    options: [
      { value: "no", label: "いない" },
      { value: "yes", label: "いる" },
    ],
  },
  {
    id: "property_count",
    q: "相続する不動産の数は？",
    options: [
      { value: "one", label: "1件" },
      { value: "few", label: "2〜3件" },
      { value: "many", label: "4件以上" },
    ],
  },
  {
    id: "different_pref",
    q: "不動産が複数の都道府県にありますか？",
    options: [
      { value: "no", label: "いいえ（同じ都道府県）" },
      { value: "yes", label: "はい（複数の都道府県）" },
    ],
  },
  {
    id: "urgent",
    q: "申請の期限はどのくらいですか？",
    options: [
      { value: "3years", label: "3年以内（余裕あり）" },
      { value: "urgent", label: "1年以内に必要" },
      { value: "immediate", label: "売買等で急いでいる" },
    ],
  },
];

type Answers = Record<string, string>;

function calcResult(answers: Answers): { caseType: string; complexity: "low" | "medium" | "high"; diy: boolean; reason: string; nextStep: string } {
  const complex = answers.multiple_deaths === "yes" || answers.foreign_heir === "yes";
  const high = answers.multiple_deaths === "yes";

  if (high) {
    return {
      caseType: "数次相続・複雑なケース",
      complexity: "high",
      diy: false,
      reason: "数次相続（相続中に相続人が死亡）や外国在住の相続人がいる場合は、手続きが複雑になるため司法書士への依頼をお勧めします。",
      nextStep: "まず無料相談できる司法書士事務所にお問い合わせください。",
    };
  }

  if (answers.has_will === "kosho" || answers.has_will === "jihitsu") {
    return {
      caseType: "遺言書による相続",
      complexity: complex ? "high" : "medium",
      diy: !complex,
      reason: complex ? "外国在住相続人がいるため専門家を推奨します。" : "公正証書遺言は検認不要で比較的シンプルです。自筆証書遺言は検認手続き（家庭裁判所）が先に必要です。",
      nextStep: "/souzoku-touki/checklist?case=yuigon",
    };
  }

  if (answers.agreement === "agreed" || answers.agreement === "in_progress") {
    return {
      caseType: "遺産分割協議",
      complexity: complex ? "medium" : "low",
      diy: !complex,
      reason: "相続人が合意済みであれば遺産分割協議書を作成して申請できます。配偶者・子への相続であればDIY申請が可能です。",
      nextStep: "/souzoku-touki/checklist?case=isan_bunkatsu",
    };
  }

  return {
    caseType: "法定相続",
    complexity: "low",
    diy: true,
    reason: "遺産分割協議なしに法定相続分で登記する方法です。全相続人の持分が法律で決まるため書類が少なく比較的シンプルです。",
    nextStep: "/souzoku-touki/checklist?case=hotei_souzoku",
  };
}

export default function WizardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ReturnType<typeof calcResult> | null>(null);
  const [creatingCase, setCreatingCase] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login?redirect=/souzoku-touki/wizard");
    }
  }, [user, authLoading, router]);

  const current = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);

  async function handleAnswer(value: string) {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      const r = calcResult(newAnswers);
      setResult(r);
      if (r.diy && r.nextStep.startsWith("/")) {
        setCreatingCase(true);
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("session_token") || "" : "";
          const caseTypeMatch = r.nextStep.match(/[?&]case=([^&]+)/);
          const caseType = caseTypeMatch ? caseTypeMatch[1] : "isan_bunkatsu";
          const res = await fetch(`${API_SOUZOKU}/cases`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ case_type: caseType, name: `相続登記ケース（${r.caseType}）` }),
          });
          if (res.ok) {
            const data = await res.json();
            if (typeof window !== "undefined") {
              sessionStorage.setItem("souzoku_wizard_session", String(data.id));
            }
          }
        } finally {
          setCreatingCase(false);
        }
      }
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult(null);
    if (typeof window !== "undefined") sessionStorage.removeItem("souzoku_wizard_session");
  }

  const complexityColor = {
    low: "text-green-600 dark:text-green-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    high: "text-danger dark:text-danger",
  };
  const complexityLabel = { low: "低（DIY向き）", medium: "中（要注意）", high: "高（専門家推奨）" };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; ケース診断
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">🧭 相続登記ケース診断</h1>
          <p className="text-gray-200 mt-2 text-sm">10問の質問に答えるだけ。自分のケースを判定します</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>質問 {step + 1} / {QUESTIONS.length}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-ai rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{current.q}</h2>
            <div className="space-y-3">
              {current.options.map((opt) => (
                <button type="button"
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-ai hover:bg-gray-50 dark:hover:bg-ai/30 transition-all text-gray-800 dark:text-gray-200 font-medium"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button type="button"
                onClick={() => setStep(step - 1)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ← 前の質問に戻る
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Result card */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border-l-4 ${result.diy ? "border-green-500" : "border-danger"}`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{result.diy ? "✅" : "⚠️"}</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{result.caseType}</h2>
                <p className={`text-lg font-semibold ${complexityColor[result.complexity]}`}>
                  複雑度：{complexityLabel[result.complexity]}
                </p>
              </div>

              <div className={`rounded-xl p-4 mb-6 ${result.diy ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-red-950/30"}`}>
                <p className={`font-bold mb-1 ${result.diy ? "text-green-800 dark:text-green-300" : "text-danger dark:text-gin"}`}>
                  {result.diy ? "DIY申請できる可能性が高いです" : "専門家への依頼をお勧めします"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{result.reason}</p>
              </div>

              {result.diy && result.nextStep.startsWith("/") ? (
                <div className="space-y-3">
                  <Link
                    href={creatingCase ? "#" : "/souzoku-touki/checklist"}
                    onClick={creatingCase ? (e) => e.preventDefault() : undefined}
                    className={`block w-full text-center font-bold py-4 px-6 rounded-xl transition-colors ${
                      creatingCase
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-ai text-white hover:opacity-90"
                    }`}
                  >
                    {creatingCase ? "準備中..." : "📋 必要書類チェックリストを見る"}
                  </Link>
                  <Link
                    href="/souzoku-touki/tax"
                    className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    🧮 登録免許税を計算する
                  </Link>
                  <Link
                    href="/souzoku-touki/houmukyoku"
                    className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    🏛️ 管轄法務局を調べる
                  </Link>
                </div>
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-300 text-sm">
                  <p>{result.nextStep}</p>
                  <Link href="/souzoku-touki/guide/diy-or-professional" className="text-ai underline mt-2 inline-block">
                    自分でできる人・できない人の見分け方 →
                  </Link>
                </div>
              )}
            </div>

            <button type="button"
              onClick={reset}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-2"
            >
              もう一度診断する
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6 px-4">
          ⚠️ {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
