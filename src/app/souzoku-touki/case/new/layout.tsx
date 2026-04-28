import { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規ケース作成 | 相続登記DIYガイド",
  description: "相続登記の書類作成ケースを新規作成します。",
  robots: "noindex",
};

export default function CaseNewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
