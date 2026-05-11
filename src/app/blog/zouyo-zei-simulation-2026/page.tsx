import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】贈与税はいくら？親からの援助・生前贈与の税金シミュレーション";
const description = "贈与税の計算方法と税率を徹底解説。110万円の基礎控除、住宅取得資金の非課税特例、相続時精算課税制度の活用法。親からの援助で損しない方法を紹介。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("贈与税はいくら？")}&type=blog&category=${encodeURIComponent("税金・贈与")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["贈与税", "シミュレーション", "計算", "生前贈与", "110万円", "非課税"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ZouyoZeiSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】贈与税はいくら？親からの援助・生前贈与の税金シミュレーション",
            "description": "贈与税の計算方法と税率を徹底解説。110万円の基礎控除、住宅取得資金の非課税特例、相続時精算課税制度の活用法。親からの援助で損しない方法を紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/zouyo-zei-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"親から毎年110万円もらっても税金はかからない？","acceptedAnswer":{"@type":"Answer","text":"はい、基礎控除の範囲内なら贈与税はかかりません。ただし、毎年同じ金額を定期的に贈与すると「定期贈与」とみなされるリスクがあるため、金額や時期を変えることをおすすめします。"}},{"@type":"Question","name":"贈与税の申告はいつまで？","acceptedAnswer":{"@type":"Answer","text":"贈与を受けた年の翌年2月1日〜3月15日までに申告・納付が必要です。110万円以下の場合は申告不要ですが、特例を使う場合は申告が必要です。"}},{"@type":"Question","name":"現金を手渡しでもらったらバレない？","acceptedAnswer":{"@type":"Answer","text":"税務署は預金の動きを調査できます。相続発生時に過去の贈与が発覚することも多く、無申告加算税や延滞税がかかるリスクがあります。"}},{"@type":"Question","name":"夫婦間の贈与も贈与税がかかる？","acceptedAnswer":{"@type":"Answer","text":"原則として贈与税がかかります。ただし、婚姻期間20年以上の夫婦間で居住用不動産を贈与する場合、最大2,000万円まで非課税になる特例があります。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>贈与税シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=贈与税はいくら？&type=blog&category=税金・贈与" alt="贈与税シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】贈与税はいくら？親からの援助・生前贈与の税金シミュレーション</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 贈与税の基本と110万円の基礎控除</li>
          <li>✓ 金額別の贈与税シミュレーション</li>
          <li>✓ 住宅取得資金の非課税特例</li>
          <li>✓ 相続時精算課税制度のメリット・デメリット</li>
          <li>✓ 贈与税を節税する方法</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">贈与税とは？基本を理解しよう</h2>
        <p className="text-gray-700 mb-4">
          贈与税は、<strong className="text-emerald-600">個人から財産をもらったときにかかる税金</strong>です。
          親から子への援助、祖父母から孫への贈り物なども対象になります。
        </p>
        
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-emerald-800 text-xl mb-3">贈与税の基礎控除</h3>
          <div className="bg-emerald-50 rounded p-4 text-center">
            <p className="text-lg mb-2">1年間（1月1日〜12月31日）に受け取った贈与の合計</p>
            <p className="text-4xl font-bold text-emerald-600 mb-2">110万円まで非課税</p>
            <p className="text-gray-600">110万円を超えた部分に贈与税がかかります</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 ポイント：もらう人ごとに判定</p>
          <p className="text-gray-700">
            基礎控除110万円は<strong>もらう人ごと</strong>に適用されます。
            例えば、父から100万円、母から100万円もらった場合、合計200万円のうち90万円が課税対象です。
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【金額別】贈与税シミュレーション</h2>
        <p className="text-gray-700 mb-4">親から子への贈与（特例税率）の場合の税額を計算しました。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">贈与額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">基礎控除後</th>
              <th className="px-4 py-3 text-left border-b font-semibold">税率</th>
              <th className="px-4 py-3 text-left border-b font-semibold">贈与税額</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">110万円</td><td className="px-4 py-3 border-b">0円</td><td className="px-4 py-3 border-b">-</td><td className="px-4 py-3 border-b font-bold text-green-600">0円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">200万円</td><td className="px-4 py-3 border-b">90万円</td><td className="px-4 py-3 border-b">10%</td><td className="px-4 py-3 border-b font-bold text-danger">9万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">300万円</td><td className="px-4 py-3 border-b">190万円</td><td className="px-4 py-3 border-b">10%</td><td className="px-4 py-3 border-b font-bold text-danger">19万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">500万円</td><td className="px-4 py-3 border-b">390万円</td><td className="px-4 py-3 border-b">15%</td><td className="px-4 py-3 border-b font-bold text-danger">48.5万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-4 py-3 border-b font-bold">1,000万円</td><td className="px-4 py-3 border-b">890万円</td><td className="px-4 py-3 border-b">30%</td><td className="px-4 py-3 border-b font-bold text-danger">177万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">2,000万円</td><td className="px-4 py-3 border-b">1,890万円</td><td className="px-4 py-3 border-b">45%</td><td className="px-4 py-3 border-b font-bold text-danger">585.5万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">3,000万円</td><td className="px-4 py-3 border-b">2,890万円</td><td className="px-4 py-3 border-b">50%</td><td className="px-4 py-3 border-b font-bold text-danger">1,035.5万円</td></tr>
          </tbody>
        </table>

        <p className="text-sm text-gray-600 mb-6">※親・祖父母から20歳以上の子・孫への贈与（特例税率）で計算。兄弟間など一般贈与はさらに税率が高くなります。</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの贈与税を計算！</p>
          <p className="text-gray-700 mb-4">贈与額と関係性を入力して、正確な贈与税をシミュレーションしましょう。</p>
          <Link href="/tax/gift-tax-calculator" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 贈与税計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">住宅取得資金の非課税特例</h2>
        <p className="text-gray-700 mb-4">
          マイホーム購入のために親から援助を受ける場合、<strong className="text-emerald-600">最大1,000万円まで非課税</strong>になる特例があります。
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">非課税限度額（2026年）</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">省エネ等住宅</p>
              <p className="text-3xl font-bold text-emerald-600">1,000万円</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">一般住宅</p>
              <p className="text-3xl font-bold text-gray-700">500万円</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 適用条件</p>
          <ul className="text-gray-700 space-y-1">
            <li>・贈与を受ける人が18歳以上</li>
            <li>・合計所得金額が2,000万円以下</li>
            <li>・床面積50㎡以上240㎡以下</li>
            <li>・贈与の翌年3月15日までに居住開始</li>
          </ul>
        </div>

        <div className="bg-emerald-100 rounded-lg p-5">
          <p className="font-bold text-emerald-800 mb-2">計算例：親から1,500万円の住宅購入援助</p>
          <p className="text-gray-700">
            省エネ住宅の場合：1,500万円 − 1,000万円（非課税）− 110万円（基礎控除）= <strong>390万円が課税対象</strong><br />
            → 贈与税は約48.5万円（特例なしなら約450万円以上）
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">相続時精算課税制度とは？</h2>
        <p className="text-gray-700 mb-4">
          60歳以上の親・祖父母から18歳以上の子・孫への贈与で選択できる制度。
          <strong className="text-emerald-600">累計2,500万円まで贈与税が非課税</strong>になりますが、相続時に精算されます。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 text-lg mb-3">メリット</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ 累計2,500万円まで非課税</li>
              <li>✓ 2024年以降は毎年110万円の基礎控除も併用可</li>
              <li>✓ 値上がりする財産を早めに移転できる</li>
              <li>✓ 一度に大きな金額を贈与可能</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-danger text-lg mb-3">デメリット</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✗ 一度選択すると暦年課税に戻れない</li>
              <li>✗ 相続時に贈与額が相続財産に加算</li>
              <li>✗ 小規模宅地の特例が使えなくなる可能性</li>
              <li>✗ 相続税の節税にはならないことも</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">贈与税を節税する5つの方法</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              毎年110万円ずつ贈与する（暦年贈与）
            </h3>
            <p className="text-gray-700 mb-2">基礎控除110万円を毎年活用。10年続ければ1,100万円を非課税で移転可能。</p>
            <p className="text-emerald-600 font-bold">→ 計画的に早く始めるほど有利</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              住宅取得資金の非課税特例を使う
            </h3>
            <p className="text-gray-700 mb-2">マイホーム購入時に最大1,000万円まで非課税。基礎控除と併用可能。</p>
            <p className="text-emerald-600 font-bold">→ 住宅購入予定なら最大限活用</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              教育資金の一括贈与（最大1,500万円）
            </h3>
            <p className="text-gray-700 mb-2">30歳未満の子・孫への教育資金を一括贈与。金融機関での手続きが必要。</p>
            <p className="text-emerald-600 font-bold">→ 孫の教育費を援助したい祖父母向け</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
              結婚・子育て資金の一括贈与（最大1,000万円）
            </h3>
            <p className="text-gray-700 mb-2">18歳以上50歳未満の子・孫への結婚・子育て資金。結婚費用は300万円まで。</p>
            <p className="text-emerald-600 font-bold">→ 結婚・出産を控えた子への援助に</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
              相続時精算課税制度を活用
            </h3>
            <p className="text-gray-700 mb-2">累計2,500万円まで贈与税非課税。値上がりする財産の移転に有効。</p>
            <p className="text-emerald-600 font-bold">→ 相続税対策と組み合わせて検討</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 親から毎年110万円もらっても税金はかからない？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>はい、基礎控除の範囲内なら贈与税はかかりません</strong>。ただし、毎年同じ金額を定期的に贈与すると「定期贈与」とみなされるリスクがあるため、金額や時期を変えることをおすすめします。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 贈与税の申告はいつまで？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>贈与を受けた年の翌年2月1日〜3月15日</strong>までに申告・納付が必要です。110万円以下の場合は申告不要ですが、特例を使う場合は申告が必要です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 現金を手渡しでもらったらバレない？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>税務署は預金の動きを調査できます</strong>。相続発生時に過去の贈与が発覚することも多く、無申告加算税や延滞税がかかるリスクがあります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 夫婦間の贈与も贈与税がかかる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>原則として贈与税がかかります</strong>。ただし、婚姻期間20年以上の夫婦間で居住用不動産を贈与する場合、最大2,000万円まで非課税になる特例があります。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：贈与税は計画的に</h2>
        <p className="text-gray-700 mb-4">
          贈与税は金額が大きくなるほど税率が上がります。親からの援助を受ける場合は、
          <strong>110万円の基礎控除や各種非課税特例を上手に活用</strong>することが大切です。
        </p>
        <p className="text-gray-700 mb-6">
          まずは贈与税計算機で、あなたの場合にいくら税金がかかるかシミュレーションしてみましょう。
        </p>
        
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの贈与税をシミュレーション</p>
          <Link href="/tax/gift-tax-calculator" className="inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 贈与税計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/tax/gift-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">贈与税計算機</span>
            <p className="text-sm text-gray-600">贈与税額を簡単計算</p>
          </Link>
          <Link href="/tax/inheritance-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">相続税計算機</span>
            <p className="text-sm text-gray-600">相続税の見込み額を試算</p>
          </Link>
          <Link href="/finance/jutaku-loan" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">住宅ローン計算機</span>
            <p className="text-sm text-gray-600">毎月の返済額をシミュレーション</p>
          </Link>
          <Link href="/tax/furusato-nozei-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">ふるさと納税計算機</span>
            <p className="text-sm text-gray-600">控除上限額を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の税制に基づいています。最新の情報は国税庁のウェブサイトでご確認ください。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/zouyo-zei-simulation-2026" title="zouyo-zei-simulation-2026" />
</article>
  );
}
