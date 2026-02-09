import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import MonochromeClient from "./client";

const tool = getToolById("monochrome")!;

const faq = [
  {
    question: "完全な白黒にできますか？",
    answer: "はい、スライダーを100%にすると完全なモノクロになります。",
  },
  {
    question: "少しだけ色を残せますか？",
    answer: "はい、スライダーで50%程度にすると、うっすら色が残るレトロな雰囲気になります。",
  },
  {
    question: "印刷用に使えますか？",
    answer: "はい、高解像度のまま変換されるので印刷にも適しています。",
  },
  {
    question: "元の画像は変更されますか？",
    answer: "いいえ、元の画像はそのまま。変換後の画像を別途ダウンロードします。",
  },
  {
    question: "対応画像形式は？",
    answer: "JPG、PNG、WebP、BMP、GIF形式に対応しています。",
  },
];

const seoContent = {
  intro: "カラー画像をモノクロ（白黒・グレースケール）に変換する無料ツールです。スライダーで色の残し具合を調整でき、完全な白黒からうっすら色が残る状態まで自由にコントロールできます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】モノクロ変換｜写真を白黒・グレースケールに｜ブラウザ処理",
  tool,
  longDescription: "カラー画像をモノクロ（白黒・グレースケール）に変換。強度調整で色味の残し具合も設定可能。",
  keywords: ["モノクロ変換 無料", "白黒 変換", "グレースケール", "画像 モノクロ", "写真 白黒 加工", "モノクロ フィルター"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MonochromeClient faq={faq} seoContent={seoContent} />
    </>
  );
}
