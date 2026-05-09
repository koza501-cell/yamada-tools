import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("sign")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PDFに電子署名を追加。手書きサイン、テキスト、画像など様々な形式で署名できます。",
  useCases: [
    { title: "📝 契約書", desc: "契約書への署名" },
    { title: "✅ 承認", desc: "社内文書の承認サイン" },
    { title: "📄 申請書", desc: "各種申請書への署名" },
    { title: "🖊️ 確認印", desc: "確認済みの印を追加" },
  ],
  tips: "署名画像を事前に用意しておくと、繰り返し使用できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF電子署名｜印鑑・サインを追加",
  tool,
  longDescription: "PDFに電子署名を追加。手書きサイン、テキスト、画像など様々な形式で署名できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['PDF 署名', '電子署名', 'PDF サイン', 'PDF 印鑑'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4 pb-8"><p className="text-sm text-gray-600 bg-orange-50 rounded-xl px-4 py-3">💡 PDFへのテキスト入力も必要な場合は <a href="/pdf/text-input" className="text-orange-600 hover:underline font-medium">PDF書き込みツール（PDFに文字入力）</a> もご利用ください。</p></div>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
