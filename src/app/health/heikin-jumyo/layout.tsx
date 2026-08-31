import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 平均寿命ランキング【無料】男女別・公的統計データ",
  description: "47都道府県の平均寿命データを公的統計から検索。男女別・ランキング表示。移住先選びや健康意識向上に。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/health/heikin-jumyo" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "都道府県別 平均寿命ランキング【無料】男女別・公的統計データ",
    description: "47都道府県の平均寿命データを公的統計から検索。男女別・ランキング表示。移住先選びや健康意識向上に。無料・登録不要。",
    url: "https://yamada-tools.jp/health/heikin-jumyo",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
