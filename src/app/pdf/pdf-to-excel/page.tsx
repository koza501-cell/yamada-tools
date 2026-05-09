import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("pdf-to-excel")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PDFの表データをExcelに変換。手入力の手間を省いて、データ分析や編集が可能になります。",
  useCases: [
    { title: "📊 データ分析", desc: "PDF表をExcelで分析" },
    { title: "📝 データ入力省略", desc: "手入力の手間を削減" },
    { title: "🔄 データ統合", desc: "複数PDFのデータを統合" },
    { title: "📈 グラフ作成", desc: "抽出データでグラフ作成" },
  ],
  tips: "表の罫線が明確なPDFほど、正確に変換できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF→Excel変換｜表をxlsxに抽出",
  tool,
  longDescription: "PDFの表データをExcelに変換。手入力の手間を省いて、データ分析や編集が可能になります。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['PDF Excel 変換', 'PDF Excel', 'PDF 表 抽出', 'PDF xlsx'],
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
