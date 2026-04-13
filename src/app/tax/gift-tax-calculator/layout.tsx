import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】贈与税 計算機｜暦年課税・相続時精算課税に対応｜住宅資金特例も",
  description: "贈与金額と関係性を入力するだけで贈与税を自動計算。暦年課税・相続時精算課税・住宅取得資金贈与の特例に対応。2024年度改正対応の無料シミュレーター。",
  alternates: { canonical: "https://yamada-tools.jp/tax/gift-tax-calculator" },
  openGraph: { url: "https://yamada-tools.jp/tax/gift-tax-calculator", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E8%B4%88%E4%B8%8E%E7%A8%8E%20%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E6%9A%A6%E5%B9%B4%E8%AA%B2%E7%A8%8E%E3%83%BB%E7%9B%B8%E7%B6%9A%E6%99%82%E7%B2%BE%E7%AE%97%E8%AA%B2%E7%A8%8E%E3%81%AB%E5%AF%BE%E5%BF%9C%EF%BD%9C%E4%BD%8F%E5%AE%85%E8%B3%87%E9%87%91%E7%89%B9%E4%BE%8B%E3%82%82" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "贈与税計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "贈与金額と関係性を入力するだけで贈与税を自動計算。暦年課税・相続時精算課税・住宅取得資金贈与の特例に対応。",
      "url": "https://yamada-tools.jp/tax/gift-tax-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金・控除計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "贈与税計算機", "item": "https://yamada-tools.jp/tax/gift-tax-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "贈与税の基礎控除はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "暦年課税の場合、年間110万円まで非課税です。110万円を超えた部分に対して10%〜55%の累進税率で課税されます。" },
        },
        {
          "@type": "Question",
          "name": "親から1000万円もらったら贈与税はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般贈与（祖父母・親以外）の場合：（1000万円-110万円）×40%−125万円=231万円。特例贈与（直系尊属から20歳以上への贈与）の場合：（1000万円-110万円）×30%−90万円=177万円です。" },
        },
        {
          "@type": "Question",
          "name": "相続時精算課税と暦年課税の違いは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "相続時精算課税は2,500万円まで非課税で贈与でき、贈与者が亡くなった時に相続財産に加算して相続税を計算する制度です。2024年改正から年間110万円の基礎控除が追加されました。暦年課税は毎年110万円まで非課税の制度です。" },
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
