import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import UnlockClient from "./client";

const tool = pdfTools.find((t) => t.id === "unlock")!;

const faq = [
  {
    question: "PDFパスワード解除は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "パスワードを忘れたPDFも解除できますか？",
    answer: "パスワードを入力する必要があります。パスワードがわからない場合は解除できません。",
  },
  {
    question: "解除後のPDFはどうなりますか？",
    answer: "パスワードなしで開ける新しいPDFが作成されます。",
  },
  {
    question: "違法ではないですか？",
    answer: "自分が所有するPDFのパスワード解除は問題ありません。他人のPDFを無断で解除することは避けてください。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFのパスワード保護を解除する無料オンラインツール。既知のパスワードを入力して保護を解除。パスワードなしPDFを作成。日本国内サーバーで安全処理。",
  keywords: [
    "PDF パスワード解除",
    "PDF ロック解除",
    "PDF 保護解除",
    "PDF unlock",
    "PDF パスワード削除",
    "無料 PDFパスワード解除",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function UnlockPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <UnlockClient faq={faq} />
    </>
  );
}
