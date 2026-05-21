'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface PricingPopupProps {
  type: 'soft-modal' | 'limit-modal' | 'none';
  onClose: () => void;
  remainingUses?: number;
}

export function PricingPopup({ type, onClose, remainingUses = 0 }: PricingPopupProps) {
  // useEffect must be before early return (Rules of Hooks)
  useEffect(() => {
    if (type === 'none') return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, type]);

  if (type === 'none') return null;

  const isLimitReached = type === 'limit-modal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        {!isLimitReached && (
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Mascot */}
        <div className="flex justify-center mb-4">
          <img 
            src={isLimitReached ? "/mascot/mascot-teaching.png" : "/mascot/mascot-celebrating.png"}
            alt="アイちゃん"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Content */}
        {isLimitReached ? (
          <>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              今日の無料枠を使い切りました
            </h2>
            <p className="text-center text-gray-600 mb-4">
              また明日使えるよ！でも今すぐ続けたいなら...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              たくさん使ってくれてありがとう！✨
            </h2>
            <p className="text-center text-gray-600 mb-4">
              PROプランならもっと便利に使えるよ♪
            </p>
          </>
        )}

        {/* Benefits */}
        <div className="bg-sakura/30 rounded-xl p-4 mb-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-sakura">✓</span>
              <span>無制限で使い放題</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sakura">✓</span>
              <span>広告なしでサクサク</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sakura">✓</span>
              <span>ファイルサイズ200MBまで</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sakura">✓</span>
              <span>作業履歴の保存</span>
            </li>
          </ul>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-[#1E3A8A]">¥980</span>
          <span className="text-gray-500">/月</span>
          <p className="text-xs text-gray-400 mt-1">年払いなら¥9,800/年（17%お得！）</p>
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          onClick={onClose}
          className="block w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-center py-3 rounded-xl font-semibold px-6 transition-all shadow-lg hover:shadow-xl"
        >
          PROプランを見る
        </Link>

        {/* Secondary action */}
        {!isLimitReached && (
          <button
            onClick={onClose}
            className="block w-full text-center text-gray-600 text-base mt-3 underline hover:text-gray-800 hover:underline py-2 px-4"
          >
            あとで見る
          </button>
        )}

        {/* Trial badge */}
        <p className="text-center text-xs text-gray-400 mt-4">
          🎁 10日間無料トライアル・クレジットカード不要
        </p>
      </div>
    </div>
  );
}
