import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PdfToImageClient from "./client";

const tool = pdfTools.find((t) => t.id === "pdf-to-image")!;

const faq = [
  {
    question: "PDFから画像への変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "出力される画像形式は？",
    answer: "PNG形式で高品質な画像として出力されます。",
  },
  {
    question: "複数ページのPDFはどうなりますか？",
    answer: "各ページが個別の画像ファイルとしてZIPでダウンロードできます。",
  },
  {
    question: "画像の解像度は選べますか？",
    answer: "標準で高解像度（300DPI相当）で出力されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFを画像に変換する無料オンラインツール。各ページをPNG画像として出力。プレゼン資料やSNS投稿用に最適。高解像度で鮮明な画像を生成。日本国内サーバーで安全処理。",
  keywords: [
    "PDF 画像 変換",
    "PDF PNG 変換",
    "PDF JPG 変換",
    "PDF to image",
    "PDF 画像化",
    "PDF 写真",
    "無料 PDF画像変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PdfToImagePage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PdfToImageClient faq={faq} />
    </>
  );
}
