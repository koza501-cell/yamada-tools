import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import TextOverlayClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("text-overlay")!;

const faq = [
  { question: "日本語のテキストを追加できますか？", answer: "はい、日本語（ひらがな、カタカナ、漢字）を含むすべての文字に対応しています。" },
  { question: "フォントの種類は選べますか？", answer: "ゴシック体、明朝体、等幅、手書き風の4種類から選べます。" },
  { question: "文字の色やサイズは変更できますか？", answer: "はい、フォントサイズ（12〜120px）、色（12色）、太字、影の有無を自由に調整できます。" },
  { question: "テキストの位置は移動できますか？", answer: "はい、ドラッグで自由に移動できます。中央揃えボタンもあります。" },
  { question: "複数のテキストを追加できますか？", answer: "現在は1つのテキストを配置する形式です。複数追加は今後対応予定です。" },
];

const seoContent = {
  intro: "画像にテキスト（文字）を追加する無料ツールです。SNS投稿用のキャプション、バナーのタイトル、写真への日付入れなどに最適です。フォント、サイズ、色、影を自由にカスタマイズできます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像に文字入れ｜写真にテキスト追加｜SNS・バナー用｜ブラウザ処理",
  tool,
  longDescription: "画像にテキストを追加する無料ツール。フォント・サイズ・色・影をカスタマイズ。SNS投稿やバナー作成に最適。ブラウザ処理で安全。",
  keywords: ["画像 文字入れ 無料", "写真 テキスト追加", "画像 文字 合成", "バナー 文字入れ", "SNS 画像 文字", "写真 文字入れ アプリ不要"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TextOverlayClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
