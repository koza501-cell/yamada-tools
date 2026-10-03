"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function ToolCtaCard({
  href,
  toolName,
  blurb,
  slug,
}: {
  href: string;
  toolName: string;
  blurb: string;
  slug: string;
}) {
  const handleClick = () => {
    trackEvent("cta_click", {
      location: "above_fold",
      blog_slug: slug,
      tool_link: href,
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="not-prose mb-8 flex items-center gap-4 rounded-xl border border-kon/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-5 transition-shadow hover:shadow-md"
    >
      <span className="flex-shrink-0 text-3xl" aria-hidden="true">
        🛠️
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
          この記事の内容は「{toolName}」で今すぐ試せます
        </p>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-snug">
          {blurb}
        </p>
      </div>
      <svg className="w-5 h-5 flex-shrink-0 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Link>
  );
}
