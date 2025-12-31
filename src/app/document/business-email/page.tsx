import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("business-email")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "ビジネスメールのテンプレートを選んで簡単作成。お詫び、お礼、依頼など、シーン別の定型文を用意しています。",
  useCases: [
    { title: "🙇 お詫びメール", desc: "ミスやトラブルのお詫び" },
    { title: "🙏 お礼メール", desc: "打ち合わせ後のお礼" },
    { title: "📝 依頼メール", desc: "見積や資料の依頼" },
    { title: "📅 日程調整", desc: "会議の日程調整" },
  ],
  tips: "敬語の使い方に自信がない時は、テンプレートをベースにカスタマイズしましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "ビジネスメールのテンプレートを選んで簡単作成。お詫び、お礼、依頼など、シーン別の定型文を用意しています。",
  keywords: ['ビジネスメール 例文', 'ビジネスメール テンプレート', 'お詫びメール', 'お礼メール'],
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
