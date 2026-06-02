"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ_DATA, DISCLAIMER } from "../data";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_DATA.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; よくある質問
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">❓ よくある質問</h1>
          <p className="text-gray-200 mt-2 text-sm">{FAQ_DATA.length}問の Q&A で相続登記の疑問を解消</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(null); }}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ai"
            placeholder="キーワードで絞り込み（例：費用、期限、書類）"
          />
          {search && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {filtered.length}件が見つかりました
            </p>
          )}
        </div>

        {/* FAQ list */}
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const globalIndex = FAQ_DATA.indexOf(item);
            const isOpen = open === globalIndex;
            return (
              <div
                key={globalIndex}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button type="button"
                  onClick={() => setOpen(isOpen ? null : globalIndex)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-ai font-bold text-sm flex-shrink-0 mt-0.5">Q</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm leading-relaxed">{item.q}</span>
                  </div>
                  <span className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0">
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm flex-shrink-0 mt-0.5">A</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm">該当する質問が見つかりませんでした</p>
              <button type="button" onClick={() => setSearch("")} className="text-ai text-sm mt-2 underline">
                すべて表示
              </button>
            </div>
          )}
        </div>

        {/* Tool links */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/souzoku-touki/wizard", icon: "🧭", label: "ケース診断" },
            { href: "/souzoku-touki/checklist", icon: "📋", label: "書類チェックリスト" },
            { href: "/souzoku-touki/tax", icon: "🧮", label: "税額計算" },
            { href: "/souzoku-touki/houmukyoku", icon: "🏛️", label: "法務局検索" },
            { href: "/souzoku-touki/guide", icon: "📖", label: "ガイド記事" },
            { href: "/souzoku-touki", icon: "🏠", label: "トップ" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-xl mb-1">{link.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{link.label}</div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">⚠️ {DISCLAIMER}</p>
      </div>
    </div>
  );
}
