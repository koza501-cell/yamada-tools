import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】生命保険の必要額シミュレーション｜家族構成別の目安と計算方法";
const description = "生命保険の必要保障額を徹底解説。家族構成・年収・住宅ローン別の目安、遺族年金との関係、保険料の相場。必要額シミュレーターで今すぐ計算。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("生命保険の必要額")}&type=blog&category=${encodeURIComponent("保険・ライフプラン")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["生命保険", "必要額", "シミュレーション", "遺族年金", "死亡保障", "保険金"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function SeimeiHokenSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】生命保険の必要額シミュレーション｜家族構成別の目安と計算方法",
            "description": "生命保険の必要保障額を徹底解説。家族構成・年収・住宅ローン別の目安、遺族年金との関係、保険料の相場。必要額シミュレーターで今すぐ計算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/seimei-hoken-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"共働きでも生命保険は必要？","acceptedAnswer":{"@type":"Answer","text":"はい、必要です。共働きでも、どちらかが亡くなると世帯収入は減少します。特に住宅ローンを組んでいる場合や子どもがいる場合は、それぞれが適切な保障を持つことが大切です。"}},{"@type":"Question","name":"子どもがいない夫婦の必要額は？","acceptedAnswer":{"@type":"Answer","text":"共働きなら500〜1,000万円程度が目安。片働きの場合は、配偶者が就労するまでの生活費として1,500〜2,500万円程度を検討しましょう。"}},{"@type":"Question","name":"保険の見直しタイミングは？","acceptedAnswer":{"@type":"Answer","text":"ライフイベント時に見直しましょう。結婚、出産、住宅購入、子どもの独立、転職など。特に子どもの成長に合わせて必要保障額は減少するので、保険料の節約ができます。"}},{"@type":"Question","name":"会社の団体保険だけで足りる？","acceptedAnswer":{"@type":"Answer","text":"会社の団体保険は退職すると失効します。また、保障額が不十分な場合も。転職リスクを考えると、個人で加入する保険との併用がおすすめです。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>生命保険必要額2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=生命保険の必要額&type=blog&category=保険・ライフプラン" alt="生命保険必要額シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】生命保険の必要額シミュレーション｜家族構成別の目安と計算方法</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 生命保険の必要額の計算方法</li>
          <li>✓ 家族構成・年収別の目安</li>
          <li>✓ 遺族年金でカバーできる金額</li>
          <li>✓ 住宅ローンと団信の関係</li>
          <li>✓ 保険料の相場と選び方</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">生命保険の必要額＝遺族の支出−遺族の収入</h2>
        <p className="text-gray-700 mb-4">
          生命保険の必要保障額は、万が一のときに<strong>遺族が必要とするお金</strong>から<strong>遺族が受け取れるお金</strong>を引いた差額です。
        </p>
        
        <div className="bg-white border-2 border-teal-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">必要保障額の計算式</h3>
          <div className="bg-teal-50 p-4 rounded-lg text-center mb-4">
            <p className="text-lg font-bold text-teal-700">
              必要保障額 ＝ 遺族の支出総額 − 遺族の収入総額
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-bold text-red-700 mb-2">遺族の支出（必要なお金）</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・生活費（食費、光熱費など）</li>
                <li>・住居費（家賃または住宅ローン）</li>
                <li>・子どもの教育費</li>
                <li>・葬儀・相続関連費用</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-bold text-green-700 mb-2">遺族の収入（入ってくるお金）</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・遺族年金（国から）</li>
                <li>・配偶者の収入</li>
                <li>・貯蓄・資産</li>
                <li>・死亡退職金</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【家族構成別】必要保障額の目安</h2>
        <p className="text-gray-700 mb-4">世帯主（会社員・年収500万円）が死亡した場合の目安です。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">家族構成</th>
              <th className="px-3 py-3 text-right border-b font-semibold">必要保障額</th>
              <th className="px-3 py-3 text-left border-b font-semibold">ポイント</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">独身</td><td className="px-3 py-3 border-b text-right font-bold text-teal-600">0〜500万円</td><td className="px-3 py-3 border-b text-sm">葬儀費用程度でOK</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">夫婦のみ（共働き）</td><td className="px-3 py-3 border-b text-right font-bold text-teal-600">500〜1,000万円</td><td className="px-3 py-3 border-b text-sm">配偶者の収入で生活可能</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">夫婦のみ（片働き）</td><td className="px-3 py-3 border-b text-right font-bold text-teal-600">1,500〜2,500万円</td><td className="px-3 py-3 border-b text-sm">配偶者の就労期間を考慮</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">子ども1人（0〜6歳）</td><td className="px-3 py-3 border-b text-right font-bold text-orange-600">3,000〜4,000万円</td><td className="px-3 py-3 border-b text-sm">教育費と生活費が長期間必要</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">子ども2人（0〜10歳）</td><td className="px-3 py-3 border-b text-right font-bold text-orange-600">4,000〜5,500万円</td><td className="px-3 py-3 border-b text-sm">教育費が2人分</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">子ども2人（高校生以上）</td><td className="px-3 py-3 border-b text-right font-bold text-teal-600">2,000〜3,000万円</td><td className="px-3 py-3 border-b text-sm">必要期間が短くなる</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 ポイント</p>
          <p className="text-gray-700">
            子どもが小さいほど必要保障額は<strong>高くなり</strong>、成長とともに<strong>減少</strong>していきます。
            定期的な見直しが重要です。
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの必要保障額を計算！</p>
          <p className="text-gray-700 mb-4">家族構成と収入を入力して、適切な保険金額をシミュレーションしましょう。</p>
          <Link href="/insurance/life-insurance-calculator" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 生命保険必要額計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">遺族年金でカバーできる金額</h2>
        <p className="text-gray-700 mb-4">
          会社員が亡くなった場合、遺族には<strong>遺族基礎年金</strong>と<strong>遺族厚生年金</strong>が支給されます。
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-teal-600 mb-2">遺族基礎年金（国民年金）</h3>
            <p className="text-gray-700 text-sm mb-2">18歳未満の子がいる配偶者または子に支給</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm"><strong>基本額：</strong>約81万円/年（2026年度）</p>
              <p className="text-sm"><strong>子の加算：</strong>1人目・2人目 各約23万円、3人目以降 各約7.7万円</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-teal-600 mb-2">遺族厚生年金（厚生年金）</h3>
            <p className="text-gray-700 text-sm mb-2">配偶者・子・父母・孫・祖父母に支給（優先順位あり）</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm"><strong>計算式：</strong>報酬比例部分の3/4</p>
              <p className="text-sm"><strong>目安：</strong>年収500万円で約50万円/年、年収800万円で約70万円/年</p>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-3">【年収別】遺族年金の受給額目安</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">年収</th>
              <th className="px-3 py-3 text-right border-b font-semibold">遺族厚生年金<br/><span className="text-xs font-normal">（年額）</span></th>
              <th className="px-3 py-3 text-right border-b font-semibold">子1人の場合<br/><span className="text-xs font-normal">（合計年額）</span></th>
              <th className="px-3 py-3 text-right border-b font-semibold">子2人の場合<br/><span className="text-xs font-normal">（合計年額）</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">400万円</td><td className="px-3 py-3 border-b text-right">約40万円</td><td className="px-3 py-3 border-b text-right">約144万円</td><td className="px-3 py-3 border-b text-right">約167万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">500万円</td><td className="px-3 py-3 border-b text-right">約50万円</td><td className="px-3 py-3 border-b text-right">約154万円</td><td className="px-3 py-3 border-b text-right">約177万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">600万円</td><td className="px-3 py-3 border-b text-right">約58万円</td><td className="px-3 py-3 border-b text-right">約162万円</td><td className="px-3 py-3 border-b text-right">約185万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">800万円</td><td className="px-3 py-3 border-b text-right">約70万円</td><td className="px-3 py-3 border-b text-right">約174万円</td><td className="px-3 py-3 border-b text-right">約197万円</td></tr>
          </tbody>
        </table>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">✅ 遺族年金の注意点</p>
          <p className="text-gray-700">
            ・子が18歳になると遺族基礎年金は終了<br/>
            ・子のいない30歳未満の妻は5年間のみ支給<br/>
            ・65歳以降は老齢年金との調整あり
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">住宅ローンと団体信用生命保険（団信）</h2>
        <p className="text-gray-700 mb-4">
          住宅ローンを組んでいる場合、多くは<strong>団体信用生命保険（団信）</strong>に加入しています。
          団信があれば、死亡時に住宅ローン残高がゼロになります。
        </p>
        
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-teal-800 mb-3">団信加入者の必要保障額計算</h3>
          <p className="text-gray-700 mb-3">
            団信に加入している場合、<strong>住宅ローン残高分は必要保障額から除外</strong>できます。
          </p>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm">
              <strong>例：</strong>住宅ローン残高3,000万円、団信加入<br/>
              → 必要保障額の計算から3,000万円を差し引ける<br/>
              → 生命保険の保険金額を抑えられる
            </p>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 賃貸住まいの場合</p>
          <p className="text-gray-700">
            賃貸の場合は住居費が継続して発生します。
            家賃×居住年数を必要保障額に含める必要があります。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">生命保険の種類と選び方</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-teal-600 mb-2">定期保険（掛け捨て）</h3>
            <p className="text-gray-700 text-sm mb-2">一定期間のみ保障。保険料が安い。子育て期間の保障に最適。</p>
            <p className="text-sm text-gray-500">保険料目安：30歳男性・死亡保障3,000万円で月額2,000〜4,000円</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-teal-600 mb-2">収入保障保険</h3>
            <p className="text-gray-700 text-sm mb-2">毎月一定額を遺族に支給。必要保障額が自動的に減少するので合理的。</p>
            <p className="text-sm text-gray-500">保険料目安：30歳男性・月額15万円保障で月額3,000〜5,000円</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-teal-600 mb-2">終身保険</h3>
            <p className="text-gray-700 text-sm mb-2">一生涯保障。貯蓄性あり。葬儀費用や相続対策に。保険料は高め。</p>
            <p className="text-sm text-gray-500">保険料目安：30歳男性・死亡保障500万円で月額8,000〜15,000円</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 おすすめの組み合わせ</p>
          <p className="text-gray-700">
            <strong>収入保障保険</strong>（子育て期間の大きな保障）＋<strong>終身保険</strong>（葬儀費用300〜500万円）の組み合わせがコスパ良好です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 共働きでも生命保険は必要？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>はい、必要です。</strong>共働きでも、どちらかが亡くなると世帯収入は減少します。特に住宅ローンを組んでいる場合や子どもがいる場合は、それぞれが適切な保障を持つことが大切です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 子どもがいない夫婦の必要額は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">共働きなら<strong>500〜1,000万円</strong>程度が目安。片働きの場合は、配偶者が就労するまでの生活費として<strong>1,500〜2,500万円</strong>程度を検討しましょう。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 保険の見直しタイミングは？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>ライフイベント時</strong>に見直しましょう。結婚、出産、住宅購入、子どもの独立、転職など。特に子どもの成長に合わせて必要保障額は減少するので、保険料の節約ができます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 会社の団体保険だけで足りる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">会社の団体保険は<strong>退職すると失効</strong>します。また、保障額が不十分な場合も。転職リスクを考えると、個人で加入する保険との併用がおすすめです。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：適切な保障額で家族を守る</h2>
        <p className="text-gray-700 mb-4">
          生命保険の必要額は「遺族の支出−遺族の収入」で計算します。
          遺族年金や団信を考慮し、<strong>過不足のない保障</strong>を設計しましょう。
        </p>
        
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたに必要な保障額をシミュレーション</p>
          <Link href="/insurance/life-insurance-calculator" className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 生命保険必要額計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/insurance/life-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">生命保険必要額計算機</span>
            <p className="text-sm text-gray-600">必要保障額をシミュレーション</p>
          </Link>
          <Link href="/insurance/medical-insurance-sim" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">医療保険シミュレーター</span>
            <p className="text-sm text-gray-600">医療保険の必要性を診断</p>
          </Link>
          <Link href="/finance/retirement-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">老後資金シミュレーター</span>
            <p className="text-sm text-gray-600">老後に必要な資金を計算</p>
          </Link>
          <Link href="/finance/jutaku-loan" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition">
            <span className="font-bold text-gray-800">住宅ローン計算機</span>
            <p className="text-sm text-gray-600">住宅ローンの返済額を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の制度に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/seimei-hoken-simulation-2026" title="seimei-hoken-simulation-2026" />
</article>
  );
}
