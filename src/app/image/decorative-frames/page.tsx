import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DecorativeFramesClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("decorative-frames")!;

const faq = [
  { question: "フレーム加工とは何ですか？", answer: "画像にデコレーションフレーム（額縁・枠）を追加するツールです。写真をおしゃれに装飾して、SNS投稿やプリント用に活用できます。" },
  { question: "どんなフレームがありますか？", answer: "シンプル枠、丸角、ポラロイド風、フィルム風、切手風、影付き、グラデーション、二重枠など多数のフレームスタイルを用意しています。" },
  { question: "フレームの色は変えられますか？", answer: "はい、フレームの色やサイズをカスタマイズできます。" },
  { question: "正方形にトリミングされますか？", answer: "いいえ、元画像のアスペクト比を維持したままフレームが追加されます。" },
  { question: "スマホでも使えますか？", answer: "はい、スマホ・タブレットでも問題なく使えます。" },
  { question: "画像はサーバーに送信されますか？", answer: "いいえ、すべてブラウザ内で処理されます。画像がサーバーに送信されることはありません。" },
];

const seoContent = {
  intro: "画像にオシャレなフレーム（額縁）を追加するツールです。ポラロイド風やフィルム風、切手風など多彩なフレームスタイルを用意。SNS投稿やプリント、プレゼン資料の画像装飾に最適です。",
  useCases: [
    { title: "📱 SNS投稿", desc: "写真にフレームを追加しておしゃれな投稿を作成" },
    { title: "🖨️ プリント・年賀状", desc: "フォトフレーム風に装飾して印刷" },
    { title: "📊 プレゼン資料", desc: "スライドの画像をフレームで装飾" },
    { title: "🎁 プレゼント", desc: "思い出の写真をフレーム加工してギフトに" },
  ],
  tips: "ポラロイド風はInstagramに、フィルム風はレトロな雰囲気の写真に、シンプル枠はビジネス用途におすすめです。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】フレーム加工｜写真にオシャレな枠・額縁を追加",
  tool,
  longDescription: "画像にフレームを追加するツール。ポラロイド風・フィルム風など多彩なスタイル。ブラウザ処理で安全。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["フレーム加工 無料", "写真 フレーム", "画像 枠", "ポラロイド風 加工", "写真 額縁"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DecorativeFramesClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
