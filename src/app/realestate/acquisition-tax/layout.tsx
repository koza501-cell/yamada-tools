import { Metadata } from "next";

export const metadata: Metadata = {
  title: "不動産取得税計算機【無料】土地・建物の取得税を自動計算",
  description: "不動産購入時の取得税を無料計算。新築・中古・土地・建物別に対応。軽減措置・控除額も自動反映。登録不要・インストール不要。",
  alternates: { canonical: "https://yamada-tools.jp/realestate/acquisition-tax" },
  openGraph: {
    title: "不動産取得税計算機【無料】土地・建物の取得税を自動計算",
    description: "不動産購入時の取得税を無料計算。新築・中古・土地・建物別に対応。軽減措置・控除額も自動反映。登録不要・インストール不要。",
    url: "https://yamada-tools.jp/realestate/acquisition-tax",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
