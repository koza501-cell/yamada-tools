import { Metadata } from "next";

export const metadata: Metadata = {
  title: "役員報酬最適化ツール【無料】法人税・所得税・社保のバランスで最適額を計算",
  description: "法人税・所得税・社会保険料のバランスから最適な役員報酬額を自動計算。中小企業オーナー・法人化後の節税対策に。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/business/director-salary-optimizer" },
  openGraph: {
    title: "役員報酬最適化ツール【無料】法人税・所得税・社保のバランスで最適額を計算",
    description: "法人税・所得税・社会保険料のバランスから最適な役員報酬額を自動計算。中小企業オーナー・法人化後の節税対策に。無料・登録不要。",
    url: "https://yamada-tools.jp/business/director-salary-optimizer",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
