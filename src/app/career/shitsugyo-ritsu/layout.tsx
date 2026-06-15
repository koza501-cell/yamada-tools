import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 失業率ランキング【無料】公的統計データで検索",
  description: "47都道府県の失業率データを公的統計から検索。ランキング・地域比較表示。移住・就職活動の参考に。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/career/shitsugyo-ritsu" },
  openGraph: {
    title: "都道府県別 失業率ランキング【無料】公的統計データで検索",
    description: "47都道府県の失業率データを公的統計から検索。ランキング・地域比較表示。移住・就職活動の参考に。無料・登録不要。",
    url: "https://yamada-tools.jp/career/shitsugyo-ritsu",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
