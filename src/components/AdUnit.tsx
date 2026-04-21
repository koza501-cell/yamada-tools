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

  if (loading || isPro) return null;

  return (
    <div className={`text-center my-4 ${className ?? ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2272972805493752"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      {showUpgradeHint && (
        <p className="text-xs text-gray-400 mt-1">
          <Link href="/pricing" className="hover:underline">
            広告を非表示にする
          </Link>
        </p>
      )}
    </div>
  );
}
