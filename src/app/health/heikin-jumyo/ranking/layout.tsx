import { Metadata } from "next";

export const metadata: Metadata = {
  title: "平均寿命ランキング【都道府県別2020年】男女別長寿県・短命県",
  description: "47都道府県の平均寿命ランキング。男性1位は滋賀県（82.73歳）、女性1位は岡山県（88.29歳）。厚生労働省 令和2年都道府県別生命表データ。",
  alternates: { canonical: "https://yamada-tools.jp/health/heikin-jumyo/ranking" },
  openGraph: {
    title: "平均寿命ランキング【都道府県別2020年】",
    description: "47都道府県の平均寿命を男女別にランキング。厚生労働省データ準拠。",
    url: "https://yamada-tools.jp/health/heikin-jumyo/ranking",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
