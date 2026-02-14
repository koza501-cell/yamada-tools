import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン | 山田ツール",
  description: "山田ツールの料金プラン。無料プランで毎日5回まで利用可能。PROプラン月額499円で無制限に。",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-kon mb-4">料金プラン</h1>
          <p className="text-gray-600 text-lg">あなたの使い方に合わせて選べる3つのプラン</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* FREE Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">FREE</h2>
              <div className="text-4xl font-bold text-kon">¥0</div>
              <p className="text-gray-500 text-sm mt-1">永久無料</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 全ツール利用可能</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 1日5回まで</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 最大20MBファイル</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 60分後に自動削除</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><span>−</span> 広告表示あり</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><span>−</span> 登録不要</li>
            </ul>
            <Link href="/" className="block w-full py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
              今すぐ使う
            </Link>
          </div>

          {/* PRO Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-sakura p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sakura text-white px-4 py-1 rounded-full text-sm font-bold">
              人気No.1
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">PRO</h2>
              <div className="text-4xl font-bold text-sakura">¥499</div>
              <p className="text-gray-500 text-sm mt-1">月額（税込）</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 全ツール利用可能</li>
              <li className="flex items-center gap-2 text-sm font-bold text-sakura"><span className="text-green-500">✓</span> 無制限</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 最大100MBファイル</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> バッチ処理（5件同時）</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 広告非表示</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 作業履歴30日</li>
            </ul>
            <button disabled className="block w-full py-3 text-center bg-sakura hover:bg-sakura/90 text-white rounded-xl font-bold transition-colors opacity-50 cursor-not-allowed">
              準備中
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">近日公開予定</p>
          </div>

          {/* BUSINESS Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">BUSINESS</h2>
              <div className="text-4xl font-bold text-kon">¥1,000</div>
              <p className="text-gray-500 text-sm mt-1">月額/人（税込）</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> PROの全機能</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 最大200MBファイル</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> バッチ処理（20件同時）</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> チーム管理機能</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 請求書払い対応</li>
              <li className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span> 優先サポート</li>
            </ul>
            <button disabled className="block w-full py-3 text-center bg-kon hover:bg-kon/90 text-white rounded-xl font-bold transition-colors opacity-50 cursor-not-allowed">
              準備中
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">近日公開予定</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-kon mb-8">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">無料プランでどこまで使えますか？</h3>
              <p className="text-gray-600 text-sm">全てのツールを1日5回まで無料でお使いいただけます。毎日0時にリセットされます。</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">支払い方法は？</h3>
              <p className="text-gray-600 text-sm">クレジットカード（Visa, Mastercard, JCB, AMEX）に対応予定です。法人様は請求書払いも可能です。</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">いつでも解約できますか？</h3>
              <p className="text-gray-600 text-sm">はい、いつでもワンクリックで解約可能です。解約後も期間終了まではPRO機能をご利用いただけます。</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">まずは無料で試してみませんか？</p>
          <Link href="/" className="inline-block bg-kon hover:bg-kon/90 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            無料で始める →
          </Link>
        </div>
      </div>
    </div>
  );
}
