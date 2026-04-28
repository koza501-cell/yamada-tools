import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記ケース診断ウィザード【無料】10問で自分のケースを判定",
  description: "10問の質問に答えるだけで相続登記のケースを自動判定。遺産分割協議・法定相続・遺言書のどれか、DIY可否・必要書類・複雑度がわかります。",
  keywords: ["相続登記 ケース 診断", "相続登記 自分でできる", "遺産分割 法定相続 違い"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/wizard" },
  openGraph: {
    title: "相続登記ケース診断ウィザード【無料】",
    description: "10問の質問で自分のケースを自動判定。DIY可否・必要書類がすぐわかります。",
    url: "https://yamada-tools.jp/souzoku-touki/wizard",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
