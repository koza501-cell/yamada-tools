import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import GifMakerClient from "./client";

const tool = getToolById("gif-maker")!;

const faq = [
  { question: "何枚の画像からGIFを作れますか？", answer: "2〜20枚の画像からGIFアニメーションを作成できます。" },
  { question: "フレーム間隔は調整できますか？", answer: "はい、100ms〜2000ms（0.1秒〜2秒）の範囲で調整できます。" },
  { question: "画像のサイズが違っていても大丈夫？", answer: "はい、最初の画像のサイズに自動で合わせて調整されます。" },
  { question: "ループ再生しますか？", answer: "はい、作成されるGIFは無限ループで再生されます。" },
  { question: "スマホでも使えますか？", answer: "はい、iPhone・Androidどちらからもご利用いただけます。" },
];

const seoContent = {
  intro: "複数の画像からGIFアニメーションを作成する無料ツールです。フレーム間隔やサイズを調整して、SNS投稿やプレゼン用のGIFを簡単に作成できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】GIFアニメ作成｜画像からGIF変換｜ブラウザ処理で安全",
  tool,
  longDescription: "複数の画像からGIFアニメーションを作成する無料ツール。フレーム間隔調整可能。ブラウザ処理で安全・登録不要。",
  keywords: ["GIF 作成 無料", "GIFアニメ 作成", "画像 GIF変換", "GIFメーカー", "アニメGIF 作成", "GIF 作り方"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GifMakerClient faq={faq} seoContent={seoContent} />
    </>
  );
}
