# Deployment Package — sme-ai-adoption-guide-japan-2026

## File 1: FAQ Schema (paste into aiPosts.json faq field)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "中小企業のAI導入は何から始めれば良いですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "業務棚卸しから始めてください。ツール選定が先ではなく、「どの業務を効率化したいか」を明確にしてからツールを選ぶのが鉄則です。月曜に業務棚卸し、火曜に1業務を選んで実験、水曜に時間計測、木曜に失敗パターン整理、金曜にROI試算という1週間プランで実証できます。"
      }
    },
    {
      "@type": "Question",
      "name": "デジタル化・AI導入補助金は誰でも申請できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "中小企業・小規模事業者であれば申請可能ですが、事務局に登録された「IT導入支援事業者」とパートナーシップを組む必要があります。任意のツールを補助対象にすることはできません。補助額は1者あたり最大450万円、補助率は基本1/2で小規模事業者は最大4/5です。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPT無料プランで中小企業の業務は回りますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1業務での実証段階なら無料プランで十分です。月間100件以上の使用、複数業務での運用、画像処理を必要とする場合は有料プラン（月額3,300円〜）への移行を推奨します。"
      }
    },
    {
      "@type": "Question",
      "name": "AI導入で従業員の抵抗をどう乗り越えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "「上から押しつけ」を避け、現場ヒアリングから始めてください。1人の成功事例を社内で横展開する方が、研修を10回実施するより効果的です。AIに仕事を奪われる不安への配慮と、削減された時間の使い道を明示することが重要です。"
      }
    },
    {
      "@type": "Question",
      "name": "データが整備されていない会社でもAIは使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "使えます。「データ整備が必要ない業務」から始めるのが正解です。メール返信、議事録要約、求人原稿作成、業務マニュアル化などはデータ整備不要で開始できます。データ整備プロジェクトを先に立ち上げると、その時点でAI導入が頓挫します。"
      }
    },
    {
      "@type": "Question",
      "name": "AI導入のROIはどう計算しますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "基本式は「削減時間/週 × 4週 × 時給 × 利用者数 − ツールコスト」です。50人以下企業の標準的なROIは年間3〜10倍が目安です。10人企業で1人あたり週2時間削減、時給3,000円換算なら、年間削減効果は約288万円、ChatGPT Plus年間コスト約40万円でROI約7倍になります。"
      }
    },
    {
      "@type": "Question",
      "name": "50人以下の会社で専任のAI担当を置く必要はありますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "必要ありません。社長または業務改善に関心が高い社員1名が「兼任の推進役」を担うのが現実的です。専任を置く規模感は100名以上からです。"
      }
    },
    {
      "@type": "Question",
      "name": "AIに渡してはいけない情報は何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "マイナンバー、健康保険情報、銀行口座番号、取引先の社外秘情報、未公開の財務データは渡さないでください。取引先名や金額はマスキング処理後にAIに渡し、ChatGPTの「学習用データ利用」設定はOFFにしてください。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/sme-ai-adoption-guide-japan-2026 to staging.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Verify drafts directory has the new content:
ls -la _drafts/sme-ai-adoption-guide-japan-2026-content.md
ls -la _drafts/sme-ai-adoption-guide-japan-2026-deployment.md

Step 2 — Inspect current aiPosts.json entry for sme-ai-adoption-guide-japan-2026:
grep -n "sme-ai-adoption-guide-japan-2026" src/data/aiPosts.json | head -5
view src/data/aiPosts.json around that line range to see entry structure

Step 3 — Update aiPosts.json entry using JSON-safe Python edit:

python3 <<'PYEOF'
import json
import re

# Load the new content
with open('_drafts/sme-ai-adoption-guide-japan-2026-content.md', 'r', encoding='utf-8') as f:
    new_content = f.read()

# Load FAQ schema from deployment doc (extract the JSON block)
with open('_drafts/sme-ai-adoption-guide-japan-2026-deployment.md', 'r', encoding='utf-8') as f:
    deploy_doc = f.read()

# Extract FAQ JSON between first ```json and matching ```
m = re.search(r'```json\s*(\{[\s\S]+?\})\s*```', deploy_doc)
faq_schema = json.loads(m.group(1))

# Load aiPosts.json
with open('src/data/aiPosts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Find and update the entry
updated = False
for post in posts if isinstance(posts, list) else posts.values():
    if isinstance(post, dict) and post.get('slug') == 'sme-ai-adoption-guide-japan-2026':
        post['title'] = '【2026年完全版】50人以下企業の社長が一人で始めるAI導入の実践ガイド'
        post['seoDescription'] = '50人以下の中小企業向けAI導入完全ガイド。失敗5パターンの回避策、1週間実証プラン、業務別プロンプト5本、デジタル化・AI導入補助金2026の活用法、ROI試算まで網羅。yamada-toolsの無料検証ツールと組み合わせて「導入したが定着しない」失敗を回避。'
        post['description'] = post['seoDescription']
        post['lastUpdated'] = '2026-05-24'
        # determine content field name — check existing structure
        for fname in ['content', 'body', 'markdown', 'html']:
            if fname in post:
                post[fname] = new_content
                print(f'Updated content field: {fname}')
                break
        post['faq'] = faq_schema
        # remove noindex flag if present
        post.pop('noindex', None)
        updated = True
        break

if not updated:
    print('ERROR: entry not found')
    exit(1)

# Write back (preserve original structure type)
with open('src/data/aiPosts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print('aiPosts.json updated successfully')
PYEOF

Step 4 — Build and deploy to staging:
1. npm run build (foreground, wait exit 0)
2. pm2 restart yamada-staging
3. curl -s "https://staging.yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s "https://staging.yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | grep -c "FAQPage"
   Expected: >= 1
5. curl -s "https://staging.yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | wc -c
   Expected: >100000 chars
6. Verify the overflow-x wrapper pattern works for the table inside section 2.4 (data integration matrix):
   curl -s "https://staging.yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | grep -c "overflow-x"
   If 0, that table may need manual wrapping but it's a small table so likely fine.

Step 5 — git commit:
git add . && git commit -m "content: expand /ai/sme-ai-adoption-guide-japan-2026 to 6000+ ji guide with FAQ schema" && git push

Report curl outputs from Step 4 (items 3-5).
```

---

## Faisal upload instructions

```powershell
cd C:\Users\yamad\Documents\Download2
scp -P 2222 sme-ai-adoption-guide-japan-2026-content.md sme-ai-adoption-guide-japan-2026-deployment.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/
```

Then run the Claude Code prompt above. After staging verification, production sync:

```bash
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
npm run build && pm2 restart yamada-frontend
curl -s "https://yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | grep -c "FAQPage"
curl -s "https://yamada-tools.jp/ai/sme-ai-adoption-guide-japan-2026" | wc -c
git add . && git commit -m "content: expand sme-ai-adoption-guide-japan-2026 (prod sync)" && git push
```

Then GSC: URL Inspection → request indexing for /ai/sme-ai-adoption-guide-japan-2026.
