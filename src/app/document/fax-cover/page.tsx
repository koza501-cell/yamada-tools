import { Metadata } from "next";
import FaxCoverClient from "./client";

export const metadata: Metadata = {
  title: "FAX送付状作成 - 無料オンラインツール | Yamada Tools",
  description: "登録不要・完全無料でFAX送付状を作成。ビジネス用テンプレート。PDF保存・印刷対応。",
  keywords: ["FAX送付状", "ファックス", "送付状", "無料", "テンプレート", "PDF", "ビジネス"],
  openGraph: {
    title: "FAX送付状作成 - 無料オンラインツール",
    description: "登録不要・完全無料でFAX送付状を作成。",
    type: "website",
  },
};

export default function FaxCoverPage() {
  return <FaxCoverClient />;
}
