import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "【2026年最新】新NISAシミュレーション完全ガイド｜初心者でも5分でわかる積立計算",
  description: "新NISAの積立シミュレーションを無料で計算。毎月1万円で20年後にいくら？つみたて投資枠と成長投資枠の違い、2026年税制改正のポイントを初心者向けにわかりやすく解説。",
  keywords: ["新NISA", "シミュレーション", "2026", "積立", "つみたて投資枠", "成長投資枠"],
};

export default function NisaSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>新NISAシミュレーション2026</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        【2026年最新】新NISAシミュレーション完全ガイド｜初心者でも5分でわかる積立計算
      </h1>
      
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-pink-50 border-l-4 border-pink-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 新NISAの「つみたて投資枠」と「成長投資枠」の違い</li>
          <li>✓ 毎月いくら積み立てれば、20年後にいくらになるか</li>
          <li>✓ 2026年の税制改正で変わったポイント</li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">新NISAとは？</h2>
        <p className="text-gray-700 mb-4">
          2024年1月から始まった新NISA（少額投資非課税制度）は、投資で得た利益に税金がかからない国の制度です。
          通常、株式や投資信託の利益には約20%の税金がかかりますが、NISA口座で運用すれば<strong>非課税</strong>になります。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b">項目</th>
              <th className="px-4 py-3 text-left border-b">内容</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">年間投資枠</td><td className="px-4 py-3 border-b">最大360万円</td></tr>
            <tr><td className="px-4 py-3 border-b">生涯投資枠</td><td className="px-4 py-3 border-b">1,800万円</td></tr>
            <tr><td className="px-4 py-3 border-b">非課税期間</td><td className="px-4 py-3 border-b font-bold text-pink-600">無期限</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【シミュレーション】毎月3万円を20年間積立</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-4 py-3 text-left border-b">利回り</th>
              <th className="px-4 py-3 text-left border-b">元本</th>
              <th className="px-4 py-3 text-left border-b">運用益</th>
              <th className="px-4 py-3 text-left border-b">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">3%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">264万円</td><td className="px-4 py-3 border-b font-bold">984万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">513万円</td><td className="px-4 py-3 border-b font-bold">1,233万円</td></tr>
            <tr><td className="px-4 py-3 border-b">7%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">840万円</td><td className="px-4 py-3 border-b font-bold">1,560万円</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">今すぐ試算！</p>
          <Link href="/finance/nisa-simulator" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg">
            無料NISAシミュレーターを使う →
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold cursor-pointer">Q. 新NISAはいつ始めるべき？</summary>
            <p className="mt-2 text-gray-700">今すぐ始めるのがベスト。複利効果を活かすには早いほど有利です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold cursor-pointer">Q. 毎月いくら積み立てればいい？</summary>
            <p className="mt-2 text-gray-700">手取りの10〜15%が目安。月1万円からでもOKです。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold cursor-pointer">Q. オルカンとS&P500どっち？</summary>
            <p className="mt-2 text-gray-700">迷ったら分散が効いているオルカンがおすすめです。</p>
          </details>
        </div>
      </section>

      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg p-6 text-center mb-10">
        <p className="text-lg font-bold mb-4">シミュレーションで積立プランを確認しよう</p>
        <Link href="/finance/nisa-simulator" className="inline-block bg-white text-pink-600 font-bold py-3 px-8 rounded-lg">
          無料NISAシミュレーター →
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/finance/nisa-simulator" className="block border rounded-lg p-4 hover:shadow-md">
            <span className="font-bold">NISAシミュレーター</span>
            <p className="text-sm text-gray-600">将来の資産を計算</p>
          </Link>
          <Link href="/finance/ideco-nisa-comparison" className="block border rounded-lg p-4 hover:shadow-md">
            <span className="font-bold">iDeCo vs NISA 比較</span>
            <p className="text-sm text-gray-600">どちらが合うか診断</p>
          </Link>
        </div>
      </section>

      <p className="text-sm text-gray-500">
        ※2026年4月時点の情報です。最新情報は金融庁公式サイトでご確認ください。
      </p>
    </article>
  );
}
