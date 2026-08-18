import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 申請書作成サポート",
  description: "相続登記の申請書を簡単に作成。法務局提出用の書類を自動生成。自分で相続登記を申請したい方向けのサポートツール。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/shinseisho" },
  openGraph: {
    title: "相続登記 申請書作成サポート",
    description: "相続登記の申請書を簡単に作成。法務局提出用の書類を自動生成。自分で相続登記を申請したい方向けのサポートツール。",
    url: "https://yamada-tools.jp/souzoku-touki/shinseisho",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
