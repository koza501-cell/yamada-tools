# Yamada Tools — Handoff to Next Chat Session

**Last Updated:** May 3, 2026 ~02:00 JST
**Updated by:** Sonnet (5-task session)
**Reason for handoff:** Long working session, save state for continuity

---

## 🎯 HOW TO START THE NEXT SESSION

Paste the FIRST MESSAGE to next Claude:

> "Continuing yamada-tools work. Read the handoff doc at `~/projects/3websitepassive_income/yamada-tools/docs/HANDOFF.md` (or paste below). I'm Faisal, you're Sonnet. Operating rules unchanged: staging-first, manual approval for production, short replies, complete code, ask_user_input_v0 for choices, never assume my preferences."

Then paste this entire document.

---

## 🚨 LOCKED — DO NOT TOUCH

**AUTH/LOGIN SYSTEM IS OFF-LIMITS until Komoju review approval.**

Off-limits files/areas:
- `/auth/*` routes (login, verify, dashboard)
- `backend/app/routers/auth.py` (except security fixes already approved)
- Komoju/Stripe integration
- Magic link email flow
- Any account/user management

If user asks about login UI, header login button, or pricing/payment integration → **STOP and confirm Komoju has been approved first.**

---

## ✅ CURRENT STATE (May 3, 2026 ~02:00 JST)

### Production Status
- All routes 200 healthy
- Production code matches staging exactly (verified)
- Last 6 production deploys (May 2-3):
  - `847fd5b` — bank-format page.tsx dark mode + cornerstone blog callout
  - `62f8651` — bank-format form wrappers + scoped CSS v3 (90% dark mode)
  - `a153b1c` — Hide empty recent tools + global URL tracker for all 95+ tools
  - `6054d80` — RelatedTools map rewrite (15 broken IDs fixed + 70 new entries)
  - `81bed72` — Authority blog post zengin-format-complete-guide-2026 (~14.6k chars)
  - `571ac26` — Internal link from old zengin post → new complete guide
  - `f7c24b2` — bank-format 5 critical bugs fixed (toZenginKana, type code 12, SJIS, end newline, 識別表示 byte)
  - `af0e8d9` — Install missing packages (react-hook-form, zod, hookform/resolvers)
  - `65c2e31` — Install more missing packages + remove orphan vitest.config.ts

### ⚠️ MAJOR DISCOVERY (May 3)
Production build was **broken since Apr 29** due to missing npm packages. Site kept running on cached `.next/` build, but any PM2 restart would have caused outage. Now fixed — these packages added:
- `react-hook-form` `^7.75.0`
- `@hookform/resolvers` `^5.2.2`
- `zod` `^4.4.2`
- `@radix-ui/react-popover` (latest)
- `nodemailer` (latest)
- `@types/nodemailer` (dev)
- `encoding-japanese` `^2.x` + `@types/encoding-japanese` (dev) — for SJIS conversion

### Active SEO Bets (no work needed, just monitor May 21-28)
| Page | Cluster | Position | Goal |
|---|---|---|---|
| /generator/hanko | 電子印鑑 | ~20 | 8-12 |
| /image/dpi-checker | dpi チェック | ~18 | 8-12 |
| /image/monochrome | 白黒変換 | ~13 | 6-10 |
| /blog/zengin-format-how-to-create | 全銀フォーマット 作り方 | not ranking | first link added May 2 |
| /blog/zengin-format-complete-guide-2026 | NEW authority post | not yet indexed | submit to GSC |
| All 56 blogs | various | mostly invisible → indexed | sitemap submitted May 3 |

### Recently Resolved (Don't Re-Investigate)
- ✅ Header typo シュミレーター → シミュレーター (user fixed)
- ✅ Image resizer client-side error (user verified working)
- ✅ Sitemap submitted to GSC (May 3)
- ✅ ⌘K hide on mobile — already done in Header.tsx (`hidden xl:inline-block`)
- ✅ Dark mode polish on blog cards + footer email form — already had dark: classes
- ✅ RelatedTools cross-category links — comprehensive rewrite done
- ✅ Bank-format tool deep audit — 5 critical bugs found and fixed

---

## 🐛 BANK-FORMAT TOOL — KNOWN REMAINING BUGS

The May 3 deep audit found 21 bugs total. The 5 critical ones are FIXED. These remain (lower priority):

### 🟡 IMPORTANT (functional but not file-rejecting)
| Bug | Description | Severity |
|---|---|---|
| #5 | Header has extra `categoryCode` field not in spec (corrupts dummy area) | Medium |
| #6 | 預金種目 dropdown missing 貯蓄 in transfer rows (only header has it) | Medium |
| #7 | Header autocomplete writes full-width katakana to bankName field | Medium |
| #8 | Branch dropdown inconsistent — sometimes uses bankCode, sometimes doesn't | Medium |
| #9 | Reverse parser loses 新規コード and 振込指定区分 fields on roundtrip | Medium |
| #10 | Orphan `triggerSuccess` calls with double-semicolon `;;` (5+ places) | Low (works due to ASI) |
| #11 | 賞与対象期間 format unclear (bank-specific) | Medium |
| #12 | Bonus type writes data into header dummy field | Medium |

### 🟢 LOW priority observations
- Bank list only ~25 entries (no full coverage of regional/信金)
- Branch list only 3 mega banks have specific data
- File 2,551 lines / 124KB — should be split into multiple components
- No unit tests for conversion logic (high regression risk)

---

## 📋 PENDING TASKS (Pick Next From Here)

### Quick Wins (under 1 hr)
| # | Task | Time | Notes |
|---|---|---|---|
| A | Submit new zengin-complete-guide-2026 blog to GSC for indexing | 5 min | Manual: GSC → URL Inspection → Request Indexing |
| B | Fix bank-format Bug #6 (add 貯蓄 to transfer rows dropdown) | 10 min | Single line change |
| C | Cross-tool internal linking on next 5-10 high-traffic tools | 1 hr | Continue what was started May 3 |

### Medium Tasks (1-3 hrs)
| # | Task | Notes |
|---|---|---|
| D | Bank-format remaining bugs (#7, #8, #9) | Medium-priority cleanup |
| E | Audit other top 5 traffic tools (envelope-print, pdf-text-input, vertical-text, image-flip, random-picker) for similar bugs | Critical given bank-format had 21 bugs |
| F | Phase 2 SEO: schema markup expansion (ItemList all 95 tools, SearchAction, speakable) | Roadmap May Week 7 |

### Big Tasks (4+ hrs)
| # | Task | Notes |
|---|---|---|
| G | Reduce homepage 18 sections → ~10 | Roadmap May Week 1 — needs design decisions |
| H | Expand existing zengin-format-how-to-create post (Phase 2 of authority content) | Originally planned but skipped |

### Watch List (Defer)
- Komoju approval check → unlocks auth/payment work
- May 21-28 SEO bets check-in (3 weeks out)

---

## 🖥️ INFRASTRUCTURE REFERENCE

### Server Access
```
ssh -p 2222 yamada@192.168.1.32
```

### Paths
```
~/projects/3websitepassive_income/yamada-tools/frontend           (production)
~/projects/3websitepassive_income/yamada-tools/frontend-staging   (staging)
~/projects/3websitepassive_income/yamada-tools/backend            (production API)
~/projects/3websitepassive_income/yamada-tools/backend-staging    (staging API)
~/projects/3websitepassive_income/yamada-tools/docs/              (project docs incl. THIS HANDOFF)
```

### PM2 Processes
| ID | Name | Port | Purpose |
|---|---|---|---|
| 3 | yamada-frontend | 3002 | Production Next.js |
| 6 | yamada-staging | 3003 | Staging Next.js |
| 5 | yamada-backend | 8001 | FastAPI |
| 34 | yamada-backend-staging | varies | Staging API |

### Standard Deploy Sequence
```bash
# Staging
cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging
npm run build && pm2 restart yamada-staging
curl -s -o /dev/null -w "%{http_code}" "https://staging.yamada-tools.jp/"

# After user approval, copy to production
cp ~/projects/3websitepassive_income/yamada-tools/frontend-staging/PATH \
   ~/projects/3websitepassive_income/yamada-tools/frontend/PATH

cd ~/projects/3websitepassive_income/yamada-tools/frontend
npm run build && pm2 restart yamada-frontend

# Verify + commit
curl -s -o /dev/null -w "%{http_code}" "https://yamada-tools.jp/"
git add . && git commit -m "..." && git push
```

### Tech Stack
- Next.js 15 (App Router), Tailwind CSS, TypeScript
- FastAPI Python backend, SQLite
- Cloudflare Tunnel + R2
- Resend API (emails) — connected but auth flow LOCKED
- Google Analytics: G-MJDXY8TN33
- AdSense: ca-pub-2272972805493752

### GitHub
- Frontend: github.com/koza501-cell/yamada-tools.git
- Backend: github.com/koza501-cell/yamada-tools-backend.git (separate repo)

---

## ⚠️ HARD-LEARNED LESSONS

### Production Build Drift Risk (NEW — May 3)
Production package.json fell out of sync with the actual code, causing build failures for 4+ days while the site kept running on cached builds.
- **Always verify `npm run build` succeeds** after copying files staging → production
- **Don't trust `pm2 restart` alone** — if build fails, PM2 reverts to last cached `.next/`
- **`git status` and `git push` can succeed even after a failed build** — they're independent of build state
- After every deploy: explicitly check that the build output mentions "Compiled successfully" and "Linting and checking validity of types ✓"

### SSR Loading State Pattern (CRITICAL)
Many tool pages have this pattern at top of client.tsx:
```jsx
if (!mounted) {
  return <div className="min-h-screen py-12">読み込み中...</div>;
}
return <div className="min-h-screen pb-24">...real UI...</div>;
```
**Server-rendered HTML shows ONLY the loading shell.** Browser JS replaces with real UI after hydration. This means:
- `curl` checks see only loading state (we wasted hours yesterday on this)
- ALWAYS verify in browser, not just curl
- Edits to the second wrapper DO work in browser, just not in HTTP responses

### Tailwind Purge Survives Custom Class Names
- Custom non-Tailwind classes (e.g., `bank-format-page`) survive Tailwind purge
- Use this for scoped CSS overrides: `.dark .bank-format-page .bg-gray-50 { ... }`
- ZERO blast radius across other pages
- Validated working in commit `62f8651`

### File Editing Rules
- **Never use heredocs** — they corrupt files (lesson from previous sessions)
- Use Python scripts in `/home/claude/` then deliver via `/mnt/user-data/outputs/`
- User uploads files via PowerShell `scp -P 2222` from C:\Users\yamad\Downloads
- Always include pre-flight safety checks: marker not present, count == expected
- Always backup before editing: `cp file.tsx file.tsx.backup-$(date +%Y%m%d-%H%M-description)`

### Server Time vs JST
- Server runs UTC (May 3 02:00 UTC = May 3 11:00 AM JST)
- Backup filenames use UTC date — can cause confusion

### Bug Patterns in This Codebase (NEW — May 3)
The bank-format tool had 21 bugs — including critical ones (wrong byte counts, broken encoding). **Other top-traffic tools likely have similar issues** since they were built with similar patterns.
- Top-traffic tools (envelope-print, pdf-text-input, vertical-text, image-flip, random-picker) should be audited similarly
- Common pitfalls found: wrong byte counts, broken character encoding, hardcoded values that should use state, off-by-one in spec compliance

---

## 👤 USER OPERATING PREFERENCES

### Communication Style
1. Reply ONLY short, straightforward, to the point
2. Don't offer extra details/suggestions unless requested
3. Explain in easy mode (user is non-expert coder)
4. Re-check code for bugs before delivering
5. Always provide complete code (no fragments to replace pieces of)
6. When debug/edit requested → provide complete new updated file, not patches

### Workflow
- **Staging-first ALWAYS** — manual approval before production
- Sessions are work blocks with multiple fixes, not single tasks
- Always use `ask_user_input_v0` for any choice/preference
- User works in Tokyo timezone, currently 7am-evening hours
- User has ssh terminal already open in own session — don't include `ssh -p 2222 yamada@192.168.1.32` in every command

### File Delivery
- Outputs go to `/mnt/user-data/outputs/`
- User downloads to `C:\Users\yamad\Downloads`
- Uploads via PowerShell: `scp -P 2222 file.ext yamada@192.168.1.32:~/uploads/` or `:/tmp/`

---

## 📚 PROJECT BUSINESS CONTEXT

### Strategy
- 80% subscription revenue focus, 20% AdSense
- Target: 60% corporate (中小企業, クリニック), 25% freelancers, 15% individuals
- Design ethos: professional like freee/マネーフォワード
- Web-first (86.6% desktop, Edge 61% Japanese corporate)

### Pricing (Future, Locked Until Komoju)
- FREE: ¥0, 5 uses/day, ads on blogs only
- PRO: ¥980/月 or ¥7,980/年
- TEAM: ¥1,480/月/人 or ¥11,760/年/人
- DAY/3-DAY/WEEK passes: ¥300/¥600/¥1,200

### Currently 133 tools across 6 active niches
- 95+ available, rest "coming soon"
- Top traffic: 封筒印刷 (18%), 全銀フォーマット (14%), PDFに文字入力 (5%), 縦書き (5%), 画像反転 (4%)

### Key Roadmap Reference
- Master roadmap doc: `YAMADA-TOOLS-ROADMAP-V1.md` (in /mnt/project/)
- Currently in **Month 1 (May 2026) — Foundation Polish** phase
- Week 1 (now): homepage section reduction, visual consistency

---

## 📝 SESSION HISTORY — May 3, 2026 (this session)

### Tasks Completed
1. **RelatedTools map rewrite** (commit `6054d80`)
   - Found 15 broken tool IDs in the map (pdf-to-jpg→pdf-to-image, image-compress→compress-image, tategaki→vertical-text, password→password-generator, qrcode→qr-code, hash→hash-generator, tax-calc→tax-calculator, etc.)
   - Added 70+ new entries (envelope-print, flip, hanko, all finance/health tools)
   - pdf-text-input now has 2 related-tools sections (8 PDF tools + 6 cross-category)
   - Many pages were silently falling back to "same category" — now show proper cross-links

2. **Authority blog post: 全銀フォーマット完全ガイド** (commit `81bed72`)
   - File: `src/data/dynamicBlogs.json` slug `zengin-format-complete-guide-2026`
   - ~14,600 chars, 229 lines markdown
   - Covers: 4-record structure, 120-byte rules, all 4 record field tables, 5 common errors + fixes, bank list
   - Internal links to /convert/bank-format, /convert/zenkaku-hankaku, /document/invoice
   - **TODO: User needs to submit to GSC for indexing**

3. **Internal link from old → new zengin post** (commit `571ac26`)
   - Added callout box before まとめ section in old post
   - Links to new complete guide post
   - Helps both posts share authority

4. **Stale TODOs cleared:**
   - ⌘K mobile hide — already done in Header.tsx (`hidden xl:inline-block`)
   - Dark mode polish on blog cards/footer email form — already had `dark:` classes everywhere

5. **DEEP AUDIT of bank-format tool** (read all 2,551 lines)
   - Found 21 bugs total: 5 critical, 8 medium, 8 low
   - Documented complete report

6. **Fixed 5 CRITICAL bank-format bugs** (commit `f7c24b2` + `af0e8d9` + `65c2e31`)
   - **Bug #1:** `toZenginKana` rewritten with proper full→half katakana lookup table (was producing full-width)
   - **Bug #2:** 賞与振込 (12) now outputs correct type code (was hardcoded to 11)
   - **Bug #3:** SJIS encoding actually works now via `encoding-japanese` package (was just MIME metadata, file was always UTF-8)
   - **Bug #4:** End record now terminated with `\r\n` (was missing)
   - **Bug #21 (discovered during testing):** Data record was 119 bytes — added missing 識別表示 (1 byte) field

7. **Bonus discovery & fix:** Production build had been broken for 4+ days
   - Missing packages: react-hook-form, zod, @hookform/resolvers, @radix-ui/react-popover, nodemailer
   - Orphan vitest.config.ts breaking TS check
   - Site was running on cached `.next/` — risky if PM2 restarted
   - All resolved in commits `af0e8d9` + `65c2e31`

### Verification Status
- ✅ Claude Chrome tested all 4 critical bank-format fixes — all PASS
- ✅ Production code matches staging (diff verified)
- ✅ All production routes 200 OK
- ✅ Build succeeds with TS strict checks

---

## 🗂️ TRANSCRIPT REFERENCE

Past session transcripts are in `/mnt/transcripts/`:
- `2026-04-29-12-50-14-yamada-tools-redesign-session.txt`
- `2026-04-29-21-56-12-yamada-tools-redesign-deployment.txt`
- `2026-04-30-01-23-18-yamada-tools-dark-mode-deployment.txt`
- `2026-04-30-10-38-31-yamada-tools-week2-seo-pivot.txt`
- `2026-04-30-22-55-43-yamada-tools-week2-day2-seo-sitemap-fix.txt`
- (May 3 session — current, will be available in next session)

Use `view` tool with these paths to dig deeper if needed.

---

## ✅ END OF HANDOFF

Tell next Claude: "Read this entire doc before suggesting anything. Pick from the Quick Wins or Medium Tasks list above unless I say otherwise."
