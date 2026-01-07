import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("random-picker")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "リストからランダムに1つまたは複数を抽選。くじ引き、当選者選出、順番決めなどに使えます。",
  useCases: [
    { title: "🎯 抽選会", desc: "当選者をランダム選出" },
    { title: "🎲 順番決め", desc: "発表順や担当を決める" },
    { title: "🍽️ 食事決め", desc: "今日のランチを決める" },
    { title: "🎁 プレゼント", desc: "プレゼント交換の相手決め" },
  ],
  tips: "重複なしで複数選出することもできます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ランダム抽選｜くじ引き・当選者選び",
  tool,
  longDescription: "リストからランダムに1つまたは複数を抽選。くじ引き、当選者選出、順番決めなどに使えます。",
  keywords: ['ランダム 抽選', 'くじ引き', '抽選 ツール', 'ランダム 選択'],
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
