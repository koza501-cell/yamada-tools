import { Metadata } from "next";

export const metadata: Metadata = {
  title: "登録免許税計算機【相続登記】固定資産評価額から自動計算",
  description: "相続登記の登録免許税を自動計算。固定資産評価額×0.4%を瞬時に計算。複数不動産対応・100万円以下免税判定・計算式の内訳表示。無料・登録不要。",
  keywords: ["登録免許税 計算", "相続登記 登録免許税", "固定資産評価額 0.4%"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/tax" },
  openGraph: {
    title: "登録免許税計算機【相続登記】",
    description: "固定資産評価額×0.4%を自動計算。複数不動産対応。無料。",
    url: "https://yamada-tools.jp/souzoku-touki/tax",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
