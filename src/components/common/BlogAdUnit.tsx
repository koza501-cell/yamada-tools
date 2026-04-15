'use client';

import { AdUnit } from './AdUnit';

type AdPosition = 'top' | 'mid' | 'bottom';

interface BlogAdUnitProps {
  position?: AdPosition;
}

export default function BlogAdUnit({ position = 'mid' }: BlogAdUnitProps) {
  return (
    <div className="my-8">
      <AdUnit position={position} />
    </div>
  );
}
