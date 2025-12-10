import { Metadata } from "next";
import ImageFormatClient from "./client";

const faq = [
  {
    question: "対応している形式は何ですか？",
    answer: "PNG、JPG/JPEG、WebP、GIF、BMP形式に対応しています。",
  },
  {
    question: "画質は劣化しますか？",
    answer: "JPGやWebPに変換する場合は品質設定で調整できます。PNGは可逆圧縮なので劣化しません。",
  },
  {
    question: "ファイルサイズは変わりますか？",
    answer: "はい。一般的にWebPが最も小さく、PNGが最も大きくなります。用途に応じて選択してください。",
  },
  {
    question: "複数ファイルを一度に変換できますか？",
    answer: "はい。最大20ファイルまで同時に変換できます。",
  },
];

export const metadata: Metadata = {
  title: "画像形式変換 | 山田ツール - PNG/JPG/WebP変換",
  description: "PNG、JPG、WebP、GIF、BMP形式を相互変換。品質調整可能。複数ファイル対応。登録不要、完全無料。",
  keywords: ["画像変換", "PNG変換", "JPG変換", "WebP変換", "画像形式変換", "無料"],
  openGraph: {
    title: "画像形式変換 | 山田ツール",
    description: "PNG、JPG、WebP形式を相互変換。完全無料。",
    url: "https://yamada-tools.jp/image/format-convert",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "画像形式変換 | 山田ツール",
    description: "PNG、JPG、WebP形式を相互変換。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/image/format-convert",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "画像形式変換",
    "description": "画像形式を変換するオンラインツール",
    "url": "https://yamada-tools.jp/image/format-convert",
    "applicationCategory": "MultimediaApplication",
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

export default function ImageFormatPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImageFormatClient faq={faq} />
    </>
  );
}
