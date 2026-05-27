'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { buttonCls } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface Props { onClose: () => void }

export function AccountMigrationModal({ onClose }: Props) {
  useEffect(() => { trackEvent('account_prompt_shown'); }, []);

  const dismiss = () => {
    trackEvent('account_prompt_declined');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={dismiss}
          aria-label="閉じる"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img src="/mascot/mascot-celebrating.png" alt="" className="w-12 h-12 object-contain flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
              データを守りましょう
            </p>
            <p className="text-base font-bold text-kon dark:text-gray-100 leading-snug mt-0.5">
              記録をアカウントに保存しませんか？
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
          現在の節約記録はこのブラウザのみに保存されています。アカウントを作成すると、どのデバイスからでもアクセスでき、データが永続保存されます。
        </p>

        <Link
          href="/auth/register"
          className={`${buttonCls('primary', 'md')} w-full justify-center mb-3`}
          onClick={() => trackEvent('account_prompt_accepted')}
        >
          無料アカウントを作成
        </Link>
        <button
          onClick={dismiss}
          className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1"
        >
          後で
        </button>
      </div>
    </div>
  );
}
