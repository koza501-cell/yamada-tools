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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl font-semibold transition-colors duration-200 shadow-md"
          >
            無料で始める
          </button>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white rounded-xl font-semibold transition-colors duration-200"
          >
            料金プランを見る →
          </Link>
        </div>
      </div>
    </section>
  );
}
