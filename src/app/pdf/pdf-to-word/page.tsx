import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("pdf-to-word")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PDFをWordファイルに変換。テキストや画像を抽出して、編集可能なWord文書を作成します。",
  useCases: [
    { title: "📝 編集作業", desc: "PDFの内容を編集したい時" },
    { title: "📄 再利用", desc: "既存PDFの内容を流用" },
    { title: "🔍 テキスト抽出", desc: "PDFから文章をコピー" },
    { title: "📊 データ活用", desc: "表データをWordで編集" },
  ],
  tips: "スキャンPDF（画像PDF）は、先にOCR処理が必要な場合があります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF→Word変換｜編集可能なdocxに",
  tool,
  longDescription: "PDFをWordファイルに変換。テキストや画像を抽出して、編集可能なWord文書を作成します。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['PDF Word 変換', 'PDF Word', 'PDF docx', 'PDF 編集'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
