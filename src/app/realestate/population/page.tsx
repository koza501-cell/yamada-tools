import { Metadata } from "next";
import PopulationClient from "./client";

export const metadata: Metadata = {
  title: "人口推計チェッカー — 住所で2050年までの人口変化を確認",
  description:
    "住所を入力するだけで2020〜2070年の人口推移・将来推計を確認。人口増加・減少エリアの把握に。不動産購入・移住検討・事業立地の参考に。国土交通省データ使用、完全無料・登録不要。",
  keywords: [
    "人口推計 住所 無料 確認",
    "将来人口 2050年 調べる",
    "人口減少 エリア 確認",
    "不動産 人口動態 調べ方",
    "移住 人口増加 エリア",
    "人口密度 確認 スマホ",
    "人口集中地区 DID 確認",
    "少子高齢化 地域 調べる",
    "不動産投資 人口推計",
    "事業立地 人口動態",
    "人口推計 500mメッシュ",
    "2040年 人口 確認",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate/population" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "人口推計チェッカー — 住所で2050年までの人口変化を確認",
    description: "住所だけで500mメッシュ単位の人口推計（2020〜2070年）を確認。移住・不動産・事業立地の参考に。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/population",
    siteName: "山田ツール",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "人口推計チェッカー",
      "url": "https://yamada-tools.jp/realestate/population",
      "description": "住所を入力するだけで将来推計人口（2020〜2070年）を500mメッシュ単位で確認できる無料ツール。人口増減トレンドと人口集中地区（DID）も表示。",
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
        { "@type": "ListItem", "position": 3, "name": "人口推計チェッカー", "item": "https://yamada-tools.jp/realestate/population" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "将来人口推計の調べ方",
      "description": "住所を入力するだけで将来推計人口を無料で確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい住所を入力欄に入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「人口推計を調べる」ボタンをクリックします。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "2020年から2070年まで5年ごとの人口推計がバーチャートで表示されます。増加傾向か減少傾向かが色分けで一目でわかります。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "将来推計人口データとは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "将来推計人口データは、国土交通省が国勢調査データをもとに500m×500mのメッシュ（約0.25km²）単位で推計した将来の人口データです。2020年から2070年まで5年ごとの人口推計が含まれており、不動産・まちづくり・事業立地・移住先選びの参考として活用できます。" }
        },
        {
          "@type": "Question",
          "name": "人口集中地区（DID）とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "人口集中地区（DID：Densely Inhabited District）とは、人口密度が1km²あたり4,000人以上の基本単位区が互いに隣接し、合計人口が5,000人以上となる地区のことです。都市的な土地利用がなされているエリアの目安となります。不動産投資やビジネス立地の検討に活用できます。" }
        },
        {
          "@type": "Question",
          "name": "人口が減少しているエリアの不動産を購入しても大丈夫ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "人口減少エリアでは将来的に不動産需要が低下し、資産価値が下がる可能性があります。ただし、駅近・利便性の高い立地は人口減少下でも価値を維持しやすいとされています。また、人口減少エリアでも空き家活用やリノベーションで高収益を実現している事例もあります。このツールのデータはあくまで参考値として、総合的に判断されることをお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "移住先を選ぶ際の人口動態の見方を教えてください",
          "acceptedAnswer": { "@type": "Answer", "text": "移住先選びでは、2020〜2050年の人口変化率に注目してください。人口が増加または横ばいのエリアは活気が維持されやすく、行政サービスや商業施設も充実しやすい傾向があります。大幅減少傾向（-30%以上）のエリアは、将来的に行政サービスの縮小や空き家増加が懸念されます。人口推計を地価チェッカーや学区チェッカーと合わせて確認することをお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "データの数値の単位は何ですか？500mメッシュとは？",
          "acceptedAnswer": { "@type": "Answer", "text": "500mメッシュとは、日本の国土を500m×500m（約0.25km²）の格子（メッシュ）に分割したものです。各メッシュに含まれる人口の推計値が表示されます。住宅街・商業地・農地などが混在するメッシュでは、実際の居住人口と異なる場合があります。あくまでエリアの人口動向の参考としてご活用ください。" }
        },
        {
          "@type": "Question",
          "name": "不動産投資で人口推計を活用する方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "不動産投資では、賃貸需要の長期見通しを把握するために人口推計が重要です。人口増加エリアは賃貸需要が維持・拡大する可能性が高く、人口減少エリアでは空室リスクが高まる傾向があります。ただし、人口全体より世帯数（1〜2人世帯の増加）や年齢構成（高齢化率）も重要な指標です。このツールの人口推計を地価・取引価格データと組み合わせて総合的に分析することをお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "このツールはRESAS（地域経済分析システム）と何が違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "RESAS（内閣官房が提供する地域経済分析システム）は市区町村単位の詳細な経済・人口データを提供していますが、住所入力での検索はできません。このツールは住所を入力するだけで500mメッシュ単位の人口推計をすぐに確認でき、より直感的に使えます。不動産探しの流れで素早く確認したい場合に特に便利です。" }
        }
      ]
    }
  ]
};

export default function PopulationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PopulationClient />
    </>
  );
}
