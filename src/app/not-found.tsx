import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは見つかりませんでした。",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-kon mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-6">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 mb-8">
          お探しのページは移動または削除された可能性があります。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
          >
            ホームに戻る
          </Link>
          <Link
            href="/pdf"
            className="px-6 py-3 border-2 border-kon text-kon rounded-xl font-bold hover:bg-kon/5 transition-colors"
          >
            PDFツール一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
