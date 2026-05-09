import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import LoremIpsumClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("lorem-ipsum")!;

const faq = [
  { question: "日本語も生成できますか？", answer: "はい、日本語のダミーテキストも生成できます。" },
  { question: "文字数は指定できますか？", answer: "段落数や文字数を指定して生成できます。" },
  { question: "意味のある文章ですか？", answer: "ダミーテキストのため、意味のある内容ではありません。" },
];

const seoContent = {
  intro: "デザインやレイアウト確認用のダミーテキストを生成。日本語と英語のLorem Ipsumに対応しています。",
  useCases: [
    { title: "🎨 デザイン", desc: "Webデザインの仮テキスト" },
    { title: "📄 レイアウト", desc: "文書レイアウトの確認" },
    { title: "💻 開発", desc: "テスト用のダミーデータ" },
    { title: "📱 モックアップ", desc: "アプリ画面のサンプル" },
  ],
  tips: "日本語のダミーテキストは、より自然な文字数確認ができます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ダミーテキスト生成｜Lorem Ipsum",
  tool,
  longDescription: "デザインやレイアウト確認用のダミーテキストを生成。日本語と英語のLorem Ipsumに対応しています。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['ダミーテキスト', 'Lorem Ipsum', 'サンプルテキスト', '仮テキスト'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LoremIpsumClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
