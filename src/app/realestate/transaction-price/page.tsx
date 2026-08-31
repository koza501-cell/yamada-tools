import { Metadata } from "next";
import TransactionPriceClient from "./client";

export const metadata: Metadata = {
  title: "不動産取引価格チェッカー — 住所で実際の売買価格を確認 | 山田ツール",
  description:
    "住所を入力するだけで近隣の実際の不動産売買取引価格を確認。土地・マンション・一戸建ての㎡単価・坪単価・取引総額を表示。売却・購入前の相場調査に。国土交通省データ使用、完全無料。",
  keywords: [
    "不動産 取引価格 調べ方 無料",
    "土地 売買価格 相場 確認",
    "マンション 取引価格 住所 検索",
    "一戸建て 売却 相場 調べる",
    "不動産 坪単価 確認",
    "国土交通省 取引価格 検索",
    "不動産 売却 価格 目安",
    "土地 買取 相場 チェック",
    "マンション 売却 相場 スマホ",
    "実勢価格 調べ方",
    "不動産 成約価格 確認",
    "レインズ 取引価格 代替",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate/transaction-price" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "不動産取引価格チェッカー — 住所で実際の売買相場を確認",
    description: "住所だけで近隣の不動産実取引価格を確認。㎡単価・坪単価・総額表示。土地・マンション・一戸建て対応。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/transaction-price",
    siteName: "山田ツール",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "不動産取引価格チェッカー",
      "url": "https://yamada-tools.jp/realestate/transaction-price",
      "description": "住所を入力するだけで近隣の実際の不動産売買取引価格を確認できる無料ツール。土地・マンション・一戸建ての㎡単価・坪単価・取引総額を表示。",
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
        { "@type": "ListItem", "position": 3, "name": "不動産取引価格チェッカー", "item": "https://yamada-tools.jp/realestate/transaction-price" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "不動産取引価格の調べ方",
      "description": "住所を入力するだけで近隣の実際の売買取引価格を無料で確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい住所を入力欄に入力します。番地まで入力するとより近いエリアの取引データが表示されます。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「取引価格を調べる」ボタンをクリックします。直近約1.5年分の取引データを検索します。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "エリアの㎡単価・坪単価・取引総額の平均・最安値・最高値と、近隣の具体的な取引事例が表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "取引価格情報とは何ですか？地価公示との違いは？",
          "acceptedAnswer": { "@type": "Answer", "text": "取引価格情報は、実際に行われた不動産売買の価格を国土交通省が収集・加工して公表したデータです。地価公示が「公的な基準価格」であるのに対し、取引価格情報は「実際に売買された価格」のため、より市場の実態を反映しています。ただし、個別の取引条件（急売・特殊関係者間取引など）が含まれる場合もあるため、複数の事例を参考にすることをお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "このツールで確認できる取引はどの期間のものですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "直近約1.5年分（2024年第1四半期〜2025年第2四半期）の取引データを表示しています。国土交通省が四半期ごとに更新するデータを使用しており、比較的新しい市場動向を確認できます。" }
        },
        {
          "@type": "Question",
          "name": "土地・マンション・一戸建てのどれが検索できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "宅地（土地のみ）・中古マンション・一戸建て（土地と建物）・農地・林地など、幅広い種別の取引データを確認できます。エリアによって取引件数が異なりますが、都市部では複数の種別の取引事例を確認できます。" }
        },
        {
          "@type": "Question",
          "name": "マンション売却の相場を調べたい場合はどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "売却を検討しているマンションの住所を入力してください。周辺エリアの中古マンション取引事例（取引総額・㎡単価・面積・間取り・築年数）が表示されます。ただし、同じエリアでも階数・向き・管理状態などで価格は大きく変わります。このツールの結果はあくまで参考値として、不動産会社への査定依頼と合わせてご利用ください。" }
        },
        {
          "@type": "Question",
          "name": "取引件数が少ない・データが見つからない場合は？",
          "acceptedAnswer": { "@type": "Answer", "text": "地方・農村部など取引が少ないエリアでは、直近1.5年以内の取引データが存在しない場合があります。その場合は、より広い範囲（市区町村名のみ）での検索をお試しください。また、国土交通省の「不動産情報ライブラリ」で過去データを含む詳細検索も可能です。" }
        },
        {
          "@type": "Question",
          "name": "レインズ（REINS）のデータと違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "レインズ（不動産流通標準情報システム）は不動産会社のみがアクセスできる成約情報データベースです。一方、このツールが使用する国土交通省の取引価格情報は一般に公開されており、個人でも無料で確認できます。レインズのデータの一部も国土交通省を通じて成約価格情報として公開されており、このツールにも含まれています。" }
        },
        {
          "@type": "Question",
          "name": "取引価格は個人が特定できる情報が含まれますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "いいえ。国土交通省が公表する取引価格情報は、個人のプライバシー保護のため詳細住所は公開されておらず、丁目・大字レベルまでの情報となっています。このツールでも同様に、個人が特定できる情報は表示していません。" }
        }
      ]
    }
  ]
};

export default function TransactionPricePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TransactionPriceClient />
    </>
  );
}
