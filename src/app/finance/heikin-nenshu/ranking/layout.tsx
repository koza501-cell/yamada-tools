import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 平均年収ランキング【2023年最新】47都道府県を比較",
  description:
    "47都道府県の平均年収ランキング。東京・神奈川・大阪などの上位から、沖縄・青森などの下位まで一覧で比較。年齢・業種・性別で絞り込み可能。政府統計準拠。",
  alternates: { canonical: "https://yamada-tools.jp/finance/heikin-nenshu/ranking" },
  openGraph: {
    title: "都道府県別 平均年収ランキング【2023年最新】",
    description: "47都道府県の平均年収を一覧で比較。政府統計（賃金構造基本統計調査）データ準拠。",
    url: "https://yamada-tools.jp/finance/heikin-nenshu/ranking",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
