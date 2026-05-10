import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "山田ツール（合同会社山田トレード運営）のプライバシーポリシー。個人情報の取得・利用目的・第三者提供・安全管理措置・開示請求方法を明記。ファイルは60分自動削除、日本国内サーバー処理で安心してご利用いただけます。",
  alternates: {
    canonical: 'https://yamada-tools.jp/legal/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-kon mb-8">プライバシーポリシー</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <p className="text-sm leading-relaxed mb-4">
                合同会社山田トレード（以下「当社」）は、本ウェブサイト上で提供するサービス「山田ツール」（以下「本サービス」）におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第1条（個人情報）</h2>
              <p className="text-sm leading-relaxed">
                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第2条（個人情報の収集方法）</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-bold text-kon mb-1">アカウント情報</p>
                    <p className="text-kon">
                      本サービスへのアカウント登録（メールアドレスによる登録またはGoogleアカウント連携）を行った場合、メールアドレスおよびプロフィール情報を収集します。ゲストとしてツールを利用する場合、アカウント登録は不要です。
                    </p>
                  </div>

                  <div>
                    <p className="font-bold text-kon mb-1">アップロードされたファイルについて</p>
                    <ul className="space-y-1 text-kon">
                      <li>・ ファイルは処理完了後60分以内に、サーバーから完全に削除されます</li>
                      <li>・ ファイルの内容を当社が閲覧、保存することは一切ありません</li>
                      <li>・ 第三者にファイルを共有することは一切ありません</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第3条（決済情報の取り扱い）</h2>
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-bold text-green-900">Stripeによる決済処理</p>
                <ul className="space-y-1 text-green-800">
                  <li>・ 本サービスの有料プランの決済は、Stripe, Inc.が提供する決済システムを利用しています</li>
                  <li>・ クレジットカード番号などの決済情報は、当社のサーバーには一切保存されません</li>
                  <li>・ 決済情報はStripeのシステム上で安全に管理されます</li>
                  <li>・ Stripeのプライバシーポリシーについては、<a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" className="text-kon hover:underline">Stripe プライバシーポリシー</a>をご確認ください</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第4条（アクセス解析ツール）</h2>
              <p className="text-sm leading-relaxed mb-2">
                当社は、本サービスの利用状況を把握するため、Google Analyticsを使用しています。
              </p>
              <div className="space-y-2 text-sm">
                <p>Google Analyticsは、Cookieを使用してユーザーの情報を収集します。収集される情報は匿名で集計され、個人を特定するものではありません。</p>
                <p>
                  Google Analyticsの詳細については、
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-kon hover:underline"
                  >
                    Googleプライバシーポリシー
                  </a>
                  をご確認ください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第5条（Cookieの使用・広告配信）</h2>
              <p className="text-sm leading-relaxed mb-2">
                本サービスでは、以下の目的でCookieを使用します。
              </p>
              <ul className="space-y-1 text-sm list-disc list-inside mb-3">
                <li>サービスの利用状況の分析</li>
                <li>ユーザー体験の向上（バナーの表示/非表示、ログイン状態の保持など）</li>
                <li>広告配信の最適化</li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <p className="font-bold text-gray-800">Google AdSenseによる広告配信</p>
                <p className="text-gray-700">
                  本サービスではGoogle AdSenseを利用して広告を配信しています。Google AdSenseはCookieを使用して、ユーザーの興味・関心に基づいた広告を表示します。収集される情報は個人を特定するものではありません。
                  広告のパーソナライズを無効にしたい場合は、<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-kon hover:underline">Googleの広告設定</a>よりご変更ください。
                </p>
              </div>
              <p className="text-sm mt-3">
                Cookieの使用を望まない場合は、ブラウザの設定でCookieを無効にすることができます。ただし、Cookieを無効にした場合、本サービスの一部機能が正常に動作しない可能性があります。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第6条（ユーザーアカウントデータの保持・削除）</h2>
              <div className="space-y-2 text-sm">
                <p>アカウントを作成された場合、以下のデータを保持します：</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>メールアドレス</li>
                  <li>プラン情報および利用履歴</li>
                  <li>サービス利用に関するログ</li>
                </ul>
                <p className="mt-2">アカウントを削除した場合、関連するデータは30日以内に削除されます。削除を希望される場合は、マイページの「アカウント設定」から手続きいただくか、<a href="mailto:privacy@yamada-tools.jp" className="text-kon hover:underline">privacy@yamada-tools.jp</a>までご連絡ください。</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第7条（お問い合わせへの対応）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーが当社にお問い合わせやフィードバックを送信する際、メールアドレスなどの連絡先情報を任意で提供いただく場合があります。これらの情報は、お問い合わせへの対応およびサービス改善の目的でのみ使用し、他の目的で使用することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第8条（セキュリティ）</h2>
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-bold text-green-900">当社のセキュリティ対策</p>
                <ul className="space-y-1 text-green-800">
                  <li>・ 全ての通信はSSL/TLS暗号化により保護されています</li>
                  <li>・ サーバーは日本国内に設置され、適切な物理的セキュリティ対策が施されています</li>
                  <li>・ アップロードされたファイルは処理後60分以内に自動削除されます</li>
                  <li>・ 不正アクセス防止のため、定期的なセキュリティチェックを実施しています</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第9条（プライバシーポリシーの変更）</h2>
              <p className="text-sm leading-relaxed">
                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第10条（お問い合わせ窓口）</h2>
              <p className="text-sm leading-relaxed mb-2">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <p className="font-bold mb-2">合同会社山田トレード</p>
                <p>〒283-0811 千葉県東金市台方937番地13</p>
                <p className="mt-2">
                  メール：
                  <a
                    href="mailto:privacy@yamada-tools.jp"
                    className="text-kon hover:underline"
                  >
                    privacy@yamada-tools.jp
                  </a>
                </p>
              </div>
            </section>

            <div className="pt-8 text-sm text-gray-500 text-right">
              <p>制定日：2024年12月4日</p>
              <p>最終更新日：2026年4月</p>
              <p className="mt-2">合同会社山田トレード</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-kon hover:underline"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
