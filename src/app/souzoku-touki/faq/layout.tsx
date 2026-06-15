import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 よくある質問【FAQ】手続き・費用・期限を解説",
  description: "相続登記に関するよくある質問をまとめました。手続きの流れ・必要書類・費用・期限・自分でできるかなどを詳しく解説。",
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/faq" },
  openGraph: {
    title: "相続登記 よくある質問【FAQ】手続き・費用・期限を解説",
    description: "相続登記に関するよくある質問をまとめました。手続きの流れ・必要書類・費用・期限・自分でできるかなどを詳しく解説。",
    url: "https://yamada-tools.jp/souzoku-touki/faq",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
