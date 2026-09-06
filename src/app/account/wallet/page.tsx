"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import PaymentMethodsTrustBanner from "@/components/PaymentMethodsTrustBanner";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";

const TIERS = [
  { tier: "1000", charge: 1000, credit: 1000, badge: "" },
  { tier: "3000", charge: 3000, credit: 3300, badge: "+10%" },
  { tier: "5000", charge: 5000, credit: 5700, badge: "+14%" },
] as const;

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    fetch(API_PAYMENT + "/wallet/balance", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => setBalance(typeof d.balance_jpy === "number" ? d.balance_jpy : 0))
      .catch(() => {});
  }, []);

  const handleTopup = async (tier: string) => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      window.location.href = "/auth/login?redirect=/account/wallet";
      return;
    }
    setLoadingTier(tier);
    try {
      const res = await fetch(API_PAYMENT + "/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ tier }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.checkout_url;
      } else {
        const data = await res.json();
        alert(data.detail || "処理に失敗しました");
        setLoadingTier(null);
      }
    } catch {
      alert("ネットワークエラーが発生しました");
      setLoadingTier(null);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-base font-semibold text-gray-900 mb-1">yamadaチャージ</h1>
        <p className="text-sm text-gray-500 mb-5">サイト内の全ツールで使えるチャージ残高。まとめてチャージするとお得です。</p>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
          <span className="text-sm text-gray-600">現在の残高</span>
          <span className="text-2xl font-bold text-gray-900">
            {balance === null ? "…" : `¥${balance.toLocaleString()}`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {TIERS.map((t) => (
            <div key={t.tier} className="relative flex flex-col items-center rounded-xl border-2 border-gray-200 p-4">
              {t.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white whitespace-nowrap">
                  {t.badge}
                </span>
              )}
              <div className="text-sm text-gray-500 mt-1">¥{t.charge.toLocaleString()}チャージ</div>
              <div className="text-lg font-bold text-gray-900 mt-1 text-center">
                → ¥{t.credit.toLocaleString()}分使える
              </div>
              <div className="text-xs text-gray-400 mb-3">税込</div>
              <button
                onClick={() => handleTopup(t.tier)}
                disabled={loadingTier !== null}
                className="w-full py-2 rounded-lg text-sm font-medium bg-[#223A70] hover:bg-[#1a2d58] text-white transition-colors disabled:opacity-50"
              >
                {loadingTier === t.tier ? "処理中..." : "チャージする"}
              </button>
            </div>
          ))}
        </div>

        <PaymentMethodsTrustBanner />

        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link href="/account/wallet-history" className="text-xs text-ai hover:underline">
            利用履歴を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
