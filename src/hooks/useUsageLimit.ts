"use client";
import { useState, useEffect } from "react";

const API_URL = "https://api.yamada-tools.jp/api/usage";

interface UsageData {
  daily_count: number;
  limit: number;
  remaining: number;
  is_limited: boolean;
}

export function useUsageLimit(toolId: string) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUsage();
  }, [toolId]);

  const checkUsage = async () => {
    try {
      const res = await fetch(API_URL + "/check/" + toolId);
      const data = await res.json();
      setUsage(data);
    } catch (err) {
      console.error("Failed to check usage:", err);
    } finally {
      setLoading(false);
    }
  };

  const recordUsage = async (): Promise<boolean> => {
    try {
      const res = await fetch(API_URL + "/record/" + toolId, { method: "POST" });
      if (res.status === 429) {
        setUsage({ daily_count: usage?.limit || 5, limit: usage?.limit || 5, remaining: 0, is_limited: true });
        return false;
      }
      const data = await res.json();
      setUsage(data);
      return true;
    } catch (err) {
      console.error("Failed to record usage:", err);
      return true;
    }
  };

  return { usage, loading, recordUsage, checkUsage };
}
