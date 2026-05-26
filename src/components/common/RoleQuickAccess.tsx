"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cardCls } from "@/components/ui/Card";

const STORAGE_KEY = "yamada-user-role";

const ROLES = [
  { id: "accounting", label: "経理・会計", icon: "🏦" },
  { id: "hr",        label: "総務・人事", icon: "👥" },
  { id: "sales",     label: "営業",       icon: "📊" },
  { id: "freelance", label: "フリーランス", icon: "💼" },
  { id: "general",   label: "一般",       icon: "🙋" },
] as const;

type RoleId = typeof ROLES[number]["id"];

const ROLE_TOOLS: Record<RoleId, { href: string; icon: string; label: string }[]> = {
  accounting: [
    { href: "/convert/bank-format",              icon: "🏦", label: "全銀フォーマット変換" },
    { href: "/document/invoice",                  icon: "📋", label: "請求書作成" },
    { href: "/document/quotation",                icon: "📝", label: "見積書作成" },
    { href: "/tax/consumption-tax",               icon: "🧮", label: "消費税計算" },
    { href: "/generator/nenmatsu-calc",           icon: "📆", label: "年末調整計算" },
    { href: "/business/corporate-tax-calculator", icon: "🏛️", label: "法人税計算" },
  ],
  hr: [
    { href: "/generator/envelope-print",           icon: "✉️", label: "封筒印刷" },
    { href: "/generator/hanko",                     icon: "🔴", label: "電子印鑑" },
    { href: "/finance/overtime-calculator",         icon: "⏰", label: "残業代計算" },
    { href: "/finance/net-salary-calculator",       icon: "💴", label: "給与手取り計算" },
    { href: "/career/retirement-bonus-calculator",  icon: "💰", label: "退職金計算" },
    { href: "/generator/nenmatsu-calc",             icon: "📆", label: "年末調整計算" },
  ],
  sales: [
    { href: "/document/invoice",       icon: "📋", label: "請求書作成" },
    { href: "/document/quotation",     icon: "📝", label: "見積書作成" },
    { href: "/document/business-card", icon: "🪪", label: "名刺作成" },
    { href: "/image/qr-code",          icon: "🔲", label: "QRコード作成" },
    { href: "/pdf/merge",              icon: "🗂️", label: "PDF結合" },
    { href: "/pdf/compress",           icon: "📦", label: "PDF圧縮" },
  ],
  freelance: [
    { href: "/document/invoice",                  icon: "📋", label: "請求書作成" },
    { href: "/business/freelance-tax-calculator", icon: "💼", label: "フリーランス税金計算" },
    { href: "/tax/income-tax-calculator",         icon: "📊", label: "所得税計算" },
    { href: "/tax/furusato-nozei-calculator",     icon: "🎁", label: "ふるさと納税計算" },
    { href: "/document/quotation",                icon: "📝", label: "見積書作成" },
    { href: "/generator/hanko",                    icon: "🔴", label: "電子印鑑" },
  ],
  general: [
    { href: "/pdf/compress",                    icon: "📦", label: "PDF圧縮" },
    { href: "/image/compress",                  icon: "🖼️", label: "画像圧縮" },
    { href: "/realestate/hazard-checker",       icon: "🌊", label: "ハザードマップ" },
    { href: "/realestate/school-district",      icon: "🏫", label: "学区チェック" },
    { href: "/convert/furigana",                icon: "あ", label: "ふりがな変換" },
    { href: "/pdf/merge",                       icon: "🗂️", label: "PDF結合" },
  ],
};

export default function RoleQuickAccess() {
  const [role, setRole] = useState<RoleId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (saved && ROLES.some(r => r.id === saved)) setRole(saved);
  }, []);

  const selectRole = (id: RoleId) => {
    setRole(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  if (!mounted) return null;

  const tools = role ? ROLE_TOOLS[role] : null;

  return (
    <section className="py-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">あなたの職種は？</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => selectRole(r.id)}
                className={`px-4 py-2 rounded-pill text-sm font-bold transition-all border-2 ${
                  role === r.id
                    ? "bg-primary-900 text-white border-primary-900 shadow-md scale-105"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-primary-700 hover:text-primary-700 dark:hover:border-primary-700"
                }`}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>

        {tools && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {tools.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className={`${cardCls('default')} flex flex-col items-center gap-1 p-3 text-center hover:border-ai dark:hover:border-ai`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">{t.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
