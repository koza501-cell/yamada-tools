import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 書類作成プラン・料金",
  description: "相続登記の書類作成プランと料金一覧。自分で申請したい方向けのサポートプランをご用意。司法書士より安く手続きできます。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/pricing" },
  openGraph: {
    title: "相続登記 書類作成プラン・料金",
    description: "相続登記の書類作成プランと料金一覧。自分で申請したい方向けのサポートプランをご用意。司法書士より安く手続きできます。",
    url: "https://yamada-tools.jp/souzoku-touki/pricing",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
