import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RandomPickerClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import RelatedTools from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";

const tool = getToolById("random-picker")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料でご利用いただけます。会員登録・ログイン・インストールも一切不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらのスマートフォンからも使えます。ブラウザで開くだけですぐに使えます。" },
  { question: "複数人を同時に抽選できますか？", answer: "はい、「抽選人数」を増やすことで複数名を同時に抽選できます。重複なしで連続抽選も可能です。" },
  { question: "入力したデータは安全ですか？", answer: "はい、すべての処理は日本国内のサーバーで行われます。SSL暗号化通信を使用しており、入力データは外部に送信・保存されることはありません。" },
  { question: "忘年会や飲み会の幹事決めに使えますか？", answer: "はい、最適です。参加者の名前を入力して「抽選する」ボタンを押すだけで、公平に幹事を決めることができます。その場でスマホからもすぐに使えます。" },
  { question: "プレゼント交換の相手決めに使えますか？", answer: "はい、プレゼント交換（シークレットサンタ）の相手を決めるのに最適です。全員の名前を入力し、抽選人数を設定して実行するだけで公平に決まります。" },
  { question: "順番決めやチーム分けにも使えますか？", answer: "はい、発表順番の決定やチーム分けにもご活用いただけます。名前リストを入力して複数人を同時抽選することで、順番やグループを公平に決めることができます。" },
  { question: "何人まで登録できますか？", answer: "人数の制限はありません。名前をカンマ区切りや改行で入力することで、何人でも登録して抽選することができます。" },
  { question: "抽選の結果は本当に公平ですか？", answer: "はい、JavaScriptの暗号論的乱数生成（crypto.getRandomValues）を使用しているため、偏りのない完全公平な抽選を実現しています。" },
  { question: "履歴機能はありますか？", answer: "はい、過去の抽選結果を確認できる履歴機能があります。同じ抽選を繰り返す場合でも、過去の結果を参照して公平性を確認できます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "ランダム抽選ツール【無料・登録不要】くじ引き・順番決め・チーム分け",
  tool,
  longDescription: "名前・数字をランダムに抽選するブラウザツール。忘年会の幹事決め、プレゼント交換、チーム分け、順番決めに対応。インストール・登録一切不要、完全無料。日本国内サーバーで安心。",
  keywords: ['ランダム抽選', 'くじ引き', '抽選ツール', '順番決め', 'チーム分け', 'プレゼント交換', '忘年会', '席替え', '当選者選び', '登録不要', 'グループ分け', '重複なし'],
});

const customSoftwareSchema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  "@id": "https://yamada-tools.jp/generator/random-picker#software",
  "name": "ランダム抽選ツール",
  "alternateName": ["Random Picker", "くじ引きツール", "抽選ツール"],
  "description": "名前・数字をランダム抽選。くじ引き、順番決め、チーム分け、プレゼント交換に対応。登録不要・完全無料。日本国内サーバーで安心・安全。",
  "url": "https://yamada-tools.jp/generator/random-picker",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
  "featureList": [
    "完全無料・登録不要", "名前・アイテムのランダム抽選", "複数当選者の同時抽選",
    "重複なし抽選", "順番決め（シャッフル）", "チーム分け・グループ分け",
    "抽選履歴の保存", "日本国内サーバー処理", "SSL暗号化通信", "スマホ・PC対応"
  ],
  "inLanguage": "ja",
  "isAccessibleForFree": true,
  "browserRequirements": "JavaScriptが必要。Chrome、Firefox、Safari、Edge対応。"
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
    { "@type": "ListItem", "position": 2, "name": "計算・生成ツール", "item": "https://yamada-tools.jp/generator" },
    { "@type": "ListItem", "position": 3, "name": "ランダム抽選ツール", "item": "https://yamada-tools.jp/generator/random-picker" }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": { "@type": "Answer", "text": item.answer }
  }))
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "ランダム抽選ツールの使い方",
  "description": "ランダム抽選ツールを無料で使う方法",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "項目を入力する", "text": "抽選したい名前やアイテムをテキストボックスに入力します。カンマ区切りや改行で複数まとめて追加できます。" },
    { "@type": "HowToStep", "position": 2, "name": "抽選人数を設定する", "text": "「抽選人数」の+/-ボタンで一度に選ぶ人数を設定します。" },
    { "@type": "HowToStep", "position": 3, "name": "抽選する", "text": "「抽選する！」ボタンをクリックすると、完全ランダムで結果が表示されます。" },
    { "@type": "HowToStep", "position": 4, "name": "結果を確認する", "text": "抽選結果が表示されます。過去の結果は履歴から確認できます。" }
  ],
  "totalTime": "PT1M"
};

const jsonLd = [customSoftwareSchema, breadcrumbSchema, faqSchema, howToSchema];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AdFreeZone><RandomPickerClient faq={faq} /></AdFreeZone>
      <AdUnit slot="3948572016" format="horizontal" />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
