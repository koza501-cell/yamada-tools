"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const API_PAYMENT = "https://api.yamada-tools.jp/api/payment";

const planLabels: Record<string, { label: string; color: string }> = {
  free: { label: "FREE", color: "bg-gray-200 text-gray-700" },
  pro_trial: { label: "PRO (トライアル)", color: "bg-blue-100 text-blue-700" },
  pro: { label: "PRO", color: "bg-[#223A70] text-white" },
  team: { label: "TEAM", color: "bg-purple-600 text-white" },
};

export default function AccountPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    fetch(API_PAYMENT + "/subscription", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => setSubscription(d))
      .catch(() => {});
  }, []);

  if (!user) return null;

  const plan = user.effective_plan || "free";
  const planInfo = planLabels[plan] || planLabels.free;
  const displayName = user.display_name || user.email.split("@")[0];

  const formatDate = (ts: number) => {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">こんにちは、{displayName}さん</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <span className={"inline-block px-3 py-1 rounded-full text-sm font-semibold " + planInfo.color}>{planInfo.label}</span>
        </div>
        {user.trial_active && user.trial_days_remaining != null && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            トライアル残り <strong>{user.trial_days_remaining}日</strong> — トライアル終了前にPROプランへアップグレードしてください
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">今日の利用回数</p>
          <p className="text-3xl font-bold text-[#223A70]">—</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">今月の利用回数</p>
          <p className="text-3xl font-bold text-[#223A70]">—</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">サブスクリプション状態</h2>
        {subscription?.status ? (
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">ステータス</span>
              <span className="font-medium">{subscription.status === "active" ? "アクティブ" : subscription.status}</span>
            </div>
            {subscription.current_period_end && (
              <div className="flex justify-between">
                <span className="text-gray-500">次回請求日</span>
                <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{plan === "free" ? "フリープラン" : planInfo.label}</p>
        )}
      </div>

      {plan === "free" && (
        <div className="bg-gradient-to-r from-[#223A70] to-[#1a2d57] text-white rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">PROプランにアップグレード</h3>
          <p className="text-white/80 text-sm mb-4">全ツール無制限・広告非表示・100MBファイル対応</p>
          <Link href="/pricing" className="inline-block bg-white text-[#223A70] font-semibold px-5 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">プランを見る →</Link>
        </div>
      )}
    </div>
  );
}
