# Project Status

## Phase 5 — Trust & Compliance Surfaces
**Branch:** `feat/jp-saas-phase-5-trust`
**Staging:** https://staging.yamada-tools.jp (auth: yamada / staging2026)

### Completed

| Item | Description | Commit |
|------|-------------|--------|
| 5.1 TrustBadges component | `src/config/certifications.ts` + `src/components/TrustBadges.tsx`; ssl + jp-server enabled; pmark/iso27001 disabled until certified | earlier |
| 5.2 CompanyLogosWall | `src/config/customer-logos.ts` (empty) + `src/components/CompanyLogosWall.tsx`; empty-state placeholder; 1-5 → row, 6+ → grayscale grid | earlier |
| 5.4 Transparency page | `/about/transparency` updated with TrustBadges, CompanyLogosWall, security prose, contact link | earlier |
| 5.4b Business page | `/about/business` updated with TrustBadges + CompanyLogosWall | earlier |
| 5.4c Footer | Added お問い合わせ link before サイトマップ | 7fafc69 |
| Staging infra | `src/middleware.ts` basic auth gate + robots noindex; staging.yamada-tools.jp live | 7fafc69 |
| 5.3 Contact form | `/about/contact` full form; `POST /api/contact` nodemailer+SMTP with fallback-to-file; `/about/contact/thanks` with ref number | 2041259 |
| 5.5 TrustBar wording | Removed `法人500社以上が利用` (unverified); replaced with `多くの法人様にご利用いただいています` | 2041259 |
| Playwright staging | `tests/staging-health.spec.ts` + `playwright.staging.config.ts`; tests auth gate, 4 routes, TrustBar wording, form inputs | 2041259 |
| Docs | `docs/EMAIL_SETUP.md`, `docs/CERTIFICATIONS.md`, `docs/CUSTOMER_LOGOS.md`, `docs/STAGING.md`, `.env.example` | - |

### Open Items

| Item | Status | Notes |
|------|--------|-------|
| SMTP credentials | Waiting | Fill in `.env.local` on server; see `docs/EMAIL_SETUP.md`. Until then, submissions go to `/tmp/contact-submissions.jsonl` |
| Customer logos | Waiting | Add approved company logos to `src/config/customer-logos.ts` + upload to `public/logos/`; see `docs/CUSTOMER_LOGOS.md` |
| Certifications | Waiting | Enable `pmark` and `iso27001` in `src/config/certifications.ts` once certified |
| Playwright CI cron | Pending | Wire `npx playwright test --config=playwright.staging.config.ts` into CI or server cron |

### Staging Verification (2026-04-29)

```
GET /               → 200, TrustBar: 多くの法人様にご利用いただいています ✓
GET /about/contact  → 200, form rendered ✓
POST /api/contact   → {"ok":true,"ref":"YT-D5F241FA"}, saved to /tmp/contact-submissions.jsonl ✓
GET /about/transparency → 200, TrustBadges + CompanyLogosWall ✓
GET /about/business    → 200 ✓
GET / (no auth)     → 401 ✓
```
