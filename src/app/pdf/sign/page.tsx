import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SignClient from "./client";

const tool = pdfTools.find((t) => t.id === "sign")!;

const faq = [
  {
    question: "PDF署名は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "電子署名と同じですか？",
    answer: "テキストベースの署名です。法的効力のある電子署名とは異なります。",
  },
  {
    question: "署名の位置は選べますか？",
    answer: "最終ページの右下に配置されます。",
  },
  {
    question: "署名に日付も入りますか？",
    answer: "署名テキストに日付を含めることができます。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFに署名を追加する無料オンラインツール。テキストベースの署名を追加。契約書や申請書への署名に。シンプルで簡単。日本国内サーバーで安全処理。",
  keywords: [
    "PDF 署名",
    "PDF サイン",
    "PDF sign",
    "PDF 電子署名",
    "PDF 署名追加",
    "無料 PDF署名",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function SignPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SignClient faq={faq} />
    </>
  );
}
