"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // For now, open Google Form in new tab with email prefilled
    const formUrl = `https://forms.gle/2mmoGqLif1Cqe5vL6`;
    window.open(formUrl, "_blank");
    
    setStatus("success");
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-kon to-ai rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📬</span>
        <h3 className="font-bold text-lg">新機能をお知らせ</h3>
      </div>
      <p className="text-sm text-white/80 mb-4">
        新しいツールや便利な使い方をメールでお届けします
      </p>
      {status === "success" ? (
        <p className="text-sakura font-bold">✓ フォームを開きました！ご登録ありがとうございます</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-sm"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-sakura hover:bg-sakura/80 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "登録"}
          </button>
        </form>
      )}
      <p className="text-xs text-white/60 mt-2">
        ※ 迷惑メールは一切送りません。いつでも解除できます。
      </p>
    </div>
  );
}
