import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BrightnessClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

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
  longDescription: "画像の明るさとコントラストを調整。暗い写真の補正や、くっきりした仕上がりに。ブラウザ処理で安全。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["明るさ調整 無料", "写真 明るく", "コントラスト 調整", "画像 補正", "暗い写真 明るく", "画像 明るさ"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BrightnessClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
