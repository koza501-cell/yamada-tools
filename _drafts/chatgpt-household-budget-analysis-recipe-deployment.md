# Deployment Package — chatgpt-household-budget-analysis-recipe

## File 1: FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ChatGPT無料プランで家計簿は十分に管理できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、十分です。GPT-4oが無料プランでも利用可能で、月100件程度の家計入力なら有料プランは不要です。画像（レシート写真）を直接アップロードしたい場合のみPlus（月額3,300円）が便利ですが、テキスト転記で代替できます。"
      }
    },
    {
      "@type": "Question",
      "name": "家計データをChatGPTに渡しても安全ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ChatGPTの設定で「Improve the model for everyone」をOFFにし、銀行口座番号・クレジットカード番号などの特定情報をマスキングすれば、リスクは大きく下げられます。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPT家計簿でどれくらいの期間で節約効果が出ますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "本記事の4週間プランに沿えば、1ヶ月目から月1〜3万円の削減が見込めます。4人家族（小学生2人）で月29,500円の削減実例を本記事で公開しています。家族構成や現状の支出により幅があります。"
      }
    },
    {
      "@type": "Question",
      "name": "ふるさと納税の上限額をChatGPTに聞いて大丈夫ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "目安は聞いても、最終判断には使わないでください。控除上限は年収、家族構成、住宅ローン控除、iDeCoの有無で大きく変わるため、ChatGPTのハルシネーションが起こりやすい領域です。総務省公式シミュレーターで必ず確認してください。"
      }
    },
    {
      "@type": "Question",
      "name": "サブスクの解約は本当に節約効果がありますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "あります。サブスクは「使っていないのに気づかない」最も典型的なリーク（漏れ）です。家庭の20〜40%は2つ以上の不要サブスクを抱えています。2ヶ月の利用頻度を確認するサブスク棚卸しプロンプトを実行すると平均月3,000〜6,000円の削減が見込めます。"
      }
    },
    {
      "@type": "Question",
      "name": "家族にChatGPT家計簿を共有するコツは？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "「節約のため」ではなく「ゴールのため」に枠組みを変えるのがコツです。「外食を減らす」→「年35万円の海外旅行資金を作る」、「サブスクを解約」→「子供の習い事1つ追加」のように、節約した金額の使い道を先に決めると家族の協力が得られます。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPTの代わりにGeminiやClaudeでも家計簿管理できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "できます。本記事のプロンプトはGemini、Claude、Perplexityでもほぼそのまま使用可能です。日本語の精度はChatGPT GPT-4oとGeminiが現状ではトップで、Claudeは分析の深さに強みがあります。"
      }
    },
    {
      "@type": "Question",
      "name": "NotebookLMとChatGPTの使い分けは？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ChatGPTは対話・修正の柔軟性、NotebookLMはファイルを丸ごとアップロードして分析するのが得意です。日常の記録はChatGPT、月次の深掘り分析はNotebookLMという使い分けが効果的です。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/chatgpt-household-budget-analysis-recipe to staging.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Verify drafts:
ls -la _drafts/chatgpt-household-budget-analysis-recipe-content.md
ls -la _drafts/chatgpt-household-budget-analysis-recipe-deployment.md

Step 2 — Inspect aiPosts.json entry:
grep -n "chatgpt-household-budget-analysis-recipe" src/data/aiPosts.json | head -5

Step 3 — Update aiPosts.json using JSON-safe Python:

python3 <<'PYEOF'
import json, re

with open('_drafts/chatgpt-household-budget-analysis-recipe-content.md', 'r', encoding='utf-8') as f:
    new_content = f.read()

with open('_drafts/chatgpt-household-budget-analysis-recipe-deployment.md', 'r', encoding='utf-8') as f:
    deploy_doc = f.read()

m = re.search(r'```json\s*(\{[\s\S]+?\})\s*```', deploy_doc)
faq_schema = json.loads(m.group(1))

with open('src/data/aiPosts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

updated = False
iterable = posts if isinstance(posts, list) else posts.values()
for post in iterable:
    if isinstance(post, dict) and post.get('slug') == 'chatgpt-household-budget-analysis-recipe':
        post['title'] = '【2026年完全版】ChatGPTで家計簿を分析して月3万円節約する実践ガイド'
        post['seoDescription'] = 'ChatGPTで家計簿を分析して月1〜3万円節約する4週間プラン完全ガイド。コピペで使えるプロンプト10本、4人家族で月29,500円削減した実例、yamada-toolsの12検証ツールとの連携法、情報漏洩・ハルシネーション対策まで網羅。'
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
3. curl -s "https://staging.yamada-tools.jp/ai/chatgpt-household-budget-analysis-recipe" | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s "https://staging.yamada-tools.jp/ai/chatgpt-household-budget-analysis-recipe" | grep -c "FAQPage"
   Expected: >= 1
5. curl -s "https://staging.yamada-tools.jp/ai/chatgpt-household-budget-analysis-recipe" | wc -c
   Expected: >100000

Step 5 — git commit:
git add . && git commit -m "content: expand /ai/chatgpt-household-budget-analysis-recipe to 5000+ ji guide with FAQ schema" && git push

Report curl outputs from Step 4.
```

---

## Faisal upload + production sync

```powershell
cd C:\Users\yamad\Documents\Download2
scp -P 2222 chatgpt-household-budget-analysis-recipe-content.md chatgpt-household-budget-analysis-recipe-deployment.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/
```

Production sync after staging verified:
```bash
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
npm run build && pm2 restart yamada-frontend
curl -s "https://yamada-tools.jp/ai/chatgpt-household-budget-analysis-recipe" | grep -c "FAQPage"
curl -s "https://yamada-tools.jp/ai/chatgpt-household-budget-analysis-recipe" | wc -c
git add . && git commit -m "content: expand chatgpt-household-budget-analysis-recipe (prod sync)" && git push
```

Then GSC: URL Inspection → request indexing.
