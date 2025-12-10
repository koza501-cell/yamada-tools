import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import WatermarkClient from "./client";

const tool = pdfTools.find((t) => t.id === "watermark")!;

const faq = [
  {
    question: "透かし追加は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "透かしのテキストは自由に設定できますか？",
    answer: "はい。任意のテキストを設定できます。",
  },
  {
    question: "透かしの透明度は調整できますか？",
    answer: "適切な透明度で自動的に設定されます。",
  },
  {
    question: "画像の透かしは追加できますか？",
    answer: "現在はテキストのみ対応しています。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFに透かし（ウォーターマーク）を追加する無料オンラインツール。社外秘、コピー禁止などのテキストを全ページに。著作権保護に。日本国内サーバーで安全処理。",
  keywords: [
    "PDF 透かし",
    "PDF ウォーターマーク",
    "PDF watermark",
    "PDF 社外秘",
    "PDF コピー禁止",
    "無料 PDF透かし",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function WatermarkPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <WatermarkClient faq={faq} />
    </>
  );
}
