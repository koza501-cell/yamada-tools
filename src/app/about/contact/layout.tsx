import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/about/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
