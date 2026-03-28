import type { Metadata } from "next";
import NenkaiClient from "./client";

export const metadata: Metadata = {
  title: "忘年会・新年会の抽選ツール【無料】幹事決め・景品抽選・プレゼント交換に",
  description:
    "忘年会・新年会の幹事決め、景品抽選、プレゼント交換相手をランダムに決める無料ツール。登録不要・インストール不要。その場でスマホからすぐ使える。グループ抽選・個人抽選どちらも対応。完全ランダムで公平な結果をワンクリックで。",
  keywords: [
    "忘年会 抽選 ツール",
    "新年会 くじ引き",
    "忘年会 幹事 決め方",
    "景品 抽選 ツール 無料",
    "プレゼント交換 相手 決め方",
    "忘年会 ゲーム ランダム",
    "飲み会 抽選 無料",
    "送別会 抽選",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/generator/random-picker/nenkai",
  },
  openGraph: {
    title: "忘年会・新年会の抽選ツール【無料】幹事決め・景品抽選・プレゼント交換に",
    description:
      "忘年会・新年会の幹事決め、景品抽選、プレゼント交換をランダムに決める無料ツール。登録不要・スマホOK。",
    url: "https://yamada-tools.jp/generator/random-picker/nenkai",
    type: "website",
    images: [
      {
        url: "/og/random-picker-nenkai.png",
        width: 1200,
        height: 630,
        alt: "忘年会・新年会 抽選ツール | 山田ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "忘年会・新年会の抽選ツール【無料】幹事決め・景品抽選・プレゼント交換に",
    description:
      "忘年会・新年会の幹事決め、景品抽選、プレゼント交換をランダムに決める無料ツール。",
    images: ["/og/random-picker-nenkai.png"],
  },
};

// JSON-LD schemas — rendered in <body> (Google accepts JSON-LD anywhere in document)
const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  "@id": "https://yamada-tools.jp/generator/random-picker/nenkai#app",
  name: "忘年会・新年会 抽選ツール",
  alternateName: ["忘年会くじ引き", "忘年会幹事決めツール", "景品抽選ツール"],
  description:
    "忘年会・新年会の幹事決め、景品抽選、プレゼント交換の相手をランダムに決める無料ブラウザツール。登録不要・インストール不要。",
  url: "https://yamada-tools.jp/generator/random-picker/nenkai",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  inLanguage: "ja",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  featureList: [
    "完全無料",
    "登録不要",
    "スマホ対応",
    "幹事決め",
    "景品抽選",
    "プレゼント交換",
    "複数当選者対応",
    "重複なし抽選",
    "日本国内サーバー",
  ],
  screenshot: "https://yamada-tools.jp/og/random-picker-nenkai.png",
};

const schemaBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "計算・生成ツール", item: "https://yamada-tools.jp/generator" },
    { "@type": "ListItem", position: 3, name: "ランダム抽選", item: "https://yamada-tools.jp/generator/random-picker" },
    { "@type": "ListItem", position: 4, name: "忘年会・新年会 抽選ツール", item: "https://yamada-tools.jp/generator/random-picker/nenkai" },
  ],
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "忘年会の幹事をランダムに決めるにはどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "このツールを使えば簡単です。参加者全員の名前をカンマ区切りで入力し、「抽選する！」ボタンを押すだけで公平にランダムで幹事を決めることができます。スマホでも使えるので、飲み会の席でその場で実施できます。登録・インストールは不要です。",
      },
    },
    {
      "@type": "Question",
      name: "忘年会の景品抽選に何人まで対応していますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "人数制限はありません。10人でも100人でも、参加者全員の名前を入力して抽選できます。複数の景品がある場合も「抽選人数」を増やすことで複数名を同時に選べます。重複なしで連続抽選も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "プレゼント交換（シークレットサンタ）の相手はこのツールで決められますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、最適です。全員の名前を入力して1人ずつ抽選することで、誰が誰にプレゼントを渡すかをランダムに決めることができます。公平で誰も文句のない相手決めができます。",
      },
    },
    {
      "@type": "Question",
      name: "忘年会の出し物や罰ゲームの順番決めにも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、発表順番や出し物の順番決めにも使えます。参加者の名前を入力して全員分を一度に抽選することで、公平な順番を瞬時に決定できます。",
      },
    },
    {
      "@type": "Question",
      name: "スマホで忘年会の会場から使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、iPhone・Androidどちらからでも使えます。ブラウザを開いてURLを入力するだけで、アプリのインストールや会員登録なしにすぐ使えます。Wi-FiがなくてもモバイルデータでOKです。",
      },
    },
    {
      "@type": "Question",
      name: "無料ですか？課金は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全無料です。機能制限もなく、何度でも何人でも使えます。会員登録・クレジットカードの入力も一切不要です。",
      },
    },
    {
      "@type": "Question",
      name: "入力した参加者の名前はどこかに保存されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ、入力したデータは外部に保存・送信されません。すべての処理は日本国内のサーバーで完結し、セッション終了後にデータは削除されます。個人情報を安心して入力いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "抽選結果をLINEや他のメンバーにシェアできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、抽選後に「結果をシェアする」ボタンが表示されます。URLをコピーしてLINEに貼り付けるか、LINEシェアボタンを使って参加者全員に結果を共有できます。",
      },
    },
  ],
};

const schemaHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "忘年会の幹事・景品抽選をランダムに決める方法",
  description: "忘年会・新年会でランダム抽選ツールを使って幹事や景品当選者を公平に決める手順",
  totalTime: "PT1M",
  tool: { "@type": "HowToTool", name: "山田ツール ランダム抽選" },
  supply: { "@type": "HowToSupply", name: "スマートフォンまたはPC（ブラウザのみ）" },
  step: [
    { "@type": "HowToStep", position: 1, name: "ページを開く", text: "スマホやPCのブラウザでこのページを開きます。インストール・登録は不要です。" },
    { "@type": "HowToStep", position: 2, name: "参加者名を入力", text: "テキストボックスに忘年会参加者の名前をカンマ区切りまたは改行で入力します。" },
    { "@type": "HowToStep", position: 3, name: "抽選人数を設定", text: "幹事を1人決める場合は1のまま。景品が複数ある場合は「+」ボタンで当選人数を増やします。" },
    { "@type": "HowToStep", position: 4, name: "抽選する", text: "「抽選する！」ボタンをタップすると、瞬時に公平なランダム抽選結果が表示されます。" },
    { "@type": "HowToStep", position: 5, name: "結果をシェア", text: "LINEシェアボタンや結果URLを使って、忘年会参加者全員に結果を共有できます。" },
  ],
};

export default function NenkaiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }} />
      <NenkaiClient />
    </>
  );
}
