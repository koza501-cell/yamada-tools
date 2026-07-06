import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管轄法務局検索【相続登記】都道府県・市区町村から検索",
  description: "相続登記の申請先となる管轄法務局を都道府県・市区町村から検索。全国47都道府県対応。住所・電話番号・地図リンク付き。無料・登録不要。",
  keywords: ["法務局 管轄", "相続登記 法務局", "管轄 法務局 検索"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/houmukyoku" },
  openGraph: {
    title: "管轄法務局検索【相続登記】",
    description: "都道府県・市区町村から管轄法務局を検索。全国対応。住所・電話番号付き。",
    url: "https://yamada-tools.jp/souzoku-touki/houmukyoku",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function HoumukyokuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
