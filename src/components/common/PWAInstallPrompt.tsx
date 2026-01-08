"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("yamada_pwa_dismissed");
    if (dismissed) return;

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // For iOS, show after delay
    if (ios) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    // For Android/Desktop, listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS instructions
      alert("画面下の共有ボタン（□↑）→「ホーム画面に追加」をタップしてください");
      handleDismiss();
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("yamada_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-kon to-ai text-white rounded-2xl shadow-2xl p-4 max-w-xs">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white text-gray-600 rounded-full hover:bg-gray-100 text-sm font-bold"
        >
          ✕
        </button>
        <div className="flex items-start gap-3">
          <div className="text-3xl">📱</div>
          <div>
            <p className="font-bold text-sm mb-1">アプリとして追加</p>
            <p className="text-xs text-white/80 mb-3">
              ホーム画面からワンタップでアクセス！
            </p>
            <button
              onClick={handleInstall}
              className="w-full py-2 bg-white text-kon rounded-lg text-sm font-bold hover:bg-sakura hover:text-white transition-colors"
            >
              {isIOS ? "追加方法を見る" : "インストール"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
