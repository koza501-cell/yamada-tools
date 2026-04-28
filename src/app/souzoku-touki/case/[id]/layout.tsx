import { Metadata } from "next";

export const metadata: Metadata = {
  title: "書類作成フォーム | 相続登記DIYガイド",
  description: "相続登記の書類作成フォームです。",
  robots: "noindex",
};

export default function CaseIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
