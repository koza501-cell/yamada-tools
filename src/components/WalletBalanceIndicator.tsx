"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";

export default function WalletBalanceIndicator() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [hasActivity, setHasActivity] = useState(false);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("session_token");
    if (!token) return;
    fetch(API_PAYMENT + "/wallet/balance", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => {
        setBalance(typeof d.balance_jpy === "number" ? d.balance_jpy : 0);
        setHasActivity(!!d.has_activity);
      })
      .catch(() => {});
  }, [user]);

  if (!user || balance === null) return null;
  if (balance === 0 && !hasActivity) return null;

  return (
    <Link
      href="/account/wallet"
      className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-medium min-h-[36px]"
      title="yamadaチャージ残高"
    >
      <span>💰</span>
      <span>{balance > 0 ? `¥${balance.toLocaleString()}` : "チャージ"}</span>
    </Link>
  );
}
