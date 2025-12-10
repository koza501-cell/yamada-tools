import { Metadata } from 'next';
import LastUpdated from '@/components/LastUpdated';

export const metadata: Metadata = {
  title: '私たちについて - 山田ツールの運営方針 | 山田ツール',
  description: '山田ツールは合同会社山田トレードが運営する無料オンラインツール集です。日本国内サーバーで安全・安心なサービスを提供します。',
  openGraph: {
    title: '私たちについて | 山田ツール',
    description: '山田ツールの運営方針とチーム紹介',
    url: 'https://yamada-tools.jp/about/us',
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-kon mb-4">私たちについて</h1>
          <p className="text-xl text-gray-600">山田ツールの使命と運営チーム</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-kon mb-4">🎯 私たちの使命</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            山田ツールは、日本のビジネスパーソンとフリーランサーの日常業務を効率化することを使命としています。
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            「必要なツールが指先にある」世界を実現するため、登録不要・完全無料で使える71種類のオンラインツールを提供しています。
          </p>
          <p className="text-gray-700 leading-relaxed">
            特に、<strong className="text-kon">日本国内サーバー完結</strong>にこだわり、企業の機密情報を海外サーバーに送信せず、安全に処理できる環境を整えています。
          </p>
        </div>

        {/* Why We Exist */}
        <div className="bg-gradient-to-br from-kon to-kon/95 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 なぜ山田ツールを作ったのか</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <h3 className="font-bold mb-1">海外サイトの危険性</h3>
                <p className="text-gray-200 text-sm">検索上位の無料ツールサイトは多くが海外運営。社外秘資料をアップロードすることで情報漏洩のリスクがあります。</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <h3 className="font-bold mb-1">複雑な有料ソフト</h3>
                <p className="text-gray-200 text-sm">PDFの簡単な編集だけなのに、高額ソフトの購入や月額課金が必要になることが多々あります。</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="font-bold mb-1">山田ツールの解決策</h3>
                <p className="text-gray-200 text-sm">日本国内サーバーで安全に処理、完全無料、登録不要。必要な機能だけをシンプルに提供します。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-kon mb-6">👥 運営チーム</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">合同会社山田トレード</h3>
            <p className="text-gray-600 mb-4">山田ツールの開発・運営を行っています。</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 〒283-0811 千葉県東金市台方937番地13</p>
              <p>📧 お問い合わせ: <a href="mailto:support@yamada-tools.jp" className="text-sakura hover:underline">support@yamada-tools.jp</a></p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">開発・編集チーム</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-kon rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  開
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">開発チーム</h4>
                  <p className="text-sm text-gray-600">各種ツールの開発・保守、サーバー管理、セキュリティ対策を担当</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-sakura rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  編
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">山田ツール編集部</h4>
                  <p className="text-sm text-gray-600">ブログ記事の執筆、ツール使用ガイドの作成、ユーザーサポートを担当</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-kon mb-6">🌟 私たちの価値観</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🇯🇵</div>
              <h3 className="font-bold text-gray-900 mb-2">データ主権の尊重</h3>
              <p className="text-sm text-gray-600">日本国内サーバーのみで処理し、大切なデータを海外に送信しません</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🔓</div>
              <h3 className="font-bold text-gray-900 mb-2">アクセシビリティ</h3>
              <p className="text-sm text-gray-600">登録不要・完全無料。誰でもすぐに使えるツールを提供</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">透明性</h3>
              <p className="text-sm text-gray-600">データ処理方法、削除ポリシーを明確に開示</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-kon to-kon/95 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">📬 お問い合わせ</h2>
          <p className="mb-4">ご質問、ご要望、バグ報告などお気軽にお問い合わせください。</p>
          <div className="space-y-2">
            <p>📧 サポート: <a href="mailto:support@yamada-tools.jp" className="text-sakura hover:underline font-bold">support@yamada-tools.jp</a></p>
            <p>🔒 プライバシー関連: <a href="mailto:privacy@yamada-tools.jp" className="text-sakura hover:underline font-bold">privacy@yamada-tools.jp</a></p>
            <p>💬 一般お問い合わせ: <a href="mailto:contact@yamada-tools.jp" className="text-sakura hover:underline font-bold">contact@yamada-tools.jp</a></p>
          </div>
          
          <LastUpdated date="2024-12-07" />
        </div>
      </div>
    </div>
  );
}
