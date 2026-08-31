import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'yamada-tools.jpができるまで｜運営ストーリー',
  description:
    '日本の中小企業・個人事業主の方が、安心して使える業務ツールを。yamada-tools.jpの運営方針と、これまでの歩みについてご紹介します。',
  alternates: { canonical: 'https://yamada-tools.jp/about/story' },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: 'yamada-tools.jpができるまで｜運営ストーリー',
    description:
      '国内サーバー運営・公的データ活用・1人会社からでも使える価格帯。yamada-tools.jpが大切にしていること。',
    type: 'website',
  },
};

export default function StoryPage() {
  return (
    <>
      <section className='bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10'>
        <div className='max-w-3xl mx-auto px-4'>
          <p className='text-sm text-white/70 mb-2'>
            ホーム / 運営情報 / yamada-tools.jpができるまで
          </p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
            yamada-tools.jpができるまで
          </h1>
          <p className='text-white/80 text-base'>
            日本の中小企業・個人事業主の方が、安心して使える業務ツールを目指して。
          </p>
        </div>
      </section>

      <main className='max-w-3xl mx-auto px-4 py-10 space-y-12'>
        {/* なぜ作ったか */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>
            なぜyamada-tools.jpを作ったのか
          </h2>
          <div className='space-y-4 text-sumi leading-relaxed'>
            <p>
              日本国内でビジネス向けのオンラインツールを使う際、多くの方が共通して感じている不安があります。
              「入力したデータは、どこに保存されるのか」「海外のサーバーに送られて、どのように利用されるのか」――
              特に、お客様の情報や経営に関わる数字を扱う場面では、見過ごせない疑問です。
            </p>
            <p>
              yamada-tools.jpは、こうした不安を取り除くために作りました。
              <strong className='text-kon'>運営会社は日本国内の合同会社</strong>
              であり、サーバーも日本国内に設置しています。
              ツールで扱うデータは原則ブラウザ内で処理され、サーバー側に送られた一時データも
              <strong className='text-kon'>60分後に自動削除</strong>
              される設計です。
            </p>
          </div>
        </section>

        {/* もう一つの動機 */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>
            1人の会社でも、迷わず使える価格帯で
          </h2>
          <div className='space-y-4 text-sumi leading-relaxed'>
            <p>
              業務効率化のSaaSは、月額数千円から数万円というものが少なくありません。
              年間で見れば決して小さくない金額です。
              「機能は便利そうだが、月数回しか使わないツールに毎月お金を払い続けるのは難しい」――
              小さな会社・個人事業主・フリーランスの方からよく聞く声です。
            </p>
            <p>
              そこでyamada-tools.jpは、
              <strong className='text-kon'>基本機能はすべて無料</strong>
              で公開し、毎日の業務でそのまま使えるかたちにしています。
              さらに利用回数の多い方や法人のお客様向けに、
              <strong className='text-kon'>1人会社からでも導入できる価格帯</strong>
              のサブスクリプションをご用意しています。
              これにより、サービスの質を維持しながら、必要な方に必要な分だけご利用いただけます。
            </p>
          </div>
        </section>

        {/* 大切にしていること */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-6'>
            大切にしていること
          </h2>

          <div className='space-y-4'>
            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>
                公的データを正しく活用する
              </h3>
              <p className='text-sm text-sumi leading-relaxed'>
                法人検索・補助金検索・不動産情報などのツールは、すべて経済産業省・国土交通省・国税庁などの公的APIを直接利用しています。
                独自に集めた不確かな情報ではなく、信頼できる出典のあるデータのみを扱っています。
              </p>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>
                日本のユーザーのために最適化する
              </h3>
              <p className='text-sm text-sumi leading-relaxed'>
                日本の法律・制度・業界慣習に合わせた設計を徹底しています。
                住宅宿泊事業法、貨物自動車運送事業の標準的運賃、年収の壁、社会保険料など、最新の制度に準拠した計算結果を提供します。
              </p>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl p-5'>
              <h3 className='font-semibold text-kon mb-2'>
                派手さよりも、毎日の業務で本当に役立つこと
              </h3>
              <p className='text-sm text-sumi leading-relaxed'>
                話題性のある機能を追加するのではなく、実際の業務で繰り返し使うツールを丁寧に作ることを優先しています。
                請求書作成、PDF処理、計算機など、地味でも欠かせない機能の品質に時間をかけています。
              </p>
            </div>
          </div>
        </section>

        {/* 運営者の背景 */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>
            運営者の背景
          </h2>
          <div className='space-y-4 text-sumi leading-relaxed'>
            <p>
              yamada-tools.jpを運営する合同会社山田トレードの代表は、
              <strong className='text-kon'>1994年から学生時代にコンピュータと出会い</strong>、以来30年にわたり独学と実務を通じてIT分野の技術変化を見続けてきました。
              代表自身が日本に長く居住し、日本のビジネス慣習・法制度・利用者の感覚を理解した上で、サービス設計を行っています。
            </p>
            <p>
              「日本の現場で本当に必要とされているもの」を、技術と運営の両面で形にすることが、当社の役割だと考えています。
            </p>
          </div>
        </section>

        {/* これから */}
        <section>
          <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>
            これからの目標
          </h2>
          <div className='space-y-4 text-sumi leading-relaxed'>
            <p>
              yamada-tools.jpは、
              <strong className='text-kon'>
                日本でもっとも信頼される業務ツールサイトの一つ
              </strong>
              になることを目指しています。
            </p>
            <p>
              そのために、(1) 公的データに基づく信頼性の高い情報提供、(2)
              利用者の不安を取り除く運営体制、(3)
              小さな会社からでも導入できる適正な価格、この3点を継続的に強化していきます。
            </p>
            <p className='text-sm text-gin'>
              運営はGoogle AdSenseおよびサブスクリプションのご利用料で支えられています。広告のない快適な利用環境をご希望の方は、有料プランもご検討いただけます。
            </p>
          </div>
        </section>

        {/* 関連リンク */}
        <section className='bg-gray-50 border border-gray-200 rounded-xl p-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-4'>関連情報</h2>
          <ul className='space-y-2 text-sm'>
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
                href='/security'
                className='text-kon hover:text-ai underline underline-offset-2'
              >
                セキュリティとデータの取り扱い
              </Link>
            </li>
            <li>
              <Link
                href='/privacy'
                className='text-kon hover:text-ai underline underline-offset-2'
              >
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </section>

        <section className='text-xs text-gin border-t border-gray-200 pt-6'>
          <p>合同会社山田トレード ／ 千葉県東金市 ／ 2024年設立</p>
        </section>
      </main>
    </>
  );
}
