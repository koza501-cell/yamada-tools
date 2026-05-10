"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

function formatRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "期限切れ";
  const mins = Math.floor(diff / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const minutes = mins % 60;
  if (days > 0) return `残り ${days}日 ${hours}時間`;
  if (hours > 0) return `残り ${hours}時間 ${minutes}分`;
  return `残り ${minutes}分`;
}

const PLAN_CFG: Record<string, { label: string; badge: string; border: string }> = {
  free:      { label: "FREE",    badge: "bg-gray-100 text-gray-600",   border: "border-gray-200" },
  pro_trial: { label: "デイパス", badge: "bg-gray-50 text-kon", border: "border-gray-200" },
  pro:       { label: "PRO",     badge: "bg-[#223A70] text-white",      border: "border-gray-200" },
  team:      { label: "TEAM",    badge: "bg-kon text-white",     border: "border-kon" },
};

export function PlanStatusCard() {
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const isDayPass = user?.effective_plan === "pro_trial";

  useEffect(() => {
    if (!isDayPass) return;
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [isDayPass]);

  if (!user) return null;

  const plan = user.effective_plan ?? "free";
  const cfg = PLAN_CFG[plan] ?? PLAN_CFG.free;
  const expiresAt = user.day_pass_expires_at;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border ${cfg.border}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">現在のプラン</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-0.5 rounded-full text-sm font-bold ${cfg.badge}`}>{cfg.label}</span>
            {isDayPass && <span className="text-sm font-medium text-kon">ご利用中</span>}
          </div>
        </div>
        {isDayPass && expiresAt ? (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">有効期限</p>
            <p className="text-base font-bold text-kon">{formatRemaining(expiresAt)}</p>
            <p className="text-xs text-gray-400">
              {new Date(expiresAt).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}{" "}
              {new Date(expiresAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} まで
            </p>
          </div>
        ) : plan === "free" ? (
          <Link href="/pricing" className="text-xs px-3 py-1.5 bg-[#223A70] text-white rounded-lg hover:bg-[#1a2d57] transition-colors font-medium whitespace-nowrap">
            アップグレード →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
