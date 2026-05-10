import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'セキュリティとデータの取り扱い｜yamada-tools.jp',
  description:
    'yamada-tools.jpのセキュリティとデータ保護への取り組みを公開しています。入力データの60分自動削除、HTTPS暗号化、サーバー所在地、外部送信ポリシーなど。',
  alternates: { canonical: 'https://yamada-tools.jp/security' },
  openGraph: {
    title: 'セキュリティとデータの取り扱い｜yamada-tools.jp',
    description:
      '入力データは60分後に自動削除。個人情報を保存しない設計。HTTPS暗号化通信。',
    type: 'website',
  },
};

export default function SecurityPage() {
  return (
    <>
      <section className='bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10'>
        <div className='max-w-3xl mx-auto px-4'>
          <p className='text-sm text-white/70 mb-2'>
            ホーム / 運営情報 / セキュリティとデータの取り扱い
          </p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
            セキュリティとデータの取り扱い
          </h1>
          <p className='text-white/80 text-base'>
            yamada-tools.jpがどのようにデータを扱い、どのようにセキュリティを確保しているかを公開しています。
          </p>
        </div>
      </section>

      <main className='max-w-3xl mx-auto px-4 py-10 space-y-12'>
        {/* 基本方針 */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
            基本方針
          </h2>
          <p className='text-sumi leading-relaxed'>
            yamada-tools.jpは、利用者が安心して使えるツールを提供することを最優先しています。
            個人情報やビジネス上の機密情報を扱うことなく、必要最小限の処理のみを行う設計を徹底しています。
            登録不要・ログイン不要で、すべてのツールがそのままご利用いただけます。
          </p>
        </section>

        {/* 入力データの取り扱い */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-6'>
            入力データの取り扱い
          </h2>

          <div className='space-y-4'>
            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>60分後に自動削除</h3>
              <p className='text-sm text-sumi leading-relaxed'>
                ファイル変換やPDF処理など、サーバー側で一時的に保管が必要なデータは、処理完了から60分以内にすべて自動削除されます。手動で削除を依頼いただく必要はありません。
              </p>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>
                ブラウザ内で完結する処理
              </h3>
              <p className='text-sm text-sumi leading-relaxed'>
                計算機・シミュレーターなどの多くのツールは、すべての処理をご利用者のブラウザ内で完結させています。入力された数値や金額がサーバーに送信されることはありません。
              </p>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>個人情報の非保存</h3>
              <p className='text-sm text-sumi leading-relaxed'>
                氏名・住所・電話番号・メールアドレスなどの個人を特定する情報は、ツール利用時に一切収集していません。お問い合わせ時にいただく情報のみ別途プライバシーポリシーに基づき管理しています。
              </p>
            </div>
          </div>
        </section>

        {/* 通信とインフラ */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-6'>
            通信とインフラ
          </h2>

          <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
            <table className='w-full text-sm'>
              <tbody className='divide-y divide-gray-200'>
                {[
                  ['通信暗号化', 'すべてのページでHTTPS（TLS）暗号化通信を使用'],
                  [
                    'CDN・WAF',
                    'Cloudflareによる配信およびWebアプリケーションファイアウォール保護',
                  ],
                  ['サーバー所在地', '日本国内および同等の保護水準を持つ拠点'],
                  ['アクセスログ', '不正アクセス監視のため最小限の範囲で保管'],
                  ['バックアップ', '運営継続のため定期的に取得・暗号化保管'],
                ].map(([label, value]) => (
                  <tr key={String(label)}>
                    <th className='text-left bg-gray-50 px-4 py-3 w-40 text-gin font-semibold align-top'>
                      {label}
                    </th>
                    <td className='px-4 py-3 text-sumi'>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 外部送信ポリシー */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
            外部送信について
          </h2>
          <p className='text-sumi leading-relaxed mb-4'>
            電気通信事業法の改正（外部送信規律）に基づき、当サイトが外部に送信している情報を公開しています。
          </p>

          <ul className='space-y-3'>
            {[
              {
                name: 'Google Analytics 4',
                purpose: 'サイトの利用状況の把握・改善',
                data: 'IPアドレス（匿名化）、ブラウザ情報、閲覧ページ',
              },
              {
                name: 'Google AdSense',
                purpose: '広告の配信',
                data: 'Cookie、広告閲覧履歴',
              },
              {
                name: 'Cloudflare',
                purpose: 'コンテンツ配信・セキュリティ保護',
                data: 'IPアドレス、リクエスト情報',
              },
            ].map((svc) => (
              <li
                key={svc.name}
                className='bg-white border border-gray-200 rounded-lg p-4'
              >
                <div className='font-semibold text-kon'>{svc.name}</div>
                <div className='text-sm text-sumi mt-2'>
                  <span className='text-gin'>目的：</span>
                  {svc.purpose}
                </div>
                <div className='text-sm text-sumi mt-1'>
                  <span className='text-gin'>送信情報：</span>
                  {svc.data}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 政府公的データの利用 */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
            公的データの利用について
          </h2>
          <p className='text-sumi leading-relaxed mb-4'>
            yamada-tools.jpの法人検索・不動産・補助金などのツールは、すべて公的機関が公開している正規のAPIを使用しています。利用者ご自身がデータを送信していただく必要はなく、ご入力いただいた検索条件のみを利用しています。
          </p>
          <p className='text-sumi leading-relaxed'>
            データの出典については、
            <Link
              href='/about/numbers'
              className='text-kon hover:text-ai underline underline-offset-2'
            >
              数字で見るyamada-tools.jp
            </Link>
            のページで公開しています。
          </p>
        </section>

        {/* インシデント対応 */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
            セキュリティインシデント対応
          </h2>
          <p className='text-sumi leading-relaxed'>
            セキュリティ上の問題を発見された場合は、
            <a
              href='mailto:support@yamadatrade.jp'
              className='text-kon hover:text-ai underline underline-offset-2 mx-1'
            >
              support@yamadatrade.jp
            </a>
            までご連絡ください。発見いただいた問題については、責任を持って速やかに対応いたします。
          </p>
        </section>

        {/* 関連リンク */}
        <section className='bg-gray-50 border border-gray-200 rounded-xl p-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-4'>関連情報</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='/privacy'
                className='text-kon hover:text-ai underline underline-offset-2'
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href='/about/numbers'
                className='text-kon hover:text-ai underline underline-offset-2'
              >
                数字で見るyamada-tools.jp（運営情報・データ出典）
              </Link>
            </li>
            <li>
              <Link
                href='/terms'
                className='text-kon hover:text-ai underline underline-offset-2'
              >
                利用規約
              </Link>
            </li>
          </ul>
        </section>

        <section className='text-xs text-gin border-t border-gray-200 pt-6'>
          <p>最終更新: 2026年5月</p>
        </section>
      </main>
    </>
  );
}
