import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HankoClient from "./client";

const tool = getToolById("hanko")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "電子印鑑（デジタルはんこ）を無料作成。認印、角印、日付印など、様々なスタイルの印鑑を作成できます。",
  useCases: [
    { title: "📄 電子文書", desc: "PDF文書への押印" },
    { title: "🏢 社内書類", desc: "稟議書や申請書に" },
    { title: "📝 請求書", desc: "請求書への角印" },
    { title: "✅ 承認印", desc: "確認済みの印鑑" },
  ],
  tips: "認印は丸型、会社印は角型が一般的です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】電子印鑑作成｜ハンコ画像を即生成",
  tool,
  longDescription: "電子印鑑（デジタルはんこ）を無料作成。認印、角印、日付印など、様々なスタイルの印鑑を作成できます。",
  keywords: ['電子印鑑', 'デジタル印鑑', 'はんこ 作成', '印鑑 無料'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HankoClient />
    </>
  );
}
