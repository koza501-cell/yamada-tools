'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdSenseLoader() {
  const pathname = usePathname();
  const { isPro } = useAuth();

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro) return;

    if (document.querySelector('script[src*="adsbygoogle"]')) return;

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [isExcluded, isPro, pathname]);

  return null;
}
