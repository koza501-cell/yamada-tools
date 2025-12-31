import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ZenkakuClient from "./client";

const tool = getToolById("zenkaku-hankaku")!;

const faq = [
  {
    question: "全角と半角の違いは何ですか？",
    answer: "全角は日本語入力モードの文字（Ａ、１、＠など）、半角は英数字モードの文字（A、1、@など）です。見た目の幅が異なり、データ処理では区別されることが多いです。",
  },
  {
    question: "なぜ全角半角の変換が必要なのですか？",
    answer: "データベースや業務システムでは、入力形式を統一する必要があります。電話番号は半角、住所は全角など、システムによってルールが異なるため、変換ツールが重宝されます。",
  },
  {
    question: "カタカナも変換できますか？",
    answer: "はい、カタカナの全角⇔半角変換にも対応しています。「アイウエオ」⇔「ｱｲｳｴｵ」のような変換が可能です。",
  },
  {
    question: "スペースも変換されますか？",
    answer: "はい、全角スペース「　」と半角スペース「 」の相互変換も可能です。オプションで選択できます。",
  },
  {
    question: "Excelからコピーしたデータも変換できますか？",
    answer: "はい、Excelからコピー＆ペーストしたデータをそのまま変換できます。大量のデータも一括で処理可能です。",
  },
  {
    question: "変換後のデータはどこに保存されますか？",
    answer: "サーバーには保存されません。ブラウザ上で処理されるため、機密性の高いデータも安心してご利用いただけます。",
  },
  {
    question: "どのくらいの文字数まで変換できますか？",
    answer: "数万文字程度まで問題なく処理できます。非常に長いテキストの場合は、分割して変換することをおすすめします。",
  },
  {
    question: "特定の文字だけ変換できますか？",
    answer: "「数字のみ」「英字のみ」「カタカナのみ」など、変換対象を選択できます。必要な部分だけを変換可能です。",
  },
];

const seoContent = {
  intro: "Excelや業務システムで「全角で入力してください」「半角に統一してください」と言われたことはありませんか？全角半角変換ツールなら、コピー＆ペーストするだけで一括変換。数字、英字、カタカナ、スペースなど、変換対象も細かく選択できます。",
  useCases: [
    { title: "📊 Excel作業", desc: "電話番号や郵便番号を半角に統一" },
    { title: "💼 データ入力", desc: "業務システム用にデータを整形" },
    { title: "📝 文書作成", desc: "全角英数字を半角に変換" },
    { title: "🔄 データ移行", desc: "システム間のデータ形式を統一" },
  ],
  tips: "電話番号や郵便番号は半角数字、住所の番地は全角数字が一般的です。入力先のルールを確認してから変換しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "全角半角を一括変換。数字、英字、カタカナ、スペースの変換に対応。Excel作業やデータ入力に便利な無料ツール。",
  keywords: ["全角半角変換", "全角 半角", "半角変換", "全角変換", "カタカナ変換", "文字変換", "Excel 全角半角"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ZenkakuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ZenkakuClient faq={faq} seoContent={seoContent} />
    </>
  );
}
