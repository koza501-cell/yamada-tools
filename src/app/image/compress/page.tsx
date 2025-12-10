import { Metadata } from "next";
import ImageCompressClient from "./client";

const faq = [
  {
    question: "対応している画像形式は？",
    answer: "JPEG、PNG、WebP形式に対応しています。GIFは静止画として処理されます。",
  },
  {
    question: "どのくらい圧縮できますか？",
    answer: "画像の内容によりますが、通常50〜80%のファイルサイズ削減が可能です。",
  },
  {
    question: "画質は劣化しますか？",
    answer: "品質設定を調整できます。高品質設定では見た目の劣化はほとんどありません。",
  },
  {
    question: "画像データは保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、サーバーに画像データは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "画像圧縮 | 山田ツール - 無料オンライン画像ファイルサイズ削減",
  description: "画像ファイルサイズを簡単に圧縮。品質を維持しながら最大80%削減。ブラウザ内処理で安全。登録不要、完全無料。",
  keywords: ["画像圧縮", "画像軽量化", "ファイルサイズ削減", "JPEG圧縮", "PNG圧縮", "無料"],
  openGraph: {
    title: "画像圧縮 | 山田ツール",
    description: "画像ファイルサイズを簡単に圧縮。完全無料。",
    url: "https://yamada-tools.jp/image/compress",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "画像圧縮 | 山田ツール",
    description: "画像ファイルサイズを簡単に圧縮。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/image/compress",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "画像圧縮",
    "description": "画像ファイルサイズを圧縮するオンラインツール",
    "url": "https://yamada-tools.jp/image/compress",
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

export default function ImageCompressPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImageCompressClient faq={faq} />
    </>
  );
}
