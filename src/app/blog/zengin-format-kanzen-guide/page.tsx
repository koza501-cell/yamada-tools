import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "全銀フォーマット完全ガイド【2026年最新】経理担当者のための変換・作り方・エラー対処法";
const description =
  "全銀フォーマット（FBデータ）とは何か、CSVからの変換方法、Excelでの作り方、エラー対処法まで経理担当者向けに完全解説。無料ツールで登録不要・ブラウザだけで変換できる方法も紹介。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent(
  "全銀フォーマット完全ガイド"
)}&type=blog&category=${encodeURIComponent("ビジネス")}`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "全銀フォーマット とは",
    "全銀フォーマット 変換 無料",
    "全銀フォーマット 作り方",
    "全銀フォーマット エラー",
    "FBフォーマット 変換",
    "全銀ファイル CSV 変換",
    "給与振込 全銀 作成",
    "全銀フォーマット Excel",
    "全銀フォーマット 経理",
    "全銀フォーマット 半角カナ",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/blog/zengin-format-kanzen-guide",
  },
  openGraph: {
    title,
    description,
    type: "article",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function ZenginFormatKanzenGuideBlog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description,
            datePublished: "2026-05-06",
            dateModified: "2026-05-06",
            author: { "@type": "Organization", name: "山田ツール編集部" },
            publisher: {
              "@type": "Organization",
              name: "合同会社山田トレード",
              logo: { "@type": "ImageObject", url: "https://yamada-tools.jp/logo-icon.webp" },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://yamada-tools.jp/blog/zengin-format-kanzen-guide",
            },
            keywords: "全銀フォーマット,FBフォーマット,全銀ファイル,CSV変換,給与振込,総合振込,経理",
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
              { "@type": "ListItem", position: 2, name: "ブログ", item: "https://yamada-tools.jp/blog" },
              {
                "@type": "ListItem",
                position: 3,
                name: "全銀フォーマット完全ガイド",
                item: "https://yamada-tools.jp/blog/zengin-format-kanzen-guide",
              },
            ],
          }),
        }}
      />
      {/* JSON-LD: HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "CSVから全銀フォーマットを変換する方法",
            description:
              "山田ツールの全銀フォーマット変換ツールを使って、CSVファイルから全銀フォーマット（全銀ファイル）を作成する手順。登録不要・無料でブラウザ上で変換できます。",
            totalTime: "PT5M",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "CSVファイルを準備する",
                text: "振込先の銀行コード・支店コード・口座番号・口座名義（半角カナ）・振込金額を列として含むCSVを用意します。口座番号は7桁になるよう頭にゼロを補完してください。",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "変換ツールにCSVをアップロードする",
                text: "山田ツールの全銀フォーマット変換ページ（yamada-tools.jp/convert/bank-format）を開き、CSVファイルをアップロードします。業務コード（給与振込・総合振込など）を選択してください。",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "変換結果をプレビューして確認する",
                text: "ツールが自動的に全角文字を半角カナに変換し、120桁固定長フォーマットに整形します。変換後のプレビューで内容を確認します。",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "全銀ファイル（.txt）をダウンロードする",
                text: "問題がなければダウンロードボタンを押し、全銀フォーマットのテキストファイルを取得します。",
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "ネットバンキングにアップロードする",
                text: "取引銀行のネットバンキングにログインし、総合振込・給与振込メニューからダウンロードしたファイルをアップロードして一括振込を実行します。",
              },
            ],
          }),
        }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "全銀フォーマットとFBフォーマットは同じですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、同じものです。正式名称は「全銀協規定フォーマット」で、全国銀行協会連合会（全銀協）が定めた銀行間データ交換の標準規格です。「FBフォーマット」「全銀ファイル」「全銀データ」なども同じものを指します。",
                },
              },
              {
                "@type": "Question",
                name: "全銀フォーマットのファイルは何桁ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "1レコード（1行）が120桁（120バイト）の固定長テキスト形式です。ヘッダーレコード・データレコード・トレーラレコード・エンドレコードの4種類で構成されます。",
                },
              },
              {
                "@type": "Question",
                name: "全銀フォーマットで全角文字が使えないのはなぜですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "全銀フォーマットは文字コードにJIS8単位コード（半角カナ・半角英数字）を使用しており、漢字や全角カタカナは使用できません。受取人名（カナ）は必ず半角カナで入力する必要があります。全角文字が含まれているとネットバンキングのアップロード時にエラーになります。",
                },
              },
              {
                "@type": "Question",
                name: "口座番号が7桁未満の場合はどうすればよいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "口座番号は7桁で指定されているため、7桁に満たない場合は先頭にゼロを補完します。例えば「123456」（6桁）なら「0123456」と入力します。山田ツールの変換ツールはこの補完を自動で行います。",
                },
              },
              {
                "@type": "Question",
                name: "全銀フォーマットを無料で作れますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、山田ツールの全銀フォーマット変換ツール（yamada-tools.jp/convert/bank-format）を使えば、完全無料・登録不要でCSVから全銀フォーマットに変換できます。VBAやExcelの知識も不要です。",
                },
              },
              {
                "@type": "Question",
                name: "受取人名は何文字まで入力できますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "受取人名（カナ）は最大30文字（半角）です。30文字を超える場合は省略が必要です。「株式会社」は「（カ）」、「有限会社」は「（ユ）」、「合同会社」は「（ド）」と省略するのが一般的です。",
                },
              },
              {
                "@type": "Question",
                name: "楽天銀行で全銀フォーマットは使えますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、楽天銀行のネットバンキングは全銀フォーマットに対応しており、無料で一括振込データをアップロードできます。住信SBIネット銀行・PayPay銀行・GMOあおぞらネット銀行も同様に無料で対応しています。",
                },
              },
              {
                "@type": "Question",
                name: "文字コードエラーが出た場合の対処法は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "全銀フォーマットのファイルはShift-JIS（またはJIS8）で保存する必要があります。UTF-8で保存するとアップロード時に文字コードエラーが発生します。山田ツールの変換ツールは自動的に正しい文字コードで出力するため、このエラーは発生しません。",
                },
              },
              {
                "@type": "Question",
                name: "freeeや弥生で全銀フォーマットを出力できますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、freee・マネーフォワード・弥生給与などの主要な会計・給与ソフトは全銀フォーマットの出力に対応しています。ただし月額費用がかかります。月数回程度の利用であれば、山田ツールの無料変換ツールの方がコスパよく使えます。",
                },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>全銀フォーマット完全ガイド</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-snug">
        全銀フォーマット完全ガイド【2026年最新】<br className="hidden md:block" />
        経理担当者のための変換・作り方・エラー対処法
      </h1>

      <p className="text-gray-500 text-sm mb-8">公開日: 2026年5月6日　｜　山田ツール編集部</p>

      {/* この記事でわかること */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-8 rounded-r-lg">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 全銀フォーマット（FBフォーマット）の仕組みと4つのレコード構造</li>
          <li>✓ 給与振込・総合振込・口座振替の業務コードと対応銀行</li>
          <li>✓ VBA・プログラミング不要でCSVから無料変換する方法</li>
          <li>✓ 全角文字・桁数・文字コードなどよくあるエラーの対処法</li>
        </ul>
      </div>

      <StaticAdSlot />

      {/* 1. 導入 */}
      <section className="mb-10">
        <p className="text-gray-700 mb-4 leading-relaxed">
          毎月の給与振込や取引先への支払いで「全銀フォーマットでデータを用意してください」と言われた経験はありませんか。初めて耳にしたとき、「なんだか難しそう」「専門的な知識が必要そう」と感じる方も多いはずです。
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          でも実は、仕組みさえ理解してしまえば意外とシンプルです。全銀フォーマットとは何か、どんな場面で使うのか、どうやって作るのか——この記事では経理担当者・総務担当者・中小企業オーナー・フリーランスの方を対象に、一から丁寧に解説します。
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          さらに、ExcelマクロやVBAの知識がなくても<strong>ブラウザ上で無料・登録不要</strong>で全銀フォーマットに変換できるツールも紹介します。毎月の振込作業をぐっとラクにしましょう。
        </p>
      </section>

      {/* 2. 全銀フォーマットとは */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">全銀フォーマットとは？基本知識をわかりやすく解説</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          全銀フォーマットの正式名称は<strong>「全銀協規定フォーマット」</strong>です。全銀協とは全国銀行協会連合会のことで、日本国内の銀行が参加する業界団体です。この団体が「銀行への一括振込データはこの形式で送りなさい」と定めた標準規格が全銀フォーマットです。
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          別名は複数あります。<strong>「FBフォーマット」「全銀ファイル」「全銀データ」</strong>などと呼ばれることもありますが、すべて同じものを指しています。銀行のネットバンキング画面では「総合振込データ」「ファームバンキングデータ」と表記されていることもあります。
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <p className="font-bold text-gray-700 mb-3">全銀フォーマットの基本仕様</p>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><span className="font-semibold text-gray-700">ファイル形式：</span>テキスト形式（.txt）</li>
            <li><span className="font-semibold text-gray-700">レコード長：</span>1レコード = 120桁（120バイト）固定長</li>
            <li><span className="font-semibold text-gray-700">文字コード：</span>JIS8単位コード（半角カナ・半角英数字のみ、全角文字は使用不可）</li>
            <li><span className="font-semibold text-gray-700">改行：</span>CR+LF（Windows形式）</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">4種類のレコード構成</h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          全銀フォーマットのファイルは、以下の4種類のレコード（行）で構成されています。1枚のファイルに振込先が何件あっても、ヘッダーとエンドは必ず1行ずつ、データレコードが振込先の件数分並ぶ構造です。
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="bg-blue-600 text-white rounded px-2 py-1 text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="font-bold text-gray-800">ヘッダーレコード（種別コード：1）</p>
              <p className="text-sm text-gray-600 mt-1">ファイル全体の先頭行。振込元の銀行・支店・口座情報、業務コード（給与振込・総合振込など）、振込指定日などを記録します。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="font-bold text-gray-800">データレコード（種別コード：2）</p>
              <p className="text-sm text-gray-600 mt-1">振込先ごとに1行ずつ作成します。振込先の銀行コード・支店コード・預金種目・口座番号・口座名義・振込金額などを記録します。振込先が20件あれば20行になります。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="bg-yellow-600 text-white rounded px-2 py-1 text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="font-bold text-gray-800">トレーラレコード（種別コード：8）</p>
              <p className="text-sm text-gray-600 mt-1">合計件数と合計金額を記録する行です。銀行側でデータレコードの内容と照合し、送信ミスや改ざんがないかを検証するために使われます。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-600 text-white rounded px-2 py-1 text-xs font-bold flex-shrink-0 mt-0.5">4</div>
            <div>
              <p className="font-bold text-gray-800">エンドレコード（種別コード：9）</p>
              <p className="text-sm text-gray-600 mt-1">ファイルの終端を示す行です。全て「9」で始まり、残りは空白で埋められています。</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">
          この構造を手作業で作るのは大変ですが、<Link href="/convert/bank-format" className="text-blue-600 hover:underline font-semibold">山田ツールの全銀フォーマット変換ツール</Link>を使えば、CSVをアップロードするだけで4種類のレコードを自動生成してくれます。
        </p>
      </section>

      <BlogAdUnit />

      {/* 3. 全銀フォーマットが必要な場面 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">全銀フォーマットが必要な場面と業務コード</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          全銀フォーマットは、銀行のネットバンキングで一括振込を行う際に使います。1件ずつ手入力するのではなく、データファイルをアップロードすることで数十件・数百件の振込を一度に処理できます。
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <p className="font-bold text-gray-700 mb-3">業務コード一覧</p>
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">業務コード</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">用途</th>
                  <th className="text-left py-2 text-gray-600 font-semibold">主な利用者</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono font-bold text-blue-700">11</td>
                  <td className="py-2 pr-4">給与振込</td>
                  <td className="py-2">給与担当者</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono font-bold text-blue-700">12</td>
                  <td className="py-2 pr-4">賞与振込</td>
                  <td className="py-2">給与担当者</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono font-bold text-blue-700">21</td>
                  <td className="py-2 pr-4">総合振込（取引先への支払いなど）</td>
                  <td className="py-2">経理・財務担当者</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-bold text-blue-700">91</td>
                  <td className="py-2 pr-4">口座振替（代金回収）</td>
                  <td className="py-2">サブスク・定期課金事業者</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">
          最もよく使われるのは<strong>給与振込（11）</strong>と<strong>総合振込（21）</strong>です。毎月の給与支払いや、月末の仕入先・外注先への一括支払いに活用されています。住民税特別徴収の代行納付にも対応している銀行があります。
        </p>
      </section>

      {/* 4. 対応銀行と費用 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">対応銀行と費用：無料で使えるネットバンクはどこ？</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          全銀フォーマットへの対応状況は銀行によって異なります。特にネット系銀行は無料で利用できることが多く、中小企業やフリーランスにとってコスト面でのメリットが大きいです。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">無料で使えるネットバンク</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ 楽天銀行（法人口座・個人事業主口座）</li>
              <li>✓ 住信SBIネット銀行</li>
              <li>✓ PayPay銀行（旧ジャパンネット銀行）</li>
              <li>✓ GMOあおぞらネット銀行</li>
              <li>✓ ゆうちょBizダイレクト</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-bold text-orange-800 mb-2">有料・条件付きの大手銀行</p>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>△ みずほ銀行（総合振込サービス：初期55,000円+月額22,000円程度）</li>
              <li>△ 三菱UFJ銀行（法人向けサービスに月額費用あり）</li>
              <li>△ 三井住友銀行（BizSTATION：月額費用あり）</li>
              <li>△ 地方銀行・信用金庫（仕様が微妙に異なる場合あり）</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
          <p className="font-bold text-yellow-800 mb-1">注意：取引銀行の仕様を事前確認してください</p>
          <p className="text-sm text-yellow-700">銀行によってフォーマットの細部が異なる場合があります（特に地方銀行・信用金庫）。アップロード前に取引銀行のマニュアルや担当者に確認することをおすすめします。</p>
        </div>
      </section>

      <BlogAdUnit />

      {/* 5. 全銀フォーマットの作り方 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">全銀フォーマットの作り方：3つの方法を比較</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          全銀フォーマットを作成する方法は主に3つあります。自社の状況や頻度に合わせて選んでください。
        </p>

        {/* 方法1：無料ブラウザツール */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            無料ブラウザツールを使う（最速・推奨）
          </h3>
          <p className="text-gray-700 mb-3 leading-relaxed">
            最もかんたんで即効性のある方法です。山田ツールの<Link href="/convert/bank-format" className="text-blue-600 hover:underline font-semibold">全銀フォーマット変換ツール</Link>は、CSVファイルをアップロードするだけで全銀フォーマットに変換できます。VBAもExcelも、プログラミングの知識も一切不要です。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-bold text-gray-700 mb-2">変換手順（5分でできる）</p>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex gap-2"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>振込先情報を記載したCSVを準備する</li>
              <li className="flex gap-2"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>ツールにCSVをアップロードし、業務コード・振込日を設定する</li>
              <li className="flex gap-2"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>全角カナが自動的に半角カナへ変換されることを確認する</li>
              <li className="flex gap-2"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>変換結果をプレビューして内容を確認する</li>
              <li className="flex gap-2"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">5</span>全銀フォーマット（.txt）をダウンロードしてネットバンキングにアップロードする</li>
            </ol>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Link href="/convert/bank-format" className="inline-flex items-center text-blue-700 font-bold hover:underline">
              → 全銀フォーマット変換ツールを使う（無料・登録不要）
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-sm text-gray-600 mt-1">CSVアップロードで即変換・半角カナ自動変換・インボイス対応</p>
          </div>
        </div>

        {/* 方法2：会計ソフト */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
            会計ソフト・給与ソフトを使う
          </h3>
          <p className="text-gray-700 mb-3 leading-relaxed">
            freee・マネーフォワードクラウド給与・弥生給与などの主要な会計・給与ソフトは、全銀フォーマットの出力に対応しています。給与計算が終わったらそのまま全銀データを出力でき、二重入力の手間が省けます。
          </p>
          <p className="text-gray-700 mb-3 leading-relaxed">
            ただし月額費用がかかります（freeeの場合：スタータープラン月2,980円〜）。すでに導入済みであれば最も効率的な方法ですが、全銀フォーマットの変換のためだけに導入するのはコストが合いません。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p><strong>対応ソフト例：</strong>freee（給与明細・振込データ出力対応）、マネーフォワードクラウド給与、弥生給与、PCA給与、奉行シリーズ</p>
          </div>
        </div>

        {/* 方法3：ExcelのVBA */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
            ExcelのVBAで作る
          </h3>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Excelのマクロ（VBA）を使って全銀フォーマットを生成するスクリプトを自作する方法です。一度作ってしまえば自社の独自フォーマットにも完全対応できますが、初期設定に相応の時間がかかり、プログラミング知識が必要です。
          </p>
          <p className="text-gray-700 mb-3 leading-relaxed">
            検索すると「全銀フォーマット VBA 無料」で作成例がいくつか見つかりますが、銀行の仕様変更があった場合の保守が必要になるのが難点です。月に数回程度の利用なら、<Link href="/convert/bank-format" className="text-blue-600 hover:underline">無料の変換ツール</Link>を使う方がはるかに効率的です。
          </p>
        </div>

        {/* 比較表 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
          <p className="font-bold text-gray-700 mb-3">3つの方法を比較</p>
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 text-gray-600">方法</th>
                <th className="text-left py-2 pr-3 text-gray-600">費用</th>
                <th className="text-left py-2 pr-3 text-gray-600">難易度</th>
                <th className="text-left py-2 text-gray-600">向いている人</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-3 font-semibold text-blue-700">ブラウザツール</td>
                <td className="py-2 pr-3">無料</td>
                <td className="py-2 pr-3">かんたん</td>
                <td className="py-2">月数回程度・今すぐ使いたい</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-3 font-semibold text-green-700">会計ソフト</td>
                <td className="py-2 pr-3">月額費用あり</td>
                <td className="py-2 pr-3">かんたん</td>
                <td className="py-2">すでに導入済み・給与計算と一体管理</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-semibold text-gray-700">ExcelのVBA</td>
                <td className="py-2 pr-3">無料（工数あり）</td>
                <td className="py-2 pr-3">難しい</td>
                <td className="py-2">IT担当者・独自カスタマイズが必要</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <BlogAdUnit />

      {/* 6. よくあるエラーと対処法 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくあるエラーと対処法</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          全銀フォーマットのアップロード時にエラーが出て困った経験がある方は多いはずです。典型的なエラーと対処法をまとめました。
        </p>

        <div className="space-y-5">
          {/* エラー1 */}
          <div className="border border-red-100 rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100">
              <p className="font-bold text-red-800">エラー1：全角文字が含まれているためエラーになる</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>口座名義に漢字・全角カタカナが含まれている</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>全角カナを半角カナに変換してください。山田ツールは自動変換に対応しています。</p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-600">
                <span className="text-red-600">✗ ヤマダ商事株式会社</span>（全角）<br />
                <span className="text-green-600">✓ ﾔﾏﾀﾞｼｮｳｼﾞ（ｶ）</span>（半角カナ）
              </div>
            </div>
          </div>

          {/* エラー2 */}
          <div className="border border-orange-100 rounded-lg overflow-hidden">
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
              <p className="font-bold text-orange-800">エラー2：口座番号の桁数が合わない</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>口座番号が7桁未満で前ゼロ補完が行われていない</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>口座番号の先頭にゼロを追加して7桁にしてください。</p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-600">
                <span className="text-red-600">✗ 123456</span>（6桁）<br />
                <span className="text-green-600">✓ 0123456</span>（7桁・前ゼロ補完済み）
              </div>
            </div>
          </div>

          {/* エラー3 */}
          <div className="border border-yellow-100 rounded-lg overflow-hidden">
            <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100">
              <p className="font-bold text-yellow-800">エラー3：銀行コード・支店コードがわからない</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>振込先の銀行コード（4桁）・支店コード（3桁）が不明</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>全銀協の金融機関コード検索サービスで確認できます。または取引銀行のネットバンキング画面や通帳の記号番号欄から確認してください。</p>
            </div>
          </div>

          {/* エラー4 */}
          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <p className="font-bold text-blue-800">エラー4：文字コードエラーが発生する</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>ファイルの文字コードがShift-JIS以外（UTF-8等）で保存されている</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>テキストエディタ（メモ帳・VSCode等）で文字コードをShift-JISに変換して保存してください。山田ツールの変換ツールは自動的に正しい文字コードで出力するため、このエラーは発生しません。</p>
            </div>
          </div>

          {/* エラー5 */}
          <div className="border border-purple-100 rounded-lg overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
              <p className="font-bold text-purple-800">エラー5：受取人名が長すぎてエラーになる</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>受取人名（カナ）が30文字（半角）を超えている</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>30文字以内に収まるよう省略します。</p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-600">
                株式会社 → （ｶ）<br />
                有限会社 → （ﾕ）<br />
                合同会社 → （ﾄﾞ）<br />
                医療法人 → （ｲ）
              </div>
            </div>
          </div>

          {/* エラー6 */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <p className="font-bold text-gray-800">エラー6：合計金額・件数が合わない</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2"><strong>原因：</strong>トレーラレコードの合計件数・合計金額がデータレコードの内容と一致していない</p>
              <p className="text-sm text-gray-600 mb-2"><strong>対処：</strong>手動でフォーマットを作成した場合に発生しやすいエラーです。ツールを使って自動生成すれば、この計算は自動で行われます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 山田ツールの使い方詳細 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">山田ツールの全銀フォーマット変換ツール：機能詳細</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          <Link href="/convert/bank-format" className="text-blue-600 hover:underline font-semibold">山田ツールの全銀フォーマット変換ツール</Link>は、専門知識なしでも即日使い始めることができます。主な機能を紹介します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">完全無料・登録不要</p>
            <p className="text-sm text-gray-600">アカウント作成やクレジットカード登録は一切不要。ページを開いてすぐに使えます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">半角カナ自動変換</p>
            <p className="text-sm text-gray-600">全角カタカナや漢字を含むCSVでも、口座名義を自動的に半角カナに変換します。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">給与・賞与・総合振込に対応</p>
            <p className="text-sm text-gray-600">業務コード11（給与）・12（賞与）・21（総合振込）を選択できます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">変換後プレビュー確認</p>
            <p className="text-sm text-gray-600">ダウンロード前に変換結果をブラウザ上で確認できます。ミスを事前に防げます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">インボイス番号対応</p>
            <p className="text-sm text-gray-600">2023年10月施行のインボイス制度に対応した出力が可能です。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">安全なブラウザ処理</p>
            <p className="text-gray-600 text-sm">データはサーバーに保存されません。経理データを社外サーバーに上げることなく変換できます。</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 text-center">
          <p className="text-lg font-bold mb-2">全銀フォーマット変換ツールを今すぐ使う</p>
          <p className="text-blue-100 text-sm mb-4">無料・登録不要・CSVをアップロードするだけ</p>
          <Link
            href="/convert/bank-format"
            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
          >
            → 全銀フォーマット変換ツールへ
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      {/* 8. CSVの準備方法 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">CSVの準備方法：必要な列と入力ルール</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          変換ツールにアップロードするCSVには、以下の列が必要です。Excelで作成して.csv形式で保存してください。
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 overflow-x-auto">
          <p className="font-bold text-gray-700 mb-3">必要な列一覧</p>
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">項目名</th>
                <th className="text-left py-2 pr-4 text-gray-600 font-semibold">桁数</th>
                <th className="text-left py-2 text-gray-600 font-semibold">備考</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-semibold">振込先銀行コード</td>
                <td className="py-2 pr-4">4桁</td>
                <td className="py-2">例：0001（みずほ銀行）</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-semibold">振込先支店コード</td>
                <td className="py-2 pr-4">3桁</td>
                <td className="py-2">例：001（新宿支店）</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-semibold">預金種目</td>
                <td className="py-2 pr-4">1桁</td>
                <td className="py-2">1＝普通、2＝当座、4＝貯蓄</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-semibold">口座番号</td>
                <td className="py-2 pr-4">7桁</td>
                <td className="py-2">7桁になるよう前ゼロ補完</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-semibold">受取人名（カナ）</td>
                <td className="py-2 pr-4">最大30文字</td>
                <td className="py-2">半角カナ。ツールが自動変換対応</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">振込金額</td>
                <td className="py-2 pr-4">最大10桁</td>
                <td className="py-2">円単位の整数。カンマ不要</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-bold text-blue-800 mb-2">サンプルCSVのイメージ</p>
          <div className="text-xs font-mono bg-white border border-blue-100 rounded p-3 overflow-x-auto text-gray-600">
            銀行コード,支店コード,預金種目,口座番号,受取人名,振込金額<br />
            0036,120,1,0123456,ヤマダ タロウ,250000<br />
            0009,001,1,0234567,サトウ ハナコ,200000<br />
            0033,150,2,0345678,（ｶ）ｻﾝﾌﾟﾙ,500000
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 全銀フォーマットとFBフォーマットは同じですか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              はい、同じものです。全国銀行協会連合会（全銀協）が定めた標準規格で、「FBフォーマット」「全銀ファイル」「全銀データ」などとも呼ばれます。銀行のネットバンキング画面では「総合振込データ」「ファームバンキングデータ」と表記されることもあります。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 全角文字が含まれているとなぜエラーになりますか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              全銀フォーマットはJIS8単位コード（半角カナ・半角英数字）のみを使用する規格のため、漢字や全角カタカナは使用できません。受取人名はすべて半角カナで入力する必要があります。山田ツールは全角→半角カナへの自動変換に対応しています。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 楽天銀行・住信SBIネット銀行でも全銀フォーマットが使えますか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              はい、楽天銀行・住信SBIネット銀行・PayPay銀行・GMOあおぞらネット銀行は全銀フォーマットでの一括振込に対応しており、無料でご利用いただけます。ゆうちょBizダイレクトも対応しています。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 口座番号が6桁の場合はどうすればよいですか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              口座番号は7桁で指定されているため、7桁未満の場合は先頭にゼロを補完します。「123456」（6桁）なら「0123456」と入力します。山田ツールの変換ツールはこの補完を自動で行います。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 会社名が30文字を超える場合はどうすればよいですか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              受取人名は最大30文字（半角）の制限があります。「株式会社」→「（ｶ）」、「有限会社」→「（ﾕ）」、「合同会社」→「（ﾄﾞ）」などと省略して30文字以内に収めてください。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. freeeや弥生で全銀フォーマットを出力できますか？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              はい、freee・マネーフォワードクラウド・弥生給与などの主要な会計・給与ソフトは全銀フォーマットの出力に対応しています。ただし月額費用がかかります。月数回程度の利用であれば、山田ツールの<Link href="/convert/bank-format" className="text-blue-600 hover:underline">無料変換ツール</Link>の方がコスパよく使えます。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 文字コードエラーが出た場合の対処法は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              全銀フォーマットのファイルはShift-JISで保存する必要があります。UTF-8で保存するとアップロード時にエラーになります。山田ツールの変換ツールは正しい文字コードで自動出力するため、このエラーは発生しません。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 業務コードの選び方がわかりません</summary>
            <p className="mt-3 text-gray-700 border-t pt-3 leading-relaxed">
              給与の支払いには11（給与振込）、ボーナスには12（賞与振込）、取引先への代金支払いには21（総合振込）を使います。口座振替（代金の回収）は91です。取引銀行で対応している業務コードが異なる場合があるため、事前に確認してください。
            </p>
          </details>
        </div>
      </section>

      <BlogAdUnit />

      {/* 9. まとめ */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：全銀フォーマットは難しくない</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          全銀フォーマットとは、全国銀行協会連合会が定めた銀行一括振込の標準規格です。テキスト形式・120桁固定長・4種類のレコード構成——仕組みがわかれば、経理担当者でも問題なく扱えます。
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          かつてはVBAを書いたり、高額な会計ソフトを導入したりしなければ作れませんでしたが、今は無料のブラウザツールで誰でも即日使い始めることができます。
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          月に数回程度の振込作業であれば、<Link href="/convert/bank-format" className="text-blue-600 hover:underline font-semibold">山田ツールの全銀フォーマット変換ツール</Link>が最もコスパよく使えます。登録不要・完全無料で、CSVをアップロードするだけで変換できます。ぜひ次回の給与振込・取引先への支払いにお役立てください。
        </p>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 text-center">
          <p className="text-lg font-bold mb-2">全銀フォーマット変換ツールを無料で使う</p>
          <p className="text-blue-100 text-sm mb-4">登録不要・CSVアップロードで即変換・半角カナ自動変換対応</p>
          <Link
            href="/convert/bank-format"
            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
          >
            → 全銀フォーマット変換ツールへ
          </Link>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/zengin-format-kanzen-guide" title="全銀フォーマット完全ガイド【2026年最新】" />

      <p className="text-xs text-gray-400 mt-8 leading-relaxed border-t pt-4">
        この記事は2026年5月時点の情報に基づいています。全銀フォーマットの仕様や各銀行のサービス内容は変更される場合があります。実際の振込作業の前に、取引銀行のマニュアルや担当者にご確認ください。
      </p>
    </article>
  );
}
