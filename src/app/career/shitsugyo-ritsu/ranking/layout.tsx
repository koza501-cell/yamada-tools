import { Metadata } from "next";

export const metadata: Metadata = {
  title: "失業率ランキング【都道府県別2020年】完全失業率・有効求人倍率比較",
  description: "47都道府県の完全失業率ランキング。最低は島根県2.7%、最高は沖縄県5.5%（2020年国勢調査）。有効求人倍率（2024年最新）も一覧。",
  alternates: { canonical: "https://yamada-tools.jp/career/shitsugyo-ritsu/ranking" },
  openGraph: {
    title: "失業率ランキング【都道府県別2020年】",
    description: "47都道府県の完全失業率・有効求人倍率ランキング。総務省データ準拠。",
    url: "https://yamada-tools.jp/career/shitsugyo-ritsu/ranking",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
