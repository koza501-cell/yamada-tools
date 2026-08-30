'use client';
import { useEffect, useRef } from 'react';
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

const FORMAT_MIN_HEIGHT: Record<string, string> = {
  horizontal: '100px', // Google full-width-responsive documented example for <=500px viewports is 320x100 (was 90px)
  rectangle: '250px',
  auto: '280px',
  vertical: '600px',
};

export function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const pathname = usePathname();
  const { isPro, loading } = useAuth();
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    if (loading || isExcluded || isPro || pushedRef.current) return;

    const element = adRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !pushedRef.current) {
            const rect = entry.boundingClientRect;
            if (rect.width > 0) {
              pushedRef.current = true;
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (e) {
                console.error('AdSense error:', e);
              }
              observer.disconnect();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [loading, isExcluded, isPro]);

  // isExcluded is synchronous (pathname-based) — safe to skip container entirely
  if (isExcluded) return null;

  const showAd = !loading && !isPro;
  // Reserve space during loading; collapse only after auth confirms isPro
  const minHeight = !loading && isPro ? '0' : (FORMAT_MIN_HEIGHT[format] || '280px');

  return (
    <div
      className={`ad-container my-6 ${className}`}
      style={{
        minHeight,
        width: '100%',
        maxWidth: '728px',
        margin: '1.5rem auto',
        overflow: 'hidden',
      }}
    >
      {showAd && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
          data-ad-client="ca-pub-2272972805493752"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
