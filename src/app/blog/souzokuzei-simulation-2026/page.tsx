import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】相続税シミュレーション完全ガイド｜基礎控除・税率・計算方法を徹底解説";
const description = "相続税の計算方法を初心者向けに解説。基礎控除3,000万円+600万円×法定相続人の数で非課税枠を計算。遺産1億円の場合の税額シミュレーションや節税対策も紹介。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("【2026年最新】相続税シミュレーション完全ガイド")}&type=blog&category=${encodeURIComponent("相続・贈与")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["相続税", "シミュレーション", "基礎控除", "計算", "税率", "節税"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function SouzokuzeiSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】相続税シミュレーション完全ガイド｜基礎控除・税率・計算方法を徹底解説",
            "description": "相続税の計算方法を初心者向けに解説。基礎控除3,000万円+600万円×法定相続人の数で非課税枠を計算。遺産1億円の場合の税額シミュレーションや節税対策も紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/souzokuzei-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"相続税の申告期限は？","acceptedAnswer":{"@type":"Answer","text":"被相続人が亡くなった日から10ヶ月以内に申告・納税が必要です。遅れるとペナルティがかかります。"}},{"@type":"Question","name":"相続税は現金一括で払うの？","acceptedAnswer":{"@type":"Answer","text":"原則は現金一括ですが、延納（分割払い）や物納（不動産などで支払い）も条件を満たせば可能です。"}},{"@type":"Question","name":"借金も相続するの？","acceptedAnswer":{"@type":"Answer","text":"はい、借金（マイナスの財産）も相続対象です。ただし、借金が多い場合は「相続放棄」や「限定承認」という選択肢もあります。"}},{"@type":"Question","name":"生前贈与したら相続税に加算される？","acceptedAnswer":{"@type":"Answer","text":"相続開始前7年以内の贈与は相続財産に加算されます（2024年以降の贈与から段階的に7年に延長）。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>相続税シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=【2026年最新】相続税シミュレーション完全ガイド&type=blog&category=相続・贈与" alt="相続税シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】相続税シミュレーション完全ガイド｜基礎控除・税率・計算方法を徹底解説</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 相続税の基礎控除の計算方法</li>
          <li>✓ 相続税の税率と速算表</li>
          <li>✓ 遺産額別の相続税シミュレーション</li>
          <li>✓ 配偶者控除・小規模宅地の特例</li>
          <li>✓ 生前にできる節税対策</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">相続税とは？かかる人・かからない人</h2>
        <p className="text-gray-700 mb-4">
          相続税は、亡くなった方（被相続人）の財産を相続した人にかかる税金です。
          ただし、すべての相続に税金がかかるわけではなく、<strong className="text-indigo-600">基礎控除額</strong>を超えた場合のみ課税されます。
        </p>
        
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-indigo-800 text-xl mb-3">基礎控除額の計算式</h3>
          <p className="text-2xl font-bold text-center text-indigo-600 mb-4">
            3,000万円 + 600万円 × 法定相続人の数
          </p>
          <div className="bg-indigo-50 rounded p-4">
            <p className="font-bold mb-2">具体例：</p>
            <ul className="space-y-1 text-gray-700">
              <li>・法定相続人1人 → 基礎控除 <strong>3,600万円</strong></li>
              <li>・法定相続人2人 → 基礎控除 <strong>4,200万円</strong></li>
              <li>・法定相続人3人 → 基礎控除 <strong>4,800万円</strong></li>
              <li>・法定相続人4人 → 基礎控除 <strong>5,400万円</strong></li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 約9割の相続は非課税</p>
          <p className="text-gray-700">
            実際に相続税が課税されるのは、亡くなった方の約8〜9%程度です。
            配偶者と子ども2人が相続人の場合、遺産が<strong>4,800万円以下</strong>なら相続税はかかりません。
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">相続税の税率と速算表</h2>
        <p className="text-gray-700 mb-4">相続税は累進課税で、取得金額が大きいほど税率が高くなります。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">法定相続分に応じた取得金額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">税率</th>
              <th className="px-4 py-3 text-left border-b font-semibold">控除額</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">1,000万円以下</td><td className="px-4 py-3 border-b font-bold">10%</td><td className="px-4 py-3 border-b">-</td></tr>
            <tr><td className="px-4 py-3 border-b">3,000万円以下</td><td className="px-4 py-3 border-b font-bold">15%</td><td className="px-4 py-3 border-b">50万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5,000万円以下</td><td className="px-4 py-3 border-b font-bold">20%</td><td className="px-4 py-3 border-b">200万円</td></tr>
            <tr><td className="px-4 py-3 border-b">1億円以下</td><td className="px-4 py-3 border-b font-bold">30%</td><td className="px-4 py-3 border-b">700万円</td></tr>
            <tr><td className="px-4 py-3 border-b">2億円以下</td><td className="px-4 py-3 border-b font-bold">40%</td><td className="px-4 py-3 border-b">1,700万円</td></tr>
            <tr><td className="px-4 py-3 border-b">3億円以下</td><td className="px-4 py-3 border-b font-bold">45%</td><td className="px-4 py-3 border-b">2,700万円</td></tr>
            <tr><td className="px-4 py-3 border-b">6億円以下</td><td className="px-4 py-3 border-b font-bold">50%</td><td className="px-4 py-3 border-b">4,200万円</td></tr>
            <tr><td className="px-4 py-3 border-b">6億円超</td><td className="px-4 py-3 border-b font-bold text-red-600">55%</td><td className="px-4 py-3 border-b">7,200万円</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【遺産額別】相続税シミュレーション</h2>
        <p className="text-gray-700 mb-4">配偶者と子ども1人が相続人（法定相続人2人）の場合の相続税額を試算しました。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">遺産総額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">基礎控除後</th>
              <th className="px-4 py-3 text-left border-b font-semibold">相続税総額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">配偶者控除適用後</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">4,200万円以下</td><td className="px-4 py-3 border-b">0円</td><td className="px-4 py-3 border-b font-bold text-green-600">0円</td><td className="px-4 py-3 border-b">0円</td></tr>
            <tr><td className="px-4 py-3 border-b">5,000万円</td><td className="px-4 py-3 border-b">800万円</td><td className="px-4 py-3 border-b font-bold">80万円</td><td className="px-4 py-3 border-b">40万円</td></tr>
            <tr><td className="px-4 py-3 border-b">8,000万円</td><td className="px-4 py-3 border-b">3,800万円</td><td className="px-4 py-3 border-b font-bold">470万円</td><td className="px-4 py-3 border-b">235万円</td></tr>
            <tr><td className="px-4 py-3 border-b">1億円</td><td className="px-4 py-3 border-b">5,800万円</td><td className="px-4 py-3 border-b font-bold">770万円</td><td className="px-4 py-3 border-b">385万円</td></tr>
            <tr><td className="px-4 py-3 border-b">2億円</td><td className="px-4 py-3 border-b">1億5,800万円</td><td className="px-4 py-3 border-b font-bold">3,340万円</td><td className="px-4 py-3 border-b">1,670万円</td></tr>
            <tr><td className="px-4 py-3 border-b">3億円</td><td className="px-4 py-3 border-b">2億5,800万円</td><td className="px-4 py-3 border-b font-bold">6,920万円</td><td className="px-4 py-3 border-b">3,460万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 配偶者控除で税額が半分に</p>
          <p className="text-gray-700">
            配偶者が相続する分については、<strong>1億6,000万円または法定相続分</strong>のどちらか多い方まで非課税になります。
            実質、配偶者が相続する分の相続税はゼロになるケースが多いです。
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたのケースで試算！</p>
          <p className="text-gray-700 mb-4">遺産総額・相続人の数を入力して、相続税の概算額を計算しましょう。</p>
          <Link href="/tax/inheritance-tax-calculator" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 相続税シミュレーターを使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">相続税を減らす5つの方法</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              生前贈与（暦年贈与）
            </h3>
            <p className="text-gray-700">毎年110万円までの贈与は非課税。10年間で1,100万円を非課税で移転できます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              小規模宅地の特例
            </h3>
            <p className="text-gray-700">自宅の土地は最大80%評価減。評価額5,000万円の土地が1,000万円で計算されます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              生命保険の活用
            </h3>
            <p className="text-gray-700">死亡保険金は「500万円×法定相続人の数」まで非課税。相続人3人なら1,500万円が非課税枠に。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
              教育資金・結婚子育て資金の一括贈与
            </h3>
            <p className="text-gray-700">孫への教育資金は1,500万円まで、結婚・子育て資金は1,000万円まで非課税で贈与可能。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
              不動産の活用
            </h3>
            <p className="text-gray-700">現金を不動産に変えると評価額が下がります。賃貸物件なら更に評価減のメリットも。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 相続税の申告期限は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>被相続人が亡くなった日から10ヶ月以内</strong>に申告・納税が必要です。遅れるとペナルティがかかります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 相続税は現金一括で払うの？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">原則は現金一括ですが、<strong>延納（分割払い）や物納（不動産などで支払い）</strong>も条件を満たせば可能です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 借金も相続するの？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>はい、借金（マイナスの財産）も相続対象です。</strong>ただし、借金が多い場合は「相続放棄」や「限定承認」という選択肢もあります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 生前贈与したら相続税に加算される？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>相続開始前7年以内の贈与</strong>は相続財産に加算されます（2024年以降の贈与から段階的に7年に延長）。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：相続税は早めの対策が重要</h2>
        <p className="text-gray-700 mb-4">
          相続税は基礎控除額（3,000万円+600万円×法定相続人の数）を超えた場合に課税されます。
          配偶者控除や小規模宅地の特例を活用すれば、税負担を大幅に軽減できます。
        </p>
        <p className="text-gray-700 mb-6">
          生前贈与や生命保険の活用など、<strong>早めの対策</strong>が節税のカギ。まずはシミュレーターで概算を把握しましょう。
        </p>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">遺産総額・相続人の数を入力して、相続税の概算をチェック</p>
          <Link href="/tax/inheritance-tax-calculator" className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 相続税シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/tax/inheritance-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">相続税シミュレーター</span>
            <p className="text-sm text-gray-600">遺産総額から相続税の概算を計算</p>
          </Link>
          <Link href="/tax/gift-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">贈与税計算機</span>
            <p className="text-sm text-gray-600">生前贈与の税額を計算</p>
          </Link>
          <Link href="/tax/furusato-nozei-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">ふるさと納税シミュレーター</span>
            <p className="text-sm text-gray-600">相続人自身の節税対策に</p>
          </Link>
          <Link href="/finance/retirement-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">老後資金シミュレーター</span>
            <p className="text-sm text-gray-600">相続と老後資金の両面で計画を</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。最新情報は国税庁の公式サイトでご確認ください。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/souzokuzei-simulation-2026" title="souzokuzei-simulation-2026" />
</article>
  );
}
