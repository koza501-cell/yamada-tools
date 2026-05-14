import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("image-to-pdf")!;

const faq = [
  { question: "何枚まで変換できますか？", answer: "最大50枚まで一度に変換できます。" },
  { question: "画像の順番は変えられますか？", answer: "はい、ドラッグ&ドロップで自由に並び替えできます。" },
  { question: "画像サイズは自動調整されますか？", answer: "はい、A4サイズに収まるよう自動調整されます。" },
  { question: "画像の解像度は維持されますか？", answer: "はい、アップロードした画像と同じ解像度でPDF化されます。ただし、画像が小さすぎる場合は印刷時に粗く見える可能性があります。" },
  { question: "WebP形式の画像も対応していますか？", answer: "はい、JPG・PNG・WebP・GIF・BMPなど主要な画像形式すべてに対応しています。" },
  { question: "変換後のPDFは安全ですか？", answer: "はい、ファイルは日本国内のサーバーのみで処理され、海外に送信されることはありません。処理後60分で自動削除されます。" },
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
  customTitle: "【無料】画像→PDF変換｜JPG/PNGをPDFに",
  tool,
  longDescription: "JPG、PNG、WebPなどの画像をPDFに変換。複数画像を1つのPDFにまとめることもできます。写真のPDF化やスキャン画像の整理に便利です。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['画像 PDF変換', 'JPG PDF', 'PNG PDF', '写真 PDF', '画像をPDFに'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} customH1="画像をPDFに変換する無料ツール — JPG・PNG・WebP対応・複数枚一括" faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
