import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE_ARTICLES, DISCLAIMER } from "../../data";

const ARTICLE_CONTENT: Record<string, { body: React.ReactNode }> = {
  "what-is-souzoku-touki": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>相続登記とは何か</h2>
        <p>相続登記とは、不動産（土地・建物）の所有者が亡くなった際に、その相続人へと所有権を移転する手続きのことです。具体的には法務局に登記申請を行い、登記簿（不動産の公的な記録）上の名義を故人から相続人に書き換えます。</p>

        <h2>なぜ登記が必要なのか</h2>
        <p>日本の不動産は「登記」によって権利関係が公示されます。登記しなければ、第三者に対して所有権を主張できません。また2024年4月から義務化され、怠ると10万円以下の過料が科されます。</p>
        <ul>
          <li>権利保全：登記なしでは第三者への対抗が困難</li>
          <li>法的義務：2024年4月1日から義務化（3年以内）</li>
          <li>売買・融資の前提：不動産売却・抵当権設定に必要</li>
        </ul>

        <h2>登記しないとどうなる？</h2>
        <p>相続登記を怠った場合の主なリスクは以下のとおりです。</p>
        <ul>
          <li><strong>10万円以下の過料</strong>：正当な理由なく3年以内に申請しなかった場合</li>
          <li><strong>所有者不明土地問題</strong>：放置すると相続が重なり権利関係が複雑化</li>
          <li><strong>売却・担保設定が困難</strong>：名義変更なしでは取引できない</li>
          <li><strong>相続人の増加</strong>：年月が経つほど相続人が増え手続きが煩雑化</li>
        </ul>

        <h2>登記の対象となる不動産</h2>
        <p>土地・建物どちらも対象です。農地・山林・別荘地・駐車場なども含まれます。登記簿に記録されたすべての不動産が対象となります。</p>

        <h2>誰が申請できる？</h2>
        <p>相続人本人が申請できます（司法書士への委任も可）。複数の相続人がいる場合でも、各自が自分の持分について申請できます。</p>

        <h2>まとめ</h2>
        <p>相続登記は「いつかやればいい」ではなく、2024年以降は法律上の義務です。まずはケース診断で自分の状況を確認し、必要書類を揃えましょう。</p>
      </div>
    ),
  },
  "gimuka-and-bassoku": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>2024年4月1日から義務化</h2>
        <p>改正不動産登記法により、2024年（令和6年）4月1日から相続登記が義務化されました。これは「所有者不明土地問題」を解消するための重要な法改正です。</p>

        <h2>義務の内容</h2>
        <ul>
          <li>不動産を相続で取得したことを知った日から<strong>3年以内</strong>に登記申請が必要</li>
          <li>遺産分割が成立した場合は、成立した日から3年以内に登記申請が必要</li>
          <li>正当な理由なく怠ると<strong>10万円以下の過料</strong>が科される</li>
        </ul>

        <h2>過去の相続も対象</h2>
        <p>重要なのは、2024年4月1日以前に発生した相続（登記未了のもの）も義務化の対象になることです。</p>
        <ul>
          <li>2024年4月1日より前に発生した相続 → <strong>2027年3月31日まで</strong>に登記申請が必要</li>
          <li>相続人申告登記（後述）で一時的に義務を履行したとみなされる場合あり</li>
        </ul>

        <h2>相続人申告登記（2024年新設）</h2>
        <p>遺産分割が整っていなくても、相続人であることを申告するだけで義務を履行したとみなされる簡易制度が新設されました。</p>
        <ul>
          <li>費用：登録免許税不要（申出手数料のみ）</li>
          <li>期限：相続を知った日から3年以内</li>
          <li>注意：権利の移転は行われません。最終的には遺産分割協議後に正式な登記が必要</li>
        </ul>

        <h2>経過措置のまとめ</h2>
        <table>
          <thead><tr><th>相続発生時期</th><th>申請期限</th></tr></thead>
          <tbody>
            <tr><td>2024年4月1日以降</td><td>相続を知った日から3年以内</td></tr>
            <tr><td>2024年4月1日より前</td><td>2027年3月31日まで</td></tr>
          </tbody>
        </table>
      </div>
    ),
  },
  "hitsuyou-shorui": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>共通して必要な書類</h2>
        <ul>
          <li>登記申請書（自作）</li>
          <li>固定資産評価証明書（不動産所在地の市区町村役場、200〜400円/通）</li>
          <li>不動産の登記事項証明書（法務局、600円/通）</li>
          <li>被相続人の住民票除票または戸籍附票（300円）</li>
        </ul>

        <h2>ケース別 追加必要書類</h2>
        <h3>遺産分割協議の場合</h3>
        <ul>
          <li>遺産分割協議書（自作、相続人全員の実印・印鑑証明付き）</li>
          <li>印鑑証明書（相続人全員、3ヶ月以内のもの、300円/通）</li>
          <li>被相続人の戸籍謄本（出生〜死亡の全戸籍、450円/通）</li>
          <li>相続人の戸籍謄本（450円/通）</li>
          <li>相続人の住民票（300円/通）</li>
        </ul>

        <h3>法定相続の場合</h3>
        <ul>
          <li>被相続人の戸籍謄本（出生〜死亡の全戸籍）</li>
          <li>相続人全員の戸籍謄本</li>
          <li>相続人全員の住民票</li>
        </ul>

        <h3>遺言書がある場合</h3>
        <ul>
          <li>遺言書（公正証書遺言は写し、自筆証書遺言は検認済みのもの）</li>
          <li>被相続人の戸籍謄本（死亡記載のもの）</li>
          <li>相続人の戸籍謄本・住民票</li>
        </ul>

        <h2>書類取得の注意点</h2>
        <ul>
          <li>戸籍謄本は出生から死亡まで連続したものが必要（本籍を移動している場合は複数必要）</li>
          <li>印鑑証明書は3ヶ月以内のものを使用</li>
          <li>固定資産評価証明書は4月以降は新年度のものを取得</li>
          <li>相続関係説明図を作成すると戸籍謄本の原本還付を受けられる</li>
        </ul>

        <h2>費用の目安</h2>
        <p>書類収集にかかる費用の目安（相続人2〜3人、不動産2件の場合）：</p>
        <ul>
          <li>戸籍謄本一式：3,000〜8,000円</li>
          <li>住民票：600〜900円</li>
          <li>固定資産評価証明書：400〜800円</li>
          <li>印鑑証明書：600〜900円</li>
          <li>登記事項証明書：600〜1,200円</li>
          <li>合計目安：1〜3万円程度</li>
        </ul>
      </div>
    ),
  },
  "moushikomi-flow": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>相続登記の8ステップ</h2>

        <h3>STEP 1：ケースを確認する</h3>
        <p>遺産分割協議・法定相続・遺言書のどれに該当するか確認します。本サイトの<a href="/souzoku-touki/wizard">ケース診断</a>を活用してください。</p>

        <h3>STEP 2：不動産を特定する</h3>
        <p>相続対象の不動産を特定します。登記事項証明書（法務局で600円/通）を取得して、不動産の地番・家屋番号・所有者を確認してください。固定資産税納税通知書も参考になります。</p>

        <h3>STEP 3：書類を収集する</h3>
        <p>ケースに応じた書類を収集します。戸籍謄本は本籍地の市区町村役場に請求します。転籍している場合は複数の役場から請求が必要です。</p>

        <h3>STEP 4：固定資産評価証明書を取得する</h3>
        <p>不動産所在地の市区町村役場で固定資産評価証明書（200〜400円/通）を取得します。ここに記載された「価格」欄の金額が登録免許税の計算基準となります。</p>

        <h3>STEP 5：登録免許税を計算する</h3>
        <p>固定資産税評価額合計×0.4%で計算します。本サイトの<a href="/souzoku-touki/tax">登録免許税計算機</a>をご利用ください。収入印紙で納付します（法務局・郵便局で購入可能）。</p>

        <h3>STEP 6：申請書を作成する</h3>
        <p>法務局の書式に従い登記申請書を作成します。記載事項：登記の目的・原因（死亡日）・相続人の住所氏名・添付書類・課税価格・登録免許税など。</p>

        <h3>STEP 7：管轄法務局へ申請する</h3>
        <p>不動産所在地を管轄する法務局に申請書と書類一式を提出します。申請方法は①窓口②郵送③オンラインの3種類。初めての方は窓口申請がお勧めです。<a href="/souzoku-touki/houmukyoku">管轄法務局検索</a>で法務局を探せます。</p>

        <h3>STEP 8：登記完了を確認する</h3>
        <p>申請から登記完了まで1〜2週間程度かかります。完了通知（登記完了証）が届いたら手続き完了です。登記事項証明書を取得して内容を確認してください。</p>

        <h2>申請時の注意点</h2>
        <ul>
          <li>申請書の書き方に誤りがあると法務局から補正指示が来る</li>
          <li>収入印紙は申請書に貼付（消印不要）</li>
          <li>返信用封筒（郵送申請の場合）を同封する</li>
          <li>原本還付を受ける場合は相続関係説明図を添付</li>
        </ul>
      </div>
    ),
  },
  "diy-or-professional": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>DIY申請に向いているケース</h2>
        <ul>
          <li>配偶者または子どもへの相続（最も単純なケース）</li>
          <li>相続人が少ない（2〜3人）</li>
          <li>相続人全員が国内在住・連絡が取れる</li>
          <li>相続人が亡くなっておらず数次相続がない</li>
          <li>遺言書がない、または公正証書遺言がある</li>
          <li>不動産が1〜2件で同じ管轄法務局</li>
        </ul>

        <h2>専門家（司法書士）への依頼を検討すべきケース</h2>
        <ul>
          <li><strong>数次相続</strong>：相続登記をしないうちに相続人が亡くなっている</li>
          <li><strong>相続人が多い（4人以上）</strong>：協議・書類収集が煩雑</li>
          <li><strong>外国在住の相続人がいる</strong>：サイン証明等の特殊書類が必要</li>
          <li><strong>行方不明の相続人がいる</strong>：不在者財産管理人選任が必要</li>
          <li><strong>相続放棄が絡む</strong>：複雑な法律判断が必要</li>
          <li><strong>自筆証書遺言の検認が未済</strong>：家庭裁判所での手続きが先に必要</li>
          <li><strong>遺産分割で紛争がある</strong>：弁護士・司法書士が必要</li>
          <li><strong>急いでいる（売買等）</strong>：プロに任せた方が確実で早い</li>
        </ul>

        <h2>費用の比較</h2>
        <table>
          <thead><tr><th>費用項目</th><th>DIY</th><th>司法書士依頼</th></tr></thead>
          <tbody>
            <tr><td>登録免許税</td><td>評価額×0.4%</td><td>評価額×0.4%</td></tr>
            <tr><td>書類収集</td><td>1〜3万円</td><td>1〜3万円</td></tr>
            <tr><td>司法書士報酬</td><td>0円</td><td>5〜15万円</td></tr>
            <tr><td>合計目安</td><td>登録免許税＋1〜3万円</td><td>登録免許税＋6〜18万円</td></tr>
          </tbody>
        </table>

        <h2>まず診断してみましょう</h2>
        <p>自分のケースがDIY可能かどうかわからない場合は、<a href="/souzoku-touki/wizard">ケース診断ウィザード</a>で10問に答えるだけで判定できます。</p>
      </div>
    ),
  },
  "yokuvaru-shippai": {
    body: (
      <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
        <h2>よくある失敗7例</h2>

        <h3>失敗1：被相続人の住所と登記簿の住所が一致しない</h3>
        <p>登記簿上の住所と住民票除票の住所が異なる場合、連続性を証明できず補正を求められます。転居歴がある場合は除籍謄本や戸籍附票で連続性を示す必要があります。</p>
        <p><strong>対策：</strong>申請前に登記事項証明書で住所を確認し、住民票除票と照合する。</p>

        <h3>失敗2：戸籍謄本が出生から死亡まで連続していない</h3>
        <p>被相続人が転籍を繰り返している場合、複数の役場から戸籍謄本を収集する必要があります。1通だけでは不十分です。</p>
        <p><strong>対策：</strong>除籍謄本を見て前の本籍を確認し、出生まで遡ってすべての戸籍を収集する。</p>

        <h3>失敗3：印鑑証明書の有効期限切れ</h3>
        <p>遺産分割協議書に添付する印鑑証明書は3ヶ月以内のものが必要です。書類収集に時間がかかって期限切れになるケースが多いです。</p>
        <p><strong>対策：</strong>他の書類が揃ってから最後に印鑑証明書を取得する。</p>

        <h3>失敗4：相続人の一部が漏れている</h3>
        <p>認知した子（婚外子）や養子など、戸籍上確認しなければわからない相続人が漏れると遺産分割協議書が無効になります。</p>
        <p><strong>対策：</strong>戸籍謄本を全件確認し、すべての相続人を把握してから協議を進める。</p>

        <h3>失敗5：固定資産評価証明書が古い年度のもの</h3>
        <p>4月1日以降は新年度（翌年度）の評価証明書を使用する必要があります。古い年度のものを提出すると補正されます。</p>
        <p><strong>対策：</strong>申請時期に合わせた年度の評価証明書を取得する。</p>

        <h3>失敗6：申請書の記載ミス（地番・家屋番号の誤り）</h3>
        <p>登記事項証明書上の地番・家屋番号を申請書に正確に転記しないと補正されます。住居表示（○○町1丁目2番3号）と地番は異なります。</p>
        <p><strong>対策：</strong>登記事項証明書の「表題部」の地番・家屋番号を正確に転記する。</p>

        <h3>失敗7：遺産分割協議書の実印・印鑑証明の不備</h3>
        <p>遺産分割協議書は相続人全員の実印による押印と印鑑証明書の添付が必要です。認印や印鑑証明なしでは無効です。</p>
        <p><strong>対策：</strong>相続人全員が事前に実印を用意し、押印時に印鑑証明書を取得する。</p>

        <h2>補正になった場合は？</h2>
        <p>法務局から補正の連絡が来た場合、指示された内容を修正して再提出します。軽微な誤りは補正で対応できますが、根本的な誤りは取り下げて再申請が必要になることもあります。申請書作成は慎重に行いましょう。</p>
      </div>
    ),
  },
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.id === id);
  if (!article) return {};
  return {
    title: `${article.title} | 相続登記ガイド`,
    description: article.description,
    alternates: { canonical: `https://yamada-tools.jp/souzoku-touki/guide/${id}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://yamada-tools.jp/souzoku-touki/guide/${id}`,
      siteName: "山田ツール",
      locale: "ja_JP",
      type: "article",
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { id } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.id === id);
  if (!article) notFound();
  const content = ARTICLE_CONTENT[id];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `https://yamada-tools.jp/souzoku-touki/guide/${id}`,
    publisher: { "@type": "Organization", name: "山田ツール", url: "https://yamada-tools.jp" },
    inLanguage: "ja-JP",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; <Link href="/souzoku-touki/guide" className="hover:text-white">ガイド記事</Link>
          </p>
          <div className="flex items-start gap-4">
            <div className="text-5xl">{article.icon}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{article.title}</h1>
              <p className="text-gray-200 text-sm mt-1">読了目安：{article.readTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
          {content?.body ?? (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-400">このガイド記事は準備中です。</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl text-xs text-yellow-800 dark:text-yellow-300">
          ⚠️ {DISCLAIMER}
        </div>

        {/* Article navigation */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">他のガイド記事</h3>
          <div className="grid grid-cols-1 gap-2">
            {GUIDE_ARTICLES.filter((a) => a.id !== id).map((a) => (
              <Link
                key={a.id}
                href={`/souzoku-touki/guide/${a.id}`}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <span className="text-xl">{a.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</div>
                  <div className="text-xs text-gray-400">{a.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
