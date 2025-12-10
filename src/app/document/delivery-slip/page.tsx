import { Metadata } from "next";
import DeliverySlipClient from "./client";

export const metadata: Metadata = {
  title: "納品書作成 - 無料オンラインツール | Yamada Tools",
  description: "登録不要・完全無料で納品書を作成。PDF保存・印刷対応。EC事業者・フリーランスに最適。",
  keywords: ["納品書", "納品書作成", "無料", "テンプレート", "PDF", "オンライン"],
  openGraph: {
    title: "納品書作成 - 無料オンラインツール",
    description: "登録不要・完全無料で納品書を作成。",
    type: "website",
  },
};

export default function DeliverySlipPage() {
  return <DeliverySlipClient />;
}
