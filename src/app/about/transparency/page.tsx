import Link from "next/link";
import type { Metadata } from "next";
import TrustBadges from "@/components/TrustBadges";
import CompanyLogosWall from "@/components/CompanyLogosWall";

export const metadata: Metadata = {
  title: "運営方針とセキュリティ",
  description: "山田ツールの運営方針、セキュリティ対策、および各種ツールの免責事項について",
  alternates: {
    canonical: 'https://yamada-tools.jp/about/transparency',
  },
};

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-kon mb-8">運営方針とセキュリティ</h1>

          <div className="space-y-8 text-gray-700">

            {/* Trust Badges */}
            <section>
              <h2 className="text-xl font-bold text-kon mb-4">認証・セキュリティ基準</h2>
              <TrustBadges />
            </section>

            {/* Security Overview */}
            <section className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>🔒</span>
                <span>セキュリティとプライバシー保護</span>
              </h2>
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-green-800">
                  山田ツールのすべてのサービスは、国内に設置された日本国内のサーバーで動作しております。
                  お客様からお預かりするファイルや入力情報が海外のサーバーに送信されることは一切ございません。
                </p>
                <p className="text-green-800">
                  通信はすべて TLS 1.3 により暗号化されており、第三者による盗聴や改ざんを防いでいます。
                  アップロードされたファイルはサーバー上で処理された後、60分以内に自動的かつ完全に削除されます。
                  ログは運用上の最低限に限定しており、お客様のファイル内容を閲覧・保存・第三者と共有することはございません。
                </p>
                <p className="text-green-800">
                  セキュリティに関するご質問や脆弱性のご報告は、下記お問い合わせ窓口までお知らせください。
                  責任ある開示（Responsible Disclosure）を歓迎しております。
                </p>
                <div className="pt-2">
                  <Link
                    href="/about/contact"
                    className="inline-flex items-center gap-1 text-green-900 font-medium underline hover:text-kon"
                  >
                    セキュリティに関するお問い合わせはこちら →
                  </Link>
                </div>
              </div>
            </section>

            {/* Critical Disclaimers */}
            <section className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-200">
              <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>重要な免責事項</span>
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-kon mb-2 flex items-center gap-2">
                    <span>📝</span>
                    <span>適格請求書発行事業者登録番号検証ツールについて</span>
                  </h3>
                  <div className="space-y-2 text-sm text-kon">
                    <p><strong className="text-danger">このツールは情報提供のみを目的としています。</strong></p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>適格請求書発行事業者の登録番号の検証結果について、当社は一切の責任を負いません</li>
                      <li>正式な確認は必ず<strong>国税庁の公式サイト</strong>で行ってください</li>
                      <li>本ツールの結果に基づく取引上の損害について、当社は責任を負いかねます</li>
                      <li>インボイス制度に関する正確な情報は、税理士または国税庁にご確認ください</li>
                    </ul>
                    <p className="pt-2 text-xs text-gray-600">
                      参考：<a href="https://www.invoice-kohyo.nta.go.jp/" target="_blank" rel="noopener noreferrer" className="text-kon hover:underline">国税庁 適格請求書発行事業者公表サイト</a>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-kon mb-2 flex items-center gap-2">
                    <span>💰</span>
                    <span>税金計算・給与計算ツールについて</span>
                  </h3>
                  <div className="space-y-2 text-sm text-kon">
                    <p><strong>これらのツールは参考情報としてご利用ください。</strong></p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>計算結果の正確性を保証するものではありません</li>
                      <li>税制は頻繁に変更されるため、最新の法令を確認してください</li>
                      <li>個別の状況により計算方法が異なる場合があります</li>
                      <li>正式な税務処理や給与計算は、<strong>税理士・社会保険労務士・会計士にご相談ください</strong></li>
                      <li>本ツールの計算結果に基づく申告ミスや過払い等について、当社は責任を負いかねます</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-kon mb-2 flex items-center gap-2">
                    <span>📄</span>
                    <span>書類作成ツール（請求書・履歴書等）について</span>
                  </h3>
                  <div className="space-y-2 text-sm text-kon">
                    <p><strong>生成されるテンプレートは一般的な形式に基づいています。</strong></p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>業種、用途、取引先の要求に応じて、<strong>必ず内容を確認・修正してからご利用ください</strong></li>
                      <li>履歴書はJIS規格を参考にしていますが、企業や職種により求められる形式が異なります</li>
                      <li>請求書はインボイス制度に対応した項目を含みますが、<strong>個別の取引条件は必ずご自身で確認してください</strong></li>
                      <li>契約書や重要書類の作成には、必ず専門家（弁護士・行政書士等）の確認を受けることを推奨します</li>
                      <li>テンプレート使用による契約トラブルや法的問題について、当社は一切の責任を負いません</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-kon mb-2 flex items-center gap-2">
                    <span>📅</span>
                    <span>和暦・西暦変換、住所・電話番号変換について</span>
                  </h3>
                  <div className="space-y-2 text-sm text-kon">
                    <p><strong>変換結果は一般的なルールに基づいていますが、例外があります。</strong></p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>公的書類への記載には、必ず公式な情報源で確認してください</li>
                      <li>郵便番号・住所変換は郵便局の最新データを反映していない場合があります</li>
                      <li>重要な書類作成時は、最新の情報を公式サイトで確認することを推奨します</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Logos */}
            <section>
              <h2 className="text-xl font-bold text-kon mb-4">ご利用企業</h2>
              <CompanyLogosWall />
            </section>

            {/* Service Quality */}
            <section>
              <h2 className="text-xl font-bold text-kon mb-4">サービス品質について</h2>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-kon mb-2">🏗️ 現在ベータ版公開中</p>
                  <p className="text-kon">
                    本サービスは現在ベータ版として公開しており、継続的な改善を行っています。予告なく仕様変更や一時的なサービス停止を行う場合があります。
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-kon mb-2">💬 フィードバック歓迎</p>
                  <p className="text-kon">
                    バグ報告や改善提案は大歓迎です。画面右下のフィードバックボタンからお気軽にご連絡ください。みなさまのご意見をもとに、より使いやすいサービスを目指します。
                  </p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section>
              <h2 className="text-xl font-bold text-kon mb-4">サポート・お問い合わせ窓口</h2>
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <p className="mb-3">ご不明な点やお問い合わせは、以下の方法でご連絡ください。</p>
                <ul className="space-y-2">
                  <li>• フィードバックボタン（画面右下）</li>
                  <li>• <Link href="/about/contact" className="text-kon hover:underline font-medium">お問い合わせフォーム</Link></li>
                  <li>• メール：<a href="mailto:support@yamadatrade.jp" className="text-kon hover:underline">support@yamadatrade.jp</a></li>
                </ul>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-kon/10 to-ai/10 p-6 rounded-xl border border-kon/20">
              <h2 className="text-xl font-bold text-kon mb-3">まとめ</h2>
              <div className="space-y-2 text-sm">
                <p>
                  山田ツールは、<strong>日本国内で安全に</strong>ファイル処理を行うことを最優先にしています。
                </p>
                <p>
                  ただし、法的・会計的な判断を伴うツール（請求書番号検証、税金計算、書類作成等）については、<strong>必ず専門家の確認を受けるか、公式情報源で確認してください。</strong>
                </p>
                <p className="font-bold text-kon">
                  本サービスは便利なツールとして「参考情報」を提供するものであり、法的責任を伴う判断の根拠とはなりません。
                </p>
              </div>
            </section>

            <div className="pt-8 text-sm text-gray-500 text-right">
              <p>最終更新日：2026年4月29日</p>
              <p className="mt-2">合同会社山田トレード</p>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/legal/terms" className="text-kon hover:underline text-sm">
                利用規約
              </Link>
              <Link href="/legal/privacy" className="text-kon hover:underline text-sm">
                プライバシーポリシー
              </Link>
              <Link href="/about/contact" className="text-kon hover:underline text-sm">
                お問い合わせ
              </Link>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-kon hover:underline">
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
