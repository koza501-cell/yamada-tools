import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("ppt-to-pdf")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PowerPointをPDFに変換。プレゼン資料を配布用PDFとして保存できます。",
  useCases: [
    { title: "📧 資料配布", desc: "参加者への資料配布" },
    { title: "🖨️ 印刷用", desc: "配布資料の印刷" },
    { title: "📁 アーカイブ", desc: "プレゼン資料の保存" },
    { title: "🔒 編集防止", desc: "内容の改ざん防止" },
  ],
  tips: "ノート付きPDFにすると、発表者用メモも含めて保存できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PowerPoint→PDF変換｜pptxをPDFに",
  tool,
  longDescription: "PowerPointをPDFに変換。プレゼン資料を配布用PDFとして保存できます。",
  keywords: ['PowerPoint PDF', 'pptx PDF', 'パワポ PDF', 'プレゼン PDF'],
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
