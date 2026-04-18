'use client';

/**
 * AdSlot — approved manual ad positions for yamada-tools.jp tool pages.
 *
 * Positions:
 *   mid-content   Responsive display between tool zone and related-tools section.
 *   in-feed       Fluid native between content sections (data-ad-layout="in-article").
 *   post-download Conditional: pass show={true} after successful tool execution.
 *
 * The mobile bottom anchor is handled entirely by Auto Ads
 * (dashboard: Anchor ON, single layer) + AdSenseLoader overlays:{bottom:true}.
 * No manual anchor slot is needed here.
 *
 * Slot ID mapping (update if you create dedicated units in AdSense dashboard):
 *   mid-content   6084660910  (existing mid slot)
 *   in-feed       5612038947  (static slot repurposed as in-article fluid)
 *   post-download 7453582900  (existing top slot)
 *
 * CLS safeguard: each wrapper reserves min-height so layout does not shift
 * when the ad fills in. Unfilled slots collapse via globals.css rules.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window { adsbygoogle: any[]; }
}

const SLOT_IDS = {
  'mid-content':    '6084660910',
  'in-feed':        '5612038947',
  'post-download':  '7453582900',
} as const;

type AdPosition = keyof typeof SLOT_IDS;

// CLS-safe minimum heights per position
const MIN_HEIGHTS: Record<AdPosition, number> = {
  'mid-content':    90,
  'in-feed':        250,
  'post-download':  90,
};

// Module-level dedupe: pathname -> Set<slotId>
const renderedSlots = new Map<string, Set<string>>();

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

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro || !show) return;

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
  }, [pathname, slotId, position, isExcluded, isPro, show]);

  if (isExcluded || isPro || !show) return null;

  return (
    <div className={`ad-container my-6 ${className}`.trim()}>
      <div
        ref={containerRef}
        style={{ minHeight: MIN_HEIGHTS[position], overflow: 'hidden' }}
      />
    </div>
  );
}
