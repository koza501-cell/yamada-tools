import type { Metadata } from "next";
export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/en/business/company-search",
    languages: {
      "en": "https://yamada-tools.jp/en/business/company-search",
      "en-US": "https://yamada-tools.jp/en/business/company-search",
      "ja-JP": "https://yamada-tools.jp/business/houjin-search",
      "x-default": "https://yamada-tools.jp/en/business/company-search",
    },
  },
};
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div lang="en">{children}</div>;
}
