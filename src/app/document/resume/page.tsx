import { Metadata } from "next";
import ResumeClient from "./client";

export const metadata: Metadata = {
  title: "履歴書作成 | 山田ツール - JIS規格対応履歴書",
  description: "JIS規格対応の履歴書を簡単作成。PDF出力対応。登録不要、完全無料。",
  keywords: ["履歴書作成", "JIS規格", "履歴書テンプレート", "PDF", "無料"],
  openGraph: {
    title: "履歴書作成 | 山田ツール",
    description: "JIS規格対応履歴書を作成。完全無料。",
    url: "https://yamada-tools.jp/document/resume",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/resume",
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
