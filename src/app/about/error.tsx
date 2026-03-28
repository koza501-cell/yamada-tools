'use client';

import Link from 'next/link';

export default function AboutError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-2xl font-bold text-kon dark:text-blue-400 mb-4">ページの表示中にエラーが発生しました</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          申し訳ございません。ページの読み込み中に問題が発生しました。もう一度お試しいただくか、ホームページへお戻りください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-kon text-kon dark:text-blue-400 dark:border-blue-400 rounded-xl font-bold hover:bg-kon/5 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
