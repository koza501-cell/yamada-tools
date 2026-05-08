import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ImageFormatClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("convert-image")!;

const faq = [
  { question: "透過は保持されますか？", answer: "PNGやWebPへの変換では透過が保持されます。JPGは透過非対応です。" },
  { question: "WebPとは何ですか？", answer: "Googleが開発した軽量な画像形式で、Webサイトでの使用に最適です。" },
  { question: "画質は選べますか？", answer: "はい、JPGやWebPへの変換時に画質を指定できます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像形式変換｜JPG/PNG/WebP相互変換",
  tool,
  longDescription: "JPG、PNG、WebP、GIFなど画像形式を相互変換。Web用にWebPへ、印刷用にJPGへなど、用途に合わせて変換できます。",
  keywords: ['画像 形式変換', 'JPG PNG 変換', 'WebP 変換', '画像 コンバーター'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageFormatClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
