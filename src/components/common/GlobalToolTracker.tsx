"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { allTools } from "@/config/tools";
import { trackToolUsage } from "@/components/common/RecentTools";

/**
 * Global tool visit tracker.
 *
 * Watches pathname changes and automatically records a "recent tool" visit
 * if the current pathname matches any tool's path in tools.ts.
 *
 * This means EVERY tool gets tracked, regardless of whether it uses the
 * shared ToolPage component or a custom client.tsx.
 *
 * Renders nothing visible.
 */
export default function GlobalToolTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Find a tool whose path matches the current pathname exactly
    const matchedTool = allTools.find((t) => t.path === pathname);

    if (matchedTool && matchedTool.available) {
      trackToolUsage(matchedTool.path, matchedTool.nameJa, matchedTool.icon);
    }
  }, [pathname]);

  return null;
}
