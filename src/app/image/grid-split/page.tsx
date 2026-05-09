import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import GridSplitClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("grid-split")!;

const faq = [
  { question: "コマ割り・分割とは何ですか？", answer: "1枚の画像を指定したグリッドに分割するツールです。例えば3×3に分割すると9枚の画像が作成され、Instagramのグリッド投稿などに使えます。" },
  { question: "どんな分割パターンがありますか？", answer: "2×1、1×2、2×2、3×1、1×3、3×3、4×4などの定型パターンに加え、カスタムで自由に行数・列数を指定できます。" },
  { question: "分割した画像はどうやってダウンロードしますか？", answer: "個別にダウンロードするか、ZIPファイルで一括ダウンロードできます。" },
  { question: "Instagramのグリッド投稿に使えますか？", answer: "はい、3×3分割を使えばInstagramの9枚グリッド投稿が簡単に作成できます。投稿順番のガイドも表示されます。" },
  { question: "スマホでも使えますか？", answer: "はい、スマホ・タブレットでも問題なく使えます。" },
  { question: "画像はサーバーに送信されますか？", answer: "いいえ、すべてブラウザ内で処理されます。画像がサーバーに送信されることはありません。" },
];

const seoContent = {
  intro: "画像を好きなグリッドパターンで分割するツールです。Instagramのグリッド投稿、印刷用の分割、パズル作成など幅広い用途に対応。プレビュー付きで分割結果を確認してからダウンロードできます。",
  useCases: [
    { title: "📱 Instagramグリッド投稿", desc: "写真を3×3に分割してインスタ映えするグリッド投稿を作成" },
    { title: "🖨️ 大判印刷の分割", desc: "大きな画像をA4サイズに分割して印刷" },
    { title: "🧩 パズル作成", desc: "画像をグリッドに分割してパズルゲームを作成" },
    { title: "🎨 デザイン素材", desc: "写真を分割してコラージュ素材として活用" },
  ],
  tips: "Instagramのグリッド投稿には3×3がおすすめです。投稿は右下から順番にアップロードしてください。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像コマ割り・分割｜グリッド分割でInstagram投稿にも",
  tool,
  longDescription: "画像をグリッドで分割するツール。Instagram投稿や印刷用に。ブラウザ処理で安全。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["画像 分割 無料", "グリッド分割", "Instagram グリッド投稿", "画像 コマ割り", "写真 分割"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GridSplitClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
