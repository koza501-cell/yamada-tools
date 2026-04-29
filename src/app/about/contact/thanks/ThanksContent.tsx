"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ThanksContent() {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="space-y-6">
      {ref && (
        <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
          <p className="text-xs text-gray-500 mb-1">参照番号</p>
          <p className="font-mono font-bold text-kon text-lg">{ref}</p>
        </div>
      )}
      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          href="/"
          className="bg-kon text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-kon/90 transition-colors"
        >
          ホームに戻る
        </Link>
        <Link
          href="/about/contact"
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:border-kon hover:text-kon transition-colors"
        >
          別の内容を送る
        </Link>
      </div>
    </div>
  );
}
