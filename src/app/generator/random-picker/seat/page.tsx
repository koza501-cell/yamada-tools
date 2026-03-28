import type { Metadata } from "next";
import SeatClient from "./client";

export const metadata: Metadata = {
  title: "席替えランダム決めツール【無料】クラス・職場の座席をシャッフル・印刷対応",
  description:
    "クラスや職場の席替えをランダムに決める無料ツール。教室グリッド表示・印刷対応。登録不要・スマホOK。何人でも対応。出席番号1〜40プリセット付き。完全ランダムで公平な席替えをワンクリックで実現。",
  keywords: [
    "席替え ランダム",
    "席替え ツール",
    "座席 シャッフル",
    "クラス 席替え 無料",
    "席替え アプリ",
    "席順 決め方",
    "席替え ランダム 印刷",
    "座席表 作成",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/generator/random-picker/seat",
  },
  openGraph: {
    title: "席替えランダム決めツール【無料】クラス・職場の座席をシャッフル",
    description:
      "クラスや職場の席替えをランダムに決める無料ツール。教室グリッド・印刷対応。登録不要・スマホOK。",
    url: "https://yamada-tools.jp/generator/random-picker/seat",
    type: "website",
    images: [
      {
        url: "/og/random-picker-seat.png",
        width: 1200,
        height: 630,
        alt: "席替えランダム決めツール | 山田ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "席替えランダム決めツール【無料】クラス・職場の座席をシャッフル",
    description:
      "クラスや職場の席替えをランダムに決める無料ツール。教室グリッド・印刷対応。",
    images: ["/og/random-picker-seat.png"],
  },
};

// JSON-LD schemas — rendered in <body> (Google accepts JSON-LD anywhere in document)

const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  "@id": "https://yamada-tools.jp/generator/random-picker/seat#app",
  name: "席替えランダム決めツール",
  alternateName: ["席替えツール", "座席シャッフルツール", "クラス席替えアプリ"],
  description:
    "クラスや職場の席替えをランダムに決める無料ブラウザツール。教室グリッド表示・印刷対応。登録不要・インストール不要。",
  url: "https://yamada-tools.jp/generator/random-picker/seat",
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: "Education",
  operatingSystem: "Web Browser",
  inLanguage: "ja",
  isAccessibleForFree: true,
  audience: {
    "@type": "Audience",
    audienceType: ["教師", "学校管理者", "オフィスマネージャー", "学生"],
  },
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  featureList: [
    "完全無料",
    "登録不要",
    "スマホ対応",
    "教室グリッド表示",
    "印刷対応",
    "出席番号プリセット",
    "結果コピー機能",
    "何人でも対応",
  ],
  screenshot: "https://yamada-tools.jp/og/random-picker-seat.png",
};

const schemaBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "計算・生成ツール", item: "https://yamada-tools.jp/generator" },
    { "@type": "ListItem", position: 3, name: "ランダム抽選", item: "https://yamada-tools.jp/generator/random-picker" },
    { "@type": "ListItem", position: 4, name: "席替えランダム決めツール", item: "https://yamada-tools.jp/generator/random-picker/seat" },
  ],
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "席替えをランダムに決めるにはどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "このツールを使えば簡単です。生徒や参加者の名前をカンマ区切りまたは改行で入力し、「席替えする！」ボタンを押すだけで全員の席が公平にランダムで決まります。登録・インストールは一切不要で、スマホからでも使えます。",
      },
    },
    {
      "@type": "Question",
      name: "何人まで対応していますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "人数制限はありません。5人の少人数から40人クラス、100人規模の職場まで対応しています。「出席番号1〜40」ボタンを使えば40人分を一度に入力できます。",
      },
    },
    {
      "@type": "Question",
      name: "教室のような座席表を表示できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、「教室グリッド」表示モードに切り替えると、黒板を前にした教室レイアウトで座席表が表示されます。列数は4〜8列から選べるので、教室の形に合わせて調整できます。",
      },
    },
    {
      "@type": "Question",
      name: "座席表を印刷できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、「印刷する」ボタンをタップすると印刷画面が開きます。印刷時は広告やナビゲーションが自動的に非表示になり、座席表のみがきれいに印刷されます。",
      },
    },
    {
      "@type": "Question",
      name: "出席番号で席替えする方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「出席番号1〜40」ボタンをタップすると、1から40までの番号が自動入力されます。「席替えする！」を押すと各番号がランダムな席番号に割り当てられます。",
      },
    },
    {
      "@type": "Question",
      name: "結果を先生や参加者に共有する方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「結果をコピー」ボタンで「1番席 → 田中\n2番席 → 山田」形式のテキストがクリップボードにコピーされます。LINEやメールに貼り付けて共有してください。URLコピー機能でページリンクも共有できます。",
      },
    },
    {
      "@type": "Question",
      name: "入力した名前はどこかに保存されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ、入力したデータはブラウザ内のみで処理され、外部サーバーには送信・保存されません。個人情報を安心して入力いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "職場やオフィスの席替えにも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、学校だけでなく職場やオフィスの席替えにも最適です。社員名を入力してランダムにシャッフルし、教室グリッド表示でフロアレイアウトに近い座席表を作成できます。",
      },
    },
    {
      "@type": "Question",
      name: "特定の生徒を隣同士にしたい・離したいなどの条件を設定できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "現在のバージョンでは完全ランダムのみ対応しています。特定の条件がある場合は、一度全体をランダムで決めた後、問題のある席のみ手動で入れ替える方法をおすすめします。",
      },
    },
    {
      "@type": "Question",
      name: "スマホから使えますか？iPhoneとAndroid両方対応？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、iPhone・Androidどちらのブラウザからでも使えます。アプリのインストールや会員登録は不要です。学校や職場のWi-Fiがなくてもモバイルデータ通信で利用できます。",
      },
    },
  ],
};

const schemaHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "席替えをランダムに決める方法",
  description: "クラスや職場でランダム席替えツールを使って公平に座席を決める手順",
  totalTime: "PT2M",
  tool: { "@type": "HowToTool", name: "山田ツール 席替えランダム決めツール" },
  supply: { "@type": "HowToSupply", name: "スマートフォンまたはPC（ブラウザのみ）" },
  step: [
    { "@type": "HowToStep", position: 1, name: "ページを開く", text: "スマホやPCのブラウザでこのページを開きます。インストール・登録は不要です。" },
    { "@type": "HowToStep", position: 2, name: "名前を入力する", text: "テキストボックスに生徒または参加者の名前を入力します。カンマ区切りまたは改行で入力。「出席番号1〜40」ボタンを使うと番号を自動入力できます。" },
    { "@type": "HowToStep", position: 3, name: "席替えする", text: "「席替えする！」ボタンをタップすると、全員の席がランダムにシャッフルされた結果が表示されます。" },
    { "@type": "HowToStep", position: 4, name: "表示モードを選ぶ", text: "「リスト表示」で番号順一覧、「教室グリッド」で教室レイアウト風の座席表を表示できます。列数は4〜8列から選べます。" },
    { "@type": "HowToStep", position: 5, name: "印刷・共有する", text: "「印刷する」ボタンで座席表を印刷、「結果をコピー」でテキストをクリップボードにコピーしてLINEやメールで共有できます。" },
  ],
};

const schemaLearningResource = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "https://yamada-tools.jp/generator/random-picker/seat#learning",
  name: "席替えランダム決めツール",
  description: "教師・学校管理者・職場管理者向けの席替えランダム決定ツール。教室グリッド表示・印刷対応。",
  url: "https://yamada-tools.jp/generator/random-picker/seat",
  inLanguage: "ja",
  isAccessibleForFree: true,
  educationalRole: ["teacher", "student", "administrator"],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: ["teacher", "administrator"],
  },
  teaches: "公平なランダム席替えの実施方法",
};

export default function SeatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLearningResource) }} />
      <SeatClient />
    </>
  );
}
