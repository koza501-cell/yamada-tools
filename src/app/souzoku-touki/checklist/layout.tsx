import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 必要書類チェックリスト【無料】",
  description: "相続登記に必要な書類を状況別にチェックリスト形式で確認。遺言あり・なし・法定相続・遺産分割協議別に対応。無料。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/checklist" },
  openGraph: {
    title: "相続登記 必要書類チェックリスト【無料】",
    description: "相続登記に必要な書類を状況別にチェックリスト形式で確認。遺言あり・なし・法定相続・遺産分割協議別に対応。無料。",
    url: "https://yamada-tools.jp/souzoku-touki/checklist",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
