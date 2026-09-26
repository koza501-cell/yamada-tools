"use client";

export default function HoujinProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        法人情報を一時的に取得できません
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        データ取得元（gBizINFO）が一時的に応答していません。しばらくしてから再度お試しください。
      </p>
      <button
        onClick={() => reset()}
        className="text-kon hover:underline"
      >
        再読み込みする
      </button>
    </div>
  );
}
