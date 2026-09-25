"use client";

import Link from "next/link";

const DISMISS_KEY = "yamada_payment_announcement_dismissed";

// NOTE on CLS: visibility is controlled purely via CSS (see .hide-payment-banner
// in globals.css) driven by a synchronous pre-hydration script in layout.tsx that
// reads localStorage BEFORE first paint. This component always renders the same
// markup on server and client, so there is no post-mount state change that pops
// the bar in/out and shifts content below it (which the previous
// useState/useEffect-based implementation did).
export default function PaymentAnnouncementBar({ isStaging = false }: { isStaging?: boolean }) {
  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    document.documentElement.classList.add("hide-payment-banner");
  };

  return (
    <div
      id="payment-announcement-bar"
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
