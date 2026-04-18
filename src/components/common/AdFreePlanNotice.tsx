'use client';

/**
 * AdFreePlanNotice — subtle one-line upsell shown after successful tool use.
 *
 * Rules:
 *   - Rendered only when show={true} (tie to tool's success/download state)
 *   - Hidden permanently once dismissed (localStorage key: yt-adfree-notice-dismissed)
 *   - Never shown to already-paid users (isPro guard)
 *   - Never shown on pricing / auth / about pages
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'yt-adfree-notice-dismissed';

interface AdFreePlanNoticeProps {
  /** Tie to the tool's success / download-complete state. */
  show: boolean;
}

export default function AdFreePlanNotice({ show }: AdFreePlanNoticeProps) {
  const pathname = usePathname();
  const { isPro, loading } = useAuth();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  // Read dismissal from localStorage after hydration
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const isExcluded =
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  if (loading || isPro || isExcluded || dismissed || !show) return null;

  return (
    <div className="flex items-center justify-between gap-3 mt-4 px-4 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300">
      <span className="flex items-center gap-1.5 min-w-0">
        <span aria-hidden="true">✨</span>
        <Link
          href="/pricing"
          className="hover:underline underline-offset-2 truncate"
        >
          広告なしで快適にご利用いただけるプランもあります →
        </Link>
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 text-blue-400 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 leading-none p-0.5 rounded"
        aria-label="このお知らせを閉じる"
      >
        ×
      </button>
    </div>
  );
}
