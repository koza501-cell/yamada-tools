import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記ケース診断【無料】あなたのケースを自動判定",
  description: "相続登記が必要かどうかをケース別に自動診断。遺産分割協議・遺言・法定相続など状況に応じた手続きを案内。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/wizard" },
  openGraph: {
    title: "相続登記ケース診断【無料】あなたのケースを自動判定",
    description: "相続登記が必要かどうかをケース別に自動診断。遺産分割協議・遺言・法定相続など状況に応じた手続きを案内。無料・登録不要。",
    url: "https://yamada-tools.jp/souzoku-touki/wizard",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
