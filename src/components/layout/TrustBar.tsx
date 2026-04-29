"use client";
import { usePathname } from "next/navigation";

// Marketing chrome must NOT render on tool workspace paths —
// users mid-task filling a form don't need a trust strip.
const WORKSPACE_PREFIXES = [
  "/document/",
  "/pdf/",
  "/image/",
  "/convert/",
  "/generator/",
  "/tax/",
  "/finance/",
];

export default function TrustBar() {
  const pathname = usePathname();

  if (WORKSPACE_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const isHomepage = pathname === "/";

  return (
    <div
      className={`w-full bg-[#f3f4f6] text-[#4b5563] overflow-x-auto${
        isHomepage ? " sticky top-14 z-40" : ""
      }`}
      style={{ height: "24px", fontSize: "13px", lineHeight: "24px" }}
    >
      <div className="flex items-center px-4 whitespace-nowrap gap-4 md:gap-0 md:justify-center">
        <span>🔒 SSL暗号化</span>
        <span className="hidden md:inline px-2 text-gray-400 select-none">・</span>
        <span>🇯🇵 日本国内サーバー</span>
        <span className="hidden md:inline px-2 text-gray-400 select-none">・</span>
        <span>🗑 60分自動削除</span>
        <span className="hidden md:inline px-2 text-gray-400 select-none">・</span>
        <span>多くの法人様にご利用いただいています</span>
      </div>
    </div>
  );
}
