import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/generator/json-format",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
