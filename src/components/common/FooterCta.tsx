"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button, { buttonCls } from "@/components/ui/Button";
import Emoji from "@/components/ui/Emoji";

const CATEGORIES = [
  { icon: "📄", label: "PDF編集", href: "/pdf/compress" },
  { icon: "📝", label: "書類作成", href: "/generator/envelope-print" },
  { icon: "🖼️", label: "画像処理", href: "/image/compress" },
  { icon: "💴", label: "財務計算", href: "/finance/nisa-simulator" },
  { icon: "🏢", label: "法人検索", href: "/business/houjin-search" },
  { icon: "🏠", label: "不動産情報", href: "/realestate/hazard-checker" },
  { icon: "🔤", label: "文字変換", href: "/convert/furigana" },
  { icon: "⚙️", label: "ユーティリティ", href: "/utility/age-calculator" },
];

export default function FooterCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const plan = localStorage.getItem("yamada_user_plan");
    if (!plan || plan === "free") setShow(true);
  }, []);
  if (!show) return null;
  return (
    <section className="py-section bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Category grid */}
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          他のツールを探す
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-kon dark:hover:border-ai hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-kon dark:group-hover:text-ai leading-tight text-center">{cat.label}</span>
            </Link>
          ))}
        </div>

        {/* PRO upsell */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            <Emoji symbol="🚀" size="lg" label="PRO" /> もっと便利に使いたい？
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            PROプランで無制限に利用、広告なし、優先サポート
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              無料で始める
            </Button>
            <Link href="/pricing" className={buttonCls("secondary", "lg")}>
              料金プランを見る →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
