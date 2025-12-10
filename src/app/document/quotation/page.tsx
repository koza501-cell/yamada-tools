import { Metadata } from "next";
import QuotationClient from "./client";

export const metadata: Metadata = {
  title: "見積書作成 | 山田ツール - 無料見積書テンプレート",
  description: "見積書を簡単作成。PDF出力対応。有効期限設定可能。登録不要、完全無料。",
  keywords: ["見積書作成", "見積書テンプレート", "PDF", "無料"],
  openGraph: {
    title: "見積書作成 | 山田ツール",
    description: "見積書を簡単作成。完全無料。",
    url: "https://yamada-tools.jp/document/quotation",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/quotation",
  },
};

export default function QuotationPage() {
  return <QuotationClient />;
}
