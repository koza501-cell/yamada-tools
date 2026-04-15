'use client';

import AdUnit from '@/components/AdUnit';

type AdPosition = 'top' | 'mid' | 'bottom';

interface AdBannerProps {
  position?: AdPosition;
  className?: string;
}

export default function AdBanner({ position = 'mid', className }: AdBannerProps) {
  return (
    <AdUnit
      position={position}
      format="auto"
      responsive={true}
      showUpgradeHint={true}
      className={className}
    />
  );
}
