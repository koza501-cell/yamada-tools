'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
  showUpgradeHint?: boolean;
}

const FORMAT_MIN_HEIGHT: Record<string, string> = {
  auto: '280px',
  rectangle: '250px',
  horizontal: '90px',
  vertical: '600px',
};

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className,
  showUpgradeHint = false,
}: AdUnitProps) {
  const { isPro, loading } = useAuth();

  useEffect(() => {
    if (loading || isPro) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, [loading, isPro]);

  const showAd = !loading && !isPro;
  // Reserve space during loading; collapse only after auth confirms isPro
  const minHeight = !loading && isPro ? '0' : (FORMAT_MIN_HEIGHT[format] || '280px');

  return (
    <div
      className={`text-center my-4 ${className ?? ''}`}
      style={{ minHeight, overflow: 'hidden' }}
    >
      {showAd && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2272972805493752"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      )}
      {showUpgradeHint && showAd && (
        <p className="text-xs text-gray-400 mt-1">
          <Link href="/pricing" className="hover:underline">
            広告を非表示にする
          </Link>
        </p>
      )}
    </div>
  );
}
