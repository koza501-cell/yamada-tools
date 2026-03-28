import type { Metadata } from "next";
import ChristmasClient from "./client";

export const metadata: Metadata = {
  title: "クリスマスプレゼント交換の相手決め【無料・即使える】シークレットサンタ抽選ツール",
  description:
    "クリスマスのプレゼント交換（シークレットサンタ）の相手をランダムに決める無料ツール。グループLINEで結果シェア可。登録不要・スマホOK・何人でも無料。ワンクリックで公平な組み合わせを自動生成。繰り返し何度でも試せる。",
  keywords: [
    "プレゼント交換 相手 決め方",
    "シークレットサンタ ランダム",
    "クリスマス 抽選 ツール",
    "プレゼント交換 アプリ 無料",
    "シークレットサンタ 決め方 アプリ",
    "クリスマスパーティー くじ引き",
    "プレゼント交換 サイト",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/generator/random-picker/christmas",
  },
  openGraph: {
    title: "クリスマスプレゼント交換の相手決め【無料・即使える】シークレットサンタ抽選ツール",
    description:
      "クリスマスのプレゼント交換（シークレットサンタ）の相手をランダムに決める無料ツール。グループLINEで結果シェア可。登録不要・スマホOK。",
    url: "https://yamada-tools.jp/generator/random-picker/christmas",
    type: "website",
    images: [
      {
        url: "/og/random-picker-christmas.png",
        width: 1200,
        height: 630,
        alt: "クリスマス プレゼント交換 相手決めツール | 山田ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "クリスマスプレゼント交換の相手決め【無料・即使える】シークレットサンタ抽選ツール",
    description:
      "クリスマスのプレゼント交換（シークレットサンタ）の相手をランダムに決める無料ツール。",
    images: ["/og/random-picker-christmas.png"],
  },
};

const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  "@id": "https://yamada-tools.jp/generator/random-picker/christmas#app",
  name: "プレゼント交換・シークレットサンタ 相手決めツール",
  alternateName: ["シークレットサンタ決めツール", "プレゼント交換ツール", "クリスマス抽選ツール"],
  description:
    "クリスマスのプレゼント交換（シークレットサンタ）の相手をランダムに決める無料ツール。何人でも無料、登録不要。",
  url: "https://yamada-tools.jp/generator/random-picker/christmas",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  inLanguage: "ja",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  featureList: [
    "完全無料・登録不要",
    "何人でも使える",
    "プレゼント交換の相手をランダム決定",
    "シークレットサンタ対応",
    "LINE/X シェア機能",
    "重複なし抽選",
    "スマホ対応",
  ],
};

const schemaBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "計算・生成ツール", item: "https://yamada-tools.jp/generator" },
    { "@type": "ListItem", position: 3, name: "ランダム抽選", item: "https://yamada-tools.jp/generator/random-picker" },
    { "@type": "ListItem", position: 4, name: "クリスマス プレゼント交換 相手決め", item: "https://yamada-tools.jp/generator/random-picker/christmas" },
  ],
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "シークレットサンタの相手決めはどうやって使えばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "全員の名前を入力し、抽選人数を「1」にして1人ずつ抽選します。最初に引いた人が2番目の人にプレゼントを渡す、というように順番に割り当てていくと、シークレットサンタのペアが公平に決まります。",
      },
    },
    {
      "@type": "Question",
      name: "プレゼント交換の相手を全員分まとめて決めることはできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、全員の名前を入力し、抽選人数を参加人数と同じに設定して一度に抽選することで、全員のランダムな並び順が決まります。1番目の人が2番目の人に、2番目が3番目に、という形でペアを決める方法がおすすめです。",
      },
    },
    {
      "@type": "Question",
      name: "自分が自分に当たってしまうことはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全ランダムのため、理論上は自分が自分に当たる可能性があります。その場合は、その人だけ再抽選するか、隣の人とペアを交換する方法が一般的です。次バージョンでの自己当選排除機能を開発中です。",
      },
    },
    {
      "@type": "Question",
      name: "プレゼントの予算はどう決めればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "このツールは相手決めのみを行います。プレゼントの予算は参加者間で事前に話し合って決めておくことをおすすめします。一般的な会社の忘年会では500円〜1,000円、友人グループでは1,000円〜3,000円が相場です。",
      },
    },
    {
      "@type": "Question",
      name: "LINEグループで結果を共有する方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "抽選後に表示される「LINEでシェア」ボタンをタップするか、「URLをコピー」してLINEグループに貼り付けることで、抽選結果を全員に共有できます。",
      },
    },
    {
      "@type": "Question",
      name: "何人まで対応していますか？費用はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "人数制限はなく、完全無料です。3人のグループから100人規模の会社の忘年会まで対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "クリスマス以外のプレゼント交換（誕生日会・送別会など）にも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "もちろんです。誕生日会、送別会、ハロウィンパーティー、ホワイトデーなど、あらゆるプレゼント交換イベントに対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "入力した参加者の名前は他人に見られる可能性はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ありません。入力したデータは日本国内サーバーで処理され、他のユーザーに公開されることは一切ありません。SSL暗号化通信を使用しており、安全にご利用いただけます。",
      },
    },
  ],
};

const schemaHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "クリスマス プレゼント交換（シークレットサンタ）の相手をランダムに決める方法",
  description: "プレゼント交換の参加者をランダムに割り当てる手順",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "全員の名前を入力", text: "プレゼント交換に参加する全員の名前をカンマ区切りで入力します。例：田中,山田,鈴木,佐藤" },
    { "@type": "HowToStep", position: 2, name: "抽選人数を全員分に設定", text: "「抽選人数」を参加人数と同じ数字に設定します。これで全員の順番がランダムに決まります。" },
    { "@type": "HowToStep", position: 3, name: "抽選する", text: "「抽選する！」ボタンを押します。ランダムな順番が表示されます。" },
    { "@type": "HowToStep", position: 4, name: "ペアを決める", text: "表示された順番で「1番目の人が2番目の人に」「2番目が3番目に」…というようにペアを割り当てます。" },
    { "@type": "HowToStep", position: 5, name: "LINEでシェア", text: "「LINEでシェア」ボタンでグループに結果を共有します。" },
  ],
};

export default function ChristmasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }} />
      <ChristmasClient />
    </>
  );
}
