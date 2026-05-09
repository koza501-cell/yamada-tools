import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 人口推移・将来予測【2024年最新】e-Stat政府統計 | 山田ツール",
  description: "都道府県ごとの人口推移（1980〜2024年）と将来予測（2050年まで）を可視化。高齢化率・少子化率・増減ランキングを政府統計データで確認。",
  alternates: { canonical: "https://yamada-tools.jp/finance/jinko-suikei" },
  openGraph: {
    title: "都道府県別 人口推移・将来予測【2024年最新】",
    description: "1980〜2050年の都道府県人口推移を政府統計データで可視化。高齢化率・人口ランキングも。",
    url: "https://yamada-tools.jp/finance/jinko-suikei",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function JinkoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
