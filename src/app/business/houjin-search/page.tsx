import type { Metadata } from "next";
import HoujinSearchClient from "./client";

export const metadata: Metadata = {
  title: "法人検索ツール【無料】法人番号・所在地を瞬時検索｜gBizINFO公式データ",
  description: "会社名から法人番号と所在地を無料で検索。経済産業省gBizINFOの公式データを使用。約400万社の国内法人に対応。登録不要、ブラウザですぐ利用可能。",
  keywords: ["法人検索", "法人番号", "会社名 法人番号", "gBizINFO", "法人情報", "企業検索", "会社情報", "無料"],
  openGraph: {
    title: "法人検索ツール【無料】法人番号・所在地を瞬時検索",
    description: "会社名から法人番号・所在地を無料で検索。経済産業省gBizINFOの公式データを使用。",
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

export default function Page() {
  return <HoujinSearchClient />;
}
