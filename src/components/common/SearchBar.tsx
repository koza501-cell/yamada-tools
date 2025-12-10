"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools } from "@/config/tools";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Combine all tools
  const allTools = [
    ...pdfTools,
    ...documentTools,
    ...convertTools,
    ...imageTools,
    ...generatorTools,
  ].filter(tool => tool.available); // Only show available tools

  // Search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = allTools.filter(tool => 
      tool.nameJa.toLowerCase().includes(searchQuery) ||
      tool.nameEn.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery)
    );

    setResults(filtered.slice(0, 8)); // Show max 8 results
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="何をしたいですか？ (⌘K)"
          className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-kon focus:outline-none text-sumi"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
          🔍
        </span>
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              onClick={handleSelect}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <span className="text-3xl">{tool.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-kon">{tool.nameJa}</p>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
          <p className="text-center text-gray-500">
            該当するツールが見つかりませんでした
          </p>
        </div>
      )}
    </div>
  );
}
