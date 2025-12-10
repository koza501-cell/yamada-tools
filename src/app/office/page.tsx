import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Officeツール | 山田ツール - 準備中",
  description: "Word、Excel、PowerPointの変換・編集ツール。近日公開予定。",
};

export default function OfficeToolsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-3xl font-bold text-kon mb-4">Officeツール</h1>
        <p className="text-gray-600 mb-8">
          Word、Excel、PowerPointの変換・編集ツールを準備中です。<br />
          近日公開予定ですので、しばらくお待ちください。
        </p>
        
        <div className="bg-sakura/20 rounded-xl p-8 mb-8">
          <h2 className="font-bold text-kon mb-4">予定しているツール</h2>
          <ul className="text-gray-600 space-y-2">
            <li>📝 ドキュメント比較</li>
            <li>📊 スプレッドシート変換</li>
            <li>📑 テンプレート生成</li>
            <li>🔄 フォーマット変換</li>
          </ul>
        </div>

        <Link
          href="/pdf"
          className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold hover:bg-ai transition-colors"
        >
          PDFツールを使う →
        </Link>
      </div>
    </div>
  );
}
