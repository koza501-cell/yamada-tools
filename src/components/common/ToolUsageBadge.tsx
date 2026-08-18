"use client";
import { useState, useEffect } from "react";

const API_BASE = "/api-backend";

interface Props {
  toolId: string;
  className?: string;
}

export default function ToolUsageBadge({ toolId, className }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/usage/public/tool-counts`)
      .then((r) => r.json())
      .then((data) => {
        if (data[toolId]) setCount(data[toolId]);
      })
      .catch(() => {});
  }, [toolId]);

  if (!count || count < 10) return null;

  const formatted = count >= 1000
    ? `${(count / 1000).toFixed(1)}k`
    : count.toString();

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ${className ?? ""}`}>
      <span>👥</span>
      <span>今月 <strong>{formatted}回</strong> 利用されました</span>
    </span>
  );
}
