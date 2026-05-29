# Deployment Package — microsoft-copilot-guide-2026

## File 1: FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Microsoft 365 Copilotは中小企業に本当に必要ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microsoft 365を既に導入している企業なら、ROIは平均6倍と高く、強く推奨されます。Word・Excel・Outlook・Teamsを日常使う組織では、1人あたり月10時間の業務削減が標準的に見込めます。Microsoft 365未導入の場合は、まずChatGPT PlusやGemini for Workspaceなど別の選択肢から検討してください。"
      }
    },
    {
      "@type": "Question",
      "name": "Microsoft 365 Copilotの料金はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2026年5月時点で、年契約 月額4,497円（税抜）/ユーザーが標準価格。Businessプラン（300人以下）契約者向けには3,148円/月の割引パッケージが2025年12月〜2026年6月30日の期間限定で提供されています。2026年7月にベースライセンスの値上げが予定されているため、6月までの年間契約締結が推奨されます。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPT EnterpriseとCopilot、どちらがよいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microsoft 365を既に導入しているならCopilotが圧倒的優位です。理由はMicrosoft Graph統合により、SharePoint・OneDrive・Teams・Outlookの社内データを権限管理を維持したまま横断検索できる点です。ChatGPT Enterpriseはフルカスタム要件やAPI連携重視の企業向けです。"
      }
    },
    {
      "@type": "Question",
      "name": "Copilotで情報漏洩は心配ありませんか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microsoft 365 Copilotはデータをテナント内で処理し、外部に送信しません。閲覧権限のないファイルはAIにも見えず、監査ログで操作履歴を追跡可能です。リスクは「Web版Copilot（Bing統合）」との混同にあるため、社内ガイドラインで明確に区別する必要があります。"
      }
    },
    {
      "@type": "Question",
      "name": "Copilotの部分導入は可能ですか？最初は何人から始めるべきですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2024年から最低ユーザー数の制限が撤廃され、1人から導入可能です。経営層1〜3名から始めるのが最もROIが高く、3〜5ヶ月で投資回収可能です。段階的に営業マネージャー・管理部門へと拡大する戦略を推奨します。"
      }
    },
    {
      "@type": "Question",
      "name": "M365 Business Standardのまま Copilot を導入できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "できます。Microsoft 365 Business Basic/Standard/Premiumいずれの契約者でもCopilotを追加可能です。E3/E5は中小規模では機能過多になりやすいため、Business Standardが第一候補です。Business割引パッケージ（3,148円/月）も適用できます。"
      }
    },
    {
      "@type": "Question",
      "name": "Copilot Coworkとは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microsoft版の自律型AIエージェントで、2026年3月30日からFrontierプログラムで利用可能になりました。バックグラウンドで長時間のマルチステップ作業を実行でき、業務自動化の幅が広がります。"
      }
    },
    {
      "@type": "Question",
      "name": "デジタル化・AI導入補助金はMicrosoft Copilotにも使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "使えます。Microsoft 365 Copilotは「AI機能搭載ツール」の重点支援対象で、補助率1/2〜4/5・最大450万円の支援を受けられます。ただし「IT導入支援事業者」とのパートナーシップが必要なため、自力導入だけでは申請できません。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/microsoft-copilot-guide-2026 to staging.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Verify drafts:
ls -la _drafts/microsoft-copilot-guide-2026-content.md
ls -la _drafts/microsoft-copilot-guide-2026-deployment.md

Step 2 — Inspect aiPosts.json entry:
grep -n "microsoft-copilot-guide-2026" src/data/aiPosts.json | head -5

Step 3 — Update aiPosts.json using JSON-safe Python:

python3 <<'PYEOF'
import json, re

with open('_drafts/microsoft-copilot-guide-2026-content.md', 'r', encoding='utf-8') as f:
    new_content = f.read()

with open('_drafts/microsoft-copilot-guide-2026-deployment.md', 'r', encoding='utf-8') as f:
    deploy_doc = f.read()

m = re.search(r'```json\s*(\{[\s\S]+?\})\s*```', deploy_doc)
faq_schema = json.loads(m.group(1))

with open('src/data/aiPosts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

updated = False
iterable = posts if isinstance(posts, list) else posts.values()
for post in iterable:
    if isinstance(post, dict) and post.get('slug') == 'microsoft-copilot-guide-2026':
        post['title'] = '【2026年完全版】Microsoft 365 Copilot 中小企業向け実装ガイド — 料金・主要機能・部分導入戦略'
        post['seoDescription'] = 'Microsoft 365 Copilot中小企業向け完全ガイド2026年版。月4,497円の料金体系、Business割引3,148円、2026年7月値上げ対策、Word/Excel/Outlook/Teams別活用法、ChatGPT Enterprise・Gemini for Workspaceとの比較、部分導入戦略でROI6倍を実現する方法を網羅。'
        post['description'] = post['seoDescription']
        post['lastUpdated'] = '2026-05-29'
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
3. curl -s "http://localhost:3003/ai/microsoft-copilot-guide-2026" | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s "http://localhost:3003/ai/microsoft-copilot-guide-2026" | grep -c "FAQPage"
   Expected: >= 1
5. curl -s "http://localhost:3003/ai/microsoft-copilot-guide-2026" | wc -c
   Expected: >100000
6. curl -s "http://localhost:3003/ai/microsoft-copilot-guide-2026" | grep -c "overflow-x"
   Expected: >= 3

Step 5 — git commit:
git add . && git commit -m "content: expand /ai/microsoft-copilot-guide-2026 to 5900+ ji with pricing+aplication guide+ROI+comparison" && git push

Report curl outputs from Step 4.
```

---

## Faisal upload + production sync

```powershell
cd "Z:\NEW DOWNLOAD"
scp -P 2222 microsoft-copilot-guide-2026-content.md microsoft-copilot-guide-2026-deployment.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/
```

Production sync after staging verified:
```bash
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
npm run build && pm2 restart yamada-frontend
curl -s "https://yamada-tools.jp/ai/microsoft-copilot-guide-2026" | grep -c "FAQPage"
curl -s "https://yamada-tools.jp/ai/microsoft-copilot-guide-2026" | wc -c
git add . && git commit -m "content: expand microsoft-copilot-guide-2026 (prod sync)" && git push
```

Then GSC: URL Inspection → request indexing.
