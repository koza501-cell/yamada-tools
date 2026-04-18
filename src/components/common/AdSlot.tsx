'use client';

/**
 * AdSlot — approved manual ad positions for yamada-tools.jp tool pages.
 *
 * Positions:
 *   mid-content   Responsive display between tool zone and related-tools section.
 *   in-feed       Fluid native between content sections (data-ad-layout="in-article").
 *   post-download Conditional: pass show={true} after successful tool execution.
 *   mobile-anchor Fixed bottom, mobile only (<768 px), user-dismissible via sessionStorage.
 *
 * Slot ID mapping (update if you create dedicated units in AdSense dashboard):
 *   mid-content   6084660910  (existing mid slot)
 *   in-feed       5612038947  (static slot repurposed as in-article fluid)
 *   post-download 7453582900  (existing top slot)
 *   mobile-anchor 3514337896  (existing bottom slot)
 *
 * CLS safeguard: each wrapper reserves min-height so layout does not shift
 * when the ad fills in. Unfilled slots collapse via globals.css rules.
 *
 * Auto Ads interaction:
 *   The mobile-anchor suppresses the Auto Ads bottom overlay while it is
 *   visible, preventing double-stacking. When the user dismisses this unit
 *   the suppression is lifted and Auto Ads may show its own anchor.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window { adsbygoogle: any[]; }
}

const SLOT_IDS = {
  'mid-content':    '6084660910',
  'in-feed':        '5612038947',
  'post-download':  '7453582900',
  'mobile-anchor':  '3514337896',
} as const;

type AdPosition = keyof typeof SLOT_IDS;

// CLS-safe minimum heights per position
const MIN_HEIGHTS: Record<AdPosition, number> = {
  'mid-content':    90,
  'in-feed':        250,
  'post-download':  90,
  'mobile-anchor':  60,
};

// Module-level dedupe: pathname -> Set<slotId>
const renderedSlots = new Map<string, Set<string>>();

// Suppress-anchor style element id
const SUPPRESS_ID = 'yt-suppress-auto-anchor';

interface AdSlotProps {
  position: AdPosition;
  /**
   * For post-download: pass the tool's download-success boolean here.
   * Defaults to true for all other positions so they render immediately.
   */
  show?: boolean;
  className?: string;
}

export default function AdSlot({ position, show = true, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isPro } = useAuth();
  const slotId = SLOT_IDS[position];

  // mobile-anchor dismiss state (persisted per session)
  const [anchorDismissed, setAnchorDismissed] = useState(false);
  useEffect(() => {
    if (position !== 'mobile-anchor') return;
    setAnchorDismissed(sessionStorage.getItem('yt-anchor-dismissed') === '1');
  }, [position]);

  // mobile-anchor: suppress Auto Ads overlay while our unit is visible
  useEffect(() => {
    if (position !== 'mobile-anchor') return;
    if (anchorDismissed) {
      document.getElementById(SUPPRESS_ID)?.remove();
      return;
    }
    if (!document.getElementById(SUPPRESS_ID)) {
      const style = document.createElement('style');
      style.id = SUPPRESS_ID;
      // Target only the Auto Ads bottom anchor iframe wrapper
      style.textContent =
        '.google-auto-placed[style*="bottom"],' +
        '.google-auto-placed[style*="position: fixed"],' +
        '.google-auto-placed[style*="position:fixed"] { display: none !important; }';
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById(SUPPRESS_ID)?.remove();
    };
  }, [position, anchorDismissed]);

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro || !show) return;
    if (position === 'mobile-anchor' && anchorDismissed) return;

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    if (!renderedSlots.has(pathname)) renderedSlots.set(pathname, new Set());
    const pageSlots = renderedSlots.get(pathname)!;

    if (pageSlots.has(slotId)) {
      container.style.display = 'none';
      return;
    }
    pageSlots.add(slotId);

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = 'ca-pub-2272972805493752';
    ins.dataset.adSlot = slotId;

    if (position === 'in-feed') {
      // Fluid native format - blends with surrounding content cards
      ins.dataset.adFormat = 'fluid';
      ins.dataset.adLayout = 'in-article';
    } else {
      ins.dataset.adFormat = 'auto';
      ins.dataset.fullWidthResponsive = 'true';
    }

    container.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}

    return () => {
      pageSlots.delete(slotId);
      if (pageSlots.size === 0) renderedSlots.delete(pathname);
      container.innerHTML = '';
      container.style.display = '';
    };
  }, [pathname, slotId, position, isExcluded, isPro, show, anchorDismissed]);

  if (isExcluded || isPro || !show) return null;
  if (position === 'mobile-anchor' && anchorDismissed) return null;

  // -- mobile-anchor: fixed bottom strip, mobile only -----------------------
  if (position === 'mobile-anchor') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        role="complementary"
        aria-label="広告"
      >
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem('yt-anchor-dismissed', '1');
            setAnchorDismissed(true);
          }}
          className="absolute -top-5 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-700 text-xs leading-none"
          aria-label="広告を閉じる"
        >
          ✕
        </button>
        <div
          ref={containerRef}
          className="ad-container"
          style={{ minHeight: MIN_HEIGHTS['mobile-anchor'], overflow: 'hidden' }}
        />
      </div>
    );
  }

  // -- all other positions --------------------------------------------------
  return (
    <div className={`ad-container my-6 ${className}`.trim()}>
      <div
        ref={containerRef}
        style={{ minHeight: MIN_HEIGHTS[position], overflow: 'hidden' }}
      />
    </div>
  );
}
