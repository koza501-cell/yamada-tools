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
  if (!usage) return null;

  if (usage.is_limited) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-red-700">本日の無料枠を使い切りました</p>
            <p className="text-sm text-red-600">明日0時にリセットされます。今すぐ使いたい場合はPROプランへ</p>
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
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-amber-700 text-sm">
            <span className="font-bold">残り{usage.remaining}回</span> / 本日{usage.limit}回まで無料
          </p>
          <Link href="/pricing" className="text-amber-700 hover:text-amber-800 text-sm font-medium underline">
            PROで無制限に
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6">
      <p className="text-gray-600 text-sm text-center">
        本日の利用: <span className="font-bold">{usage.daily_count}</span> / {usage.limit}回（無料枠）
      </p>
    </div>
  );
}
