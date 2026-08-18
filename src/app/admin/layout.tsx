"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/content", label: "コンテンツ管理", icon: "📝" },
  { href: "/admin/blog", label: "ブログ管理", icon: "✍️" },
  { href: "/admin/banners", label: "バナー管理", icon: "🎨" },
  { href: "/admin/campaigns", label: "キャンペーン", icon: "🎯" },
  { href: "/admin/feedback", label: "フィードバック", icon: "💬" },
  { href: "/admin/settings", label: "サイト設定", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-kon text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">🛠️ 山田ツール</h1>
          <p className="text-sm text-gray-300">管理ダッシュボード</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    pathname === item.href
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white mb-2">
            🌐 サイトを表示
          </Link>
          <Link
            href="/api/admin/logout"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            🚪 ログアウト
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto" data-no-ads="true">
        {children}
      </main>
    </div>
  );
}
