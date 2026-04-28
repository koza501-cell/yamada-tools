"use client";
import { useState, useEffect, type ReactNode } from "react";
import RecentTools from "@/components/common/RecentTools";

interface Props {
  hero: ReactNode;
}

/**
 * Returning users (yamada_recent_tools non-empty) see 最近使ったツール before the hero.
 * First-time visitors see the hero first.
 * A size-matched skeleton is shown during hydration to keep CLS <= 0.05.
 */
export default function HomepageAboveFold({ hero }: Props) {
  const [isReturning, setIsReturning] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("yamada_recent_tools");
      const tools = stored ? (JSON.parse(stored) as unknown[]) : [];
      setIsReturning(Array.isArray(tools) && tools.length > 0);
    } catch {
      setIsReturning(false);
    }
  }, []);

  // Skeleton during hydration -- approximates hero + recent-tools height to avoid CLS
  if (isReturning === null) {
    return (
      <>
        <div className="bg-white" style={{ height: "460px" }} aria-hidden="true" />
        <div
          className="bg-gradient-to-r from-pink-50 to-blue-50"
          style={{ height: "80px" }}
          aria-hidden="true"
        />
      </>
    );
  }

  if (isReturning) {
    return (
      <>
        <RecentTools />
        {hero}
      </>
    );
  }

  return (
    <>
      {hero}
      <RecentTools />
    </>
  );
}
