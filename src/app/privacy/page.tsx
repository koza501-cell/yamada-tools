import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "山田ツールのプライバシーポリシーです。",
  alternates: {
    canonical: 'https://yamada-tools.jp/legal/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-kon mb-8 text-center">
          プライバシーポリシー
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-kon mb-4">1. はじめに</h2>
            <p className="text-gray-600 leading-relaxed">
              合同会社山田トレード（以下「当社」）は、お客様のプライバシーを尊重し、
              個人情報の保護に努めております。本プライバシーポリシーでは、
              当社が運営する「山田ツール」（以下「本サービス」）における
              個人情報の取り扱いについて説明いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">2. 収集する情報</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              本サービスでは、以下の情報を収集する場合があります：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>アカウント登録時のメールアドレス（登録した場合のみ）</li>
              <li>アップロードされたファイル（処理目的のみに使用）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
              <li>Cookie情報（サービス改善・広告配信のため）</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              ゲストとしてツールをご利用の場合、アカウント登録は不要です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">3. ファイルの取り扱い</h2>
            <div className="bg-sakura/20 rounded-xl p-4">
              <ul className="text-gray-600 space-y-2">
                <li>🔒 すべての通信はSSL/TLSで暗号化されています</li>
                <li>🇯🇵 ファイルは日本国内のサーバーで処理されます</li>
                <li>🗑️ アップロードされたファイルは処理後<strong>60分で自動削除</strong>されます</li>
                <li>👁️ 当社スタッフがお客様のファイル内容を閲覧することはありません</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">4. 決済情報の取り扱い</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              有料プランの決済はStripe, Inc.が提供する決済システムを利用しています。クレジットカード番号などの決済情報は当社サーバーには保存されません。決済情報はStripeのシステム上で安全に管理されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">5. 情報の利用目的</h2>
            <p className="text-gray-600 leading-relaxed">
              収集した情報は、以下の目的でのみ使用いたします：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>ファイル変換・編集サービスの提供</li>
              <li>サービスの改善・新機能の開発</li>
              <li>不正利用の防止・セキュリティ確保</li>
              <li>統計データの作成（個人を特定しない形式）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">6. 第三者への提供</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、法令に基づく場合を除き、お客様の個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">7. アクセス解析・広告配信</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              本サービスでは、Google Analyticsによるアクセス解析およびGoogle AdSenseによる広告配信を行っています。これらはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。広告のパーソナライズを無効にしたい場合は、Googleの広告設定よりご変更ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">8. セキュリティ</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、お客様の情報を保護するため、適切なセキュリティ対策を講じております。
              ただし、インターネット上の通信において完全なセキュリティを保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">9. お問い合わせ</h2>
            <p className="text-gray-600 leading-relaxed">
              本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
            </p>
            <p className="text-gray-600 mt-2">
              メール：privacy@yamada-tools.jp
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">10. 利用統計について</h2>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>📊 ツールの利用記録（回数・節約時間・節約金額）は<strong>ご利用のブラウザのlocalStorageにのみ保存</strong>されます</li>
                <li>🔒 ゲスト利用の場合、この記録は当社サーバーには送信されません</li>
                <li>👤 アカウント登録・ログインした場合のみ、記録はサーバーに同期されます</li>
                <li>🗑️ 記録は<a href="/dashboard" className="text-blue-600 hover:underline">ダッシュボード</a>の「クリア」ボタンでいつでも削除できます</li>
              </ul>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              利用統計は節約効果の目安を提供するためのものであり、外部への提供や広告ターゲティングには使用しません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">11. 改定</h2>
            <p className="text-gray-600 leading-relaxed">
              本プライバシーポリシーは、必要に応じて改定することがあります。
              重要な変更がある場合は、本サービス上でお知らせいたします。
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>制定日: 2024年11月</p>
          <p>最終更新日: 2026年5月</p>
        </div>
      </div>
    </div>
  );
}
