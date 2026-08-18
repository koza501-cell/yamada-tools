# -*- coding: utf-8 -*-
import json

DB = 'src/data/dynamicBlogs.json'
AI = 'src/data/aiPosts.json'

db = json.load(open(DB, encoding='utf-8'))
ai = json.load(open(AI, encoding='utf-8'))

by_slug_db = {p['slug']: p for p in db}
by_slug_ai = {p['slug']: p for p in ai}

errors = []
applied = 0

def fix(store, slug, old, new, expect=1):
    global applied
    post = store.get(slug)
    if post is None:
        errors.append(f'MISSING SLUG {slug}')
        return
    c = post['content']
    cnt = c.count(old)
    if cnt != expect:
        errors.append(f'{slug}: expected {expect} got {cnt} for: {old!r}')
        return
    post['content'] = c.replace(old, new)
    applied += 1

# ===== P30 kakutei-shinkoku-guide-2026 =====
fix(by_slug_db, 'kakutei-shinkoku-guide-2026',
    '締切直前でも間に合う、確定申告の準備方法を確認しておこう。', '締切直前でも間に合う、確定申告の準備方法を確認しておきましょう。')

# ===== P31 pdf-moji-nyuryoku-muryou =====
fix(by_slug_db, 'pdf-moji-nyuryoku-muryou',
    '2026年現在の最新情報をもとに、PDFへの文字入力方法を徹底解説する。', '2026年現在の最新情報をもとに、PDFへの文字入力方法を徹底解説します。')

# ===== P64 zengin-format-complete-guide-2026 =====
fix(by_slug_db, 'zengin-format-complete-guide-2026',
    '経理1年目でも迷わない手順を実例とともに整理する。', '経理1年目でも迷わない手順を実例とともに整理します。')
fix(by_slug_db, 'zengin-format-complete-guide-2026',
    '**原因：** 1行が120バイトになっていない。', '**原因：** 1行が120バイトになっていません。')
fix(by_slug_db, 'zengin-format-complete-guide-2026',
    'トレーラ・レコードの集計値が実際のデータ・レコードと合っていない。', 'トレーラ・レコードの集計値が実際のデータ・レコードと合っていません。')
fix(by_slug_db, 'zengin-format-complete-guide-2026',
    'LF（Unix）がCR+LF（Windows）に変換されていない。', 'LF（Unix）がCR+LF（Windows）に変換されていません。')
fix(by_slug_db, 'zengin-format-complete-guide-2026',
    'コピーしたときにUnicodeが混入するケースが多い。', 'コピーしたときにUnicodeが混入するケースが多いです。')

# ===== P70 torihikisaki-kyc-cross-verify-guide =====
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    '会社名と法人番号の照合結果を以下の6段階で判定する。', '会社名と法人番号の照合結果を以下の6段階で判定します。')
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    '今から月次KYCの習慣をつけることが重要だ。', '今から月次KYCの習慣をつけることが重要です。')
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    '手動チェック比10倍以上の効率化が実現できる。', '手動チェック比10倍以上の効率化が実現できます。')
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    '月15,000件まで完全無料で検証できる。', '月15,000件まで完全無料で検証できます。')
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    '無料で月500件まで検証できるツールを完全解説。', '無料で月500件まで検証できるツールを完全解説します。')
fix(by_slug_db, 'torihikisaki-kyc-cross-verify-guide',
    'インボイス番号一括チェッカーの利用を検討するとよい。', 'インボイス番号一括チェッカーの利用を検討するとよいでしょう。')

# ===== P96 souzokunin-shinkoku-touki-kanzen-guide-2026 =====
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '両方ともよく似た名前ですが、目的も効果もまるで違う。', '両方ともよく似た名前ですが、目的も効果もまるで違います。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '「私はこの不動産の所有者の相続人です」と法務局に申告するだけの手続きだ。', '「私はこの不動産の所有者の相続人です」と法務局に申告するだけの手続きです。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '法的な権利関係を整理したいなら、結局は本来の相続登記が必要。', '法的な権利関係を整理したいなら、結局は本来の相続登記が必要です。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '現実には3年以内に本登記まで完了させるのが難しいケースが少なくない。', '現実には3年以内に本登記まで完了させるのが難しいケースが少なくありません。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '本来の相続登記が3年以内に間に合わない明確な理由がある場合だ。', '本来の相続登記が3年以内に間に合わない明確な理由がある場合です。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    'まとめると、相続人申告登記は「時間稼ぎ」の制度だ。', 'まとめると、相続人申告登記は「時間稼ぎ」の制度です。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '書類が少ないため自分でやる方が多い手続きだ。', '書類が少ないため自分でやる方が多い手続きです。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '郵送なら書留郵便を使うのが安全だ。', '郵送なら書留郵便を使うのが安全です。')
fix(by_slug_db, 'souzokunin-shinkoku-touki-kanzen-guide-2026',
    '完了の通知は郵送で届く。', '完了の通知は郵送で届きます。')

# ===== P98 yoto-chiiki-kanzen-guide =====
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '不動産購入前に知っておくべきことをまとめて解説。', '不動産購入前に知っておくべきことをまとめて解説します。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '住居・商業・工業などの機能を適切に配置し、生活環境を守ることだ。', '住居・商業・工業などの機能を適切に配置し、生活環境を守ることです。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    'その土地の用途地域を瞬時に確認できる。', 'その土地の用途地域を瞬時に確認できます。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '各市区町村の役所・ホームページで都市計画図が公開されている。', '各市区町村の役所・ホームページで都市計画図が公開されています。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '用途地域は建物の種類だけでなく、以下の建築規制も決定する。', '用途地域は建物の種類だけでなく、以下の建築規制も決定します。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '用途地域は都市計画の変更により将来変わる可能性がある。', '用途地域は都市計画の変更により将来変わる可能性があります。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '[ハザードマップ確認](/realestate/hazard-checker)と合わせて周辺環境も確認しておくとよい。', '[ハザードマップ確認](/realestate/hazard-checker)と合わせて周辺環境も確認しておくとよいでしょう。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    'はい。都市計画の見直しにより変更されることがある。', 'はい。都市計画の見直しにより変更されることがあります。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    'ただし、独自の条例などによる規制がある場合もある。', 'ただし、独自の条例などによる規制がある場合もあります。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '「どのような耐火性能の建物を建てるか」を規制する。', '「どのような耐火性能の建物を建てるか」を規制します。')
fix(by_slug_db, 'yoto-chiiki-kanzen-guide',
    '用途地域チェッカーで、今すぐ確認できる。', '用途地域チェッカーで、今すぐ確認できます。')

# ===== P100 denshi-inkan-tsukurikata-guide =====
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    'を、無料ツールを使って解説。', 'を、無料ツールを使って解説します。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    'よく混同されますが、電子印鑑と電子署名は別物だ。', 'よく混同されますが、電子印鑑と電子署名は別物です。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '視覚的な「押印」の代替として使われる。', '視覚的な「押印」の代替として使われます。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '電子署名法に基づき、契約書の法的有効性を担保する。', '電子署名法に基づき、契約書の法的有効性を担保します。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '法的拘束力が求められる重要契約書には、電子署名サービスの利用を検討するとよい。', '法的拘束力が求められる重要契約書には、電子署名サービスの利用を検討するとよいでしょう。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '承認フローのために出社する必要がなくなる。', '承認フローのために出社する必要がなくなります。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '部署印・担当者印を電子化することで、書類処理のスピードが大幅に上がる。', '部署印・担当者印を電子化することで、書類処理のスピードが大幅に上がります。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '入力した名前や画像データが外部サーバーに送信されることはない。', '入力した名前や画像データが外部サーバーに送信されることはありません。')
fix(by_slug_db, 'denshi-inkan-tsukurikata-guide',
    '登録不要・無料・データ保存なしで、今すぐ電子印鑑を作成できる。', '登録不要・無料・データ保存なしで、今すぐ電子印鑑を作成できます。')

# ===== P102 gazou-asshuku-kanzen-guide =====
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    '形式を変えるだけで同じ画質でもファイルサイズが大きく変わる。', '形式を変えるだけで同じ画質でもファイルサイズが大きく変わります。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'ダウンロードボタンで保存します。元のファイルは変更されない。', 'ダウンロードボタンで保存します。元のファイルは変更されません。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'WordPressにアップする前に圧縮するのが基本だ。', 'WordPressにアップする前に圧縮するのが基本です。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'SNS側の自動圧縮による予期せぬ画質劣化を防ぐことができる。', 'SNS側の自動圧縮による予期せぬ画質劣化を防ぐことができます。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    '送信前に圧縮しておくとよい。', '送信前に圧縮しておくとよいでしょう。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'Webサイト用ならJPGをWebPに変換するだけで30〜40%小さくなる。', 'Webサイト用ならJPGをWebPに変換するだけで30〜40%小さくなります。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    '同じ圧縮レベルで一括処理すると作業時間の大幅な短縮が可能。', '同じ圧縮レベルで一括処理すると作業時間の大幅な短縮が可能です。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'ただし「バランス」設定であれば、通常の画面表示では劣化はほぼわからない。', 'ただし「バランス」設定であれば、通常の画面表示では劣化はほぼわかりません。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'はい。iPhoneやAndroidのブラウザからアプリなしで利用できる。', 'はい。iPhoneやAndroidのブラウザからアプリなしで利用できます。')
fix(by_slug_db, 'gazou-asshuku-kanzen-guide',
    'アカウント登録なし・無料でいますぐ試せる。', 'アカウント登録なし・無料でいますぐ試せます。')

# ===== P104 pdf-asshuku-kanzen-guide =====
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '作成者情報・編集履歴・コメントなど、送付時には不要なデータが含まれている。', '作成者情報・編集履歴・コメントなど、送付時には不要なデータが含まれています。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    'ダウンロードボタンで保存します。元のファイルは変更されない。', 'ダウンロードボタンで保存します。元のファイルは変更されません。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '**目安：** 標準圧縮で元サイズの30〜60%に削減できる。', '**目安：** 標準圧縮で元サイズの30〜60%に削減できます。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    'まとめて圧縮すると、保存容量を大幅に節約できる。', 'まとめて圧縮すると、保存容量を大幅に節約できます。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '先に削除してから圧縮すると、より小さくなる。', '先に削除してから圧縮すると、より小さくなります。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '圧縮ツールを使う前から小さいPDFが作成できる。', '圧縮ツールを使う前から小さいPDFが作成できます。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '軽圧縮・標準圧縮であれば、画面表示では画質の劣化はほぼわからない。', '軽圧縮・標準圧縮であれば、画面表示では画質の劣化はほぼわかりません。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '処理完了後、アップロードされたファイルは自動削除。', '処理完了後、アップロードされたファイルは自動削除されます。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    'はい。iPhoneやAndroidのブラウザからアプリなしで利用できる。', 'はい。iPhoneやAndroidのブラウザからアプリなしで利用できます。')
fix(by_slug_db, 'pdf-asshuku-kanzen-guide',
    '- **標準圧縮**：画質と容量のバランスが良い。', '- **標準圧縮**：画質と容量のバランスが良いです。')

# ===== P105 furigana-henkan-kanzen-guide =====
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '**ふりがな変換ツール**を使えば、こうした作業が数秒で終わる。', '**ふりがな変換ツール**を使えば、こうした作業が数秒で終わります。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '登録不要・完全無料・ブラウザだけで完結。変換したデータはサーバーに保存されないため、個人情報や社内データも安心して利用できる。',
    '登録不要・完全無料・ブラウザだけで完結します。変換したデータはサーバーに保存されないため、個人情報や社内データも安心して利用できます。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '100件の名前でも1分以内に完了。', '100件の名前でも1分以内に完了します。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    'ゼロから手入力するより格段に速く終わる。', 'ゼロから手入力するより格段に速く終わります。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    'ExcelにはPHONETIC関数という「入力時の読みを取得する」機能がある。', 'ExcelにはPHONETIC関数という「入力時の読みを取得する」機能があります。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '前後の文脈によって誤変換が起きることがある。', '前後の文脈によって誤変換が起きることがあります。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '個人名や社内情報も安心して利用可能。', '個人名や社内情報も安心して利用可能です。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    'ふりがな変換の前後に他のツールと組み合わせると作業効率がさらに上がる。', 'ふりがな変換の前後に他のツールと組み合わせると作業効率がさらに上がります。')
fix(by_slug_db, 'furigana-henkan-kanzen-guide',
    '登録不要・無料でいますぐ使えます。処理したデータが保存されることはない。', '登録不要・無料でいますぐ使えます。処理したデータが保存されることはありません。')

# ===== P125 corporate-insurance-deductibility-guide-2026 =====
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '最も重要な概念が「最高解約返戻率」だ。', '最も重要な概念が「最高解約返戻率」です。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '以下の4区分に応じた損金算入割合が適用。', '以下の4区分に応じた損金算入割合が適用されます。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '計算がより複雑になる。', '計算がより複雑になります。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    'いずれ形を変えて損金になる**という点が重要だ。', 'いずれ形を変えて損金になる**という点が重要です。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '1円でも超えると特例が適用されなくなる。', '1円でも超えると特例が適用されなくなります。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '退職金の支払いと解約のタイミングを合わせることが、設計の核心だ。', '退職金の支払いと解約のタイミングを合わせることが、設計の核心です。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '解約返戻率がピークを迎える時期が引退タイミングと重なる保険期間・保険料プランを選ぶ必要がある。', '解約返戻率がピークを迎える時期が引退タイミングと重なる保険期間・保険料プランを選ぶ必要があります。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '長い目で見た税負担の総額は基本的に変わらない。', '長い目で見た税負担の総額は基本的に変わりません。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    'いずれも個別の税務状況に強く依存する。', 'いずれも個別の税務状況に強く依存します。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '具体的な数字でシミュレーションしてから決断することが重要だ。', '具体的な数字でシミュレーションしてから決断することが重要です。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '**保険あくまで保険として見る**', '**保険はあくまで保険として見る**')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '設計書を自分で読んで確認することが大切。', '設計書を自分で読んで確認することが大切です。')
fix(by_slug_db, 'corporate-insurance-deductibility-guide-2026',
    '加入後の毎期処理の両面で税理士と連携することが前提だ。', '加入後の毎期処理の両面で税理士と連携することが前提です。')

# ===== AI P54 ai-suishinho-jigyosha-guideline-2026 =====
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '実際に何が書かれていて、中小企業は何をすればいいのかを整理していく。', '実際に何が書かれていて、中小企業は何をすればいいのかを整理していきます。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '一方、日本が選んだのはほぼ真逆の設計だ。', '一方、日本が選んだのはほぼ真逆の設計です。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '国内ビジネスだけを見れば規制の圧力は今のところかなり低いと言える。', '国内ビジネスだけを見れば規制の圧力は今のところかなり低いと言えます。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    'AIシステムがユーザーや社会に不当な害を与えないよう、リスク評価と対策を行う。', 'AIシステムがユーザーや社会に不当な害を与えないよう、リスク評価と対策を行います。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '特定の属性（性別・年齢・国籍など）で不当に不利な結果が出ないかチェックする。', '特定の属性（性別・年齢・国籍など）で不当に不利な結果が出ないかチェックします。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '個人情報をAIツールに入力する際の取り扱いルールを整備する。', '個人情報をAIツールに入力する際の取り扱いルールを整備します。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    'AIが関与したコンテンツについて、必要に応じて開示できる体制を整える。', 'AIが関与したコンテンツについて、必要に応じて開示できる体制を整えます。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '問題発生時に責任の所在を明確にできるようにする。', '問題発生時に責任の所在を明確にできるようにします。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '2026年に入ってAIエージェントの業務活用が急速に広がっていることへの対応だ。', '2026年に入ってAIエージェントの業務活用が急速に広がっていることへの対応です。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '社会的に問題視される領域から順次ハードロー化が進む可能性も念頭に置いておく必要がある。', '社会的に問題視される領域から順次ハードロー化が進む可能性も念頭に置いておく必要があります。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    'A4一枚で次を明記するだけで十分だ。', 'A4一枚で次を明記するだけで十分です。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '「著作権者の利益を不当に害する場合」は侵害リスクが生じる。', '「著作権者の利益を不当に害する場合」は侵害リスクが生じます。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    'AIの出力を使った事業者が最終的に責任を負う。', 'AIの出力を使った事業者が最終的に責任を負います。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    'BtoCサービスを運営している場合は特に、消費者の信頼感に影響する。', 'BtoCサービスを運営している場合は特に、消費者の信頼感に影響します。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '自社のAIガバナンス体制の整備が競争優位につながる場面が出てくる。', '自社のAIガバナンス体制の整備が競争優位につながる場面が出てきます。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '中小企業にとって「生成AIの利用を制限するもの」ではない。', '中小企業にとって「生成AIの利用を制限するもの」ではありません。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '「知っているけど使えていない」状態が多数派だ。', '「知っているけど使えていない」状態が多数派です。')
fix(by_slug_ai, 'ai-suishinho-jigyosha-guideline-2026',
    '過度に身構えず、使い続けながら体制を整えていきたい。', '過度に身構えず、使い続けながら体制を整えていきたいところです。')

print(f'APPLIED: {applied}')
print(f'ERRORS: {len(errors)}')
for e in errors:
    print('  ', e)

if not errors:
    json.dump(db, open(DB, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    json.dump(ai, open(AI, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('SAVED')
else:
    print('NOT SAVED due to errors')
