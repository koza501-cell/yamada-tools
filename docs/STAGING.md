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
