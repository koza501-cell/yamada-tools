"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ToolFeedbackWidget from "@/components/feedback/ToolFeedbackWidget";

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Back to top on scroll
  useEffect(() => {
    const toggleVisibility = () => setShowBackToTop(window.pageYOffset > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Show nudge after 40s on tool/blog pages
  useEffect(() => {
    setShowNudge(false);
    setIsFeedbackOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const isToolOrBlog = pathname !== "/" && !pathname.startsWith("/admin") && !pathname.startsWith("/pricing");
    if (!isToolOrBlog) return;

    timerRef.current = setTimeout(() => setShowNudge(true), 40000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // derive slug from pathname e.g. /pdf/compress → pdf/compress
  const slug = pathname.replace(/^\//, "") || "home";

  return (
    <>
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="bg-sakura text-kon p-3 rounded-full min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            aria-label="ページトップへ戻る"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
        <div className="relative">
          {showNudge && !isFeedbackOpen && (
            <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 w-48 border border-gray-200 dark:border-gray-700 animate-bounce-once">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">💬 ご意見をお聞かせください！</p>
              <button onClick={() => setShowNudge(false)} className="absolute top-1 right-2 text-gray-400 text-xs">✕</button>
            </div>
          )}
          <button
            onClick={() => { setIsFeedbackOpen(true); setShowNudge(false); }}
            className="bg-kon text-white p-3 rounded-full min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl hover:scale-105 hover:bg-ai transition-all"
            aria-label="フィードバックを送る"
          >
            <span className="text-xl">💬</span>
          </button>
        </div>
      </div>

      {isFeedbackOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setIsFeedbackOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">このページはいかがでしたか？</h2>
              <button onClick={() => setIsFeedbackOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="閉じる">✕</button>
            </div>
            <div className="px-4 pb-6">
              <ToolFeedbackWidget toolSlug={slug} visible={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
