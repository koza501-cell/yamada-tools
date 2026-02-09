import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BrightnessClient from "./client";

const tool = getToolById("brightness")!;

const faq = [
  {
    question: "明るさとコントラスト両方調整できますか？",
    answer: "はい、明るさとコントラストそれぞれ独立したスライダーで調整できます。",
  },
  {
    question: "暗い写真を明るくできますか？",
    answer: "はい、明るさスライダーをプラス方向に動かすと写真全体が明るくなります。",
  },
  {
    question: "コントラストとは何ですか？",
    answer: "明暗の差のことです。コントラストを上げると、明るい部分はより明るく、暗い部分はより暗くなり、くっきりした印象になります。",
  },
  {
    question: "元に戻せますか？",
    answer: "はい、スライダーを0に戻せば元の画像に戻ります。リセットボタンもあります。",
  },
  {
    question: "印刷用に使えますか？",
    answer: "はい、高解像度のまま処理されるので印刷にも適しています。",
  },
];

const seoContent = {
  intro: "画像の明るさとコントラストを調整する無料ツールです。暗い場所で撮った写真を明るく補正したり、コントラストを上げてくっきりした仕上がりにできます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】明るさ・コントラスト調整｜暗い写真を明るく補正｜ブラウザ処理",
  tool,
  longDescription: "画像の明るさとコントラストを調整。暗い写真の補正や、くっきりした仕上がりに。ブラウザ処理で安全。",
  keywords: ["明るさ調整 無料", "写真 明るく", "コントラスト 調整", "画像 補正", "暗い写真 明るく", "画像 明るさ"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BrightnessClient faq={faq} seoContent={seoContent} />
    </>
  );
}
