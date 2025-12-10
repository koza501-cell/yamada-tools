import { Metadata } from "next";
import QRCodeClient from "./client";

const faq = [
  {
    question: "どんな情報をQRコードにできますか？",
    answer: "URL、テキスト、電話番号、メールアドレス、WiFi接続情報など、様々な情報をQRコードにできます。",
  },
  {
    question: "生成したQRコードは商用利用できますか？",
    answer: "はい、生成したQRコードは自由にご利用いただけます。名刺、チラシ、ポスターなどにお使いください。",
  },
  {
    question: "QRコードのサイズは変更できますか？",
    answer: "はい、小・中・大の3サイズから選択できます。印刷用途に応じてお選びください。",
  },
  {
    question: "データは保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、サーバーにデータは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "QRコード作成 | 山田ツール - 無料オンラインQRコード生成",
  description: "URL、テキスト、WiFi情報などからQRコードを無料で作成。PNG/SVG形式でダウンロード可能。ブラウザ内処理で安全。登録不要。",
  keywords: ["QRコード作成", "QRコード生成", "無料", "オンライン", "URL QRコード", "WiFi QRコード"],
  openGraph: {
    title: "QRコード作成 | 山田ツール",
    description: "URLやテキストからQRコードを無料で作成。完全無料。",
    url: "https://yamada-tools.jp/image/qr-code",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QRコード作成 | 山田ツール",
    description: "QRコードを無料で作成。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/image/qr-code",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QRコード作成",
    "description": "URL、テキスト、WiFi情報などからQRコードを作成するオンラインツール",
    "url": "https://yamada-tools.jp/image/qr-code",
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

export default function QRCodePage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <QRCodeClient faq={faq} />
    </>
  );
}
