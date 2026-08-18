import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import FurusatoNozeiCalculator from "@/components/tools/FurusatoNozeiCalculator";

export const metadata: Metadata = {
  title: "\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u63a7\u9664\u4e0a\u9650\u984d\u8a08\u7b972026\uff5c\u5e74\u53ce\u30fb\u5bb6\u65cf\u69cb\u6210\u3067\u6b63\u78ba\u8a08\u7b97",
  description:
    "\u5e74\u53ce\u30fb\u914d\u5076\u8005\u30fb\u6276\u990a\u5bb6\u65cf\u30fb\u4f4f\u5b85\u30ed\u30fc\u30f3\u63a7\u9664\u3092\u5165\u529b\u3059\u308b\u3060\u3051\u3067\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u306e\u63a7\u9664\u4e0a\u9650\u984d\u3092\u8a08\u7b97\u30022026\u5e74\u5ea6\u6700\u65b0\u30ec\u30fc\u30c8\u5bfe\u5fdc\u3002\u603b\u52d9\u7701\u516c\u5f0f\u65b9\u5f0f\u3067\u6b63\u78ba\u306a\u5bc4\u4ed8\u4e0a\u9650\u3092\u7121\u6599\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3002",
  keywords: [
    "\u3075\u308b\u3055\u3068\u7d0d\u7a0e \u8a08\u7b97",
    "\u3075\u308b\u3055\u3068\u7d0d\u7a0e \u4e0a\u9650\u984d",
    "\u3075\u308b\u3055\u3068\u7d0d\u7a0e \u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3",
    "\u3075\u308b\u3055\u3068\u7d0d\u7a0e 2026",
    "\u3075\u308b\u3055\u3068\u7d0d\u7a0e \u5c71\u5c71\u8cfc\u5165\u984d",
    "\u63a7\u9664\u4e0a\u9650\u984d \u8a08\u7b97\u6a5f",
    "\u5739\u4f4f\u6c11\u7a0e \u8a08\u7b97",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/furusato-nozei-keisan",
  },
  openGraph: {
    title: "\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u63a7\u9664\u4e0a\u9650\u984d\u8a08\u7b972026\uff5c\u5e74\u53ce\u30fb\u5bb6\u65cf\u69cb\u6210\u3067\u6b63\u78ba\u8a08\u7b97",
    description:
      "\u5e74\u53ce\u30fb\u914d\u5076\u8005\u30fb\u6276\u990a\u5bb6\u65cf\u30fb\u4f4f\u5b85\u30ed\u30fc\u30f3\u63a7\u9664\u3092\u5165\u529b\u3059\u308b\u3060\u3051\u3067\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u306e\u63a7\u9664\u4e0a\u9650\u984d\u3092\u8a08\u7b97\u30022026\u5e74\u5ea6\u6700\u65b0\u30ec\u30fc\u30c8\u5bfe\u5fdc\u3002",
    url: "https://yamada-tools.jp/tools/furusato-nozei-keisan",
  },
};

const faq = [
  { question: "ふるさと納税の上限額はどうやって決まりますか？", answer: "年収・家族構成・住宅ローン控除の有無などによって決まります。2026年度の最新ルールで自動計算できます。" },
  { question: "ふるさと納税は何自治体まで寄附できますか？", answer: "自治体数に制限はありませんが、ワンストップ特例制度を使う場合は5自治体以内が条件です。" },
  { question: "上限額を超えて寄附したらどうなりますか？", answer: "上限額を超えた分は税控除の対象外となり、実質的な自己負担が増えます。" },
  { question: "計算結果はあくまで目安ですか？", answer: "はい。正確な控除額は年末調整・確定申告の結果によります。税理士にご相談ください。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "ふるさと納税上限額計算ツール", description: "年収・家族構成から最適なふるさと納税上限額を自動計算。2026年度対応。", path: "/tools/furusato-nozei-keisan" }} faq={faq} />
      <FurusatoNozeiCalculator />
    </>
  );
}
