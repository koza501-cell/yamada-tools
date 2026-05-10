"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
interface RecentTool {
  path: string;
  name: string;
  icon: string;
  timestamp: number;
}
export default function RecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("yamada_recent_tools");
    if (stored) {
      try {
        const tools = JSON.parse(stored) as RecentTool[];
        if (tools.length > 0) {
          setRecentTools(tools.slice(0, 5));
        }
      } catch (e) {
        console.error("Error parsing recent tools:", e);
      }
    }
  }, []);
  if (!mounted) return null;
  if (recentTools.length === 0) return null;
  return (
    <section className="py-6 bg-gradient-to-r from-sakura/20 to-ai/10 dark:from-sakura/10 dark:to-ai/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🕐</span>
          <h2 className="text-base font-bold text-kon dark:text-gray-300">
            最近使ったツール
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentTools.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <span>{tool.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tool.name}</span>
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
