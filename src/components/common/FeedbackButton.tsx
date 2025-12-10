"use client";

import { useState } from "react";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenForm = () => {
    // Open Google Form in new tab
    window.open('https://forms.gle/2mmoGqLif1Cqe5vL6', '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button - Kon Theme */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-kon text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:bg-ai transition-all duration-200 flex items-center gap-2 font-bold"
        aria-label="フィードバックを送る"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline">フィードバック</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-kon to-ai text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  <div>
                    <h2 className="text-xl font-bold">フィードバック</h2>
                    <p className="text-sm text-white/80">ご意見をお聞かせください</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="閉じる"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Amazing Description */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                <p className="text-sm leading-relaxed text-gray-700 mb-3">
                  <span className="font-bold text-kon">現在ベータ版公開中！</span>みなさまと一緒に、より良いツールを作っていきたいと考えています。
                </p>
                <p className="text-sm leading-relaxed text-gray-700 mb-3">
                  バグを見つけた、もっとこうしてほしい、使いやすかった—<span className="font-medium">良いことも悪いことも、どんな小さなことでも構いません。</span>率直なご意見をお聞かせください。
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  すべてのフィードバックを真剣に受け止め、改善に活かします。<span className="font-medium text-kon">あなたの一言が、次のアップデートに繋がるかもしれません。</span>
                </p>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">🐛</span>
                  <div>
                    <p className="font-medium text-gray-900">バグ報告</p>
                    <p className="text-sm text-gray-500">エラーや不具合を報告</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium text-gray-900">改善提案</p>
                    <p className="text-sm text-gray-500">機能追加のご提案</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-gray-900">その他のご意見</p>
                    <p className="text-sm text-gray-500">一般的なフィードバック</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleOpenForm}
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="text-lg">📝</span>
                <span>フォームを開く</span>
                <span>→</span>
              </button>

              <p className="text-xs text-gray-400 text-center">
                Googleフォームが新しいタブで開きます
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
