"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/pdf", icon: "📄", label: "PDF" },
    { href: "/document", icon: "📝", label: "書類作成" },
    { href: "/convert", icon: "🔄", label: "変換" },
    { href: "/image", icon: "🖼️", label: "画像" },
    { href: "/generator", icon: "⚡", label: "計算・生成" },
    { href: "/blog", icon: "📝", label: "ブログ" },
  ];

  return (
    <header className="bg-kon text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo-icon.png" 
              alt="山田ツール" 
              className="w-8 h-8"
            />
            <span className="font-bold text-lg">山田ツール</span>
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="メニュー"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
  );
}
