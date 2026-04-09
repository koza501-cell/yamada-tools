import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】所得税・住民税 計算機｜年収から手取りを自動計算",
  description: "年収・家族構成・各種控除を入力するだけで所得税・住民税・手取り額を自動計算。2024年度税制対応の無料シミュレーター。",
  alternates: { canonical: "https://yamada-tools.jp/tax/income-tax-calculator" },
  openGraph: { url: "https://yamada-tools.jp/tax/income-tax-calculator", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E6%89%80%E5%BE%97%E7%A8%8E%E3%83%BB%E4%BD%8F%E6%B0%91%E7%A8%8E%20%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E5%B9%B4%E5%8F%8E%E3%81%8B%E3%82%89%E6%89%8B%E5%8F%96%E3%82%8A%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "所得税・住民税計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収・家族構成・各種控除を入力するだけで所得税・住民税・手取り額を自動計算。2024年度税制対応。",
      "url": "https://yamada-tools.jp/tax/income-tax-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金・控除計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "所得税計算機", "item": "https://yamada-tools.jp/tax/income-tax-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "年収500万円の所得税・住民税はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "独身・各種控除なしの場合、所得税約157,500円、住民税約284,000円（合計約44万円）です。社会保険料を含めた手取りは約395万円が目安です。" },
        },
        {
          "@type": "Question",
          "name": "配偶者控除はどれくらい節税になりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "配偶者の年収が103万円以下の場合、配偶者控除38万円が適用され、所得税が約5.7万〜19万円（税率15〜50%の場合）節税になります。住民税も約3.8万円の節税効果があります。" },
        },
        {
          "@type": "Question",
          "name": "所得税と住民税の計算方法はどう違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "所得税は5%〜45%の累進課税。住民税は所得割10%（一律）＋均等割5,000円（自治体により異なる）の構造です。所得税は当年分をその年に納付、住民税は前年所得を翌年6月から納付します。" },
        },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
