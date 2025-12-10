import { Metadata } from "next";
import CoverLetterClient from "./client";

export const metadata: Metadata = {
  title: "送付状作成 | 山田ツール - ビジネス送付状",
  description: "ビジネス送付状・添え状を簡単作成。PDF出力対応。登録不要、完全無料。",
  keywords: ["送付状", "添え状", "カバーレター", "ビジネス文書", "無料"],
  openGraph: {
    title: "送付状作成 | 山田ツール",
    description: "ビジネス送付状を作成。完全無料。",
    url: "https://yamada-tools.jp/document/cover-letter",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/cover-letter",
  },
};

export default function CoverLetterPage() {
  return <CoverLetterClient />;
}
