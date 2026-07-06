import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 書類作成プラン【料金】登記申請書・協議書PDF自動生成",
  description: "相続登記の必要書類（登記申請書・遺産分割協議書・相続関係説明図）をPDFで自動生成。Basic¥1,980〜。法務局書式準拠。登録不要でまず無料ガイドを活用。",
  keywords: ["相続登記 書類作成", "登記申請書 PDF", "遺産分割協議書 テンプレート"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/pricing" },
  openGraph: {
    title: "相続登記 書類作成プラン",
    description: "登記申請書・遺産分割協議書・相続関係説明図をPDFで自動生成。Basic¥1,980〜。",
    url: "https://yamada-tools.jp/souzoku-touki/pricing",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
