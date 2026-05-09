import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】法人化シミュレーション｜個人事業主が会社設立すべき年収は？";
const description = "法人化のメリット・デメリットを徹底解説。個人事業主が法人成りすべき年収の目安、節税効果、社会保険料の変化をシミュレーション。設立費用と手続きも紹介。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("法人化シミュレーション")}&type=blog&category=${encodeURIComponent("ビジネス・起業")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["法人化", "法人成り", "個人事業主", "会社設立", "節税", "シミュレーション"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function HoujinkaSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】法人化シミュレーション｜個人事業主が会社設立すべき年収は？",
            "description": "法人化のメリット・デメリットを徹底解説。個人事業主が法人成りすべき年収の目安、節税効果、社会保険料の変化をシミュレーション。設立費用と手続きも紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/houjinka-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"法人化のベストタイミングは？","acceptedAnswer":{"@type":"Answer","text":"年の途中より1月か決算翌月がおすすめです。年の途中だと個人と法人の両方で確定申告が必要になり手間が増えます。"}},{"@type":"Question","name":"株式会社と合同会社、どちらを選ぶべき？","acceptedAnswer":{"@type":"Answer","text":"外部からの出資を受ける予定があるなら株式会社、1人または家族経営で費用を抑えたいなら合同会社がおすすめです。税務上の違いはありません。"}},{"@type":"Question","name":"資本金はいくらにすべき？","acceptedAnswer":{"@type":"Answer","text":"消費税免税のため1,000万円未満が基本。実務上は100万円〜300万円が多いです。ただし許認可事業では最低資本金が定められている場合があります。"}},{"@type":"Question","name":"法人化したら税理士は必須？","acceptedAnswer":{"@type":"Answer","text":"法律上は必須ではありませんが、実務上はほぼ必須です。法人税申告は複雑で、税理士なしでは節税機会を逃す可能性が高いです。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>法人化シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=法人化シミュレーション&type=blog&category=ビジネス・起業" alt="法人化シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】法人化シミュレーション｜個人事業主が会社設立すべき年収は？</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 法人化すべき年収・所得の目安</li>
          <li>✓ 個人事業主vs法人の税金比較</li>
          <li>✓ 法人化のメリット・デメリット</li>
          <li>✓ 会社設立の費用と手続き</li>
          <li>✓ 法人化後の節税テクニック</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">法人化すべき年収の目安</h2>
        <p className="text-gray-700 mb-4">
          一般的に<strong className="text-indigo-600">所得800万円〜1,000万円</strong>を超えると法人化のメリットが出てきます。
          ただし、業種や経費率、将来の事業計画によって異なります。
        </p>
        
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">法人化検討の目安チェックリスト</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-indigo-500 mr-3">☑</span>
              <p><strong>所得（売上−経費）が800万円以上</strong></p>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-500 mr-3">☑</span>
              <p><strong>売上1,000万円超で消費税課税事業者になる</strong></p>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-500 mr-3">☑</span>
              <p><strong>事業拡大・従業員雇用を予定している</strong></p>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-500 mr-3">☑</span>
              <p><strong>法人との取引で信用が必要</strong></p>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-500 mr-3">☑</span>
              <p><strong>社会保険に加入したい</strong></p>
            </div>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【年収別】個人事業主vs法人の税金比較</h2>
        <p className="text-gray-700 mb-4">所得別に個人事業主と法人（役員報酬で受け取る場合）の税負担を比較します。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">所得</th>
              <th className="px-3 py-3 text-right border-b font-semibold">個人事業主<br/><span className="text-xs font-normal">（所得税+住民税+国保）</span></th>
              <th className="px-3 py-3 text-right border-b font-semibold">法人<br/><span className="text-xs font-normal">（法人税+役員税+社保）</span></th>
              <th className="px-3 py-3 text-center border-b font-semibold">差額</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">500万円</td><td className="px-3 py-3 border-b text-right">約105万円</td><td className="px-3 py-3 border-b text-right">約115万円</td><td className="px-3 py-3 border-b text-center text-red-600">+10万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">700万円</td><td className="px-3 py-3 border-b text-right">約175万円</td><td className="px-3 py-3 border-b text-right">約170万円</td><td className="px-3 py-3 border-b text-center text-green-600">−5万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">800万円</td><td className="px-3 py-3 border-b text-right">約215万円</td><td className="px-3 py-3 border-b text-right">約195万円</td><td className="px-3 py-3 border-b text-center font-bold text-green-600">−20万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">1,000万円</td><td className="px-3 py-3 border-b text-right">約305万円</td><td className="px-3 py-3 border-b text-right">約260万円</td><td className="px-3 py-3 border-b text-center font-bold text-green-600">−45万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">1,500万円</td><td className="px-3 py-3 border-b text-right">約530万円</td><td className="px-3 py-3 border-b text-right">約420万円</td><td className="px-3 py-3 border-b text-center font-bold text-green-600">−110万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">2,000万円</td><td className="px-3 py-3 border-b text-right">約780万円</td><td className="px-3 py-3 border-b text-right">約600万円</td><td className="px-3 py-3 border-b text-center font-bold text-green-600">−180万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 ポイント</p>
          <p className="text-gray-700">
            所得700万円を超えると法人化のメリットが出始め、<strong>1,000万円以上</strong>で年間45万円以上の節税効果。
            ただし設立費用や税理士費用も考慮が必要です。
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの法人化メリットを計算！</p>
          <p className="text-gray-700 mb-4">年収と経費を入力して、法人化した場合の節税効果をシミュレーションしましょう。</p>
          <Link href="/business/incorporation-simulator" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 法人化シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">法人化のメリット</h2>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">1. 税率が有利になる</h3>
            <p className="text-gray-700 text-sm">個人の所得税は最大45%（住民税含め55%）ですが、法人税は最大約23%。所得が高いほど法人が有利です。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">2. 役員報酬で所得分散</h3>
            <p className="text-gray-700 text-sm">配偶者を役員にして報酬を分散すれば、世帯全体の税負担を軽減できます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">3. 経費の幅が広がる</h3>
            <p className="text-gray-700 text-sm">生命保険料、社宅、出張手当、退職金など、法人でのみ認められる経費が多数あります。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">4. 社会保険に加入できる</h3>
            <p className="text-gray-700 text-sm">厚生年金で将来の年金額アップ。健康保険は扶養家族も保険料なしでカバー。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">5. 信用力アップ</h3>
            <p className="text-gray-700 text-sm">法人格があると取引先からの信用度が上がり、融資も受けやすくなります。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">6. 消費税の免税期間</h3>
            <p className="text-gray-700 text-sm">資本金1,000万円未満で設立すれば、最大2年間消費税が免税になる場合があります。</p>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">法人化のデメリット</h2>
        
        <div className="space-y-4">
          <div className="bg-white border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-600 mb-2">1. 設立費用がかかる</h3>
            <p className="text-gray-700 text-sm">株式会社：約25万円、合同会社：約10万円。登記費用、定款認証などが必要です。</p>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-600 mb-2">2. 維持コストが発生</h3>
            <p className="text-gray-700 text-sm">赤字でも法人住民税の均等割（年7万円〜）、税理士費用（年20〜50万円）がかかります。</p>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-600 mb-2">3. 社会保険料の負担</h3>
            <p className="text-gray-700 text-sm">会社負担分が約15%。役員報酬が高いと国保より負担増になることも。</p>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-600 mb-2">4. 事務負担が増える</h3>
            <p className="text-gray-700 text-sm">決算書作成、法人税申告、社会保険手続きなど、事務作業が複雑になります。</p>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-600 mb-2">5. お金を自由に使えない</h3>
            <p className="text-gray-700 text-sm">会社のお金と個人のお金は完全に分離。個人で使うには役員報酬として受け取る必要があります。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">会社設立の費用比較</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">費用項目</th>
              <th className="px-4 py-3 text-right border-b font-semibold">株式会社</th>
              <th className="px-4 py-3 text-right border-b font-semibold">合同会社</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">定款認証手数料</td><td className="px-4 py-3 border-b text-right">3〜5万円</td><td className="px-4 py-3 border-b text-right">不要</td></tr>
            <tr><td className="px-4 py-3 border-b">定款印紙代</td><td className="px-4 py-3 border-b text-right">4万円（電子定款なら0円）</td><td className="px-4 py-3 border-b text-right">4万円（電子定款なら0円）</td></tr>
            <tr><td className="px-4 py-3 border-b">登録免許税</td><td className="px-4 py-3 border-b text-right">15万円〜</td><td className="px-4 py-3 border-b text-right">6万円〜</td></tr>
            <tr><td className="px-4 py-3 border-b">その他実費</td><td className="px-4 py-3 border-b text-right">約2万円</td><td className="px-4 py-3 border-b text-right">約2万円</td></tr>
            <tr className="bg-yellow-50 font-bold"><td className="px-4 py-3 border-b">合計</td><td className="px-4 py-3 border-b text-right text-indigo-600">約25万円</td><td className="px-4 py-3 border-b text-right text-indigo-600">約10万円</td></tr>
          </tbody>
        </table>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💰 合同会社がおすすめのケース</p>
          <p className="text-gray-700">
            ・1人または家族だけで経営<br/>
            ・外部からの資金調達予定がない<br/>
            ・設立費用を抑えたい<br/>
            ・BtoC（消費者向け）ビジネス
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">法人化後の節税テクニック</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">役員報酬の最適化</p>
            <p className="text-gray-700 text-sm">所得税・社会保険料のバランスを見て、最も手取りが多くなる金額に設定。</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">家族を役員に</p>
            <p className="text-gray-700 text-sm">配偶者や親族を役員にして報酬を分散。世帯全体の税負担を軽減。</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">社宅制度の活用</p>
            <p className="text-gray-700 text-sm">会社名義で住居を借り、家賃の一部を経費化。実質手取りアップ。</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">退職金の積立</p>
            <p className="text-gray-700 text-sm">小規模企業共済、法人保険で退職金を準備。掛金は経費、受取時は退職所得控除適用。</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">出張手当の支給</p>
            <p className="text-gray-700 text-sm">出張旅費規程を作成し、日当を支給。会社は経費、個人は非課税。</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-bold text-indigo-800 mb-2">決算期の調整</p>
            <p className="text-gray-700 text-sm">繁忙期を避けて決算期を設定。節税対策の時間を確保。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 法人化のベストタイミングは？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>年の途中より1月か決算翌月</strong>がおすすめです。年の途中だと個人と法人の両方で確定申告が必要になり手間が増えます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 株式会社と合同会社、どちらを選ぶべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">外部からの出資を受ける予定があるなら<strong>株式会社</strong>、1人または家族経営で費用を抑えたいなら<strong>合同会社</strong>がおすすめです。税務上の違いはありません。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 資本金はいくらにすべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">消費税免税のため<strong>1,000万円未満</strong>が基本。実務上は100万円〜300万円が多いです。ただし許認可事業では最低資本金が定められている場合があります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 法人化したら税理士は必須？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">法律上は必須ではありませんが、<strong>実務上はほぼ必須</strong>です。法人税申告は複雑で、税理士なしでは節税機会を逃す可能性が高いです。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：法人化の判断基準</h2>
        <p className="text-gray-700 mb-4">
          法人化は<strong>所得800万円〜1,000万円以上</strong>が目安ですが、数字だけでなく将来の事業計画、信用力、社会保険加入のニーズなども考慮しましょう。
        </p>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">法人化した場合の節税効果をシミュレーション</p>
          <Link href="/business/incorporation-simulator" className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 法人化シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/business/incorporation-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">法人化シミュレーター</span>
            <p className="text-sm text-gray-600">法人化の節税効果を試算</p>
          </Link>
          <Link href="/business/director-salary-optimizer" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">役員報酬最適化</span>
            <p className="text-sm text-gray-600">最適な役員報酬額を計算</p>
          </Link>
          <Link href="/business/corporate-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">法人税計算機</span>
            <p className="text-sm text-gray-600">法人税額をシミュレーション</p>
          </Link>
          <Link href="/business/freelance-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition">
            <span className="font-bold text-gray-800">フリーランス税金計算機</span>
            <p className="text-sm text-gray-600">個人事業主の税金を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の税制に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/houjinka-simulation-2026" title="houjinka-simulation-2026" />
</article>
  );
}
