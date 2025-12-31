import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("salary-calc")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "額面給与から手取り額を計算。社会保険料、所得税、住民税の概算を確認できます。",
  useCases: [
    { title: "💰 手取り確認", desc: "実際の手取り額を試算" },
    { title: "📊 転職検討", desc: "年収比較の参考に" },
    { title: "📝 昇給後", desc: "昇給後の手取りを確認" },
    { title: "🏠 生活設計", desc: "家計の計画に" },
  ],
  tips: "扶養家族の人数や住んでいる地域によって、控除額は変わります。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "額面給与から手取り額を計算。社会保険料、所得税、住民税の概算を確認できます。",
  keywords: ['給与計算', '手取り 計算', '年収 手取り', '社会保険料 計算'],
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
