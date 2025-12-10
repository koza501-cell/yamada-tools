import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PdfToExcelClient from "./client";

const tool = pdfTools.find((t) => t.id === "pdf-to-excel")!;

const faq = [
  {
    question: "PDFからExcel変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "表データはきれいに抽出されますか？",
    answer: "表形式のPDFであれば、行・列を維持して抽出します。",
  },
  {
    question: "複数ページの表も対応していますか？",
    answer: "はい。すべてのページから表データを抽出します。",
  },
  {
    question: "出力形式は？",
    answer: "Microsoft Excel形式（.xlsx）で出力されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFの表データをExcelに変換する無料オンラインツール。表形式を自動認識してExcelに抽出。データ分析や再利用に最適。日本国内サーバーで安全処理。",
  keywords: [
    "PDF Excel 変換",
    "PDF 表 抽出",
    "PDF xlsx 変換",
    "PDF to Excel",
    "PDF データ抽出",
    "PDF 表データ",
    "無料 PDFExcel変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PdfToExcelPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PdfToExcelClient faq={faq} />
    </>
  );
}
