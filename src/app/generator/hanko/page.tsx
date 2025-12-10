import { Metadata } from "next";
import HankoClient from "./client";

export const metadata: Metadata = {
  title: "電子印鑑作成 | 山田ツール - 無料ハンコジェネレーター",
  description: "オンラインで電子印鑑・デジタルハンコを作成。丸印・角印対応。PNG透過出力。登録不要、完全無料。",
  keywords: ["電子印鑑", "ハンコ作成", "デジタル印鑑", "認印", "無料"],
  openGraph: {
    title: "電子印鑑作成 | 山田ツール",
    description: "オンラインで電子印鑑を作成。完全無料。",
    url: "https://yamada-tools.jp/generator/hanko",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/hanko",
  },
};

export default function HankoPage() {
  return <HankoClient />;
}
