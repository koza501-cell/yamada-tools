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

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "残業代計算ツール", description: "基本給・残業時間から法定割増賃金を自動計算。深夜・休日割増にも対応。", path: "/tools/zangyodai-keisan" }} />
      <ZangyodaiCalculator />
    </>
  );
}
