"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/account");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#223A70]" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: "/account", label: "ダッシュボード", icon: "🏠" },
    { href: "/account/profile", label: "プロフィール", icon: "👤" },
    { href: "/account/subscription", label: "サブスクリプション", icon: "💳" },
    ...(user.effective_plan === "pro" || user.effective_plan === "pro_trial" || user.effective_plan === "team"
      ? [{ href: "/account/billing", label: "請求履歴", icon: "🧾" }]
      : []),
    ...(user.effective_plan === "team"
      ? [{ href: "/account/team", label: "チーム管理", icon: "👥" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm overflow-hidden">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={"flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors " + (isActive ? "bg-[#223A70] text-white" : "text-gray-600 hover:bg-gray-50")}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
