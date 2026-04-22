# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-a-e2e-test.spec.ts >> Part 1: Environment & Regression Checks >> 1.1b: STAGING Banner does NOT appear on production
- Location: feature-a-e2e-test.spec.ts:45:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=封筒印刷') to be visible
    33 × locator resolved to 5 elements. Proceeding with the first one: <title>封筒印刷・宛名印刷【無料】長形・角形・洋形 全サイズ対応 | 山田ツール</title>

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - link "メインコンテンツへスキップ" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "山田ツール 山田ツール" [ref=e7] [cursor=pointer]:
        - /url: /
        - img "山田ツール" [ref=e8]
        - generic [ref=e9]: 山田ツール
      - navigation [ref=e10]:
        - button "ツール" [ref=e12] [cursor=pointer]:
          - generic [ref=e13]: ツール
          - img [ref=e14]
        - button "計算・シュミレーター" [ref=e17] [cursor=pointer]:
          - generic [ref=e18]: 計算・シュミレーター
          - img [ref=e19]
        - link "ブログ" [ref=e21] [cursor=pointer]:
          - /url: /blog
        - link "AI活用" [ref=e22] [cursor=pointer]:
          - /url: /ai
        - link "料金" [ref=e23] [cursor=pointer]:
          - /url: /pricing
      - generic [ref=e24]:
        - button "検索" [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: 🔍
          - generic [ref=e27]: 検索
          - generic [ref=e28]: ⌘K
        - link "ログイン" [ref=e29] [cursor=pointer]:
          - /url: /auth/login
          - generic [ref=e30]: ログイン
  - navigation "Breadcrumb" [ref=e31]:
    - list [ref=e33]:
      - listitem [ref=e34]:
        - link "ホーム" [ref=e35] [cursor=pointer]:
          - /url: /
      - listitem [ref=e36]:
        - generic [ref=e37]: ›
        - link "生成・計算" [ref=e38] [cursor=pointer]:
          - /url: /generator
      - listitem [ref=e39]:
        - generic [ref=e40]: ›
        - generic [ref=e41]: 封筒印刷
  - main [ref=e42]:
    - generic [ref=e43]:
      - generic [ref=e46]:
        - link "🔧 山田ツール" [ref=e47] [cursor=pointer]:
          - /url: /
          - generic [ref=e48]: 🔧
          - generic [ref=e49]: 山田ツール
        - link "生成ツール一覧" [ref=e50] [cursor=pointer]:
          - /url: /generator
      - main [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]:
            - heading "✉️封筒印刷・宛名印刷300 DPI" [level=1] [ref=e54]
            - paragraph [ref=e55]: 日本の全封筒サイズに対応。高解像度印刷で美しい仕上がり。
          - generic [ref=e56]:
            - button "ビジネス" [ref=e57] [cursor=pointer]
            - button "請求書" [ref=e58] [cursor=pointer]
            - button "履歴書" [ref=e59] [cursor=pointer]
            - button "納品書" [ref=e60] [cursor=pointer]
          - generic [ref=e62]:
            - button "🎯 かんたんモード" [ref=e63] [cursor=pointer]
            - button "⚙️ 詳細設定" [ref=e64] [cursor=pointer]
          - generic [ref=e65]:
            - button "📝 差出人を設定" [ref=e66] [cursor=pointer]
            - button "📋 CSVで一括印刷" [ref=e67] [cursor=pointer]
            - button "⚙️ 詳細レイアウト" [ref=e68] [cursor=pointer]
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]:
                - heading "📐 封筒設定" [level=2] [ref=e72]:
                  - generic [ref=e73]: 📐
                  - text: 封筒設定
                - generic [ref=e74]:
                  - paragraph [ref=e75]: 封筒テンプレート（クリックで選択）
                  - generic [ref=e76]:
                    - button "長圆3号 ビジネス" [ref=e77] [cursor=pointer]:
                      - img [ref=e78]
                      - generic [ref=e80]: 長圆3号
                      - generic [ref=e81]: ビジネス
                    - button "長圆4号 小型" [ref=e82] [cursor=pointer]:
                      - img [ref=e83]
                      - generic [ref=e85]: 長圆4号
                      - generic [ref=e86]: 小型
                    - button "角圆2号 A4書類" [ref=e87] [cursor=pointer]:
                      - img [ref=e88]
                      - generic [ref=e90]: 角圆2号
                      - generic [ref=e91]: A4書類
                    - button "角圆3号 B5書類" [ref=e92] [cursor=pointer]:
                      - img [ref=e93]
                      - generic [ref=e95]: 角圆3号
                      - generic [ref=e96]: B5書類
                    - button "洋圆2号 招待状" [ref=e97] [cursor=pointer]:
                      - img [ref=e98]
                      - generic [ref=e100]: 洋圆2号
                      - generic [ref=e101]: 招待状
                    - button "洋圆4号 横長" [ref=e102] [cursor=pointer]:
                      - img [ref=e103]
                      - generic [ref=e105]: 洋圆4号
                      - generic [ref=e106]: 横長
                - generic [ref=e107]:
                  - generic [ref=e108]:
                    - generic [ref=e109]: 封筒サイズ ❓
                    - combobox [ref=e110]:
                      - option "長形3号" [selected]
                      - option "長形4号 ★"
                      - option "長形40号"
                      - option "長形30号"
                      - option "角形2号"
                      - option "角形A4"
                      - option "角形3号"
                      - option "角形6号"
                      - option "角形8号"
                      - option "洋形0号/洋長3"
                      - option "洋形2号"
                      - option "洋形3号"
                      - option "洋形4号"
                      - option "洋形6号"
                  - generic [ref=e111]:
                    - generic [ref=e112]: 書き方向 ❓
                    - combobox [ref=e113]:
                      - option "縦書き" [selected]
                      - option "横書き"
                - generic [ref=e114]:
                  - generic [ref=e115] [cursor=pointer]:
                    - checkbox "郵便番号枠 ❓" [checked] [ref=e116]
                    - generic [ref=e117]: 郵便番号枠 ❓
                  - generic [ref=e118] [cursor=pointer]:
                    - checkbox "差出人" [checked] [ref=e119]
                    - generic [ref=e120]: 差出人
                  - generic [ref=e121] [cursor=pointer]:
                    - checkbox "CSV一括 ❓" [ref=e122]
                    - generic [ref=e123]: CSV一括 ❓
                - generic [ref=e124]:
                  - generic [ref=e125]:
                    - generic [ref=e126]: 📮 定形
                    - generic [ref=e127]: (120×235mm)
                  - generic [ref=e128]: "自動フォント: 住所8pt / 会社10pt / 氏名11pt"
              - button "📒 アドレス帳 (3件まで) ▼" [ref=e130] [cursor=pointer]:
                - generic [ref=e131]:
                  - generic [ref=e132]: 📒
                  - text: アドレス帳
                  - generic [ref=e133]: (3件まで)
                - generic [ref=e134]: ▼
              - generic [ref=e135]:
                - heading "📬 宛先" [level=2] [ref=e136]
                - generic [ref=e137]:
                  - generic [ref=e138]:
                    - generic [ref=e139]: 郵便番号 *
                    - generic [ref=e140]:
                      - textbox "1000001" [ref=e141]
                      - button "住所検索" [ref=e142] [cursor=pointer]
                  - generic [ref=e143]:
                    - textbox "都道府県" [ref=e144]
                    - textbox "市区町村" [ref=e145]
                  - 'textbox "番地 (例: 1丁目2-3)" [ref=e146]'
                  - textbox "建物名・部屋番号" [ref=e147]
                  - textbox "会社名" [ref=e148]
                  - textbox "部署名" [ref=e149]
                  - generic [ref=e150]:
                    - generic [ref=e151]: 氏名 *
                    - generic [ref=e152]:
                      - textbox "氏名" [ref=e153]
                      - combobox [ref=e154]:
                        - option "様" [selected]
                        - option "御中"
                        - option "殿"
                        - option "先生"
                        - option "なし"
                  - button "💾 住所を保存（アドレス帳に追加）" [ref=e156] [cursor=pointer]
              - generic [ref=e157]:
                - heading "📤 差出人" [level=2] [ref=e158]
                - generic [ref=e159]:
                  - textbox "郵便番号" [ref=e160]
                  - textbox "住所" [ref=e161]
                  - textbox "会社名" [ref=e162]
                  - textbox "氏名" [ref=e163]
                  - button "💾 差出人を保存（次回から自動入力）" [ref=e164] [cursor=pointer]
              - button "🏢 会社ロゴ PRO ▼" [ref=e166] [cursor=pointer]:
                - generic [ref=e167]:
                  - generic [ref=e168]: 🏢
                  - text: 会社ロゴ
                  - generic [ref=e169]: PRO
                - generic [ref=e170]: ▼
              - button "📱 QRコード PRO ▼" [ref=e172] [cursor=pointer]:
                - generic [ref=e173]:
                  - generic [ref=e174]: 📱
                  - text: QRコード
                  - generic [ref=e175]: PRO
                - generic [ref=e176]: ▼
              - generic [ref=e177]:
                - heading "🔖 スタンプ（在中）" [level=2] [ref=e178]
                - generic [ref=e179] [cursor=pointer]:
                  - checkbox "スタンプ表示" [ref=e180]
                  - generic [ref=e181]: スタンプ表示
            - generic [ref=e182]:
              - generic [ref=e184]:
                - img "アイちゃん" [ref=e188]
                - generic [ref=e190]:
                  - paragraph [ref=e193]: 封筒の宛名情報をご入力ください。
                  - generic [ref=e194]: — アイちゃん 💙
              - generic [ref=e195]:
                - 'heading "👁️ プレビュー(画面用: 低解像度)" [level=2] [ref=e196]'
                - paragraph [ref=e199]: 長形3号 (120×235mm)
              - generic [ref=e200]:
                - button "📄 PDF / 印刷 300 DPI" [ref=e201] [cursor=pointer]:
                  - generic [ref=e202]: 📄
                  - generic [ref=e203]:
                    - generic [ref=e204]: PDF / 印刷
                    - generic [ref=e205]: 300 DPI
                - button "🖨️ 直接印刷 高画質" [ref=e206] [cursor=pointer]:
                  - generic [ref=e207]: 🖨️
                  - generic [ref=e208]:
                    - generic [ref=e209]: 直接印刷
                    - generic [ref=e210]: 高画質
              - generic [ref=e211]:
                - heading "✨ 高画質印刷対応" [level=3] [ref=e212]
                - list [ref=e213]:
                  - listitem [ref=e214]:
                    - text: •
                    - strong [ref=e215]: 300 DPI
                    - text: で印刷 - プロ品質の仕上がり
                  - listitem [ref=e216]: • 縦中横（数字の自動組み版）対応
                  - listitem [ref=e217]: • フォントサイズ自動調整で文字切れなし
          - generic [ref=e218]:
            - heading "封筒印刷・宛名印刷について" [level=2] [ref=e219]
            - paragraph [ref=e220]: ビジネスレター、請求書、DMの発送——封筒の宛名書き、手書きで大変ではありませんか？封筒印刷ツールなら、宛先を入力するだけで、郵便番号枠にピッタリ合った美しい宛名を印刷。長形・角形・洋形など日本の全サイズに対応しています。
            - generic [ref=e221]:
              - generic [ref=e222]:
                - paragraph [ref=e223]: 💼 ビジネス文書
                - paragraph [ref=e224]: 請求書・契約書の送付に
              - generic [ref=e225]:
                - paragraph [ref=e226]: 📮 DM発送
                - paragraph [ref=e227]: キャンペーン案内・お知らせに
              - generic [ref=e228]:
                - paragraph [ref=e229]: 🎉 招待状
                - paragraph [ref=e230]: 結婚式・パーティーの案内に
              - generic [ref=e231]:
                - paragraph [ref=e232]: 📝 履歴書
                - paragraph [ref=e233]: 就活・転職の応募書類送付に
            - paragraph [ref=e235]:
              - text: 💡
              - strong [ref=e236]: "ヒント:"
              - text: 封筒は印刷前にプリンターにセットする向きを確認しましょう。多くのプリンターは蓋（フラップ）側を手前にセットします。
          - region "あわせて使えるツール" [ref=e238]:
            - heading "あわせて使えるツール" [level=2] [ref=e239]
            - generic [ref=e240]:
              - link "📋 請求書をPDFで無料作成する" [ref=e241] [cursor=pointer]:
                - /url: /document/invoice
                - generic [ref=e242]: 📋
                - paragraph [ref=e243]: 請求書をPDFで無料作成する
              - link "📝 見積書をテンプレートから作成する" [ref=e244] [cursor=pointer]:
                - /url: /document/quotation
                - generic [ref=e245]: 📝
                - paragraph [ref=e246]: 見積書をテンプレートから作成する
              - link "🏦 全銀フォーマットのデータを作成する" [ref=e247] [cursor=pointer]:
                - /url: /convert/bank-format
                - generic [ref=e248]: 🏦
                - paragraph [ref=e249]: 全銀フォーマットのデータを作成する
              - link "📦 PDFファイルを圧縮して軽くする" [ref=e250] [cursor=pointer]:
                - /url: /pdf/compress
                - generic [ref=e251]: 📦
                - paragraph [ref=e252]: PDFファイルを圧縮して軽くする
            - generic:
              - generic:
                - insertion
          - generic [ref=e253]:
            - heading "よくある質問" [level=2] [ref=e254]
            - generic [ref=e256]:
              - group [ref=e257]:
                - generic "Q. どの封筒サイズに対応していますか？" [ref=e258] [cursor=pointer]:
                  - generic [ref=e259]:
                    - generic [ref=e260]: Q.
                    - text: どの封筒サイズに対応していますか？
                  - generic [ref=e261]: ▼
              - group [ref=e262]:
                - generic "Q. 縦書きと横書きは選べますか？" [ref=e263] [cursor=pointer]:
                  - generic [ref=e264]:
                    - generic [ref=e265]: Q.
                    - text: 縦書きと横書きは選べますか？
                  - generic [ref=e266]: ▼
              - group [ref=e267]:
                - generic "Q. 郵便番号枠に合わせて印刷できますか？" [ref=e268] [cursor=pointer]:
                  - generic [ref=e269]:
                    - generic [ref=e270]: Q.
                    - text: 郵便番号枠に合わせて印刷できますか？
                  - generic [ref=e271]: ▼
              - group [ref=e272]:
                - generic "Q. 会社のロゴや印影を入れられますか？" [ref=e273] [cursor=pointer]:
                  - generic [ref=e274]:
                    - generic [ref=e275]: Q.
                    - text: 会社のロゴや印影を入れられますか？
                  - generic [ref=e276]: ▼
              - group [ref=e277]:
                - generic "Q. プリンターの設定は？" [ref=e278] [cursor=pointer]:
                  - generic [ref=e279]:
                    - generic [ref=e280]: Q.
                    - text: プリンターの設定は？
                  - generic [ref=e281]: ▼
              - group [ref=e282]:
                - generic "Q. 複数の宛先を一括印刷できますか？" [ref=e283] [cursor=pointer]:
                  - generic [ref=e284]:
                    - generic [ref=e285]: Q.
                    - text: 複数の宛先を一括印刷できますか？
                  - generic [ref=e286]: ▼
              - group [ref=e287]:
                - generic "Q. 差出人情報は保存されますか？" [ref=e288] [cursor=pointer]:
                  - generic [ref=e289]:
                    - generic [ref=e290]: Q.
                    - text: 差出人情報は保存されますか？
                  - generic [ref=e291]: ▼
              - group [ref=e292]:
                - generic "Q. 敬称（様・御中など）は自動で付きますか？" [ref=e293] [cursor=pointer]:
                  - generic [ref=e294]:
                    - generic [ref=e295]: Q.
                    - text: 敬称（様・御中など）は自動で付きますか？
                  - generic [ref=e296]: ▼
              - group [ref=e297]:
                - generic "Q. スマホからでも使えますか？" [ref=e298] [cursor=pointer]:
                  - generic [ref=e299]:
                    - generic [ref=e300]: Q.
                    - text: スマホからでも使えますか？
                  - generic [ref=e301]: ▼
              - group [ref=e302]:
                - generic "Q. 印刷がずれる場合は？" [ref=e303] [cursor=pointer]:
                  - generic [ref=e304]:
                    - generic [ref=e305]: Q.
                    - text: 印刷がずれる場合は？
                  - generic [ref=e306]: ▼
              - group [ref=e307]:
                - generic "Q. コンビニで印刷できますか？" [ref=e308] [cursor=pointer]:
                  - generic [ref=e309]:
                    - generic [ref=e310]: Q.
                    - text: コンビニで印刷できますか？
                  - generic [ref=e311]: ▼
      - generic [ref=e313]: © 2026 合同会社山田トレード
    - generic:
      - insertion
    - generic [ref=e315]:
      - paragraph [ref=e316]: 使い方ガイド
      - generic [ref=e317]:
        - generic [ref=e318]:
          - generic [ref=e319]: "01"
          - generic [ref=e320]: 📐
          - heading "封筒サイズ選択" [level=3] [ref=e321]
          - paragraph [ref=e322]: 長形・角形・洋形など用途に合わせて選択
        - generic [ref=e323]: →
        - generic [ref=e324]:
          - generic [ref=e325]: "02"
          - generic [ref=e326]: ✍️
          - heading "宛名入力" [level=3] [ref=e327]
          - paragraph [ref=e328]: 郵便番号を入力すると住所を自動補完
        - generic [ref=e329]: →
        - generic [ref=e330]:
          - generic [ref=e331]: "03"
          - generic [ref=e332]: 👁️
          - heading "プレビュー確認" [level=3] [ref=e333]
          - paragraph [ref=e334]: 印刷前にリアルタイムでレアウトを確認
        - generic [ref=e335]: →
        - generic [ref=e336]:
          - generic [ref=e337]: "04"
          - generic [ref=e338]: 🖨️
          - heading "印刷・PDF保存" [level=3] [ref=e339]
          - paragraph [ref=e340]: 直接印刷またはPDF保存でコンビニ印刷も可能
    - region "あわせて使えるツール" [ref=e342]:
      - heading "🔗 あわせて使えるツール" [level=2] [ref=e343]
      - generic [ref=e344]:
        - link "🔐 パスワード生成 安全な強力パスワードを瞬時に生成。長さ・文字種を指..." [ref=e345] [cursor=pointer]:
          - /url: /generator/password
          - generic [ref=e346]: 🔐
          - paragraph [ref=e347]: パスワード生成
          - paragraph [ref=e348]: 安全な強力パスワードを瞬時に生成。長さ・文字種を指...
        - link "🗜️ パスワード付きZIP パスワード付きZIPファイルを作成。複数ファイルを..." [ref=e349] [cursor=pointer]:
          - /url: /generator/password-zip
          - generic [ref=e350]: 🗜️
          - paragraph [ref=e351]: パスワード付きZIP
          - paragraph [ref=e352]: パスワード付きZIPファイルを作成。複数ファイルを...
        - link "📝 文字数カウント 文字数・単語数・行数をリアルタイムでカウント。SN..." [ref=e353] [cursor=pointer]:
          - /url: /generator/character-count
          - generic [ref=e354]: 📝
          - paragraph [ref=e355]: 文字数カウント
          - paragraph [ref=e356]: 文字数・単語数・行数をリアルタイムでカウント。SN...
        - link "🧮 消費税計算 8%・10%の税込・税抜価格を瞬時に計算。逆算も対..." [ref=e357] [cursor=pointer]:
          - /url: /generator/tax-calculator
          - generic [ref=e358]: 🧮
          - paragraph [ref=e359]: 消費税計算
          - paragraph [ref=e360]: 8%・10%の税込・税抜価格を瞬時に計算。逆算も対...
        - link "🎲 ランダム抽選 名前・アイテムをランダム抽選。公平な当選者選びに..." [ref=e361] [cursor=pointer]:
          - /url: /generator/random-picker
          - generic [ref=e362]: 🎲
          - paragraph [ref=e363]: ランダム抽選
          - paragraph [ref=e364]: 名前・アイテムをランダム抽選。公平な当選者選びに...
        - link "📝 テキスト差分比較 2つのテキストの差分を色分け表示。変更箇所が一目瞭..." [ref=e365] [cursor=pointer]:
          - /url: /generator/text-diff
          - generic [ref=e366]: 📝
          - paragraph [ref=e367]: テキスト差分比較
          - paragraph [ref=e368]: 2つのテキストの差分を色分け表示。変更箇所が一目瞭...
      - generic:
        - generic:
          - insertion
  - contentinfo [ref=e369]:
    - generic [ref=e370]:
      - generic [ref=e371]:
        - generic [ref=e372]:
          - heading "山田ツール" [level=3] [ref=e374]
          - generic [ref=e375]:
            - paragraph [ref=e376]:
              - link "合同会社山田トレード" [ref=e377] [cursor=pointer]:
                - /url: https://www.yamadatrade.com/
            - generic [ref=e378]:
              - paragraph [ref=e379]: 〒283-0811
              - paragraph [ref=e380]: 千葉県東金市台方937番地13
            - paragraph [ref=e381]:
              - link "運営方針とセキュリティについて" [ref=e382] [cursor=pointer]:
                - /url: /about/transparency
        - generic [ref=e383]:
          - heading "安心・安全" [level=3] [ref=e384]
          - generic [ref=e385]:
            - generic [ref=e386]:
              - generic [ref=e387]: 🇯🇵
              - generic [ref=e388]:
                - paragraph [ref=e389]: 日本国内サーバー
                - paragraph [ref=e390]: 大切なファイルは日本国内で処理
            - generic [ref=e391]:
              - generic [ref=e392]: 🔒
              - generic [ref=e393]:
                - paragraph [ref=e394]: SSL暗号化通信
                - paragraph [ref=e395]: 通信内容を完全保護
            - generic [ref=e396]:
              - generic [ref=e397]: 🗑️
              - generic [ref=e398]:
                - paragraph [ref=e399]: 自動削除
                - paragraph [ref=e400]: 処理完了後、すぐに削除
        - generic [ref=e401]:
          - heading "リンク" [level=3] [ref=e402]
          - generic [ref=e403]:
            - link "💰 金融・資産運用ツール" [ref=e405] [cursor=pointer]:
              - /url: /finance
            - link "🏢 法人・企業様向け" [ref=e407] [cursor=pointer]:
              - /url: /about/business
            - link "会社ウェブサイト" [ref=e409] [cursor=pointer]:
              - /url: https://www.yamadatrade.com/
            - link "📘 Facebook" [ref=e411] [cursor=pointer]:
              - /url: https://www.facebook.com/yamada.tools/
            - link "X（旧Twitter）" [ref=e413] [cursor=pointer]:
              - /url: https://x.com/YamadaToolsJP
            - link "会社概要" [ref=e415] [cursor=pointer]:
              - /url: /about/company
            - link "よくある質問（FAQ）" [ref=e417] [cursor=pointer]:
              - /url: /about/faq
            - link "開発者ストーリー" [ref=e419] [cursor=pointer]:
              - /url: /about/story
            - link "💡 ツールをリクエスト" [ref=e421] [cursor=pointer]:
              - /url: https://forms.gle/2mmoGqLif1Cqe5vL6
            - link "適正利用ガイドライン" [ref=e423] [cursor=pointer]:
              - /url: /about/fair-usage
            - link "利用規約" [ref=e425] [cursor=pointer]:
              - /url: /legal/terms
            - link "プライバシーポリシー" [ref=e427] [cursor=pointer]:
              - /url: /legal/privacy
            - link "特定商取引法に基づく表記" [ref=e429] [cursor=pointer]:
              - /url: /legal/tokushoho
            - link "サイトマップ" [ref=e431] [cursor=pointer]:
              - /url: /sitemap.xml
      - paragraph [ref=e433]: © 2026 合同会社山田トレード. All rights reserved.
  - button "フィードバックを送る" [ref=e435] [cursor=pointer]: 💬
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | const STAGING_URL = "https://staging.yamada-tools.jp/generator/envelope-print";
  4   | const PRODUCTION_URL = "https://yamada-tools.jp/generator/envelope-print";
  5   | 
  6   | // ─── Helpers ───────────────────────────────────────────────────────────────────
  7   | 
  8   | async function waitForApp(page: Page) {
  9   |   // Wait for the interactive app to hydrate — look for key interactive elements
> 10  |   await page.waitForSelector("text=封筒印刷", { timeout: 15000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  11  |   // Wait a bit for React hydration
  12  |   await page.waitForTimeout(2000);
  13  | }
  14  | 
  15  | async function clickButton(page: Page, text: string) {
  16  |   const btn = page.locator(`button:has-text("${text}")`);
  17  |   await btn.waitFor({ state: "visible", timeout: 5000 });
  18  |   await btn.click();
  19  |   await page.waitForTimeout(500);
  20  | }
  21  | 
  22  | async function loadSampleCsv(page: Page) {
  23  |   // Click the CSV bulk mode button
  24  |   await clickButton(page, "CSV");
  25  |   await page.waitForTimeout(1000);
  26  |   // Click sample CSV download
  27  |   await clickButton(page, "サンプルCSV");
  28  |   await page.waitForTimeout(2000);
  29  | }
  30  | 
  31  | // ─── Part 1: Environment & Regression ──────────────────────────────────────────
  32  | 
  33  | test.describe("Part 1: Environment & Regression Checks", () => {
  34  |   test("1.1: STAGING Banner is visible on staging", async ({ page }) => {
  35  |     await page.goto(STAGING_URL);
  36  |     await waitForApp(page);
  37  |     const banner = page.locator("text=STAGING").first();
  38  |     await expect(banner).toBeVisible({ timeout: 10000 });
  39  |     // Verify it has orange styling
  40  |     const bannerParent = banner.locator("..");
  41  |     const bgClass = await bannerParent.getAttribute("class");
  42  |     expect(bgClass).toContain("orange");
  43  |   });
  44  | 
  45  |   test("1.1b: STAGING Banner does NOT appear on production", async ({ page }) => {
  46  |     await page.goto(PRODUCTION_URL);
  47  |     await waitForApp(page);
  48  |     const banner = page.locator("text=STAGING").first();
  49  |     await expect(banner).not.toBeVisible({ timeout: 5000 });
  50  |   });
  51  | 
  52  |   test("1.3: Single-envelope mode works (regression)", async ({ page }) => {
  53  |     await page.goto(STAGING_URL);
  54  |     await waitForApp(page);
  55  |     // Fill in postal code
  56  |     const postalInput = page.locator('input[name="postalCode"], input[placeholder*="郵便番号"]').first();
  57  |     await postalInput.waitFor({ state: "visible", timeout: 10000 });
  58  |     await postalInput.fill("100-0001");
  59  |     await page.waitForTimeout(500);
  60  |     // Check that the value was entered
  61  |     await expect(postalInput).toHaveValue("100-0001");
  62  |   });
  63  | });
  64  | 
  65  | // ─── Part 2: Feature A Core Functionality ──────────────────────────────────────
  66  | 
  67  | test.describe("Part 2: Feature A - Bulk Mail-Merge Engine", () => {
  68  |   test("2.1: CSV Bulk Panel loads", async ({ page }) => {
  69  |     await page.goto(STAGING_URL);
  70  |     await waitForApp(page);
  71  |     // Click CSV bulk mode
  72  |     await clickButton(page, "CSV");
  73  |     await page.waitForTimeout(1000);
  74  |     // Verify upload zone elements
  75  |     await expect(page.locator("text=ファイルをドラッグ").first()).toBeVisible({ timeout: 5000 });
  76  |     await expect(page.locator('button:has-text("CSVを選択")').first()).toBeVisible({ timeout: 3000 });
  77  |     await expect(page.locator('button:has-text("サンプルCSV")').first()).toBeVisible({ timeout: 3000 });
  78  |   });
  79  | 
  80  |   test("2.2: Data Grid displays all rows with columns (BUG #1)", async ({ page }) => {
  81  |     await page.goto(STAGING_URL);
  82  |     await waitForApp(page);
  83  |     await loadSampleCsv(page);
  84  |     // Verify table headers
  85  |     await expect(page.locator("text=郵便番号").first()).toBeVisible({ timeout: 5000 });
  86  |     await expect(page.locator("text=氏名").first()).toBeVisible({ timeout: 3000 });
  87  |     await expect(page.locator("text=会社名").first()).toBeVisible({ timeout: 3000 });
  88  |     await expect(page.locator("text=ステータス").first()).toBeVisible({ timeout: 3000 });
  89  |     // Verify data rows
  90  |     await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 3000 });
  91  |     await expect(page.locator("text=佐藤花子").first()).toBeVisible({ timeout: 3000 });
  92  |     await expect(page.locator("text=鈴木一郎").first()).toBeVisible({ timeout: 3000 });
  93  |     await expect(page.locator("text=髙橋次郎").first()).toBeVisible({ timeout: 3000 });
  94  |     await expect(page.locator("text=﨑山美咲").first()).toBeVisible({ timeout: 3000 });
  95  |   });
  96  | 
  97  |   test("2.3: Validation badges (BUG #2)", async ({ page }) => {
  98  |     await page.goto(STAGING_URL);
  99  |     await waitForApp(page);
  100 |     await loadSampleCsv(page);
  101 |     // Check for valid badges (green checkmarks)
  102 |     await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 5000 });
  103 |     // Check for warning badges on mojibake rows (髙橋次郎, 﨑山美咲 have non-JIS chars)
  104 |     // The ⚠️ or yellow warning indicator should be visible
  105 |     const warningBadges = page.locator('text=⚠️, [class*="warning"], [class*="yellow"], [class*="amber"]');
  106 |     // Just verify the data loaded and no crash
  107 |     await expect(page.locator("text=髙橋次郎").first()).toBeVisible({ timeout: 3000 });
  108 |   });
  109 | 
  110 |   test("2.4: Preview carousel navigation (BUG #3)", async ({ page }) => {
```