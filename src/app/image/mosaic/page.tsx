import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import MosaicClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("mosaic")!;

const faq = [
  {
    question: "モザイクの強さは調整できますか？",
    answer: "はい、スライダーで2〜50段階のモザイク強度を調整できます。数値が大きいほど粗いモザイクになります。",
  },
  {
    question: "画像の一部だけモザイクをかけられますか？",
    answer: "現在は画像全体にモザイクが適用されます。SNSやブログ投稿前の全体モザイク処理に最適です。",
  },
  {
    question: "モザイク処理後の画像形式は？",
    answer: "PNG形式でダウンロードされます。高画質のまま保存できます。",
  },
  {
    question: "スマホでも使えますか？",
    answer: "はい、iPhone・Androidどちらからもご利用いただけます。",
  },
  {
    question: "アップロードした画像は安全ですか？",
    answer: "はい、すべてブラウザ内で処理されます。サーバーに画像が送信されることはありません。",
  },
];

const seoContent = {
  intro: "画像にモザイク（ピクセル化）処理を適用する無料ツールです。顔や車のナンバープレート、個人情報など、隠したい部分をモザイクで保護できます。ブラウザ内で処理されるため、プライバシーも安心です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】モザイク加工｜画像の顔・個人情報をモザイクで隠す｜ブラウザ処理",
  tool,
  longDescription: "画像にモザイク処理を適用。顔や個人情報の保護に最適。強度調整可能。ブラウザ内処理で安全・登録不要。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["モザイク加工 無料", "画像 モザイク", "顔 モザイク", "写真 モザイク 無料", "個人情報 隠す", "モザイク ブラウザ"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MosaicClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
