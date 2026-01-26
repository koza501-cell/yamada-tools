'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PartnerBanner() {
  return (
    <div className="fixed right-4 bottom-56 z-30 hidden xl:block">
      <Link
        href="https://furima-navi.jp"
        target="_blank"
        rel="noopener"
        className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white border border-gray-200"
      >
        <Image
          src="/banner-furima-navi.png"
          alt="furima-navi.jp - フリマアプリ無料ツール13選"
          width={160}
          height={350}
          className="w-auto h-auto max-h-[280px]"
        />
      </Link>
      <button
        onClick={(e) => {
          e.currentTarget.parentElement?.remove();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 flex items-center justify-center"
        aria-label="閉じる"
      >
        ✕
      </button>
    </div>
  );
}
