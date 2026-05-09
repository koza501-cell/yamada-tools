import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import WarekiClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("wareki-seireki")!;

const faq = [
  {
    question: "令和、平成、昭和以外の年号にも対応していますか？",
    answer: "はい、大正、明治にも対応しています。明治以降のすべての年号を西暦に変換できます。",
  },
  {
    question: "「令和7年」は西暦何年ですか？",
    answer: "令和7年は2025年です。令和は2019年5月1日から始まったため、「令和の年数 + 2018」で西暦が計算できます。",
  },
  {
    question: "「昭和100年」のように存在しない年も変換できますか？",
    answer: "計算上は可能ですが、昭和は64年（1989年1月7日）までです。実際に使用する際は、年号の有効期間にご注意ください。",
  },
  {
    question: "生年月日から年齢も計算できますか？",
    answer: "年齢計算には「年齢計算ツール」をご利用ください。生年月日を入力すると、現在の年齢と数え年を計算できます。",
  },
  {
    question: "履歴書に書く和暦がわからない場合は？",
    answer: "西暦で入学・卒業年を入力すれば、対応する和暦が表示されます。履歴書作成時に便利です。",
  },
  {
    question: "スマホからでも使えますか？",
    answer: "はい、iPhone・Androidどちらからもブラウザで直接ご利用いただけます。",
  },
  {
    question: "一覧表はありますか？",
    answer: "はい、主要な年号の対照表も表示しています。履歴書作成などにお役立てください。",
  },
  {
    question: "閏年の計算も正確ですか？",
    answer: "はい、閏年も正確に計算されます。日付変換も正確に行えます。",
  },
];

const seoContent = {
  intro: "「平成15年って西暦何年？」「令和生まれの人は今何歳？」——書類作成や履歴書で、和暦と西暦の変換に困ったことはありませんか？このツールなら、和暦から西暦、西暦から和暦への変換がワンクリック。明治から令和まで、すべての年号に対応しています。",
  useCases: [
    { title: "📝 履歴書作成", desc: "入学・卒業年の和暦変換に" },
    { title: "📋 書類作成", desc: "契約書や申請書の日付記入に" },
    { title: "🎂 年齢確認", desc: "生まれ年から西暦を確認" },
    { title: "📚 歴史学習", desc: "歴史上の出来事の年代確認に" },
  ],
  tips: "履歴書には和暦で記載するのが一般的です。迷ったら「昭和」「平成」「令和」で統一しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】和暦西暦変換｜令和・平成・昭和を即変換",
  tool,
  longDescription: "和暦西暦を簡単変換。令和・平成・昭和・大正・明治に対応。履歴書作成や書類作成に便利な無料ツール。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["和暦 西暦 変換", "令和 西暦", "平成 西暦", "昭和 西暦", "和暦変換", "西暦変換", "年号変換"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function WarekiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WarekiClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
