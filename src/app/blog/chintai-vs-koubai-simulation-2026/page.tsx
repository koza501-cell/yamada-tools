import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】賃貸と購入どっちが得？50年シミュレーションで徹底比較";
const description = "賃貸と購入の総コストを50年間でシミュレーション。家賃10万円 vs 住宅ローン3,500万円の比較結果。ライフスタイル別のおすすめと判断基準を解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("賃貸vs購入どっちが得？")}&type=blog&category=${encodeURIComponent("不動産・住まい")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["賃貸", "購入", "比較", "シミュレーション", "住宅ローン", "どっちが得"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ChintaiVsKoubaiSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】賃貸と購入どっちが得？50年シミュレーションで徹底比較",
            "description": "賃貸と購入の総コストを50年間でシミュレーション。家賃10万円 vs 住宅ローン3,500万円の比較結果。ライフスタイル別のおすすめと判断基準を解説。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/chintai-vs-koubai-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"何年住めば購入が有利になる？","acceptedAnswer":{"@type":"Answer","text":"一般的には15〜20年以上住む場合に購入が有利になることが多いです。ただし、物件の資産価値、金利、家賃水準によって大きく変わります。"}},{"@type":"Question","name":"頭金なしでも購入すべき？","acceptedAnswer":{"@type":"Answer","text":"おすすめしません。頭金なしだと借入額が増え、総支払額が大きくなります。最低でも物件価格の10〜20%は頭金を用意したいところ。"}},{"@type":"Question","name":"購入後に転勤になったらどうする？","acceptedAnswer":{"@type":"Answer","text":"売却か賃貸に出すことになります。住宅ローン返済中の賃貸は銀行の承認が必要。売却の場合、ローン残高より低い価格だと自己資金で補填が必要です。"}},{"@type":"Question","name":"マンションと戸建て、どっちが良い？","acceptedAnswer":{"@type":"Answer","text":"マンションは管理費・修繕積立金がかかるが管理が楽。戸建ては自由度が高いが修繕は自己負担。ライフスタイルと立地で選ぶのがベストです。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>賃貸vs購入シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=賃貸vs購入どっちが得？&type=blog&category=不動産・住まい" alt="賃貸vs購入シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】賃貸と購入どっちが得？50年シミュレーションで徹底比較</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 賃貸と購入の50年間総コスト比較</li>
          <li>✓ 購入が有利になる条件・賃貸が有利になる条件</li>
          <li>✓ 見落としがちな隠れコスト</li>
          <li>✓ ライフスタイル別のおすすめ</li>
          <li>✓ 2026年の住宅市場動向</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">結論：単純な損得では決められない</h2>
        <p className="text-gray-700 mb-4">
          「賃貸と購入、どっちが得？」という質問に<strong className="text-orange-600">正解はありません</strong>。
          なぜなら、総コストだけでなく<strong>ライフスタイル、リスク許容度、将来の不確実性</strong>を考慮する必要があるからです。
        </p>
        
        <div className="bg-white border-2 border-orange-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-orange-800 text-xl mb-3">一般的な傾向</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-bold text-blue-800 mb-2">購入が有利になりやすい</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>・同じ場所に15年以上住む予定</li>
                <li>・頭金を20%以上用意できる</li>
                <li>・資産価値が下がりにくいエリア</li>
                <li>・金利が低い時期に借りられる</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-bold text-green-800 mb-2">賃貸が有利になりやすい</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>・転勤・転職の可能性がある</li>
                <li>・10年以内に引越し予定</li>
                <li>・頭金が少ない</li>
                <li>・修繕・維持管理の手間を避けたい</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【50年シミュレーション】賃貸 vs 購入</h2>
        <p className="text-gray-700 mb-4">35歳から85歳までの50年間で、賃貸と購入の総コストを比較しました。</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="font-bold text-gray-800 mb-2">シミュレーション条件</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">【賃貸】</p>
              <p>家賃: 月10万円</p>
              <p>更新料: 2年ごと1ヶ月分</p>
              <p>家賃上昇: 年0.5%</p>
            </div>
            <div>
              <p className="text-gray-600">【購入】</p>
              <p>物件価格: 3,500万円</p>
              <p>頭金: 500万円</p>
              <p>ローン: 3,000万円/35年/1.5%</p>
            </div>
          </div>
        </div>

        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">費用項目</th>
              <th className="px-4 py-3 text-right border-b font-semibold">賃貸（50年）</th>
              <th className="px-4 py-3 text-right border-b font-semibold">購入（50年）</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">住居費（家賃/ローン返済）</td><td className="px-4 py-3 border-b text-right">約6,900万円</td><td className="px-4 py-3 border-b text-right">約3,860万円</td></tr>
            <tr><td className="px-4 py-3 border-b">頭金・初期費用</td><td className="px-4 py-3 border-b text-right">約50万円</td><td className="px-4 py-3 border-b text-right">約700万円</td></tr>
            <tr><td className="px-4 py-3 border-b">更新料/管理費・修繕積立金</td><td className="px-4 py-3 border-b text-right">約300万円</td><td className="px-4 py-3 border-b text-right">約1,200万円</td></tr>
            <tr><td className="px-4 py-3 border-b">固定資産税</td><td className="px-4 py-3 border-b text-right">0円</td><td className="px-4 py-3 border-b text-right">約500万円</td></tr>
            <tr><td className="px-4 py-3 border-b">大規模修繕・リフォーム</td><td className="px-4 py-3 border-b text-right">0円</td><td className="px-4 py-3 border-b text-right">約600万円</td></tr>
            <tr className="bg-yellow-50 font-bold"><td className="px-4 py-3 border-b">総コスト合計</td><td className="px-4 py-3 border-b text-right text-red-600">約7,250万円</td><td className="px-4 py-3 border-b text-right text-red-600">約6,860万円</td></tr>
            <tr className="bg-blue-50"><td className="px-4 py-3 border-b">残る資産価値</td><td className="px-4 py-3 border-b text-right">0円</td><td className="px-4 py-3 border-b text-right text-blue-600">約1,000〜2,000万円</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの条件でシミュレーション！</p>
          <p className="text-gray-700 mb-4">家賃・物件価格・金利を入力して、あなたの場合の比較結果を確認しましょう。</p>
          <Link href="/realestate/rent-vs-buy" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 賃貸vs購入シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">見落としがちな隠れコスト</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 text-lg mb-3">賃貸の隠れコスト</h3>
            <ul className="space-y-2 text-gray-700">
              <li>・更新料（2年ごとに家賃1〜2ヶ月分）</li>
              <li>・引越し費用（転居のたび20〜50万円）</li>
              <li>・火災保険（年1〜2万円）</li>
              <li>・高齢になると借りにくくなるリスク</li>
              <li>・家賃は一生支払い続ける</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="font-bold text-blue-800 text-lg mb-3">購入の隠れコスト</h3>
            <ul className="space-y-2 text-gray-700">
              <li>・固定資産税（年10〜20万円）</li>
              <li>・管理費・修繕積立金（月2〜4万円）</li>
              <li>・大規模修繕（15〜20年ごと100〜300万円）</li>
              <li>・設備交換（給湯器、エアコン等）</li>
              <li>・売却時の仲介手数料（3%+6万円）</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 購入の「機会損失」も考慮</p>
          <p className="text-gray-700">
            頭金500万円を投資に回した場合、年利5%で35年後には約2,760万円に。
            この<strong>機会損失</strong>も購入のコストとして考える必要があります。
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ライフスタイル別おすすめ</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              転勤族・転職を考えている人 → 賃貸
            </h3>
            <p className="text-gray-700">住宅ローンを組んでも売却・賃貸に出す手間とリスクが大きい。身軽さを優先。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              子育て世帯（同じ場所に長く住む予定） → 購入
            </h3>
            <p className="text-gray-700">学区や環境を固定したい場合は購入が有利。資産として子供に残せる。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              独身・DINKs → ケースバイケース
            </h3>
            <p className="text-gray-700">ライフスタイルの変化が大きい時期。10年以内に結婚・転職の可能性があるなら賃貸。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
              老後を見据えて安定したい人 → 購入（中古も検討）
            </h3>
            <p className="text-gray-700">高齢になると賃貸契約が難しくなる。住居費を固定できる安心感。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2026年の住宅市場動向</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <p className="font-bold text-gray-800">住宅価格：高止まり</p>
                <p className="text-gray-600 text-sm">都市部のマンション価格は過去最高水準。郊外は横ばい〜下落傾向。</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💹</span>
              <div>
                <p className="font-bold text-gray-800">住宅ローン金利：上昇傾向</p>
                <p className="text-gray-600 text-sm">変動金利は0.3〜0.5%台、固定金利は1.5〜2%台。今後さらに上昇の可能性。</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🏠</span>
              <div>
                <p className="font-bold text-gray-800">賃貸市場：家賃上昇</p>
                <p className="text-gray-600 text-sm">都市部を中心に家賃が上昇。特に単身向け物件の値上げが顕著。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 何年住めば購入が有利になる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>一般的には15〜20年以上</strong>住む場合に購入が有利になることが多いです。ただし、物件の資産価値、金利、家賃水準によって大きく変わります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 頭金なしでも購入すべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>おすすめしません</strong>。頭金なしだと借入額が増え、総支払額が大きくなります。最低でも物件価格の10〜20%は頭金を用意したいところ。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 購入後に転勤になったらどうする？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>売却か賃貸に出す</strong>ことになります。住宅ローン返済中の賃貸は銀行の承認が必要。売却の場合、ローン残高より低い価格だと自己資金で補填が必要です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. マンションと戸建て、どっちが良い？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">マンションは管理費・修繕積立金がかかるが管理が楽。戸建ては自由度が高いが修繕は自己負担。<strong>ライフスタイルと立地で選ぶ</strong>のがベストです。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：自分の条件でシミュレーションを</h2>
        <p className="text-gray-700 mb-4">
          賃貸と購入、どちらが得かは<strong>あなたの条件次第</strong>です。
          家賃、物件価格、頭金、住む期間、ライフスタイル——すべてを考慮して判断しましょう。
        </p>
        <p className="text-gray-700 mb-6">
          まずはシミュレーターで、あなたの場合の総コストを比較してみてください。
        </p>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの条件で賃貸vs購入を比較</p>
          <Link href="/realestate/rent-vs-buy" className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 賃貸vs購入シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/realestate/rent-vs-buy" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-orange-300 transition">
            <span className="font-bold text-gray-800">賃貸vs購入シミュレーター</span>
            <p className="text-sm text-gray-600">総コストを比較</p>
          </Link>
          <Link href="/finance/jutaku-loan" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-orange-300 transition">
            <span className="font-bold text-gray-800">住宅ローン計算機</span>
            <p className="text-sm text-gray-600">毎月の返済額を計算</p>
          </Link>
          <Link href="/realestate/property-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-orange-300 transition">
            <span className="font-bold text-gray-800">固定資産税計算機</span>
            <p className="text-sm text-gray-600">年間の税額を試算</p>
          </Link>
          <Link href="/realestate/moving-cost-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-orange-300 transition">
            <span className="font-bold text-gray-800">引越し費用計算機</span>
            <p className="text-sm text-gray-600">引越し費用の目安</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。住宅価格・金利は変動します。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/chintai-vs-koubai-simulation-2026" title="chintai-vs-koubai-simulation-2026" />
</article>
  );
}
