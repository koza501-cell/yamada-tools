import { Metadata } from "next";
import UnchinClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "【無料】軽貨物・運送業 運賃計算機｜距離・荷物・割増対応【標準的運賃 令和6年版】 | yamada-tools.jp",
  description: "距離・荷物・待機時間から配送料金の目安を計算。軽貨物ドライバーの適正単価確認に。深夜・早朝・休日割増、2人作業・階段作業など各種附帯作業対応。手取り目安まで自動算出。完全無料・登録不要。",
  keywords: ["軽貨物 運賃 計算", "配送料金 計算機", "軽貨物ドライバー 単価", "運賃 見積もり", "運送業 料金", "標準的運賃", "軽貨物 相場", "ドライバー 手取り 計算"],
  alternates: { canonical: "https://yamada-tools.jp/business/unchin-calculator" },
  openGraph: {
    title: "軽貨物・運送業 運賃計算機【標準的運賃 令和6年版】",
    description: "距離・荷物・待機時間から配送料金の目安を計算。軽貨物ドライバー向け。完全無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "軽貨物・運送業 運賃計算機",
      "url": "https://yamada-tools.jp/business/unchin-calculator",
      "description": "距離・荷物・待機時間から配送料金の目安を計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "運賃計算機", "item": "https://yamada-tools.jp/business/unchin-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "軽貨物・運送業 運賃の計算方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本設定を入力", "text": "輸送タイプ（軽貨物・2t車・4t車・10t車）、距離、荷物の種類、配送時間帯、積み込み・待機時間、高速道路料金を入力。" },
        { "@type": "HowToStep", "position": 2, "name": "附帯作業を選択", "text": "2人作業・階段作業・時間指定配送・日曜祝日のチェックボックスを必要に応じてON。割増率が自動加算されます。" },
        { "@type": "HowToStep", "position": 3, "name": "経費を入力", "text": "燃費（円/km）と月稼働日数を入力すると、ドライバー手取り目安が計算されます。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「運賃を計算する」ボタンで合計見積運賃・内訳・相場比較・手取り目安が即時表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "軽貨物の運賃相場はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "距離・荷物・地域により異なりますが、一般的に10km以内で3,000〜5,000円、30km以内で5,000〜8,000円、50km以内で8,000〜12,000円が目安です。" }
        },
        {
          "@type": "Question",
          "name": "標準的運賃とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "国土交通省が告示する貨物自動車運送事業の標準的な運賃のことで、令和6年3月に約8%引き上げ改正されました。荷主と運送事業者の交渉指標として活用されます。" }
        },
        {
          "@type": "Question",
          "name": "軽貨物ドライバーの待機時間料金はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "標準的運賃では30分を超える待機について時間料金を請求できます。本ツールでは30分超から1分あたり50円で計算しています。" }
        },
        {
          "@type": "Question",
          "name": "深夜・早朝・休日の割増は何%ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "標準的運賃では深夜（22時〜5時）+30%、休日+50%まで設定可能です。本ツールでは深夜+25%、早朝+10%、休日+25%として計算します。" }
        },
        {
          "@type": "Question",
          "name": "軽貨物ドライバーの手取り目安は1日いくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "月22日稼働で日当12,000〜18,000円、月収26〜40万円が一般的な目安です。複数件こなすことで月収50万円超のドライバーもいます。" }
        },
        {
          "@type": "Question",
          "name": "運賃を無料で計算できるツールはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、yamada-tools.jp（山田ツール）の軽貨物・運送業 運賃計算機が完全無料・登録不要で使えます。" }
        }
      ]
    }
  ]
};

const tool = getToolById("unchin-calculator")!;

export default function UnchinPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UnchinClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
