import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import VerticalTextClient from "./client";

const tool = getToolById("vertical-text")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
  { question: "縦書きのPDFを作成できますか？", answer: "はい、作成した縦書き文書をPDF形式でダウンロードできます。" },
  { question: "ルビ（ふりがな）は付けられますか？", answer: "現在ルビ機能は対応しておりません。ふりがな変換ツールと併用してください。" },
  { question: "原稿用紙形式にできますか？", answer: "縦書きで原稿用紙風のレイアウトに対応しています。" },
];

const seoContent = {
  intro: "横書きのテキストを縦書きに変換。小説、詩、手紙、挨拶状、式辞など、縦書きが必要な文書作成に便利です。",
  useCases: [
    { title: "📚 小説執筆", desc: "縦書き形式の原稿作成" },
    { title: "✉️ 手紙・挨拶状", desc: "正式な縦書きの手紙を作成" },
    { title: "📜 詩・俳句・短歌", desc: "縦書きの詩や俳句" },
    { title: "🎌 式辞・祝辞", desc: "冠婚葬祭の縦書き文書" },
  ],
  tips: "ルビ（ふりがな）を付ける場合は、ふりがな変換ツールと併用してください。",
};

// Target keywords:
// - 縦書き変換 (76 imp, pos 6.9)
// - 縦書き 変換 (77 imp, pos 7.0)
// - 縦書き サイト (29 imp)

export const metadata: Metadata = generateToolMetadata({
  customTitle: "縦書き変換ツール【無料】横書きを縦書きに一瞬で変換｜PDF出力対応",
  tool,
  longDescription: "縦書き変換サイト。横書きテキストを縦書きに無料変換。小説・詩・手紙・式辞・祝辞の作成に最適。PDF出力対応、登録不要、日本国内サーバーで安心処理。",
  keywords: ['縦書き変換', '縦書き 変換', '横書き 縦書き 変換', '縦書き ツール', '縦書き エディタ', '縦書き サイト', '縦書き PDF', '小説 縦書き'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VerticalTextClient />
    </>
  );
}
