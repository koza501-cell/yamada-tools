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
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "相続税の基礎控除はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "基礎控除額 = 3,000万円 ＋（600万円 × 法定相続人の数）です。例えば法定相続人が配偶者＋子2人の場合、3,000万円＋1,800万円＝4,800万円まで非課税です。" },
        },
        {
          "@type": "Question",
          "name": "配偶者の相続税は優遇されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、配偶者控除により法定相続分または1億6,000万円のいずれか多い金額まで非課税です。多くの場合、配偶者は相続税がゼロになります。ただし二次相続（配偶者が亡くなった時）の税負担増に注意が必要です。" },
        },
        {
          "@type": "Question",
          "name": "相続税の申告期限はいつですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "被相続人（亡くなった方）が死亡したことを知った日の翌日から10ヶ月以内です。期限を過ぎると無申告加算税（最大20%）や延滞税が発生するため注意が必要です。" },
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
