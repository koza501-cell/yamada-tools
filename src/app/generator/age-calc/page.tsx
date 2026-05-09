import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import AgeCalcClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("age-calc")!;

const faq = [
  { question: "特定の日付時点の年齢は計算できますか？", answer: "はい、基準日を指定して計算できます。" },
  { question: "数え年とは何ですか？", answer: "生まれた年を1歳とし、毎年元旦に1歳加算する日本の伝統的な数え方です。" },
  { question: "干支も表示されますか？", answer: "はい、生まれ年の干支も表示されます。" },
];

const seoContent = {
  intro: "生年月日から現在の年齢を計算。特定の日付時点での年齢や、数え年も計算できます。",
  useCases: [
    { title: "📝 書類記入", desc: "履歴書や申込書の年齢欄" },
    { title: "🎂 誕生日", desc: "正確な年齢を確認" },
    { title: "📅 将来の年齢", desc: "〇年後の年齢を計算" },
    { title: "🙏 数え年", desc: "厄年や七五三の確認" },
  ],
  tips: "数え年は生まれた年を1歳とし、元旦で1歳加算する数え方です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】年齢計算｜生年月日から即計算",
  tool,
  longDescription: "生年月日から現在の年齢を計算。特定の日付時点での年齢や、数え年も計算できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['年齢計算', '生年月日 年齢', '数え年 計算', '年齢 計算機'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgeCalcClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
