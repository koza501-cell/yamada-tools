"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/content", label: "コンテンツ管理", icon: "📝" },
  { href: "/admin/blog", label: "ブログ管理", icon: "✍️" },
  { href: "/admin/banners", label: "バナー管理", icon: "🎨" },
  { href: "/admin/campaigns", label: "キャンペーン", icon: "🎯" },
  { href: "/admin/settings", label: "サイト設定", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple token check - in production use proper auth
    if (token === "yamada-admin-2024") {
      localStorage.setItem("admin_token", token);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("認証に失敗しました");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setToken("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-kon text-center mb-6">
            🔐 管理者ログイン
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="管理者トークンを入力"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:border-kon"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-kon text-white py-3 rounded-xl font-bold hover:bg-ai transition-colors"
            >
              ログイン
            </button>
          </form>
          <Link href="/" className="block text-center text-sm text-gray-500 mt-4 hover:underline">
            ← サイトに戻る
          </Link>
        </div>
      </div>
    );
  }

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            🚪 ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
