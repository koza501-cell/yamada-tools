import { Metadata } from "next";
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

export default function Page() { return <HojinZeiSimulator />; }
