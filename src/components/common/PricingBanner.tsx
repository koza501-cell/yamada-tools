'use client';

import Link from 'next/link';

interface PricingBannerProps {
  remainingUses: number;
  onClose: () => void;
}

export function PricingBanner({ remainingUses, onClose }: PricingBannerProps) {
  if (remainingUses > 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 to-rose-500 text-white px-4 py-3 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/mascot/mascot-thinking.png" 
            alt="アイちゃん" 
            className="w-10 h-10 object-contain"
          />
          <p className="text-sm sm:text-base">
            <span className="font-bold">あと{remainingUses}回！</span>
            <span className="hidden sm:inline"> PROなら無制限で使えるよ♪</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="bg-white text-sakura px-4 py-1.5 rounded-full text-sm font-bold hover:bg-sakura/30 transition-colors whitespace-nowrap"
          >
            PROを見る
          </Link>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
