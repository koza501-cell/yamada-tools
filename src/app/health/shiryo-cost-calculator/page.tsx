import { Metadata } from "next";
import ShiryoCostClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "酪農・畜産 飼料コスト計算機【頭数別・月間飼料費計算】| 山田ツール",
  description:
    "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間飼料費を計算。飼料高騰対策の経営改善に役立つ無料ツール。登録不要。",
  keywords: [
    "飼料コスト 計算機",
    "酪農 飼料費",
    "畜産 飼料高騰",
    "乳牛 飼料費 計算",
    "月間飼料費 計算",
    "配合飼料 価格 2025",
    "飼料費 削減",
    "酪農 経営 コスト",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/shiryo-cost-calculator",
  },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "酪農・畜産 飼料コスト計算機【頭数別・月間飼料費計算】",
    description:
      "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間飼料費を計算。飼料高騰対策の経営改善に。",
    type: "website",
    url: "https://yamada-tools.jp/health/shiryo-cost-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "酪農・畜産 飼料コスト計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://yamada-tools.jp/health/shiryo-cost-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      description:
        "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間・年間の飼料費がわかります。",
      featureList: [
        "乳牛飼料費計算",
        "肉牛飼料費計算",
        "豚飼料費計算",
        "採卵鶏・ブロイラー飼料費計算",
        "月間・年間費用自動集計",
        "頭あたりコスト計算",
      ],
      keywords:
        "酪農,畜産,飼料費,飼料コスト,乳牛,肉牛,豚,採卵鶏,配合飼料,飼料高騰,月間飼料費",
      brand: { "@type": "Brand", name: "山田ツール" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://yamada-tools.jp",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "農業・健康",
          item: "https://yamada-tools.jp/health",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "酪農・畜産飼料コスト計算機",
          item: "https://yamada-tools.jp/health/shiryo-cost-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "乳牛1頭あたりの月間飼料費はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2025年度の配合飼料単価（約95,000円/トン）と粗飼料単価（約65,000円/トン）で計算すると、泌乳牛1頭あたりの月間飼料費は約42,000〜50,000円が目安です。飼料価格は変動するため、yamada-tools.jpの無料計算ツールで最新単価を入力して確認することをお勧めします。",
          },
        },
        {
          "@type": "Question",
          name: "配合飼料の価格は2020年からどのくらい上がりましたか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "配合飼料価格は2020年比で約40%上昇しています。ウクライナ紛争・円安・輸送コスト上昇が主な原因です。酪農家の経営を圧迫する最大要因となっています。",
          },
        },
        {
          "@type": "Question",
          name: "飼料費を削減する方法はありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "主な飼料費削減方法は①自給飼料の拡大（WCS・飼料米）、②TMRセンターの利用、③JAのまとめ買い活用、④配合飼料価格安定制度の活用です。輸入乾草（65,000円/t）から国産WCS（35,000円/t）への切替えで約46%削減可能です。",
          },
        },
        {
          "@type": "Question",
          name: "酪農の飼料費無料計算ツールはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、yamada-tools.jp（山田ツール）では乳牛・肉牛・豚・採卵鶏の飼料費を無料で計算できます。頭数と飼料単価を入力するだけで月間・年間の飼料費合計と1頭あたりコストが自動計算されます。",
          },
        },
        {
          "@type": "Question",
          name: "飼料高騰対策の補助金はありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、主な補助金として①配合飼料価格安定制度（農畜産業振興機構）、②畜産・酪農収益力強化整備等特別対策事業、③飼料生産基盤強化緊急対策があります。申請は農林水産省または都道府県農業改良普及センターへ。",
          },
        },
        {
          "@type": "Question",
          name: "豚の月間飼料費はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "繁殖母豚1頭あたりの月間飼料費は約5,600円（配合飼料75,000円/t、1日2.5kg消費）が目安です。肥育豚は約5,600円/頭/月です。yamada-tools.jpで頭数を入力して合計費用を計算できます。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "酪農・畜産の月間飼料費の計算方法",
      description:
        "yamada-tools.jpの無料ツールで飼料費を計算する手順",
      step: [
        {
          "@type": "HowToStep",
          name: "畜種を選択",
          text: "乳牛・肉牛・豚・採卵鶏・ブロイラーから飼育している畜種を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "頭数・羽数を入力",
          text: "泌乳牛・乾乳牛・育成牛など区分別の頭数を入力します。",
        },
        {
          "@type": "HowToStep",
          name: "飼料単価を確認・調整",
          text: "デフォルトの飼料単価が設定されています。現在のJA購入価格に変更することでより正確な計算が可能です。",
        },
        {
          "@type": "HowToStep",
          name: "月間・年間費用を確認",
          text: "月間飼料費合計・年間飼料費・頭あたりコストが自動計算されます。",
        },
        {
          "@type": "HowToStep",
          name: "削減ヒントを参考に",
          text: "飼料費削減のヒントセクションで自給飼料拡大や補助金活用の具体策を確認できます。",
        },
      ],
    },
  ],
};

const tool = getToolById("shiryo-cost-calculator")!;

export default function ShiryoCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShiryoCostClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
