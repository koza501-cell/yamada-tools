import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import OcrClient from "./client";

const tool = pdfTools.find((t) => t.id === "ocr")!;

const faq = [
  {
    question: "PDF OCRは無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "日本語のOCRに対応していますか？",
    answer: "はい。日本語と英語の両方に対応しています。",
  },
  {
    question: "手書き文字も認識できますか？",
    answer: "印刷された文字が対象です。手書きは認識精度が下がります。",
  },
  {
    question: "OCR後のPDFはテキスト検索できますか？",
    answer: "はい。抽出されたテキストを含むPDFが作成されます。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "スキャンしたPDFからテキストを抽出する無料オンラインOCRツール。日本語・英語対応。画像PDFを検索可能なPDFに変換。日本国内サーバーで安全処理。",
  keywords: [
    "PDF OCR",
    "PDF テキスト抽出",
    "PDF 文字認識",
    "スキャン PDF テキスト",
    "画像 PDF テキスト化",
    "日本語 OCR",
    "無料 PDF OCR",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function OcrPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <OcrClient faq={faq} />
    </>
  );
}
