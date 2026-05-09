import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BannerMakerClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("banner-maker")!;

const faq = [
  { question: "どんなサイズのバナーが作れますか？", answer: "SNS用（1200×628）、YouTubeサムネイル（1280×720）、ブログヘッダー（1200×400）、Instagram（1080×1080）など、主要サイズがプリセットで用意されています。" },
  { question: "背景画像は使えますか？", answer: "はい、画像アップロードまたは単色背景から選べます。" },
  { question: "テキストのフォントは変更できますか？", answer: "ゴシック体、明朝体、等幅、手書き風の4種類から選べます。サイズ・色・影も調整可能です。" },
  { question: "デザインの知識がなくても使えますか？", answer: "はい、テキストと背景色を選ぶだけで、見栄えの良いバナーが作れます。" },
  { question: "商用利用できますか？", answer: "はい、作成したバナーは商用含め自由にご利用いただけます。" },
];

const seoContent = {
  intro: "SNS投稿、YouTubeサムネイル、ブログヘッダーなど、各種バナー画像を無料で作成するツールです。テキスト・背景色・サイズを設定するだけで、プロ風のバナーが簡単に作れます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】バナー作成｜SNS・YouTube・ブログ用｜テンプレート付き｜ブラウザ処理",
  tool,
  longDescription: "SNS、YouTube、ブログ用のバナーを無料作成。サイズプリセット、テキスト追加、背景色設定。ブラウザ処理で安全。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["バナー作成 無料", "SNS バナー", "YouTube サムネイル 作成", "ブログ ヘッダー 作成", "バナーメーカー", "OGP画像 作成"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BannerMakerClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
