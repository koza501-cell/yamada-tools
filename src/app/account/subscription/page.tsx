"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PlanStatusCard } from "../_components/PlanStatusCard";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<string | null>(null);
  const [dayPassExpiry, setDayPassExpiry] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); return; }
    fetch(API_PAYMENT + "/subscription", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => setSubscription(d.subscription))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const plan = params.get("plan") || null;
      setPaymentSuccess(true);
      setPaymentPlan(plan);
      localStorage.setItem("yamada_payment_success", JSON.stringify({ plan, ts: Date.now() }));
      refreshUser();
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      url.searchParams.delete("plan");
      window.history.replaceState(null, "", url.toString());
    } else {
      try {
        const saved = localStorage.getItem("yamada_payment_success");
        if (saved) {
          const { plan, ts } = JSON.parse(saved);
          if (Date.now() - ts < 10 * 60 * 1000) {
            setPaymentSuccess(true);
            setPaymentPlan(plan);
          }
          localStorage.removeItem("yamada_payment_success");
        }
      } catch {}
    }
  }, []);

  if (!user) return null;

  const plan = user.effective_plan || "free";
  const isFree = plan === "free";
  const isDayPass = plan === "pro_trial";

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

  return (
    <div className="space-y-6">
      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-green-500 text-xl mt-0.5">&#x2705;</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">ご購入ありがとうございます！</p>
            <p className="text-xs text-green-700 mt-0.5">
              {paymentPlan === "1day"
                ? "デイパスが有効になりました（24時間）"
                : "PROプランが有効になりました。次回請求日まで全機能をご利用いただけます。"}
            </p>
            <a href="/generator/envelope-print" className="mt-2 inline-block text-xs font-medium text-green-700 underline underline-offset-2 hover:text-green-900">
              封筒印刷に戻る &rarr;
            </a>
          </div>
          <button onClick={() => setPaymentSuccess(false)} className="text-green-400 hover:text-green-600 text-lg leading-none">&times;</button>
        </div>
      )}
    <PlanStatusCard />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">サブスクリプション</h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        ) : isDayPass ? (
          <p className="text-sm text-gray-500">デイパスをご利用中です。月額サブスクリプションの詳細はありません。</p>
        ) : (
          <div className="space-y-3 text-sm">
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
            {!subscription?.status && (
              <p className="text-sm text-gray-500 py-2">月額サブスクリプションはありません</p>
            )}
          </div>
        )}
        {!isFree && !isDayPass && (
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
