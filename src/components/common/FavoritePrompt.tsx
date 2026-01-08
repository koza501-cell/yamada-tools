"use client";

import { useState, useEffect } from "react";

export default function FavoritePrompt() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has used a tool and hasn't dismissed the prompt
    const toolUseCount = parseInt(localStorage.getItem("yamada_tool_count") || "0");
    const promptDismissed = localStorage.getItem("yamada_favorite_dismissed");
    
    if (toolUseCount >= 1 && !promptDismissed) {
      // Show after 3 seconds
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("yamada_favorite_dismissed", "true");
  };

  const handleAddFavorite = () => {
    // Show instructions based on browser
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    
    let instruction = "";
    if (isIOS) {
      instruction = "画面下の共有ボタン → 「ホーム画面に追加」をタップしてください";
    } else if (isMac) {
      instruction = "⌘+D でブックマークに追加できます";
    } else {
      instruction = "Ctrl+D でブックマークに追加できます";
    }
    
    alert(instruction);
    handleDismiss();
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce-slow">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 text-sm"
        >
          ✕
        </button>
        <div className="flex items-start gap-3">
          <div className="text-3xl">⭐</div>
          <div>
            <p className="font-bold text-kon text-sm mb-1">お気に入りに追加</p>
            <p className="text-xs text-gray-600 mb-3">
              次回からすぐアクセスできます！
            </p>
            <button
              onClick={handleAddFavorite}
              className="w-full py-2 bg-kon text-white rounded-lg text-sm font-bold hover:bg-ai transition-colors"
            >
              追加する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
