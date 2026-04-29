# Certifications

Certification badges on yamada-tools.jp are config-driven.
Only certifications that 合同会社山田トレード **actually holds** may be enabled.

## Config location

`src/config/certifications.ts`

Each entry has an `enabled` boolean. Only `enabled: true` entries are rendered.
Disabled entries are **not shown at all** — no greyed-out placeholders.

## Current status

| Badge | Status | Held by |
|-------|--------|---------|
| SSL/TLS暗号化 | ✅ enabled | Cloudflare (automatic) |
| 国内サーバー | ✅ enabled | VPS in Japan |
| Pマーク | ❌ disabled | Not yet obtained |
| ISO 27001 | ❌ disabled | Not yet obtained |
| ISMS | ❌ disabled | Not yet obtained |

## How to enable a certification

1. Confirm legal/compliance team has verified accreditation is active.
2. Set `enabled: true` on the appropriate entry in `certifications.ts`.
3. Optionally add an `href` linking to the issuer's verification page.
4. Commit with a reference to the accreditation date/number.

**Never enable a certification that the company has not actually obtained.**
This creates false advertising and potential legal liability.
