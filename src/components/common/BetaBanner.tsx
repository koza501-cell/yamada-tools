"use client";

import { useState, useEffect } from "react";

export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("betaBannerDismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("betaBannerDismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-kon text-white px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">🚀</span>
          <div className="flex-1">
            <p className="text-sm md:text-base font-medium">
              【ベータ版公開中】現在、サービス改善のため全機能を完全無料で開放しています。不具合の報告やご意見をお待ちしております。
            </p>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 text-2xl leading-none ml-2 flex-shrink-0"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}
