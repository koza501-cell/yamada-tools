'use client';

// TODO: Replace empty slot with actual AdSense ad unit slot ID
// Place this component after the tool result section, before FAQ/about sections on tool pages

import AdUnit from '@/components/AdUnit';

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = '', className }: AdBannerProps) {
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
