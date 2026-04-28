import { Metadata } from "next";

export const metadata: Metadata = {
  title: "年齢ピラミッド【都道府県別・年別】人口構成を可視化 | 山田ツール",
  description: "都道府県別・年別の年齢ピラミッドを可視化。男女別・5歳階級別人口を政府統計（e-Stat）データで確認。1980〜2024年まで選択可能。",
  alternates: { canonical: "https://yamada-tools.jp/finance/jinko-suikei/age-pyramid" },
  openGraph: {
    title: "年齢ピラミッド【都道府県別・年別】",
    description: "都道府県の年齢別人口構成を可視化。政府統計準拠。",
    url: "https://yamada-tools.jp/finance/jinko-suikei/age-pyramid",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function AgePyramidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
