"use client";

import { useState, useEffect } from "react";

export default function StagingBanner() {
  const [isStaging, setIsStaging] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setIsStaging(host.includes("staging") || host === "localhost" || host === "127.0.0.1");
  }, []);

  if (!isStaging || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-slate-900 to-kon text-white text-center text-xs py-1 px-4 flex items-center justify-center gap-3 shadow-lg">
      <span className="font-bold tracking-wide">STAGING</span>
      <span className="hidden sm:inline text-white/80">— テスト環境です。本番環境ではありません</span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto text-white/70 hover:text-white text-sm leading-none shrink-0"
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}
