import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

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
  tool,
  longDescription: "PDFに電子署名を追加。手書きサイン、テキスト、画像など様々な形式で署名できます。",
  keywords: ['PDF 署名', '電子署名', 'PDF サイン', 'PDF 印鑑'],
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
