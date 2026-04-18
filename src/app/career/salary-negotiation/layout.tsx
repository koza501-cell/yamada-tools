import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】給与交渉シミュレーター｜業界・職種別の市場年収と交渉レンジを計算",
  description: "業界・職種・経験・スキルから市場適正年収と給与交渉レンジ（最低ライン〜ストレッチ目標）を自動計算。交渉トーキングポイントも自動生成。転職・昇給交渉を成功させる無料ツール。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/salary-negotiation",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/salary-negotiation",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E7%B5%A6%E4%B8%8E%E4%BA%A4%E6%B8%89%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E6%A5%AD%E7%95%8C%E3%83%BB%E8%81%B7%E7%A8%AE%E5%88%A5%E3%81%AE%E5%B8%82%E5%A0%B4%E5%B9%B4%E5%8F%8E%E3%81%A8%E4%BA%A4%E6%B8%89%E3%83%AC%E3%83%B3%E3%82%B8%E3%82%92%E8%A8%88%E7%AE%97" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "給与交渉シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "業界・職種・経験から市場適正年収と給与交渉レンジを算出。交渉トーキングポイント自動生成付き。",
      "url": "https://yamada-tools.jp/career/salary-negotiation",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "給与交渉シミュレーター", "item": "https://yamada-tools.jp/career/salary-negotiation" },
      ],
    },
    {
      "@type": "HowTo",
      "name": "給与交渉レンジの計算方法",
      "description": "業界・職種・経験から市場年収と交渉レンジを計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "業界・職種・経験年数・現在の年収・スキルレベルを入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "交渉目標を設定", "text": "現在の職場か転職先か、交渉の種類（昇給・転職・昇格）を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "交渉レンジを確認", "text": "「計算する」を押すと最低ライン・目標額・ストレッチ目標と交渉ポイントが表示されます。" },
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
