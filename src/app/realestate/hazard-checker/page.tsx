import { Metadata } from "next";
import HazardClient from "./client";

export const metadata: Metadata = {
  title: "ハザードマップチェッカー — 住所で洪水・土砂・津波リスクを確認 | 山田ツール",
  description:
    "住所を入力するだけで洪水・土砂災害・液状化・津波・高潮の5つのリスクを一括確認。国土交通省データ使用。不動産購入・引越し前の防災確認に。完全無料・登録不要。",
  keywords: [
    "ハザードマップ 調べ方",
    "ハザードマップ 住所 検索",
    "洪水リスク 確認 無料",
    "土砂災害 危険区域 調べる",
    "液状化 リスク 確認",
    "津波 浸水 住所",
    "ハザードマップ 不動産 購入前",
    "防災 確認 引越し前",
    "ハザードマップ スマホ 簡単",
    "洪水浸水想定区域 確認",
    "土砂災害警戒区域 調べ方",
    "ハザードマップ Mac 確認",
    "hazard map Japan English",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate/hazard-checker" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "ハザードマップチェッカー — 5つの災害リスクを一括確認",
    description: "住所だけで洪水・土砂・液状化・津波・高潮リスクを即座に確認。国土交通省データ使用、無料。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/hazard-checker",
    siteName: "山田ツール",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "ハザードマップチェッカー",
      "url": "https://yamada-tools.jp/realestate/hazard-checker",
      "description": "住所を入力するだけで洪水・土砂災害・液状化・津波・高潮の5種類の災害リスクを一括確認できる無料ツール。国土交通省不動産情報ライブラリAPIを使用。",
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
        { "@type": "ListItem", "position": 3, "name": "ハザードマップチェッカー", "item": "https://yamada-tools.jp/realestate/hazard-checker" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "ハザードマップの調べ方",
      "description": "住所を入力するだけで5種類の災害リスクを無料で一括確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい住所を入力欄に入力します。番地まで入力するとより正確な結果が得られます。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「ハザードリスクを確認する」ボタンをクリックします。5つのAPIに同時に問い合わせるため数秒かかります。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "洪水・土砂災害・液状化・津波・高潮の5種類のリスクが色分けカードで表示されます。" },
        { "@type": "HowToStep", "position": 4, "name": "詳細を確認", "text": "各リスクカードで浸水深・対象河川・土砂災害の種類など詳細情報を確認できます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ハザードマップとは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "ハザードマップとは、洪水・土砂災害・津波などの自然災害が発生した際に被害が想定される区域や避難場所を示した地図です。国土交通省や各市区町村が作成・公表しており、不動産購入や引越しの際に必ず確認すべき重要な情報です。このツールでは5種類のハザード情報を住所入力だけで一括確認できます。" }
        },
        {
          "@type": "Question",
          "name": "液状化とは何ですか？不動産購入に影響しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "液状化とは、地震の振動により砂や水を多く含む地盤が液体のようになる現象です。埋立地・河川沿い・海岸近くで起きやすく、建物の傾きや沈下、インフラへの被害が生じる可能性があります。不動産購入の際は液状化リスクの高いエリアかどうか必ず確認することをお勧めします。" }
        },
        {
          "@type": "Question",
          "name": "土砂災害警戒区域と特別警戒区域（レッドゾーン）の違いは？",
          "acceptedAnswer": { "@type": "Answer", "text": "土砂災害警戒区域（イエローゾーン）は、土砂災害が発生した場合に住民の生命・身体に危害が生ずる恐れがある区域で、情報伝達や避難が必要です。土砂災害特別警戒区域（レッドゾーン）はさらに危険で、建築物への損壊が生じる可能性があり、建築制限が設けられています。不動産売買の際はレッドゾーンかどうかの確認が特に重要です。" }
        },
        {
          "@type": "Question",
          "name": "洪水リスク「高リスク」と表示されたらどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "洪水リスクが高リスクと表示された場合、まず浸水深（どれくらいの高さまで浸水する可能性があるか）を確認してください。次に、お住まいの市区町村のハザードマップポータルサイト（国土地理院）で詳細を確認し、避難場所・避難経路をあらかじめ確認しておくことをお勧めします。不動産購入検討中であれば、建物の構造や1階の高さも検討材料になります。" }
        },
        {
          "@type": "Question",
          "name": "このツールのデータはどこから来ていますか？最新データですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "国土交通省「不動産情報ライブラリ」のAPI（XKT026〜XKT029、XKT025）を使用しています。データは国土交通省が定期的に更新していますが、最新性・完全性は保証されません。実際の避難行動はお住まいの市区町村の公式ハザードマップをご確認ください。" }
        },
        {
          "@type": "Question",
          "name": "リスクなしと表示されたエリアは安全ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "「リスクなし」の表示は、国土交通省のデータベースに該当するリスク情報が登録されていないことを意味します。ただし、データが整備されていない地域では実際にリスクがあっても表示されない場合があります。また、内水氾濫（下水道の排水能力超過）など本ツールでカバーされていないリスクも存在します。市区町村の公式ハザードマップと合わせてご確認ください。" }
        },
        {
          "@type": "Question",
          "name": "高潮とはどのような災害ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "高潮とは、台風や低気圧による気圧低下と強風により海面が異常に上昇し、海水が陸地に浸入する現象です。特に湾内や河川河口付近で発生しやすく、東京湾・大阪湾・伊勢湾などの沿岸部では注意が必要です。台風シーズン（7〜10月）に特にリスクが高まります。" }
        },
        {
          "@type": "Question",
          "name": "不動産購入前にハザードマップ確認は必須ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2020年8月の宅地建物取引業法改正により、不動産取引の際にはハザードマップを使って水害リスクの説明が義務化されました。法律上の義務として不動産業者が説明しますが、購入者自身も事前に確認することで、より安全な住まい選びができます。このツールで5つのリスクを一括確認してから検討することをお勧めします。" }
        }
      ]
    }
  ]
};

export default function HazardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HazardClient />
    </>
  );
}
