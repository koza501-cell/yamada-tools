# Deployment Package — ai-kakuteishinkoku-freelance-2026

## File 1: FAQ Schema (paste into the page's metadata or aiPosts.json)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ChatGPT Plusの月額料金は確定申告で経費にできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "業務利用している部分は経費計上可能です。勘定科目は「通信費」「支払手数料」「諸会費」「ソフトウェア利用料」のいずれかが一般的で、業務利用比率に応じた按分が必要です。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPTで算出した仕訳をそのまま使って問題ないですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "推奨しません。ChatGPTにはハルシネーション（架空の情報を生成する現象）のリスクがあります。重要な仕訳はfreee確定申告アプリやyamada-toolsの検証ツールでダブルチェックしてください。"
      }
    },
    {
      "@type": "Question",
      "name": "freeeのChatGPTアプリは無料で使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ChatGPT Plus（月額20ドル/約3,000円）の契約があれば、freee確定申告アプリ自体に追加料金はかかりません。ただしChatGPTの無料プランでは利用できません。"
      }
    },
    {
      "@type": "Question",
      "name": "マネーフォワードAI確定申告は誰でも使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2026年5月時点でβ版として全ユーザーに無償提供されています。マネーフォワードIDがあれば利用可能ですが、正式版リリース時に料金体系が変わる可能性があります。"
      }
    },
    {
      "@type": "Question",
      "name": "領収書をChatGPTにアップロードしても安全ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "リスクはあります。取引先名・口座番号・マイナンバーが含まれる領収書は、AIに渡す前にマスキング処理を推奨します。また、ChatGPTの「学習用データ利用」設定はオフにしてください。"
      }
    },
    {
      "@type": "Question",
      "name": "ドル建てのChatGPT領収書はインボイス対応していますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "していません。OpenAIは適格請求書発行事業者ではないため、消費税の仕入税額控除には使えません。ただし所得税の経費としては計上可能です。"
      }
    },
    {
      "@type": "Question",
      "name": "AIを使った確定申告は税務調査で問題になりませんか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AIを使うこと自体は問題ありません。問題になるのは「AIが言ったから」を根拠にした仕訳です。各仕訳の根拠（按分計算式、選択理由のメモ）を別途残しておけば、税務調査でも説明可能です。"
      }
    },
    {
      "@type": "Question",
      "name": "ChatGPTとfreeeとyamada-tools、どう使い分ければいいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ChatGPTは思考整理とプロンプト設計、freee確定申告アプリは仕訳判断の税理士回答事例での確認、マネーフォワードAI確定申告は領収書の自動仕訳、yamada-toolsはT番号・法人番号・所得税の数値検証に使うのが効果的です。"
      }
    }
  ]
}
```

---

## File 2: Claude Code deployment prompt

```
Read CLAUDE.md first.

Deploy expanded content for /ai/ai-kakuteishinkoku-freelance-2026 to staging.

cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging

Step 1 — Inspect current structure:
view src/data/aiPosts.json (first 200 lines, find the ai-kakuteishinkoku-freelance-2026 entry)
view src/app/ai/[slug]/page.tsx
Note what fields the entry has: title, description, content, faq, etc.

Step 2 — Read the new content:
The full article markdown is at /mnt/user-data/uploads/ai-kakuteishinkoku-freelance-2026-content.md
The FAQ JSON-LD schema is in /mnt/user-data/uploads/ai-kakuteishinkoku-deployment.md
Faisal will upload both files.

Step 3 — Update aiPosts.json:
Replace the existing ai-kakuteishinkoku-freelance-2026 entry's content/body field
with the new markdown. Update fields:
- title: "【2026年完全版】ChatGPTで確定申告を効率化するフリーランス・個人事業主の実践ガイド"
- description: "2026年最新のAI確定申告ガイド。ChatGPTで使える7つのプロンプト、freee確定申告アプリの使い方、マネーフォワードAI確定申告との比較、よくある失敗5パターンまで網羅。yamada-toolsの無料検証ツールと組み合わせて確実な確定申告を実現。"
- lastUpdated: "2026-05-24"
- Remove noindex flag if present (this is our keep-and-expand page, not noindex)
- Add the faq schema field with the 8 Q&A from the deployment doc

Step 4 — Verify the page renders FAQ schema:
After editing, look at the page component to confirm it reads `post.faq` and outputs <script type="application/ld+json">.
If the component doesn't yet support FAQ schema rendering, add minimal support:
- In src/app/ai/[slug]/page.tsx, inside the page component, if post.faq exists,
  inject a <script type="application/ld+json">{JSON.stringify(post.faq)}</script> tag.

Step 5 — Build and deploy to staging:
1. npm run build (foreground, wait exit 0)
2. pm2 restart yamada-staging
3. curl -s https://staging.yamada-tools.jp/ai/ai-kakuteishinkoku-freelance-2026 | grep -oE 'name="robots" content="[^"]*"' | head -1
   Expected: index, follow
4. curl -s https://staging.yamada-tools.jp/ai/ai-kakuteishinkoku-freelance-2026 | grep -c "FAQPage"
   Expected: >= 1 (schema injected)
5. curl -s https://staging.yamada-tools.jp/ai/ai-kakuteishinkoku-freelance-2026 | wc -c
   Expected: significantly larger than before (>40000 chars rendered HTML)

Step 6 — git commit:
git add . && git commit -m "content: expand /ai/ai-kakuteishinkoku-freelance-2026 to 5000+ ji guide with FAQ schema" && git push

Report all 3 curl outputs. Do NOT deploy to production yet.
```

---

## Faisal upload instructions

1. Download `ai-kakuteishinkoku-freelance-2026-content.md` from this chat
2. Download this `ai-kakuteishinkoku-deployment.md` file
3. SCP both to server: `scp -P 2222 *.md yamada@192.168.1.32:/home/yamada/projects/3websitepassive_income/yamada-tools/frontend-staging/_drafts/`
4. Run the Claude Code prompt above

After staging verification, production sync:
```
cd ~/projects/3websitepassive_income/yamada-tools/frontend
rsync -av ../frontend-staging/src/data/aiPosts.json ./src/data/
rsync -av ../frontend-staging/src/app/ai/ ./src/app/ai/
npm run build && pm2 restart yamada-frontend
git add . && git commit -m "content: expand ai-kakuteishinkoku-freelance-2026 (prod sync)" && git push
```

Then GSC:
- URL Inspection → request indexing for /ai/ai-kakuteishinkoku-freelance-2026
- Expected impact: page should start ranking for "ChatGPT 確定申告 フリーランス" cluster within 2-4 weeks
