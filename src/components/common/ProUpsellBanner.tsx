'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ProUpsellBannerProps {
  remaining?: number | null;
  limit?: number | null;
}

export default function ProUpsellBanner({ remaining, limit }: ProUpsellBannerProps) {
  const { isPro, loading } = useAuth();
  if (loading || isPro) return null;

  const showUsage = typeof remaining === 'number' && typeof limit === 'number';

  return (
    <div className="my-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="text-sm text-blue-800 dark:text-blue-200">
        {showUsage ? (
          <>
            <span className="font-semibold">無料プラン：本日あと{remaining}回</span>
            <span className="text-blue-600 dark:text-blue-400 ml-2">/ 最大10MB</span>
            <span className="ml-2">｜ PROなら無制限・200MB対応・広告なし</span>
          </>
        ) : (
          <>
            <span className="font-semibold">無料プラン：1日5回まで</span>
            <span className="text-blue-600 dark:text-blue-400 ml-2">/ 最大10MB</span>
            <span className="ml-2">｜ PROなら無制限・200MB対応・広告なし</span>
          </>
        )}
      </div>
      <Link
        href="/pricing"
        className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        PROプランを見る →
      </Link>
    </div>
  );
}
