import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 平均寿命ランキング【2020年最新データ】男女別比較 | 山田ツール",
  description: "47都道府県の平均寿命を男女別にランキング。長寿の都道府県・短命の都道府県を厚生労働省の令和2年都道府県別生命表データで比較。余命計算も対応。",
  alternates: { canonical: "https://yamada-tools.jp/health/heikin-jumyo" },
  openGraph: {
    title: "都道府県別 平均寿命ランキング【2020年最新データ】",
    description: "47都道府県の平均寿命を男女別に比較。厚生労働省データ準拠。",
    url: "https://yamada-tools.jp/health/heikin-jumyo",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function HeikinJumyoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
