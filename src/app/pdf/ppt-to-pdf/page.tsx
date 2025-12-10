import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PptToPdfClient from "./client";

const tool = pdfTools.find((t) => t.id === "ppt-to-pdf")!;

const faq = [
  {
    question: "PowerPointからPDF変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "対応しているPowerPointの形式は？",
    answer: ".ppt と .pptx の両方に対応しています。",
  },
  {
    question: "アニメーションはどうなりますか？",
    answer: "静止画として各スライドがPDFページになります。",
  },
  {
    question: "ノートも含まれますか？",
    answer: "標準ではスライドのみです。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PowerPointファイルをPDFに変換する無料オンラインツール。ppt・pptx対応。プレゼン資料を配布用PDFに。レイアウト維持。日本国内サーバーで安全処理。",
  keywords: [
    "PowerPoint PDF 変換",
    "pptx PDF 変換",
    "パワポ PDF",
    "PowerPoint to PDF",
    "ppt PDF",
    "プレゼン PDF",
    "無料 PowerPointPDF変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PptToPdfPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PptToPdfClient faq={faq} />
    </>
  );
}
