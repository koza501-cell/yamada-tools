import { Metadata } from "next";
import BusinessCardClient from "./client";

export const metadata: Metadata = {
  title: "名刺作成 | 山田ツール - 無料名刺デザイン",
  description: "シンプルな名刺を簡単デザイン。印刷用PDF出力。登録不要、完全無料。",
  keywords: ["名刺作成", "名刺デザイン", "名刺テンプレート", "PDF", "無料"],
  openGraph: {
    title: "名刺作成 | 山田ツール",
    description: "名刺を簡単デザイン。完全無料。",
    url: "https://yamada-tools.jp/document/business-card",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/business-card",
  },
};

export default function BusinessCardPage() {
  return <BusinessCardClient />;
}
