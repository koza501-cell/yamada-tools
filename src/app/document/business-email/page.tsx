import { Metadata } from "next";
import BusinessEmailClient from "./client";

export const metadata: Metadata = {
  title: "ビジネスメール作成 | 山田ツール - 敬語メールテンプレート",
  description: "ビジネスメールを敬語で正しく作成。テンプレート多数。登録不要、完全無料。",
  keywords: ["ビジネスメール", "敬語", "メールテンプレート", "ビジネス文書", "無料"],
  openGraph: {
    title: "ビジネスメール作成 | 山田ツール",
    description: "ビジネスメールを作成。完全無料。",
    url: "https://yamada-tools.jp/document/business-email",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/business-email",
  },
};

export default function BusinessEmailPage() {
  return <BusinessEmailClient />;
}
