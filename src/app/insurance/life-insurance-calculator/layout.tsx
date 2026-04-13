import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】生命保険 必要保障額計算機｜万が一に必要な保険金額を診断",
  description: "生命保険の必要保障額を無料で簡単計算。年収・家族構成・貯蓄・住宅ローンを入力するだけで万が一に必要な保険金額を自動診断。",
  alternates: { canonical: "https://yamada-tools.jp/insurance/life-insurance-calculator" },
  openGraph: { url: "https://yamada-tools.jp/insurance/life-insurance-calculator", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E7%94%9F%E5%91%BD%E4%BF%9D%E9%99%BA%20%E5%BF%85%E8%A6%81%E4%BF%9D%E9%9A%9C%E9%A1%8D%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E4%B8%87%E3%81%8C%E4%B8%80%E3%81%AB%E5%BF%85%E8%A6%81%E3%81%AA%E4%BF%9D%E9%99%BA%E9%87%91%E9%A1%8D%E3%82%92%E8%A8%BA%E6%96%AD" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "生命保険必要保障額計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "生命保険の必要保障額を無料で簡単計算。年収・家族構成・貯蓄・住宅ローンを入力するだけで万が一に必要な保険金額を自動診断。",
      "url": "https://yamada-tools.jp/insurance/life-insurance-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "保険・リスク管理", "item": "https://yamada-tools.jp/insurance" },
        { "@type": "ListItem", "position": 3, "name": "生命保険必要保障額計算機", "item": "https://yamada-tools.jp/insurance/life-insurance-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "生命保険の必要保障額はどう計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "必要保障額 = 遺族の生活費（末子独立まで） + 教育費 + 葬儀費用 + 住宅ローン残高 − 貯蓄 − 遺族年金受給額です。年収・家族構成・ローン残高を入力すると自動計算できます。" },
        },
        {
          "@type": "Question",
          "name": "子どもがいる場合、生命保険はいくら必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "子ども1人（0歳）・年収500万円・住宅ローンなしの場合、必要保障額は約3,000〜5,000万円が目安です。ただし配偶者の就労状況・遺族年金額・貯蓄によって大きく変わります。" },
        },
        {
          "@type": "Question",
          "name": "遺族年金はいくらもらえますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "遺族基礎年金は子のある配偶者に年額約102万円＋子の加算。会社員の場合は遺族厚生年金も加わり、年収によって異なりますが月10〜20万円程度が受給できます。この金額を保険金で補う部分を試算します。" },
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
