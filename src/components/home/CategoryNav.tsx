"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToolCountByCategory } from "@/config/tools";

interface Category {
  id: string;
  label: string;
  href: string;
  cats: string[];
}

const CATEGORIES: Category[] = [
  { id: "cat-pdf",        label: "PDF",                   href: "/pdf",        cats: ["pdf"] },
  { id: "cat-document",   label: "\u66f8\u985e\u4f5c\u6210",     href: "/document",   cats: ["document"] },
  { id: "cat-image",      label: "\u753b\u50cf\u52a0\u5de5",     href: "/image",      cats: ["image"] },
  { id: "cat-convert",    label: "\u5909\u63db\u30c4\u30fc\u30eb", href: "/convert",  cats: ["convert"] },
  { id: "cat-calculator", label: "\u8a08\u7b97\u30fb\u30b7\u30df\u30e5\u30ec\u30fc\u30bf\u30fc", href: "/finance", cats: ["finance", "tax", "insurance", "health", "debt", "education"] },
  { id: "cat-realestate", label: "\u4e0d\u52d5\u7523",   href: "/realestate", cats: ["realestate"] },
  { id: "cat-finance",    label: "\u91d1\u878d",           href: "/finance",    cats: ["finance"] },
  { id: "cat-career",     label: "\u30ad\u30e3\u30ea\u30a2", href: "/career",  cats: ["career"] },
  { id: "cat-ai",         label: "AI\u6d3b\u7528",        href: "/generator",  cats: ["generator"] },
];

function useActiveSection(): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const els = CATEGORIES.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return activeId;
}

function smoothScroll(id: string, e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CategoryRail() {
  const activeId = useActiveSection();

  return (
    <aside
      className="hidden lg:block w-56 flex-shrink-0 sticky self-start border-r border-gray-100 dark:border-gray-800"
      style={{ top: "80px", maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
    >
      <nav className="py-5 pr-4 pl-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
          {"\u30ab\u30c6\u30b4\u30ea"}
        </p>
        <ul className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const count = getToolCountByCategory(cat.cats);
            const isActive = activeId === cat.id;
            return (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  onClick={(e) => smoothScroll(cat.id, e)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-kon/10 text-kon font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-kon"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`tabular-nums text-xs ml-2 ${
                      isActive ? "text-kon" : "text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 px-3">
          <Link href="/tools" className="text-xs text-ai hover:underline">
            {"\u3059\u3079\u3066\u306e\u30c4\u30fc\u30eb"} &rarr;
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export function CategoryChips() {
  const activeId = useActiveSection();

  return (
    <div className="lg:hidden overflow-x-auto bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="flex gap-2 px-4 py-2 whitespace-nowrap">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            onClick={(e) => smoothScroll(cat.id, e)}
            className={`flex-shrink-0 inline-block px-3 py-1 rounded-full text-sm transition-colors ${
              activeId === cat.id
                ? "bg-kon text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-kon/10 hover:text-kon"
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}
