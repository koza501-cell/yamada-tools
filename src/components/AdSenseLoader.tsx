'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { getAdPolicy } from '@/lib/ad-config';

// TODO: When premium/corporate plan is implemented,
// check user subscription status here
const isPremiumUser = false; // Will come from auth context later

export default function AdSenseLoader() {
  const pathname = usePathname();

  // Only load AdSense in production
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') return null;

  // No ads for premium/paid users
  if (isPremiumUser) return null;

  // No ads on the pricing page (avoid conflict with upgrade messaging)
  if (pathname === '/pricing') return null;

  const policy = getAdPolicy(pathname);

  // 'no-ads' routes: do not load the AdSense script at all
  if (policy === 'no-ads') return null;

  // 'minimal' and 'default' routes: load AdSense script normally.
  // Ad density on 'minimal' pages is controlled via .ad-free-zone CSS rules in globals.css.
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2272972805493752"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
