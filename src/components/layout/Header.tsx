"use client";
import MegaMenu from "./MegaMenu";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMac, setIsMac] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { href: "/pdf", icon: "📄", label: "PDF", category: "pdf" as const },
    { href: "/document", icon: "📝", label: "書類作成", category: "document" as const },
    { href: "/convert", icon: "🔄", label: "変換", category: "convert" as const },
    { href: "/image", icon: "🖼️", label: "画像", category: "image" as const },
    { href: "/generator", icon: "⚡", label: "計算・生成", category: "generator" as const },
    { href: "/finance", icon: "💰", label: "金融", category: "finance" as const },
    { href: "/blog", icon: "📝", label: "ブログ" },
  ];

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-kon text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo-icon.webp" alt="山田ツール" className="w-8 h-8" />
              <span className="font-bold text-xl">山田ツール</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                item.category ? (
                  <div key={item.href} className="relative" onMouseEnter={() => setActiveMenu(item.category || null)}>
                    <Link href={item.href} className="flex items-center gap-1 hover:text-sakura transition-colors">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs">▼</span>
                    </Link>
                    {activeMenu === item.category && (
                      <MegaMenu category={item.category} href={item.href} onClose={() => setActiveMenu(null)} />
                    )}
                  </div>
                ) : (
                  <Link key={item.href} href={item.href} className="flex items-center gap-1 hover:text-sakura transition-colors">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              ))}

              <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" aria-label="検索">
                <span>🔍</span>
                <span className="text-sm">検索</span>
                <kbd className="hidden lg:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded">{isMac ? "⌘K" : "Ctrl+K"}</kbd>
              </button>
              <ThemeToggle />

              {!loading && (
                user ? (
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }} className="flex items-center gap-2 px-3 py-1.5 bg-sakura hover:bg-sakura/80 rounded-lg transition-colors">
                      <span>👤</span>
                      <span className="text-sm max-w-[100px] truncate">{user.email.split('@')[0]}</span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800">
                        <div className="px-4 py-2 border-b text-sm text-gray-500 truncate">{user.email}</div>
                        <div className="px-4 py-2 text-sm">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">{user.plan === 'free' ? 'FREE' : 'PRO'}</span>
                        </div>
                        <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setShowUserMenu(false)}>⭐ PROにアップグレード</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">ログアウト</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login" className="flex items-center gap-2 px-3 py-1.5 bg-sakura hover:bg-sakura/80 rounded-lg transition-colors">
                    <span>👤</span>
                    <span className="text-sm">ログイン</span>
                  </Link>
                )
              )}
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-3 hover:bg-white/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="検索">
                <span className="text-xl">🔍</span>
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="メニュー">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/10">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              {!loading && (
                <div className="border-t border-white/10 mt-2 pt-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-white/70">{user.email}</div>
                      <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors">
                        <span className="text-xl">⭐</span>
                        <span className="font-medium">PROにアップグレード</span>
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors w-full text-left text-red-300">
                        <span className="text-xl">🚪</span>
                        <span className="font-medium">ログアウト</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors">
                      <span className="text-xl">👤</span>
                      <span className="font-medium">ログイン</span>
                    </Link>
                  )}
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-20" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="text-2xl">🔍</span>
                <input type="text" placeholder="ツールを検索... (例: PDF結合, 請求書)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 text-lg text-gray-900 outline-none" autoFocus />
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="検索を閉じる">
                  <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">ESC</kbd>
                </button>
              </div>
              <div className="py-4 text-center text-gray-500 text-sm">
                <p>ホームページの検索バーをご利用ください</p>
                <Link href="/" onClick={() => setIsSearchOpen(false)} className="text-blue-600 hover:underline mt-2 inline-block">ホームへ戻る →</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
