"use client";

import { useState, useEffect } from "react";
import { getSessionId } from "@/lib/session-id";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

const VOTED_KEY = (slug: string) => `yamada-feedback-voted-${slug}`;

interface ToolFeedbackWidgetProps {
  toolSlug: string;
  visible: boolean;
  lang?: "ja" | "en";
  className?: string;
}

type WidgetState =
  | "voting"
  | "submitting"
  | "done"
  | "done-negative"
  | "rate-limited"
  | "error"
  | "hidden";

const LABELS = {
  ja: {
    heading: "ご利用ありがとうございました。役に立ちましたか？",
    helpful: "役に立った",
    okay: "普通",
    needsWork: "改善してほしい",
    helper: "改善要望は開発チームに直接届きます",
    donePositive: "ありがとうございました！",
    doneNegative:
      "改善要望をお送りいただきありがとうございました。チームに届きました。",
    rateLimit: "しばらくしてからお試しください",
    error: "送信に失敗しました。しばらくしてからお試しください。",
    retry: "再試行",
  },
  en: {
    heading: "Thanks for using this tool. Was it helpful?",
    helpful: "Helpful",
    okay: "Okay",
    needsWork: "Needs improvement",
    helper: "Improvement requests go directly to our dev team",
    donePositive: "Thank you!",
    doneNegative:
      "Thank you for your feedback. Your request has been sent to our team.",
    rateLimit: "Please try again later.",
    error: "Failed to send. Please try again later.",
    retry: "Retry",
  },
} as const;

export default function ToolFeedbackWidget({
  toolSlug,
  visible,
  lang = "ja",
  className,
}: ToolFeedbackWidgetProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>("voting");
  const [activeSentiment, setActiveSentiment] = useState<-1 | 0 | 1 | null>(
    null
  );
  const L = LABELS[lang];

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(VOTED_KEY(toolSlug))) {
        setWidgetState("hidden");
      }
    }
  }, [toolSlug]);

  if (!visible || widgetState === "hidden") return null;

  const submit = async (sentiment: -1 | 0 | 1) => {
    setActiveSentiment(sentiment);
    setWidgetState("submitting");
    try {
      const res = await fetch(`${API_BASE}/feedback/tool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": getSessionId(),
        },
        body: JSON.stringify({ tool_slug: toolSlug, sentiment, lang }),
      });

      if (res.status === 503) {
        setWidgetState("hidden");
        return;
      }
      if (res.status === 429) {
        setWidgetState("rate-limited");
        return;
      }
      if (!res.ok) {
        setWidgetState("error");
        return;
      }

      localStorage.setItem(VOTED_KEY(toolSlug), "true");
      setWidgetState(sentiment === -1 ? "done-negative" : "done");
    } catch {
      setWidgetState("error");
    }
  };

  const isSubmitting = widgetState === "submitting";

  const BUTTONS: { sentiment: -1 | 0 | 1; emoji: string; label: string }[] = [
    { sentiment: 1, emoji: "😊", label: L.helpful },
    { sentiment: 0, emoji: "😐", label: L.okay },
    { sentiment: -1, emoji: "😞", label: L.needsWork },
  ];

  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className ?? ""}`}
      role="region"
      aria-label={lang === "ja" ? "ツール評価" : "Tool feedback"}
    >
      {(widgetState === "voting" || widgetState === "submitting") && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {L.heading}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {BUTTONS.map(({ sentiment, emoji, label }) => {
              const isThisActive =
                isSubmitting && activeSentiment === sentiment;
              return (
                <button
                  key={sentiment}
                  onClick={() => submit(sentiment)}
                  disabled={isSubmitting}
                  aria-label={label}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all min-w-[88px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-kon ${
                    isSubmitting
                      ? "border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-200 dark:border-gray-600 hover:border-kon dark:hover:border-ai hover:bg-kon/5 dark:hover:bg-ai/20 cursor-pointer"
                  }`}
                >
                  {isThisActive ? (
                    <svg
                      className="animate-spin h-6 w-6 text-gray-400"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {emoji}
                    </span>
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            {L.helper}
          </p>
        </div>
      )}

      {widgetState === "done" && (
        <div className="text-center py-1">
          <span className="text-xl text-green-500" aria-hidden="true">
            ✓
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {L.donePositive}
          </p>
        </div>
      )}

      {widgetState === "done-negative" && (
        <div className="text-center py-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {L.doneNegative}
          </p>
        </div>
      )}

      {widgetState === "rate-limited" && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {L.rateLimit}
        </p>
      )}

      {widgetState === "error" && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {L.error}
          </p>
          <button
            onClick={() => {
              setWidgetState("voting");
              setActiveSentiment(null);
            }}
            className="text-xs text-kon dark:text-gray-300 underline underline-offset-2"
          >
            {L.retry}
          </button>
        </div>
      )}
    </div>
  );
}
