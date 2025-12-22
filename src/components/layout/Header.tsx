"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { href: "/pdf", icon: "📄", label: "PDF" },
    { href: "/document", icon: "📝", label: "書類作成" },
    { href: "/convert", icon: "🔄", label: "変換" },
    { href: "/image", icon: "🖼️", label: "画像" },
    { href: "/generator", icon: "⚡", label: "計算・生成" },
    { href: "/blog", icon: "📝", label: "ブログ" },
  ];

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-kon text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Image */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo-icon.webp"
                alt="山田ツール"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl">山田ツール</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 hover:text-sakura transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="検索"
              >
                <span>🔍</span>
                <span className="text-sm">検索</span>
                <kbd className="hidden lg:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>
            </nav>

            {/* Mobile: Search + Menu */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg"
                aria-label="検索"
              >
                <span className="text-xl">🔍</span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
                aria-label="メニュー"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-20" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="text-2xl">🔍</span>
                <input
                  type="text"
                  placeholder="ツールを検索... (例: PDF結合, 請求書)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg text-gray-900 outline-none"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600" aria-label="検索を閉じる">
                  <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">ESC</kbd>
                </button>
              </div>
              <div className="py-4 text-center text-gray-500 text-sm">
                <p>ホームページの検索バーをご利用ください</p>
                <Link 
                  href="/" 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  ホームへ戻る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
