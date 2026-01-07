"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  showLabel?: boolean;
}

export default function ShareButtons({
  url,
  title = "山田ツール",
  description = "便利な無料オンラインツール",
  showLabel = true,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = "https://twitter.com/intent/tweet?url=" + encodedUrl + "&text=" + encodedTitle;
  const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl;
  const lineUrl = "https://social-plugins.line.me/lineit/share?url=" + encodedUrl;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Copy failed");
    }
  };

  const btnClass = "flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg px-4 py-2.5 text-sm";

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass + " bg-black hover:bg-gray-800 text-white"}
      >
        <span>𝕖</span>
        {showLabel && <span>ポスト</span>}
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass + " bg-blue-600 hover:bg-blue-700 text-white"}
      >
        <span>📘</span>
        {showLabel && <span>シェア</span>}
      </a>

      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass + " bg-green-500 hover:bg-green-600 text-white"}
      >
        <span>💬</span>
        {showLabel && <span>LINE</span>}
      </a>

      <button
        onClick={copyToClipboard}
        className={btnClass + (copied ? " bg-green-500 text-white" : " bg-gray-100 hover:bg-gray-200 text-gray-700")}
      >
        <span>{copied ? "✓" : "🔗"}</span>
        {showLabel && <span>{copied ? "コピー完了!" : "リンク"}</span>}
      </button>
    </div>
  );
}
