import { Metadata } from "next";
import InvoiceClient from "./client";

export const metadata: Metadata = {
  title: "請求書作成 | 山田ツール - 無料インボイス対応請求書",
  description: "インボイス制度対応の請求書を簡単作成。PDF出力対応。登録不要、完全無料。",
  keywords: ["請求書作成", "インボイス", "請求書テンプレート", "PDF", "無料"],
  openGraph: {
    title: "請求書作成 | 山田ツール",
    description: "インボイス対応請求書を簡単作成。完全無料。",
    url: "https://yamada-tools.jp/document/invoice",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/invoice",
  },
};

export default function InvoicePage() {
  return <InvoiceClient />;
}
