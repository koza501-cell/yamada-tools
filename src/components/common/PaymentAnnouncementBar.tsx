"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DISMISS_KEY = "yamada_payment_announcement_dismissed";

export default function PaymentAnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [isStaging, setIsStaging] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) setDismissed(false);
    const host = window.location.hostname;
    setIsStaging(host.includes("staging") || host === "localhost" || host === "127.0.0.1");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className={`relative bg-kon text-white text-xs sm:text-sm py-2 px-4 ${isStaging ? "mt-6" : ""}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 pr-6">
        <span className="text-center">
          新しいお支払い方法が使えるようになりました。コンビニ払いにも対応
        </span>
        <Link
          href="/pricing"
          className="shrink-0 underline underline-offset-2 font-semibold hover:text-white/80 transition-colors"
        >
          詳しく見る
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-base leading-none"
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}
