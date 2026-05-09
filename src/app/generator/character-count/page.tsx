import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CharacterCountClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("char-counter")!;

const faq = [
  { question: "スペースは含まれますか？", answer: "スペースを含む/含まないを選択できます。" },
  { question: "改行は1文字ですか？", answer: "改行は文字数にカウントされません。行数として別途表示されます。" },
  { question: "日本語と英語で違いはありますか？", answer: "日本語は1文字、英語は単語単位でもカウントできます。" },
];

const seoContent = {
  intro: "文字数、単語数、行数をリアルタイムでカウント。レポートやブログ記事の文字数制限確認に便利です。",
  useCases: [
    { title: "📝 レポート", desc: "文字数制限の確認" },
    { title: "📱 SNS投稿", desc: "Twitter文字数の確認" },
    { title: "📰 ブログ", desc: "SEO最適な文字数を確認" },
    { title: "📄 応募書類", desc: "志望動機の文字数確認" },
  ],
  tips: "スペースを含む/含まないの切り替えができます。用途に合わせて選択してください。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】文字数カウンター｜リアルタイム計測",
  tool,
  longDescription: "文字数、単語数、行数をリアルタイムでカウント。レポートやブログ記事の文字数制限確認に便利です。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['文字数カウント', '文字数 数える', 'ワードカウント', '文字数チェック'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CharacterCountClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
