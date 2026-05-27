'use client';

import { computeTimeSavedMinutes, computeMoneyYen } from '@/config/tool-value-table';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'yamada-tools:usage:v1';
const MAX_EVENTS = 1000;
const MAX_CREDIT_MINUTES = 60; // hard cap: no single use credits more than 60 min

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.yamada-tools.jp';

export type UsageEvent = {
  slug: string;
  timestamp: number;
  timeMinutesSaved: number;
  moneyYenSaved: number;
};

export type UsageTotals = {
  totalUsages: number;
  totalTimeSavedMinutes: number;
  totalMoneySavedYen: number;
  toolsUsedCount: number;
  firstUsedAt: number | null;
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function getAllUsage(): UsageEvent[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UsageEvent[];
  } catch {
    return [];
  }
}

function saveUsage(events: UsageEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage unavailable (private mode, storage quota) — continue silently
  }
}

// ─── Remote stub ─────────────────────────────────────────────────────────────

function trackRemote(event: UsageEvent): void {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('session_token');
  if (!token) return; // not logged in — localStorage-only

  // TODO: implement POST /api/usage/track on backend
  fetch(`${API_BASE}/api/usage/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  }).catch(() => {
    // Swallow silently — endpoint may not exist yet
  });
}

// ─── Core tracking ───────────────────────────────────────────────────────────

export function trackToolUse(slug: string): UsageEvent {
  const rawMinutes = computeTimeSavedMinutes(slug);
  const timeMinutesSaved = Math.min(rawMinutes, MAX_CREDIT_MINUTES); // hard cap
  const moneyYenSaved = computeMoneyYen(slug);

  const event: UsageEvent = {
    slug,
    timestamp: Date.now(),
    timeMinutesSaved,
    moneyYenSaved,
  };

  const existing = getAllUsage();
  const appended = [...existing, event];
  // Drop oldest events when exceeding cap
  const capped = appended.length > MAX_EVENTS
    ? appended.slice(appended.length - MAX_EVENTS)
    : appended;
  saveUsage(capped);

  // GA event — fire-and-forget
  trackEvent('tool_completed', { tool_slug: slug });

  // Backend sync for logged-in users — fire-and-forget, never blocks UI
  trackRemote(event);

  return event;
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

export function getTotals(): UsageTotals {
  const events = getAllUsage();
  if (events.length === 0) {
    return { totalUsages: 0, totalTimeSavedMinutes: 0, totalMoneySavedYen: 0, toolsUsedCount: 0, firstUsedAt: null };
  }
  return {
    totalUsages: events.length,
    totalTimeSavedMinutes: events.reduce((s, e) => s + e.timeMinutesSaved, 0),
    totalMoneySavedYen: events.reduce((s, e) => s + e.moneyYenSaved, 0),
    toolsUsedCount: new Set(events.map(e => e.slug)).size,
    firstUsedAt: events[0].timestamp,
  };
}

export function getTotalsThisMonth(): UsageTotals {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const events = getAllUsage().filter(e => e.timestamp >= startOfMonth);
  if (events.length === 0) {
    return { totalUsages: 0, totalTimeSavedMinutes: 0, totalMoneySavedYen: 0, toolsUsedCount: 0, firstUsedAt: null };
  }
  return {
    totalUsages: events.length,
    totalTimeSavedMinutes: events.reduce((s, e) => s + e.timeMinutesSaved, 0),
    totalMoneySavedYen: events.reduce((s, e) => s + e.moneyYenSaved, 0),
    toolsUsedCount: new Set(events.map(e => e.slug)).size,
    firstUsedAt: events[0].timestamp,
  };
}

// Last N months of time saved — for bar chart
export function getMonthlyBreakdown(months = 6): { label: string; minutes: number }[] {
  const events = getAllUsage();
  const now = new Date();
  const result: { label: string; minutes: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.getTime();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    const monthEvents = events.filter(e => e.timestamp >= start && e.timestamp < end);
    result.push({
      label: `${d.getMonth() + 1}月`,
      minutes: monthEvents.reduce((s, e) => s + e.timeMinutesSaved, 0),
    });
  }
  return result;
}

export function getMostUsedTools(limit = 5): { slug: string; count: number; totalMinutes: number }[] {
  const events = getAllUsage();
  const bySlug = new Map<string, { count: number; totalMinutes: number }>();

  for (const e of events) {
    const cur = bySlug.get(e.slug) ?? { count: 0, totalMinutes: 0 };
    bySlug.set(e.slug, { count: cur.count + 1, totalMinutes: cur.totalMinutes + e.timeMinutesSaved });
  }

  return Array.from(bySlug.entries())
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function clearAllUsage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
