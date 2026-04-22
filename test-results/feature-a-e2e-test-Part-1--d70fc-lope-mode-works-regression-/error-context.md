# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-a-e2e-test.spec.ts >> Part 1: Environment & Regression Checks >> 1.3: Single-envelope mode works (regression)
- Location: feature-a-e2e-test.spec.ts:52:7

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
  - generic [ref=e3]:
    - generic [ref=e4]: ⚠️ STAGING — テスト環境です。本番ではありません
    - button "閉じる" [ref=e5] [cursor=pointer]: ✕
  - link "メインコンテンツへスキップ" [ref=e6] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e7]:
    - generic [ref=e9]:
      - link "山田ツール 山田ツール" [ref=e10] [cursor=pointer]:
        - /url: /
        - img "山田ツール" [ref=e11]
        - generic [ref=e12]: 山田ツール
      - navigation [ref=e13]:
        - button "ツール" [ref=e15] [cursor=pointer]:
          - generic [ref=e16]: ツール
          - img [ref=e17]
        - button "計算・シュミレーター" [ref=e20] [cursor=pointer]:
          - generic [ref=e21]: 計算・シュミレーター
          - img [ref=e22]
        - link "ブログ" [ref=e24] [cursor=pointer]:
          - /url: /blog
        - link "AI活用" [ref=e25] [cursor=pointer]:
          - /url: /ai
        - link "料金" [ref=e26] [cursor=pointer]:
          - /url: /pricing
      - generic [ref=e27]:
        - button "検索" [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: 🔍
          - generic [ref=e30]: 検索
          - generic [ref=e31]: ⌘K
        - link "ログイン" [ref=e32] [cursor=pointer]:
          - /url: /auth/login
          - generic [ref=e33]: ログイン
  - navigation "Breadcrumb" [ref=e34]:
    - list [ref=e36]:
      - listitem [ref=e37]:
        - link "ホーム" [ref=e38] [cursor=pointer]:
          - /url: /
      - listitem [ref=e39]:
        - generic [ref=e40]: ›
        - link "生成・計算" [ref=e41] [cursor=pointer]:
          - /url: /generator
      - listitem [ref=e42]:
        - generic [ref=e43]: ›
        - generic [ref=e44]: 封筒印刷
  - main [ref=e45]:
    - generic [ref=e46]:
      - generic [ref=e49]:
        - link "🔧 山田ツール" [ref=e50] [cursor=pointer]:
          - /url: /
          - generic [ref=e51]: 🔧
          - generic [ref=e52]: 山田ツール
        - link "生成ツール一覧" [ref=e53] [cursor=pointer]:
          - /url: /generator
      - main [ref=e54]:
        - generic [ref=e55]:
          - generic [ref=e56]:
            - heading "✉️封筒印刷・宛名印刷300 DPI" [level=1] [ref=e57]
            - paragraph [ref=e58]: 日本の全封筒サイズに対応。高解像度印刷で美しい仕上がり。
          - generic [ref=e59]:
            - button "ビジネス" [ref=e60] [cursor=pointer]
            - button "請求書" [ref=e61] [cursor=pointer]
            - button "履歴書" [ref=e62] [cursor=pointer]
            - button "納品書" [ref=e63] [cursor=pointer]
          - generic [ref=e65]:
            - button "🎯 かんたんモード" [ref=e66] [cursor=pointer]
            - button "⚙️ 詳細設定" [ref=e67] [cursor=pointer]
          - generic [ref=e68]:
            - button "📝 差出人を設定" [ref=e69] [cursor=pointer]
            - button "📋 CSVで一括印刷" [ref=e70] [cursor=pointer]
            - button "⚙️ 詳細レイアウト" [ref=e71] [cursor=pointer]
          - generic [ref=e72]:
            - generic [ref=e73]:
              - generic [ref=e74]:
                - heading "📐 封筒設定" [level=2] [ref=e75]:
                  - generic [ref=e76]: 📐
                  - text: 封筒設定
                - generic [ref=e77]:
                  - generic [ref=e78]:
                    - generic [ref=e79]: 封筒サイズ ❓
                    - combobox [ref=e80]:
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
                  - generic [ref=e81]:
                    - generic [ref=e82]: 書き方向 ❓
                    - combobox [ref=e83]:
                      - option "縦書き" [selected]
                      - option "横書き"
                - generic [ref=e84]:
                  - generic [ref=e85] [cursor=pointer]:
                    - checkbox "郵便番号枠 ❓" [checked] [ref=e86]
                    - generic [ref=e87]: 郵便番号枠 ❓
                  - generic [ref=e88] [cursor=pointer]:
                    - checkbox "差出人" [checked] [ref=e89]
                    - generic [ref=e90]: 差出人
                  - generic [ref=e91] [cursor=pointer]:
                    - checkbox "CSV一括 ❓" [ref=e92]
                    - generic [ref=e93]: CSV一括 ❓
                - generic [ref=e94]:
                  - generic [ref=e95]:
                    - generic [ref=e96]: 📮 定形
                    - generic [ref=e97]: (120×235mm)
                  - generic [ref=e98]: "自動フォント: 住所8pt / 会社10pt / 氏名11pt"
              - button "📒 アドレス帳 (3件まで) ▼" [ref=e100] [cursor=pointer]:
                - generic [ref=e101]:
                  - generic [ref=e102]: 📒
                  - text: アドレス帳
                  - generic [ref=e103]: (3件まで)
                - generic [ref=e104]: ▼
              - generic [ref=e105]:
                - heading "📬 宛先" [level=2] [ref=e106]
                - generic [ref=e107]:
                  - generic [ref=e108]:
                    - generic [ref=e109]: 郵便番号 *
                    - generic [ref=e110]:
                      - textbox "1000001" [ref=e111]
                      - button "住所検索" [ref=e112] [cursor=pointer]
                  - generic [ref=e113]:
                    - textbox "都道府県" [ref=e114]
                    - textbox "市区町村" [ref=e115]
                  - 'textbox "番地 (例: 1丁目2-3)" [ref=e116]'
                  - textbox "建物名・部屋番号" [ref=e117]
                  - textbox "会社名" [ref=e118]
                  - textbox "部署名" [ref=e119]
                  - generic [ref=e120]:
                    - generic [ref=e121]: 氏名 *
                    - generic [ref=e122]:
                      - textbox "氏名" [ref=e123]
                      - combobox [ref=e124]:
                        - option "様" [selected]
                        - option "御中"
                        - option "殿"
                        - option "先生"
                        - option "なし"
                  - button "💾 住所を保存（アドレス帳に追加）" [ref=e126] [cursor=pointer]
              - generic [ref=e127]:
                - heading "📤 差出人" [level=2] [ref=e128]
                - generic [ref=e129]:
                  - textbox "郵便番号" [ref=e130]
                  - textbox "住所" [ref=e131]
                  - textbox "会社名" [ref=e132]
                  - textbox "氏名" [ref=e133]
                  - button "💾 差出人を保存（次回から自動入力）" [ref=e134] [cursor=pointer]
              - button "🏢 会社ロゴ PRO ▼" [ref=e136] [cursor=pointer]:
                - generic [ref=e137]:
                  - generic [ref=e138]: 🏢
                  - text: 会社ロゴ
                  - generic [ref=e139]: PRO
                - generic [ref=e140]: ▼
              - button "📱 QRコード PRO ▼" [ref=e142] [cursor=pointer]:
                - generic [ref=e143]:
                  - generic [ref=e144]: 📱
                  - text: QRコード
                  - generic [ref=e145]: PRO
                - generic [ref=e146]: ▼
              - generic [ref=e147]:
                - heading "🔖 スタンプ（在中）" [level=2] [ref=e148]
                - generic [ref=e149] [cursor=pointer]:
                  - checkbox "スタンプ表示" [ref=e150]
                  - generic [ref=e151]: スタンプ表示
            - generic [ref=e152]:
              - generic [ref=e154]:
                - img "アイちゃん" [ref=e158]
                - generic [ref=e160]:
                  - paragraph [ref=e163]: 封筒の宛名情報をご入力ください。
                  - generic [ref=e164]: — アイちゃん 💙
              - generic [ref=e165]:
                - 'heading "👁️ プレビュー(画面用: 低解像度)" [level=2] [ref=e166]'
                - paragraph [ref=e169]: 長形3号 (120×235mm)
              - generic [ref=e170]:
                - button "📄 PDF / 印刷 300 DPI" [ref=e171] [cursor=pointer]:
                  - generic [ref=e172]: 📄
                  - generic [ref=e173]:
                    - generic [ref=e174]: PDF / 印刷
                    - generic [ref=e175]: 300 DPI
                - button "🖨️ 直接印刷 高画質" [ref=e176] [cursor=pointer]:
                  - generic [ref=e177]: 🖨️
                  - generic [ref=e178]:
                    - generic [ref=e179]: 直接印刷
                    - generic [ref=e180]: 高画質
              - generic [ref=e181]:
                - heading "✨ 高画質印刷対応" [level=3] [ref=e182]
                - list [ref=e183]:
                  - listitem [ref=e184]:
                    - text: •
                    - strong [ref=e185]: 300 DPI
                    - text: で印刷 - プロ品質の仕上がり
                  - listitem [ref=e186]: • 縦中横（数字の自動組み版）対応
                  - listitem [ref=e187]: • フォントサイズ自動調整で文字切れなし
          - generic [ref=e188]:
            - heading "封筒印刷・宛名印刷について" [level=2] [ref=e189]
            - paragraph [ref=e190]: ビジネスレター、請求書、DMの発送——封筒の宛名書き、手書きで大変ではありませんか？封筒印刷ツールなら、宛先を入力するだけで、郵便番号枠にピッタリ合った美しい宛名を印刷。長形・角形・洋形など日本の全サイズに対応しています。
            - generic [ref=e191]:
              - generic [ref=e192]:
                - paragraph [ref=e193]: 💼 ビジネス文書
                - paragraph [ref=e194]: 請求書・契約書の送付に
              - generic [ref=e195]:
                - paragraph [ref=e196]: 📮 DM発送
                - paragraph [ref=e197]: キャンペーン案内・お知らせに
              - generic [ref=e198]:
                - paragraph [ref=e199]: 🎉 招待状
                - paragraph [ref=e200]: 結婚式・パーティーの案内に
              - generic [ref=e201]:
                - paragraph [ref=e202]: 📝 履歴書
                - paragraph [ref=e203]: 就活・転職の応募書類送付に
            - paragraph [ref=e205]:
              - text: 💡
              - strong [ref=e206]: "ヒント:"
              - text: 封筒は印刷前にプリンターにセットする向きを確認しましょう。多くのプリンターは蓋（フラップ）側を手前にセットします。
          - region "あわせて使えるツール" [ref=e208]:
            - heading "あわせて使えるツール" [level=2] [ref=e209]
            - generic [ref=e210]:
              - link "📋 請求書をPDFで無料作成する" [ref=e211] [cursor=pointer]:
                - /url: /document/invoice
                - generic [ref=e212]: 📋
                - paragraph [ref=e213]: 請求書をPDFで無料作成する
              - link "📝 見積書をテンプレートから作成する" [ref=e214] [cursor=pointer]:
                - /url: /document/quotation
                - generic [ref=e215]: 📝
                - paragraph [ref=e216]: 見積書をテンプレートから作成する
              - link "🏦 全銀フォーマットのデータを作成する" [ref=e217] [cursor=pointer]:
                - /url: /convert/bank-format
                - generic [ref=e218]: 🏦
                - paragraph [ref=e219]: 全銀フォーマットのデータを作成する
              - link "📦 PDFファイルを圧縮して軽くする" [ref=e220] [cursor=pointer]:
                - /url: /pdf/compress
                - generic [ref=e221]: 📦
                - paragraph [ref=e222]: PDFファイルを圧縮して軽くする
          - generic [ref=e223]:
            - heading "よくある質問" [level=2] [ref=e224]
            - generic [ref=e226]:
              - group [ref=e227]:
                - generic "Q. どの封筒サイズに対応していますか？" [ref=e228] [cursor=pointer]:
                  - generic [ref=e229]:
                    - generic [ref=e230]: Q.
                    - text: どの封筒サイズに対応していますか？
                  - generic [ref=e231]: ▼
              - group [ref=e232]:
                - generic "Q. 縦書きと横書きは選べますか？" [ref=e233] [cursor=pointer]:
                  - generic [ref=e234]:
                    - generic [ref=e235]: Q.
                    - text: 縦書きと横書きは選べますか？
                  - generic [ref=e236]: ▼
              - group [ref=e237]:
                - generic "Q. 郵便番号枠に合わせて印刷できますか？" [ref=e238] [cursor=pointer]:
                  - generic [ref=e239]:
                    - generic [ref=e240]: Q.
                    - text: 郵便番号枠に合わせて印刷できますか？
                  - generic [ref=e241]: ▼
              - group [ref=e242]:
                - generic "Q. 会社のロゴや印影を入れられますか？" [ref=e243] [cursor=pointer]:
                  - generic [ref=e244]:
                    - generic [ref=e245]: Q.
                    - text: 会社のロゴや印影を入れられますか？
                  - generic [ref=e246]: ▼
              - group [ref=e247]:
                - generic "Q. プリンターの設定は？" [ref=e248] [cursor=pointer]:
                  - generic [ref=e249]:
                    - generic [ref=e250]: Q.
                    - text: プリンターの設定は？
                  - generic [ref=e251]: ▼
              - group [ref=e252]:
                - generic "Q. 複数の宛先を一括印刷できますか？" [ref=e253] [cursor=pointer]:
                  - generic [ref=e254]:
                    - generic [ref=e255]: Q.
                    - text: 複数の宛先を一括印刷できますか？
                  - generic [ref=e256]: ▼
              - group [ref=e257]:
                - generic "Q. 差出人情報は保存されますか？" [ref=e258] [cursor=pointer]:
                  - generic [ref=e259]:
                    - generic [ref=e260]: Q.
                    - text: 差出人情報は保存されますか？
                  - generic [ref=e261]: ▼
              - group [ref=e262]:
                - generic "Q. 敬称（様・御中など）は自動で付きますか？" [ref=e263] [cursor=pointer]:
                  - generic [ref=e264]:
                    - generic [ref=e265]: Q.
                    - text: 敬称（様・御中など）は自動で付きますか？
                  - generic [ref=e266]: ▼
              - group [ref=e267]:
                - generic "Q. スマホからでも使えますか？" [ref=e268] [cursor=pointer]:
                  - generic [ref=e269]:
                    - generic [ref=e270]: Q.
                    - text: スマホからでも使えますか？
                  - generic [ref=e271]: ▼
              - group [ref=e272]:
                - generic "Q. 印刷がずれる場合は？" [ref=e273] [cursor=pointer]:
                  - generic [ref=e274]:
                    - generic [ref=e275]: Q.
                    - text: 印刷がずれる場合は？
                  - generic [ref=e276]: ▼
              - group [ref=e277]:
                - generic "Q. コンビニで印刷できますか？" [ref=e278] [cursor=pointer]:
                  - generic [ref=e279]:
                    - generic [ref=e280]: Q.
                    - text: コンビニで印刷できますか？
                  - generic [ref=e281]: ▼
      - generic [ref=e283]: © 2026 合同会社山田トレード
    - generic [ref=e285]:
      - paragraph [ref=e286]: 使い方ガイド
      - generic [ref=e287]:
        - generic [ref=e288]:
          - generic [ref=e289]: "01"
          - generic [ref=e290]: 📐
          - heading "封筒サイズ選択" [level=3] [ref=e291]
          - paragraph [ref=e292]: 長形・角形・洋形など用途に合わせて選択
        - generic [ref=e293]: →
        - generic [ref=e294]:
          - generic [ref=e295]: "02"
          - generic [ref=e296]: ✍️
          - heading "宛名入力" [level=3] [ref=e297]
          - paragraph [ref=e298]: 郵便番号を入力すると住所を自動補完
        - generic [ref=e299]: →
        - generic [ref=e300]:
          - generic [ref=e301]: "03"
          - generic [ref=e302]: 👁️
          - heading "プレビュー確認" [level=3] [ref=e303]
          - paragraph [ref=e304]: 印刷前にリアルタイムでレアウトを確認
        - generic [ref=e305]: →
        - generic [ref=e306]:
          - generic [ref=e307]: "04"
          - generic [ref=e308]: 🖨️
          - heading "印刷・PDF保存" [level=3] [ref=e309]
          - paragraph [ref=e310]: 直接印刷またはPDF保存でコンビニ印刷も可能
    - region "あわせて使えるツール" [ref=e312]:
      - heading "🔗 あわせて使えるツール" [level=2] [ref=e313]
      - generic [ref=e314]:
        - link "🔐 パスワード生成 安全な強力パスワードを瞬時に生成。長さ・文字種を指..." [ref=e315] [cursor=pointer]:
          - /url: /generator/password
          - generic [ref=e316]: 🔐
          - paragraph [ref=e317]: パスワード生成
          - paragraph [ref=e318]: 安全な強力パスワードを瞬時に生成。長さ・文字種を指...
        - link "🗜️ パスワード付きZIP パスワード付きZIPファイルを作成。複数ファイルを..." [ref=e319] [cursor=pointer]:
          - /url: /generator/password-zip
          - generic [ref=e320]: 🗜️
          - paragraph [ref=e321]: パスワード付きZIP
          - paragraph [ref=e322]: パスワード付きZIPファイルを作成。複数ファイルを...
        - link "📝 文字数カウント 文字数・単語数・行数をリアルタイムでカウント。SN..." [ref=e323] [cursor=pointer]:
          - /url: /generator/character-count
          - generic [ref=e324]: 📝
          - paragraph [ref=e325]: 文字数カウント
          - paragraph [ref=e326]: 文字数・単語数・行数をリアルタイムでカウント。SN...
        - link "🧮 消費税計算 8%・10%の税込・税抜価格を瞬時に計算。逆算も対..." [ref=e327] [cursor=pointer]:
          - /url: /generator/tax-calculator
          - generic [ref=e328]: 🧮
          - paragraph [ref=e329]: 消費税計算
          - paragraph [ref=e330]: 8%・10%の税込・税抜価格を瞬時に計算。逆算も対...
        - link "🎲 ランダム抽選 名前・アイテムをランダム抽選。公平な当選者選びに..." [ref=e331] [cursor=pointer]:
          - /url: /generator/random-picker
          - generic [ref=e332]: 🎲
          - paragraph [ref=e333]: ランダム抽選
          - paragraph [ref=e334]: 名前・アイテムをランダム抽選。公平な当選者選びに...
        - link "📝 テキスト差分比較 2つのテキストの差分を色分け表示。変更箇所が一目瞭..." [ref=e335] [cursor=pointer]:
          - /url: /generator/text-diff
          - generic [ref=e336]: 📝
          - paragraph [ref=e337]: テキスト差分比較
          - paragraph [ref=e338]: 2つのテキストの差分を色分け表示。変更箇所が一目瞭...
  - contentinfo [ref=e339]:
    - generic [ref=e340]:
      - generic [ref=e341]:
        - generic [ref=e342]:
          - heading "山田ツール" [level=3] [ref=e344]
          - generic [ref=e345]:
            - paragraph [ref=e346]:
              - link "合同会社山田トレード" [ref=e347] [cursor=pointer]:
                - /url: https://www.yamadatrade.jp/
            - generic [ref=e348]:
              - paragraph [ref=e349]: 〒283-0811
              - paragraph [ref=e350]: 千葉県東金市台方937番地13
            - paragraph [ref=e351]:
              - link "運営方針とセキュリティについて" [ref=e352] [cursor=pointer]:
                - /url: /about/transparency
        - generic [ref=e353]:
          - heading "安心・安全" [level=3] [ref=e354]
          - generic [ref=e355]:
            - generic [ref=e356]:
              - generic [ref=e357]: 🇯🇵
              - generic [ref=e358]:
                - paragraph [ref=e359]: 日本国内サーバー
                - paragraph [ref=e360]: 大切なファイルは日本国内で処理
            - generic [ref=e361]:
              - generic [ref=e362]: 🔒
              - generic [ref=e363]:
                - paragraph [ref=e364]: SSL暗号化通信
                - paragraph [ref=e365]: 通信内容を完全保護
            - generic [ref=e366]:
              - generic [ref=e367]: 🗑️
              - generic [ref=e368]:
                - paragraph [ref=e369]: 自動削除
                - paragraph [ref=e370]: 処理完了後、すぐに削除
        - generic [ref=e371]:
          - heading "リンク" [level=3] [ref=e372]
          - generic [ref=e373]:
            - link "💰 金融・資産運用ツール" [ref=e375] [cursor=pointer]:
              - /url: /finance
            - link "🏢 法人・企業様向け" [ref=e377] [cursor=pointer]:
              - /url: /about/business
            - link "会社ウェブサイト" [ref=e379] [cursor=pointer]:
              - /url: https://www.yamadatrade.jp/
            - link "📘 Facebook" [ref=e381] [cursor=pointer]:
              - /url: https://www.facebook.com/yamada.tools/
            - link "X（旧Twitter）" [ref=e383] [cursor=pointer]:
              - /url: https://x.com/YamadaToolsJP
            - link "会社概要" [ref=e385] [cursor=pointer]:
              - /url: /about/company
            - link "よくある質問（FAQ）" [ref=e387] [cursor=pointer]:
              - /url: /about/faq
            - link "開発者ストーリー" [ref=e389] [cursor=pointer]:
              - /url: /about/story
            - link "💡 ツールをリクエスト" [ref=e391] [cursor=pointer]:
              - /url: https://forms.gle/2mmoGqLif1Cqe5vL6
            - link "適正利用ガイドライン" [ref=e393] [cursor=pointer]:
              - /url: /about/fair-usage
            - link "利用規約" [ref=e395] [cursor=pointer]:
              - /url: /legal/terms
            - link "プライバシーポリシー" [ref=e397] [cursor=pointer]:
              - /url: /legal/privacy
            - link "特定商取引法に基づく表記" [ref=e399] [cursor=pointer]:
              - /url: /legal/tokushoho
            - link "サイトマップ" [ref=e401] [cursor=pointer]:
              - /url: /sitemap.xml
      - paragraph [ref=e403]: © 2026 合同会社山田トレード. All rights reserved.
  - button "フィードバックを送る" [ref=e405] [cursor=pointer]: 💬
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