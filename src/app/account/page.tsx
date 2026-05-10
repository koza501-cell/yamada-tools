"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PlanStatusCard } from "./_components/PlanStatusCard";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";

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
  const displayName = user.display_name || user.email.split("@")[0];

  const formatDate = (ts: number) => {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900">こんにちは、{displayName}さん</h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        {user.trial_active && user.trial_days_remaining != null && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-kon">
            トライアル残り <strong>{user.trial_days_remaining}日</strong> — トライアル終了前にPROプランへアップグレードしてください
          </div>
        )}
      </div>

      <PlanStatusCard />

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

      {subscription?.status && plan !== "pro_trial" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">サブスクリプション状態</h2>
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
        </div>
      )}
    </div>
  );
}
