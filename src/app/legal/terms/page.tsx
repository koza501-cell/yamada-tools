import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "山田ツールの利用規約です。",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-kon mb-8">利用規約</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第1条（適用）</h2>
              <p className="text-sm leading-relaxed">
                本利用規約（以下「本規約」といいます）は、合同会社山田トレード（以下「当社」といいます）が提供する「山田ツール」（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆さま（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第2条（サービス内容）</h2>
              <p className="text-sm leading-relaxed mb-2">
                本サービスは、PDFファイルの編集、画像変換、文書作成など、各種オンラインツールを無料で提供するものです。
              </p>
              <p className="text-sm leading-relaxed">
                当社は、ユーザーに事前に通知することなく、本サービスの内容を変更、追加、または削除することがあります。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第3条（プライバシー保護）</h2>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-bold text-blue-900">ファイルの取り扱い</p>
                <ul className="space-y-1 text-blue-800">
                  <li>・ アップロードされたファイルは、処理完了後、自動的にサーバーから削除されます</li>
                  <li>・ 当社は、ユーザーのファイルを閲覧、保存、または第三者に共有することは一切ありません</li>
                  <li>・ すべての通信はSSL/TLS暗号化により保護されています</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第4条（禁止事項）</h2>
              <p className="text-sm mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第5条（免責事項）</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 space-y-2 text-sm">
                <p>
                  当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
                </p>
                <p>
                  本サービスの利用により生じた損害について、当社は一切の責任を負いません。ただし、当社に故意または重大な過失がある場合を除きます。
                </p>
                <p className="font-bold text-amber-900">
                  特に、請求書番号検証ツールや税金計算ツールなど、法的・会計的な結果を伴うツールの利用結果については、あくまで参考情報としてご利用ください。正確性を保証するものではありません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第6条（サービスの停止）</h2>
              <p className="text-sm leading-relaxed">
                当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
              </p>
              <ul className="space-y-1 text-sm list-disc list-inside mt-2">
                <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当社が本サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第7条（規約の変更）</h2>
              <p className="text-sm leading-relaxed">
                当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の規約は、本ウェブサイト上に表示された時点より効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-kon mb-4">第8条（準拠法・裁判管轄）</h2>
              <p className="text-sm leading-relaxed mb-2">
                本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
              <p className="text-sm leading-relaxed">
                本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
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
