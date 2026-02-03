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
  {
    question: "他の無料圧縮ツールとの違いは？",
    answer: "山田ツールは日本国内サーバーで処理するため、機密性の高い画像も安心してご利用いただけます。海外サービスと違い、データが国外に出ることはありません。",
  },
  {
    question: "圧縮後も印刷に使えますか？",
    answer: "「高品質」モードで圧縮すれば、印刷にも十分使えます。ただし、大判ポスターなど高解像度が必要な用途では、元画像の使用をお勧めします。",
  },
];

const seoContent = {
  intro: "スマホ写真が大きすぎてメールで送れない、Webサイトの画像が重くて表示が遅い——そんな悩みを解決します。画像圧縮ツールなら、見た目の品質を保ちながらファイルサイズを最大80%削減。JPG・PNG・WebPに対応、最大20枚まで一括処理できます。日本国内サーバーで安全に処理されるので、企業の機密画像も安心です。",
  useCases: [
    { title: "📧 メール添付", desc: "大きな写真を送信可能なサイズに。5MBの写真も1MB以下に圧縮してスムーズに送信" },
    { title: "🌐 Webサイト高速化", desc: "ページ表示速度を改善してSEO向上。Core Web Vitalsのスコア改善にも効果的" },
    { title: "📱 SNS・LINE投稿", desc: "アップロード制限をクリア。画質を保ちながら容量を軽く" },
    { title: "💾 ストレージ節約", desc: "クラウドやスマホの容量を有効活用。同じ枚数でも使用容量を大幅削減" },
    { title: "🏢 企業利用", desc: "日本国内サーバー処理で機密画像も安心。社内資料や製品画像の圧縮に最適" },
  ],
  tips: "Webサイト用なら「標準」品質で十分きれいです。印刷用途やポートフォリオには「高品質」を選んでください。PNG透過画像も透過を保ったまま圧縮できます。",
};

// Target keywords (from Search Console):
// - 画像圧縮 (176 imp)
// - 画像 圧縮 (144 imp)
// - 画像 サイズ 圧縮 (78 imp)
// Total: 400+ impressions at position 43-85

export const metadata: Metadata = generateToolMetadata({
  customTitle: "画像圧縮ツール【無料】写真を80%軽量化｜画質そのまま一括処理",
  tool,
  longDescription: "画像圧縮・写真圧縮ツール。JPG・PNG・WebPを最大80%サイズダウン。画質を保ったまま一括20枚まで処理可能。メール添付・Webサイト高速化・SNS投稿に最適。完全無料・登録不要・日本国内サーバーで安心処理。",
  keywords: [
    "画像圧縮",
    "画像 圧縮",
    "写真 圧縮",
    "画像 サイズ 圧縮",
    "JPEG圧縮",
    "PNG圧縮",
    "画像 軽くする",
    "無料 画像圧縮",
    "写真 軽量化",
    "画像 容量 減らす",
    "画像圧縮 オンライン",
    "画像圧縮 無料 一括"
  ],
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
