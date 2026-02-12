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
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 0 ? "scale-110 opacity-100" : "scale-100 opacity-60")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl " + (step === 0 ? "bg-white text-kon" : "bg-white/20 text-white")}>📤</div>
        <p className="mt-2 text-sm font-medium">アップロード</p>
      </div>
      <div className={"text-2xl transition-all duration-500 " + (step === 0 ? "text-sakura animate-pulse" : "text-white/40")}>→</div>
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 1 ? "scale-110 opacity-100" : "scale-100 opacity-60")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl " + (step === 1 ? "bg-white text-kon" : "bg-white/20 text-white")}><span className={step === 1 ? "animate-spin" : ""}>⚙️</span></div>
        <p className="mt-2 text-sm font-medium">安全処理</p>
        <p className="text-xs text-gray-300">🇯🇵 国内サーバー</p>
      </div>
      <div className={"text-2xl transition-all duration-500 " + (step === 1 ? "text-sakura animate-pulse" : "text-white/40")}>→</div>
      <div className={"flex flex-col items-center transition-all duration-500 " + (step === 2 ? "scale-110 opacity-100" : "scale-100 opacity-60")}>
        <div className={"w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl " + (step === 2 ? "bg-sakura text-white" : "bg-white/20 text-white")}>✅</div>
        <p className="mt-2 text-sm font-medium">ダウンロード</p>
      </div>
    </div>
  );
}
