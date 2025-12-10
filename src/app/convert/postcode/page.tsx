import { Metadata } from "next";
import PostcodeClient from "./client";

const faq = [
  {
    question: "どのような郵便番号に対応していますか？",
    answer: "日本全国の郵便番号（7桁）に対応しています。ハイフンあり・なしどちらでも検索可能です。",
  },
  {
    question: "7桁入力で自動検索されますか？",
    answer: "はい。郵便番号を7桁入力すると自動的に検索が開始されます。",
  },
  {
    question: "データは最新ですか？",
    answer: "郵便局が公開している郵便番号データを使用しています。定期的に更新されています。",
  },
  {
    question: "検索結果は保存されますか？",
    answer: "いいえ。検索履歴はブラウザを閉じると消えます。サーバーにデータは保存されません。",
  },
];

export const metadata: Metadata = {
  title: "郵便番号検索 | 山田ツール - 無料オンライン住所検索",
  description: "郵便番号から住所を検索、住所から郵便番号を逆引き。全国対応。登録不要、完全無料。",
  keywords: ["郵便番号検索", "住所検索", "郵便番号変換", "〒", "無料", "オンライン"],
  openGraph: {
    title: "郵便番号検索 | 山田ツール",
    description: "郵便番号↔住所を瞬時に検索。完全無料。",
    url: "https://yamada-tools.jp/convert/postcode",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "郵便番号検索 | 山田ツール",
    description: "郵便番号↔住所を瞬時に検索。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/postcode",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "郵便番号検索",
    "description": "郵便番号から住所を検索、住所から郵便番号を逆引きするオンラインツール",
    "url": "https://yamada-tools.jp/convert/postcode",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }
];

export default function PostcodePage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PostcodeClient faq={faq} />
    </>
  );
}
