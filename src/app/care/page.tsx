import { Metadata } from 'next';
import Link from 'next/link';
import { careTools } from '@/config/tools';

export const metadata: Metadata = {
  title: '介護・保育 事業者向けツール【無料】介護報酬計算・業務効率化',
  description: '介護施設・保育園の事務作業を効率化するツール集。介護報酬単位計算機など令和6年改定対応の無料ツールをご提供。登録不要・完全無料。',
  keywords: ['介護 ツール', '介護報酬 計算', '保育 業務効率化', '介護施設 無料'],
  alternates: { canonical: 'https://yamada-tools.jp/care' },
};

export default function CareHubPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <span>介護・保育</span>
      </nav>

      <h1 className="text-3xl font-bold mb-4">介護・保育 事業者向けツール</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        介護施設・訪問介護・保育園の事務作業を効率化する無料ツール集です。
        厚生労働省の最新改定データに基づき、介護報酬の計算や業務支援ツールを順次公開しています。
        すべて完全無料・登録不要でご利用いただけます。
      </p>

      {careTools.filter(t => t.available).length === 0 ? (
        <p className="text-gray-500">ツールは近日公開予定です。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careTools.filter(t => t.available).map(tool => (
            <Link
              key={tool.id}
              href={tool.path}
              className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.nameJa}</h2>
                {tool.isNew && (
                  <span className="bg-sky-50 text-sky-600 text-xs font-bold px-2 py-1 rounded">NEW</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-12 bg-sky-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">介護事業者の業務効率化</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>🏥 <strong>介護報酬計算</strong>：単位数・地域区分・加算減算を自動計算</li>
          <li>📋 <strong>書類作成支援</strong>：事務作業の時間を削減するツール</li>
          <li>💰 <strong>コスト管理</strong>：施設運営に関わる費用の見える化</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          山田ツールでは介護・保育分野のツールを順次拡充しています。
        </p>
      </section>
    </main>
  );
}
