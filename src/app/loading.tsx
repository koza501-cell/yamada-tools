import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 animate-pulse">
          <Image
            src="/logo-icon.webp"
            alt="山田ツール"
            width={96}
            height={96}
            priority
          />
        </div>
        <p className="text-kon dark:text-blue-400 font-bold text-lg">山田ツール</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">読み込み中...</p>
      </div>
    </div>
  );
}
