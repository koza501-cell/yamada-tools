"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RecentTool {
  path: string;
  name: string;
  icon: string;
  timestamp: number;
}

const POPULAR_TOOLS: RecentTool[] = [
  { path: "/pdf/compress", name: "PDF圧縮", icon: "📄", timestamp: 0 },
  { path: "/pdf/merge", name: "PDF結合", icon: "📑", timestamp: 0 },
  { path: "/image/compress", name: "画像圧縮", icon: "🖼️", timestamp: 0 },
  { path: "/document/invoice", name: "請求書作成", icon: "📋", timestamp: 0 },
  { path: "/generator/envelope-print", name: "封筒印刷", icon: "✉️", timestamp: 0 },
];

export default function RecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("yamada_recent_tools");
    if (stored) {
      try {
        const tools = JSON.parse(stored) as RecentTool[];
        if (tools.length > 0) {
          setRecentTools(tools.slice(0, 5));
          setHasHistory(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing recent tools:", e);
      }
    }
    // No history - show popular tools
    setRecentTools(POPULAR_TOOLS);
    setHasHistory(false);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-6 bg-gradient-to-r from-sakura/20 to-ai/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{hasHistory ? "🕐" : "⭐"}</span>
          <h2 className="text-base font-bold text-kon">
            {hasHistory ? "最近使ったツール" : "人気ツール"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentTools.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
            >
              <span>{tool.icon}</span>
              <span className="text-sm font-medium text-gray-700">{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function trackToolUsage(path: string, name: string, icon: string) {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem("yamada_recent_tools");
    let tools: RecentTool[] = stored ? JSON.parse(stored) : [];
    tools = tools.filter(t => t.path !== path);
    tools.unshift({ path, name, icon, timestamp: Date.now() });
    tools = tools.slice(0, 10);
    localStorage.setItem("yamada_recent_tools", JSON.stringify(tools));

    const count = parseInt(localStorage.getItem("yamada_tool_count") || "0");
    localStorage.setItem("yamada_tool_count", String(count + 1));
  } catch (e) {
    console.error("Error tracking tool usage:", e);
  }
}
