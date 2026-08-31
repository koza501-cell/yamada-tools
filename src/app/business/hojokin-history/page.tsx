import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HojokinHistoryClient from "./client";

export const metadata: Metadata = {
  title: "補助金履歴検索【無料】法人の過去受給歴を検索｜gBizINFO公式",
  description: "特定の法人が過去に受給した補助金の履歴を無料検索。取引先の信用調査・与信判断に。経済産業省gBizINFOの公式データを使用。法人名または法人番号で検索可能。",
  keywords: ["補助金 履歴", "法人 補助金 過去", "信用調査", "与信", "gBizINFO", "法人番号 補助金", "企業調査", "無料"],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "補助金履歴検索【無料】法人の過去受給歴を検索",
    description: "特定の法人が過去に受給した補助金履歴を無料検索。取引先の信用調査に。",
    type: "website",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/business/hojokin-history",
  },
};

const tool = getToolById("hojokin-history");

export default function Page() {
  return (
    <>
      <HojokinHistoryClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
