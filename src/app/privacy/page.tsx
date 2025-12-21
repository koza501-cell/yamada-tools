import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 山田ツール",
  description: "山田ツールのプライバシーポリシーです。",
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
              <li>アップロードされたファイル（処理目的のみに使用）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
              <li>Cookie情報（サービス改善のため）</li>
            </ul>
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
            <h2 className="text-xl font-bold text-kon mb-4">4. 情報の利用目的</h2>
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
            <h2 className="text-xl font-bold text-kon mb-4">5. 第三者への提供</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、法令に基づく場合を除き、お客様の個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">6. アクセス解析</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスでは、サービス改善のためアクセス解析ツールを使用する場合があります。
              これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">7. セキュリティ</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、お客様の情報を保護するため、適切なセキュリティ対策を講じております。
              ただし、インターネット上の通信において完全なセキュリティを保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">8. お問い合わせ</h2>
            <p className="text-gray-600 leading-relaxed">
              本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
            </p>
            <p className="text-gray-600 mt-2">
              メール：support@yamada-tools.jp
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">9. 改定</h2>
            <p className="text-gray-600 leading-relaxed">
              本プライバシーポリシーは、必要に応じて改定することがあります。
              重要な変更がある場合は、本サービス上でお知らせいたします。
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>制定日: 2024年11月</p>
          <p>最終更新日: 2024年11月</p>
        </div>
      </div>
    </div>
  );
}
