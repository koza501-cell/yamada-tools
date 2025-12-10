import { Metadata } from "next";
import ImageRotateClient from "./client";

const faq = [
  {
    question: "対応している形式は何ですか？",
    answer: "PNG、JPG/JPEG、WebP、GIF、BMP形式に対応しています。",
  },
  {
    question: "画質は劣化しますか？",
    answer: "PNG形式で出力すれば劣化しません。JPG形式の場合は若干の劣化が発生する可能性があります。",
  },
  {
    question: "複数ファイルを一度に回転できますか？",
    answer: "はい。最大20ファイルまで同時に回転できます。",
  },
];

export const metadata: Metadata = {
  title: "画像回転 | 山田ツール - 無料オンライン画像回転ツール",
  description: "画像を90度・180度・270度回転。左右反転も可能。複数ファイル対応。登録不要、完全無料。",
  keywords: ["画像回転", "写真回転", "画像反転", "90度回転", "無料"],
  openGraph: {
    title: "画像回転 | 山田ツール",
    description: "画像を90度・180度・270度回転。完全無料。",
    url: "https://yamada-tools.jp/image/rotate",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/image/rotate",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "画像回転",
  "description": "画像を回転・反転するオンラインツール",
  "url": "https://yamada-tools.jp/image/rotate",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "JPY"
  }
};

export default function ImageRotatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageRotateClient faq={faq} />
    </>
  );
}
