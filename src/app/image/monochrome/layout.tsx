import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/image/monochrome",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
