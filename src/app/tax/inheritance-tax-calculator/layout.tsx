import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】相続税 簡易計算機｜基礎控除・配偶者控除を自動計算",
  description: "遺産総額と相続人の人数を入力するだけで相続税を簡単計算。基礎控除・配偶者控除・法定相続分を自動反映。2024年度税制対応の無料シミュレーター。",
  alternates: { canonical: "https://yamada-tools.jp/tax/inheritance-tax-calculator" },
  openGraph: { url: "https://yamada-tools.jp/tax/inheritance-tax-calculator", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E7%9B%B8%E7%B6%9A%E7%A8%8E%20%E7%B0%A1%E6%98%93%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E5%9F%BA%E7%A4%8E%E6%8E%A7%E9%99%A4%E3%83%BB%E9%85%8D%E5%81%B6%E8%80%85%E6%8E%A7%E9%99%A4%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "相続税簡易計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "遺産総額と相続人の人数を入力するだけで相続税を簡単計算。基礎控除・配偶者控除・法定相続分を自動反映。",
      "url": "https://yamada-tools.jp/tax/inheritance-tax-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金・控除計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "相続税計算機", "item": "https://yamada-tools.jp/tax/inheritance-tax-calculator" },
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
