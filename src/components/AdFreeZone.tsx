'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdFreeZone({ children }: { children: React.ReactNode }) {
  const { isPro } = useAuth();

  if (isPro) {
    return <div className="ad-free-zone">{children}</div>;
  }

  return <>{children}</>;
}
