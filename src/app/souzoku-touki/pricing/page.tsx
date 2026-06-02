"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: 1980,
    access: "30日間",
    color: "border-gray-300",
    badge: "",
    features: [
      { label: "登記申請書 PDF（法務局書式準拠）", ok: true },
      { label: "遺産分割協議書 PDF", ok: false },
      { label: "相続関係説明図 PDF", ok: false },
      { label: "フォーム入力データ保存", ok: true },
      { label: "アクセス期間", ok: true, note: "30日間" },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 3980,
    access: "90日間",
    color: "border-ai",
    badge: "人気",
    features: [
      { label: "登記申請書 PDF（法務局書式準拠）", ok: true },
      { label: "遺産分割協議書 PDF", ok: true },
      { label: "相続関係説明図 PDF", ok: true },
      { label: "フォーム入力データ保存", ok: true },
      { label: "アクセス期間", ok: true, note: "90日間" },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 7980,
    access: "1年間",
    color: "border-kon",
    badge: "フル機能",
    features: [
      { label: "登記申請書 PDF（法務局書式準拠）", ok: true },
      { label: "遺産分割協議書 PDF", ok: true },
      { label: "相続関係説明図 PDF", ok: true },
      { label: "フォーム入力データ保存", ok: true },
      { label: "アクセス期間", ok: true, note: "1年間（365日）" },
    ],
  },
] as const;

type TierId = "basic" | "standard" | "premium";

export default function SouzokuPricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<TierId | null>(null);
  const [error, setError] = useState("");

  const handleBuy = async (tier: TierId) => {
    if (!user) {
      router.push("/auth/login?redirect=/souzoku-touki/pricing");
      return;
    }
    setError("");
    setLoading(tier);
    try {
      const token = localStorage.getItem("session_token") || "";
      // First create a new case, then checkout
      const caseRes = await fetch(`${API_SOUZOKU}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ case_type: "isan_bunkatsu", name: "新しい相続登記ケース" }),
      });
      if (!caseRes.ok) throw new Error("ケースの作成に失敗しました");
      const caseData = await caseRes.json();
      const caseId = caseData.id;

      const checkoutRes = await fetch(`${API_SOUZOKU}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ case_id: caseId, tier }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.detail || "チェックアウトに失敗しました");
      window.location.href = checkoutData.checkout_url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 書類作成プラン
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">📄 書類作成プラン</h1>
          <p className="text-white/80 text-sm max-w-xl mx-auto">
            法務局提出書類をPDFで自動生成。入力した情報から正確な書式を出力します。
            一度きりの購入で期間内何度でもダウンロード可能。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Disclaimer */}
        <div className="bg-gray-50 dark:bg-amber-950/40 border border-gray-200 dark:border-gray-200 rounded-xl p-4 mb-8 text-sm text-kon dark:text-amber-300">
          ⚠️ 本ツールは法務局公式書式に準拠した書類作成補助です。法律相談・代理申請は行いません。書類の最終確認は必ずご自身で行ってください。
        </div>

        {error && (
          <div className="bg-gray-50 dark:bg-red-950/40 border border-gray-200 dark:border-danger rounded-xl p-4 mb-6 text-sm text-danger dark:text-gin">
            {error}
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 ${tier.color} overflow-hidden flex flex-col`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0 bg-ai text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  {tier.badge}
                </div>
              )}
              <div className="p-6 flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{tier.name}</h2>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">¥{tier.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">（税込・買い切り）</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">アクセス期間：{tier.access}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className={f.ok ? "text-green-500 mt-0.5 flex-shrink-0" : "text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0"}>
                        {f.ok ? "✓" : "✕"}
                      </span>
                      <span className={f.ok ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}>
                        {f.label}{"note" in f && f.ok ? `（${f.note}）` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 pt-0">
                <button type="button"
                  onClick={() => handleBuy(tier.id)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${tier.id === "standard"
                      ? "bg-ai hover:bg-ai text-white shadow-md hover:shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"}`}
                >
                  {loading === tier.id ? "処理中..." : (user ? `${tier.name}を購入する` : "ログインして購入")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">機能比較</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 w-1/2">機能</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-center">Basic</th>
                  <th className="px-4 py-3 text-xs font-medium text-ai text-center">Standard</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 text-sm">
                {[
                  ["登記申請書 PDF（法務局書式）", true, true, true],
                  ["遺産分割協議書 PDF", false, true, true],
                  ["相続関係説明図 PDF", false, true, true],
                  ["フォームデータ保存・再編集", true, true, true],
                  ["アクセス期間", "30日", "90日", "1年"],
                  ["価格（税込）", "¥1,980", "¥3,980", "¥7,980"],
                ].map(([label, basic, standard, premium], i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{label}</td>
                    {[basic, standard, premium].map((v, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {typeof v === "boolean" ? (
                          <span className={v ? "text-green-500 font-bold" : "text-gray-300 dark:text-gray-600"}>
                            {v ? "✓" : "✕"}
                          </span>
                        ) : (
                          <span className={`font-medium ${j === 1 ? "text-ai" : "text-gray-600 dark:text-gray-400"}`}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Free tools CTA */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">まず無料ツールを使ってみる</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/souzoku-touki/wizard", icon: "🧭", label: "ケース診断" },
              { href: "/souzoku-touki/checklist", icon: "📋", label: "書類チェックリスト" },
              { href: "/souzoku-touki/tax", icon: "🧮", label: "税額計算" },
              { href: "/souzoku-touki/houmukyoku", icon: "🏛️", label: "法務局検索" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-white dark:bg-gray-700 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600"
              >
                <div className="text-xl mb-1">{l.icon}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{l.label}</div>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本ツールが作成する書類はDIY申請のための参考書類です。内容の正確性・完全性を保証するものではありません。重要な法的手続きは専門家（司法書士）への相談もご検討ください。
        </p>
      </div>
    </div>
  );
}
