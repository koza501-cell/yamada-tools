import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import HojinZeiSimulator from "@/components/tools/HojinZeiSimulator";

export const metadata: Metadata = {
  title: "法人税シミュレーター2026｜防衛特別法人税（2027年〜）を含む税負担を試算",
  description: "課税所得と会社区分を入力して法人税・地方法人税・事業税・住民税を一括計算。2027年以降導入予定の防衛特別法人税（法人税額×4%）の影響比較も確認できます。",
  keywords: ["法人税 計算", "防衛増税 法人税", "法人税 シミュレーター", "実効税率 計算", "中小企業 法人税率"],
  alternates: { canonical: "https://yamada-tools.jp/tools/hojin-zei-simulator" },
  openGraph: {
    title: "法人税シミュレーター2026｜防衛特別法人税（2027年〜）を含む税負担を試算",
    description: "法人税・事業税・住民税と防衛特別法人税を一括計算。増税前後の比較も表示。",
    url: "https://yamada-tools.jp/tools/hojin-zei-simulator",
  },
};

const faq = [
  { question: "法人税率は何パーセントですか？", answer: "資本金1億円以下の中小法人は課税所得800万円以下が15%、超過分が23.2%です。" },
  { question: "法人住民税とは何ですか？", answer: "都道府県民税と市区町村民税の総称です。法人税額を基に計算する法人税割と、所得に関係なく課される均等割があります。" },
  { question: "地方法人税とは何ですか？", answer: "国税の一種で、法人税額の10.3%が課されます。地方交付税の財源として使われます。" },
  { question: "赤字でも法人住民税はかかりますか？", answer: "均等割部分は赤字でも課税されます。資本金等の額と従業員数によって金額が決まります。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "法人税シミュレーター", description: "法人の課税所得から法人税・地方法人税・法人住民税を自動計算。", path: "/tools/hojin-zei-simulator" }} faq={faq} />
      <HojinZeiSimulator />
    </>
  );
}
