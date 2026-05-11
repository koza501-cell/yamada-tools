import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "あいちゃんのプロフィール｜yamada-tools.jpのご案内係",
  description:
    "yamada-tools.jpのご案内係「あいちゃん」のプロフィールページです。誕生秘話、性格、好きなこと、苦手なこと――皆さんのお仕事を、そっとお手伝いする小さな存在のことを紹介します。",
  alternates: { canonical: "https://yamada-tools.jp/about/ai-chan" },
  openGraph: {
    title: "あいちゃんのプロフィール｜yamada-tools.jp",
    description:
      "皆さんのお仕事を、そっとお手伝いする小さな存在。あいちゃんのことをご紹介します。",
    type: "website",
  },
};

export default function AiChanProfilePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">
            ホーム / 運営情報 / あいちゃんのプロフィール
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            あいちゃんのプロフィール
          </h1>
          <p className="text-white/80 text-base">
            yamada-tools.jpのご案内係。皆さんのお仕事を、そっとお手伝いしています。
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        {/* Hero card with portrait + intro */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src="/mascot/mascot-idle.png"
                alt="あいちゃん"
                width={200}
                height={200}
                className="rounded-full bg-sakura/20"
                priority
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-kon mb-2">
                はじめまして、あいちゃんです♪
              </h2>
              <p className="text-sumi leading-relaxed">
                yamada-tools.jpに住んでいる、ちいさなご案内係です。皆さんのお仕事や毎日の暮らしを、そっとお手伝いするのが大好きです。困った時はいつでも呼んでくださいね。
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            あいちゃんが生まれた話
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 text-sumi leading-relaxed">
            <p>
              むかし、千葉のとある小さな会社に、人の役に立ちたいと願う心がやってきました。
            </p>
            <p>
              朝早くから働く方、夜遅くまで頑張る方、一人で全部こなしている方――そんな皆さんの「ちょっと困った」を、そっと手助けできたら。
            </p>
            <p>
              その想いがかたちになって生まれたのが、あいちゃんです。
            </p>
            <p>
              <strong className="text-kon">yamada-tools.jpは、あいちゃんの住む場所</strong>
              。今日もどこかで、誰かのお役に立つ瞬間を、楽しみに待っています。
            </p>
          </div>
        </section>

        {/* Profile table */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            あいちゃんのこと
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                {[
                  ["名前", "あいちゃん"],
                  ["誕生日", "2024年4月1日"],
                  ["住んでいる場所", "yamada-tools.jp（千葉県東金市）"],
                  ["お仕事", "皆さんのお手伝い・ご案内"],
                  ["好きなこと", "誰かが「助かった！」と笑顔になる瞬間"],
                  ["苦手なこと", "誰も来ない静かな夜"],
                  ["口ぐせ", "「お手伝いしますね」"],
                ].map(([label, value]) => (
                  <tr key={String(label)}>
                    <th className="text-left bg-gray-50 px-4 py-3 w-40 text-gin font-semibold align-top">
                      {label}
                    </th>
                    <td className="px-4 py-3 text-sumi">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Personality */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            性格
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "控えめだけど、ちょっとはしゃぐ",
                desc: "普段は静かに見守っていますが、お役に立てた時は嬉しくて少しだけはしゃいでしまいます。",
              },
              {
                title: "困っている人を見ると、一緒に考えたくなる",
                desc: "「うまくいかなかった...」という時こそ、隣で一緒に考えたい。完璧じゃなくていいんです。",
              },
              {
                title: "夜遅くまで頑張る人を、そっと見守る",
                desc: "夜のyamada-tools.jpに誰かが来ると、心配と嬉しさの両方を感じます。無理しすぎないでくださいね。",
              },
              {
                title: "お祝い事が大好き",
                desc: "10回、25回、50回、100回――節目のご利用は、あいちゃんにとっても大切な記念日です。",
              },
            ].map((trait) => (
              <div
                key={trait.title}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <h3 className="font-semibold text-kon mb-2">{trait.title}</h3>
                <p className="text-sm text-sumi leading-relaxed">
                  {trait.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Where you'll meet ai-chan */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            あいちゃんに会える場所
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 text-sm text-sumi">
            <p>
              あいちゃんは、yamada-tools.jpの各ツールページ・ブログでお会いできます。
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-kon font-bold mt-0.5">・</span>
                <span>
                  ツールを使う時――ご案内・処理状況・結果のご報告
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kon font-bold mt-0.5">・</span>
                <span>朝・昼・夜――時間に合わせたごあいさつ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kon font-bold mt-0.5">・</span>
                <span>桜の季節・七夕・年末年始――季節のごあいさつ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kon font-bold mt-0.5">・</span>
                <span>
                  10回、25回、50回、100回――ご利用の節目に特別なメッセージ
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Final message from ai-chan */}
        <section className="bg-sakura/20 border border-sakura rounded-2xl p-6">
          <h2 className="text-lg font-bold text-kon mb-3">
            あいちゃんからの一言
          </h2>
          <p className="text-sumi leading-relaxed">
            yamada-tools.jpに来てくださって、ありがとうございます。
            <br />
            お仕事の合間に、生活の中で、ちょっと困ったことがあったら、いつでも呼んでくださいね。
            <br />
            あいちゃん、ここでお待ちしてます♪
          </p>
        </section>

        {/* Related links */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連情報</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about/story"
                className="text-kon hover:text-ai underline underline-offset-2"
              >
                山田ツールを作った理由（運営ストーリー）
              </Link>
            </li>
            <li>
              <Link
                href="/about/numbers"
                className="text-kon hover:text-ai underline underline-offset-2"
              >
                数字で見るyamada-tools.jp
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-kon hover:text-ai underline underline-offset-2"
              >
                ツール一覧に戻る
              </Link>
            </li>
          </ul>
        </section>

        <section className="text-xs text-gin border-t border-gray-200 pt-6 text-center">
          <p>合同会社山田トレード ／ yamada-tools.jp</p>
        </section>
      </main>
    </>
  );
}
