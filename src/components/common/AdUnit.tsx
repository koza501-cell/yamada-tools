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

export function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const pathname = usePathname();
  const { isPro } = useAuth();
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  const isExcluded =
    pathname === '/' ||
    pathname === '/pricing' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isExcluded || isPro || pushedRef.current) return;

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
  }, [isExcluded, isPro]);

  if (isExcluded || isPro) return null;

  return (
    <div
      className={`ad-container my-6 ${className}`}
      style={{
        aspectRatio: '728 / 280',
        width: '100%',
        maxWidth: '728px',
        margin: '1.5rem auto',
        contain: 'layout style size',
      }}
    >
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
    </div>
  );
}
