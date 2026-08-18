import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("excel-to-pdf")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "ExcelファイルをPDFに変換。表やグラフのレイアウトを維持したまま、PDFとして保存できます。",
  useCases: [
    { title: "📊 報告書", desc: "Excel報告書をPDFで共有" },
    { title: "📧 メール送付", desc: "数式を隠してPDFで送信" },
    { title: "🖨️ 印刷用", desc: "印刷範囲を固定" },
    { title: "📁 保存用", desc: "改ざん防止のPDF化" },
  ],
  tips: "印刷範囲を設定してからPDF化すると、必要な部分だけを変換できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】Excel→PDF変換｜xlsxをPDFに",
  tool,
  longDescription: "ExcelファイルをPDFに変換。表やグラフのレイアウトを維持したまま、PDFとして保存できます。",
  keywords: ['Excel PDF 変換', 'Excel PDF', 'xlsx PDF', 'エクセル PDF'],
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
