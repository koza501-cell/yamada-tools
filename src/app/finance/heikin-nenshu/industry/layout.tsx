import { Metadata } from "next";

export const metadata: Metadata = {
  title: "業種別 平均年収ランキング【2023年最新】金融・IT・医療など比較",
  description:
    "業種（産業）別の平均年収ランキング。情報通信業・金融業・医療・建設など主要業種の年収を都道府県・年齢・性別で比較。政府統計（賃金構造基本統計調査 2023年）準拠。",
  alternates: { canonical: "https://yamada-tools.jp/finance/heikin-nenshu/industry" },
  openGraph: {
    title: "業種別 平均年収ランキング【2023年最新】",
    description: "業種ごとの平均年収を全国・都道府県・年齢・性別で比較。政府統計準拠。",
    url: "https://yamada-tools.jp/finance/heikin-nenshu/industry",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
