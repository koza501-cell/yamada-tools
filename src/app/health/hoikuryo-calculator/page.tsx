import { Metadata } from "next";
import HoikuryoClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "【無料】保育料・幼稚園費用 無償化判定計算機【2026年版】｜世帯年収から月額負担を即計算 | yamada-tools.jp",
  description: "世帯年収・子供の年齢・地域から保育料と幼児教育無償化の適用を判定。認可保育所・認定こども園・幼稚園・認可外施設すべてに対応。第2子・第3子割引、ひとり親世帯にも対応。完全無料・登録不要。2026年最新制度に対応。",
  keywords: ["保育料 無償化 判定", "幼児教育 無償化 計算", "保育料 計算機", "認可保育所 料金", "幼稚園 無償化", "保育料 計算 シミュレーション", "認可外保育施設 補助", "保育料 第2子 第3子"],
  alternates: { canonical: "https://yamada-tools.jp/health/hoikuryo-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "保育料・幼稚園費用 無償化判定計算機【2026年版】",
    description: "世帯年収・子供の年齢から保育料と幼児教育無償化の適用を判定。完全無料・登録不要。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "保育料・幼稚園費用 無償化判定計算機",
      "url": "https://yamada-tools.jp/health/hoikuryo-calculator",
      "description": "世帯年収・子供の年齢から保育料と幼児教育無償化の適用を判定。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "保育料 無償化判定", "item": "https://yamada-tools.jp/health/hoikuryo-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "保育料の無償化判定方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "子供の情報を入力", "text": "子供の年齢（0-5歳）、施設タイプ、第何子かを選択。" },
        { "@type": "HowToStep", "position": 2, "name": "世帯情報を入力", "text": "世帯年収、ひとり親世帯かどうか、お住まいの地域を選択。" },
        { "@type": "HowToStep", "position": 3, "name": "判定ボタンを押す", "text": "「判定する」ボタンをクリックすると、無償化対象・一部補助あり・対象外を即時判定。" },
        { "@type": "HowToStep", "position": 4, "name": "結果確認", "text": "月額保育料の目安、無償化・補助額、実質月額負担、年間負担額が表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "保育料の無償化は2026年も続いていますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、2019年10月から始まった幼児教育・保育の無償化制度は2026年も継続しています。3歳から5歳までの認可保育所・幼稚園・認定こども園は無償、0歳から2歳までは住民税非課税世帯のみ無償です。" }
        },
        {
          "@type": "Question",
          "name": "認可外保育施設の無償化上限はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "3歳から5歳は月額37,000円まで、0歳から2歳の住民税非課税世帯は月額42,000円までが無償化対象です。ただし令和6年10月以降、認可外保育施設指導監督基準を満たしていない施設は対象外となりました。" }
        },
        {
          "@type": "Question",
          "name": "幼稚園の無償化上限はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "新制度未移行の幼稚園は月額25,700円までが無償化対象です。新制度幼稚園・認定こども園は完全無償です。" }
        },
        {
          "@type": "Question",
          "name": "0歳から2歳の保育料はどう決まりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "住民税所得割額に基づく階層区分で決まる応能負担制度です。住民税非課税世帯は無償、それ以外は階層に応じた保育料となります。" }
        },
        {
          "@type": "Question",
          "name": "第2子・第3子の保育料は安くなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "第2子は保育料が半額、第3子以降は無償となります。年収360万円未満世帯は第1子の年齢制限なし。" }
        },
        {
          "@type": "Question",
          "name": "保育料を無料で計算できるツールはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、yamada-tools.jp（山田ツール）の保育料・幼稚園費用 無償化判定計算機が完全無料・登録不要で使えます。" }
        }
      ]
    }
  ]
};

const tool = getToolById("hoikuryo-calculator")!;

export default function HoikuryoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoikuryoClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
