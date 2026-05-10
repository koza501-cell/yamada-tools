import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "開発者ストーリー | 山田ツールを作った理由",
  description: "なぜ山田ツールを作ったのか。日本の中小企業やフリーランスの方々を支援するために、安全で使いやすい無料ツールを提供しています。",
  alternates: {
    canonical: 'https://yamada-tools.jp/about/story',
  },
};

export default function StoryPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4">
        
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">山田ツールを作った理由</h1>
          <p className="text-gray-600">〜 日本の中小企業とフリーランスを応援したい 〜</p>
        </header>

        <article className="space-y-8">
          
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>👋</span> はじめまして
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              山田ツールをご利用いただき、ありがとうございます。
            </p>
            <p className="text-gray-700 leading-relaxed">
              私たちは千葉県東金市に拠点を置く<strong>合同会社山田トレード</strong>です。
              2024年に設立し、日本国内の中小企業やフリーランスの方々が日々の業務で直面する
              「ちょっとした不便」を解決するためのツールを開発しています。
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>💭</span> きっかけ
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              「PDFを圧縮したいだけなのに、なぜ海外のサイトにファイルをアップロードしなければならないのか？」
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              「請求書を作るだけなのに、なぜ月額料金を払わなければならないのか？」
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              「会社の機密データを、どこにあるか分からないサーバーに送るのは不安...」
            </p>
            <p className="text-gray-700 leading-relaxed">
              こうした声を、私たち自身も感じていました。日本語で、安心して使える、シンプルなツールがあればいいのに。
              それが山田ツールを作ったきっかけです。
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>🛡️</span> 私たちのこだわり
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">🇯🇵</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">日本国内サーバー完結</h3>
                  <p className="text-gray-600 text-sm">アップロードされたファイルは日本国内のサーバーでのみ処理されます。海外にデータを送信することは一切ありません。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">🗑️</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">60分で自動削除</h3>
                  <p className="text-gray-600 text-sm">処理されたファイルは60分後に自動削除されます。私たちもお客様のデータを保持しません。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">🆓</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">完全無料・登録不要</h3>
                  <p className="text-gray-600 text-sm">すべてのツールは無料でご利用いただけます。メールアドレスの登録も不要です。</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
              <span>🎯</span> こんな方のために
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-kon mt-1">✓</span><span>経理や事務作業を一人でこなしている<strong>中小企業の経営者</strong>の方</span></li>
              <li className="flex items-start gap-2"><span className="text-kon mt-1">✓</span><span>請求書や見積書を手軽に作りたい<strong>フリーランス</strong>の方</span></li>
              <li className="flex items-start gap-2"><span className="text-kon mt-1">✓</span><span>PDFの編集や変換が必要な<strong>オフィスワーカー</strong>の方</span></li>
              <li className="flex items-start gap-2"><span className="text-kon mt-1">✓</span><span>日本で生活・仕事をしている<strong>外国人</strong>の方</span></li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-kon to-ai rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🚀</span> これからの目標
            </h2>
            <p className="leading-relaxed mb-4 opacity-95">
              現在71種類のツールを提供していますが、これで終わりではありません。
              皆様からのフィードバックをもとに、本当に必要とされているツールを追加していきます。
            </p>
            <p className="leading-relaxed opacity-95">
              「こんなツールがあったらいいな」というご要望があれば、ぜひお聞かせください。
              日本の働く人々の「小さな不便」を、一つずつ解決していくことが私たちの使命です。
            </p>
          </section>

          <section className="text-center">
            <p className="text-gray-600 mb-6">山田ツールをご利用いただき、本当にありがとうございます。</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors">ツールを使ってみる</Link>
              <Link href="/about/company" className="px-6 py-3 border-2 border-kon text-kon rounded-xl font-bold hover:bg-kon/5 transition-colors">会社概要</Link>
            </div>
          </section>

        </article>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>合同会社山田トレード</p>
          <p>千葉県東金市台方937-13</p>
        </footer>

      </div>
    </div>
  );
}
