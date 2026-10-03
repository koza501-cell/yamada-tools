'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdSenseLoader() {
  const pathname = usePathname();
  const { isPro } = useAuth();

  const isProduction = typeof window !== 'undefined' && window.location.hostname === 'yamada-tools.jp';

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    if (!isProduction || isExcluded || isPro) return;

    // Deferred via requestIdleCallback (not on mount): AdSense's own script
    // scans/adjusts the page for auto-ads placement shortly after it loads,
    // which was firing ~1.3s into every page load and causing a large,
    // page-independent CLS hit. Pushing the load to idle time keeps it off
    // the critical rendering path.
    const load = () => {
      if (document.querySelector('script[src*="adsbygoogle"]')) return;
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout: number }) => number);
    if (ric) {
      const id = ric(load, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const timer = setTimeout(load, 2000);
    return () => clearTimeout(timer);
  }, [isExcluded, isPro, pathname]);

  return null;
}
