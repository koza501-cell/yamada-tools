"use client";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "すべて", href: "#", icon: "🏠" },
  { id: "finance", label: "金融", href: "#finance-tools", icon: "💰" },
  { id: "pdf", label: "PDF", href: "#pdf-tools", icon: "📄" },
  { id: "document", label: "書類", href: "#document-tools", icon: "📝" },
  { id: "convert", label: "変換", href: "#convert-tools", icon: "🔄" },
  { id: "image", label: "画像", href: "#image-tools", icon: "🖼️" },
  { id: "calculator", label: "計算", href: "#calculator-tools", icon: "🧮" },
];

export default function StickyTabBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const sectionIds = ["finance-tools", "pdf-tools", "document-tools", "convert-tools", "image-tools", "calculator-tools"];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);

      // Skip scroll-spy during click-initiated scrolling
      if (isClickScrolling.current) return;

      // Scroll-spy: detect which section is in viewport
      if (scrollY <= 500) {
        setActiveTab("all");
        return;
      }

      let currentSection = "all";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Section is considered active if its top is within 150px of viewport top
          if (rect.top <= 150 && rect.bottom > 150) {
            currentSection = id.replace("-tools", "");
            break;
          }
        }
      }
      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, href: string) => {
    setActiveTab(id);
    isClickScrolling.current = true;

    if (href === "#") {
      // Scroll to 501 to keep tab bar visible
      window.scrollTo({ top: 501, behavior: "smooth" });
      setTimeout(() => { isClickScrolling.current = false; }, 1000);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offset = 120;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setTimeout(() => { isClickScrolling.current = false; }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id, cat.href)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
