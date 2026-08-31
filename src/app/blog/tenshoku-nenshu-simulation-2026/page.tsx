import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";
import { BlogByline } from '@/components/BlogByline';

const title = "【2026年最新】転職で年収はいくら上がる？年収アップシミュレーション完全ガイド";
const description = "転職による年収アップの相場を徹底解説。20代は平均+50万円、30代は+80万円が目安。業界別・職種別の年収アップ率と、年収交渉のコツを紹介。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("転職で年収はいくら上がる？")}&type=blog&category=${encodeURIComponent("転職・キャリア")}`;

export const metadata: Metadata = {
  alternates: { canonical: "https://yamada-tools.jp/blog/tenshoku-nenshu-simulation-2026" },
  title, description,
  keywords: ["転職", "年収アップ", "シミュレーション", "年収交渉", "転職相場"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function TenshokuNenshuSimulation2026Blog() {
  return (
    <article className="max-w-[680px] mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】転職で年収はいくら上がる？年収アップシミュレーション完全ガイド",
            "description": "転職による年収アップの相場を徹底解説。20代は平均+50万円、30代は+80万円が目安。業界別・職種別の年収アップ率と、年収交渉のコツを紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/tenshoku-nenshu-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"転職回数が多いと年収に影響する？","acceptedAnswer":{"@type":"Answer","text":"3回程度なら大きな影響はなく、各社での成果を具体的に語れれば評価されます。"}},{"@type":"Question","name":"年収交渉でどのくらい上がる？","acceptedAnswer":{"@type":"Answer","text":"提示額から+30〜50万円が一般的な交渉成功ライン。根拠（他社オファー、市場相場）があれば+100万円も可能です。"}},{"@type":"Question","name":"転職エージェントは使うべき？","acceptedAnswer":{"@type":"Answer","text":"年収アップを狙うなら積極的に使うべきです。転職エージェントが持つ非公開求人は全体の約70%とも言われており、自力では見つけられない高年収ポジションにアクセスできます。また年収交渉をエージェントが代行することで、自己交渉より平均20〜50万円高い条件を引き出せるケースが多いです。"}},{"@type":"Question","name":"同業他社への転職は有利？","acceptedAnswer":{"@type":"Answer","text":"年収アップには最も有利。即戦力として評価され、競合の内情を知っていることも価値があります。ただし競業避止義務には注意。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>転職年収シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=転職で年収はいくら上がる？&type=blog&category=転職・キャリア" alt="転職年収シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】転職で年収はいくら上がる？年収アップシミュレーション完全ガイド</h1>
      <BlogByline />
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 年代別の転職による年収アップ相場</li>
          <li>✓ 業界・職種別の年収アップ率</li>
          <li>✓ 年収が上がりやすい転職パターン</li>
          <li>✓ 年収交渉を成功させるコツ</li>
          <li>✓ 転職で年収が下がるケース</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">転職で年収は本当に上がる？データで見る実態</h2>
        <p className="text-gray-700 mb-4">
          厚生労働省の調査によると、転職者の約<strong className="text-emerald-600">35〜40%が年収アップ</strong>を実現しています。
          一方で約30%は年収が下がり、残りは横ばいというのが実態です。
        </p>
        
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-emerald-800 text-xl mb-3">転職後の年収変化（全年代平均）</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-emerald-600">35-40%</p>
              <p className="text-sm text-gray-600">年収アップ</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-gray-600">25-30%</p>
              <p className="text-sm text-gray-600">横ばい</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-danger">30-35%</p>
              <p className="text-sm text-gray-600">年収ダウン</p>
            </div>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【年代別】転職による年収アップの相場</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">年代</th>
              <th className="px-4 py-3 text-left border-b font-semibold">平均年収アップ額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">アップ率</th>
              <th className="px-4 py-3 text-left border-b font-semibold">成功率</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">20代前半</td><td className="px-4 py-3 border-b text-emerald-600 font-bold">+30〜50万円</td><td className="px-4 py-3 border-b">+10〜15%</td><td className="px-4 py-3 border-b">45%</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">20代後半</td><td className="px-4 py-3 border-b text-emerald-600 font-bold">+50〜80万円</td><td className="px-4 py-3 border-b">+12〜18%</td><td className="px-4 py-3 border-b">50%</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">30代前半</td><td className="px-4 py-3 border-b text-emerald-600 font-bold">+60〜100万円</td><td className="px-4 py-3 border-b">+10〜15%</td><td className="px-4 py-3 border-b">45%</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">30代後半</td><td className="px-4 py-3 border-b text-emerald-600 font-bold">+50〜80万円</td><td className="px-4 py-3 border-b">+8〜12%</td><td className="px-4 py-3 border-b">38%</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">40代</td><td className="px-4 py-3 border-b text-emerald-600 font-bold">+30〜60万円</td><td className="px-4 py-3 border-b">+5〜10%</td><td className="px-4 py-3 border-b">30%</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 年収アップの黄金期は20代後半〜30代前半</p>
          <p className="text-gray-700">
            即戦力として評価されつつ、伸びしろも期待される年代。
            この時期に戦略的な転職をすることで、生涯年収に大きな差がつきます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【業界別】年収アップが狙いやすい転職先</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">業界</th>
              <th className="px-4 py-3 text-left border-b font-semibold">平均年収</th>
              <th className="px-4 py-3 text-left border-b font-semibold">年収アップ期待度</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">IT・Web</td><td className="px-4 py-3 border-b">550〜800万円</td><td className="px-4 py-3 border-b font-bold text-emerald-600">★★★★★</td></tr>
            <tr><td className="px-4 py-3 border-b">コンサルティング</td><td className="px-4 py-3 border-b">600〜1200万円</td><td className="px-4 py-3 border-b font-bold text-emerald-600">★★★★★</td></tr>
            <tr><td className="px-4 py-3 border-b">金融・保険</td><td className="px-4 py-3 border-b">500〜900万円</td><td className="px-4 py-3 border-b font-bold text-emerald-600">★★★★☆</td></tr>
            <tr><td className="px-4 py-3 border-b">メーカー</td><td className="px-4 py-3 border-b">450〜700万円</td><td className="px-4 py-3 border-b font-bold">★★★☆☆</td></tr>
            <tr><td className="px-4 py-3 border-b">医療・ヘルスケア</td><td className="px-4 py-3 border-b">400〜600万円</td><td className="px-4 py-3 border-b font-bold">★★★☆☆</td></tr>
            <tr><td className="px-4 py-3 border-b">小売・サービス</td><td className="px-4 py-3 border-b">350〜500万円</td><td className="px-4 py-3 border-b font-bold">★★☆☆☆</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの転職後年収を試算！</p>
          <p className="text-gray-700 mb-4">現在の年収・業界・スキルを入力して、転職後の想定年収を計算しましょう。</p>
          <Link href="/career/job-change-simulator" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 転職年収シミュレーターを使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">年収アップ転職を成功させる5つのコツ</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              市場価値を正確に把握する
            </h3>
            <p className="text-gray-700">転職サイトのスカウト機能や年収診断ツールを活用。自分の「市場価格」を知ることが交渉の第一歩。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              成長業界・企業を狙う
            </h3>
            <p className="text-gray-700">IT、DX推進、AI関連など成長分野は人材需要が高く、年収も上がりやすい傾向があります。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              希望年収は「現年収+20%」を基準に
            </h3>
            <p className="text-gray-700">転職で+20%アップは十分狙える範囲。低すぎる希望は自分の価値を下げてしまいます。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
              複数のオファーを獲得する
            </h3>
            <p className="text-gray-700">内定が複数あると交渉力が上がります。「他社からも内定をいただいている」は最強の交渉カード。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
              年収交渉は内定後に行う
            </h3>
            <p className="text-gray-700">面接中の年収交渉はNG。内定が出てから「条件面の相談」として交渉するのがベスト。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">転職で年収が下がる3つのパターン</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">❌ 未経験業界・職種へのキャリアチェンジ</h3>
            <p className="text-gray-700">経験が活かせない転職は、一時的に年収が下がることが多い。長期的なキャリア戦略として考えるべき。</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">❌ 焦って転職先を決める</h3>
            <p className="text-gray-700">「早く辞めたい」気持ちが先行すると、条件の悪い企業に決めてしまいがち。在職中の転職活動がベスト。</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">❌ 年収交渉をしない</h3>
            <p className="text-gray-700">提示された条件をそのまま受け入れると、本来得られるはずの年収を逃すことも。交渉は必ず行いましょう。</p>
          </div>
        </div>
      </section>

      <p className="text-gray-700 mb-4">20代の転職で平均50万円の年収アップというデータは、在職中から転職市場を意識する価値がいかに大きいかを示しているかもしれません。</p>



      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 転職回数が多いと年収に影響する？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>3回程度なら大きな影響はなく</strong>、各社での成果を具体的に語れれば評価されます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 年収交渉でどのくらい上がる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>提示額から+30〜50万円</strong>が一般的な交渉成功ライン。根拠（他社オファー、市場相場）があれば+100万円も可能です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 転職エージェントは使うべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>年収アップを狙うなら積極的に使うべき</strong>です。転職エージェントが持つ非公開求人は全体の約70%とも言われており、自力では見つけられない高年収ポジションにアクセスできます。また年収交渉をエージェントが代行することで、自己交渉より平均20〜50万円高い条件を引き出せるケースが多いです。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 同業他社への転職は有利？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>年収アップには最も有利</strong>。即戦力として評価され、競合の内情を知っていることも価値があります。ただし競業避止義務には注意。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：転職は「準備」が9割</h2>
        <p className="text-gray-700 mb-4">
          転職で年収アップを実現するには、自分の市場価値を把握し、成長業界を狙い、複数の内定を獲得して交渉力を高めることが重要です。
        </p>
        <p className="text-gray-700 mb-6">
          まずはシミュレーターで自分の転職後年収の目安を確認し、具体的な転職戦略を立てましょう。
        </p>
        
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの転職後年収をシミュレーション</p>
          <Link href="/career/job-change-simulator" className="inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 転職年収シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/job-change-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">転職年収シミュレーター</span>
            <p className="text-sm text-gray-600">転職後の想定年収を計算</p>
          </Link>
          <Link href="/career/salary-negotiation" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">年収交渉ツール</span>
            <p className="text-sm text-gray-600">交渉時の適正年収を診断</p>
          </Link>
          <Link href="/career/retirement-bonus-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">退職金計算機</span>
            <p className="text-sm text-gray-600">現職の退職金を試算</p>
          </Link>
          <Link href="/career/unemployment-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition">
            <span className="font-bold text-gray-800">失業保険計算機</span>
            <p className="text-sm text-gray-600">退職後の失業手当を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/tenshoku-nenshu-simulation-2026" title="tenshoku-nenshu-simulation-2026" />
</article>
  );
}
