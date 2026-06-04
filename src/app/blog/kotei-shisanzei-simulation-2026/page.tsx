import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】固定資産税の計算方法｜新築・中古・土地別シミュレーション";
const description = "固定資産税の計算方法を徹底解説。新築住宅の軽減措置、土地の特例、評価額の調べ方。マンション・戸建て別の計算例と節税方法を紹介。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("固定資産税の計算方法")}&type=blog&category=${encodeURIComponent("不動産・税金")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["固定資産税", "計算", "新築", "軽減", "評価額", "シミュレーション"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function KoteiShisanzeiSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】固定資産税の計算方法｜新築・中古・土地別シミュレーション",
            "description": "固定資産税の計算方法を徹底解説。新築住宅の軽減措置、土地の特例、評価額の調べ方。マンション・戸建て別の計算例と節税方法を紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/kotei-shisanzei-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"固定資産税はいつ払う？","acceptedAnswer":{"@type":"Answer","text":"年4回（4月・7月・12月・翌2月頃）の分割払い、または一括払いを選択できます。納期限は市区町村によって異なります。"}},{"@type":"Question","name":"空き家にすると固定資産税が上がる？","acceptedAnswer":{"@type":"Answer","text":"「特定空き家」に指定されると住宅用地の特例が外れ、最大6倍になる可能性があります。適切な管理が必要です。"}},{"@type":"Question","name":"評価額が高すぎる場合は？","acceptedAnswer":{"@type":"Answer","text":"審査申出ができます。評価替えの年（3年ごと）に、固定資産評価審査委員会に不服を申し立てることが可能です。"}},{"@type":"Question","name":"マンションの固定資産税は戸建てより安い？","acceptedAnswer":{"@type":"Answer","text":"一概には言えません。マンションは土地持分が小さいため土地分は安くなりますが、建物評価額は戸建てより高くなることが多いです。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>固定資産税計算2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=固定資産税の計算方法&type=blog&category=不動産・税金" alt="固定資産税計算" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】固定資産税の計算方法｜新築・中古・土地別シミュレーション</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 固定資産税の基本的な計算方法</li>
          <li>✓ 新築住宅の軽減措置（3年・5年・7年）</li>
          <li>✓ 土地の評価額と住宅用地の特例</li>
          <li>✓ マンション・戸建て別の計算例</li>
          <li>✓ 固定資産税を安くする方法</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">固定資産税の基本計算式</h2>
        <p className="text-gray-700 mb-4">
          固定資産税は、毎年1月1日時点の不動産所有者に課税される地方税です。
        </p>
        
        <div className="bg-white border-2 border-teal-200 rounded-lg p-6 mb-6">
          <div className="bg-teal-50 rounded p-4 text-center">
            <p className="text-2xl font-bold text-teal-800 mb-2">固定資産税 = 課税標準額 × 1.4%（税率）</p>
            <p className="text-gray-600">※都市計画税（0.3%）が別途かかる場合あり</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-bold text-kon mb-2">課税標準額とは？</p>
            <p className="text-gray-700 text-sm">固定資産税評価額に各種特例を適用した後の金額。評価額そのままではなく、特例で減額されることが多い。</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">固定資産税評価額とは？</p>
            <p className="text-gray-700 text-sm">市区町村が決定する不動産の評価額。3年ごとに見直し（評価替え）。実勢価格の約70%が目安。</p>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【新築住宅】固定資産税の軽減措置</h2>
        <p className="text-gray-700 mb-4">
          新築住宅は一定期間、<strong className="text-teal-600">建物部分の固定資産税が1/2に軽減</strong>されます。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">住宅の種類</th>
              <th className="px-4 py-3 text-center border-b font-semibold">軽減期間</th>
              <th className="px-4 py-3 text-left border-b font-semibold">適用条件</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">一般住宅（戸建て）</td><td className="px-4 py-3 border-b text-center font-bold text-teal-600">3年間</td><td className="px-4 py-3 border-b">床面積50㎡〜280㎡</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">一般住宅（マンション）</td><td className="px-4 py-3 border-b text-center font-bold text-teal-600">5年間</td><td className="px-4 py-3 border-b">3階建て以上の耐火・準耐火建築物</td></tr>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">認定長期優良住宅（戸建て）</td><td className="px-4 py-3 border-b text-center font-bold text-green-600">5年間</td><td className="px-4 py-3 border-b">長期優良住宅の認定を受けた住宅</td></tr>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">認定長期優良住宅（マンション）</td><td className="px-4 py-3 border-b text-center font-bold text-green-600">7年間</td><td className="px-4 py-3 border-b">3階建て以上の耐火・準耐火建築物</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 軽減対象は120㎡まで</p>
          <p className="text-gray-700">
            建物の床面積のうち<strong>120㎡分まで</strong>が1/2軽減の対象。
            それを超える部分は通常税率が適用されます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【土地】住宅用地の特例</h2>
        <p className="text-gray-700 mb-4">
          住宅が建っている土地は、<strong className="text-teal-600">課税標準額が大幅に軽減</strong>されます。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">土地の種類</th>
              <th className="px-4 py-3 text-center border-b font-semibold">固定資産税</th>
              <th className="px-4 py-3 text-center border-b font-semibold">都市計画税</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">小規模住宅用地（200㎡以下）</td><td className="px-4 py-3 border-b text-center font-bold text-green-600">評価額の1/6</td><td className="px-4 py-3 border-b text-center font-bold text-green-600">評価額の1/3</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">一般住宅用地（200㎡超）</td><td className="px-4 py-3 border-b text-center font-bold text-teal-600">評価額の1/3</td><td className="px-4 py-3 border-b text-center font-bold text-teal-600">評価額の2/3</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">更地（非住宅用地）</td><td className="px-4 py-3 border-b text-center">評価額の70%</td><td className="px-4 py-3 border-b text-center">評価額の70%</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの固定資産税を計算！</p>
          <p className="text-gray-700 mb-4">評価額と条件を入力して、正確な固定資産税をシミュレーションしましょう。</p>
          <Link href="/realestate/property-tax-calculator" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 固定資産税計算機を使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【計算例】新築戸建ての固定資産税</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">ケース：土地150㎡・建物100㎡の新築戸建て</h3>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600">条件：土地評価額1,500万円、建物評価額1,000万円</p>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-bold text-gray-800 mb-2">【土地の固定資産税】</p>
              <p className="text-gray-700">小規模住宅用地の特例：1,500万円 × 1/6 = 250万円（課税標準額）</p>
              <p className="text-gray-700">固定資産税：250万円 × 1.4% = <strong className="text-teal-600">35,000円</strong></p>
            </div>
            <div className="border-b pb-3">
              <p className="font-bold text-gray-800 mb-2">【建物の固定資産税（新築軽減あり）】</p>
              <p className="text-gray-700">新築軽減：1,000万円 × 1/2 = 500万円（課税標準額）</p>
              <p className="text-gray-700">固定資産税：500万円 × 1.4% = <strong className="text-teal-600">70,000円</strong></p>
            </div>
            <div className="bg-teal-50 p-4 rounded">
              <p className="font-bold text-gray-800">【合計（1〜3年目）】</p>
              <p className="text-2xl font-bold text-teal-600">年間 約105,000円</p>
              <p className="text-sm text-gray-600 mt-2">※4年目以降は建物の軽減がなくなり、約175,000円に増加</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">ケース：築20年の中古マンション</h3>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600">条件：土地持分評価額300万円、建物評価額500万円</p>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-bold text-gray-800 mb-2">【土地の固定資産税】</p>
              <p className="text-gray-700">小規模住宅用地の特例：300万円 × 1/6 = 50万円</p>
              <p className="text-gray-700">固定資産税：50万円 × 1.4% = <strong className="text-teal-600">7,000円</strong></p>
            </div>
            <div className="border-b pb-3">
              <p className="font-bold text-gray-800 mb-2">【建物の固定資産税】</p>
              <p className="text-gray-700">築20年のため新築軽減なし</p>
              <p className="text-gray-700">固定資産税：500万円 × 1.4% = <strong className="text-teal-600">70,000円</strong></p>
            </div>
            <div className="bg-teal-50 p-4 rounded">
              <p className="font-bold text-gray-800">【合計】</p>
              <p className="text-2xl font-bold text-teal-600">年間 約77,000円</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">固定資産税評価額の調べ方</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              固定資産税の納税通知書を確認
            </h3>
            <p className="text-gray-700 text-sm">毎年4〜6月に届く納税通知書に「価格」として記載されています。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              固定資産評価証明書を取得
            </h3>
            <p className="text-gray-700 text-sm">市区町村の窓口で取得可能（手数料300〜400円程度）。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              固定資産課税台帳を閲覧
            </h3>
            <p className="text-gray-700 text-sm">縦覧期間（4月頃）に市区町村で閲覧可能。近隣との比較もできる。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 固定資産税はいつ払う？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>年4回（4月・7月・12月・翌2月頃）の分割払い</strong>、または一括払いを選択できます。納期限は市区町村によって異なります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 空き家にすると固定資産税が上がる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>「特定空き家」に指定されると住宅用地の特例が外れ、最大6倍に</strong>なる可能性があります。適切な管理が必要です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 評価額が高すぎる場合は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>審査申出ができます</strong>。評価替えの年（3年ごと）に、固定資産評価審査委員会に不服を申し立てることが可能です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. マンションの固定資産税は戸建てより安い？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>一概には言えません</strong>。マンションは土地持分が小さいため土地分は安くなりますが、建物評価額は戸建てより高くなることが多いです。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：固定資産税は軽減措置を活用</h2>
        <p className="text-gray-700 mb-4">
          固定資産税は不動産を持つ限り毎年かかるコスト。<strong>新築軽減や住宅用地の特例を正しく理解</strong>し、
          適切に適用されているか確認しましょう。
        </p>
        
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの固定資産税をシミュレーション</p>
          <Link href="/realestate/property-tax-calculator" className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 固定資産税計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/realestate/property-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">固定資産税計算機</span>
            <p className="text-sm text-gray-600">年間の税額を計算</p>
          </Link>
          <Link href="/realestate/acquisition-tax" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">不動産取得税計算機</span>
            <p className="text-sm text-gray-600">購入時の税額を計算</p>
          </Link>
          <Link href="/realestate/rent-vs-buy" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">賃貸vs購入シミュレーター</span>
            <p className="text-sm text-gray-600">総コストを比較</p>
          </Link>
          <Link href="/finance/jutaku-loan" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">住宅ローン計算機</span>
            <p className="text-sm text-gray-600">毎月の返済額を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の税制に基づいています。税率や軽減措置は変更される場合があります。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/kotei-shisanzei-simulation-2026" title="kotei-shisanzei-simulation-2026" />
</article>
  );
}
