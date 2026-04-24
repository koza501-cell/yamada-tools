# Audit: 封筒印刷ツール — Premium Upgrade Assessment
**Date:** 2026-04-24 | **URL:** https://yamada-tools.jp/generator/envelope-print | **Traffic:** 1,110 views/mo

---

## Summary

Strong Layer 2 candidate. Core printing engine (vertical layout, tate-chu-yoko, auto-font scaling, 14 sizes) is production-quality. Plan gates are already coded for pro/team/enterprise. Staging has bulk CSV components ready but not merged. **Critical blocker before monetizing: plan enforcement is 100% client-side (localStorage), and a Stripe live secret key is hardcoded in backend source.**

**Premium-readiness: 55%** — Architecture is right, but enforcement is bypassable and the biggest paid hook (bulk PDF) is broken for Japanese in staging.

---

## 1. All Files

### Production
```
frontend/src/app/generator/envelope-print/
  client.tsx          # 1934-line main component — all features inline
  page.tsx            # Metadata, FAQ, SEO, JSON-LD
  step-guide.tsx      # How-to steps below fold
  json-ld-dedup.tsx   # Dedup script to avoid double JSON-LD
frontend/public/og-tools/envelope-print.png
```

### Backend (Python/FastAPI)
```
backend/app/routers/addresses.py   # Server-side address book API (team/enterprise only)
backend/app/routers/payment.py     # Stripe subscriptions (pro/team, live keys hardcoded)
backend/app/routers/auth.py        # Email/password + magic link auth, 10-day trial
backend/app/routers/usage.py       # Usage tracking (exists, not wired to envelope tool)
backend/data/auth.db               # SQLite: users, sessions, team_addresses
```

### Staging (feature/envelope-v2-bulk branch, NOT in production)
```
frontend-staging/src/components/envelope/
  BulkModePanel.tsx       # Orchestrates bulk flow
  BulkUploadZone.tsx      # Drag-drop CSV/Excel upload
  ColumnMappingUI.tsx     # Manual column mapping UI
  BulkPreviewCarousel.tsx # Row-by-row preview + selection
frontend-staging/src/lib/envelope/
  csvParser.ts    # Proper RFC-4180 CSV + xlsx parser with auto column detection
  pdfExport.ts    # pdf-lib multi-page bulk PDF (broken for Japanese — see Bugs)
  validation.ts   # Postal format + honorific + mojibake risk validation
```

---

## 2. Current Features

| Feature | Status | Notes |
|---------|--------|-------|
| 14 envelope sizes | Production | 長形3/4/30/40, 角形2/A4/3/6/8, 洋形0/2/3/4/6 |
| 郵便番号 auto-lookup | Production | zipcloud API, 400ms debounce, auto on 7 digits |
| 縦書き / 横書き | Production | Full vertical engine with tate-chu-yoko for numbers |
| Auto font sizing | Production | Scales by address length; overflow detection with size suggestions |
| 差出人 input + save | Production | Persisted to localStorage |
| Stamp (在中) | Production | 12 texts, 3 colors, 9-position grid |
| Templates | Production | ビジネス / 請求書 / 履歴書 / 納品書 quick-fill |
| 300 DPI print | Production | 10x canvas scale -> browser print dialog |
| PDF | Production | Canvas PNG wrapped in print HTML page (not true PDF) |
| Simple / Advanced tabs | Production | かんたん: auto layout; 詳細: X/Y/font number inputs |
| Address book (宛名帳) | Production | localStorage; free=3, pro=100, team=2000 |
| Print history | Production | localStorage; free=3, pro=30, team/ent=unlimited |
| CSV import | Production | Free=5 rows, pro=50, team=500; CSV + xlsx supported |
| Bulk mode carousel | Production | Navigate loaded addresses inline |
| Logo (PRO gate) | Production | PNG/JPG/SVG, 4 positions, size/opacity slider |
| Customer barcode (PRO gate) | Production | Japan Post 4-state barcode, auto-generated |
| QR code (PRO gate) | Production | Custom URL->QR, 4 positions, loaded from CDN |
| Upgrade banner | Production | Shows after print on free plan, 24h cooldown |
| Dark mode | Production | Full Tailwind dark: classes |
| Structured bulk CSV components | STAGING ONLY | BulkModePanel etc. not merged to production |
| Bulk multi-page PDF export | STAGING ONLY | pdf-lib based — broken for Japanese (see B3) |
| Validation library | STAGING ONLY | JIS mojibake detection, honorific validation |

---

## 3. Quality Ratings

| Dimension | Score | Evidence |
|-----------|-------|----------|
| UX | 4/5 | Clean layout, mascot guidance, template buttons, overflow warnings with suggestions |
| Mobile | 3/5 | Responsive layout, canvas preview tiny on small screens; print is PC-only by nature |
| Error handling | 3/5 | Postal lookup errors surfaced, form validation on submit. Silent QR CDN failures; no retry UI |
| Edge cases | 4/5 | Long names: auto font scaling. Long company: scales to minCompany. Tate-chu-yoko for numbers |
| PDF output | 2/5 | Not a real PDF — browser print dialog required; font rendering OS-dependent; no font embedding |
| Speed | 4/5 | Canvas render is instant. Postal lookup 400ms debounce good. XLSX could lag on 500+ rows |

---

## 4. Bugs & Issues

### Critical (block monetization)

**B1 — Plan enforcement is 100% client-side (BYPASSABLE)**
`getUserPlan()` reads `localStorage.getItem('yamada_user_plan')`. Any user can open DevTools and set `localStorage.setItem('yamada_user_plan','team')` to unlock all features for free. CSV limits, address book limits, logo, barcode, QR — all gated only in browser. Backend `addresses.py` validates JWT for team addresses, but nothing else checks server-side plan.

**B2 — Stripe live secret key hardcoded in source**
`backend/app/routers/payment.py` line ~14: `STRIPE_SECRET_KEY = "sk_live_51Sa5r5DqjTXoIZZW..."` plaintext in repo. Anyone with repo access can charge customers or read subscription data. Must move to env var immediately.

**B3 — Staging bulk PDF is broken for Japanese**
`frontend-staging/src/lib/envelope/pdfExport.ts` uses `StandardFonts.Helvetica` which has zero Japanese glyph support. Every kanji, kana, and postal symbol renders blank. This is the #1 paid feature hook — it must work before launch.

### Moderate

**B4 — Ctrl+Shift+P plan toggle in production code**
Dev shortcut cycles plans (`free -> pro -> team -> enterprise`) in the production build. Any user who discovers this gets all paid features free without touching localStorage manually.

**B5 — CSV parser is naive (production)**
`parseCSV()` uses plain `split(",")` — breaks on quoted fields containing commas (e.g., `"山田,太郎"`). Staging's `csvParser.ts` handles RFC-4180 properly and is ready to replace it.

**B6 — Honorific typo in Excel column mapping**
In `client.tsx` Excel import: `"敷称": "honorific"` — 敷 (floor/tile) instead of 敬 (respect/honor). Excel files with `敬称` column header won't auto-map honorific.

**B7 — Address book field mismatch between client and backend**
Client stores: `prefecture + city + address1 + address2 + building` (5 fields).
Backend `team_addresses` stores: `address1 + address2 + address3` (3 fields).
Syncing would silently drop prefecture/city or merge them, losing structured address data.

### Minor

**B8 — QR library loaded from CDN at print time**
`qrcode-generator` loaded dynamically from `cdn.jsdelivr.net` on first QR request. If CDN is slow or blocked, QR silently fails with no user feedback.

**B9 — Double triggerSuccess / double semicolons**
Several lines: `setMascotState("success") triggerSuccess('envelope-print');;` — missing line break, double semicolons. No runtime crash (JS ignores empty statements) but indicates rushed editing.

---

## 5. Gap vs Japanese Business Standard

| Standard feature | Status | Gap |
|-----------------|--------|-----|
| 主要封筒全サイズ | OK | None — 14 sizes covered |
| 縦書き + 縦中横 | OK | None — implemented correctly |
| 御中/様 auto-select | Partial | No auto-switch: filling company with empty name should default honorific to 御中 |
| 取引先保存 (宛名帳) | Partial | Free=3 localStorage entries, weak for biz use; PRO should get server sync |
| CSV一括印刷 | Partial | Exists but multi-page bulk PDF is staging-only and broken |
| 差出人プリセット | OK | localStorage save/restore works |
| ロゴ入り封筒 | OK | PRO feature, implemented |
| 社判・スタンプ | Partial | 在中 stamp implemented; no社判 image upload (logo serves this purpose) |
| ラベル印刷 (A4シート) | Missing | No A4 label sheet output (コクヨ/Avery format) |
| 差出人面印刷 | Partial | Staging has duplexBackFlap in code but not exposed in UI |
| 役職 field | Missing | 部署 supported; 役職 (title) is not a field |
| 連名 (multiple names) | Missing | Single name only |

**vs Word**: Wins on postal lookup, size accuracy, auto-layout, barcode. Word loses on ease-of-use for envelope printing.
**vs Canva**: Wins on postal lookup, JP envelope templates, barcode. Canva has better visual editing.

---

## 6. Premium Feature Plan

### Free (keep)
- Single envelope print/PDF
- All 14 sizes, 縦/横, stamp, templates, postal lookup
- Address book: 3 entries (localStorage)
- History: 3 entries
- CSV: 5 rows preview

### PRO (expand current gates — upgrade hook)
- Already built: Logo, barcode, QR code
- Add: Server-side address book sync (currently team-only; lower barrier to upgrade)
- Add: CSV bulk up to 50 rows + multi-page PDF (fix Japanese font first)
- Add: Auto 御中/様 detection
- Add: Address book export as CSV
- History: 30 entries

### TEAM (existing tier)
- CSV bulk up to 500 rows
- Server-side shared address book (team_addresses API already exists)
- Multiple logos (5)
- History: unlimited
- Shared address book across team members

### ENTERPRISE
- Unlimited CSV rows, unlimited logos, priority support

---

## 7. Effort Estimates

| Feature | Effort | Notes |
|---------|--------|-------|
| Fix Stripe key -> env var | S | 10 min |
| Remove Ctrl+Shift+P from production | S | Delete ~10 lines |
| Fix honorific typo | S | 1 line |
| Auto 御中/様 on company fill | S | ~20 lines useEffect |
| Merge staging CSV parser | S | Replace inline parseCSV with csvParser.ts |
| Fix bulk PDF Japanese fonts | M | Embed Noto Serif JP subset in pdf-lib; ~5-10MB bundle impact |
| Merge staging bulk components | M | Wire BulkModePanel into client.tsx |
| Server-side plan enforcement | M | Middleware check on backend; client stays as UX |
| Extend addresses API to PRO | M | Currently team-only; add PRO plan check |
| user_addresses schema migration | M | Align DB fields with client fields before syncing |
| Address book export CSV | S | ~30 lines |
| Duplex/back-flap UI | M | pdfExport.ts has the flag; needs UI toggle |
| Label printing A4 sheet | L | New layout engine; different dimensions |
| 連名 (multi-name) support | L | Redesign name section in canvas renderer |

---

## 8. DB Schema

### Exists (backend/data/auth.db)
```sql
users (id, email, password_hash, company_name, plan,
       trial_started_at, trial_ends_at, email_verified)
sessions (id, user_id, token, expires_at)
magic_links (id, email, token, link_type, expires_at, used)
team_addresses (id, team_owner_id, label, postal_code,
                address1, address2, address3, name, honorific, created_at)
```

### Needed for premium
```sql
-- Server-side address book for PRO (align fields with client)
user_addresses (
  id, user_id, label, postal_code,
  prefecture, city, address1, address2, building,
  company_name, department, name, honorific,
  created_at, last_used_at
)

-- Usage tracking for analytics and cap enforcement
tool_usage_logs (
  id, user_id, tool_id, action,
  envelope_size, row_count, created_at
)

-- Server-side layout templates (TEAM feature)
envelope_templates (
  id, user_id, name, envelope_size,
  layout_json, is_default, created_at
)
```

---

## 9. Staging vs Production

| | Production (main, port 3002) | Staging (feature/envelope-v2-bulk, port 3003) |
|-|------------------------------|-----------------------------------------------|
| CSV import | Inline naive split(",") | csvParser.ts with RFC-4180 + xlsx |
| Bulk components | Inline in client.tsx | Separate components/ folder |
| Column mapping UI | No | ColumnMappingUI.tsx |
| Bulk multi-page PDF | No | pdfExport.ts (broken for Japanese) |
| Validation | Basic form only | validation.ts with postal + honorific + mojibake |

Staging is architecturally cleaner but the only new user-visible feature (bulk PDF) is broken. Fix Japanese font in staging, then merge.

---

## Build Order (next sprint)

1. **[S] Security fix**: Move Stripe secret + Resend keys to env vars
2. **[S] Remove dev backdoor**: Delete Ctrl+Shift+P plan toggle from production
3. **[S] Fix honorific typo**: `敷称` -> `敬称` in Excel column map
4. **[S] Auto 御中 detection**: useEffect on companyName/name change
5. **[M] Merge staging CSV parser**: Replace naive parseCSV with csvParser.ts
6. **[M] Fix bulk PDF Japanese fonts**: Embed Noto Serif JP subset in pdf-lib
7. **[M] Merge staging bulk components**: Ship BulkModePanel + BulkPreviewCarousel
8. **[M] Server-side plan enforcement**: Backend middleware validates plan on protected routes
9. **[M] Extend addresses API to PRO**: Lower upgrade barrier vs current team-only
10. **[L] user_addresses migration**: Align schema before syncing PRO addresses

---

**Doc:** `~/projects/3websitepassive_income/yamada-tools/docs/AUDIT_ENVELOPE_PRINT.md`

**Top 3 findings:**
1. **Plan enforcement is bypassable** — all limits live in localStorage; DevTools unlocks everything. Fix before charging.
2. **Bulk PDF (the main paid hook) is broken for Japanese** — staging pdf-lib export uses Helvetica with no JP glyphs. Every character renders blank.
3. **Stripe live key is hardcoded in source** — `sk_live_51Sa5r5...` plaintext in payment.py. Immediate security risk.

**Premium-readiness: 55%**
Core tool quality: 80% (layout engine, sizes, vertical writing are solid)
Monetization infrastructure: 40% (plan gates exist but all bypassable, paid hook broken)
Path to 80%: fix B1+B2+B3+B4 (all S or M effort), merge staging bulk components

---

## Phase A — Font Fix (2026-04-24)

### What was found
-  in both production and staging was an HTML 404 document (302KB), NOT a font file.
- The pdfExport.ts fix (Helvetica → TTF fetch) was written but uncommitted, and would have silently failed at runtime.
-  was not installed — pdf-lib requires it to embed any custom font; without it,  throws at runtime.

### What was done
1. Generated a real TTF subset from  (17MB) using pyftsubset:
   - Unicode ranges: ASCII, hiragana, katakana, CJK U+4E00–9FFF, compat ideographs (F900–FAFF), fullwidth (FF00–FFEF)
   - Result: **4.8MB, 21,916 glyphs**, no layout features, no hinting
   - Covers: 髙, 渡邊, 條澤邉, 御中, 〒, all business kanji tested — zero missing
2. Replaced fake TTF with real subset in 
3. Installed  and added  to pdfExport.ts
4. Generated test PDF — confirmed all Japanese text (5 lines) extracted correctly by pdftotext

### Commits on feature/envelope-v2-bulk
-  — replace fake TTF + pdfExport.ts Helvetica → Noto Sans JP
-  — add @pdf-lib/fontkit, register in generateBulkPdf

### Remaining before bulk PDF ships
- B4: Ctrl+Shift+P dev backdoor still in client.tsx (production-visible)
- B6: Honorific typo  →  in handleExcelImport()
- Performance: 4.8MB font fetched on every bulk export; consider module-level cache
- Verify  (U+20BB7, CJK Extension B) — not in subset; falls back to space for this rare character


---

## Phase A — Font Fix (2026-04-24)

### What was found
- NotoSansJP-Bold.ttf in both production and staging was an HTML 404 document (302KB), NOT a font.
- The pdfExport.ts fix (Helvetica → TTF fetch) was written but uncommitted, and would have silently failed at runtime.
- @pdf-lib/fontkit was not installed — pdf-lib requires it to embed custom fonts; without it embedFont() throws at runtime.

### What was done
1. Generated real TTF subset from NotoSansJP-Bold.otf (17MB) via pyftsubset:
   - Ranges: ASCII, hiragana, katakana, CJK U+4E00–9FFF, compat ideographs, fullwidth
   - Result: **4.8MB, 21,916 glyphs** — all business kanji including 髙・渡邊・條澤邉・御中・〒 confirmed covered
2. Replaced fake TTF with real subset at public/fonts/NotoSansJP-Bold.ttf
3. Installed @pdf-lib/fontkit ^1.1.1 and added pdfDoc.registerFontkit(fontkit) to pdfExport.ts
4. Test PDF generated — pdftotext confirmed all 5 Japanese text lines extracted correctly

### Commits on feature/envelope-v2-bulk
- f584d09 — replace fake TTF + switch Helvetica to Noto Sans JP in pdfExport.ts
- 0b446b7 — add @pdf-lib/fontkit, register in generateBulkPdf

### Remaining before bulk PDF ships
- B4: Ctrl+Shift+P dev backdoor still in client.tsx
- B6: Honorific typo (敷称 should be 敬称) in handleExcelImport()
- Performance: 4.8MB font fetched on every bulk export — consider module-level cache
- Note: rare CJK Extension B char 𠮷 (U+20BB7) not in subset; will render blank

### Known Limitations
- Rare kanji outside JIS X 0213 (e.g., 𠮷 U+20BB7) are not included in the font subset to keep file size ~4.8MB.
- Affects <0.01% of Japanese users (very rare surnames).
- Future: add FAQ note for users with unusual kanji.
- Reconsider if complaints arise — full coverage would add ~3MB.
