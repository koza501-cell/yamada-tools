# Deployment Package — gemini-gmail-auto-reply-recipe (FINAL PAGE 5/5)

## File 1: FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Gemini無料プランでGmail返信は十分にできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、十分です。Geminiアプリでコピペするレベル1のプロンプト返信は無料プランで完全に使えます。サイドパネル統合（Workspace連携）は有料ですが必須ではありません。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPTとGeminiはどちらがGmail連携に向いていますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gmailと同じGoogleエコシステムであるGeminiが、連携面では圧倒的に有利です。サイドパネル統合、GAS連携、API無料枠などGmail活用に最適化されています。文章生成の精度自体は両者ともビジネスメール用途で十分なレベルです。"
      }
    },
    {
      "@type": "Question",
      "name": "Geminiの自動返信を完全自動送信モードにすべきですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "最低でも1週間は下書きモードで運用してください。Geminiでも誤った内容を生成する可能性があり、人間の最終確認なしに送信するとビジネス上の事故につながります。精度に問題ないことを確認してから、限定的なメール種別で完全自動化に移行する流れが安全です。"
      }
    },
    {
      "@type": "Question",
      "name": "Gemini APIの無料枠1日20回を超えるとどうなりますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "429エラー（クォータ超過）が発生し、自動的に処理が停止します。誤請求は発生しません。超過する場合は、自動返信対象をラベルで絞り込むか、Gemini 2.5 Proの有料プランに切り替える選択肢があります。"
      }
    },
    {
      "@type": "Question",
      "name": "GASのコードが書けなくてもGmail自動化できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "できます。本記事のセクション4.3のコードはそのままコピペで動作します。コードのカスタマイズが必要な場合は、Geminiに「このGASコードを〇〇のように修正して」と依頼すれば、修正版を生成してくれます。プログラミング未経験者でも実装可能です。"
      }
    },
    {
      "@type": "Question",
      "name": "取引先情報をAIに渡しても法的に問題ありませんか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "業種・規模によります。一般的な取引情報の処理は問題ない場合が多いですが、プライバシーポリシーに「AI活用」を記載し、機密案件は対象外とする運用が安全です。法人の場合は法務部門に事前確認を推奨します。"
      }
    },
    {
      "@type": "Question",
      "name": "メール返信をAIに任せると、文章が画一的になりませんか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "そのリスクはあります。対策はプロンプトに「自社の言い回し」や「過去の返信例」を学習サンプルとして含めることです。Geminiは少数のサンプルからスタイルを抽出する能力が高いため、3〜5件の過去メールを参考に渡せば、自社らしいトーンを維持できます。"
      }
    },
    {
      "@type": "Question",
      "name": "Gmail以外（Outlook、Yahoo!メール）でもGemini連携できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "サイドパネル統合はGmail限定です。OutlookはMicrosoft Copilotとの統合が進んでおり、Yahoo!メールはAI連携が限定的です。Gmail以外のメールクライアントでGeminiを使いたい場合は、Geminiアプリでコピペするレベル1の方法が現実的です。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/gemini-gmail-auto-reply-recipe to staging. THIS IS THE FINAL PAGE OF 5.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Verify drafts:
ls -la _drafts/gemini-gmail-auto-reply-recipe-content.md
ls -la _drafts/gemini-gmail-auto-reply-recipe-deployment.md

Step 2 — Inspect aiPosts.json entry:
grep -n "gemini-gmail-auto-reply-recipe" src/data/aiPosts.json | head -5

Step 3 — Update aiPosts.json using JSON-safe Python:

python3 <<'PYEOF'
import json, re

with open('_drafts/gemini-gmail-auto-reply-recipe-content.md', 'r', encoding='utf-8') as f:
    new_content = f.read()

with open('_drafts/gemini-gmail-auto-reply-recipe-deployment.md', 'r', encoding='utf-8') as f:
    deploy_doc = f.read()

m = re.search(r'```json\s*(\{[\s\S]+?\})\s*```', deploy_doc)
faq_schema = json.loads(m.group(1))

with open('src/data/aiPosts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

updated = False
iterable = posts if isinstance(posts, list) else posts.values()
for post in iterable:
    if isinstance(post, dict) and post.get('slug') == 'gemini-gmail-auto-reply-recipe':
        post['title'] = '【2026年完全版】Gemini × Gmailで自動返信を実現する実践ガイド'
        post['seoDescription'] = 'Gemini × Gmailでメール対応時間を月15〜30時間削減する実践ガイド。3レベルの導入経路（無料Geminiアプリ・Workspaceサイドパネル・GAS自動化）、コピペで動くGASコード、10種のビジネスメールプロンプト、情報漏洩対策、yamada-toolsの文書ツール連携まで網羅。'
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
3. curl -s "https://staging.yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s "https://staging.yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | grep -c "FAQPage"
   Expected: >= 1
5. curl -s "https://staging.yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | wc -c
   Expected: >100000
6. curl -s "https://staging.yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | grep -c "overflow-x"
   Expected: >= 1 (for the 3-level comparison table in section 1.1)

Step 5 — git commit:
git add . && git commit -m "content: expand /ai/gemini-gmail-auto-reply-recipe to 5000+ ji guide with FAQ schema (final page 5/5)" && git push

Report curl outputs from Step 4.
```

---

## Faisal upload + production sync

```powershell
cd C:\Users\yamad\Documents\Download2
scp -P 2222 gemini-gmail-auto-reply-recipe-content.md gemini-gmail-auto-reply-recipe-deployment.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/
```

Production sync after staging verified:
```bash
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
npm run build && pm2 restart yamada-frontend
curl -s "https://yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | grep -c "FAQPage"
curl -s "https://yamada-tools.jp/ai/gemini-gmail-auto-reply-recipe" | wc -c
git add . && git commit -m "content: expand gemini-gmail-auto-reply-recipe (prod sync, final page 5/5)" && git push
```

Then GSC: URL Inspection → request indexing for /ai/gemini-gmail-auto-reply-recipe.

🎉 After this deploy, all 5 priority /ai pages are expanded and live.
