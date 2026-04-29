# Staging Environment

## URL

**https://staging.yamada-tools.jp**

- Basic auth required: `yamada` / `staging2026`
- Blocked to crawlers via `X-Robots-Tag: noindex, nofollow`
- Routed via Cloudflare tunnel → `localhost:3003`
- PM2 process: `yamada-staging`
- Directory: `~/projects/3websitepassive_income/yamada-tools/frontend-staging`
- Port: `3003`

## Architecture

```
Cloudflare tunnel (staging.yamada-tools.jp)
  → localhost:3003
    → PM2 yamada-staging
      → frontend-staging/ (Next.js build)
```

`frontend-staging/` is a separate clone of the same GitHub repo, checked out on the current feature branch (currently `feat/jp-saas-phase-5-trust`).

## Deploying a Change to Staging

After committing to the feature branch in `frontend/`:

```bash
ssh -p 2222 yamada@192.168.1.32

# 1. Push to gitsave mirror
cd ~/projects/3websitepassive_income/yamada-tools/frontend
git push gitsave feat/jp-saas-phase-5-trust

# 2. Pull in staging clone
cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging
git pull gitsave feat/jp-saas-phase-5-trust

# 3. Build
npm run build

# 4. Restart PM2
pm2 restart yamada-staging
```

## Promoting Staging → Production

**Only do this after explicit user approval on staging.**

```bash
ssh -p 2222 yamada@192.168.1.32
cd ~/projects/3websitepassive_income/yamada-tools/frontend

# Merge feature branch to main (requires PR approval first)
git checkout main
git merge feat/jp-saas-phase-5-trust
npm run build
pm2 restart yamada-frontend
```

## Branch Tracking

| Directory | Branch | PM2 | Port |
|-----------|--------|-----|------|
| `frontend/` | current feature branch (development) | `yamada-frontend` | 3002 |
| `frontend-staging/` | current feature branch (staging preview) | `yamada-staging` | 3003 |

## Credentials

| Item | Value |
|------|-------|
| Staging URL | https://staging.yamada-tools.jp |
| Basic auth user | `yamada` |
| Basic auth password | `staging2026` |
| htpasswd file | `~/.htpasswd-staging` (used if nginx is added later) |

## Phase 5 Status

- Staging confirmed live: 2026-04-29
- Feature branch: `feat/jp-saas-phase-5-trust`
- Based on: `feat/jp-saas-phase-4-forms` (all Phase 4 fixes included)

## Automated Health Check (Cron)

The staging environment is monitored by a Playwright smoke test running every 6 hours.

**Cron entry** (added 2026-04-29):
```
0 0,6,12,18 * * * /home/yamada/bin/staging-health-check.sh
```

**Script:** `~/bin/staging-health-check.sh`

**Test spec:** `tests/staging-health.spec.ts` (8 tests)

**Logs:**
- Pass/fail summary: `~/logs/staging-health.log`
- Failure details: `~/logs/staging-health-failures.log`

**What it checks:**
1. Auth gate returns 401 without credentials
2. Homepage, contact, transparency, business pages return 200 + h1 visible
3. Homepage TrustBar wording: 多くの法人様にご利用いただいています
4. Contact form inputs: #name, #email, #subject, #message, submit button
5. Transparency page: TrustBadges (SSL/TLS暗号化) + CompanyLogosWall (掲載企業募集中)

**Email alerts:** Sent to CONTACT_TO_EMAIL via SMTP when credentials are in `.env.local`.
Until SMTP is configured, failures are logged to `staging-health-failures.log` only.

**Run manually:**
```bash
/home/yamada/bin/staging-health-check.sh
# or
cd ~/projects/3websitepassive_income/yamada-tools/frontend-staging
npx playwright test --config=playwright.staging.config.ts
```

**First confirmed passing run:** 2026-04-29 04:47 UTC — 8/8 tests passed in 10.4s
