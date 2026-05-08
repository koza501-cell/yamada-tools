import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HoujinSearchClient from "./client";

export const metadata: Metadata = {
  title: "法人検索ツール【無料】法人番号・所在地を瞬時検索｜gBizINFO公式データ",
  description: "会社名から法人番号と所在地を無料で検索。資本金・従業員数・設立日・代表者などの詳細情報、営業状態バッジ、英語・ローマ字検索にも対応。経済産業省gBizINFO公式データ。約400万社対応。登録不要。",
  keywords: ["法人検索", "法人番号", "会社名 法人番号", "gBizINFO", "法人情報", "企業検索", "会社情報", "無料"],
  openGraph: {
    title: "法人検索ツール【無料】法人番号・所在地を瞬時検索",
    description: "会社名から法人番号・所在地・詳細情報を無料で検索。英語・ローマ字検索対応。経済産業省gBizINFOの公式データを使用。",
    type: "website",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/business/houjin-search",
    languages: {
      "ja-JP": "https://yamada-tools.jp/business/houjin-search",
      "en-US": "https://yamada-tools.jp/en/business/company-search",
      "x-default": "https://yamada-tools.jp/business/houjin-search",
    },
  },
};

const tool = getToolById("houjin-search");

export default function Page() {
  return (
    <>
      <HoujinSearchClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
