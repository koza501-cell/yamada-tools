"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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

// Internal states include time-aware and milestone variants
type InternalState =
  | MascotState
  | "welcome_night"
  | "welcome_milestone"
  | "success_milestone";

interface MascotProps {
  state?: MascotState;
  message?: string;        // legacy prop
  customMessage?: string;  // takes priority over auto message
  showUpgradeLink?: boolean;
  className?: string;
  priority?: boolean;
}

const mascotImages: Record<string, string> = {
  idle:        "/mascot/mascot-idle.png",
  working:     "/mascot/mascot-working.png",
  success:     "/mascot/mascot-success.png",
  error:       "/mascot/mascot-error.png",
  celebrating: "/mascot/mascot-celebrating.png",
  thinking:    "/mascot/mascot-thinking.png",
  teaching:    "/mascot/mascot-teaching.png",
  sleepy:      "/mascot/mascot-sleepy.png",
};

type Pose = keyof typeof mascotImages;

const statePose: Record<InternalState, Pose> = {
  idle:              "idle",
  working:           "working",
  welcome:           "idle",
  welcome_night:     "sleepy",
  welcome_milestone: "celebrating",
  processing:        "working",
  success:           "success",
  success_milestone: "celebrating",
  error:             "error",
  limit_warning:     "thinking",
  limit_reached:     "error",
  tip:               "thinking",
  upgrade_hint:      "teaching",
};

const messagePools: Record<InternalState, string[]> = {
  idle:              ["こんにちは！今日は何をお手伝いしようかな？", "いらっしゃい！アイちゃんだよ♪", "今日もお仕事がんばろう〜！"],
  working:           ["処理中...ちょっと待っててね！", "がんばってる...もうすぐだよ！💪", "ファイルを処理中〜♪"],
  welcome:           ["こんにちは！今日は何をお手伝いしようかな？", "いらっしゃい！アイちゃんだよ♪", "今日もお仕事がんばろう〜！"],
  welcome_night:     ["こんな時間までお仕事？無理しないでね...☕", "夜遅くまでお疲れさま...ゆっくり休んでね"],
  welcome_milestone: ["常連さんだね！いつもありがとう✨", "また会えて嬉しい！いつもありがとう🎉"],
  processing:        ["処理中...ちょっと待っててね！", "がんばってる...もうすぐだよ！💪", "ファイルを処理中〜♪"],
  success:           ["できたよ！✨", "処理完了！お疲れさま〜♪", "やったね！ダウンロードできるよ！", "バッチリ！👍"],
  success_milestone: ["すごい！たくさん処理してくれてありがとう！🎉", "ヘビーユーザーだね✨ いつもありがとう！"],
  error:             ["あれ...うまくいかなかった😢 もう一度試してみて？", "ごめんね、エラーが出ちゃった...", "問題が発生しちゃった...別のファイルで試してみて？"],
  limit_warning:     ["あと2回だよ〜🤔 明日また使えるからね♪", "ラスト1回...！PROなら気にしなくていいの♪"],
  limit_reached:     ["今日の無料枠おしまい！また明日ね〜♪ PROなら今すぐ続けられるよ！", "たくさん使ってくれてありがとう！PROで無制限にできるよ〜"],
  tip:               ["知ってた？このツール、他の機能もあるよ！", "ヒント💡 ドラッグ&ドロップでも使えるよ♪"],
  upgrade_hint:      ["PROならファイルサイズ200MBまでOKだよ♪", "法人で使うならTEAMプランもあるよ〜", "履歴を残したいならPROがおすすめ！"],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTimeBasedWelcomeState(): InternalState {
  const h = new Date().getHours();
  if (h >= 21 || h < 5) return "welcome_night";
  return "welcome";
}

function getVisitCount(): number {
  if (typeof localStorage === "undefined") return 0;
  return parseInt(localStorage.getItem("yamada_visit_count") ?? "0", 10);
}

function incrementVisitCount(): number {
  const count = getVisitCount() + 1;
  localStorage.setItem("yamada_visit_count", count.toString());
  return count;
}

function getTaskCount(): number {
  if (typeof sessionStorage === "undefined") return 0;
  return parseInt(sessionStorage.getItem("yamada_task_count") ?? "0", 10);
}

function incrementTaskCount(): number {
  const count = getTaskCount() + 1;
  sessionStorage.setItem("yamada_task_count", count.toString());
  return count;
}

const milestones = [10, 25, 50, 100];
function checkMilestone(count: number): boolean {
  return milestones.includes(count);
}

function buildWelcomeState(): { state: InternalState; message: string } {
  const v = getVisitCount();
  if (v >= 10) {
    return { state: "welcome_milestone", message: pickRandom(messagePools.welcome_milestone) };
  }
  const timeState = getTimeBasedWelcomeState();
  if (timeState === "welcome_night") {
    return { state: "welcome_night", message: pickRandom(messagePools.welcome_night) };
  }
  let msg: string;
  if (v === 1)      msg = "はじめまして！アイちゃんだよ♪ よろしくね！";
  else if (v <= 3)  msg = pickRandom(messagePools.welcome);
  else if (v <= 5)  msg = "最近よく来てくれるね！嬉しい♪";
  else              msg = "また会えた！今日も頑張ろう〜";
  return { state: "welcome", message: msg };
}

const stateAnimClass: Record<InternalState, string> = {
  idle:              "animate-float",
  working:           "animate-bounce-slow",
  welcome:           "animate-float",
  welcome_night:     "animate-float",
  welcome_milestone: "animate-mascot-bounce",
  processing:        "animate-bounce-slow",
  success:           "animate-mascot-bounce",
  success_milestone: "animate-mascot-bounce",
  error:             "animate-mascot-shake",
  limit_warning:     "animate-float",
  limit_reached:     "animate-mascot-shake",
  tip:               "animate-float",
  upgrade_hint:      "animate-float",
};

// Each style adds dark: variants for backgrounds (white → gray-800, gradient lights → darker tones)
const bubbleStyle: Record<InternalState, string> = {
  idle:              "border-kon dark:border-kon bg-white dark:bg-gray-800",
  working:           "border-ai dark:border-kon shadow-blue-100 dark:shadow-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/30",
  welcome:           "border-kon dark:border-kon bg-white dark:bg-gray-800",
  welcome_night:     "border-indigo-400 dark:border-indigo-500 shadow-indigo-100 dark:shadow-indigo-900/30 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/30",
  welcome_milestone: "border-yellow-400 dark:border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/30 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/30",
  processing:        "border-ai dark:border-kon shadow-blue-100 dark:shadow-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/30",
  success:           "border-green-500 dark:border-green-400 shadow-green-100 dark:shadow-green-900/30 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/30",
  success_milestone: "border-yellow-400 dark:border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/30 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/30",
  error:             "border-danger dark:border-danger shadow-red-100 dark:shadow-red-900/30 bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/30",
  limit_warning:     "border-yellow-400 dark:border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/30 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/30",
  limit_reached:     "border-danger dark:border-danger shadow-red-100 dark:shadow-red-900/30 bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/30",
  tip:               "border-kon dark:border-kon bg-white dark:bg-gray-800",
  upgrade_hint:      "border-sakura dark:border-sakura shadow-pink-100 dark:shadow-pink-900/30 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/30",
};

const tailColor: Record<InternalState, string> = {
  idle:              "border-r-kon dark:border-r-blue-500",
  working:           "border-r-ai dark:border-r-blue-400",
  welcome:           "border-r-kon dark:border-r-blue-500",
  welcome_night:     "border-r-indigo-400 dark:border-r-indigo-500",
  welcome_milestone: "border-r-yellow-400 dark:border-r-yellow-500",
  processing:        "border-r-ai dark:border-r-blue-400",
  success:           "border-r-green-500 dark:border-r-green-400",
  success_milestone: "border-r-yellow-400 dark:border-r-yellow-500",
  error:             "border-r-red-400 dark:border-r-red-500",
  limit_warning:     "border-r-yellow-400 dark:border-r-yellow-500",
  limit_reached:     "border-r-red-400 dark:border-r-red-500",
  tip:               "border-r-kon dark:border-r-blue-500",
  upgrade_hint:      "border-r-pink-400 dark:border-r-pink-500",
};

const nameColor: Record<InternalState, string> = {
  idle:              "text-gray-400 dark:text-gray-500",
  working:           "text-ai dark:text-gray-300",
  welcome:           "text-gray-400 dark:text-gray-500",
  welcome_night:     "text-indigo-400 dark:text-indigo-300",
  welcome_milestone: "text-yellow-500 dark:text-yellow-400",
  processing:        "text-ai dark:text-gray-300",
  success:           "text-green-500 dark:text-green-400",
  success_milestone: "text-yellow-500 dark:text-yellow-400",
  error:             "text-danger dark:text-gin",
  limit_warning:     "text-yellow-500 dark:text-yellow-400",
  limit_reached:     "text-danger dark:text-gin",
  tip:               "text-gray-400 dark:text-gray-500",
  upgrade_hint:      "text-sakura dark:text-sakura",
};

const glowColor: Record<InternalState, string> = {
  idle:              "bg-sakura/30 dark:bg-kon/20",
  working:           "bg-kon/30 dark:bg-kon/20",
  welcome:           "bg-sakura/30 dark:bg-kon/20",
  welcome_night:     "bg-indigo-400/20 dark:bg-indigo-400/15",
  welcome_milestone: "bg-yellow-400/30 dark:bg-yellow-400/20",
  processing:        "bg-kon/30 dark:bg-kon/20",
  success:           "bg-green-400/40 dark:bg-green-400/25",
  success_milestone: "bg-yellow-400/40 dark:bg-yellow-400/25",
  error:             "bg-danger/30 dark:bg-danger/20",
  limit_warning:     "bg-yellow-400/30 dark:bg-yellow-400/20",
  limit_reached:     "bg-danger/30 dark:bg-danger/20",
  tip:               "bg-sakura/30 dark:bg-kon/20",
  upgrade_hint:      "bg-kon/30 dark:bg-kon/20",
};

function SuccessParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute animate-sparkle text-lg"
          style={{
            left: `${10 + i * 15}%`,
            top: `${-10 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.8 + i * 0.1}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

function CelebrationParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {["🎉", "✨", "🌟", "🎊", "⭐", "💫"].map((emoji, i) => (
        <div
          key={i}
          className="absolute animate-sparkle text-base"
          style={{
            left: `${5 + i * 16}%`,
            top: `${-15 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${0.9 + i * 0.1}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

function ErrorSweat() {
  return <div className="absolute -top-1 right-0 text-sm animate-bounce">💧</div>;
}

function WorkingDots() {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-kon dark:bg-kon rounded-full animate-typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center ml-1">
      <span className="w-1.5 h-1.5 bg-kon dark:bg-kon rounded-full animate-typing-dot" style={{ animationDelay: "0ms" }}></span>
      <span className="w-1.5 h-1.5 bg-kon dark:bg-kon rounded-full animate-typing-dot mx-1" style={{ animationDelay: "150ms" }}></span>
      <span className="w-1.5 h-1.5 bg-kon dark:bg-kon rounded-full animate-typing-dot" style={{ animationDelay: "300ms" }}></span>
    </span>
  );
}

function GlowEffect({ state }: { state: InternalState }) {
  const isProcessing = state === "working" || state === "processing";
  const isSuccess    = state === "success" || state === "success_milestone";
  return (
    <div
      className={`absolute inset-0 rounded-full blur-xl ${glowColor[state]} ${
        isSuccess    ? "animate-pulse-glow" :
        isProcessing ? "animate-pulse" :
        "opacity-50"
      }`}
    />
  );
}

export default function Mascot({
  state = "idle",
  message,
  customMessage,
  showUpgradeLink,
  className,
  priority = false,
}: MascotProps) {
  const [effectiveState, setEffectiveState] = useState<InternalState>(state);
  const [resolvedMessage, setResolvedMessage] = useState<string>("");
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [prevState, setPrevState] = useState<InternalState>(state);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    incrementVisitCount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Object.values(mascotImages).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const explicit = customMessage ?? message;
    let nextState: InternalState = state;
    let nextMsg   = explicit ?? "";

    if (!explicit) {
      if (state === "success") {
        const count = incrementTaskCount();
        if (checkMilestone(count)) {
          nextState = "success_milestone";
          nextMsg   = pickRandom(messagePools.success_milestone);
        } else if (count > 0 && count % 3 === 0) {
          nextState = "upgrade_hint";
          nextMsg   = pickRandom(messagePools.upgrade_hint);
        } else {
          nextMsg = pickRandom(messagePools.success);
        }
      } else if (state === "idle" || state === "welcome") {
        const welcome = buildWelcomeState();
        nextState = welcome.state;
        nextMsg   = welcome.message;
      } else {
        nextMsg = pickRandom(messagePools[state] ?? messagePools.idle);
      }
    }

    setEffectiveState(nextState);
    setResolvedMessage(nextMsg);
  }, [state, message, customMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (prevState !== effectiveState) {
      setIsTransitioning(true);
      setIsAppearing(false);
      const t1 = setTimeout(() => {
        setPrevState(effectiveState);
        setIsTransitioning(false);
        setIsAppearing(true);
      }, 150);
      const t2 = setTimeout(() => setIsAppearing(false), 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [effectiveState, prevState]);

  useEffect(() => {
    if (!resolvedMessage) return;
    setDisplayedMessage(resolvedMessage);
    setIsTyping(false);
  }, [resolvedMessage]);

  const pose             = statePose[effectiveState];
  const imgSrc           = mascotImages[pose];
  const isProcessing     = effectiveState === "working" || effectiveState === "processing";
  const isSuccess        = effectiveState === "success";
  const isCelebrating    = effectiveState === "success_milestone" || effectiveState === "welcome_milestone";
  const isError          = effectiveState === "error" || effectiveState === "limit_reached";
  const isIdle           = effectiveState === "idle" || effectiveState === "welcome" || effectiveState === "welcome_night";
  const showProLink      = showUpgradeLink &&
    (effectiveState === "limit_reached" || effectiveState === "limit_warning" || effectiveState === "upgrade_hint");

  return (
    <div
      className={`flex items-end gap-3 transition-all duration-300 opacity-100 translate-y-0 min-h-[120px] ${isAppearing ? "animate-mascot-appear" : ""} ${className ?? ""}`}
    >
      <div
        className={`relative w-20 h-20 flex-shrink-0 transition-transform duration-150 ${
          isTransitioning ? "scale-95 opacity-80" : "scale-100 opacity-100"
        } ${stateAnimClass[effectiveState]}`}
      >
        <GlowEffect state={effectiveState} />
        {isSuccess      && <SuccessParticles />}
        {isCelebrating  && <CelebrationParticles />}
        {isError        && <ErrorSweat />}
        {isProcessing   && (
          <>
            <div className="absolute inset-0 border-2 border-kon/20 dark:border-kon/20 border-t-kon dark:border-t-blue-400 rounded-full animate-spin-slow" />
            <WorkingDots />
          </>
        )}
        <div className="relative w-full h-full">
          <Image
            src={imgSrc}
            alt="アイちゃん"
            fill
            priority={priority}
            className={`object-contain transition-all duration-300 drop-shadow-lg ${
              isSuccess || isCelebrating ? "scale-105 brightness-105" :
              isError   ? "brightness-95" : ""
            }`}
          />
        </div>
        {isIdle && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 dark:bg-white/5 rounded-full blur-sm animate-float"
            style={{ animationDirection: "reverse" }}
          />
        )}
      </div>

      <div
        className={`relative border-2 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-md max-w-xs transition-all duration-300 ${bubbleStyle[effectiveState]}`}
      >
        <div
          className={`absolute -left-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-b-8 border-b-transparent transition-colors duration-300 ${tailColor[effectiveState]}`}
        />
        <div className="absolute -left-[5px] bottom-[9px] w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-white dark:border-r-gray-800 border-b-[6px] border-b-transparent" />

        <div className="absolute -top-2 -right-2">
          {(isSuccess || isCelebrating) && (
            <span className="block w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full text-white text-xs flex items-center justify-center shadow-md animate-bounce">
              {isCelebrating ? "🎉" : "✓"}
            </span>
          )}
          {isError && (
            <span className="block w-6 h-6 bg-danger dark:bg-danger rounded-full text-white text-xs flex items-center justify-center shadow-md">!</span>
          )}
          {isProcessing && (
            <span className="block w-6 h-6 bg-ai dark:bg-kon rounded-full text-white text-xs flex items-center justify-center shadow-md animate-spin-slow">⟳</span>
          )}
          {(effectiveState === "upgrade_hint" || effectiveState === "limit_warning") && (
            <span className="block w-6 h-6 bg-kon dark:bg-kon rounded-full text-white text-xs flex items-center justify-center shadow-md">★</span>
          )}
        </div>

        <p className="text-sm text-sumi dark:text-gray-100 leading-relaxed min-h-[1.5em]">
          {displayedMessage}
          {isProcessing && !isTyping && <TypingIndicator />}
        </p>

        {showProLink && (
          <a
            href="/pro"
            className="mt-1.5 inline-block text-xs font-semibold text-sakura hover:text-sakura dark:text-sakura dark:hover:text-sakura underline underline-offset-2"
          >
            PRO プランを見る →
          </a>
        )}

        <span className={`text-xs mt-1 block font-medium transition-colors duration-300 ${nameColor[effectiveState]}`}>
          — アイちゃん 💙
        </span>
      </div>
    </div>
  );
}
