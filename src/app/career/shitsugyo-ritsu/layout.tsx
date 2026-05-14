import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 失業率ランキング【都道府県別比較】完全失業率・有効求人倍率",
  description: "47都道府県の完全失業率をランキング。沖縄・大阪・福岡（高い）vs 島根・福井・富山（低い）を総務省国勢調査データで比較。有効求人倍率も掲載。",
  alternates: { canonical: "https://yamada-tools.jp/career/shitsugyo-ritsu" },
  openGraph: {
    title: "都道府県別 失業率ランキング【都道府県別比較】",
    description: "47都道府県の完全失業率・有効求人倍率を比較。総務省データ準拠。",
    url: "https://yamada-tools.jp/career/shitsugyo-ritsu",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ShitsugyoRitsuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
