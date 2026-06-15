import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX損益計算機【無料】損益・証拠金・スワップ・確定申告に対応",
  description: "FXの損益・証拠金・スワップポイント・確定申告額を完全対応。複数取引の一括計算も。無料・登録不要・インストール不要。",
  alternates: { canonical: "https://yamada-tools.jp/fx-calculator" },
  openGraph: {
    title: "FX損益計算機【無料】損益・証拠金・スワップ・確定申告に対応",
    description: "FXの損益・証拠金・スワップポイント・確定申告額を完全対応。複数取引の一括計算も。無料・登録不要・インストール不要。",
    url: "https://yamada-tools.jp/fx-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
