"use client";
import Link from "next/link";

interface UsageLimitBannerProps {
  usage: {
    daily_count: number;
    limit: number;
    remaining: number;
    is_limited: boolean;
  } | null;
}

export default function UsageLimitBanner({ usage }: UsageLimitBannerProps) {
  if (!usage) return <div className="min-h-[52px]" />;

  if (usage.is_limited) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 min-h-[52px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-danger">本日の無料枠を使い切りました</p>
            <p className="text-sm text-danger">明日0時にリセットされます。今すぐ使いたい場合はPROプランへ</p>
          </div>
          <Link href="/pricing" className="bg-sakura hover:bg-sakura/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
            PROで無制限に →
          </Link>
        </div>
      </div>
    );
  }

  if (usage.remaining <= 2) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 min-h-[52px]">
        <div className="flex items-center justify-between">
          <p className="text-kon text-sm">
            <span className="font-bold">残り{usage.remaining}回</span> / 本日{usage.limit}回まで無料
          </p>
          <Link href="/pricing" className="text-kon hover:text-kon text-sm font-medium underline">
            PROで無制限に
          </Link>
        </div>
      </div>
    );
  }

  // UX-001: Only show usage count when close to limit - do not show on initial page load
  if (usage.remaining > 3) return <div className="min-h-[52px]" />;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 min-h-[52px]">
      <p className="text-gray-600 text-sm text-center">
        本日の利用: <span className="font-bold">{usage.daily_count}</span> / {usage.limit}回（無料枠）
      </p>
    </div>
  );
}
