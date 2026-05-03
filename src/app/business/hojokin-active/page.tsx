import type { Metadata } from "next";
import HojokinActiveClient from "./client";

export const metadata: Metadata = {
  title: "補助金検索ツール【無料・募集中】中小企業・個人事業主向け｜Jグランツ公式",
  description: "現在募集中の補助金・助成金を無料検索。中小企業・個人事業主・創業向け。デジタル庁Jグランツの公式データ。締切日・上限額・対象規模で絞り込み可能。",
  keywords: ["補助金", "助成金", "中小企業 補助金", "Jグランツ", "募集中 補助金", "創業 補助金", "IT補助金", "ものづくり補助金", "無料"],
  openGraph: {
    title: "補助金検索ツール【無料・募集中】中小企業・個人事業主向け",
    description: "現在募集中の補助金・助成金を無料検索。デジタル庁Jグランツの公式データ。",
    type: "website",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/business/hojokin-active",
  },
};

export default function Page() {
  return <HojokinActiveClient />;
}
