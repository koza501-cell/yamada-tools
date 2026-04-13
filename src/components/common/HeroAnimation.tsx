"use client";
import { useEffect, useState } from "react";
export default function HeroAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => { setStep((prev) => (prev + 1) % 3); }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-6">
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 0 ? "scale-110 opacity-100" : "scale-100 opacity-50")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-2 " + (step === 0 ? "bg-kon text-white border-kon shadow-lg" : "bg-gray-100 border-gray-200 text-gray-500")}>📤</div>
        <p className="mt-2 text-sm font-medium text-gray-700">アップロード</p>
      </div>
      <div className={"text-2xl transition-all duration-500 " + (step === 0 ? "text-sakura animate-pulse" : "text-gray-300")}>→</div>
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 1 ? "scale-110 opacity-100" : "scale-100 opacity-50")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-2 " + (step === 1 ? "bg-kon text-white border-kon shadow-lg" : "bg-gray-100 border-gray-200 text-gray-500")}><span className={step === 1 ? "animate-spin" : ""}>⚙️</span></div>
        <p className="mt-2 text-sm font-medium text-gray-700">安全処理</p>
        <p className="text-xs text-gray-400">🇯🇵 国内サーバー</p>
      </div>
      <div className={"text-2xl transition-all duration-500 " + (step === 1 ? "text-sakura animate-pulse" : "text-gray-300")}>→</div>
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 2 ? "scale-110 opacity-100" : "scale-100 opacity-50")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-2 " + (step === 2 ? "bg-green-500 text-white border-green-500 shadow-lg" : "bg-gray-100 border-gray-200 text-gray-500")}>✅</div>
        <p className="mt-2 text-sm font-medium text-gray-700">ダウンロード</p>
      </div>
    </div>
  );
}
