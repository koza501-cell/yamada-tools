import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 平均年収ランキング【無料】公的統計データで検索",
  description: "47都道府県の平均年収・所得データを公的統計（e-Stat）から検索。地図表示・ランキング・業種別比較。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/finance/heikin-nenshu" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "都道府県別 平均年収ランキング【無料】公的統計データで検索",
    description: "47都道府県の平均年収・所得データを公的統計（e-Stat）から検索。地図表示・ランキング・業種別比較。無料・登録不要。",
    url: "https://yamada-tools.jp/finance/heikin-nenshu",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
