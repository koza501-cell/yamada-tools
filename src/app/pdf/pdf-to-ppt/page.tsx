import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("pdf-to-ppt")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PDFをPowerPointに変換。既存のPDF資料をベースにプレゼンを作成できます。",
  useCases: [
    { title: "📝 資料編集", desc: "PDF資料を編集したい時" },
    { title: "🎨 デザイン変更", desc: "PDFのデザインを修正" },
    { title: "📊 再利用", desc: "既存資料を再利用" },
    { title: "🖼️ スライド化", desc: "報告書をスライドに" },
  ],
  tips: "複雑なレイアウトのPDFは、変換後に調整が必要な場合があります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF→PowerPoint変換｜編集可能に",
  tool,
  longDescription: "PDFをPowerPointに変換。既存のPDF資料をベースにプレゼンを作成できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['PDF PowerPoint', 'PDF pptx', 'PDF スライド', 'PDF プレゼン'],
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
