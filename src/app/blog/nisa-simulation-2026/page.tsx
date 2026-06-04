import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】新NISAシミュレーション完全ガイド｜初心者でも5分でわかる積立計算";
const description = "新NISAの積立シミュレーションを無料で計算。毎月1万円で20年後にいくら？つみたて投資枠と成長投資枠の違い、2026年税制改正のポイントを初心者向けにわかりやすく解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("【2026年最新】新NISAシミュレーション完全ガイド")}&type=blog&category=${encodeURIComponent("資産運用")}`;

export const metadata: Metadata = {
  title,
  description,
  keywords: ["新NISA", "シミュレーション", "2026", "積立", "つみたて投資枠", "成長投資枠"],
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

export default function NisaSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】新NISAシミュレーション完全ガイド｜初心者でも5分でわかる積立計算",
            "description": "新NISAの積立シミュレーションを無料で計算。毎月1万円で20年後にいくら？つみたて投資枠と成長投資枠の違い、2026年税制改正のポイントを初心者向けにわかりやすく解説。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/nisa-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"新NISAはいつ始めるべき？","acceptedAnswer":{"@type":"Answer","text":"今すぐ始めるのがベストです。複利効果を最大限に活かすには、1日でも早くスタートすることが有利です。"}},{"@type":"Question","name":"毎月いくら積み立てればいい？","acceptedAnswer":{"@type":"Answer","text":"無理のない範囲で、最低でも月1万円を目標に。手取りの10〜15%が理想的です。"}},{"@type":"Question","name":"オルカンとS&P500、どっちがいい？","acceptedAnswer":{"@type":"Answer","text":"どちらも優良な選択肢です。迷ったら、より分散が効いているオルカンがおすすめ。"}},{"@type":"Question","name":"NISA口座はどこで開設すればいい？","acceptedAnswer":{"@type":"Answer","text":"ネット証券がおすすめ。SBI証券、楽天証券、マネックス証券などが人気です。"}},{"@type":"Question","name":"途中で解約できる？","acceptedAnswer":{"@type":"Answer","text":"はい、いつでも売却・引き出し可能です。ただし非課税枠の復活は翌年以降です。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>新NISAシミュレーション2026</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        【2026年最新】新NISAシミュレーション完全ガイド｜初心者でも5分でわかる積立計算と運用戦略
      </h1>
      
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-sakura/30 border-l-4 border-sakura p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 新NISAの「つみたて投資枠」と「成長投資枠」の違い</li>
          <li>✓ 毎月いくら積み立てれば、20年後にいくらになるか</li>
          <li>✓ 2026年の税制改正で変わったポイント</li>
          <li>✓ 初心者におすすめの投資戦略</li>
          <li>✓ 無料シミュレーターで今すぐ試算する方法</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">新NISAとは？2024年からの大改正をおさらい</h2>
        <p className="text-gray-700 mb-4">
          2024年1月から始まった新NISA（少額投資非課税制度）は、投資で得た利益に税金がかからない国の制度です。
          通常、株式や投資信託の利益には約20%の税金がかかりますが、NISA口座で運用すれば<strong className="text-sakura">非課税</strong>になります。
        </p>
        <p className="text-gray-700 mb-4">
          例えば、100万円の利益が出た場合、通常なら約20万円が税金として引かれますが、NISAなら100万円まるまる受け取れます。
          これが20年、30年と続けば、その差は数百万円にもなります。
        </p>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">新NISAの基本スペック</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">項目</th>
              <th className="px-4 py-3 text-left border-b font-semibold">内容</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">年間投資枠</td><td className="px-4 py-3 border-b">最大360万円（つみたて120万円＋成長240万円）</td></tr>
            <tr><td className="px-4 py-3 border-b">生涯投資枠</td><td className="px-4 py-3 border-b">1,800万円（成長投資枠は1,200万円まで）</td></tr>
            <tr><td className="px-4 py-3 border-b">非課税期間</td><td className="px-4 py-3 border-b font-bold text-sakura">無期限</td></tr>
            <tr><td className="px-4 py-3 border-b">対象者</td><td className="px-4 py-3 border-b">18歳以上の日本居住者</td></tr>
            <tr><td className="px-4 py-3 border-b">口座開設</td><td className="px-4 py-3 border-b">1人1口座のみ（金融機関は変更可能）</td></tr>
          </tbody>
        </table>
        <p className="text-gray-700">
          旧制度では一般NISAとつみたてNISAのどちらか一方しか選べませんでしたが、新NISAでは<strong>両方の枠を併用できる</strong>ようになりました。
        </p>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">つみたて投資枠と成長投資枠の違い</h2>
        <p className="text-gray-700 mb-4">
          新NISAには「つみたて投資枠」と「成長投資枠」の2つの枠があります。それぞれの特徴を理解して、自分に合った投資スタイルを選びましょう。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">項目</th>
              <th className="px-4 py-3 text-left border-b font-semibold">つみたて投資枠</th>
              <th className="px-4 py-3 text-left border-b font-semibold">成長投資枠</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">年間投資上限</td><td className="px-4 py-3 border-b">120万円</td><td className="px-4 py-3 border-b">240万円</td></tr>
            <tr><td className="px-4 py-3 border-b">生涯投資上限</td><td className="px-4 py-3 border-b">1,800万円の内数</td><td className="px-4 py-3 border-b">1,200万円まで</td></tr>
            <tr><td className="px-4 py-3 border-b">投資対象</td><td className="px-4 py-3 border-b">金融庁認定の投資信託のみ</td><td className="px-4 py-3 border-b">株式・ETF・投資信託など幅広い</td></tr>
            <tr><td className="px-4 py-3 border-b">購入方法</td><td className="px-4 py-3 border-b">積立のみ</td><td className="px-4 py-3 border-b">積立・一括どちらもOK</td></tr>
            <tr><td className="px-4 py-3 border-b">おすすめの人</td><td className="px-4 py-3 border-b text-kon">投資初心者・コツコツ派</td><td className="px-4 py-3 border-b text-green-600">経験者・まとまった資金がある人</td></tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">どちらを選ぶべき？</h3>
        <p className="text-gray-700 mb-4">
          <strong>投資初心者の方</strong>には、まず「つみたて投資枠」からスタートすることをおすすめします。理由は3つ：
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <ul className="space-y-2 text-gray-700">
            <li><strong>1. 商品が厳選されている</strong> - 金融庁が「長期・積立・分散投資に適している」と認めた商品だけが対象</li>
            <li><strong>2. 少額から始められる</strong> - 月100円からでもOK</li>
            <li><strong>3. タイミングを考えなくていい</strong> - 毎月自動で積み立てるので、相場を気にする必要がない</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【シミュレーション】毎月いくら積み立てると、いくらになる？</h2>
        <p className="text-gray-700 mb-4">
          新NISAで資産形成をする場合、将来いくらになるのかシミュレーションしてみましょう。
        </p>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">ケース1：毎月1万円を20年間積立</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b">想定利回り</th>
              <th className="px-4 py-3 text-left border-b">元本</th>
              <th className="px-4 py-3 text-left border-b">運用益</th>
              <th className="px-4 py-3 text-left border-b">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">3%</td><td className="px-4 py-3 border-b">240万円</td><td className="px-4 py-3 border-b">約88万円</td><td className="px-4 py-3 border-b font-bold">約328万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5%</td><td className="px-4 py-3 border-b">240万円</td><td className="px-4 py-3 border-b">約171万円</td><td className="px-4 py-3 border-b font-bold">約411万円</td></tr>
            <tr><td className="px-4 py-3 border-b">7%</td><td className="px-4 py-3 border-b">240万円</td><td className="px-4 py-3 border-b">約280万円</td><td className="px-4 py-3 border-b font-bold">約520万円</td></tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">ケース2：毎月3万円を20年間積立</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-sakura/30">
            <tr>
              <th className="px-4 py-3 text-left border-b">想定利回り</th>
              <th className="px-4 py-3 text-left border-b">元本</th>
              <th className="px-4 py-3 text-left border-b">運用益</th>
              <th className="px-4 py-3 text-left border-b">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">3%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">約264万円</td><td className="px-4 py-3 border-b font-bold">約984万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">約513万円</td><td className="px-4 py-3 border-b font-bold">約1,233万円</td></tr>
            <tr><td className="px-4 py-3 border-b">7%</td><td className="px-4 py-3 border-b">720万円</td><td className="px-4 py-3 border-b">約840万円</td><td className="px-4 py-3 border-b font-bold">約1,560万円</td></tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">ケース3：毎月5万円を20年間積立</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left border-b">想定利回り</th>
              <th className="px-4 py-3 text-left border-b">元本</th>
              <th className="px-4 py-3 text-left border-b">運用益</th>
              <th className="px-4 py-3 text-left border-b">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">3%</td><td className="px-4 py-3 border-b">1,200万円</td><td className="px-4 py-3 border-b">約440万円</td><td className="px-4 py-3 border-b font-bold">約1,640万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5%</td><td className="px-4 py-3 border-b">1,200万円</td><td className="px-4 py-3 border-b">約855万円</td><td className="px-4 py-3 border-b font-bold">約2,055万円</td></tr>
            <tr><td className="px-4 py-3 border-b">7%</td><td className="px-4 py-3 border-b">1,200万円</td><td className="px-4 py-3 border-b">約1,400万円</td><td className="px-4 py-3 border-b font-bold">約2,600万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 複利の力</p>
          <p className="text-gray-700">
            これらの数字は「複利」で計算しています。複利とは、運用で得た利益も再投資して、さらに利益を生み出す仕組みのこと。
            時間が味方になるので、<strong>早く始めるほど有利</strong>です。
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 今すぐ試算！NISAシミュレーター</p>
          <p className="text-gray-700 mb-4">あなたの条件で将来の資産をシミュレーションしてみませんか？</p>
          <Link href="/finance/nisa-simulator" className="inline-block bg-kon hover:bg-ai text-white font-bold py-3 px-6 rounded-lg transition">
            → 無料NISAシミュレーターを使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2026年の税制改正で何が変わった？</h2>
        <p className="text-gray-700 mb-4">
          2025年12月に閣議決定された2026年度税制改正で、新NISAがさらに使いやすくなりました。
        </p>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              未成年へのNISA拡大
            </h3>
            <p className="text-gray-700">
              これまで18歳以上が対象だったNISAが、未成年者にも拡大されます。
              年間投資額60万円、非課税保有限度額600万円で、子どもの将来のために親が代わりに運用できるようになります。
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              対象商品の拡充
            </h3>
            <p className="text-gray-700">
              債券を投資対象とした投資信託や、地域別の株価指数に連動するファンドが追加される予定です。
              <strong>よりリスクを抑えた運用</strong>が可能になります。
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              非課税枠の年内復活
            </h3>
            <p className="text-gray-700">
              商品を売却した場合、これまでは「翌年以降」に非課税枠が復活していましたが、一部について年内に復活するルールが検討されています。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">新NISAで失敗しないための5つのポイント</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="bg-kon text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">1</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">長期目線で考える</h3>
              <p className="text-gray-700">理想的な投資期間は20年以上。短期売買には向いていません。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-kon text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">2</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">生活費を削ってまで投資しない</h3>
              <p className="text-gray-700">まずは生活費の3〜6ヶ月分の貯金を確保してから始めましょう。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-kon text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">3</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">一度に大金を投入しない</h3>
              <p className="text-gray-700">「ドルコスト平均法」で高値掴みのリスクを軽減しましょう。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-kon text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">4</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">相場の上下に一喜一憂しない</h3>
              <p className="text-gray-700">長期投資では短期的な変動は「ノイズ」。淡々と積み立てを続けましょう。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-kon text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">5</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">年に1回は見直しを</h3>
              <p className="text-gray-700">資産配分や生活状況の変化をチェックしましょう。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 新NISAはいつ始めるべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">
              <strong>今すぐ始めるのがベストです。</strong>複利効果を最大限に活かすには、1日でも早くスタートすることが有利です。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 毎月いくら積み立てればいい？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">
              <strong>無理のない範囲で、最低でも月1万円を目標に。</strong>手取りの10〜15%が理想的です。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. オルカンとS&P500、どっちがいい？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">
              <strong>どちらも優良な選択肢です。</strong>迷ったら、より分散が効いているオルカンがおすすめ。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. NISA口座はどこで開設すればいい？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">
              <strong>ネット証券がおすすめ。</strong>SBI証券、楽天証券、マネックス証券などが人気です。
            </p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 途中で解約できる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">
              <strong>はい、いつでも売却・引き出し可能です。</strong>ただし非課税枠の復活は翌年以降です。
            </p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：新NISAは「やらない理由がない」制度</h2>
        <p className="text-gray-700 mb-4">
          新NISAは、非課税期間が無期限、年間360万円・生涯1,800万円まで投資可能という、これまでにない優遇制度です。
        </p>
        
        <div className="bg-gradient-to-r from-slate-900 to-rose-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">まずはシミュレーションで、自分の目標に合った積立プランを確認してみましょう。</p>
          <Link href="/finance/nisa-simulator" className="inline-block bg-white text-sakura font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 無料NISAシミュレーターで試算する
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/finance/nisa-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sakura transition">
            <span className="font-bold text-gray-800">NISAシミュレーター</span>
            <p className="text-sm text-gray-600">積立金額・期間・利回りから将来の資産を計算</p>
          </Link>
          <Link href="/finance/ideco-nisa-comparison" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sakura transition">
            <span className="font-bold text-gray-800">iDeCo vs NISA 比較ツール</span>
            <p className="text-sm text-gray-600">どちらが自分に合っているか診断</p>
          </Link>
          <Link href="/finance/jutaku-loan" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sakura transition">
            <span className="font-bold text-gray-800">住宅ローンシミュレーター</span>
            <p className="text-sm text-gray-600">住宅購入と資産形成を両立させたい方に</p>
          </Link>
          <Link href="/finance/retirement-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sakura transition">
            <span className="font-bold text-gray-800">老後資金シミュレーター</span>
            <p className="text-sm text-gray-600">何歳まで働けば大丈夫？を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">
        この記事は2026年4月時点の情報に基づいています。最新情報は金融庁公式サイトでご確認ください。
      </p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/nisa-simulation-2026" title="nisa-simulation-2026" />
</article>
  );
}
