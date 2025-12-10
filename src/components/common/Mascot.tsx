"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export type MascotState = "idle" | "working" | "success" | "error";

interface MascotProps {
  state: MascotState;
  message?: string;
}

const mascotImages: Record<MascotState, string> = {
  idle: "/images/mascot-idle.png",
  working: "/images/mascot-working.png",
  success: "/images/mascot-success.png",
  error: "/images/mascot-error.png",
};

const defaultMessages: Record<MascotState, string> = {
  idle: "こんにちは！ファイルをドラッグ＆ドロップしてね。",
  working: "処理中です...少々お待ちください！",
  success: "完了しました！お疲れ様でした。",
  error: "申し訳ありません。エラーが発生しました。",
};

// Animation classes for each state
const stateAnimations: Record<MascotState, string> = {
  idle: "animate-float",
  working: "animate-bounce-slow",
  success: "animate-celebrate",
  error: "animate-shake",
};

// Sparkle particles for success state
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

// Error sweat drops
function ErrorSweat() {
  return (
    <div className="absolute -top-1 right-0 text-sm animate-bounce">
      💧
    </div>
  );
}

// Working progress dots
function WorkingDots() {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-kon rounded-full animate-typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

// Typing indicator for speech bubble
function TypingIndicator() {
  return (
    <span className="inline-flex items-center ml-1">
      <span className="w-1.5 h-1.5 bg-kon rounded-full animate-typing-dot" style={{ animationDelay: "0ms" }}></span>
      <span className="w-1.5 h-1.5 bg-kon rounded-full animate-typing-dot mx-1" style={{ animationDelay: "150ms" }}></span>
      <span className="w-1.5 h-1.5 bg-kon rounded-full animate-typing-dot" style={{ animationDelay: "300ms" }}></span>
    </span>
  );
}

// Glow effect component
function GlowEffect({ state }: { state: MascotState }) {
  const glowColors: Record<MascotState, string> = {
    idle: "bg-sakura/30",
    working: "bg-blue-400/30",
    success: "bg-green-400/40",
    error: "bg-red-400/30",
  };

  return (
    <div 
      className={`absolute inset-0 rounded-full blur-xl ${glowColors[state]} ${
        state === "success" ? "animate-pulse-glow" : 
        state === "working" ? "animate-pulse" : 
        "opacity-50"
      }`}
    />
  );
}

export default function Mascot({ state, message }: MascotProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [prevState, setPrevState] = useState<MascotState>(state);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fullMessage = message || defaultMessages[state];

  // Fade in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Preload all images
  useEffect(() => {
    Object.values(mascotImages).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Handle state transitions with animation
  useEffect(() => {
    if (prevState !== state) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevState(state);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [state, prevState]);

  // Typing animation effect
  useEffect(() => {
    // Reset and start typing when message changes
    setIsTyping(true);
    setDisplayedMessage("");
    
    let currentIndex = 0;
    const typingSpeed = 25; // ms per character
    
    const typeNextChar = () => {
      if (currentIndex < fullMessage.length) {
        setDisplayedMessage(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };
    
    // Small delay before starting to type
    const timeout = setTimeout(typeNextChar, 100);
    return () => clearTimeout(timeout);
  }, [fullMessage]);

  // Get bubble border color based on state
  const getBubbleStyle = () => {
    switch (state) {
      case "success":
        return "border-green-500 shadow-green-100 bg-gradient-to-br from-white to-green-50";
      case "error":
        return "border-red-400 shadow-red-100 bg-gradient-to-br from-white to-red-50";
      case "working":
        return "border-ai shadow-blue-100 bg-gradient-to-br from-white to-blue-50";
      default:
        return "border-kon bg-white";
    }
  };

  // Get tail color based on state
  const getTailColor = () => {
    switch (state) {
      case "success": return "border-r-green-500";
      case "error": return "border-r-red-400";
      case "working": return "border-r-ai";
      default: return "border-r-kon";
    }
  };

  // Get name tag color
  const getNameColor = () => {
    switch (state) {
      case "success": return "text-green-500";
      case "error": return "text-red-400";
      case "working": return "text-ai";
      default: return "text-gray-400";
    }
  };

  return (
    <div
      className={`flex items-end gap-3 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Mascot Image with Animation */}
      <div 
        className={`relative w-20 h-20 flex-shrink-0 transition-transform duration-150 ${
          isTransitioning ? "scale-95 opacity-80" : "scale-100 opacity-100"
        } ${stateAnimations[state]}`}
      >
        {/* Glow effect behind mascot */}
        <GlowEffect state={state} />
        
        {/* Success particles */}
        {state === "success" && <SuccessParticles />}
        
        {/* Error sweat drop */}
        {state === "error" && <ErrorSweat />}
        
        {/* Working spinner ring */}
        {state === "working" && (
          <>
            <div className="absolute inset-0 border-2 border-kon/20 border-t-kon rounded-full animate-spin-slow"></div>
            <WorkingDots />
          </>
        )}
        
        {/* Mascot Image */}
        <div className="relative w-full h-full">
          <Image
            src={mascotImages[state]}
            alt="アイちゃん"
            fill
            className={`object-contain transition-all duration-300 drop-shadow-lg ${
              state === "success" ? "scale-105 brightness-105" : 
              state === "error" ? "brightness-95" : ""
            }`}
            priority={state === "idle"}
          />
        </div>
        
        {/* Idle breathing shadow */}
        {state === "idle" && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 rounded-full blur-sm animate-float" 
            style={{ animationDirection: "reverse" }}
          />
        )}
      </div>

      {/* Speech Bubble with enhanced styling */}
      <div 
        className={`relative border-2 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-md max-w-xs transition-all duration-300 ${getBubbleStyle()}`}
      >
        {/* Bubble tail */}
        <div 
          className={`absolute -left-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-b-8 border-b-transparent transition-colors duration-300 ${getTailColor()}`}
        ></div>
        <div className="absolute -left-[5px] bottom-[9px] w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-white border-b-[6px] border-b-transparent"></div>
        
        {/* State icon indicator */}
        <div className="absolute -top-2 -right-2">
          {state === "success" && (
            <span className="block w-6 h-6 bg-green-500 rounded-full text-white text-xs flex items-center justify-center shadow-md animate-bounce">✓</span>
          )}
          {state === "error" && (
            <span className="block w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-md">!</span>
          )}
          {state === "working" && (
            <span className="block w-6 h-6 bg-ai rounded-full text-white text-xs flex items-center justify-center shadow-md animate-spin-slow">⟳</span>
          )}
        </div>
        
        {/* Message with typing effect */}
        <p className="text-sm text-sumi leading-relaxed min-h-[1.5em]">
          {displayedMessage}
          {isTyping && <span className="animate-blink text-kon">|</span>}
          {state === "working" && !isTyping && <TypingIndicator />}
        </p>
        
        {/* Name tag with state-based color */}
        <span className={`text-xs mt-1 block font-medium transition-colors duration-300 ${getNameColor()}`}>
          — アイちゃん 💙
        </span>
      </div>
    </div>
  );
}
