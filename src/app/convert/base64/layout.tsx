import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yamada-tools.jp/convert/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
