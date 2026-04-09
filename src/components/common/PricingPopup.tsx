'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface PricingPopupProps {
  type: 'soft-modal' | 'limit-modal' | 'none';
  onClose: () => void;
  remainingUses?: number;
}

export function PricingPopup({ type, onClose, remainingUses = 0 }: PricingPopupProps) {
  if (type === 'none') return null;

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-pink-50 rounded-xl p-4 mb-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-pink-500">✓</span>
              <span>無制限で使い放題</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-500">✓</span>
              <span>広告なしでサクサク</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-500">✓</span>
              <span>ファイルサイズ200MBまで</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-500">✓</span>
              <span>作業履歴の保存</span>
            </li>
          </ul>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-pink-500">¥980</span>
          <span className="text-gray-500">/月</span>
          <p className="text-xs text-gray-400 mt-1">年払いなら¥7,980/年（2ヶ月分お得！）</p>
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
        >
          PROプランを見る
        </Link>

        {/* Secondary action */}
        {!isLimitReached && (
          <button
            onClick={onClose}
            className="block w-full text-center text-gray-400 text-sm mt-3 hover:text-gray-600"
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
