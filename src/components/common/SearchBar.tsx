"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchTools } from "@/lib/searchUtils";
import { allTools } from "@/config/tools";

const PLACEHOLDERS = [
  "例：全銀フォーマット",
  "例：PDF圧縮",
  "例：残業代計算",
  "例：用途地域",
  "例：請求書作成",
  "例：ハザードマップ",
  "例：給与手取り",
  "例：封筒印刷",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  const availableTools = allTools.filter(tool => tool.available);

  // Rotating placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex(i => (i + 1) % PLACEHOLDERS.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const filtered = searchTools(query, availableTools);
    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      window.location.href = results[0].path;
      handleSelect();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          style={{ transition: "opacity 0.3s ease", opacity: query ? 1 : fade ? 1 : 0.3 }}
          className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sumi dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-kon dark:focus:border-kon focus:outline-none"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              onClick={handleSelect}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <span className="text-3xl">{tool.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-kon dark:text-gray-300">{tool.nameJa}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">→</span>
            </Link>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
          <p className="text-center text-gray-500 dark:text-gray-400">該当するツールが見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
