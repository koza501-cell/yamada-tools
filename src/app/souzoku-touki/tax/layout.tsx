import { Metadata } from "next";

export const metadata: Metadata = {
  title: "登録免許税計算機【無料】相続登記の登録免許税を自動計算",
  description: "相続登記にかかる登録免許税を無料計算。固定資産税評価額から税額を自動算出。免税措置にも対応。登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/tax" },
  openGraph: {
    title: "登録免許税計算機【無料】相続登記の登録免許税を自動計算",
    description: "相続登記にかかる登録免許税を無料計算。固定資産税評価額から税額を自動算出。免税措置にも対応。登録不要。",
    url: "https://yamada-tools.jp/souzoku-touki/tax",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
