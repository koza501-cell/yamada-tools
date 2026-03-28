'use client';

interface AdSlotProps {
  format: 'leaderboard' | 'rectangle' | 'mobile-banner';
  className?: string;
}

const AD_SIZES = {
  'leaderboard': { width: 728, height: 90 },
  'rectangle': { width: 300, height: 250 },
  'mobile-banner': { width: 320, height: 100 },
};

export default function AdSlot({ format, className = '' }: AdSlotProps) {
  const { width, height } = AD_SIZES[format];

  return (
    <div
      className={`mx-auto overflow-hidden ${className}`}
      style={{
        minHeight: height,
        maxWidth: width,
        width: '100%',
        contentVisibility: 'auto',
        containIntrinsicSize: `${width}px ${height}px`,
        contain: 'layout size',
      }}
      data-ad-slot={format}
      aria-hidden="true"
    >
      {/* Google AdSense code will be inserted here */}
    </div>
  );
}
