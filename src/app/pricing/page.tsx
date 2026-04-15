import type { Metadata } from "next";
import PricingClient from "@/components/PricingClient";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "山田ツールの料金プラン。無料で全140+ツールをご利用いただけます。PROプランで無制限・広告なしに。法人向けTEAMプラン、エンタープライズプランも。",
  alternates: {
    canonical: 'https://yamada-tools.jp/pricing',
  },
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "無料プランに期限はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ、無料プランは永久にご利用いただけます。1日5回までの利用制限がありますが、基本的な機能はすべてお使いいただけます。" },
    },
    {
      "@type": "Question",
      name: "プランの変更やキャンセルはいつでもできますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい、いつでもプランの変更・キャンセルが可能です。年払いの場合、残りの期間に応じて日割り計算で返金いたします。" },
    },
    {
      "@type": "Question",
      name: "請求書払いは可能ですか？",
      acceptedAnswer: { "@type": "Answer", text: "TEAMプラン以上で請求書払い（NP掛け払い）に対応しています。月末締め翌月末払いなど、貴社の経理フローに合わせた対応が可能です。" },
    },
    {
      "@type": "Question",
      name: "セキュリティ対策について教えてください。",
      acceptedAnswer: { "@type": "Answer", text: "すべてのデータは処理完了後に自動削除されます。ファイルはサーバーに保存されず、SSL/TLS暗号化通信で保護されています。" },
    },
    {
      "@type": "Question",
      name: "チームプランの最低利用人数はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "チームプランは5ユーザーからご利用いただけます。ユーザー数の追加・削減はいつでも可能です。" },
    },
    {
      "@type": "Question",
      name: "サポートはどのように受けられますか？",
      acceptedAnswer: { "@type": "Answer", text: "プランによって異なります。FREE: メールサポート（support@yamada-tools.jp）、PRO: FAQチャットボット＋メールサポート、TEAM: AIチャットボット（24時間対応）＋優先メールサポート、ENTERPRISE: 専任カスタマーサクセス担当。" },
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient />
    </>
  );
}
