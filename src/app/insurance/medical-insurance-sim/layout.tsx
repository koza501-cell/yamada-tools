import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】医療保険 入院給付金シミュレーター｜入院費用の自己負担を簡単計算",
  description: "入院日数・日額・手術の有無を入力するだけで医療保険の給付金と実質自己負担額を自動計算。高額療養費制度も考慮した無料シミュレーター。",
  alternates: { canonical: "https://yamada-tools.jp/insurance/medical-insurance-sim" },
  openGraph: { url: "https://yamada-tools.jp/insurance/medical-insurance-sim", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%8C%BB%E7%99%82%E4%BF%9D%E9%99%BA%20%E5%85%A5%E9%99%A2%E7%B5%A6%E4%BB%98%E9%87%91%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E5%85%A5%E9%99%A2%E8%B2%BB%E7%94%A8%E3%81%AE%E8%87%AA%E5%B7%B1%E8%B2%A0%E6%8B%85%E3%82%92%E7%B0%A1%E5%8D%98%E8%A8%88%E7%AE%97" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "医療保険入院給付金シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "入院日数・日額・手術の有無を入力するだけで医療保険の給付金と実質自己負担額を自動計算。高額療養費制度も考慮。",
      "url": "https://yamada-tools.jp/insurance/medical-insurance-sim",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "保険・リスク管理", "item": "https://yamada-tools.jp/insurance" },
        { "@type": "ListItem", "position": 3, "name": "医療保険シミュレーター", "item": "https://yamada-tools.jp/insurance/medical-insurance-sim" },
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
