import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】所得税の計算方法｜年収別早見表と手取り額シミュレーション";
const description = "所得税の計算方法を徹底解説。年収300万〜1500万円の税額早見表、控除の種類と活用法、確定申告で還付を受ける方法。手取り額シミュレーターで試算。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("所得税の計算方法")}&type=blog&category=${encodeURIComponent("税金・給与")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["所得税", "計算", "年収", "手取り", "早見表", "控除"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ShotokuzeiKeisanSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】所得税の計算方法｜年収別早見表と手取り額シミュレーション",
            "description": "所得税の計算方法を徹底解説。年収300万〜1500万円の税額早見表、控除の種類と活用法、確定申告で還付を受ける方法。手取り額シミュレーターで試算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/shotokuzei-keisan-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"所得税と住民税の違いは？","acceptedAnswer":{"@type":"Answer","text":"所得税は国税、住民税は地方税です。所得税は累進課税（5〜45%）、住民税は一律約10%。所得税は当年の収入に対して課税、住民税は前年の収入に対して翌年課税されます。"}},{"@type":"Question","name":"年収いくらから所得税がかかる？","acceptedAnswer":{"@type":"Answer","text":"給与収入のみの場合、年収103万円以下なら所得税ゼロです。これは給与所得控除55万円＋基礎控除48万円＝103万円のため。"}},{"@type":"Question","name":"ボーナスの所得税はなぜ高い？","acceptedAnswer":{"@type":"Answer","text":"源泉徴収の計算方法が異なるためです。ボーナスは前月給与を基準に高めに源泉徴収されますが、年末調整で精算されるため、最終的な税額は同じです。"}},{"@type":"Question","name":"副業収入の所得税はどうなる？","acceptedAnswer":{"@type":"Answer","text":"副業収入は本業と合算して累進課税されます。副業所得20万円超なら確定申告が必要。本業で適用されている税率に上乗せされるため、税率が上がることも。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>所得税計算2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=所得税の計算方法&type=blog&category=税金・給与" alt="所得税計算" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】所得税の計算方法｜年収別早見表と手取り額シミュレーション</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-rose-50 border-l-4 border-rose-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 所得税の計算方法と税率</li>
          <li>✓ 年収別の所得税・手取り額早見表</li>
          <li>✓ 控除の種類と節税効果</li>
          <li>✓ 確定申告で還付を受ける方法</li>
          <li>✓ 2026年の税制改正ポイント</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">所得税の基本計算式</h2>
        <p className="text-gray-700 mb-4">
          所得税は以下の手順で計算されます。
        </p>
        
        <div className="bg-white border-2 border-rose-200 rounded-lg p-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
              <p><strong>収入</strong> − 給与所得控除 = <strong>給与所得</strong></p>
            </div>
            <div className="flex items-center">
              <span className="bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
              <p><strong>給与所得</strong> − 所得控除 = <strong>課税所得</strong></p>
            </div>
            <div className="flex items-center">
              <span className="bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
              <p><strong>課税所得</strong> × 税率 − 控除額 = <strong>所得税額</strong></p>
            </div>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">所得税の税率表（2026年）</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-rose-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">課税所得</th>
              <th className="px-4 py-3 text-center border-b font-semibold">税率</th>
              <th className="px-4 py-3 text-center border-b font-semibold">控除額</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">195万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-rose-600">5%</td><td className="px-4 py-3 border-b text-center">0円</td></tr>
            <tr><td className="px-4 py-3 border-b">195万円超〜330万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-rose-600">10%</td><td className="px-4 py-3 border-b text-center">97,500円</td></tr>
            <tr><td className="px-4 py-3 border-b">330万円超〜695万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-rose-600">20%</td><td className="px-4 py-3 border-b text-center">427,500円</td></tr>
            <tr><td className="px-4 py-3 border-b">695万円超〜900万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-rose-600">23%</td><td className="px-4 py-3 border-b text-center">636,000円</td></tr>
            <tr className="bg-yellow-50"><td className="px-4 py-3 border-b">900万円超〜1,800万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-kon">33%</td><td className="px-4 py-3 border-b text-center">1,536,000円</td></tr>
            <tr><td className="px-4 py-3 border-b">1,800万円超〜4,000万円以下</td><td className="px-4 py-3 border-b text-center font-bold text-danger">40%</td><td className="px-4 py-3 border-b text-center">2,796,000円</td></tr>
            <tr><td className="px-4 py-3 border-b">4,000万円超</td><td className="px-4 py-3 border-b text-center font-bold text-danger">45%</td><td className="px-4 py-3 border-b text-center">4,796,000円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 復興特別所得税も加算</p>
          <p className="text-gray-700">
            2037年まで、所得税額の<strong>2.1%</strong>が復興特別所得税として加算されます。
            例：所得税10万円なら、復興税2,100円が追加で約10.2万円に。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【年収別】所得税・手取り額早見表</h2>
        <p className="text-gray-700 mb-4">独身・扶養なし・社会保険加入の会社員の場合（概算）</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-rose-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">年収</th>
              <th className="px-3 py-3 text-right border-b font-semibold">所得税</th>
              <th className="px-3 py-3 text-right border-b font-semibold">住民税</th>
              <th className="px-3 py-3 text-right border-b font-semibold">社会保険</th>
              <th className="px-3 py-3 text-right border-b font-semibold">手取り</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">300万円</td><td className="px-3 py-3 border-b text-right">約5.4万円</td><td className="px-3 py-3 border-b text-right">約12万円</td><td className="px-3 py-3 border-b text-right">約43万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約240万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">400万円</td><td className="px-3 py-3 border-b text-right">約8.5万円</td><td className="px-3 py-3 border-b text-right">約18万円</td><td className="px-3 py-3 border-b text-right">約58万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約315万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">500万円</td><td className="px-3 py-3 border-b text-right">約14万円</td><td className="px-3 py-3 border-b text-right">約25万円</td><td className="px-3 py-3 border-b text-right">約72万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約389万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">600万円</td><td className="px-3 py-3 border-b text-right">約20万円</td><td className="px-3 py-3 border-b text-right">約31万円</td><td className="px-3 py-3 border-b text-right">約86万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約463万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">700万円</td><td className="px-3 py-3 border-b text-right">約31万円</td><td className="px-3 py-3 border-b text-right">約38万円</td><td className="px-3 py-3 border-b text-right">約100万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約531万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">800万円</td><td className="px-3 py-3 border-b text-right">約47万円</td><td className="px-3 py-3 border-b text-right">約45万円</td><td className="px-3 py-3 border-b text-right">約114万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約594万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">1000万円</td><td className="px-3 py-3 border-b text-right">約84万円</td><td className="px-3 py-3 border-b text-right">約63万円</td><td className="px-3 py-3 border-b text-right">約125万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約728万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">1500万円</td><td className="px-3 py-3 border-b text-right">約187万円</td><td className="px-3 py-3 border-b text-right">約108万円</td><td className="px-3 py-3 border-b text-right">約150万円</td><td className="px-3 py-3 border-b text-right font-bold text-rose-600">約1055万円</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの所得税を計算！</p>
          <p className="text-gray-700 mb-4">年収と控除を入力して、正確な所得税と手取り額をシミュレーションしましょう。</p>
          <Link href="/tax/income-tax-calculator" className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 所得税計算機を使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">所得控除の種類と節税効果</h2>
        <p className="text-gray-700 mb-4">
          所得控除を増やせば課税所得が減り、<strong className="text-rose-600">税金が安くなります</strong>。
        </p>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">基礎控除：48万円</h3>
            <p className="text-gray-700 text-sm">すべての人に適用。ただし年収2,400万円超で段階的に減額、2,500万円超でゼロに。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">配偶者控除：最大38万円</h3>
            <p className="text-gray-700 text-sm">配偶者の年収103万円以下の場合に適用。本人の年収により控除額が変動。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">扶養控除：38万円〜63万円/人</h3>
            <p className="text-gray-700 text-sm">16歳以上の扶養親族1人につき適用。19〜22歳は特定扶養控除（63万円）。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">生命保険料控除：最大12万円</h3>
            <p className="text-gray-700 text-sm">一般・介護医療・個人年金の3種類、各4万円ずつ最大12万円。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">iDeCo（小規模企業共済等掛金控除）：全額</h3>
            <p className="text-gray-700 text-sm">掛金が全額所得控除。会社員は年14.4万円〜27.6万円が上限。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">医療費控除：10万円超の部分</h3>
            <p className="text-gray-700 text-sm">年間医療費が10万円（または所得の5%）を超えた部分が控除対象。最大200万円。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">確定申告で還付を受ける方法</h2>
        <p className="text-gray-700 mb-4">
          会社員でも以下のケースは確定申告で税金が戻ってくる可能性があります。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">医療費が10万円超</p>
            <p className="text-gray-700 text-sm">医療費控除で還付。セルフメディケーション税制も検討。</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">住宅ローンを組んだ（初年度）</p>
            <p className="text-gray-700 text-sm">住宅ローン控除。2年目以降は年末調整で対応可能。</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">ふるさと納税をした</p>
            <p className="text-gray-700 text-sm">6自治体以上または確定申告した方が有利な場合。</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">年の途中で退職した</p>
            <p className="text-gray-700 text-sm">年末調整を受けていない場合、払いすぎた税金が戻る。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 所得税と住民税の違いは？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>所得税は国税、住民税は地方税</strong>です。所得税は累進課税（5〜45%）、住民税は一律約10%。所得税は当年の収入に対して課税、住民税は前年の収入に対して翌年課税されます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 年収いくらから所得税がかかる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">給与収入のみの場合、<strong>年収103万円以下なら所得税ゼロ</strong>です。これは給与所得控除55万円＋基礎控除48万円＝103万円のため。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. ボーナスの所得税はなぜ高い？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>源泉徴収の計算方法が異なるため</strong>です。ボーナスは前月給与を基準に高めに源泉徴収されますが、年末調整で精算されるため、最終的な税額は同じです。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 副業収入の所得税はどうなる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">副業収入は<strong>本業と合算して累進課税</strong>されます。副業所得20万円超なら確定申告が必要。本業で適用されている税率に上乗せされるため、税率が上がることも。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：控除を活用して賢く節税</h2>
        <p className="text-gray-700 mb-4">
          所得税は累進課税のため、年収が上がるほど税率も上がります。
          <strong>控除を最大限活用</strong>して課税所得を減らすことが節税の基本です。
        </p>
        
        <div className="bg-gradient-to-r from-rose-500 to-kon text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの所得税をシミュレーション</p>
          <Link href="/tax/income-tax-calculator" className="inline-block bg-white text-rose-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 所得税計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/tax/income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">所得税計算機</span>
            <p className="text-sm text-gray-600">年収から所得税を計算</p>
          </Link>
          <Link href="/career/social-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">社会保険料計算機</span>
            <p className="text-sm text-gray-600">社会保険料を計算</p>
          </Link>
          <Link href="/tax/furusato-nozei-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">ふるさと納税計算機</span>
            <p className="text-sm text-gray-600">控除上限額を計算</p>
          </Link>
          <Link href="/finance/ideco-nisa-comparison" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">iDeCo vs NISA比較</span>
            <p className="text-sm text-gray-600">節税効果を比較</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の税制に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/shotokuzei-keisan-simulation-2026" title="shotokuzei-keisan-simulation-2026" />
</article>
  );
}
