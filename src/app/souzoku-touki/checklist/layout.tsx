import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "相続登記 書類チェックリスト【無料・ケース別】",
  description: "遺産分割協議・法定相続・遺言書・相続人申告登記ケース別の必要書類一覧。取得場所・費用・注意点付き。印刷対応。登録不要・無料。",
  keywords: ["相続登記 必要書類", "相続登記 書類一覧", "遺産分割 必要書類"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/checklist" },
  openGraph: {
    title: "相続登記 書類チェックリスト【無料・ケース別】",
    description: "ケース別の必要書類を一覧表示。取得場所・費用・注意点付き。",
    url: "https://yamada-tools.jp/souzoku-touki/checklist",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
