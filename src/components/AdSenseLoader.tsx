'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { getAdPolicy } from '@/lib/ad-config';

// TODO: When pro plan is fully wired, check isPro from AuthContext here
const isPremiumUser = false;

export default function AdSenseLoader() {
  const pathname = usePathname();

  if (isPremiumUser) return null;
  if (pathname === '/pricing') return null;

  const policy = getAdPolicy(pathname);
  if (policy === 'no-ads') return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
