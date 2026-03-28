'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdSenseScript() {
  const { isPaidUser } = useAuth();
  const pathname = usePathname();

  if (isPaidUser) return null;
  if (pathname === '/pricing') return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
