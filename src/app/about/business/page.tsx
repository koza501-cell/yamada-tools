import { Metadata } from "next";
import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import CompanyLogosWall from "@/components/CompanyLogosWall";

export const metadata: Metadata = {
  title: "法人・企業様向け | 山田ツール - 安心のセキュリティで業務効率化",
  description:
    "日本国内サーバー完結、60分自動削除、SSL暗号化。情報システム部門も安心の無料オンラインツール。PDF編集、書類作成、画像処理など71種類のツールを登録不要でご利用いただけます。",
  alternates: {
    canonical: 'https://yamada-tools.jp/about/business',
  },
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4">

        <header className="text-center mb-12">
          <p className="text-kon mb-2">法人・企業様向け</p>
          <h1 className="text-3xl font-bold text-kon mb-4">
            情報システム部門も安心の<br />セキュリティ基準
          </h1>
          <p className="text-gray-600">
            日本国内サーバー完結・60分自動削除・SSL暗号化
          </p>
        </header>

        <article className="space-y-8">

          {/* Trust Badges — config-driven, see src/config/certifications.ts */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <TrustBadges />
          </section>

          {/* Security Details */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
              <span>🖥️</span> 情報システム部門の方へ
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">📁</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">ファイル処理の仕組み</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• サーバーの一時メモリ領域（RAMディスク）で処理</li>
                    <li>• 処理完了と同時にサーバーから完全削除</li>
                    <li>• 最大60分以内にシステムが自動削除</li>
                    <li>• 物理ストレージへの書き込みなし</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">🔐</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">アクセス制御</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• お客様のセッション以外からのアクセスは技術的に不可能</li>
                    <li>• ファイル内容を当社が閲覧することは一切なし</li>
                    <li>• 第三者へのファイル共有は一切なし</li>
                    <li>• バックアップ目的での保存も行いません</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">📋</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">コンプライアンス対応</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• 個人情報保護法（APPI）準拠のプライバシーポリシー</li>
                    <li>• 特定商取引法に基づく表記を完備</li>
                    <li>• 利用規約にて禁止事項・免責事項を明確化</li>
                    <li>• 運営会社情報を公開（合同会社山田トレード）</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
              <span>💼</span> こんな業務に活用されています
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">📄 経理・総務部門</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 請求書・見積書・領収書のPDF作成</li>
                  <li>• 契約書PDFの結合・分割</li>
                  <li>• 年末調整計算シミュレーション</li>
                  <li>• インボイス番号（T番号）検証</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">👥 人事・採用部門</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 応募書類PDFの圧縮・整理</li>
                  <li>• 履歴書フォーマット作成</li>
                  <li>• 給与手取りシミュレーション</li>
                  <li>• 社内文書のパスワード保護</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">💼 営業部門</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• 提案資料PDFの圧縮（メール添付用）</li>
                  <li>• 名刺データのPDF化</li>
                  <li>• FAX送付状の作成</li>
                  <li>• QRコード作成（URL共有）</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">🖥️ 情報システム部門</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• パスワード生成ツール</li>
                  <li>• ハッシュ値計算（整合性確認）</li>
                  <li>• JSON整形・バリデーション</li>
                  <li>• Base64エンコード・デコード</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tools Overview */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
              <span>🛠️</span> 71種類のツールをすべて無料で
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Link href="/pdf" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-1">📄</div>
                <p className="font-bold text-gray-800 text-sm">PDF</p>
                <p className="text-xs text-gray-500">20ツール</p>
              </Link>
              <Link href="/document" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-1">📝</div>
                <p className="font-bold text-gray-800 text-sm">書類作成</p>
                <p className="text-xs text-gray-500">10ツール</p>
              </Link>
              <Link href="/convert" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-1">🔄</div>
                <p className="font-bold text-gray-800 text-sm">変換</p>
                <p className="text-xs text-gray-500">9ツール</p>
              </Link>
              <Link href="/image" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-1">🖼️</div>
                <p className="font-bold text-gray-800 text-sm">画像</p>
                <p className="text-xs text-gray-500">6ツール</p>
              </Link>
              <Link href="/generator" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-1">⚡</div>
                <p className="font-bold text-gray-800 text-sm">計算・生成</p>
                <p className="text-xs text-gray-500">20ツール</p>
              </Link>
            </div>
          </section>

          {/* Company Logos */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-6">ご利用企業</h2>
            <CompanyLogosWall />
          </section>

          {/* Company Info */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
              <span>🏢</span> 運営会社
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <th className="py-3 text-left text-gray-500 w-1/3">会社名</th>
                    <td className="py-3 text-gray-800">合同会社山田トレード</td>
                  </tr>
                  <tr>
                    <th className="py-3 text-left text-gray-500">設立</th>
                    <td className="py-3 text-gray-800">2024年</td>
                  </tr>
                  <tr>
                    <th className="py-3 text-left text-gray-500">所在地</th>
                    <td className="py-3 text-gray-800">〒283-0811 千葉県東金市台方937番地13</td>
                  </tr>
                  <tr>
                    <th className="py-3 text-left text-gray-500">事業内容</th>
                    <td className="py-3 text-gray-800">オンラインツールサービスの提供</td>
                  </tr>
                  <tr>
                    <th className="py-3 text-left text-gray-500">サーバー所在地</th>
                    <td className="py-3 text-gray-800">日本国内</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>


          {/* Security Document Download */}
          <section id="download" className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>📋</span> セキュリティ確認書・導入事例
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              情報システム部門への導入稟議・セキュリティ審査にご活用ください。
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl mb-2">🏭</div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">製造業・メーカー</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">全銀フォーマット・請求書作成での活用</p>
                <p className="text-xs text-kon dark:text-blue-400 mt-2 font-medium">→ 振込データ変換作業を担当者1名で完結。月次処理の工数を大幅削減。</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl mb-2">🏥</div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">医療・福祉</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">患者書類PDF処理・ファイル圧縮での活用</p>
                <p className="text-xs text-kon dark:text-blue-400 mt-2 font-medium">→ ブラウザのみで即日導入。インストール不要で情報システム審査もスムーズ。</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl mb-2">🏛️</div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">自治体・行政</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">申請書PDF処理・封筒印刷での活用</p>
                <p className="text-xs text-kon dark:text-blue-400 mt-2 font-medium">→ 住民向け封筒の宛名印刷を内製化。外注コストをゼロに。</p>
              </div>
            </div>
            <a
              href="https://forms.gle/2mmoGqLif1Cqe5vL6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-kon text-white px-6 py-3 rounded-xl font-bold hover:bg-ai transition-colors text-sm"
            >
              📥 セキュリティ確認書・稟議資料を請求する
            </a>
          </section>

          {/* Sales / Support Contact */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>📩</span> お問い合わせ窓口
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="font-bold text-blue-900 mb-1">💼 導入のご相談・お見積もり</p>
                <a href="mailto:info@yamadatrade.jp" className="text-kon hover:underline font-medium">
                  info@yamadatrade.jp
                </a>
                <p className="text-xs text-gray-500 mt-1">法人導入・価格交渉・ご提案依頼</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="font-bold text-gray-800 mb-1">🛠 技術サポート・バグ報告</p>
                <a href="mailto:support@yamadatrade.jp" className="text-kon hover:underline font-medium">
                  support@yamadatrade.jp
                </a>
                <p className="text-xs text-gray-500 mt-1">ツールの不具合・セキュリティご報告</p>
              </div>
            </div>
          </section>

          {/* Legal Links */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>📜</span> 法的情報
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/legal/privacy" className="text-sm text-kon hover:underline">プライバシーポリシー</Link>
              <span className="text-gray-300">|</span>
              <Link href="/legal/terms" className="text-sm text-kon hover:underline">利用規約</Link>
              <span className="text-gray-300">|</span>
              <Link href="/legal/tokushoho" className="text-sm text-kon hover:underline">特定商取引法に基づく表記</Link>
              <span className="text-gray-300">|</span>
              <Link href="/about/transparency" className="text-sm text-kon hover:underline">運営方針とセキュリティ</Link>
              <span className="text-gray-300">|</span>
              <Link href="/about/fair-usage" className="text-sm text-kon hover:underline">適正利用ガイドライン</Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-kon to-ai rounded-2xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-4">まずはお試しください</h2>
            <p className="leading-relaxed mb-6 opacity-95">
              登録不要・無料ですべてのツールをご利用いただけます<br />
              ご質問やご要望がございましたらお気軽にお問い合わせください
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-white text-kon rounded-xl font-bold hover:bg-gray-100 transition-colors">
                ツールを使ってみる
              </Link>
              <Link href="https://forms.gle/2mmoGqLif1Cqe5vL6" target="_blank" className="px-6 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                お問い合わせ
              </Link>
            </div>
          </section>

        </article>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>合同会社山田トレード</p>
          <p>千葉県東金市台方937-13</p>
        </footer>

      </div>
    </div>
  );
}
