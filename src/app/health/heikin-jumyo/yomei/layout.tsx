import { Metadata } from "next";

export const metadata: Metadata = {
  title: "余命計算ツール【都道府県別・年齢別】あと何年生きられる？",
  description: "現在の年齢・性別・都道府県を入力すると統計的な余命を計算。厚生労働省の完全生命表・都道府県別生命表に基づく推計。年金・相続計画の参考に。",
  alternates: { canonical: "https://yamada-tools.jp/health/heikin-jumyo/yomei" },
  openGraph: {
    title: "余命計算ツール【都道府県別・年齢別】",
    description: "年齢・性別・都道府県から統計的な余命を計算。厚生労働省データ準拠。",
    url: "https://yamada-tools.jp/health/heikin-jumyo/yomei",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function YomeiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
