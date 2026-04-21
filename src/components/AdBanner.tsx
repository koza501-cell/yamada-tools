'use client';

import AdUnit from '@/components/AdUnit';

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = '5612038947', className }: AdBannerProps) {
  return (
    <AdUnit
      slot={slot}
      format="horizontal"
      responsive={true}
      showUpgradeHint={true}
      className={className}
    />
  );
}
