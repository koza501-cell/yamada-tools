import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";
import { BlogByline } from '@/components/BlogByline';

const title = "【2026年最新】退職金の計算方法と相場｜勤続年数別シミュレーション完全ガイド";
const description = "退職金の計算方法を徹底解説。勤続20年で約800万円、30年で約1,500万円が目安。退職所得控除の計算、税金の仕組み、もらえない場合の対処法まで網羅。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("退職金の計算方法と相場")}&type=blog&category=${encodeURIComponent("転職・キャリア")}`;

export const metadata: Metadata = {
  alternates: { canonical: "https://yamada-tools.jp/blog/taishokukin-simulation-2026" },
  title, description,
  keywords: ["退職金", "計算", "シミュレーション", "相場", "勤続年数", "税金"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function TaishokukinSimulation2026Blog() {
  return (
    <article className="max-w-[680px] mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】退職金の計算方法と相場｜勤続年数別シミュレーション完全ガイド",
            "description": "退職金の計算方法を徹底解説。勤続20年で約800万円、30年で約1,500万円が目安。退職所得控除の計算、税金の仕組み、もらえない場合の対処法まで網羅。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/taishokukin-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"退職金はいつもらえる？","acceptedAnswer":{"@type":"Answer","text":"退職後1〜2ヶ月以内が一般的。就業規則に「退職後◯日以内に支払う」と定められていることが多いです。"}},{"@type":"Question","name":"退職金がもらえない場合は？","acceptedAnswer":{"@type":"Answer","text":"就業規則を確認しましょう。退職金制度がない会社では請求できません。制度があるのに支払われない場合は労基署に相談を。"}},{"@type":"Question","name":"懲戒解雇だと退職金は？","acceptedAnswer":{"@type":"Answer","text":"減額または不支給になることが多いです。ただし、就業規則の規定によります。全額不支給は違法になる場合も。"}},{"@type":"Question","name":"転職先に退職金を持ち越せる？","acceptedAnswer":{"@type":"Answer","text":"企業型DCの場合は可能。転職先にDC制度があれば移換できます。確定給付型は通常持ち越せません。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>退職金シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=退職金の計算方法と相場&type=blog&category=転職・キャリア" alt="退職金シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】退職金の計算方法と相場｜勤続年数別シミュレーション完全ガイド</h1>
      <BlogByline />
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-gray-50 border-l-4 border-gray-200 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 退職金の計算方法（基本給連動型・ポイント制）</li>
          <li>✓ 勤続年数別の退職金相場</li>
          <li>✓ 退職所得控除と税金の計算</li>
          <li>✓ 退職金がもらえない場合の対処法</li>
          <li>✓ 退職金の受け取り方（一時金 vs 年金）</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">退職金とは？もらえる人・もらえない人</h2>
        <p className="text-gray-700 mb-4">
          退職金は、会社を退職する際に支払われるお金です。<strong className="text-kon">法律で支給が義務付けられているわけではなく</strong>、
          会社の就業規則や退職金規程で定められている場合にのみ支払われます。
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">退職金がある会社</h3>
            <ul className="text-gray-700 space-y-1">
              <li>✓ 大企業（従業員1000人以上）：約90%</li>
              <li>✓ 中企業（100〜999人）：約85%</li>
              <li>✓ 小企業（30〜99人）：約75%</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">退職金がない場合が多い</h3>
            <ul className="text-gray-700 space-y-1">
              <li>✗ スタートアップ・ベンチャー</li>
              <li>✗ 外資系企業（年俸に含む）</li>
              <li>✗ 小規模事業者（30人未満）</li>
            </ul>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【勤続年数別】退職金の相場</h2>
        <p className="text-gray-700 mb-4">大学卒・総合職の場合の退職金相場です（自己都合退職）。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">勤続年数</th>
              <th className="px-4 py-3 text-left border-b font-semibold">退職金相場（自己都合）</th>
              <th className="px-4 py-3 text-left border-b font-semibold">会社都合の場合</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">3年</td><td className="px-4 py-3 border-b font-bold">約30〜50万円</td><td className="px-4 py-3 border-b">約50〜80万円</td></tr>
            <tr><td className="px-4 py-3 border-b">5年</td><td className="px-4 py-3 border-b font-bold">約80〜150万円</td><td className="px-4 py-3 border-b">約120〜200万円</td></tr>
            <tr><td className="px-4 py-3 border-b">10年</td><td className="px-4 py-3 border-b font-bold">約250〜400万円</td><td className="px-4 py-3 border-b">約350〜500万円</td></tr>
            <tr><td className="px-4 py-3 border-b">15年</td><td className="px-4 py-3 border-b font-bold">約500〜700万円</td><td className="px-4 py-3 border-b">約650〜900万円</td></tr>
            <tr><td className="px-4 py-3 border-b">20年</td><td className="px-4 py-3 border-b font-bold text-kon">約800〜1,100万円</td><td className="px-4 py-3 border-b">約1,000〜1,400万円</td></tr>
            <tr><td className="px-4 py-3 border-b">25年</td><td className="px-4 py-3 border-b font-bold text-kon">約1,200〜1,600万円</td><td className="px-4 py-3 border-b">約1,500〜2,000万円</td></tr>
            <tr><td className="px-4 py-3 border-b">30年</td><td className="px-4 py-3 border-b font-bold text-kon">約1,500〜2,000万円</td><td className="px-4 py-3 border-b">約1,800〜2,500万円</td></tr>
            <tr><td className="px-4 py-3 border-b">定年（35年〜）</td><td className="px-4 py-3 border-b font-bold text-kon">約2,000〜2,500万円</td><td className="px-4 py-3 border-b">-</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 自己都合 vs 会社都合</p>
          <p className="text-gray-700">
            会社都合退職（リストラ、倒産など）は自己都合より<strong>20〜30%高い</strong>のが一般的。
            退職勧奨を受けた場合は「会社都合」扱いになるか確認しましょう。
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの退職金を試算！</p>
          <p className="text-gray-700 mb-4">勤続年数・基本給・退職事由を入力して、退職金の概算額を計算しましょう。</p>
          <Link href="/career/retirement-bonus-calculator" className="inline-block bg-kon hover:bg-kon text-white font-bold py-3 px-6 rounded-lg transition">
            → 退職金シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">退職金の計算方法</h2>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-3">① 基本給連動型（最も一般的）</h3>
            <div className="bg-gray-50 rounded p-4 mb-3">
              <p className="font-mono text-center text-lg">退職金 = 退職時の基本給 × 勤続年数係数 × 退職事由係数</p>
            </div>
            <p className="text-gray-700">例：基本給30万円、勤続20年（係数20）、自己都合（係数0.8）の場合</p>
            <p className="text-kon font-bold">→ 30万円 × 20 × 0.8 = 480万円</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-3">② ポイント制</h3>
            <div className="bg-gray-50 rounded p-4 mb-3">
              <p className="font-mono text-center text-lg">退職金 = 累積ポイント × ポイント単価</p>
            </div>
            <p className="text-gray-700">毎年、等級や役職に応じたポイントが付与され、退職時に精算。成果主義の企業で増加中。</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-3">③ 別テーブル方式</h3>
            <p className="text-gray-700">勤続年数ごとに退職金額を定めた表を参照。中小企業で多い方式。</p>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">退職金の税金と退職所得控除</h2>
        <p className="text-gray-700 mb-4">
          退職金には<strong className="text-kon">退職所得控除</strong>という大きな非課税枠があり、税金面で優遇されています。
        </p>
        
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-kon text-xl mb-3">退職所得控除額の計算</h3>
          <table className="min-w-full mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left border-b font-semibold">勤続年数</th>
                <th className="px-4 py-2 text-left border-b font-semibold">控除額</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-4 py-2 border-b">20年以下</td><td className="px-4 py-2 border-b font-bold">40万円 × 勤続年数</td></tr>
              <tr><td className="px-4 py-2 border-b">20年超</td><td className="px-4 py-2 border-b font-bold">800万円 + 70万円 ×（勤続年数 − 20年）</td></tr>
            </tbody>
          </table>
          <div className="bg-gray-50 rounded p-4">
            <p className="font-bold mb-2">具体例：勤続25年の場合</p>
            <p className="text-gray-700">800万円 + 70万円 ×（25年 − 20年）= <strong className="text-kon">1,150万円</strong>が非課税</p>
          </div>
        </div>

        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">勤続年数</th>
              <th className="px-4 py-3 text-left border-b font-semibold">退職所得控除額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">この金額まで非課税</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">10年</td><td className="px-4 py-3 border-b font-bold">400万円</td><td className="px-4 py-3 border-b text-green-600">退職金400万円まで税金0円</td></tr>
            <tr><td className="px-4 py-3 border-b">20年</td><td className="px-4 py-3 border-b font-bold">800万円</td><td className="px-4 py-3 border-b text-green-600">退職金800万円まで税金0円</td></tr>
            <tr><td className="px-4 py-3 border-b">25年</td><td className="px-4 py-3 border-b font-bold">1,150万円</td><td className="px-4 py-3 border-b text-green-600">退職金1,150万円まで税金0円</td></tr>
            <tr><td className="px-4 py-3 border-b">30年</td><td className="px-4 py-3 border-b font-bold">1,500万円</td><td className="px-4 py-3 border-b text-green-600">退職金1,500万円まで税金0円</td></tr>
            <tr><td className="px-4 py-3 border-b">35年</td><td className="px-4 py-3 border-b font-bold">1,850万円</td><td className="px-4 py-3 border-b text-green-600">退職金1,850万円まで税金0円</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">退職金の受け取り方：一時金 vs 年金</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">比較項目</th>
              <th className="px-4 py-3 text-left border-b font-semibold">一時金</th>
              <th className="px-4 py-3 text-left border-b font-semibold">年金</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">税金</td><td className="px-4 py-3 border-b text-green-600 font-bold">退職所得控除で優遇</td><td className="px-4 py-3 border-b">雑所得として毎年課税</td></tr>
            <tr><td className="px-4 py-3 border-b">総受取額</td><td className="px-4 py-3 border-b">確定</td><td className="px-4 py-3 border-b text-green-600 font-bold">運用益で増える可能性</td></tr>
            <tr><td className="px-4 py-3 border-b">社会保険料</td><td className="px-4 py-3 border-b text-green-600 font-bold">影響なし</td><td className="px-4 py-3 border-b">国保・介護保険料に影響</td></tr>
            <tr><td className="px-4 py-3 border-b">資金管理</td><td className="px-4 py-3 border-b">自己管理が必要</td><td className="px-4 py-3 border-b text-green-600 font-bold">定期的に受け取れる</td></tr>
          </tbody>
        </table>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 多くの専門家は「一時金」を推奨</p>
          <p className="text-gray-700">
            退職所得控除のメリットが大きく、税金面では一時金が有利なケースが多いです。
            ただし、資金管理に不安がある場合は年金も検討を。
          </p>
        </div>
      </section>

      <p className="text-gray-700 mb-4">勤続30年で退職金が1,500万円でも、退職所得控除をうまく使えば税負担が驚くほど低くなるかもしれません。</p>



      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 退職金はいつもらえる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>退職後1〜2ヶ月以内</strong>が一般的。就業規則に「退職後◯日以内に支払う」と定められていることが多いです。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 退職金がもらえない場合は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>就業規則を確認</strong>しましょう。退職金制度がない会社では請求できません。制度があるのに支払われない場合は労基署に相談を。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 懲戒解雇だと退職金は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>減額または不支給</strong>になることが多いです。ただし、就業規則の規定によります。全額不支給は違法になる場合も。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 転職先に退職金を持ち越せる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>企業型DCの場合は可能</strong>。転職先にDC制度があれば移換できます。確定給付型は通常持ち越せません。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：退職金は「見える化」が大切</h2>
        <p className="text-gray-700 mb-4">
          退職金は勤続年数や退職事由によって大きく変わります。
          転職や退職を考える前に、まず自分の退職金がいくらになるか把握しておくことが重要です。
        </p>
        <p className="text-gray-700 mb-6">
          シミュレーターで概算を確認し、ライフプランに組み込みましょう。
        </p>
        
        <div className="bg-gradient-to-r from-slate-900 to-kon text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの退職金をシミュレーション</p>
          <Link href="/career/retirement-bonus-calculator" className="inline-block bg-white text-kon font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 退職金シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/retirement-bonus-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">退職金シミュレーター</span>
            <p className="text-sm text-gray-600">勤続年数から退職金を計算</p>
          </Link>
          <Link href="/career/unemployment-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">失業保険計算機</span>
            <p className="text-sm text-gray-600">退職後の失業手当を計算</p>
          </Link>
          <Link href="/career/job-change-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">転職年収シミュレーター</span>
            <p className="text-sm text-gray-600">転職後の年収を試算</p>
          </Link>
          <Link href="/blog/rougo-shikin-simulation-2026" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">老後資金シミュレーター</span>
            <p className="text-sm text-gray-600">退職金を含めた老後資金を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/taishokukin-simulation-2026" title="taishokukin-simulation-2026" />
</article>
  );
}
