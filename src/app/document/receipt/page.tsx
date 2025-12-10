import { Metadata } from "next";
import ReceiptClient from "./client";

export const metadata: Metadata = {
  title: "領収書作成 - 無料オンラインツール | Yamada Tools",
  description: "登録不要・完全無料で領収書を作成。印紙税の案内付き。PDF保存・印刷対応。個人事業主・フリーランスに最適。",
  keywords: ["領収書", "領収書作成", "無料", "テンプレート", "印紙税", "PDF", "オンライン"],
  openGraph: {
    title: "領収書作成 - 無料オンラインツール",
    description: "登録不要・完全無料で領収書を作成。印紙税の案内付き。",
    type: "website",
  },
};

export default function ReceiptPage() {
  return <ReceiptClient />;
}
