import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 平均年収検索【2023年最新】業種・年齢別データ | 山田ツール",
  description:
    "都道府県・年齢・業種・性別で絞り込める平均年収検索ツール。政府統計（賃金構造基本統計調査）をもとに47都道府県の年収ランキングや年齢別推移を無料で確認できます。",
  keywords: [
    "平均年収",
    "都道府県別 年収",
    "年収 ランキング",
    "都道府県 給与",
    "業種別 年収",
    "年齢別 年収",
    "e-Stat 賃金",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/heikin-nenshu",
  },
  openGraph: {
    title: "都道府県別 平均年収検索【2023年最新】",
    description:
      "47都道府県の平均年収を業種・年齢・性別で比較。政府統計データ準拠。",
    url: "https://yamada-tools.jp/finance/heikin-nenshu",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function HeikinNenshuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
