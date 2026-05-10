import { Metadata } from 'next';
import Link from 'next/link';
import { clinicTools } from '@/config/tools';

export const metadata: Metadata = {
  title: 'クリニック経営ツール｜損益分岐点・人件費率・給与計算 | yamada-tools.jp',
  description: 'クリニック院長・医療事務向けの経営支援ツール集。損益分岐点シミュレーター、人件費率診断、医療スタッフ給与計算機など、厚労省データに基づいた完全無料ツール。',
  keywords: 'クリニック経営, 開業医 ツール, 医療法人 経営, 院長 業務効率化, クリニック 計算',
};

export default function ClinicHubPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <span>クリニック経営</span>
      </nav>

      <h1 className="text-3xl font-bold mb-4">クリニック経営ツール</h1>
      <p className="text-gray-700 mb-8">
        個人クリニック・歯科医院・医療法人の院長と医療事務スタッフ向けの経営支援ツール集です。
        厚生労働省「医療経済実態調査」や日本看護協会の公式データに基づいた信頼性の高い計算が可能です。
        すべて完全無料・登録不要でご利用いただけます。
      </p>

      {clinicTools.filter(t => t.available).length === 0 ? (
        <p className="text-gray-500">ツールは近日公開予定です。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinicTools.filter(t => t.available).map(tool => (
            <Link
              key={tool.id}
              href={tool.path}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold">{tool.nameJa}</h2>
                {tool.isNew && (
                  <span className="bg-gray-50 text-danger text-xs font-bold px-2 py-1 rounded">NEW</span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">クリニック経営の3大課題</h2>
        <ul className="space-y-2 text-gray-700">
          <li>📊 <strong>数字管理</strong>：損益分岐点、必要患者数、人件費率の把握</li>
          <li>👥 <strong>人材管理</strong>：給与計算、夜勤手当、シフト最適化</li>
          <li>📋 <strong>事務作業</strong>：レセプト、診療報酬改定対応、スタッフ管理</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          山田ツールではこれらの課題に対応する無料ツールを順次拡充しています。
        </p>
      </section>
    </main>
  );
}
