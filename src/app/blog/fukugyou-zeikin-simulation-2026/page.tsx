import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import Link from "next/link";

const title = "【2026年最新】副業の税金はいくら？確定申告が必要な条件と節税方法を解説";
const description = "副業収入20万円以下でも住民税は申告必要？副業バレを防ぐ方法、経費で落とせるもの、確定申告のやり方まで完全解説。副業税金シミュレーターで試算。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("副業の税金はいくら？")}&type=blog&category=${encodeURIComponent("副業・税金")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["副業", "税金", "確定申告", "20万円", "住民税", "節税"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function FukugyouZeikinSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】副業の税金はいくら？確定申告が必要な条件と節税方法を解説",
            "description": "副業収入20万円以下でも住民税は申告必要？副業バレを防ぐ方法、経費で落とせるもの、確定申告のやり方まで完全解説。副業税金シミュレーターで試算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/fukugyou-zeikin-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"副業収入が20万円以下なら何もしなくていい？","acceptedAnswer":{"@type":"Answer","text":"所得税の確定申告は不要ですが、住民税の申告は必要です。市区町村の窓口で住民税の申告をするか、あえて確定申告をして住民税も一緒に処理するのが確実です。"}},{"@type":"Question","name":"メルカリやヤフオクの売上も申告が必要？","acceptedAnswer":{"@type":"Answer","text":"不用品の売却は基本的に非課税です。ただし、転売目的で仕入れて販売している場合や、高額な利益が出ている場合は申告が必要になることがあります。"}},{"@type":"Question","name":"副業が赤字の場合はどうなる？","acceptedAnswer":{"@type":"Answer","text":"事業所得として申告すれば、本業の給与所得と損益通算でき、税金が還付される可能性があります。ただし、雑所得では損益通算できません。"}},{"@type":"Question","name":"副業で青色申告はできる？","acceptedAnswer":{"@type":"Answer","text":"事業所得として認められれば可能です。開業届と青色申告承認申請書を提出し、複式簿記で記帳すれば65万円の控除が受けられます。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>副業税金シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=副業の税金はいくら？&type=blog&category=副業・税金" alt="副業税金シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】副業の税金はいくら？確定申告が必要な条件と節税方法を解説</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 副業収入にかかる税金の種類と計算方法</li>
          <li>✓ 確定申告が必要な条件（20万円ルールの落とし穴）</li>
          <li>✓ 副業が会社にバレない方法</li>
          <li>✓ 経費で落とせるものリスト</li>
          <li>✓ 副業の節税テクニック</li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業収入にかかる税金は2種類</h2>
        <p className="text-gray-700 mb-4">
          副業で稼いだお金には、<strong className="text-indigo-600">所得税</strong>と<strong className="text-indigo-600">住民税</strong>の2つの税金がかかります。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border-2 border-indigo-200 rounded-lg p-5">
            <h3 className="font-bold text-indigo-800 text-lg mb-2">所得税</h3>
            <p className="text-gray-700 mb-2">国に納める税金。税率は所得に応じて5〜45%。</p>
            <p className="text-sm text-gray-600">確定申告で納付（副業所得20万円超の場合）</p>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 text-lg mb-2">住民税</h3>
            <p className="text-gray-700 mb-2">市区町村に納める税金。一律約10%。</p>
            <p className="text-sm text-gray-600">所得に関係なく申告が必要</p>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 「20万円以下なら申告不要」の落とし穴</p>
          <p className="text-gray-700">
            副業所得20万円以下で<strong>所得税の確定申告は不要</strong>ですが、
            <strong className="text-red-600">住民税の申告は必要</strong>です。市区町村に直接申告するか、確定申告をする必要があります。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【副業収入別】税金シミュレーション</h2>
        <p className="text-gray-700 mb-4">本業の年収500万円の会社員が副業した場合の税金を試算しました。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">副業収入（経費控除後）</th>
              <th className="px-4 py-3 text-right border-b font-semibold">所得税</th>
              <th className="px-4 py-3 text-right border-b font-semibold">住民税</th>
              <th className="px-4 py-3 text-right border-b font-semibold">合計税額</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">10万円</td><td className="px-4 py-3 border-b text-right">約2万円</td><td className="px-4 py-3 border-b text-right">約1万円</td><td className="px-4 py-3 border-b text-right font-bold">約3万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">20万円</td><td className="px-4 py-3 border-b text-right">約4万円</td><td className="px-4 py-3 border-b text-right">約2万円</td><td className="px-4 py-3 border-b text-right font-bold">約6万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">50万円</td><td className="px-4 py-3 border-b text-right">約10万円</td><td className="px-4 py-3 border-b text-right">約5万円</td><td className="px-4 py-3 border-b text-right font-bold">約15万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-4 py-3 border-b font-bold">100万円</td><td className="px-4 py-3 border-b text-right">約20万円</td><td className="px-4 py-3 border-b text-right">約10万円</td><td className="px-4 py-3 border-b text-right font-bold text-red-600">約30万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">200万円</td><td className="px-4 py-3 border-b text-right">約46万円</td><td className="px-4 py-3 border-b text-right">約20万円</td><td className="px-4 py-3 border-b text-right font-bold text-red-600">約66万円</td></tr>
          </tbody>
        </table>

        <p className="text-sm text-gray-600 mb-6">※本業年収500万円（課税所得約280万円）の場合の概算。適用税率は所得全体で決まるため、副業分は上乗せ税率で計算。</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの副業税金を計算！</p>
          <p className="text-gray-700 mb-4">本業年収と副業収入を入力して、正確な税額をシミュレーションしましょう。</p>
          <Link href="/career/side-income-tax-calculator" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 副業税金計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業が会社にバレない方法</h2>
        <p className="text-gray-700 mb-4">
          副業が会社にバレる最大の原因は<strong className="text-indigo-600">住民税の通知</strong>です。
          会社が給与から天引きする住民税が増えることで発覚します。
        </p>
        
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-indigo-800 text-xl mb-3">バレないための対策</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
              <div>
                <p className="font-bold text-gray-800">確定申告で「自分で納付」を選択</p>
                <p className="text-gray-600 text-sm">確定申告書の「住民税の徴収方法」で「自分で納付（普通徴収）」にチェック。副業分の住民税は自宅に届く。</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
              <div>
                <p className="font-bold text-gray-800">給与所得の副業は要注意</p>
                <p className="text-gray-600 text-sm">アルバイトなど「給与」としてもらう副業は普通徴収にできない場合あり。業務委託契約がおすすめ。</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
              <div>
                <p className="font-bold text-gray-800">SNSでの実名投稿を避ける</p>
                <p className="text-gray-600 text-sm">意外とSNSから発覚するケースも。副業アカウントは匿名で運用を。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 確定申告書の記入場所</p>
          <p className="text-gray-700">
            確定申告書第二表の「住民税に関する事項」→「給与、公的年金等以外の所得に係る住民税の徴収方法」で
            <strong>「自分で納付」</strong>にチェックを入れる。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業で経費にできるもの</h2>
        <p className="text-gray-700 mb-4">
          副業収入から経費を引いた金額が「所得」です。経費を正しく計上すれば節税になります。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 text-lg mb-3">✅ 経費にできるもの</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>・パソコン、スマホ（副業使用分）</li>
              <li>・インターネット回線（按分）</li>
              <li>・自宅の光熱費（按分）</li>
              <li>・書籍、教材、セミナー代</li>
              <li>・ソフトウェア、サブスク費用</li>
              <li>・交通費、出張費</li>
              <li>・取材・打ち合わせの飲食代</li>
              <li>・名刺、文房具</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-800 text-lg mb-3">❌ 経費にできないもの</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>・プライベートの食事</li>
              <li>・趣味の本・グッズ</li>
              <li>・普段着の衣服</li>
              <li>・健康診断、医療費</li>
              <li>・交通違反の罰金</li>
              <li>・生活費全般</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-100 rounded-lg p-5">
          <p className="font-bold text-indigo-800 mb-2">按分（あんぶん）のやり方</p>
          <p className="text-gray-700 text-sm">
            自宅で副業している場合、家賃・光熱費・通信費を<strong>副業使用割合</strong>で経費計上できます。<br />
            例：自宅の20%を副業に使用 → 家賃10万円の場合、2万円が経費
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業の確定申告のやり方</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              必要書類を準備
            </h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>・源泉徴収票（本業）</li>
              <li>・副業の収入がわかる書類（支払調書、通帳、請求書控え）</li>
              <li>・経費の領収書</li>
              <li>・マイナンバーカード</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              e-Taxで申告（おすすめ）
            </h3>
            <p className="text-gray-700 text-sm">国税庁の確定申告書等作成コーナーで入力。マイナンバーカードがあればスマホで完結。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              申告期限を守る
            </h3>
            <p className="text-gray-700 text-sm">毎年2月16日〜3月15日が申告期間。期限を過ぎると延滞税がかかることも。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 副業収入が20万円以下なら何もしなくていい？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>所得税の確定申告は不要ですが、住民税の申告は必要です</strong>。市区町村の窓口で住民税の申告をするか、あえて確定申告をして住民税も一緒に処理するのが確実です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. メルカリやヤフオクの売上も申告が必要？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>不用品の売却は基本的に非課税</strong>です。ただし、転売目的で仕入れて販売している場合や、高額な利益が出ている場合は申告が必要になることがあります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 副業が赤字の場合はどうなる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">事業所得として申告すれば、<strong>本業の給与所得と損益通算</strong>でき、税金が還付される可能性があります。ただし、雑所得では損益通算できません。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 副業で青色申告はできる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>事業所得として認められれば可能</strong>です。開業届と青色申告承認申請書を提出し、複式簿記で記帳すれば65万円の控除が受けられます。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：副業の税金は正しく申告</h2>
        <p className="text-gray-700 mb-4">
          副業収入は適切に申告すれば、<strong>経費を活用して節税</strong>できます。
          「自分で納付」を選択すれば会社にバレるリスクも抑えられます。
        </p>
        <p className="text-gray-700 mb-6">
          まずは副業税金計算機で、あなたの場合にいくら税金がかかるかシミュレーションしてみましょう。
        </p>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの副業税金をシミュレーション</p>
          <Link href="/career/side-income-tax-calculator" className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 副業税金計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/side-income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">副業税金計算機</span>
            <p className="text-sm text-gray-600">副業の税金を簡単計算</p>
          </Link>
          <Link href="/tax/income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">所得税計算機</span>
            <p className="text-sm text-gray-600">年収から所得税を試算</p>
          </Link>
          <Link href="/business/freelance-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">フリーランス税金計算機</span>
            <p className="text-sm text-gray-600">フリーランスの税金を計算</p>
          </Link>
          <Link href="/tax/furusato-nozei-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">ふるさと納税計算機</span>
            <p className="text-sm text-gray-600">控除上限額を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の税制に基づいています。最新の情報は国税庁のウェブサイトでご確認ください。</p>
    </article>
  );
}
