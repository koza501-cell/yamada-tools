import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】消費税計算機Pro｜税抜・税込・軽減税率8%対応｜複数明細一括計算",
  description: "消費税10%・軽減税率8%に対応した無料計算機。税抜→税込、税込→税抜の両方向計算、複数明細の一括計算、端数処理選択に対応。インボイス制度対応。",
  alternates: { canonical: "https://yamada-tools.jp/tax/consumption-tax" },
  openGraph: { url: "https://yamada-tools.jp/tax/consumption-tax", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E6%B6%88%E8%B2%BB%E7%A8%8E%E8%A8%88%E7%AE%97%E6%A9%9FPro%EF%BD%9C%E7%A8%8E%E6%8A%9C%E3%83%BB%E7%A8%8E%E8%BE%BC%E3%83%BB%E8%BB%BD%E6%B8%9B%E7%A8%8E%E7%8E%878%25%E5%AF%BE%E5%BF%9C%EF%BD%9C%E8%A4%87%E6%95%B0%E6%98%8E%E7%B4%B0%E4%B8%80%E6%8B%AC%E8%A8%88%E7%AE%97" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "消費税計算機Pro",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "消費税10%・軽減税率8%に対応した無料計算機。税抜→税込、税込→税抜の両方向計算、複数明細の一括計算、端数処理選択に対応。インボイス制度対応。",
      "url": "https://yamada-tools.jp/tax/consumption-tax",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金・控除計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "消費税計算機", "item": "https://yamada-tools.jp/tax/consumption-tax" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "消費税の軽減税率8%はどの商品に適用されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "軽減税率8%は飲食料品（酒類・外食を除く）と週2回以上発行される新聞（定期購読）に適用されます。それ以外の商品・サービスは標準税率10%が適用されます。" },
        },
        {
          "@type": "Question",
          "name": "インボイス制度で消費税計算はどう変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2023年10月からインボイス制度が開始し、適格請求書（インボイス）に消費税額を明記する必要があります。端数処理は1枚の請求書につき1回のみ（切り捨て・切り上げ・四捨五入のいずれか）です。" },
        },
        {
          "@type": "Question",
          "name": "税込み価格から税抜き価格を計算する方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "税率10%の場合：税抜き価格 = 税込み価格 ÷ 1.1。税率8%の場合：税抜き価格 = 税込み価格 ÷ 1.08。例えば税込み1,100円なら税抜き1,000円です。" },
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
