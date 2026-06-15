import { Metadata } from "next";

export const metadata: Metadata = {
  title: "フリーランス税金計算機【無料】所得税・住民税・国保を一括計算",
  description: "フリーランス・個人事業主の所得税・住民税・国民健康保険料を一括計算。確定申告前の手取り試算に。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/business/freelance-tax-calculator" },
  openGraph: {
    title: "フリーランス税金計算機【無料】所得税・住民税・国保を一括計算",
    description: "フリーランス・個人事業主の所得税・住民税・国民健康保険料を一括計算。確定申告前の手取り試算に。無料・登録不要。",
    url: "https://yamada-tools.jp/business/freelance-tax-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
