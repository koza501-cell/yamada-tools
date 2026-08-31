import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県別 人口推計【無料】将来推計人口を公的統計で確認",
  description: "都道府県の過去人口推移と将来推計人口を公的統計から検索。移住・不動産・事業立地の参考に。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/finance/jinko-suikei" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "都道府県別 人口推計【無料】将来推計人口を公的統計で確認",
    description: "都道府県の過去人口推移と将来推計人口を公的統計から検索。移住・不動産・事業立地の参考に。無料・登録不要。",
    url: "https://yamada-tools.jp/finance/jinko-suikei",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
