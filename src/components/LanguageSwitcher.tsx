import Link from "next/link";

export function LanguageSwitcher({
  jaUrl,
  enUrl,
  currentLang,
}: {
  jaUrl: string;
  enUrl: string;
  currentLang: "ja" | "en";
}) {
  return (
    <div className="flex justify-end max-w-4xl mx-auto px-4 pt-3">
      <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
        <span className="text-gray-400 mr-1">🌐</span>
        {currentLang === "ja" ? (
          <span className="font-semibold text-gray-800 dark:text-gray-100">日本語</span>
        ) : (
          <Link href={jaUrl} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">
            日本語
          </Link>
        )}
        <span className="text-gray-300 dark:text-gray-600 mx-1">|</span>
        {currentLang === "en" ? (
          <span className="font-semibold text-gray-800 dark:text-gray-100">English</span>
        ) : (
          <Link href={enUrl} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">
            English
          </Link>
        )}
      </div>
    </div>
  );
}
