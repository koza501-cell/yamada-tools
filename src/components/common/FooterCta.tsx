"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button, { buttonCls } from "@/components/ui/Button";
import Emoji from "@/components/ui/Emoji";

export default function FooterCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const plan = localStorage.getItem("yamada_user_plan");
    if (!plan || plan === "free") setShow(true);
  }, []);

  if (!show) return null;

  return (
    <section className="py-section bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-t border-gray-200 dark:border-gray-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <Emoji symbol="🚀" size="lg" label="PRO" /> もっと便利に使いたい？
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
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
          <Link href="/pricing" className={buttonCls('secondary', 'lg')}>
            料金プランを見る →
          </Link>
        </div>
      </div>
    </section>
  );
}
