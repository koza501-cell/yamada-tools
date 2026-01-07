import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("fax-cover")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "FAX送信時の送付状を作成。宛先、送信者、枚数、メッセージを入力するだけで完成します。",
  useCases: [
    { title: "📠 FAX送信", desc: "FAX送信時の表紙" },
    { title: "🏢 取引先連絡", desc: "ビジネスFAXの送付状" },
    { title: "📄 書類送付", desc: "重要書類のFAX送信" },
    { title: "📝 至急連絡", desc: "緊急連絡用のFAX" },
  ],
  tips: "送信枚数は送付状を含めた総枚数を記載しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】FAX送付状作成｜テンプレート付き",
  tool,
  longDescription: "FAX送信時の送付状を作成。宛先、送信者、枚数、メッセージを入力するだけで完成します。",
  keywords: ['FAX送付状', 'FAX 表紙', 'FAX テンプレート', 'ファックス 送付状'],
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
