import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BusinessEmailClient from "./client";

const tool = getToolById("business-email")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ビジネスメール作成｜例文テンプレート",
  tool,
  longDescription: "ビジネスメールのテンプレートを選んで簡単作成。お詫び、お礼、依頼など、シーン別の定型文を用意しています。",
  keywords: ['ビジネスメール 例文', 'ビジネスメール テンプレート', 'お詫びメール', 'お礼メール'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BusinessEmailClient />
    </>
  );
}
