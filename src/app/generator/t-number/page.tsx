import { Metadata } from "next";
import TNumberClient from "./client";

export const metadata: Metadata = {
  title: "インボイス番号検証 | 山田ツール - 適格請求書発行事業者番号チェック",
  description: "インボイス制度の適格請求書発行事業者番号（T番号）を検証。13桁チェックディジット検証対応。登録不要、完全無料。",
  keywords: ["インボイス", "適格請求書", "T番号", "登録番号", "検証", "チェック"],
  openGraph: {
    title: "インボイス番号検証 | 山田ツール",
    description: "T番号の形式チェック。完全無料。",
    url: "https://yamada-tools.jp/generator/t-number",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/t-number",
  },
};

export default function TNumberPage() {
  return <TNumberClient />;
}
