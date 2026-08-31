import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HoujinZaimuClient from "./client";

export const metadata: Metadata = {
  title: "法人財務情報ツール【無料】売上・利益・株主を法人番号で検索｜gBizINFO",
  description: "13桁の法人番号から売上高・営業利益・純利益・総資産などの経営指標と主要株主情報を無料で検索。経済産業省gBizINFO公式データ。登録不要。",
  keywords: ["法人財務情報", "企業財務", "売上高", "営業利益", "主要株主", "法人番号", "gBizINFO", "無料"],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }], title: "法人財務情報ツール【無料】", description: "法人番号から売上高・利益・総資産・主要株主を無料で確認。", type: "website" },
  alternates: { canonical: "https://yamada-tools.jp/business/houjin-zaimu" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: "法人財務情報ツール", url: "https://yamada-tools.jp/business/houjin-zaimu",
      description: "法人番号から企業の財務情報を無料で検索できるツール", applicationCategory: "BusinessApplication",
      operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      { "@type": "ListItem", position: 2, name: "ビジネスツール", item: "https://yamada-tools.jp/business" },
      { "@type": "ListItem", position: 3, name: "法人財務情報", item: "https://yamada-tools.jp/business/houjin-zaimu" },
    ]},
    { "@type": "HowTo", name: "法人財務情報の調べ方", step: [
      { "@type": "HowToStep", position: 1, text: "調べたい企業の13桁の法人番号を用意する（yamada-tools.jpの法人検索ツールで検索可能）" },
      { "@type": "HowToStep", position: 2, text: "法人番号を入力して検索」をクリック" },
      { "@type": "HowToStep", position: 3, text: "売上高・利益・総資産の年次推移と主要株主情報を確認する" },
    ]},
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "財務情報ツールはどんな情報が確認できますか？",
        acceptedAnswer: { "@type": "Answer", text: "売上高・営業利益・純利益・総資産などの経営指標（複数年分）、主要株主と持株比率が確認できます。" } },
      { "@type": "Question", name: "このツールは無料で使えますか？",
        acceptedAnswer: { "@type": "Answer", text: "はい、完全無料・登録不要でご利用いただけます。" } },
    ]},
  ],
};

const tool = getToolById("houjin-zaimu");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoujinZaimuClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
