"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // No English equivalent of the Japanese tool categories below; showing this
  // bar (labels + links, all Japanese) on English pages is worse than omitting it.
  if (pathname?.startsWith("/en")) return null;

  const navItems = [
    { href: "/", icon: "🏠", label: "ホーム" },
    { href: "/pdf", icon: "📄", label: "PDF" },
    { href: "/document", icon: "📝", label: "書類" },
    { href: "/convert", icon: "🔄", label: "変換" },
    { href: "/generator", icon: "⚡", label: "計算" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] transition-colors ${
              isActive(item.href)
                ? "text-sakura"
                : "text-gray-500 dark:text-gray-400 hover:text-kon dark:hover:text-ai"
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
