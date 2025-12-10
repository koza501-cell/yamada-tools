import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "適正利用ガイドライン | 山田ツール",
  description: "山田ツールの適正利用ガイドライン。無料で快適にご利用いただくための利用制限とルールについて説明します。",
};

export default function FairUsagePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-kon mb-8">適正利用ガイドライン</h1>

          <div className="space-y-8 text-gray-700">
            <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-bold text-blue-900 mb-4">📘 このガイドラインについて</h2>
              <p className="text-sm leading-relaxed text-blue-800">
                山田ツールは、多くの皆様に無料で快適にご利用いただくため、サーバーリソースの公平な配分と安定したサービス提供を目的として、適正利用ガイドラインを設けています。通常の個人利用や業務利用であれば、これらの制限に達することはほとんどありません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-kon mb-4">利用制限の概要</h2>
              
              <div className="space-y-4">
                <div className="bg-white border-2 border-kon/20 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-kon mb-3 flex items-center gap-2">
                    <span>⏰</span>
                    <span>時間制限</span>
                  </h3>
                  <div className="ml-8">
                    <p className="font-bold text-gray-900 mb-2">1時間あたり：最大50ファイル</p>
                    <p className="text-sm text-gray-600">
                      1時間以内に50ファイル以上を処理した場合、一時的に制限がかかります。制限は1時間後に自動解除されます。
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-kon/20 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-kon mb-3 flex items-center gap-2">
                    <span>📅</span>
                    <span>日次制限</span>
                  </h3>
                  <div className="ml-8">
                    <p className="font-bold text-gray-900 mb-2">1日あたり：最大200ファイル</p>
                    <p className="text-sm text-gray-600">
                      1日（0:00～23:59）に200ファイル以上を処理した場合、翌日0:00まで制限がかかります。
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-kon/20 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-kon mb-3 flex items-center gap-2">
                    <span>📦</span>
                    <span>ファイルサイズ制限</span>
                  </h3>
                  <div className="ml-8 space-y-2">
                    <p className="font-bold text-gray-900">PDFツール：1ファイル最大50MB</p>
                    <p className="font-bold text-gray-900">画像ツール：1ファイル最大20MB</p>
                    <p className="text-sm text-gray-600 mt-2">
                      これを超えるファイルは、分割してご利用ください。
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-kon mb-4">実際の利用例</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-green-900 mb-2">✅ 制限内の利用例</h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• フリーランス：1日20-30枚の請求書をPDF作成</li>
                    <li>• 経理担当：1日50枚程度の書類をPDF結合・分割</li>
                    <li>• 学生：レポート10本をPDF変換・結合</li>
                    <li>• 営業職：1日30-40枚の提案資料を編集</li>
                  </ul>
                  <p className="text-xs text-green-700 mt-3">
                    → これらは全て制限内です。安心してご利用ください。
                  </p>
                </div>

                <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-bold text-red-900 mb-2">❌ 制限を超える可能性のある利用例</h3>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li>• 1時間以内に100ファイル以上を連続処理</li>
                    <li>• 自動化ツールやボットを使った大量アクセス</li>
                    <li>• 業務システムと連携した24時間自動処理</li>
                    <li>• 他社サービスへの転売目的での大量利用</li>
                  </ul>
                  <p className="text-xs text-red-700 mt-3">
                    → このような利用は制限対象となります。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-kon mb-4">禁止事項</h2>
              
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                    <span><strong>自動化ツール・ボット：</strong>自動化ツール、スクレイピングツール、ボットなどを使用した大量アクセス</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                    <span><strong>不正アクセス：</strong>当社のシステムに対する不正アクセスやハッキング行為</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                    <span><strong>転売・再配布：</strong>本サービスを利用して得た結果物を、営利目的で転売または再配布する行為</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                    <span><strong>サーバー負荷攻撃：</strong>意図的にサーバーに過度な負荷をかける行為（DoS攻撃など）</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-kon mb-4">制限がかかった場合</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">制限時の表示メッセージ</h3>
                  <div className="bg-white p-4 rounded border-l-4 border-kon">
                    <p className="text-sm text-gray-700">
                      「現在、ご利用が集中しているため、しばらくお待ちください。<br />
                      時間制限：1時間後に自動解除されます。<br />
                      日次制限：翌日0:00に自動解除されます。」
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">対処方法</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>通常の制限：</strong>指定された時間（1時間または翌日）まで待つと自動的に解除されます</li>
                    <li>• <strong>緊急の場合：</strong>support@yamada-tools.jpまでご連絡ください（状況により個別対応いたします）</li>
                    <li>• <strong>大量処理が必要な場合：</strong>事前にご相談ください。企業向けプラン（準備中）のご案内が可能です</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-kon mb-4">競合他社との比較</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-kon text-white">
                      <th className="p-3 text-left border border-kon">サービス</th>
                      <th className="p-3 text-left border border-kon">時間制限</th>
                      <th className="p-3 text-left border border-kon">日次制限</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-50">
                      <td className="p-3 border border-gray-300 font-bold">山田ツール</td>
                      <td className="p-3 border border-gray-300">50ファイル/時</td>
                      <td className="p-3 border border-gray-300">200ファイル/日</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-300">Smallpdf</td>
                      <td className="p-3 border border-gray-300 text-red-600">2ファイル/時</td>
                      <td className="p-3 border border-gray-300">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-300">iLovePDF</td>
                      <td className="p-3 border border-gray-300">制限なし</td>
                      <td className="p-3 border border-gray-300">制限あり*</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-2">
                  *詳細な制限は各サービスの利用規約をご確認ください
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-kon/10 to-ai/10 p-6 rounded-xl border border-kon/20">
              <h2 className="text-xl font-bold text-kon mb-3">まとめ</h2>
              <div className="space-y-2 text-sm">
                <p>
                  山田ツールは、<strong>多くの皆様に無料で快適に</strong>ご利用いただくため、適正な利用制限を設けています。
                </p>
                <p>
                  <strong>通常の個人利用・業務利用であれば、制限に達することはほとんどありません。</strong>
                </p>
                <p>
                  サーバーリソースの公平な利用にご協力いただき、引き続き山田ツールをご愛用ください。
                </p>
              </div>
            </section>

            <div className="pt-8 text-sm text-gray-500 text-right">
              <p>最終更新日：2025年12月5日</p>
              <p className="mt-2">合同会社山田トレード</p>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/about/faq"
                className="text-kon hover:underline text-sm"
              >
                よくある質問（FAQ）
              </Link>
              <Link
                href="/legal/terms"
                className="text-kon hover:underline text-sm"
              >
                利用規約
              </Link>
            </div>
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
