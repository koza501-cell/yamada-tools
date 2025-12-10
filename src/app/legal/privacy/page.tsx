import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "山田ツールのプライバシーポリシーです。",
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
              <div className="bg-blue-50 p-4 rounded-lg space-y-3 text-sm">
                <div>
                  <p className="font-bold text-blue-900 mb-1">本サービスでは、基本的に個人情報を収集しません。</p>
                  <p className="text-blue-800">
                    本サービスは会員登録が不要で、氏名、メールアドレス、電話番号などの個人を特定できる情報の入力を求めません。
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-blue-900 mb-1">アップロードされたファイルについて</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>・ ファイルは処理完了後、自動的にサーバーから完全に削除されます</li>
                    <li>・ ファイルの内容を当社が閲覧、保存することは一切ありません</li>
                    <li>・ 第三者にファイルを共有することは一切ありません</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第3条（アクセス解析ツール）</h2>
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
              <h2 className="text-xl font-bold text-kon mb-4">第4条（Cookieの使用）</h2>
              <p className="text-sm leading-relaxed mb-2">
                本サービスでは、以下の目的でCookieを使用します。
              </p>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>サービスの利用状況の分析</li>
                <li>ユーザー体験の向上（ベータバナーの表示/非表示など）</li>
                <li>広告配信の最適化（将来的に広告を導入する際）</li>
              </ul>
              <p className="text-sm mt-3">
                Cookieの使用を望まない場合は、ブラウザの設定でCookieを無効にすることができます。ただし、Cookieを無効にした場合、本サービスの一部機能が正常に動作しない可能性があります。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第5条（お問い合わせへの対応）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーが当社にお問い合わせやフィードバックを送信する際、メールアドレスなどの連絡先情報を任意で提供いただく場合があります。これらの情報は、お問い合わせへの対応およびサービス改善の目的でのみ使用し、他の目的で使用することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第6条（セキュリティ）</h2>
              <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-bold text-green-900">当社のセキュリティ対策</p>
                <ul className="space-y-1 text-green-800">
                  <li>・ 全ての通信はSSL/TLS暗号化により保護されています</li>
                  <li>・ サーバーは日本国内に設置され、適切な物理的セキュリティ対策が施されています</li>
                  <li>・ アップロードされたファイルは処理後、即座に削除されます</li>
                  <li>・ 不正アクセス防止のため、定期的なセキュリティチェックを実施しています</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第7条（プライバシーポリシーの変更）</h2>
              <p className="text-sm leading-relaxed">
                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第8条（お問い合わせ窓口）</h2>
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
