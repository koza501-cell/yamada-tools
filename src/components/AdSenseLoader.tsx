'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdSenseLoader() {
  const pathname = usePathname();
  const { isPro } = useAuth();
  const configPushed = useRef(false);

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro) return;

    // Only load on production hostname
    if (window.location.hostname !== 'yamada-tools.jp') return;

    // Push page-level Auto Ads config exactly once per session.
    // overlays:{bottom:true} → allow ONE bottom anchor; suppresses Shopping Anchor.
    // Related Search (inline keyword ads) is DISABLED at the AdSense dashboard level.
    // Vignette ads are DISABLED at the AdSense dashboard level.
    // Side rail ads remain ENABLED (non-intrusive, acceptable per JP market standards).
    if (!configPushed.current) {
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({
        google_ad_client: 'ca-pub-2272972805493752',
        enable_page_level_ads: true,
        overlays: { bottom: true },
      });
      configPushed.current = true;
    }

    if (document.querySelector('script[src*=adsbygoogle]')) return;

    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [isExcluded, isPro]);

  return null;
}
