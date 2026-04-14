import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import Link from "next/link";

const title = "【2026年最新】教育費シミュレーション｜幼稚園から大学までいくらかかる？";
const description = "子どもの教育費を徹底解説。幼稚園・小学校・中学校・高校・大学の公立/私立別費用、学費の準備方法、教育費を抑えるコツ。シミュレーターで今すぐ計算。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("教育費シミュレーション")}&type=blog&category=${encodeURIComponent("教育・子育て")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["教育費", "学費", "シミュレーション", "大学", "私立", "公立"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function KyouikuhiSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】教育費シミュレーション｜幼稚園から大学までいくらかかる？",
            "description": "子どもの教育費を徹底解説。幼稚園・小学校・中学校・高校・大学の公立/私立別費用、学費の準備方法、教育費を抑えるコツ。シミュレーターで今すぐ計算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/kyouikuhi-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"教育費の準備はいつから始めるべき？","acceptedAnswer":{"@type":"Answer","text":"子どもが生まれたらすぐに始めるのが理想です。18年間で準備できれば月々の負担は軽くなります。大学入学までに500万円を目指すなら月2.3万円の積立が目安。"}},{"@type":"Question","name":"奨学金は借りるべき？","acceptedAnswer":{"@type":"Answer","text":"給付型（返済不要）は積極的に活用すべきです。貸与型は第一種（無利子）を優先し、第二種（有利子）は慎重に。卒業後の返済負担も考慮しましょう。"}},{"@type":"Question","name":"学資保険と新NISA、どちらがいい？","acceptedAnswer":{"@type":"Answer","text":"学資保険は死亡保障付きで確実、新NISAはリターンが期待できるが元本割れリスクあり。両方を組み合わせるか、リスク許容度で選びましょう。"}},{"@type":"Question","name":"私立中学に行かせる年収の目安は？","acceptedAnswer":{"@type":"Answer","text":"一般的に世帯年収800万円以上が目安とされています。ただし兄弟の有無や住宅ローンの有無によっても変わります。教育費が収入の10〜15%以内に収まるかがポイント。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>教育費シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=教育費シミュレーション&type=blog&category=教育・子育て" alt="教育費シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】教育費シミュレーション｜幼稚園から大学までいくらかかる？</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 幼稚園から大学までの教育費総額</li>
          <li>✓ 公立vs私立の費用比較</li>
          <li>✓ 学校外活動費（塾・習い事）の目安</li>
          <li>✓ 教育費の準備方法と節約術</li>
          <li>✓ 奨学金・教育ローンの選び方</li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">教育費の総額：オール公立vs私立</h2>
        <p className="text-gray-700 mb-4">
          子ども1人にかかる教育費は、進路によって<strong>800万円〜2,500万円</strong>と大きく変わります。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">進路パターン</th>
              <th className="px-3 py-3 text-right border-b font-semibold">教育費総額</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">オール公立（幼〜大学）</td><td className="px-3 py-3 border-b text-right font-bold text-emerald-600">約800万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">小学校のみ私立</td><td className="px-3 py-3 border-b text-right">約1,100万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">中学から私立</td><td className="px-3 py-3 border-b text-right">約1,400万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">高校から私立</td><td className="px-3 py-3 border-b text-right">約1,000万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">オール私立（幼〜大学文系）</td><td className="px-3 py-3 border-b text-right font-bold text-orange-600">約2,200万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">オール私立（幼〜大学理系）</td><td className="px-3 py-3 border-b text-right font-bold text-red-600">約2,500万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 ポイント</p>
          <p className="text-gray-700">
            最も費用がかかるのは<strong>大学の4年間</strong>です。
            私立理系・医歯薬系は特に高額になるため、早めの準備が重要です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【学校別】教育費の内訳</h2>
        
        <h3 className="font-bold text-lg text-gray-800 mb-3">幼稚園（3年間）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">区分</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年間費用</th>
              <th className="px-4 py-3 text-right border-b font-semibold">3年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">公立</td><td className="px-4 py-3 border-b text-right">約17万円</td><td className="px-4 py-3 border-b text-right font-bold text-emerald-600">約50万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立</td><td className="px-4 py-3 border-b text-right">約31万円</td><td className="px-4 py-3 border-b text-right font-bold text-orange-600">約93万円</td></tr>
          </tbody>
        </table>

        <h3 className="font-bold text-lg text-gray-800 mb-3">小学校（6年間）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">区分</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年間費用</th>
              <th className="px-4 py-3 text-right border-b font-semibold">6年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">公立</td><td className="px-4 py-3 border-b text-right">約35万円</td><td className="px-4 py-3 border-b text-right font-bold text-emerald-600">約210万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立</td><td className="px-4 py-3 border-b text-right">約167万円</td><td className="px-4 py-3 border-b text-right font-bold text-orange-600">約1,000万円</td></tr>
          </tbody>
        </table>

        <h3 className="font-bold text-lg text-gray-800 mb-3">中学校（3年間）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">区分</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年間費用</th>
              <th className="px-4 py-3 text-right border-b font-semibold">3年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">公立</td><td className="px-4 py-3 border-b text-right">約54万円</td><td className="px-4 py-3 border-b text-right font-bold text-emerald-600">約162万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立</td><td className="px-4 py-3 border-b text-right">約144万円</td><td className="px-4 py-3 border-b text-right font-bold text-orange-600">約430万円</td></tr>
          </tbody>
        </table>

        <h3 className="font-bold text-lg text-gray-800 mb-3">高校（3年間）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">区分</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年間費用</th>
              <th className="px-4 py-3 text-right border-b font-semibold">3年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">公立</td><td className="px-4 py-3 border-b text-right">約51万円</td><td className="px-4 py-3 border-b text-right font-bold text-emerald-600">約154万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立</td><td className="px-4 py-3 border-b text-right">約105万円</td><td className="px-4 py-3 border-b text-right font-bold text-orange-600">約315万円</td></tr>
          </tbody>
        </table>

        <h3 className="font-bold text-lg text-gray-800 mb-3">大学（4年間）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">区分</th>
              <th className="px-4 py-3 text-right border-b font-semibold">入学金</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年間授業料</th>
              <th className="px-4 py-3 text-right border-b font-semibold">4年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">国公立</td><td className="px-4 py-3 border-b text-right">約28万円</td><td className="px-4 py-3 border-b text-right">約54万円</td><td className="px-4 py-3 border-b text-right font-bold text-emerald-600">約250万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立文系</td><td className="px-4 py-3 border-b text-right">約23万円</td><td className="px-4 py-3 border-b text-right">約82万円</td><td className="px-4 py-3 border-b text-right font-bold text-orange-600">約400万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立理系</td><td className="px-4 py-3 border-b text-right">約25万円</td><td className="px-4 py-3 border-b text-right">約114万円</td><td className="px-4 py-3 border-b text-right font-bold text-red-600">約550万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">私立医歯薬系</td><td className="px-4 py-3 border-b text-right">約100万円</td><td className="px-4 py-3 border-b text-right">約300万円</td><td className="px-4 py-3 border-b text-right font-bold text-red-600">約2,000万円</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの教育費を計算！</p>
          <p className="text-gray-700 mb-4">子どもの人数と進路を選んで、必要な教育費をシミュレーションしましょう。</p>
          <Link href="/education/education-cost-simulator" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 教育費シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">学校外活動費（塾・習い事）</h2>
        <p className="text-gray-700 mb-4">
          上記の学費に加え、塾や習い事の費用も考慮が必要です。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">学年</th>
              <th className="px-4 py-3 text-right border-b font-semibold">公立の場合</th>
              <th className="px-4 py-3 text-right border-b font-semibold">私立の場合</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">小学生</td><td className="px-4 py-3 border-b text-right">約25万円/年</td><td className="px-4 py-3 border-b text-right">約66万円/年</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">中学生</td><td className="px-4 py-3 border-b text-right">約37万円/年</td><td className="px-4 py-3 border-b text-right">約33万円/年</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">高校生</td><td className="px-4 py-3 border-b text-right">約18万円/年</td><td className="px-4 py-3 border-b text-right">約26万円/年</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 中学受験の塾費用</p>
          <p className="text-gray-700">
            中学受験を目指す場合、小4〜6年の3年間で<strong>塾代だけで200〜300万円</strong>かかることも。
            進学塾の月謝は4〜8万円が相場です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">教育費の準備方法</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-emerald-600 mb-2">1. 学資保険</h3>
            <p className="text-gray-700 text-sm">契約者（親）に万が一のことがあっても保険料払込免除で満期金を受け取れる。返戻率は100〜105%程度。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-emerald-600 mb-2">2. 新NISA（つみたて投資枠）</h3>
            <p className="text-gray-700 text-sm">非課税で運用可能。長期投資でリターンが期待できるが元本割れリスクあり。15年以上の時間があるなら有力な選択肢。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-emerald-600 mb-2">3. 定期預金・積立預金</h3>
            <p className="text-gray-700 text-sm">元本保証で安心。ただし金利は低いので、インフレには負ける可能性あり。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-emerald-600 mb-2">4. 財形貯蓄（勤労者財産形成促進制度）</h3>
            <p className="text-gray-700 text-sm">給与天引きで強制的に貯蓄。会社によっては奨励金が出ることも。</p>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">✅ おすすめの組み合わせ</p>
          <p className="text-gray-700">
            <strong>学資保険</strong>（死亡保障付きで確実な資金確保）＋<strong>新NISA</strong>（余裕資金で運用）の組み合わせがバランス良好です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">教育費を抑える方法</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-bold text-emerald-800 mb-2">高等学校等就学支援金</p>
            <p className="text-gray-700 text-sm">年収約910万円未満の世帯は高校授業料が実質無償化。私立は最大39.6万円/年の支援。</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-bold text-emerald-800 mb-2">大学の授業料減免制度</p>
            <p className="text-gray-700 text-sm">住民税非課税世帯は国公立大学の授業料が全額免除。私立も約70万円減免。</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-bold text-emerald-800 mb-2">給付型奨学金</p>
            <p className="text-gray-700 text-sm">返済不要の奨学金。日本学生支援機構（JASSO）や各大学の独自制度を活用。</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-bold text-emerald-800 mb-2">特待生制度</p>
            <p className="text-gray-700 text-sm">成績優秀者は授業料全額〜半額免除の学校も。入試成績で決まることが多い。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 教育費の準備はいつから始めるべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>子どもが生まれたらすぐに</strong>始めるのが理想です。18年間で準備できれば月々の負担は軽くなります。大学入学までに500万円を目指すなら月2.3万円の積立が目安。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 奨学金は借りるべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">給付型（返済不要）は積極的に活用すべきです。貸与型は<strong>第一種（無利子）を優先</strong>し、第二種（有利子）は慎重に。卒業後の返済負担も考慮しましょう。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 学資保険と新NISA、どちらがいい？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">学資保険は<strong>死亡保障付きで確実</strong>、新NISAは<strong>リターンが期待できるが元本割れリスクあり</strong>。両方を組み合わせるか、リスク許容度で選びましょう。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 私立中学に行かせる年収の目安は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">一般的に<strong>世帯年収800万円以上</strong>が目安とされています。ただし兄弟の有無や住宅ローンの有無によっても変わります。教育費が収入の10〜15%以内に収まるかがポイント。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：早めの準備と制度活用がカギ</h2>
        <p className="text-gray-700 mb-4">
          教育費は進路によって800万〜2,500万円と大きく変わります。
          <strong>早めに準備を始め、公的支援制度を活用</strong>することで負担を軽減できます。
        </p>
        
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">お子さまの教育費をシミュレーション</p>
          <Link href="/education/education-cost-simulator" className="inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 教育費シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/education/education-cost-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">教育費シミュレーター</span>
            <p className="text-sm text-gray-600">進路別の教育費を計算</p>
          </Link>
          <Link href="/education/cram-school-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">塾費用計算機</span>
            <p className="text-sm text-gray-600">塾・習い事の費用を計算</p>
          </Link>
          <Link href="/finance/nisa-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">新NISAシミュレーター</span>
            <p className="text-sm text-gray-600">非課税で教育資金を運用</p>
          </Link>
          <Link href="/insurance/life-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">生命保険必要額計算機</span>
            <p className="text-sm text-gray-600">教育費を含めた必要保障額</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の制度に基づいています。</p>
    </article>
  );
}
