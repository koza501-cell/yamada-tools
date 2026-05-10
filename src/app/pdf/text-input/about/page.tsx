import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDFに文字入力ツールについて｜山田ツール（yamada-tools.jp）",
  description: "山田ツールのPDF文字入力ツールの詳細情報。技術仕様、機能一覧、対応ブラウザ、開発元情報など。合同会社山田トレードが運営する完全無料のWebアプリです。",
  alternates: { canonical: "https://yamada-tools.jp/pdf/text-input/about" },
  robots: { index: true, follow: true },
};

export default function AboutPdfTextPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "合同会社山田トレード",
    url: "https://yamada-tools.jp",
    sameAs: ["https://twitter.com/PLACEHOLDER", "https://www.youtube.com/@PLACEHOLDER"],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: "PDFに文字入力",
    url: "https://yamada-tools.jp/pdf/text-input",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "PDF Tools",
    operatingSystem: "Web Browser",
    browserRequirements: "Chrome 90+, Firefox 88+, Safari 14+, Edge 90+",
    inLanguage: "ja",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    featureList: ["ゼロサーバーアップロード（ブラウザ内処理）","電子ハンコ自動生成","令和・西暦日付自動入力","複数ページPDF対応","50ステップ元に戻す","フォント4種・サイズ8pt〜48pt・色6種","テキスト・ハンコのドラッグ移動","コピー＆ペースト","ズーム機能","ミニマップ（5ページ以上）"],
    creator: { "@type": "Organization", name: "合同会社山田トレード", url: "https://yamada-tools.jp" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="mb-8 text-sm text-gray-500">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-ai">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/pdf" className="hover:text-ai">PDFツール</Link></li>
            <li>/</li>
            <li><Link href="/pdf/text-input" className="hover:text-ai">PDFに文字入力</Link></li>
            <li>/</li>
            <li className="text-kon">ツールについて</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">PDFに文字入力ツールについて</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">ツール定義</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">「PDFに文字入力」（英語名：PDF Text Input）は、合同会社山田トレードが運営するWebサービス「山田ツール」（yamada-tools.jp）において提供される、PDF文書への文字・電子印鑑・日付の追加を行うWebアプリケーションです。URLは <code>https://yamada-tools.jp/pdf/text-input</code> です。カテゴリはPDFツール、アプリ種別はWebアプリケーション（ブラウザアプリ）に分類されます。</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">技術的な動作原理</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">本ツールは、Mozilla Foundationが開発したオープンソースのPDF処理ライブラリ「PDF.js」を使用してPDFファイルの読み込み・描画を行います。テキスト・ハンコ等の要素描画にはHTML5 Canvasを使用し、最終的なPDFの生成にはオープンソースライブラリ「pdf-lib」を使用します。これらの処理はすべてクライアントサイド（ユーザーのブラウザ上）で完結し、PDFファイルのデータは外部サーバーに一切送信されません。</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">機能一覧</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>任意のPDFページへのテキスト追加（フォント4種・サイズ8〜48pt・色6種・太字）</li>
              <li>電子ハンコ（認印・角印）の自動生成と配置（サイズ5段階）</li>
              <li>令和・西暦形式の今日の日付自動入力</li>
              <li>テキスト・ハンコのドラッグによる位置調整</li>
              <li>複数ページPDFの各ページへの要素追加</li>
              <li>50ステップの元に戻す（Ctrl+Z）・やり直す（Ctrl+Y）</li>
              <li>コピー（Ctrl+C）・貼り付け（Ctrl+V）・複製（Ctrl+D）</li>
              <li>ズームイン・ズームアウト（Ctrl+スクロール対応）</li>
              <li>ミニマップ（5ページ以上のPDFで利用可能）</li>
              <li>パスワード付きPDFへの対応</li>
              <li>HiDPI/Retinaディスプレイ対応の高品質レンダリング</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">対応ブラウザ</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Google Chrome 90以降（推奨）</li>
              <li>Microsoft Edge 90以降（推奨）</li>
              <li>Mozilla Firefox 88以降</li>
              <li>Apple Safari 14以降</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">JavaScriptが有効であることが必要です。モバイルブラウザでも動作しますが、デスクトップ環境での利用を推奨します。</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">利用シーン</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">主な利用シーンは、役所・行政機関への各種申請書類への記入、企業間の契約書・見積書・発注書への記入と押印、就職・転職活動における履歴書・職務経歴書の作成、学校や教育機関からの書類への記入、不動産関連書類（賃貸契約書等）への記入などです。</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">開発元・運営者情報</h2>
            <dl className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">法人名</dt><dd>合同会社山田トレード</dd></div>
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">サービス名</dt><dd>山田ツール（Yamada Tools）</dd></div>
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">URL</dt><dd><a href="https://yamada-tools.jp" className="text-kon hover:underline">https://yamada-tools.jp</a></dd></div>
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">ツールURL</dt><dd><a href="https://yamada-tools.jp/pdf/text-input" className="text-kon hover:underline">https://yamada-tools.jp/pdf/text-input</a></dd></div>
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">カテゴリ</dt><dd>Webアプリケーション / PDFツール</dd></div>
              <div className="flex gap-4"><dt className="font-medium w-32 flex-shrink-0">料金</dt><dd>無料（完全無料・ユーザー登録不要）</dd></div>
            </dl>
          </section>
          <div className="mt-10 text-center">
            <Link href="/pdf/text-input" className="inline-block bg-kon hover:bg-ai text-white font-bold px-8 py-3 rounded-xl transition-colors">
              ← ツールに戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
