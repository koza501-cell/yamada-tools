"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

const CASE_TYPES = [
  { id: "isan_bunkatsu", label: "遺産分割協議", desc: "相続人全員で分割を協議する", icon: "🤝" },
  { id: "hotei_souzoku", label: "法定相続", desc: "法定割合どおりに相続する", icon: "⚖️" },
  { id: "yuigon", label: "遺言書による相続", desc: "公正証書遺言・自筆証書遺言がある", icon: "📜" },
  { id: "kazoku_kouku", label: "相続人申告登記", desc: "遺産分割前に義務を暫定履行", icon: "✋" },
];

export default function CaseNewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [caseType, setCaseType] = useState("isan_bunkatsu");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ログインが必要です</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">書類作成ケースを作るにはアカウントが必要です。</p>
          <Link
            href="/auth/login?redirect=/souzoku-touki/case/new"
            className="block w-full bg-ai text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
          >
            ログイン / 新規登録
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("session_token") || "";
      const res = await fetch(`${API_SOUZOKU}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          case_type: caseType,
          name: name.trim() || `相続登記ケース（${CASE_TYPES.find((c) => c.id === caseType)?.label}）`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "作成に失敗しました");
      router.push(`/souzoku-touki/case/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 新規ケース作成
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">新規ケースを作成</h1>
          <p className="text-white/80 mt-2 text-sm">書類作成に必要な情報を入力します。途中で保存できます。</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">ケース種別を選択</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {CASE_TYPES.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setCaseType(ct.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  caseType === ct.id
                    ? "border-ai bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="text-2xl mb-2">{ct.icon}</div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{ct.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ct.desc}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ケース名（任意）
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：父の相続登記 2024年"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ai text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">後から変更できます。省略すると自動設定されます。</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-ai hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "作成中..." : "ケースを作成して情報入力へ →"}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
          <strong>ご注意：</strong>書類のPDF生成には別途プランの購入が必要です。
          情報の入力・保存は無料で行えます。
          <Link href="/souzoku-touki/pricing" className="underline ml-1">プランを見る →</Link>
        </div>
      </div>
    </div>
  );
}
