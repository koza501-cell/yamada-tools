import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CompressClient from "./client";

const tool = getToolById("compress-image")!;

const faq = [
  {
    question: "どのくらい圧縮できますか？",
    answer: "画像の内容によりますが、一般的に50-80%のファイルサイズ削減が可能です。写真は特に効果が高く、1MBの画像が200-300KB程度になることも珍しくありません。",
  },
  {
    question: "圧縮すると画質は落ちますか？",
    answer: "品質レベルを選択できます。「高品質」モードなら見た目の違いはほぼわかりません。Web掲載用なら「標準」モードで十分きれいです。",
  },
  {
    question: "PNG画像も圧縮できますか？",
    answer: "はい、JPG、PNG、WebPなど主要な画像形式に対応しています。PNGは透過を保持したまま圧縮できます。",
  },
  {
    question: "複数の画像を一度に圧縮できますか？",
    answer: "はい、最大20枚まで一括で圧縮できます。まとめてドラッグ＆ドロップするだけで処理できます。",
  },
  {
    question: "スマホで撮った写真も圧縮できますか？",
    answer: "はい、スマホ写真は特に効果的です。最近のスマホは高画質なため1枚5MB以上になることも。本ツールで圧縮すれば、LINEやメールで送りやすいサイズになります。",
  },
  {
    question: "圧縮した画像はどこに保存されますか？",
    answer: "処理後すぐにダウンロードされます。サーバーには保存されず、60分以内に自動削除されます。",
  },
  {
    question: "Webサイトの表示速度改善に使えますか？",
    answer: "はい、まさにそのための機能です。画像を圧縮するとページ読み込みが速くなり、SEO評価も向上します。ECサイトやブログ運営者に人気のツールです。",
  },
  {
    question: "無料で何枚でも圧縮できますか？",
    answer: "はい、完全無料で枚数制限もありません。会員登録も不要です。",
  },
];

const seoContent = {
  intro: "スマホ写真が大きすぎてメールで送れない、Webサイトの画像が重くて表示が遅い——そんな悩みを解決します。画像圧縮ツールなら、見た目の品質を保ちながらファイルサイズを最大80%削減。JPG・PNG・WebPに対応、最大20枚まで一括処理できます。",
  useCases: [
    { title: "📧 メール添付", desc: "大きな写真を送信可能なサイズに" },
    { title: "🌐 Webサイト", desc: "ページ表示速度を改善してSEO向上" },
    { title: "📱 SNS投稿", desc: "アップロード制限をクリア" },
    { title: "💾 ストレージ節約", desc: "クラウドやスマホの容量を有効活用" },
  ],
  tips: "Webサイト用なら「標準」品質で十分。印刷用途なら「高品質」を選んでください。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "画像を無料で圧縮。JPG・PNG・WebP対応、最大80%サイズダウン。一括処理可能、登録不要。",
  keywords: ["画像圧縮", "画像 サイズ縮小", "写真 圧縮", "JPEG圧縮", "PNG圧縮", "画像 軽くする", "無料 画像圧縮"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ImageCompressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressClient faq={faq} seoContent={seoContent} />
    </>
  );
}
