# Project Status

## Phase 5 — Trust & Compliance Surfaces
**Branch:** `main` (merged 2026-04-29)
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
| SMTP credentials | Skipped for now | Submissions go to `/home/yamada/yamada-tools-data/contact-submissions.jsonl` (persistent). Grep PM2 logs for `[CONTACT]`. Enable later via `.env.local`; see `docs/EMAIL_SETUP.md`. |
| Customer logos | Waiting | Add approved company logos to `src/config/customer-logos.ts` + upload to `public/logos/`; see `docs/CUSTOMER_LOGOS.md` |
| Certifications | Waiting | Enable `pmark` and `iso27001` in `src/config/certifications.ts` once certified |
| Playwright CI cron | Done | Cron: `0 0,6,12,18 * * * /home/yamada/bin/staging-health-check.sh`; last run 2026-04-29 04:47 PASS 8/8 |

### Staging Verification (2026-04-29)

```
GET /               → 200, TrustBar: 多くの法人様にご利用いただいています ✓
GET /about/contact  → 200, form rendered ✓
POST /api/contact   → {"ok":true,"ref":"YT-D5F241FA"}, saved to /tmp/contact-submissions.jsonl ✓
GET /about/transparency → 200, TrustBadges + CompanyLogosWall ✓
GET /about/business    → 200 ✓
GET / (no auth)     → 401 ✓
```

### Production Verification (2026-04-29) MERGED

```
GET /               => 200, TrustBar: ok
GET /about/contact  => 200, form fields: id=name/email/subject/message ok
POST /api/contact   => {"ok":true,"ref":"YT-BC4DE105"}
transparency        => SSL/TLS + CompanyLogosWall ok
submissions file    => written 600 perms ok
PM2 [CONTACT] log   => ref=YT-BC4DE105 smtp_skip=SMTP not configured ok
middleware no-op    => STAGING_AUTH_USER unset => 200 ok
middleware auth     => STAGING_AUTH_USER=yamada => 401 ok
```

### Open Follow-ups

| Item | Notes |
|------|-------|
| SMTP credentials | Set SMTP_HOST/PORT/SECURE/USER/PASS/CONTACT_FROM_EMAIL/CONTACT_TO_EMAIL in .env.local |
| Customer logos | src/config/customer-logos.ts + public/logos/; see docs/CUSTOMER_LOGOS.md |
| Pmark/ISO27001 | Enable flags in src/config/certifications.ts once certified |
| Phase 6 | Microcopy polish; start 2026-04-30 after 24h observation |
