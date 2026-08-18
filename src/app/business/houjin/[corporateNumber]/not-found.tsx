import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        法人情報が見つかりません
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        この法人番号に対応する情報が見つかりませんでした。
      </p>
      <Link href="/business/houjin-search" className="text-kon hover:underline">
        法人検索に戻る →
      </Link>
    </div>
  );
}
