import { Metadata } from "next";

export const metadata: Metadata = {
  title: "法人化シミュレーター【無料】個人事業主vs法人を税金・社保で比較",
  description: "個人事業主と法人の税金・社会保険料を比較シミュレーション。法人化のタイミングを年収・売上から判断。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/business/incorporation-simulator" },
  openGraph: {
    title: "法人化シミュレーター【無料】個人事業主vs法人を税金・社保で比較",
    description: "個人事業主と法人の税金・社会保険料を比較シミュレーション。法人化のタイミングを年収・売上から判断。無料・登録不要。",
    url: "https://yamada-tools.jp/business/incorporation-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
