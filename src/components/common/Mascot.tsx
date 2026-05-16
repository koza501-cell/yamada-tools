"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/** ============================================================
 *  あいちゃん (Mascot) — yamada-tools.jp
 *  Layer 1: Identity (name "あいちゃん" baked into dialogue + profile link)
 *  Layer 4: Behavior intelligence (time/season/visit/category-aware)
 *  Public API unchanged — 90 consumer pages stay working.
 *  ============================================================ */

export type MascotState =
  | "idle"
  | "working"
  | "welcome"
  | "processing"
  | "success"
  | "error"
  | "limit_warning"
  | "limit_reached"
  | "tip"
  | "upgrade_hint";

type InternalState =
  | MascotState
  | "welcome_night"
  | "welcome_morning"
  | "welcome_evening"
  | "welcome_milestone"
  | "welcome_returning"
  | "welcome_loyal"
  | "welcome_seasonal_sakura"
  | "welcome_seasonal_tanabata"
  | "welcome_seasonal_yearend"
  | "welcome_seasonal_newyear"
  | "success_milestone"
  | "blog_first_read";

interface MascotProps {
  state: MascotState;
  message?: string;
  customMessage?: string;
  showUpgradeLink?: boolean;
  className?: string;
  priority?: boolean;
  /** category hint for context-aware lines: "business" | "realestate" | "clinic" | "finance" | "document" | "pdf" | "image" | "blog" | undefined */
  category?: string;
}

type Pose =
  | "idle"
  | "working"
  | "success"
  | "error"
  | "celebrating"
  | "thinking"
  | "teaching"
  | "sleepy";

const mascotImages: Record<Pose, string> = {
  idle: "/mascot/mascot-idle.png",
  working: "/mascot/mascot-working.png",
  success: "/mascot/mascot-success.png",
  error: "/mascot/mascot-error.png",
  celebrating: "/mascot/mascot-celebrating.png",
  thinking: "/mascot/mascot-thinking.png",
  teaching: "/mascot/mascot-teaching.png",
  sleepy: "/mascot/mascot-sleepy.png",
};

const statePose: Record<InternalState, Pose> = {
  idle: "idle",
  working: "working",
  welcome: "idle",
  welcome_night: "sleepy",
  welcome_morning: "idle",
  welcome_evening: "idle",
  welcome_milestone: "celebrating",
  welcome_returning: "idle",
  welcome_loyal: "celebrating",
  welcome_seasonal_sakura: "idle",
  welcome_seasonal_tanabata: "idle",
  welcome_seasonal_yearend: "teaching",
  welcome_seasonal_newyear: "celebrating",
  processing: "working",
  success: "success",
  success_milestone: "celebrating",
  error: "error",
  limit_warning: "thinking",
  limit_reached: "thinking",
  tip: "teaching",
  upgrade_hint: "teaching",
  blog_first_read: "teaching",
};

/** Dialogue pools — all lines feature あいちゃん's voice (mixed polite + casual) */
const messagePools: Record<InternalState, string[]> = {
  idle: [
    "ご利用ありがとうございます！",
    "あいちゃん、ここにいますよ〜",
    "なにかお困りごとはありますか？",
  ],
  working: [
    "処理中だよ、ちょっと待っててね...",
    "あいちゃんが頑張って計算中です！",
    "もう少しでできますよ〜",
  ],
  welcome: [
    "ようこそ！あいちゃんです♪",
    "今日もご利用ありがとうございます！",
    "お手伝いしますね〜",
  ],
  welcome_morning: [
    "おはようございます！あいちゃんです♪",
    "おはよう〜！今日も一日よろしくね",
    "朝からお仕事、お疲れさまです",
  ],
  welcome_evening: [
    "お疲れさまです！あいちゃんです♪",
    "夕方もお仕事ですか？お手伝いしますね",
    "もうひと頑張り、応援してます〜",
  ],
  welcome_night: [
    "夜遅くまでお疲れさまです...あいちゃんが見守ってますよ",
    "無理しすぎないでくださいね",
    "夜分にようこそ。お役に立てたら嬉しいです",
  ],
  welcome_milestone: [
    "わぁ！またご利用ありがとう♪",
    "あいちゃん、嬉しいです！",
    "いつもありがとうございます〜！",
  ],
  welcome_returning: [
    "また来てくれましたね！嬉しいです♪",
    "おかえりなさい〜",
    "あいちゃん、待ってましたよ〜",
  ],
  welcome_loyal: [
    "いつもご利用ありがとうございます！",
    "あいちゃんの大切なお客さまです♪",
    "今日もご一緒できて嬉しいです〜",
  ],
  welcome_seasonal_sakura: [
    "桜の季節ですね♪ 今日もご利用ありがとうございます",
    "春ですね〜 お花見の予定はありますか？",
    "新しい年度、応援してます！",
  ],
  welcome_seasonal_tanabata: [
    "七夕ですね♪ お願いごとは決まりましたか？",
    "あいちゃんの願いは、皆さんが笑顔になることです",
  ],
  welcome_seasonal_yearend: [
    "今年もあと少しですね。お疲れさまです",
    "年末で忙しい時期、無理しすぎないでくださいね",
    "今年もご利用ありがとうございました",
  ],
  welcome_seasonal_newyear: [
    "あけましておめでとうございます！",
    "今年もよろしくお願いします♪",
    "あいちゃん、今年も頑張ります〜",
  ],
  processing: [
    "ちょっと待っててね...",
    "もう少しです〜",
    "頑張って計算中！",
  ],
  success: [
    "できましたよ〜♪",
    "完了です！",
    "うまくいきました！",
    "お役に立てて嬉しいです♪",
  ],
  success_milestone: [
    "わ〜い！たくさん使ってくれてありがとう♪",
    "あいちゃん、感動しちゃいました！",
    "いつもご利用ありがとうございます〜！",
  ],
  error: [
    "あれ？ちょっと困りました...",
    "ごめんなさい、もう一度試してくださいね",
    "うまくいかなかったみたい。ごめんね",
  ],
  limit_warning: [
    "そろそろ無料枠の上限かも...",
    "もう少しで本日の利用回数に達しちゃいます",
  ],
  limit_reached: [
    "今日の無料枠を使い切っちゃいました...",
    "明日また使えますよ〜",
  ],
  tip: [
    "ちょっとしたコツがあるんです♪",
    "知ってると便利な使い方があるよ〜",
  ],
  upgrade_hint: [
    "PROプランだと、もっと便利に使えますよ♪",
    "たくさんお使いいただいてありがとうございます！",
  ],
  blog_first_read: [
    "ブログ読んでくれてありがとう♪",
    "じっくり読んでくださいね〜",
    "気になる箇所、教えてください！",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** ---------- visit / task tracking ---------- */
function getVisitCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("yamada_visit_count");
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

function incrementVisitCount() {
  if (typeof window === "undefined") return;
  try {
    const v = getVisitCount() + 1;
    localStorage.setItem("yamada_visit_count", String(v));
  } catch {
    /* ignore */
  }
}

function getTaskCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem("yamada_task_count");
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

function isMilestoneCount(n: number): boolean {
  return n === 10 || n === 25 || n === 50 || n === 100;
}

/** ---------- behavior intelligence ---------- */
function getTimeBand(): "morning" | "day" | "evening" | "night" {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "day";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function getSeasonalKey(): InternalState | null {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  // 新年 Jan 1-7
  if (m === 1 && day <= 7) return "welcome_seasonal_newyear";
  // 桜 April
  if (m === 4) return "welcome_seasonal_sakura";
  // 七夕 July 5-7
  if (m === 7 && day >= 5 && day <= 7) return "welcome_seasonal_tanabata";
  // 年末 Dec 20-31
  if (m === 12 && day >= 20) return "welcome_seasonal_yearend";
  return null;
}

function buildWelcomeState(category?: string): {
  state: InternalState;
  message: string;
} {
  const v = getVisitCount();

  // Seasonal takes priority (rare events)
  const seasonal = getSeasonalKey();
  if (seasonal) {
    return { state: seasonal, message: pickRandom(messagePools[seasonal]) };
  }

  // Night-time greeting
  const band = getTimeBand();
  if (band === "night") {
    return {
      state: "welcome_night",
      message: pickRandom(messagePools.welcome_night),
    };
  }

  // Milestone visits
  if (isMilestoneCount(v)) {
    return {
      state: "welcome_milestone",
      message: `${v}回目のご来店、ありがとうございます♪`,
    };
  }

  // Loyal (10+)
  if (v >= 10) {
    return {
      state: "welcome_loyal",
      message: pickRandom(messagePools.welcome_loyal),
    };
  }

  // Returning (2-5)
  if (v >= 2 && v <= 5) {
    return {
      state: "welcome_returning",
      message: pickRandom(messagePools.welcome_returning),
    };
  }

  // Time-of-day greeting
  if (band === "morning") {
    return {
      state: "welcome_morning",
      message: pickRandom(messagePools.welcome_morning),
    };
  }
  if (band === "evening") {
    return {
      state: "welcome_evening",
      message: pickRandom(messagePools.welcome_evening),
    };
  }

  // First-visit explicit
  if (v <= 1) {
    return {
      state: "welcome",
      message: "はじめまして！あいちゃんだよ♪ よろしくね！",
    };
  }

  return { state: "welcome", message: pickRandom(messagePools.welcome) };
}

/** ---------- bubble visuals ---------- */
const bubbleStyles: Record<
  InternalState,
  { bg: string; border: string; tailBorder: string; nameColor: string }
> = {
  idle: {
    bg: "bg-white",
    border: "border-gray-200",
    tailBorder: "border-r-gray-200",
    nameColor: "text-kon",
  },
  working: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    tailBorder: "border-r-blue-200",
    nameColor: "text-kon",
  },
  welcome: {
    bg: "bg-white",
    border: "border-gray-200",
    tailBorder: "border-r-gray-200",
    nameColor: "text-kon",
  },
  welcome_morning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tailBorder: "border-r-amber-200",
    nameColor: "text-kon",
  },
  welcome_evening: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    tailBorder: "border-r-orange-200",
    nameColor: "text-kon",
  },
  welcome_night: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    tailBorder: "border-r-slate-200",
    nameColor: "text-kon",
  },
  welcome_milestone: {
    bg: "bg-sakura/30",
    border: "border-sakura",
    tailBorder: "border-r-sakura",
    nameColor: "text-kon",
  },
  welcome_returning: {
    bg: "bg-white",
    border: "border-gray-200",
    tailBorder: "border-r-gray-200",
    nameColor: "text-kon",
  },
  welcome_loyal: {
    bg: "bg-sakura/20",
    border: "border-sakura",
    tailBorder: "border-r-sakura",
    nameColor: "text-kon",
  },
  welcome_seasonal_sakura: {
    bg: "bg-sakura/30",
    border: "border-sakura",
    tailBorder: "border-r-sakura",
    nameColor: "text-kon",
  },
  welcome_seasonal_tanabata: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    tailBorder: "border-r-blue-200",
    nameColor: "text-kon",
  },
  welcome_seasonal_yearend: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tailBorder: "border-r-amber-200",
    nameColor: "text-kon",
  },
  welcome_seasonal_newyear: {
    bg: "bg-red-50",
    border: "border-red-200",
    tailBorder: "border-r-red-200",
    nameColor: "text-kon",
  },
  processing: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    tailBorder: "border-r-blue-200",
    nameColor: "text-kon",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    tailBorder: "border-r-green-200",
    nameColor: "text-kon",
  },
  success_milestone: {
    bg: "bg-sakura/30",
    border: "border-sakura",
    tailBorder: "border-r-sakura",
    nameColor: "text-kon",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    tailBorder: "border-r-red-200",
    nameColor: "text-danger",
  },
  limit_warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tailBorder: "border-r-amber-200",
    nameColor: "text-kon",
  },
  limit_reached: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    tailBorder: "border-r-amber-200",
    nameColor: "text-kon",
  },
  tip: {
    bg: "bg-white",
    border: "border-gray-200",
    tailBorder: "border-r-gray-200",
    nameColor: "text-kon",
  },
  upgrade_hint: {
    bg: "bg-sakura/30",
    border: "border-sakura",
    tailBorder: "border-r-sakura",
    nameColor: "text-kon",
  },
  blog_first_read: {
    bg: "bg-white",
    border: "border-gray-200",
    tailBorder: "border-r-gray-200",
    nameColor: "text-kon",
  },
};

/** ---------- Component ---------- */
export default function Mascot({
  state,
  message,
  customMessage,
  showUpgradeLink = false,
  className = "",
  priority = true,
  category,
}: MascotProps) {
  const [resolved, setResolved] = useState<{
    state: InternalState;
    message: string;
  }>({ state, message: message || customMessage || "" });

  useEffect(() => {
    // Increment visit count on welcome state
    if (state === "welcome") {
      incrementVisitCount();
      const built = buildWelcomeState(category);
      setResolved({
        state: built.state,
        message: customMessage || message || built.message,
      });
      return;
    }

    // Success milestone check
    if (state === "success") {
      const t = getTaskCount();
      if (isMilestoneCount(t)) {
        setResolved({
          state: "success_milestone",
          message:
            customMessage ||
            message ||
            pickRandom(messagePools.success_milestone),
        });
        return;
      }
    }

    // Default: use the provided state with pool fallback
    const internalState: InternalState = state;
    const fallback = messagePools[internalState]
      ? pickRandom(messagePools[internalState])
      : "";
    setResolved({
      state: internalState,
      message: customMessage || message || fallback,
    });
  }, [state, message, customMessage, category]);

  const pose = statePose[resolved.state] || "idle";
  const styles = bubbleStyles[resolved.state] || bubbleStyles.idle;
  const showLink =
    showUpgradeLink &&
    (resolved.state === "limit_reached" ||
      resolved.state === "limit_warning" ||
      resolved.state === "upgrade_hint");

  return (
    <div
      className={`flex items-end gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Link
        href="/about/ai-chan"
        className="flex-shrink-0 hover:scale-105 transition-transform"
        title="あいちゃんのプロフィール"
      >
        <Image
          src={mascotImages[pose]}
          alt="あいちゃん"
          width={80}
          height={80}
          className="rounded-full"
          priority={priority}
        />
      </Link>
      <div
        className={`relative ${styles.bg} border ${styles.border} rounded-2xl px-4 py-3 max-w-xs shadow-sm`}
      >
        <div
          className={`absolute -left-2 bottom-3 w-0 h-0 border-y-8 border-y-transparent border-r-8 ${styles.tailBorder}`}
        />
        <div className={`text-xs font-bold ${styles.nameColor} mb-1`}>
          あいちゃん
        </div>
        <p className="text-sm text-sumi leading-relaxed whitespace-pre-line">
          {resolved.message}
        </p>
        {showLink && (
          <Link
            href="/pro"
            className="inline-block mt-2 text-xs text-kon hover:text-ai underline underline-offset-2"
          >
            PROプランを見る →
          </Link>
        )}
      </div>
    </div>
  );
}
