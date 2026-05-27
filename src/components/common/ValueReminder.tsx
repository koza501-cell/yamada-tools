'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTotals } from '@/lib/value-tracker';
import type { UsageTotals } from '@/lib/value-tracker';

const SS_KEY = 'yamada_value_reminder_dismissed';

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

export function ValueReminderInline() {
  const [totals, setTotals] = useState<UsageTotals | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SS_KEY)) return;
    const t = getTotals();
    if (t.totalUsages >= 2) setTotals(t);
  }, []);

  if (!totals) return null;

  const dismiss = () => {
    sessionStorage.setItem(SS_KEY, '1');
    setTotals(null);
  };

  return (
    <div className="mt-6 max-w-sm mx-auto bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-100 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      <button
        onClick={dismiss}
        aria-label="閉じる"
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/60 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-2 mb-4 pr-4">
        <img src="/mascot/mascot-celebrating.png" alt="" className="w-9 h-9 object-contain flex-shrink-0" />
        <p className="text-sm font-bold text-gray-700 leading-tight">累計でこれだけ節約できました！</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">節約時間</p>
          <p className="text-base font-bold text-blue-600">{formatTime(totals.totalTimeSavedMinutes)}</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">節約金額</p>
          <p className="text-base font-bold text-emerald-600">¥{totals.totalMoneySavedYen.toLocaleString()}</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">使用回数</p>
          <p className="text-base font-bold text-gray-700">{totals.totalUsages}回</p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="block text-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        ダッシュボードで詳しく見る →
      </Link>
    </div>
  );
}
