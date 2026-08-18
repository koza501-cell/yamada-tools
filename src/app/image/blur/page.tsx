import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BlurClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("blur")!;

const faq = [
  {
    question: "ぼかしの強さは調整できますか？",
    answer: "はい、1〜30段階でぼかしの強度を調整できます。",
  },
  {
    question: "一部分だけぼかせますか？",
    answer: "現在は画像全体にぼかしが適用されます。",
  },
  {
    question: "ぼかし処理後の画質は？",
    answer: "PNG形式で保存されるため、ぼかし以外の画質劣化はありません。",
  },
  {
    question: "どんな画像形式に対応していますか？",
    answer: "JPG、PNG、WebP、BMP、GIF形式に対応しています。",
  },
  {
    question: "処理した画像はどこに保存されますか？",
    answer: "ブラウザのダウンロードフォルダに保存されます。サーバーには送信されません。",
  },
];

const seoContent = {
  intro: "画像にぼかし（ガウスブラー）処理を適用する無料ツールです。背景をぼかしてメイン被写体を際立たせたり、個人情報を隠す目的で使えます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "画像ぼかし【無料・安全】顔・個人情報をぼかし加工｜JPG・PNG対応｜登録不要",
  tool,
  longDescription: "画像の顔・個人情報をワンクリックでぼかし加工。強度調整可能・ブラウザ処理で安全。JPG・PNG対応。登録不要・完全無料。",
  keywords: ["画像 ぼかし 無料", "写真 ぼかし", "背景 ぼかし", "ガウスブラー", "画像 ぼかし加工", "ブラー 処理"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlurClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
