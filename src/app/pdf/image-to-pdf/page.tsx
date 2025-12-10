import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ImageToPdfClient from "./client";

const tool = pdfTools.find((t) => t.id === "image-to-pdf")!;

const faq = [
  {
    question: "画像からPDF変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "対応している画像形式は？",
    answer: "JPG、JPEG、PNG、GIF、WebPに対応しています。",
  },
  {
    question: "何枚まで一度に変換できますか？",
    answer: "最大20枚の画像を1つのPDFにまとめることができます。",
  },
  {
    question: "画像の順番は変えられますか？",
    answer: "アップロード後にドラッグ&ドロップで順番を変更できます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "複数の画像をPDFに変換する無料オンラインツール。JPG・PNG・GIF・WebP対応。最大20枚を1つのPDFに結合。写真やスキャン画像をPDF化。日本国内サーバーで安全処理。",
  keywords: [
    "画像 PDF 変換",
    "JPG PDF 変換",
    "PNG PDF 変換",
    "写真 PDF",
    "image to PDF",
    "画像 PDF化",
    "無料 画像PDF変換",
    "スキャン PDF",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ImageToPdfPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImageToPdfClient faq={faq} />
    </>
  );
}
