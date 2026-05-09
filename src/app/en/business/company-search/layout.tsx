import type { Metadata } from "next";

export const metadata: Metadata = {
  // Inherit from page.tsx but ensure html lang is set in body
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div lang="en">{children}</div>;
}
