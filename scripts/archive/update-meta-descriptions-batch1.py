#!/usr/bin/env python3
"""
Tier 2 Batch 1 - Update 15 meta descriptions
Safer than sed/perl for UTF-8 Japanese text.
Run from frontend or frontend-staging directory.
"""

import os
import sys
import shutil

# (filepath, old_description, new_description, label)
UPDATES = [
    # Homepage
    (
        "src/app/layout.tsx",
        "日本国内サーバーで安全に使える無料オンラインツール。インボイス制度・全銀フォーマット・電子印鑑など日本のビジネスに特化。PDF編集・書類作成・画像変換など、登録不要・完全無料。",
        "日本国内サーバーで安全に使える無料オンラインツール133種。インボイス制度・全銀フォーマット・電子印鑑・PDF編集・書類作成・画像変換・財務計算など、日本の中小企業・フリーランスのビジネスに特化。登録不要・60分自動削除で安心。",
        "/ (homepage)",
    ),
    # /pdf
    (
        "src/app/pdf/page.tsx",
        "PDF結合・圧縮・分割・回転・OCR・Word/Excel変換・パスワード保護など35種以上の無料PDFツール。日本国内サーバーで安心・安全。登録不要・60分自動削除。",
        "PDF結合・圧縮・分割・回転・OCR・Word/Excel変換・パスワード保護・電子署名・透かし追加など35種以上の無料PDFツール。日本国内サーバーで安心・安全。登録不要・60分自動削除でセキュア。インストール不要、ブラウザだけで完結。",
        "/pdf",
    ),
    # /finance
    (
        "src/app/finance/page.tsx",
        "新NISA・iDeCo・住宅ローン・FX損益・老後資金・退職金・転職など30種以上の無料金融計算ツール。登録不要・日本国内サーバー処理・スマホ対応。",
        "新NISA・iDeCo・住宅ローン・FX損益・老後資金・退職金・転職・年収・社会保険料・相続税など30種以上の無料金融計算ツール。専門家相談前の事前確認に最適。登録不要・日本国内サーバー処理・スマホ対応。完全無料でご利用いただけます。",
        "/finance",
    ),
    # /business
    (
        "src/app/business/page.tsx",
        "法人化シミュレーター・役員報酬最適化・法人税・フリーランス税金・簡易課税を無料で計算。登録不要・日本国内サーバー処理。",
        "法人化シミュレーター・役員報酬最適化・法人税計算・フリーランス税金・簡易課税・補助金検索・法人番号検索・特定技能ビザ計算など中小企業・個人事業主向け業務ツールを無料提供。登録不要・日本国内サーバー処理・完全無料。",
        "/business",
    ),
    # /career
    (
        "src/app/career/page.tsx",
        "転職シミュレーター・残業代計算・失業保険・年収の壁・副業税金・社会保険を無料で計算。登録不要・日本国内サーバー処理。",
        "転職シミュレーター・残業代計算・失業保険・年収の壁チェッカー・副業税金・社会保険料・退職金・昇給シミュレーターなどキャリアと給与の計算を無料で。手取り額の正確な試算で転職判断・年収交渉に役立つ。登録不要・日本国内サーバー処理。",
        "/career",
    ),
    # /business/houjin-search
    (
        "src/app/business/houjin-search/layout.tsx",
        "会社名から法人番号と所在地を無料で検索。資本金・従業員数・設立日・代表者などの詳細情報、営業状態バッジ、英語・ローマ字検索にも対応。経済産業省gBizINFO公式データ。約400万社対応。登録不要。",
        "会社名・法人番号から日本全国約400万社の法人情報を無料検索。資本金・従業員数・設立日・代表者・営業状態・所在地などの詳細情報を表示。英語・ローマ字検索対応。経済産業省gBizINFO公式データ使用。営業先調査・取引先与信に。完全無料・登録不要。",
        "/business/houjin-search",
    ),
    # /business/hojokin-active
    (
        "src/app/business/hojokin-active/layout.tsx",
        "現在募集中の補助金・助成金を無料検索。中小企業・個人事業主・創業向け。デジタル庁Jグランツの公式データ。締切日・上限額・対象規模で絞り込み可能。",
        "現在募集中の補助金・助成金を無料検索。中小企業・個人事業主・創業者向けの公的支援制度を一覧表示。デジタル庁Jグランツの公式データ使用。締切日・上限額・対象事業規模・業種で絞り込み可能。経営支援・資金調達に。登録不要・完全無料。",
        "/business/hojokin-active",
    ),
    # /business/hojokin-history
    (
        "src/app/business/hojokin-history/layout.tsx",
        "特定の法人が過去に受給した補助金の履歴を無料検索。取引先の信用調査・与信判断に。経済産業省gBizINFOの公式データを使用。法人名または法人番号で検索可能。",
        "特定の法人が過去に受給した補助金・助成金の履歴を無料検索。取引先の信用調査・与信判断・経営状況把握に有用。経済産業省gBizINFOの公式データを使用。法人名または法人番号で検索可能。受給金額・年度・補助金名を一覧表示。登録不要・完全無料。",
        "/business/hojokin-history",
    ),
    # /business/corporate-tax-calculator
    (
        "src/app/business/corporate-tax-calculator/page.tsx",
        "法人税計算機を無料でオンライン変換。所得金額から法人税・地方税を計算。日本国内サーバーで安心・安全。登録不要、ファイルは60分で自動削除。",
        "法人税計算機を無料で。所得金額から法人税・地方法人税・法人事業税・法人住民税の合計を自動計算。中小企業向け軽減税率・外形標準課税にも対応。決算前の納税額試算・予算策定に役立つ。日本国内サーバー処理で安心・安全、登録不要・完全無料。",
        "/business/corporate-tax-calculator",
    ),
    # /business/freelance-tax-calculator
    (
        "src/app/business/freelance-tax-calculator/page.tsx",
        "フリーランスの税金・手取りを完全計算。青色申告vs白色申告の比較、経費カテゴリ別シミュレーション、インボイス制度の影響計算、節税アドバイス付き。2026年最新税制対応。登録不要・完全無料。",
        "フリーランス・個人事業主の税金・手取りを完全計算。所得税・住民税・国民健康保険・国民年金・事業税の合計、青色申告vs白色申告の比較、経費カテゴリ別シミュレーション、インボイス制度の影響、節税アドバイス付き。2026年最新税制対応。登録不要・完全無料。",
        "/business/freelance-tax-calculator",
    ),
    # /pdf/text-input
    (
        "src/app/pdf/text-input/page.tsx",
        "PDFに直接テキストや電子ハンコを書き込む完全無料ツール。登録不要・インストール不要・ファイルはサーバー送信なし。申請書・契約書・履歴書など全PDF対応。令和日付自動入力あり。",
        "PDFに直接テキストや電子ハンコを書き込む完全無料ツール。登録不要・インストール不要・ファイルはサーバー送信なし（ブラウザ内処理）。申請書・契約書・履歴書・婚姻届など全PDF対応。令和日付自動入力、署名フィールド、印鑑追加機能あり。Adobe Acrobatの代替に。",
        "/pdf/text-input",
    ),
    # /pdf/merge
    (
        "src/app/pdf/merge/page.tsx",
        "複数のPDFファイルを1つに結合。最大50ファイル対応、順番の並び替えも自由。日本国内サーバーで安全処理、登録不要・完全無料。",
        "複数のPDFファイルを1つに結合する無料ツール。最大50ファイル対応、ドラッグ&ドロップで順番の並び替えも自由。請求書・契約書・履歴書など複数の書類をまとめてメール添付・印刷したい時に。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
        "/pdf/merge",
    ),
    # /pdf/compress - replace ANY description starting with "PDFファイルを無料で圧縮"
    # Use partial match approach
    (
        "src/app/pdf/compress/page.tsx",
        None,  # special handling - regex match
        "PDFファイルを無料で圧縮。メールで送れない大きなPDFも最大70%サイズダウン。画質を保ったまま25MB→3MBなど大幅軽量化。スキャン書類・写真PDF・プレゼン資料に最適。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
        "/pdf/compress (regex match)",
    ),
    # /pdf/split
    (
        "src/app/pdf/split/page.tsx",
        "PDFを分割・ページ抽出。必要なページだけ取り出したり、1ページずつ別ファイルに。日本国内サーバーで安全処理、登録不要・完全無料。",
        "PDFを分割・ページ抽出する無料ツール。必要なページだけ取り出したり、1ページずつ別ファイルに分割可能。100ページの書類から特定の章だけ抜き出す作業も簡単。請求書・契約書の整理に。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
        "/pdf/split",
    ),
    # /pdf/word-to-pdf
    (
        "src/app/pdf/word-to-pdf/page.tsx",
        "WordファイルをPDFに変換。レイアウトを崩さずに、どの環境でも同じ見た目で表示されるPDFを作成します。",
        "Word（docx/doc）ファイルをPDFに変換する無料ツール。フォント・画像・表のレイアウトを崩さずに、どの環境でも同じ見た目で表示されるPDFを作成。履歴書・契約書・社内文書の配布用PDF化に。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
        "/pdf/word-to-pdf",
    ),
]


def update_file(filepath, old_text, new_text, label):
    if not os.path.isfile(filepath):
        print(f"❌ MISSING: {filepath}")
        return False

    # Read file (UTF-8)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Backup once
    backup_path = filepath + ".bing-batch1-backup"
    if not os.path.isfile(backup_path):
        shutil.copy2(filepath, backup_path)

    # Special handling for /pdf/compress - regex match because of garbled char
    if old_text is None:
        import re
        # Match: description: "PDFファイルを無料で圧縮.{0,150}"
        pattern = re.compile(
            r'description:\s*"PDFファイルを無料で圧縮[^"]{0,200}"',
            re.MULTILINE
        )
        new_content = pattern.sub(f'description: "{new_text}"', content)
        if new_content == content:
            print(f"⚠️  SKIP: {label} (regex pattern not found)")
            return False
    else:
        if old_text not in content:
            print(f"⚠️  SKIP: {label} (text not found)")
            return False
        new_content = content.replace(old_text, new_text)

    # Write back
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    new_len = len(new_text)
    print(f"✓ [{new_len} chars] {label}")
    return True


def main():
    print("=== Tier 2 Batch 1: Updating 15 meta descriptions ===\n")
    success = 0
    fail = 0
    for filepath, old, new, label in UPDATES:
        if update_file(filepath, old, new, label):
            success += 1
        else:
            fail += 1

    print(f"\n=== Done. Success: {success}, Failed: {fail} ===")
    print("Next: npm run build && pm2 restart yamada-staging")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
