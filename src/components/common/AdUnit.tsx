'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window { adsbygoogle: any[]; }
}

const SLOT_MAP = {
  top: '7453582900',
  mid: '6084660910',
  bottom: '3514337896',
} as const;

type AdPosition = keyof typeof SLOT_MAP;

// pathname → Set<slotId>
const renderedSlots = new Map<string, Set<string>>();

interface AdUnitProps {
  position?: AdPosition;
  slot?: string;
  format?: string;
  className?: string;
}

export function AdUnit({ position = 'mid', slot, format = 'auto', className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isPro } = useAuth();
  const slotId = slot || SLOT_MAP[position];

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro) return;
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
    ins.dataset.adFormat = format;
    ins.dataset.fullWidthResponsive = 'true';
    container.appendChild(ins);

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (_) {}

    return () => {
      pageSlots.delete(slotId);
      if (pageSlots.size === 0) renderedSlots.delete(pathname);
      container.innerHTML = '';
      container.style.display = '';
    };
  }, [pathname, slotId, format, isExcluded, isPro]);

  if (isExcluded || isPro) return null;

  return (
    <div
      ref={containerRef}
      className={`ad-container my-4 ${className}`.trim()}
      style={{ minHeight: 0, overflow: 'hidden' }}
    />
  );
}

export default AdUnit;
