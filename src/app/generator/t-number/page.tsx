import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("invoice-validator")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "適格請求書発行事業者の登録番号（T番号）を検証。国税庁のデータベースで有効性を確認できます。",
  useCases: [
    { title: "🧾 請求書確認", desc: "取引先のT番号を確認" },
    { title: "🏢 経理処理", desc: "仕入税額控除の確認" },
    { title: "📝 契約前確認", desc: "新規取引先の確認" },
    { title: "📊 一括確認", desc: "複数番号のまとめて確認" },
  ],
  tips: "T番号は「T」で始まる13桁の数字です。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "適格請求書発行事業者の登録番号（T番号）を検証。国税庁のデータベースで有効性を確認できます。",
  keywords: ['インボイス番号 確認', 'T番号 検証', '適格請求書', 'インボイス制度'],
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
