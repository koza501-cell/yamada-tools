"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchTools } from "@/lib/searchUtils";
import { allTools } from "@/config/tools";

interface RecentTool {
  path: string;
  name: string;
  icon: string;
  timestamp: number;
}

export default function GlobalSearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableTools = allTools.filter(t => t.available);

  useEffect(() => {
    if (!open) return;
    try {
      const stored = localStorage.getItem("yamada_recent_tools");
      if (stored) setRecentTools(JSON.parse(stored).slice(0, 5));
    } catch {}
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }
    setResults(searchTools(query, availableTools).slice(0, 5));
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const isRecent = query.trim().length < 2;
  const displayItems: any[] = isRecent
    ? recentTools.map(t => ({ id: t.path, path: t.path, nameJa: t.name, icon: t.icon, description: "" }))
    : results;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, displayItems.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && displayItems[selectedIdx]) {
      window.location.href = displayItems[selectedIdx].path;
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl mr-3">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ツールを検索... (例: はんこ、請求書、PDF圧縮)"
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 text-base placeholder-gray-400"
          />
          <kbd className="hidden sm:block text-xs text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 ml-2">ESC</kbd>
        </div>

        {displayItems.length > 0 && (
          <div>
            <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {isRecent ? "最近使ったツール" : "検索結果"}
            </p>
            {displayItems.map((item, idx) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 ${idx === selectedIdx ? "bg-gray-50 dark:bg-kon/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                onMouseEnter={() => setSelectedIdx(idx)}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.nameJa}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
                  )}
                </div>
                <span className="text-gray-300 text-sm flex-shrink-0">↵</span>
              </Link>
            ))}
          </div>
        )}

        {!isRecent && results.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-400">「{query}」に一致するツールはありません</p>
        )}

        {isRecent && recentTools.length === 0 && (
          <p className="px-4 py-6 text-center text-gray-400 text-sm">ツールを使うと履歴が表示されます</p>
        )}

        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex gap-4 text-xs text-gray-400">
          <span>↑↓ 移動</span>
          <span>↵ 決定</span>
          <span>Ctrl+K で開閉</span>
        </div>
      </div>
    </div>
  );
}
