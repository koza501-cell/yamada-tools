import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | 山田ツール",
  description: "山田ツールへのお問い合わせはこちら。",
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-kon mb-6">お問い合わせ</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-gray-700">
        <p className="mb-3">お問い合わせフォームは準備中です。</p>
        <p>
          お急ぎの場合は{" "}
          <a
            href="mailto:support@yamadatrade.com"
            className="text-kon underline hover:text-ai"
          >
            support@yamadatrade.com
          </a>{" "}
          までご連絡ください。
        </p>
      </div>
    </main>
  );
}
