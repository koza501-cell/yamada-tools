"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const API_PAYMENT = "https://api.yamada-tools.jp/api/payment";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); return; }
    fetch(API_PAYMENT + "/subscription", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => setSubscription(d.subscription))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const plan = user.effective_plan || "free";
  const isFree = plan === "free";

  const formatDate = (ts: number) => {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  const openPortal = async () => {
    setPortalLoading(true);
    const token = localStorage.getItem("session_token");
    try {
      const res = await fetch(API_PAYMENT + "/portal", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (data.portal_url) window.location.href = data.portal_url;
    } catch {
      alert("ポータルを開けませんでした");
    }
    setPortalLoading(false);
  };

  const planName = (p: string) => {
    if (p === "pro" || p === "pro_trial") return "PROプラン";
    if (p === "team") return "TEAMプラン";
    return "フリープラン";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">サブスクリプション</h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">現在のプラン</span>
              <span className="font-semibold text-gray-900">{planName(plan)}</span>
            </div>
            {subscription?.status && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">ステータス</span>
                <span className="font-medium text-green-600">{subscription.status === "active" ? "アクティブ" : subscription.status}</span>
              </div>
            )}
            {subscription?.current_period_end && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">次回請求日</span>
                <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
              </div>
            )}
            {subscription?.payment_method_last4 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">お支払い方法</span>
                <span className="font-medium">•••• {subscription.payment_method_last4}</span>
              </div>
            )}
          </div>
        )}
        {!isFree && (
          <button onClick={openPortal} disabled={portalLoading} className="mt-6 w-full px-4 py-2.5 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] disabled:opacity-50 transition-colors">
            {portalLoading ? "読み込み中..." : "支払い方法・解約の管理"}
          </button>
        )}
      </div>

      {isFree && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">プランを比較する</h3>
          <div className="grid grid-cols-3 gap-3 text-xs text-center mb-6">
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-bold text-gray-700 mb-2">FREE</div>
              <div className="text-gray-500 space-y-1"><p>基本ツール利用可</p><p>10MB制限</p><p>広告あり</p></div>
            </div>
            <div className="rounded-lg border-2 border-[#223A70] p-3 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#223A70] text-white text-[10px] px-2 py-0.5 rounded">おすすめ</div>
              <div className="font-bold text-[#223A70] mb-2">PRO</div>
              <div className="text-gray-500 space-y-1"><p>全ツール無制限</p><p>100MB対応</p><p>広告なし</p></div>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-bold text-gray-700 mb-2">TEAM</div>
              <div className="text-gray-500 space-y-1"><p>PRO全機能</p><p>チーム管理</p><p>請求一元化</p></div>
            </div>
          </div>
          <Link href="/pricing" className="block w-full text-center px-4 py-2.5 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] transition-colors">PROにアップグレード →</Link>
        </div>
      )}
    </div>
  );
}
