import { Metadata } from "next";

export const metadata: Metadata = {
  title: "賃貸vs購入 徹底比較【無料】生涯コストをシミュレーション",
  description: "賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・売却後の実質コストまで計算。不動産会社バイアスなし。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/realestate/rent-vs-buy" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "賃貸vs購入 徹底比較【無料】生涯コストをシミュレーション",
    description: "賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・売却後の実質コストまで計算。不動産会社バイアスなし。無料・登録不要。",
    url: "https://yamada-tools.jp/realestate/rent-vs-buy",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
