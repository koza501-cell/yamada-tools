import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";
import { BlogByline } from '@/components/BlogByline';

const title = "【2026年最新】残業代の計算方法｜時給換算・割増率・未払い請求まで完全解説";
const description = "残業代の正しい計算方法を徹底解説。基本給からの時給換算、25%・35%・50%の割増率、深夜・休日の計算例。未払い残業代の請求方法も紹介。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("残業代の計算方法")}&type=blog&category=${encodeURIComponent("給与・労働")}`;

export const metadata: Metadata = {
  alternates: { canonical: "https://yamada-tools.jp/blog/zangyoudai-keisan-simulation-2026" },
  title, description,
  keywords: ["残業代", "計算", "時給", "割増", "未払い", "請求"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ZangyoudaiKeisanSimulation2026Blog() {
  return (
    <article className="max-w-[680px] mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】残業代の計算方法｜時給換算・割増率・未払い請求まで完全解説",
            "description": "残業代の正しい計算方法を徹底解説。基本給からの時給換算、25%・35%・50%の割増率、深夜・休日の計算例。未払い残業代の請求方法も紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/zangyoudai-keisan-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"固定残業代（みなし残業）の場合は？","acceptedAnswer":{"@type":"Answer","text":"固定残業代を超えた分は別途支払いが必要です。例えば「月30時間分の固定残業代」が含まれている場合、31時間目以降は追加で残業代が発生します。"}},{"@type":"Question","name":"管理職でも残業代はもらえる？","acceptedAnswer":{"@type":"Answer","text":"「名ばかり管理職」なら残業代の対象です。労働基準法の「管理監督者」に該当するには、経営に関する決定権、出退勤の自由、相応の待遇が必要。実態がなければ請求可能です。"}},{"@type":"Question","name":"休日出勤と残業の違いは？","acceptedAnswer":{"@type":"Answer","text":"法定休日（週1日）の出勤は35%割増。それ以外の休日（所定休日）は通常の時間外労働として25%割増が適用されます。会社の就業規則で法定休日がいつか確認しましょう。"}},{"@type":"Question","name":"サービス残業は違法？","acceptedAnswer":{"@type":"Answer","text":"違法です。労働した時間に対して賃金を支払わないのは労働基準法違反。会社には是正勧告や罰則が科される可能性があります。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>残業代計算2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("残業代の計算方法")}&type=blog&category=${encodeURIComponent("給与・労働")}`} alt="残業代計算" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】残業代の計算方法｜時給換算・割増率・未払い請求まで完全解説</h1>
      <BlogByline />
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-gray-50 border-l-4 border-gray-200 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 残業代の基本的な計算方法</li>
          <li>✓ 時給の正しい換算方法</li>
          <li>✓ 割増率25%・35%・50%・60%の適用条件</li>
          <li>✓ 深夜・休日残業の計算例</li>
          <li>✓ 未払い残業代の請求方法</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">残業代の基本公式</h2>
        <p className="text-gray-700 mb-4">
          残業代は以下の計算式で求められます。
        </p>
        
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <div className="bg-gray-50 rounded p-4 text-center">
            <p className="text-2xl font-bold text-kon mb-2">残業代 = 1時間あたりの賃金 × 割増率 × 残業時間</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">1時間あたりの賃金</p>
            <p className="text-lg font-bold">月給 ÷ 月平均所定労働時間</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">割増率</p>
            <p className="text-lg font-bold">1.25〜1.60</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">残業時間</p>
            <p className="text-lg font-bold">法定労働時間超の時間</p>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">1時間あたりの賃金（時給換算）の計算</h2>
        <p className="text-gray-700 mb-4">
          月給制の場合、以下の手順で1時間あたりの賃金を計算します。
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">計算例：月給25万円の場合</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span>基本給 + 諸手当（除外手当を除く）</span>
              <span className="font-bold">250,000円</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>年間所定労働日数</span>
              <span className="font-bold">250日</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>1日の所定労働時間</span>
              <span className="font-bold">8時間</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>月平均所定労働時間（250日×8時間÷12ヶ月）</span>
              <span className="font-bold">166.7時間</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <span className="font-bold">1時間あたりの賃金</span>
              <span className="font-bold text-kon text-xl">約1,500円</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-l-4 border-danger p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 除外される手当</p>
          <p className="text-gray-700">
            以下の手当は残業代の計算基礎に含めません：<br />
            <strong>家族手当、通勤手当、別居手当、子女教育手当、住宅手当、臨時の賃金、1ヶ月を超える期間ごとに支払われる賃金</strong>
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">割増率一覧</h2>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">残業の種類</th>
              <th className="px-4 py-3 text-center border-b font-semibold">割増率</th>
              <th className="px-4 py-3 text-left border-b font-semibold">適用条件</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">時間外労働</td><td className="px-4 py-3 border-b text-center font-bold text-kon">25%以上</td><td className="px-4 py-3 border-b">法定労働時間（1日8時間・週40時間）を超えた場合</td></tr>
            <tr className="bg-yellow-50"><td className="px-4 py-3 border-b font-bold">時間外労働（月60時間超）</td><td className="px-4 py-3 border-b text-center font-bold text-danger">50%以上</td><td className="px-4 py-3 border-b">月60時間を超える時間外労働（中小企業も2023年4月〜適用）</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">深夜労働</td><td className="px-4 py-3 border-b text-center font-bold text-kon">25%以上</td><td className="px-4 py-3 border-b">22時〜翌5時の労働</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">休日労働</td><td className="px-4 py-3 border-b text-center font-bold text-kon">35%以上</td><td className="px-4 py-3 border-b">法定休日（週1日）の労働</td></tr>
            <tr className="bg-gray-50"><td className="px-4 py-3 border-b font-bold">時間外＋深夜</td><td className="px-4 py-3 border-b text-center font-bold text-danger">50%以上</td><td className="px-4 py-3 border-b">法定時間外労働が深夜に及んだ場合</td></tr>
            <tr className="bg-gray-50"><td className="px-4 py-3 border-b font-bold">休日＋深夜</td><td className="px-4 py-3 border-b text-center font-bold text-danger">60%以上</td><td className="px-4 py-3 border-b">法定休日の深夜労働</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの残業代を計算！</p>
          <p className="text-gray-700 mb-4">月給と残業時間を入力して、正確な残業代をシミュレーションしましょう。</p>
          <Link href="/career/overtime-calculator" className="inline-block bg-kon hover:bg-kon text-white font-bold py-3 px-6 rounded-lg transition">
            → 残業代計算機を使う
          </Link>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【具体例】残業代の計算シミュレーション</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">ケース1：通常の残業20時間</h3>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600">条件：月給25万円、月平均所定労働時間166.7時間、残業20時間</p>
          </div>
          <div className="space-y-2">
            <p>1時間あたりの賃金：250,000円 ÷ 166.7時間 = <strong>1,500円</strong></p>
            <p>残業代：1,500円 × 1.25 × 20時間 = <strong className="text-kon text-xl">37,500円</strong></p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">ケース2：深夜残業10時間を含む</h3>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600">条件：月給25万円、通常残業15時間＋深夜残業10時間</p>
          </div>
          <div className="space-y-2">
            <p>通常残業：1,500円 × 1.25 × 15時間 = 28,125円</p>
            <p>深夜残業：1,500円 × 1.50 × 10時間 = 22,500円</p>
            <p>合計：<strong className="text-kon text-xl">50,625円</strong></p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">ケース3：月60時間超の残業（70時間）</h3>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600">条件：月給25万円、残業70時間（60時間超部分は50%割増）</p>
          </div>
          <div className="space-y-2">
            <p>60時間まで：1,500円 × 1.25 × 60時間 = 112,500円</p>
            <p>60時間超：1,500円 × 1.50 × 10時間 = 22,500円</p>
            <p>合計：<strong className="text-danger text-xl">135,000円</strong></p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">未払い残業代の請求方法</h2>
        <p className="text-gray-700 mb-4">
          残業代が正しく支払われていない場合、<strong className="text-kon">過去3年分まで遡って請求</strong>できます（2020年4月以降の賃金）。
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              証拠を集める
            </h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>・タイムカード、勤怠記録のコピー</li>
              <li>・給与明細</li>
              <li>・メールの送信履歴（業務時間の証拠）</li>
              <li>・PCのログイン・ログアウト記録</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              会社に請求
            </h3>
            <p className="text-gray-700 text-sm">内容証明郵便で未払い残業代を請求。金額と根拠を明記。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
              労働基準監督署・弁護士に相談
            </h3>
            <p className="text-gray-700 text-sm">会社が応じない場合は労基署への申告や、弁護士への相談を検討。</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 時効に注意</p>
          <p className="text-gray-700">
            残業代の請求権は<strong>3年で時効</strong>（2020年4月以降の賃金）。
            早めに行動することが重要です。
          </p>
        </div>
      </section>

      <p className="text-gray-700 mb-4">未払い残業代は2年で時効になるため、心当たりのある方はぶっちゃけ早めに動いたほうがいいと思います。</p>



      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 固定残業代（みなし残業）の場合は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>固定残業代を超えた分は別途支払いが必要</strong>です。例えば「月30時間分の固定残業代」が含まれている場合、31時間目以降は追加で残業代が発生します。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 管理職でも残業代はもらえる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>「名ばかり管理職」なら残業代の対象</strong>です。労働基準法の「管理監督者」に該当するには、経営に関する決定権、出退勤の自由、相応の待遇が必要。実態がなければ請求可能です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 休日出勤と残業の違いは？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>法定休日（週1日）の出勤は35%割増</strong>。それ以外の休日（所定休日）は通常の時間外労働として25%割増が適用されます。会社の就業規則で法定休日がいつか確認しましょう。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. サービス残業は違法？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>違法です</strong>。労働した時間に対して賃金を支払わないのは労働基準法違反。会社には是正勧告や罰則が科される可能性があります。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：残業代は正しく計算・請求を</h2>
        <p className="text-gray-700 mb-4">
          残業代は法律で定められた権利です。<strong>正しい計算方法を理解し、適正な金額を受け取りましょう</strong>。
          未払いがある場合は、証拠を集めて早めに請求することが大切です。
        </p>
        
        <div className="bg-gradient-to-r from-slate-900 to-kon text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの残業代をシミュレーション</p>
          <Link href="/career/overtime-calculator" className="inline-block bg-white text-kon font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 残業代計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/overtime-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">残業代計算機</span>
            <p className="text-sm text-gray-600">残業代を簡単計算</p>
          </Link>
          <Link href="/career/unemployment-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">失業保険計算機</span>
            <p className="text-sm text-gray-600">失業手当の見込み額</p>
          </Link>
          <Link href="/career/job-change-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">転職シミュレーター</span>
            <p className="text-sm text-gray-600">転職後の年収を試算</p>
          </Link>
          <Link href="/career/social-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-200 transition">
            <span className="font-bold text-gray-800">社会保険計算機</span>
            <p className="text-sm text-gray-600">社会保険料を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の労働基準法に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/zangyoudai-keisan-simulation-2026" title="zangyoudai-keisan-simulation-2026" />
</article>
  );
}
