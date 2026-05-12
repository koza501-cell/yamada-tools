import type { Metadata } from "next";

/**
 * English subtree layout (/en/*)
 *
 * The actual <html lang="en"> override is handled in the ROOT layout.tsx
 * which now detects /en/* paths via middleware's x-pathname header.
 *
 * This file only provides metadata signals (canonical, OG locale) for the
 * /en root URL.
 */

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/en",
    languages: {
      "en-US": "https://yamada-tools.jp/en",
      en: "https://yamada-tools.jp/en",
      "ja-JP": "https://yamada-tools.jp/",
      "x-default": "https://yamada-tools.jp/en",
    },
  },
  openGraph: {
    locale: "en_US",
    alternateLocale: ["ja_JP"],
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
