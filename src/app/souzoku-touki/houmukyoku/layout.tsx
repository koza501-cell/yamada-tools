import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管轄法務局検索【無料】住所から管轄を即座に確認",
  description: "住所から管轄法務局を即座に検索。相続登記・不動産登記の申請先を確認。全国対応・無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/houmukyoku" },
  openGraph: {
    title: "管轄法務局検索【無料】住所から管轄を即座に確認",
    description: "住所から管轄法務局を即座に検索。相続登記・不動産登記の申請先を確認。全国対応・無料・登録不要。",
    url: "https://yamada-tools.jp/souzoku-touki/houmukyoku",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
