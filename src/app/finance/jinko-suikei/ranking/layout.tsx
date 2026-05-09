import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 人口ランキング【2024年最新】高齢化率・増減率比較 | 山田ツール",
  description: "47都道府県の人口ランキング。人口規模・高齢化率・2020年比増減率を一覧比較。政府統計（e-Stat 社会・人口統計体系）2024年データ。",
  alternates: { canonical: "https://yamada-tools.jp/finance/jinko-suikei/ranking" },
  openGraph: {
    title: "都道府県別 人口ランキング【2024年最新】",
    description: "47都道府県の人口・高齢化率・増減率ランキング。政府統計準拠。",
    url: "https://yamada-tools.jp/finance/jinko-suikei/ranking",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
