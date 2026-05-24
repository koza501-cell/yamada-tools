# Deployment Package — ai-overview-geo-seo-guide-2026

## File 1: FAQ Schema (paste into aiPosts.json faq field)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "GEOとSEOはどちらが重要ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "両方重要です。GEOはSEOの拡張であり、置き換えではありません。AI検索エンジンの多くはGoogleやBingのインデックスを参照しているため、SEOの土台がないとAI Overviewにも引用されません。SEOの上にGEOを重ねるのが正解です。"
      }
    },
    {
      "@type": "Question",
      "name": "GEO対策は中小企業でも必要ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "必要です。AI Overviewは日本の検索結果の約51%で表示されており、CTRが30〜60%低下することが報告されています。中小企業ほど固有事例・独自データで差別化しやすく、月額10万円以下から実装可能です。"
      }
    },
    {
      "@type": "Question",
      "name": "FAQPageスキーマはなぜ効果が高いのですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "カーネギーメロン大学（CMU）の研究で、FAQPageスキーマを実装したコンテンツのAI引用率が3.1倍になることが実証されています。AIが「質問→回答」の構造を抽出しやすく、ChatGPT・Gemini・Perplexityの引用パターンに直接合致するためです。"
      }
    },
    {
      "@type": "Question",
      "name": "llms.txtは絶対に必要ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "必須ではありませんが、強く推奨されます。AIクローラーに対してサイト構造を機械可読形式で伝えることで、引用候補に入りやすくなります。yamada-tools.jpでは713行のllms.txtを実装しています。実装に費用はかかりません。"
      }
    },
    {
      "@type": "Question",
      "name": "AIクローラーをブロックすべきですか、Allowすべきですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "個人情報や非公開情報のないサイトはAllowを推奨します。ブロックするとChatGPT・Gemini・Perplexityの引用対象から外れ、AI検索からの流入機会を失います。yamada-tools.jpではGPTBot, ClaudeBot, PerplexityBot, Google-Extendedなど主要AIクローラーをすべてAllowしています。"
      }
    },
    {
      "@type": "Question",
      "name": "GEOの効果はいつから出ますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "llms.txt + FAQPageスキーマ実装後、4〜8週間でAI検索引用が始まるのが業界の目安です。6ヶ月で月20〜50回の引用獲得が標準的なベンチマークです。Perplexityは新鮮さ重視のため、最も早く効果が出ます。"
      }
    },
    {
      "@type": "Question",
      "name": "AIで記事を量産すればGEOに有利ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "逆効果です。GoogleのHelpful Content Update以降、AI生成コンテンツの大量投入は減点要因です。AIで草稿 → 人間が体験・固有データを追加 → 公開のフローを推奨します。AIは自分が生成したパターンを見抜きます。"
      }
    },
    {
      "@type": "Question",
      "name": "GEO対策の費用相場はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "社内実装なら月額10万円以下から可能です。診断・llms.txt実装・FAQPageスキーマ・40字ルールリライトは、知識さえあれば追加費用なしで実施できます。外注する場合は月額10〜30万円が中小企業向けの相場、本格的なAIOツール導入を含めると月額30万円以上になります。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/ai-overview-geo-seo-guide-2026 to staging.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Verify drafts directory has the new content:
ls -la _drafts/ai-overview-geo-seo-guide-2026-content.md
ls -la _drafts/ai-overview-geo-seo-guide-2026-deployment.md

Step 2 — Inspect current aiPosts.json entry:
grep -n "ai-overview-geo-seo-guide-2026" src/data/aiPosts.json | head -5

Step 3 — Update aiPosts.json entry using JSON-safe Python edit:

python3 <<'PYEOF'
import json
import re

with open('_drafts/ai-overview-geo-seo-guide-2026-content.md', 'r', encoding='utf-8') as f:
    new_content = f.read()

with open('_drafts/ai-overview-geo-seo-guide-2026-deployment.md', 'r', encoding='utf-8') as f:
    deploy_doc = f.read()

m = re.search(r'```json\s*(\{[\s\S]+?\})\s*```', deploy_doc)
faq_schema = json.loads(m.group(1))

with open('src/data/aiPosts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

updated = False
iterable = posts if isinstance(posts, list) else posts.values()
for post in iterable:
    if isinstance(post, dict) and post.get('slug') == 'ai-overview-geo-seo-guide-2026':
        post['title'] = '【2026年完全版】GEO（生成エンジン最適化）の実装ガイド — yamada-tools.jpの実例公開'
        post['seoDescription'] = 'GEO・AI Overview・LLMO対策の実装ガイド2026年版。yamada-tools.jpが実際に運用する713行のllms.txt、FAQPageスキーマ、40字ルール、AIクローラーAllow設定を実例公開。中小企業が月額10万円以下で実装できる4-8週間のロードマップ付き。'
        post['description'] = post['seoDescription']
        post['lastUpdated'] = '2026-05-24'
        for fname in ['content', 'body', 'markdown', 'html']:
            if fname in post:
                post[fname] = new_content
                print(f'Updated content field: {fname}')
                break
        post['faq'] = faq_schema
        post.pop('noindex', None)
        updated = True
        break

if not updated:
    print('ERROR: entry not found')
    exit(1)

with open('src/data/aiPosts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print('aiPosts.json updated successfully')
PYEOF

Step 4 — Build and deploy to staging:
1. npm run build (foreground, wait exit 0)
2. pm2 restart yamada-staging
3. curl -s "https://staging.yamada-tools.jp/ai/ai-overview-geo-seo-guide-2026" | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s "https://staging.yamada-tools.jp/ai/ai-overview-geo-seo-guide-2026" | grep -c "FAQPage"
   Expected: >= 1
5. curl -s "https://staging.yamada-tools.jp/ai/ai-overview-geo-seo-guide-2026" | wc -c
   Expected: >100000

Step 5 — git commit:
git add . && git commit -m "content: expand /ai/ai-overview-geo-seo-guide-2026 to 5500+ ji guide with FAQ schema" && git push

Report curl outputs from Step 4 (items 3-5).
```

---

## Faisal upload + sync instructions

```powershell
cd C:\Users\yamad\Documents\Download2
scp -P 2222 ai-overview-geo-seo-guide-2026-content.md ai-overview-geo-seo-guide-2026-deployment.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/
```

After staging verification, production sync:

```bash
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
npm run build && pm2 restart yamada-frontend
curl -s "https://yamada-tools.jp/ai/ai-overview-geo-seo-guide-2026" | grep -c "FAQPage"
curl -s "https://yamada-tools.jp/ai/ai-overview-geo-seo-guide-2026" | wc -c
git add . && git commit -m "content: expand ai-overview-geo-seo-guide-2026 (prod sync)" && git push
```

Then GSC: URL Inspection → request indexing for /ai/ai-overview-geo-seo-guide-2026.
