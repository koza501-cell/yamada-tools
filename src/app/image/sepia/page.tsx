import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SepiaClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("sepia")!;

const faq = [
  {
    question: "セピアの強さは調整できますか？",
    answer: "はい、0%（元のカラー）〜100%（完全セピア）の範囲で自由に調整できます。",
  },
  {
    question: "セピアとモノクロの違いは？",
    answer: "モノクロは白黒、セピアは茶色がかった暖かい色調です。レトロな雰囲気にはセピアがおすすめです。",
  },
  {
    question: "SNS投稿に使えますか？",
    answer: "はい、Instagram風のレトロ加工として人気です。高画質のまま処理されます。",
  },
  {
    question: "元画像に影響はありますか？",
    answer: "ありません。変換後の画像を別途ダウンロードする形式です。",
  },
  {
    question: "スマホでも使えますか？",
    answer: "はい、iPhone・Androidどちらからも利用可能です。",
  },
];

const seoContent = {
  intro: "画像にセピア（レトロ・ヴィンテージ風）フィルターを適用する無料ツールです。古い写真のような温かみのある色合いに変換できます。結婚式の写真やSNS投稿にも人気です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】セピア加工｜写真をレトロ・ヴィンテージ風に｜ブラウザ処理",
  tool,
  longDescription: "画像にセピア（レトロ・ヴィンテージ風）フィルターを適用。強度調整で自然な仕上がりに。",
  keywords: ["セピア加工 無料", "写真 セピア", "レトロ フィルター", "ヴィンテージ 加工", "画像 セピア 変換", "古い写真風"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SepiaClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
