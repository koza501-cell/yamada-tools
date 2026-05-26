"use client";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all",        label: "すべて", href: "#top",          icon: "🏠", ariaLabel: "すべてのツール", tabId: null },
  { id: "popular",    label: "人気",   href: "#popular-tools", icon: "",   ariaLabel: "人気ツール",     tabId: null },
  { id: "pdf",        label: "PDF",    href: "#tools-tabs",    icon: "📄", ariaLabel: "PDFツール",      tabId: "pdf" },
  { id: "document",   label: "書類",   href: "#tools-tabs",    icon: "📝", ariaLabel: "書類作成ツール", tabId: "document" },
  { id: "convert",    label: "変換",   href: "#tools-tabs",    icon: "🔄", ariaLabel: "変換ツール",     tabId: "convert" },
  { id: "image",      label: "画像",   href: "#tools-tabs",    icon: "🖼️", ariaLabel: "画像ツール",     tabId: "image" },
  { id: "calculator", label: "計算",   href: "#tools-tabs",    icon: "⚡", ariaLabel: "計算・生成ツール", tabId: "calculator" },
  { id: "finance",    label: "金融",   href: "#finance-tools", icon: "💰", ariaLabel: "金融ツール",     tabId: null },
];

export default function StickyTabBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);

      if (isClickScrolling.current) return;

      if (scrollY <= 400) {
        setActiveTab("all");
        return;
      }

      const sections = [
        { id: "popular-tools", tab: "popular" },
        { id: "finance-tools", tab: "finance" },
        { id: "tools-tabs", tab: "pdf" },
      ];

      let currentSection = "all";
      for (const { id, tab } of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            currentSection = tab;
            break;
          }
        }
      }
      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, href: string, tabId: string | null) => {
    setActiveTab(id);
    isClickScrolling.current = true;

    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => { isClickScrolling.current = false; }, 1000);
      return;
    }

    const element = document.querySelector(href);
    if (!element) {
      isClickScrolling.current = false;
      return;
    }

    const offset = 120;

    const scrollToTarget = () => {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToTarget();

    if (tabId) {
      setTimeout(() => {
        const tabButton = document.querySelector(`[aria-controls="tabpanel-${tabId}"]`) as HTMLButtonElement;
        if (tabButton) tabButton.click();
      }, 300);
    }

    const checkAndCorrect = () => {
      const rect = element.getBoundingClientRect();
      if (Math.abs(rect.top - offset) > 50) scrollToTarget();
    };

    setTimeout(checkAndCorrect, 600);
    setTimeout(checkAndCorrect, 1000);
    setTimeout(() => { isClickScrolling.current = false; }, 1500);
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed top-14 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600 shadow-md" aria-label="カテゴリナビゲーション">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="ツールカテゴリ">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id, cat.href, cat.tabId)}
              role="tab"
              aria-selected={activeTab === cat.id}
              aria-label={cat.ariaLabel}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? "bg-kon text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
