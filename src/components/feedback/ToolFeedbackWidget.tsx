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
  useCaseOptions?: { value: string; label: string }[];
}

type WidgetState =
  | "voting"
  | "submitting"
  | "stage2"
  | "stage2-submitting"
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
    stage2Heading: "もしよろしければ、もう少し教えてください（任意・30秒）",
    useCaseLabel: "どんな用途で使いましたか？",
    commentLabel: "コメント（任意）",
    commentPlaceholder: "どんな場面で使いましたか？など",
    roleLabel: "ご職業（任意）",
    roleOptions: [
      { value: "", label: "-- 選択してください --" },
      { value: "個人事業主", label: "個人事業主" },
      { value: "中小企業経営者", label: "中小企業経営者" },
      { value: "会社員", label: "会社員" },
      { value: "士業", label: "士業" },
      { value: "学生", label: "学生" },
      { value: "その他", label: "その他" },
    ],
    ageBandLabel: "年代（任意）",
    ageBandOptions: [
      { value: "", label: "-- 選択してください --" },
      { value: "20代", label: "20代" },
      { value: "30代", label: "30代" },
      { value: "40代", label: "40代" },
      { value: "50代", label: "50代" },
      { value: "60代以上", label: "60代以上" },
    ],
    submit: "送信",
    skip: "スキップ",
    commentRejected: "コメントを確認できませんでした。",
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
    stage2Heading: "If you'd like, tell us a bit more (optional, 30 sec)",
    useCaseLabel: "How did you use this tool?",
    commentLabel: "Comment (optional)",
    commentPlaceholder: "Tell us how you used it, etc.",
    roleLabel: "Your role (optional)",
    roleOptions: [
      { value: "", label: "-- Select --" },
      { value: "個人事業主", label: "Self-employed" },
      { value: "中小企業経営者", label: "SME owner" },
      { value: "会社員", label: "Employee" },
      { value: "士業", label: "Professional (lawyer/accountant)" },
      { value: "学生", label: "Student" },
      { value: "その他", label: "Other" },
    ],
    ageBandLabel: "Age group (optional)",
    ageBandOptions: [
      { value: "", label: "-- Select --" },
      { value: "20代", label: "20s" },
      { value: "30代", label: "30s" },
      { value: "40代", label: "40s" },
      { value: "50代", label: "50s" },
      { value: "60代以上", label: "60+" },
    ],
    submit: "Submit",
    skip: "Skip",
    commentRejected: "We couldn't process your comment.",
  },
} as const;

export default function ToolFeedbackWidget({
  toolSlug,
  visible,
  lang = "ja",
  className,
  useCaseOptions,
}: ToolFeedbackWidgetProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>("voting");
  const [activeSentiment, setActiveSentiment] = useState<-1 | 0 | 1 | null>(
    null
  );
  const [feedbackId, setFeedbackId] = useState<number | null>(null);
  const [commentRejected, setCommentRejected] = useState(false);

  // Stage 2 form state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userAgeBand, setUserAgeBand] = useState("");

  const L = LABELS[lang];

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(VOTED_KEY(toolSlug))) {
        setWidgetState("hidden");
      }
    }
  }, [toolSlug]);

  if (!visible || widgetState === "hidden") return null;

  const submitVote = async (sentiment: -1 | 0 | 1) => {
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

      const data = await res.json();

      if (sentiment === -1) {
        localStorage.setItem(VOTED_KEY(toolSlug), "true");
        setWidgetState("done-negative");
        return;
      }

      // Positive or neutral → Stage 2
      setFeedbackId(data.id);
      setWidgetState("stage2");
    } catch {
      setWidgetState("error");
    }
  };

  const finishWithThankYou = () => {
    localStorage.setItem(VOTED_KEY(toolSlug), "true");
    setWidgetState("done");
  };

  const submitStage2 = async () => {
    if (feedbackId === null) {
      finishWithThankYou();
      return;
    }

    setWidgetState("stage2-submitting");

    const body: Record<string, string> = {};
    if (comment.trim()) body.comment = comment.trim();
    if (selectedTags.length > 0) body.use_case_tags = selectedTags.join(",");
    if (userRole) body.user_role = userRole;
    if (userAgeBand) body.user_age_band = userAgeBand;

    // Nothing filled → treat as skip
    if (Object.keys(body).length === 0) {
      finishWithThankYou();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/feedback/tool/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": getSessionId(),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // 403/409/410/503 → swallow silently, just thank the user
        finishWithThankYou();
        return;
      }

      const data = await res.json();
      localStorage.setItem(VOTED_KEY(toolSlug), "true");

      if (data.status === "rejected") {
        setCommentRejected(true);
      }
      setWidgetState("done");
    } catch {
      finishWithThankYou();
    }
  };

  const skipStage2 = () => {
    finishWithThankYou();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
                  onClick={() => submitVote(sentiment)}
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

      {(widgetState === "stage2" || widgetState === "stage2-submitting") && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {L.stage2Heading}
          </p>

          {useCaseOptions && useCaseOptions.length > 0 && (
            <fieldset>
              <legend className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {L.useCaseLabel}
              </legend>
              <div className="flex flex-wrap gap-2">
                {useCaseOptions.map((opt) => {
                  const checked = selectedTags.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all select-none ${
                        checked
                          ? "border-kon bg-kon/10 text-kon dark:border-ai dark:bg-ai/20 dark:text-ai"
                          : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleTag(opt.value)}
                        disabled={widgetState === "stage2-submitting"}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div>
            <label
              htmlFor="feedback-comment"
              className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
            >
              {L.commentLabel}
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 100))}
              placeholder={L.commentPlaceholder}
              rows={2}
              disabled={widgetState === "stage2-submitting"}
              className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-kon/30 dark:focus:ring-ai/30 disabled:opacity-50"
            />
            <p className="text-right text-xs text-gray-400 mt-0.5">
              {comment.length}/100
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="feedback-role"
                className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
              >
                {L.roleLabel}
              </label>
              <select
                id="feedback-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                disabled={widgetState === "stage2-submitting"}
                className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kon/30 dark:focus:ring-ai/30 disabled:opacity-50"
              >
                {L.roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="feedback-age"
                className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
              >
                {L.ageBandLabel}
              </label>
              <select
                id="feedback-age"
                value={userAgeBand}
                onChange={(e) => setUserAgeBand(e.target.value)}
                disabled={widgetState === "stage2-submitting"}
                className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kon/30 dark:focus:ring-ai/30 disabled:opacity-50"
              >
                {L.ageBandOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={skipStage2}
              disabled={widgetState === "stage2-submitting"}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2 disabled:opacity-50"
            >
              {L.skip}
            </button>
            <button
              onClick={submitStage2}
              disabled={widgetState === "stage2-submitting"}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-kon text-white dark:bg-ai hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kon"
            >
              {widgetState === "stage2-submitting" && (
                <svg
                  className="animate-spin h-4 w-4"
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
              )}
              {L.submit}
            </button>
          </div>
        </div>
      )}

      {widgetState === "done" && (
        <div className="text-center py-1">
          {!commentRejected && (
            <span className="text-xl text-green-500" aria-hidden="true">
              ✓
            </span>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {commentRejected ? L.commentRejected : L.donePositive}
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
