import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PdfToPptClient from "./client";

const tool = pdfTools.find((t) => t.id === "pdf-to-ppt")!;

const faq = [
  {
    question: "PDFからPowerPoint変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "編集可能なPowerPointになりますか？",
    answer: "各ページが画像としてスライドに配置されます。",
  },
  {
    question: "テキストは編集できますか？",
    answer: "画像として配置されるため、テキスト編集には別途OCRが必要です。",
  },
  {
    question: "出力形式は？",
    answer: "Microsoft PowerPoint形式（.pptx）で出力されます。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFをPowerPointに変換する無料オンラインツール。各ページをスライドに変換。プレゼン資料の再利用に。日本国内サーバーで安全処理。",
  keywords: [
    "PDF PowerPoint 変換",
    "PDF pptx 変換",
    "PDF パワポ",
    "PDF to PowerPoint",
    "PDF スライド",
    "無料 PDFPowerPoint変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PdfToPptPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PdfToPptClient faq={faq} />
    </>
  );
}
