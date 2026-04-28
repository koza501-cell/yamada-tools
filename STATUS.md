# STATUS.md — JP B2B SaaS Alignment Engagement
> Last updated: 2026-04-28

---

## Phase Summary

| Phase | Status | Branch |
|-------|--------|--------|
| Phase 0 — Discovery & Safety Net | DONE | `feat/jp-saas-phase-0-discovery` |
| Phase 1 — Typography & Global Tokens | DONE | `feat/jp-saas-phase-1-typography` |
| Phase 2 — Header / Navigation Fixes | DONE | `feat/jp-saas-phase-2-header` |
| Phase 3 — Hero Density Rebalance | DONE | `feat/jp-saas-phase-3-hero` |
| Phase 4 — Form System | pending | - |
| Phase 5 — Trust & Compliance Surfaces | pending | - |
| Phase 6 — Microcopy & Polish | pending | - |
| Phase 7 — QA, A11y, Perf | pending | - |

---

## Phase 3 — Done

- [x] Phase 3.1: `text-jp-h1` (clamp 1.75rem..2.5rem / lh 1.4) added to `tailwind.config.ts`
- [x] Phase 3.1: H1 uses `text-jp-h1 font-bold line-clamp-2`; renders ≤2 lines at all viewports 360–1920
- [x] Phase 3.1: `HeroAnimation` removed (redundant with TrustBar Phase 2D)
- [x] Phase 3.1: Trust badge row removed from hero (redundant with TrustBar Phase 2D)
- [x] Phase 3.2: `POPULAR_GRID` (8 cards) renders above `SearchBar`; old `SEARCH_CHIPS` chip row removed
- [x] Phase 3.2: Grid: 4 cols at lg+, 2 cols at sm/md; horizontal snap carousel at <sm with snap-x snap-mandatory
- [x] Phase 3.2: Card style reuses 日本専用ツール grid pattern for visual consistency
- [x] Phase 3.3: `HomepageAboveFold` client component (`src/components/home/HomepageAboveFold.tsx`)
- [x] Phase 3.3: Returning users (`yamada_recent_tools` non-empty) see 最近使ったツール above hero
- [x] Phase 3.3: Size-matched skeleton (460px + 80px) rendered during hydration to keep CLS ≤0.05
- [x] Phase 3.4: `CategoryRail` + `CategoryChips` in `src/components/home/CategoryNav.tsx`
- [x] Phase 3.4: Desktop sidebar (w-56, sticky top-80px, lg:block) shows 9 categories with live counts from `getToolCountByCategory`
- [x] Phase 3.4: `IntersectionObserver` highlights active category based on scroll position
- [x] Phase 3.4: Mobile chip strip (block lg:hidden, non-sticky) rendered just below above-fold content
- [x] Phase 3.4: Rail renders only on `/` (CategoryNav is imported only in `src/app/page.tsx`)
- [x] Playwright tests: `tests/visual/phase3.visual.spec.ts` (6 test cases)
- [x] Density baseline: `docs/audits/phase-3/density-before.json`
- [x] `npx tsc --noEmit` clean, `npm run build` clean

---

## Phase 2 — Done

- [x] Phase 2C: `getToolCountByCategory()` helper added to `src/config/tools.ts`
- [x] Phase 2C: `categories` field added to every `MenuSection` object (toolsMenu + calcMenu)
- [x] Phase 2C: Desktop dropdown section headings show `Name (N)` counts derived from registry; zero-count sections hidden
- [x] Phase 2C: Mobile drawer section rows show right-aligned count badge; `tabular-nums` applied
- [x] Phase 2D: `TrustBar` component created (`src/components/layout/TrustBar.tsx`)
- [x] Phase 2D: Sticky on `/` (`top-14 z-40`), static on other marketing pages; absent on all workspace paths
- [x] Phase 2D: Route allowlist enforced by `usePathname()` inside component (not in layout)
- [x] Phase 2D: `data-citation-needed` on 500社 claim + TODO comment for Phase 5
- [x] Phase 2D: Mobile horizontal scroll strip (no separators); desktop ・-separated centered bar
- [x] Phase 2D: Playwright route-guard tests (`tests/visual/trustbar.visual.spec.ts`)

- [x] Typo audit: 7 x シュミレーター → シミュレーター in Header.tsx (all display strings; URL slugs correct, no 301 needed)
- [x] `docs/audits/phase-2/typo-hunt.txt` committed (0 remaining matches in src/ tests/)
- [x] Desktop nav: お問い合わせ (text link) + 資料ダウンロード (outline btn, 資料DL@lg / full label@xl+) added at lg+
- [x] Mobile drawer: same two CTAs inserted at top (above ツール / 計算 sections)
- [x] `/about/business` — `id="download"` anchor added to security-doc section
- [x] `/about/contact/page.tsx` — stub created (form in Phase 5)
- [x] 20 Phase 2 visual baselines committed (5 pages × 2 viewports × 2 browsers)
- [x] `npx tsc --noEmit` clean, `npm run build` clean

---

## Phase 1 — Done

- [x] `--font-jp` CSS var in :root (OS-native stack: Hiragino > Noto via next/font variable > Yu Gothic > Meiryo)
- [x] next/font Noto Sans JP switched to `variable` mode (`--font-noto-jp`); className removed from body
- [x] `html { font-feature-settings: "palt" 1 }` — proportional kana spacing on all platforms
- [x] `body { font-family: var(--font-jp); line-height: 1.75; letter-spacing: 0.02em; color: #111827 }`
- [x] `h1: clamp(28px,4vw,40px) / lh 1.4 / fw 700`
- [x] `h2: clamp(22px,2.6vw,28px) / lh 1.5 / fw 700`
- [x] `h3: 18px / lh 1.6 / fw 600`
- [x] `p, li { line-height: 1.75 }`
- [x] `input, textarea { ime-mode: auto }` — no layout jump during kanji IME composition
- [x] `tailwind.config.ts`: fontFamily.sans → `var(--font-jp)`, jp alias, lineHeight tokens (jp/jp-tight/jp-heading), letterSpacing token (jp)
- [x] Visual spec improved: JS timer kill + CSS animation-pause injection for stable screenshots
- [x] 20 Phase 1 baselines committed (5 pages × 2 viewports × 2 browsers)
- [x] `npx tsc --noEmit` clean, `npm run build` clean

---

## Phase 0 — Done

- [x] MAP.md written and committed (framework, styling, form library, i18n, nav, gaps)
- [x] 10 visual baseline snapshots committed (5 pages x desktop + mobile)
  - /, /document/invoice, /pdf/compress, /generator/hanko, /convert/bank-format
- [x] `playwright.visual.config.ts` added (separate from existing e2e config)
- [x] `.github/workflows/ci.yml` added (lint + tsc --noEmit + build)
- [x] `docs/audits/` directory scaffolded for Lighthouse reports

---

## Key Findings from Discovery

- **No form library** — all forms use useState; react-hook-form + zod needed for Phase 4
- **Typo confirmed and fixed**: "シュミレーター" appeared in Header.tsx in 7 places — fixed in Phase 2
- **Contact page** exists at `/contact` (not `/about/contact`) — Phase 5 will extend it; `/about/contact` stub created in Phase 2
- **tools.ts** is the canonical tool registry — use for category counts in Phase 3
- **Font stack** in tailwind.config.ts already had Hiragino first; Phase 1 applied line-height 1.75 and font-feature-settings palt

---

## TODOs Surfaced

- [ ] Homepage has dynamic content (StatsCounter) + pdf-compress has animated elements causing Playwright flakiness — visual spec now freezes JS timers + injects animation-pause CSS; residual flakiness may need `--update-snapshots` after each phase
- [ ] No `/api/contact` route exists — must create in Phase 5 to send email to support@yamadatrade.com
- [ ] reCAPTCHA keys not set — gate behind `RECAPTCHA_SITE_KEY` env var
- [ ] CI workflow assumes `NEXT_PUBLIC_API_URL` secret set in GitHub repo settings
- [ ] Category counts in header dropdowns not yet dynamic — Phase 3 to derive from tools.ts
