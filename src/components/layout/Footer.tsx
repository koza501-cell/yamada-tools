import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-kon text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold">山田ツール</h3>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p className="font-medium">
                <a href="https://www.yamadatrade.com/" target="_blank" rel="noopener noreferrer" className="text-sakura hover:underline">
                  合同会社山田トレード
                </a>
              </p>
              <p>〒283-0811</p>
              <p>千葉県東金市台方937番地13</p>
              <p className="mt-4">
                <Link href="/about/transparency" className="text-sakura hover:underline">
                  運営方針とセキュリティについて
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">安心・安全</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🇯🇵</span>
                <div className="text-sm">
                  <p className="font-medium">日本国内サーバー</p>
                  <p className="text-gray-300 text-sm">大切なファイルは日本国内で処理</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div className="text-sm">
                  <p className="font-medium">SSL暗号化通信</p>
                  <p className="text-gray-300 text-sm">通信内容を完全保護</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🗑️</span>
                <div className="text-sm">
                  <p className="font-medium">自動削除</p>
                  <p className="text-gray-300 text-sm">処理完了後、すぐに削除</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">リンク</h3>
            <div className="space-y-2 text-sm">
              <div>
                <a href="https://www.yamadatrade.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-sakura transition-colors">
                  会社ウェブサイト
                </a>
              </div>
              <div>
                <Link href="/about/company" className="text-gray-300 hover:text-sakura transition-colors">
                  会社概要
                </Link>
              </div>
              <div>
                <Link href="/about/faq" className="text-gray-300 hover:text-sakura transition-colors">
                  よくある質問（FAQ）
                </Link>
              </div>
              <div>
                <Link href="/about/fair-usage" className="text-gray-300 hover:text-sakura transition-colors">
                  適正利用ガイドライン
                </Link>
              </div>
              <div>
                <Link href="/legal/terms" className="text-gray-300 hover:text-sakura transition-colors">
                  利用規約
                </Link>
              </div>
              <div>
                <Link href="/legal/privacy" className="text-gray-300 hover:text-sakura transition-colors">
                  プライバシーポリシー
                </Link>
              </div>
              <div>
                <Link href="/legal/tokushoho" className="text-gray-300 hover:text-sakura transition-colors">
                  特定商取引法に基づく表記
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 合同会社山田トレード. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
