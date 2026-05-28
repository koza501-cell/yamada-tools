import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '役割別ツール一覧｜仕事・立場から探す | yamada-tools.jp',
  description: '経営者・フリーランス・クリニック・不動産・飲食店・家族向けに、必要なツールをまとめた役割別ツール集。登録不要・完全無料。',
};

const roles = [
  { slug: 'keieisha', emoji: '🏢', name: '中小企業の経営者', desc: '法人検索・補助金・給与・請求書' },
  { slug: 'freelance', emoji: '💼', name: '個人事業主・フリーランス', desc: '確定申告・インボイス・節税' },
  { slug: 'clinic', emoji: '🏥', name: 'クリニック・士業', desc: '開業・経営・労務・医療報酬' },
  { slug: 'fudousan', emoji: '🏠', name: '不動産・建設関係者', desc: '物件調査・経審・収益計算' },
  { slug: 'inshoku', emoji: '🍽️', name: '飲食店経営者', desc: '原価率・栄養・補助金' },
  { slug: 'kazoku', emoji: '👨‍👩‍👧‍👦', name: '家族の生活・将来設計', desc: '家計・住宅・教育・相続' },
];

export default function ForIndexPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <span>役割別ツール</span>
      </nav>
      <h1 className="text-3xl font-bold text-kon dark:text-white mb-3">役割別ツール一覧</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">お仕事や立場に合わせて、必要なツールをまとめています。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => (
          <Link
            key={r.slug}
            href={`/for/${r.slug}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-ai dark:hover:border-ai rounded-xl p-6 transition-all hover:shadow-md group"
          >
            <div className="text-3xl mb-3">{r.emoji}</div>
            <div className="font-semibold text-kon dark:text-white group-hover:text-ai text-lg mb-1">{r.name}向け</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{r.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
