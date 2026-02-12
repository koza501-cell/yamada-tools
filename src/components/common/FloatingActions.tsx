"use client";
import { useState, useEffect } from "react";
export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => { setShowBackToTop(window.pageYOffset > 300); };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleOpenForm = () => { window.open("https://forms.gle/2mmoGqLif1Cqe5vL6", "_blank"); setIsFeedbackOpen(false); };
  return (<><div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">{showBackToTop && (<button onClick={scrollToTop} className="bg-sakura text-kon p-3 rounded-full min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl hover:scale-105 transition-all" aria-label="ページトップへ戻る"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>)}<button onClick={() => setIsFeedbackOpen(true)} className="bg-kon text-white p-3 rounded-full min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl hover:scale-105 hover:bg-ai transition-all" aria-label="フィードバックを送る"><span className="text-xl">💬</span></button></div>{isFeedbackOpen && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsFeedbackOpen(false)}><div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="bg-gradient-to-r from-kon to-ai text-white p-6 rounded-t-2xl"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-3xl">💬</span><div><h2 className="text-xl font-bold">フィードバック</h2><p className="text-sm text-white/80">ご意見をお聞かせください</p></div></div><button onClick={() => setIsFeedbackOpen(false)} className="text-white hover:text-white/80" aria-label="閉じる"><span className="text-2xl">✕</span></button></div></div><div className="p-6 space-y-5"><div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100"><p className="text-sm leading-relaxed text-gray-700">ご意見をお待ちしています！バグ報告、改善提案など、どんな小さなことでも構いません。</p></div><button onClick={handleOpenForm} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"><span>フォームを開く →</span></button></div></div></div>)}</>);
}
