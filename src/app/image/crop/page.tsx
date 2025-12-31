import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("crop-image")!;

const faq = [
  { question: "決まった比率で切り抜けますか？", answer: "はい、1:1、16:9、4:3などプリセットから選択できます。" },
  { question: "丸く切り抜けますか？", answer: "四角形での切り抜きのみ対応しています。" },
  { question: "切り抜き位置は調整できますか？", answer: "はい、ドラッグで自由に位置を調整できます。" },
];

const seoContent = {
  intro: "画像の必要な部分だけを切り抜き。SNSのプロフィール画像や、バナー作成に便利です。",
  useCases: [
    { title: "👤 プロフィール", desc: "SNS用の正方形アイコン作成" },
    { title: "🖼️ バナー作成", desc: "ヘッダー画像を切り抜き" },
    { title: "📷 写真加工", desc: "不要な部分をカット" },
    { title: "📱 サムネイル", desc: "YouTube用サムネイル作成" },
  ],
  tips: "よく使う比率（1:1、16:9、4:3など）をワンクリックで選択できます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "画像の必要な部分だけを切り抜き。SNSのプロフィール画像や、バナー作成に便利です。",
  keywords: ['画像 切り抜き', '画像 トリミング', '写真 切り抜き', '画像 crop'],
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
