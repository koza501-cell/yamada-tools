import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 山田ツール",
  description: "山田ツールの利用規約です。",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-kon mb-8 text-center">
          利用規約
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第1条（適用）</h2>
            <p className="text-gray-600 leading-relaxed">
              本規約は、合同会社山田トレード（以下「当社」）が提供する「山田ツール」
              （以下「本サービス」）の利用に関する条件を定めるものです。
              本サービスを利用されたすべての方（以下「利用者」）は、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第2条（サービス内容）</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスは、PDF編集・変換、画像編集、Officeファイル変換等の
              オンラインツールを無料で提供するものです。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第3条（利用制限）</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              本サービスには以下の利用制限があります：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>1ファイルあたりの最大サイズ：20MB</li>
              <li>1日あたりの処理回数：15回まで</li>
              <li>PDF結合時の最大ファイル数：50ファイル</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第4条（禁止事項）</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              利用者は、以下の行為を行ってはなりません：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社のサーバーまたはネットワークの機能を破壊・妨害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他の利用者に関する個人情報を収集・蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他者になりすます行為</li>
              <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>著作権、商標権その他の知的財産権を侵害する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第5条（ファイルの取り扱い）</h2>
            <div className="bg-sakura/20 rounded-xl p-4">
              <ul className="text-gray-600 space-y-2">
                <li>• アップロードされたファイルは処理後10分で自動的に削除されます</li>
                <li>• 当社はファイルの内容を閲覧・保存・共有することはありません</li>
                <li>• 利用者は、アップロードするファイルの権利を有している必要があります</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第6条（免責事項）</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。
              本サービスの利用によって生じた損害について、当社は一切の責任を負いません。
              重要なファイルを処理する前に、必ずバックアップを取ってください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第7条（サービスの変更・停止）</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、利用者に事前の通知なく、本サービスの内容を変更し、
              または本サービスの提供を停止・中断することができるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第8条（規約の変更）</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、本規約を変更することができるものとします。
              変更後の規約は、本サービス上に掲示した時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-kon mb-4">第9条（準拠法・管轄裁判所）</h2>
            <p className="text-gray-600 leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。
              本サービスに関して紛争が生じた場合には、東京地方裁判所を専属的合意管轄とします。
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
