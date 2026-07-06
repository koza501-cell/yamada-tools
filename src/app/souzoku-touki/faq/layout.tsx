import { Metadata } from "next";

export const metadata: Metadata = {
  title: "相続登記 よくある質問【30問以上】費用・期限・書類を網羅",
  description: "相続登記に関する30問以上のQ&A。義務化・罰則・費用・期限・必要書類・法定相続分・数次相続など幅広い疑問に回答。無料・登録不要。",
  keywords: ["相続登記 FAQ", "相続登記 よくある質問", "相続登記 費用", "相続登記 期限"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/faq" },
  openGraph: {
    title: "相続登記 よくある質問【30問以上】",
    description: "義務化・費用・期限・書類・数次相続など30問以上のQ&Aで疑問を解消。",
    url: "https://yamada-tools.jp/souzoku-touki/faq",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
