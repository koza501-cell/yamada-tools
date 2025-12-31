import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("image-to-pdf")!;

const faq = [
  { question: "何枚まで変換できますか？", answer: "最大50枚まで一度に変換できます。" },
  { question: "画像の順番は変えられますか？", answer: "はい、ドラッグ&ドロップで自由に並び替えできます。" },
  { question: "画像サイズは自動調整されますか？", answer: "はい、A4サイズに収まるよう自動調整されます。" },
];

const seoContent = {
  intro: "JPG、PNG、WebPなどの画像をPDFに変換。複数画像を1つのPDFにまとめることもできます。写真のPDF化やスキャン画像の整理に便利です。",
  useCases: [
    { title: "📷 写真のPDF化", desc: "撮影した写真をPDFで共有" },
    { title: "📄 スキャン整理", desc: "バラバラの画像を1つのPDFに" },
    { title: "📧 メール添付", desc: "複数画像をPDFにまとめて送信" },
    { title: "📁 資料作成", desc: "画像資料をPDF形式で保存" },
  ],
  tips: "ドラッグ&ドロップで画像の順序を変更できます。A4サイズに自動調整されます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "JPG、PNG、WebPなどの画像をPDFに変換。複数画像を1つのPDFにまとめることもできます。写真のPDF化やスキャン画像の整理に便利です。",
  keywords: ['画像 PDF変換', 'JPG PDF', 'PNG PDF', '写真 PDF', '画像をPDFに'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
