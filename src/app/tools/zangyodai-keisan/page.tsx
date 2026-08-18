import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import ZangyodaiCalculator from "@/components/tools/ZangyodaiCalculator";

export const metadata: Metadata = {
  title: "残業代計算ツール2026｜未払い残業代・割増賃金を正確に自動計算",
  description:
    "月給・日給・時給から残業代を自動計算。時間外・深夜・休日労働の割増賃金率に対応。未払い残業代の総額も計算できる無料ツール。労働基準法2026年対応。",
  keywords: [
    "残業代 計算",
    "残業代 計算方法",
    "割増賃金 計算",
    "時間外労働 割増率",
    "未払い残業代",
    "深夜残業 計算",
    "休日労働 割増賃金",
    "残業代 シミュレーター",
    "2026年 残業代",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/zangyodai-keisan",
  },
  openGraph: {
    title: "残業代計算ツール2026｜未払い残業代・割増賃金を正確に自動計算",
    description:
      "月給・日給・時給から残業代を自動計算。時間外・深夜・休日労働の割増賃金率に対応。未払い残業代の総額も計算できる無料ツール。",
    url: "https://yamada-tools.jp/tools/zangyodai-keisan",
  },
};

const faq = [
  { question: "残業代の計算方法を教えてください。", answer: "基本給を月所定労働時間で割った時給に、法定割増率（時間外25%・深夜25%・休日35%）を掛けて計算します。" },
  { question: "残業代が支払われない場合はどうすればいいですか？", answer: "労働基準監督署に相談するか、弁護士・社労士に未払い残業代の請求を依頼できます。" },
  { question: "管理職でも残業代は請求できますか？", answer: "名ばかり管理職の場合は請求できます。実態として管理権限がない場合は一般労働者として扱われます。" },
  { question: "残業代の時効はありますか？", answer: "2020年4月以降の残業代は3年間請求できます。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "残業代計算ツール", description: "基本給・残業時間から法定割増賃金を自動計算。深夜・休日割増にも対応。", path: "/tools/zangyodai-keisan" }} faq={faq} />
      <ZangyodaiCalculator />
    </>
  );
}
