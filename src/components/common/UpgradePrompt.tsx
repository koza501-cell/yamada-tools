'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTotals } from '@/lib/value-tracker';
import type { UsageTotals } from '@/lib/value-tracker';
import { buttonCls } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

const LS_KEY = 'yamada_upgrade_prompt_dismissed_until';
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

type Tier = 'power-user' | 'high-value' | 'engaged';

function getTier(t: UsageTotals): Tier | null {
  if (t.totalMoneySavedYen >= 9800) return 'power-user';
  if (t.totalTimeSavedMinutes >= 120) return 'high-value';
  if (t.totalUsages >= 10) return 'engaged';
  return null;
}

interface TierContent { badge: string; heading: string; body: string }

function getContent(tier: Tier, t: UsageTotals): TierContent {
  const hours = Math.floor(t.totalTimeSavedMinutes / 60);
  switch (tier) {
    case 'power-user': {
      const ratio = Math.min(Math.floor(t.totalMoneySavedYen / 9800), 10);
      return {
        badge: 'パワーユーザー',
        heading: `節約額が年間プラン（¥9,800）の${ratio}倍に達しました`,
        body: 'このまま続ければ、投資以上のリターンが見込めます。PROプランで、すべてのツールを広告なし・無制限に。',
      };
    }
    case 'high-value':
      return {
        badge: 'よく使っています',
        heading: `これまでに${hours}時間以上節約しています`,
        body: '¥980/月のPROプランで、さらに快適に。広告なし・無制限アクセス。',
      };
    case 'engaged':
      return {
        badge: 'ありがとうございます',
        heading: '山田ツールをよくご利用いただいております',
        body: 'PROプランで広告なし・無制限に。月額¥980、いつでもキャンセル可能。',
      };
  }
}

export function UpgradePrompt() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [content, setContent] = useState<TierContent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissedUntil = localStorage.getItem(LS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    const t = getTotals();
    const detected = getTier(t);
    if (detected) {
      setTier(detected);
      setContent(getContent(detected, t));
      trackEvent('upgrade_prompt_shown', { tier: detected });
    }
  }, []);

  if (!tier || !content) return null;

  const dismiss = () => {
    trackEvent('upgrade_prompt_dismissed', { tier });
    localStorage.setItem(LS_KEY, String(Date.now() + DISMISS_MS));
    setTier(null);
  };

  return (
    <section className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-800 rounded-card p-5 relative">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        後で見る
      </button>

      <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide mb-2 pr-16">
        {content.badge}
      </p>
      <p className="text-base font-bold text-kon dark:text-gray-100 mb-1 pr-16">
        {content.heading}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {content.body}
      </p>
      <Link
        href="/pricing"
        className={buttonCls('primary', 'lg')}
        onClick={() => trackEvent('upgrade_prompt_clicked', { tier })}
      >
        PROプランを見る →
      </Link>
    </section>
  );
}
