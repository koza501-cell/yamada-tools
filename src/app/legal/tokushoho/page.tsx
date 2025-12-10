import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | 山田ツール",
  description: "山田ツールの特定商取引法に基づく表記です。",
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
                <td className="py-4 pr-4 font-bold text-kon align-top">所在地</td>
                <td className="py-4">
                  〒283-0811<br />
                  千葉県東金市台方937番地13
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">電話番号</td>
                <td className="py-4">
                  お問い合わせはメールにてお願いいたします
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">メールアドレス</td>
                <td className="py-4">
                  お問い合わせページよりご連絡ください
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
                  基本サービス：無料<br />
                  ※将来的に有料プランを導入する場合は、別途明示いたします
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">支払方法</td>
                <td className="py-4">
                  現在、有料サービスは提供しておりません
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">サービス提供時期</td>
                <td className="py-4">
                  ファイルアップロード後、即時処理いたします
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-kon align-top">返品・キャンセル</td>
                <td className="py-4">
                  デジタルサービスの性質上、処理完了後の返品・キャンセルはお受けできません
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
          <p>最終更新日: 2025年11月</p>
        </div>
      </div>
    </div>
  );
}
