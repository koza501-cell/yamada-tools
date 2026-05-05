import { Metadata } from "next";
import SchoolDistrictClient from "./client";

export const metadata: Metadata = {
  title: "学区チェッカー — 住所で小学校・中学校の学区を確認 | 山田ツール",
  description:
    "住所を入力するだけで小学校区・中学校区を即座に確認。引越し・不動産購入前の学区確認に。子育て世帯の住まい選びをサポート。国土交通省データ使用、完全無料・登録不要。",
  keywords: [
    "学区 調べ方 無料",
    "小学校区 住所 検索",
    "中学校区 確認",
    "引越し 学区 確認",
    "不動産 購入 学区 チェック",
    "子育て 住まい 学区 選び",
    "学区 スマホ 簡単",
    "学区チェッカー 無料",
    "小学校 通学区域 調べる",
    "学区 変更 確認",
    "公立小学校 学区 確認",
    "学区 Mac 確認",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate/school-district" },
  openGraph: {
    title: "学区チェッカー — 住所で小学校・中学校の学区を確認",
    description: "住所だけで小学校区・中学校区を即座に確認。引越し・不動産購入前の学区確認に。子育て世帯向け無料ツール。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/school-district",
    siteName: "山田ツール",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "学区チェッカー",
      "url": "https://yamada-tools.jp/realestate/school-district",
      "description": "住所を入力するだけで小学校区・中学校区を即座に確認できる無料ツール。引越し・不動産購入前の学区確認に。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "学区チェッカー", "item": "https://yamada-tools.jp/realestate/school-district" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "学区の調べ方",
      "description": "住所を入力するだけで小学校区・中学校区を無料で確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい住所を入力欄に入力します。番地まで入力するとより正確な学区が表示されます。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「学区を調べる」ボタンをクリックします。" },
        { "@type": "HowToStep", "position": 3, "name": "学校名を確認", "text": "小学校区（校名・設置者・住所）と中学校区が同時に表示されます。Googleマップリンクで場所も確認できます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "学区とは何ですか？なぜ重要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "学区（通学区域）とは、公立小学校・中学校に通う際に住所によって決まる通学エリアのことです。子どもが通う学校が住所によって決まるため、引越しや不動産購入の際に非常に重要な情報です。人気の学区の物件は不動産価値が高くなる傾向があり、教育環境を重視する子育て世帯にとって住まい選びの重要な判断基準となります。" }
        },
        {
          "@type": "Question",
          "name": "学区は変更されることがありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、学区は変更される場合があります。少子化による学校統廃合、新設学校の開校、区画整理などにより市区町村の教育委員会が学区を変更することがあります。このツールのデータは国土交通省のデータベースに基づきますが、最新情報は必ず各市区町村の教育委員会にご確認ください。不動産購入を検討している方は、直接教育委員会に確認することを強くお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "学区外の学校に通うことはできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "多くの市区町村では、申請により学区外の学校（区域外就学）を選択できる制度があります。ただし、受け入れ可能かどうかは各学校の状況によります。また、私立学校は通常学区制を採用していないため、どの住所からでも受験・入学できます。詳細は各市区町村の教育委員会にお問い合わせください。" }
        },
        {
          "@type": "Question",
          "name": "データが見つからない・学区が表示されない場合は？",
          "acceptedAnswer": { "@type": "Answer", "text": "一部の自治体では、学区データが国土交通省の国土数値情報データベースに未登録の場合があります。特に小規模な市区町村や、最近学区が改編されたエリアでデータが存在しない場合があります。その場合はお住まいの市区町村の教育委員会ウェブサイトをご確認いただくか、直接電話でお問い合わせください。" }
        },
        {
          "@type": "Question",
          "name": "私立学校の学区は確認できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "このツールは公立小学校・公立中学校の学区（通学区域）のみに対応しています。私立学校は通学区域制を採用していないため、学区という概念がありません。私立学校への進学をお考えの場合は、各学校の入試要項をご確認ください。" }
        },
        {
          "@type": "Question",
          "name": "引越し先の学区を事前に調べる方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "引越し先の住所（または番地）をこのツールに入力するだけで、小学校区・中学校区を事前に確認できます。不動産の内見前に住所を確認してから学区を調べておくことで、子どもの学校環境を踏まえた住まい選びができます。ただし、最終確認は必ず各市区町村の教育委員会にお願いします。" }
        },
        {
          "@type": "Question",
          "name": "このツールのデータはどこから取得していますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "国土交通省「不動産情報ライブラリ API」の小学校区データ（XKT004）と中学校区データ（XKT005）を使用しています。これらは国土数値情報として整備されたデータです。なお、学校ポイントデータ（XKT006）は非商用のみ利用可能なため使用していません。" }
        }
      ]
    }
  ]
};

export default function SchoolDistrictPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SchoolDistrictClient />
    </>
  );
}
