import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import FlipClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("flip")!;

const faq = [
  { question: "水平反転と垂直反転の違いは？", answer: "水平反転は左右を入れ替え（鏡像）、垂直反転は上下を入れ替えます。" },
  { question: "両方同時にできますか？", answer: "はい、水平・垂直の両方を適用できます。両方オンにすると180度回転と同じ効果になります。" },
  { question: "自撮り写真の反転に使えますか？", answer: "はい、スマホの自撮りで左右反転してしまった写真を正しい向きに戻せます。" },
  { question: "画質は劣化しますか？", answer: "いいえ、ピクセル単位で反転するだけなので画質の劣化はありません。" },
  { question: "スマホでも使えますか？", answer: "はい、iPhone・Androidどちらからもご利用いただけます。" },
  { question: "PNGとJPEGどちらで保存すべきですか？", answer: "透明背景が必要な場合はPNG、写真など圧縮を優先する場合はJPEGがおすすめです。" },
  { question: "反転した画像の画質は劣化しますか？", answer: "PNG形式で保存すれば画質は劣化しません。JPEGは圧縮による若干の劣化が生じます。" },
  { question: "GIFアニメーションは反転できますか？", answer: "GIFの静止フレームのみ対応しています。アニメーションGIFは最初のフレームのみ処理されます。" },
];

const seoContent = {
  intro: "画像を水平反転（左右ミラー）・垂直反転（上下）する無料ツールです。自撮り写真の鏡像修正や、デザイン素材の反転に最適。ブラウザ内処理で安全です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像反転（左右・上下）｜写真ミラー・鏡像反転｜ブラウザ処理",
  tool,
  longDescription: "画像を水平反転・垂直反転する無料ツール。自撮り写真の鏡像修正やデザイン素材の反転に。ブラウザ処理で安全・登録不要。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["画像 反転", "左右反転", "上下反転", "写真 ミラー", "鏡像 反転", "画像 フリップ"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FlipClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
