"use client";
import { useState } from "react";
import Link from "next/link";

interface DayPassPaywallProps {
  open: boolean;
  onClose: () => void;
  apiBase: string;
  rowCount?: number;
  onContinueFree?: () => void;
}

const PASSES = [
  { type: "1day", label: "1日パス", price: "¥120", badge: "" },
  { type: "3day", label: "3日パス", price: "¥290", badge: "おすすめ" },
  { type: "7day", label: "7日パス", price: "¥490", badge: "最もお得" },
] as const;

const FEATURES = [
  "CSV一括印刷（50件まで）",
  "宛名帳に保存（50件まで）",
  "テンプレート保存（5件まで）",
  "広告非表示",
];

export default function DayPassPaywall({ open, onClose, apiBase, rowCount, onContinueFree }: DayPassPaywallProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!open) return null;

  const handlePurchase = async (passType: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("session_token") : null;
    if (!token) {
      window.location.href = "/login?redirect=/generator/envelope-print";
      return;
    }
    setLoading(passType);
    try {
      const res = await fetch(`${apiBase}/api/payment/day-pass-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pass_type: passType }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.checkout_url;
      } else {
        const data = await res.json();
        alert(data.detail || "購入処理に失敗しました");
        setLoading(null);
      }
    } catch {
      alert("ネットワークエラーが発生しました");
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl leading-none rounded-full hover:bg-gray-100"
          aria-label="閉じる"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">今すぐ続ける</h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">広告なし・全機能利用可能</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {PASSES.map((p) => (
            <div
              key={p.type}
              className={`relative flex flex-col items-center rounded-xl border-2 p-4 ${
                p.badge === "おすすめ"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : p.badge === "最もお得"
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-gray-200 bg-gray-50 dark:bg-gray-800"
              }`}
            >
              {p.badge && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    p.badge === "おすすめ" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {p.badge}
                </span>
              )}
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">{p.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{p.price}</div>
              <div className="text-xs text-gray-400 mb-3">税込</div>
              <button
                onClick={() => handlePurchase(p.type)}
                disabled={loading !== null}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  loading === p.type
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : p.badge === "おすすめ"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : p.badge === "最もお得"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                }`}
              >
                {loading === p.type ? "処理中..." : "購入する"}
              </button>
            </div>
          ))}
        </div>

        <ul className="space-y-1.5 mb-5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-300">
              <span className="text-green-500 shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-1.5">
          <p className="text-xs text-center text-gray-400">
            サブスクリプションをご希望ですか？
            <Link href="/pricing" className="text-blue-500 hover:underline ml-1">プランを見る →</Link>
          </p>
          <p className="text-xs text-center text-gray-400">コンビニ払い・PayPayは近日対応予定</p>
        </div>
      </div>
    </div>
  );
}
