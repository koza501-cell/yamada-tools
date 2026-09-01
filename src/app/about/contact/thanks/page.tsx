import { Suspense } from "react";
import type { Metadata } from "next";
import ThanksContent from "./ThanksContent";

export const metadata: Metadata = {
  title: "お問い合わせを受け付けました",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">✅</div>
      <h1 className="text-2xl font-bold text-kon mb-4">お問い合わせを受け付けました</h1>
      <p className="text-gray-600 mb-2">
        ご連絡いただきありがとうございます。
      </p>
      <p className="text-gray-600 mb-8">
        通常 2〜3 営業日以内にご返信いたします。
      </p>
      <Suspense fallback={null}>
        <ThanksContent />
      </Suspense>
    </main>
  );
}
