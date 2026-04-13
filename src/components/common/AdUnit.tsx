'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const pathname = usePathname();
  const { isPro } = useAuth();

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [isExcluded, isPro]);

  if (isExcluded || isPro) return null;

  return (
    <div className={`ad-container my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2272972805493752"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
