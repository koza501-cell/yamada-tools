import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ImageOverlayClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("image-overlay")!;

const faq = [
  { question: "2枚の画像を重ねられますか？", answer: "はい、ベース画像の上にオーバーレイ画像を重ねて配置できます。透明度も調整可能です。" },
  { question: "ロゴを画像に追加できますか？", answer: "はい、PNG形式のロゴ（透過背景）を画像に重ねるのに最適です。位置とサイズを自由に調整できます。" },
  { question: "透明度は調整できますか？", answer: "はい、0%（完全透明）〜100%（不透明）の範囲で調整できます。" },
  { question: "ウォーターマーク追加にも使えますか？", answer: "はい、半透明のロゴやテキスト画像を重ねてウォーターマークとして利用できます。" },
  { question: "スマホでも使えますか？", answer: "はい、iPhone・Androidどちらからもご利用いただけます。" },
];

const seoContent = {
  intro: "2枚の画像を重ね合わせる無料ツールです。ロゴの追加、ウォーターマーク、合成画像の作成に最適。透明度、位置、サイズを自由に調整できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像重ね合わせ｜ロゴ追加・ウォーターマーク｜ブラウザ処理",
  tool,
  longDescription: "2枚の画像を重ね合わせる無料ツール。ロゴ追加、ウォーターマーク、画像合成に。透明度・位置・サイズ調整可能。ブラウザ処理で安全。",
  keywords: ["画像 重ね合わせ", "画像 合成 無料", "ロゴ 追加", "ウォーターマーク 画像", "画像 オーバーレイ", "写真 合成"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageOverlayClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
