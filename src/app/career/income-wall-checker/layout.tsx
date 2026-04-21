import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】年収の壁 診断ツール｜103万・130万・178万円の壁を一括チェック 2026年版",
  description: "年収を入力するだけで6つの年収の壁（100万・103万・106万・130万・150万・178万円）を一括診断。2026年税制改正（178万円の壁）完全対応。手取りが逆転しない年収帯もわかります。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/income-wall-checker",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/income-wall-checker",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%B9%B4%E5%8F%8E%E3%81%AE%E5%A3%81%20%E8%A8%BA%E6%96%AD%E3%83%84%E3%83%BC%E3%83%AB%EF%BD%9C103%E4%B8%87%E3%83%BB130%E4%B8%87%E3%83%BB178%E4%B8%87%E5%86%86%E3%81%AE%E5%A3%81%E3%82%92%E4%B8%80%E6%8B%AC%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "年収の壁 診断ツール",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収の壁（103万・106万・130万・150万・178万円）を一括診断。手取り逆転リスクと2026年税制改正の影響を計算。",
      "url": "https://yamada-tools.jp/career/income-wall-checker",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "年収の壁 診断ツール", "item": "https://yamada-tools.jp/career/income-wall-checker" },
      ],
    },
    {
      "@type": "HowTo",
      "name": "年収の壁チェック方法",
      "description": "年収を入力して年収の壁への影響を診断する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "配偶者の有無・勤務先の従業員規模・現在の年収（または目標年収）を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "診断ボタンを押す", "text": "「診断する」を押すと各年収の壁への影響と手取り額の変化が表示されます。" },
        { "@type": "HowToStep", "position": 3, "name": "安全な年収帯を確認", "text": "手取りが逆転しない年収帯と、損益分岐点を確認して働き方を計画します。" },
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
