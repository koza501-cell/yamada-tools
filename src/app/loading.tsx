export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 512 512">
            <rect width="512" height="512" rx="64" fill="#223A70"/>
            <text x="256" y="320" fontFamily="Arial, sans-serif" fontSize="200" fill="white" textAnchor="middle">🛠</text>
          </svg>
        </div>
        <p className="text-kon dark:text-blue-400 font-bold text-lg">山田ツール</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">読み込み中...</p>
      </div>
    </div>
  );
}
