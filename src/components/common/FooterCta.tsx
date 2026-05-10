"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FooterCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const plan = localStorage.getItem("yamada_user_plan");
    if (!plan || plan === "free") setShow(true);
  }, []);

  if (!show) return null;

  return (
    <section className="py-12 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-t border-gray-200 dark:border-gray-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 もっと便利に使いたい？
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          PROプランで無制限に利用、広告なし、優先サポート
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-kon transition-colors shadow-md"
          >
            料金プランを見る →
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-kon dark:text-kon rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-kon/30 transition-colors"
          >
            無料で始める
          </button>
        </div>
      </div>
    </section>
  );
}
