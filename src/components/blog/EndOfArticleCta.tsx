"use client";

import { trackEvent } from "@/lib/analytics";

export default function EndOfArticleCta({
  href,
  slug,
}: {
  href: string;
  slug: string;
}) {
  const handleClick = () => {
    trackEvent("cta_click", {
      location: "end_of_article",
      blog_slug: slug,
      tool_link: href,
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="inline-flex items-center px-8 py-4 bg-kon text-white rounded-lg hover:bg-ai transition-colors font-medium shadow-lg hover:shadow-xl"
    >
      ツールを使ってみる
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </a>
  );
}
