"use client";
import { useEffect, useState } from "react";
import Emoji from "@/components/ui/Emoji";

const STEPS = [
  { icon: "✏️", label: "情報を入力",  sub: "住所・金額・ファイルなど", subIcon: null,  color: "bg-kon border-kon" },
  { icon: "⚡",  label: "即時処理",    sub: "国内サーバー",             subIcon: "🇯🇵", color: "bg-kon border-kon" },
  { icon: "✅", label: "結果を確認",  sub: "無料・登録不要",           subIcon: null,  color: "bg-green-500 border-green-500" },
];

export default function HeroAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setStep(p => (p + 1) % 3), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-4">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center gap-4 md:gap-8">
          <div className={"flex flex-col items-center transition-all duration-500 " + (step === i ? "scale-110 opacity-100" : "scale-100 opacity-50")}>
            <div className={"w-14 h-14 rounded-2xl flex items-center justify-center border-2 " + (step === i ? s.color + " text-white shadow-lg" : "bg-gray-100 border-gray-200 text-gray-500")}>
              <Emoji symbol={s.icon} size="xl" label={s.label} />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{s.label}</p>
            <p className="text-xs text-gray-500">
              {s.subIcon && <Emoji symbol={s.subIcon} size="sm" label="" />}
              {s.sub}
            </p>
          </div>
          {i < 2 && (
            <div className={"text-2xl transition-all duration-500 " + (step === i ? "text-[#E91E63] animate-pulse" : "text-gray-300")}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}
