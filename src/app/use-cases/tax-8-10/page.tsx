import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "消費税8%と10%の計算方法【軽減税率対応】",
  description: "消費税8%（軽減税率）と10%の計算を瞬時に。税込・税抜価格の変換、内税・外税計算も簡単。",
  keywords: ["消費税計算 8% 10%", "軽減税率 計算", "消費税 8パーセント", "税込 税抜 計算"],
  alternates: {
    canonical: 'https://yamada-tools.jp/use-cases/tax-8-10',
  },
};

export default function Tax810Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-10">
          <p className="text-kon text-sm mb-2">🧮 ユースケース</p>
          <h1 className="text-3xl font-bold text-kon mb-4">消費税8%と10%の計算</h1>
          <p className="text-gray-600">軽減税率にも対応した消費税計算</p>
        </header>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-3">📊 消費税10%の計算例</h2>
          <table className="w-full text-sm mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">税抜価格</th>
                <th className="px-3 py-2 text-left">消費税</th>
                <th className="px-3 py-2 text-left">税込価格</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-3 py-2">1,000円</td><td className="px-3 py-2">100円</td><td className="px-3 py-2 font-bold">1,100円</td></tr>
              <tr><td className="px-3 py-2">5,000円</td><td className="px-3 py-2">500円</td><td className="px-3 py-2 font-bold">5,500円</td></tr>
              <tr><td className="px-3 py-2">10,000円</td><td className="px-3 py-2">1,000円</td><td className="px-3 py-2 font-bold">11,000円</td></tr>
            </tbody>
          </table>

          <h2 className="font-bold text-kon mb-3">📊 消費税8%（軽減税率）の計算例</h2>
          <table className="w-full text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="px-3 py-2 text-left">税抜価格</th>
                <th className="px-3 py-2 text-left">消費税</th>
                <th className="px-3 py-2 text-left">税込価格</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-3 py-2">1,000円</td><td className="px-3 py-2">80円</td><td className="px-3 py-2 font-bold text-green-700">1,080円</td></tr>
              <tr><td className="px-3 py-2">5,000円</td><td className="px-3 py-2">400円</td><td className="px-3 py-2 font-bold text-green-700">5,400円</td></tr>
              <tr><td className="px-3 py-2">10,000円</td><td className="px-3 py-2">800円</td><td className="px-3 py-2 font-bold text-green-700">10,800円</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-kon text-white rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-bold mb-4">今すぐ消費税を計算する</h2>
          <Link href="/generator/tax-calculator" className="inline-block bg-white text-kon px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
            消費税計算ツールを使う →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">💡 軽減税率8%の対象品目</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ 飲食料品（酒類を除く）</li>
            <li>✅ 週2回以上発行の新聞（定期購読）</li>
            <li>❌ 外食・ケータリング → 10%</li>
            <li>❌ 酒類 → 10%</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="font-bold text-kon mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/document/invoice" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">請求書作成</h3>
              <p className="text-sm text-gray-500">インボイス対応請求書</p>
            </Link>
            <Link href="/generator/nenmatsu-calc" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">年末調整計算</h3>
              <p className="text-sm text-gray-500">所得税・還付額を計算</p>
            </Link>
          </div>
        </div>
        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-4">❓ よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold">Q: 軽減税率8%はいつまで続きますか？</h3>
              <p className="text-gray-600">A: 軽減税率に終了期限はありません。飲食料品と新聞は引き続き8%が適用されます。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: テイクアウトと店内飲食で税率が違うのはなぜ？</h3>
              <p className="text-gray-600">A: テイクアウトは飲食料品の譲渡で8%、店内飲食は外食サービスで10%となります。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 税込価格から税抜価格を計算するには？</h3>
              <p className="text-gray-600">A: 10%の場合は税込÷1.10、8%の場合は税込÷1.08で税抜価格が算出できます。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
