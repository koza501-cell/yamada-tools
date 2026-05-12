import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "山田ツール（合同会社山田トレード運営）の特定商取引法に基づく表記。販売事業者情報、所在地、代表者、料金、支払方法、返品ポリシー、サービス提供時期など法定事項を明記。安心してサービスをご利用ください。",
  alternates: {
    canonical: 'https://yamada-tools.jp/legal/tokushoho',
  },
};

export default function LegalPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-kon mb-8 text-center">
          特定商取引法に基づく表記
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top w-1/3">事業者名</td>
                <td className="py-4">合同会社山田トレード<br />(Yamada Trade LLC)</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">法人番号</td>
                <td className="py-4">0400-03-024822</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">代表者</td>
                <td className="py-4">代表社員 山田フェサル</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">所在地</td>
                <td className="py-4">
                  〒283-0811<br />
                  千葉県東金市台方937番地13
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">電話番号</td>
                <td className="py-4">
                  0475-67-0495<br />
                  <span className="text-sm text-gray-500">受付時間: 平日 10:00〜17:00（土日祝日を除く）</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">メールアドレス</td>
                <td className="py-4">
                  support@yamada-tools.jp<br />
                  <span className="text-sm text-gray-500">または <a href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a> よりご連絡ください</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">サービス内容</td>
                <td className="py-4">
                  PDF編集・変換、画像編集、Officeファイル変換等のオンラインツールの提供
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">サービス料金</td>
                <td className="py-4">
                  <strong>FREEプラン：</strong>無料<br />
                  <strong>PROプラン：</strong>月額980円（税込）または年額9,800円（税込）<br />
                  <strong>TEAMプラン：</strong>月額1,480円/ユーザー（税込）または年額11,760円/ユーザー（税込）<br />
                  <strong>ENTERPRISEプラン：</strong>個別お見積もり（お問い合わせください）<br />
                  <strong>デイパス：</strong>1日パス120円、3日パス290円、7日パス490円（すべて税込）<br />
                  <span className="text-sm text-gray-500">※ PRO・TEAMプランには10日間の無料体験あり</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">商品以外に必要な代金</td>
                <td className="py-4">
                  サービス料金以外に必要な費用はございません<br />
                  <span className="text-sm text-gray-500">※ インターネット接続料金等はお客様のご負担となります</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">支払方法</td>
                <td className="py-4">
                  <strong>クレジットカード：</strong>Visa、Mastercard、JCB、American Express<br />
                  <span className="text-sm text-gray-500">└ Stripe決済システムを利用</span><br /><br />
                  <strong>その他の決済方法：</strong>コンビニ払い、PayPay、銀行振込、atone（後払い）<br />
                  <span className="text-sm text-gray-500">└ KOMOJU決済システムを利用</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">支払時期</td>
                <td className="py-4">
                  月払い：毎月自動更新（契約開始日から1ヶ月ごと）<br />
                  年払い：年間一括前払い（契約開始日から1年ごと）<br />
                  <span className="text-sm text-gray-500">※ 無料体験期間中は課金されません</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">無料体験期間</td>
                <td className="py-4">
                  10日間の無料体験あり。期間中は自動課金なし。<br />
                  期間終了後、解約しない場合は選択プランで自動課金されます。<br />
                  解約した場合は自動的に無料プランへ移行します。
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">サービス提供時期</td>
                <td className="py-4">
                  お支払い確認後、即時ご利用いただけます
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">返品・キャンセル</td>
                <td className="py-4">
                  デジタルサービスの性質上、お支払い後の返金は原則として対応できません。<br />
                  解約はマイページより即時手続き可能です。<br />
                  解約後は当該請求期間の末日までサービスをご利用いただけます。
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">動作環境</td>
                <td className="py-4">
                  最新版のChrome、Firefox、Safari、Edge等のWebブラウザ<br />
                  インターネット接続環境
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>最終更新日: 2026年4月</p>
        </div>
      </div>
    </div>
  );
}
