import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/generator/salary-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
