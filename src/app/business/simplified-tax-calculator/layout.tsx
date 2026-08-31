import { Metadata } from "next";

export const metadata: Metadata = {
  title: "簡易課税計算機【無料】消費税納税額を自動計算",
  description: "簡易課税制度での消費税納税額を無料計算。みなし仕入率・業種別対応。個人事業主・中小企業向け。登録不要・インストール不要でブラウザだけで完結。",
  alternates: { canonical: "https://yamada-tools.jp/business/simplified-tax-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "簡易課税計算機【無料】消費税納税額を自動計算",
    description: "簡易課税制度での消費税納税額を無料計算。みなし仕入率・業種別対応。個人事業主・中小企業向け。登録不要・インストール不要でブラウザだけで完結。",
    url: "https://yamada-tools.jp/business/simplified-tax-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
