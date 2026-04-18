import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】転職年収シミュレーター｜転職前後の手取り・税金を比較計算 2026年版",
  description: "転職前後の手取り額を正確に比較。社会保険料・所得税・住民税の変化、試用期間の収入損失、損益分岐点まで自動計算。登録不要・完全無料の転職シミュレーター。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/job-change-simulator",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/job-change-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E8%BB%A2%E8%81%B7%E5%B9%B4%E5%8F%8E%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E8%BB%A2%E8%81%B7%E5%89%8D%E5%BE%8C%E3%81%AE%E6%89%8B%E5%8F%96%E3%82%8A%E3%83%BB%E7%A8%8E%E9%87%91%E3%82%92%E6%AF%94%E8%BC%83%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "転職年収シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "転職前後の手取り額・税金・社会保険料の変化を正確に比較。損益分岐点・試用期間の収入損失も計算。2026年最新税制対応。",
      "url": "https://yamada-tools.jp/career/job-change-simulator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "転職年収シミュレーター", "item": "https://yamada-tools.jp/career/job-change-simulator" },
      ],
    },
    {
      "@type": "HowTo",
      "name": "転職後の手取り比較計算方法",
      "description": "現在の年収と転職先の年収から手取り変化を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "現職情報を入力", "text": "現在の年収・賞与・残業代・家族構成を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "転職先情報を入力", "text": "転職先の年収・試用期間・勤務地（都道府県）を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと手取り比較・税金変化・損益分岐点が表示されます。" },
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
