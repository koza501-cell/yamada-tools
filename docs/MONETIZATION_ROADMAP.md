# 📘 yamada-tools.jp Monetization Roadmap & Feature Decision Rules

**Version**: 1.0
**Last Updated**: April 23, 2026
**Owner**: 合同会社山田トレード (Yamada Trade LLC)

---

## 🎯 Purpose of This Document

When adding ANY new tool or feature, use this document to decide:
1. Is it free, freemium, or paid?
2. If paid → day pass, monthly, or 買い切り?
3. Which user type does it target?

**Rule**: If you can't categorize a new feature using this doc, ADD a category here first, then build.

---

## 🏗️ The 4-Layer Architecture

Every tool/feature on yamada-tools.jp belongs to ONE of these 4 layers.

```
┌─────────────────────────────────────────────────────┐
│ LAYER 1: FREE FOREVER (SEO/Traffic Engine)          │
├─────────────────────────────────────────────────────┤
│ LAYER 2: SMART FREEMIUM (Office Productivity)       │
├─────────────────────────────────────────────────────┤
│ LAYER 3: PRO CALCULATORS (Decision Tools)           │
├─────────────────────────────────────────────────────┤
│ LAYER 4: B2B / CORPORATE (Enterprise)               │
└─────────────────────────────────────────────────────┘
```

---

## 📋 LAYER 1: FREE FOREVER

### Purpose
- Drive SEO traffic
- Build trust
- Get AI engines (ChatGPT, Perplexity, Gemini) to recommend us
- Funnel users into Layer 2/3 paid features

### Decision Criteria — Put a tool in Layer 1 IF:
- ✅ Used as a quick one-shot lookup/conversion
- ✅ User finishes in <30 seconds
- ✅ No file upload required (or tiny file)
- ✅ No complex output to download
- ✅ High search volume (10,000+ monthly searches)
- ✅ Many free competitors exist already
- ✅ Used by general public, not just business
- ✅ Cost to serve is essentially zero

### Examples (current tools)
- 和暦↔西暦変換
- ふりがな変換
- 文字数カウント
- 消費税計算
- パスワード生成
- ランダム抽選
- インボイス番号検証
- 坪変換
- QRコード生成
- ランダム数値生成
- 単位変換
- カラーピッカー

### Monetization
- **Tool itself**: 100% free
- **Page**: Sidebar AdSense (small, non-intrusive)
- **NEVER**: Watermark, popup, account requirement, output ads

### Future tools to ADD here
- Any simple Japan-specific converter
- Any quick text/number tool
- Any "lookup" tool
- Anything competitor (e.g., 窓の杜) lists as "便利ツール"

---

## 📋 LAYER 2: SMART FREEMIUM

### Purpose
- Office worker productivity tools
- Generate revenue via day passes & monthly subscriptions
- Free for casual use, paid for business scale

### Decision Criteria — Put a tool in Layer 2 IF:
- ✅ Produces a downloadable file (PDF, CSV, image)
- ✅ Used for actual business work (sent to clients, used at office)
- ✅ Has obvious "scale" use case (1 vs many)
- ✅ Has obvious "save/template" use case
- ✅ Costs server resources (file processing, AI, etc.)
- ✅ Office workers willing to pay ¥300-1,000 for urgent task

### Examples (current/planned tools)
- 封筒印刷
- 請求書作成
- 見積書作成
- 納品書作成
- 領収書作成
- FAX送付状
- 名刺作成
- 全銀フォーマット変換
- PDF結合
- PDF分割
- PDF圧縮
- PDF回転
- PDF文字入力
- PDF OCR
- 画像圧縮
- 画像リサイズ
- フォーマット変換
- モザイク
- 電子印鑑
- 縦書きテキスト

### The Free vs Paid Split Rule

| Use Pattern | Free | Paid (Day Pass / Monthly) |
|---|---|---|
| Quantity | 1 at a time | Bulk / batch (10+) |
| Templates | None | Save unlimited |
| Customer/Address DB | None | Save unlimited |
| File size | 10MB | 200MB |
| Daily limit | 5-10 uses | Unlimited |
| Resolution | Standard | High-res / print quality |
| API access | None | Available |

### Monetization Tiers

| Tier | Price | Includes |
|---|---|---|
| **Free** | ¥0 | Single use, basic features only |
| **1日パス** | ¥300 | All Layer 2 power features for 24h |
| **3日パス** | ¥800 | All Layer 2 power features for 3 days |
| **7日パス** | ¥1,500 | All Layer 2 power features for 7 days |
| **PRO月額** | ¥980/月 | All Layer 2 power features, recurring |
| **TEAM** | ¥1,480/user/月 | PRO + multi-user (min 2 users) |

### When Adding a New Layer 2 Tool — Decision Tree

```
NEW TOOL?
│
├─ Does it produce a downloadable business document?
│   YES → Layer 2 candidate, continue ↓
│   NO → Maybe Layer 1
│
├─ Can it be used "in bulk" (CSV upload, batch)?
│   YES → Bulk = paid feature
│
├─ Can users save templates?
│   YES → Templates = paid feature
│
├─ Does it produce client-facing output?
│   YES → NEVER add watermark
│   NO → Watermark possible (but still avoid by default)
│
└─ Default split:
    Free: Single-use, basic
    Paid: Bulk, save, templates, high-res
```

### Future tools to ADD to Layer 2
- 給与明細作成
- 源泉徴収票作成
- 出張旅費精算書
- ラベル印刷 (mailing labels)
- バーコード生成 (bulk)
- PDF墨消し (redaction) — bulk
- 履歴書作成 — multiple templates

---

## 📋 LAYER 3: PRO CALCULATORS

### Purpose
- Deep financial/decision tools
- Recurring use over weeks/months for life decisions
- Premium subscription + 買い切り option for サブスク疲れ users

### Decision Criteria — Put a tool in Layer 3 IF:
- ✅ Helps user make a life/financial decision
- ✅ User needs to compare multiple scenarios
- ✅ User returns over days/weeks
- ✅ Could literally save user ¥hundreds of thousands
- ✅ Complex calculation logic (taxes, compound interest)
- ✅ Result requires saving/sharing/PDF export

### Examples (current tools)
- 新NISAシミュレーター Pro
- 住宅ローン計算機 Pro
- FX損益計算機 Pro
- 老後資金シミュレーター Pro
- iDeCo vs NISA 比較ツール Pro

### Monetization Tiers

| Tier | Price | Includes |
|---|---|---|
| **Free** | ¥0 | Basic single calculation, no save |
| **Pro月額** | ¥980/月 | All Pro calculators + save scenarios + PDF export |
| **Pro年額** | ¥9,800/年 | Same as monthly, 2ヶ月分お得 |
| **買い切り (per tool)** | ¥4,980 | One specific tool, lifetime |
| **買い切り (全部入り)** | ¥14,800 | All current + future Pro calculators, lifetime |

### NEVER do for Layer 3
- ❌ Day passes (wrong psychology — these are long-term decisions)
- ❌ Watermark on PDF exports
- ❌ Pop-ups during use
- ❌ Time-limited free trials (Japanese hate cancel anxiety)

### Future tools to ADD to Layer 3
- 退職金シミュレーター
- 相続税シミュレーター
- 副業確定申告計算
- インボイス対応 消費税計算 Pro
- 法人税シミュレーター
- 不動産投資シミュレーター
- 株式投資シミュレーター
- 生命保険必要保障額計算

---

## 📋 LAYER 4: B2B / CORPORATE

### Purpose
- High-value enterprise contracts
- 請求書払い (invoice billing)
- White-label / API access

### Decision Criteria — Put a feature in Layer 4 IF:
- ✅ Multi-user collaboration required
- ✅ Volume usage (1000+ operations/month)
- ✅ Compliance/audit logging needed
- ✅ Custom branding / white-label
- ✅ Dedicated support required

### Examples (planned)
- API access (¥29,800/月+)
- White-label PDF reports (for accounting firms)
- Custom integration (for large companies)
- SSO login
- Audit log
- Bulk user management
- 請求書払い with 領収書

### Monetization

| Tier | Price | Notes |
|---|---|---|
| **TEAM (small)** | ¥1,480/user (min 2) | Already in Layer 2 |
| **Business** | ¥9,800-29,800/月 | API + white-label |
| **Enterprise** | お問い合わせ | Custom contracts |

### Required for Layer 4
- 請求書払い (invoice payment)
- 領収書 auto-generation
- 適格請求書発行事業者番号 on invoices
- Annual billing option
- Dedicated support email

---

## 🎯 NEW FEATURE DECISION FLOWCHART

```
NEW FEATURE / TOOL idea
│
├─ Is it a calculator for life decisions?
│   ├─ YES → LAYER 3 (Pro Calculator)
│   └─ NO ↓
│
├─ Does it produce business output (PDF/file)?
│   ├─ YES → LAYER 2 (Smart Freemium)
│   └─ NO ↓
│
├─ Is it a quick one-shot lookup/conversion?
│   ├─ YES → LAYER 1 (Free Forever)
│   └─ NO ↓
│
├─ Is it for enterprise/multi-user/API?
│   ├─ YES → LAYER 4 (B2B)
│   └─ NO ↓
│
└─ STOP: Re-think the feature concept
   It might not fit the product vision
```

---

## 🚦 Quick Reference: Adding a Power Feature to an Existing Tool

When extending an existing Layer 2 tool with a "premium feature", use this rule:

| Feature Type | Goes to |
|---|---|
| Bulk processing (10+ items) | Paid (Day Pass / Monthly) |
| Save templates | Paid |
| Save customer/address database | Paid |
| Upload larger files (>10MB) | Paid |
| High-resolution output | Paid |
| Remove daily usage limit | Paid |
| API access | Paid (Layer 4) |
| Faster processing | Paid |
| New file format support (basic) | Free |
| UI improvements | Free |
| Better mobile responsiveness | Free |
| Bug fixes | Free |
| New tool variations (basic) | Free |

---

## 💰 Payment Methods Strategy

### Active (via Stripe)
- ✅ Credit Card
- ✅ Apple Pay (toggle in Stripe Dashboard)
- ✅ Google Pay (toggle in Stripe Dashboard)
- ✅ Link (toggle in Stripe Dashboard)

### Pending (via KOMOJU — apply after this doc)
- 🔄 Konbini (all stores including 7-Eleven) — 2.75% fee
- 🔄 Bank Transfer — 1.4% fee (cheapest)
- 🔄 Pay-Easy — 2.75% fee
- 🔄 PayPay — 3.5%~ (verify rate)

### Skip / Avoid
- ❌ Carrier billing (15% digital rate)
- ❌ Prepaid cards (12% rate)
- ❌ Rakuten Pay (high digital rate)

### Payment method assignment by tier

| Tier | Recommended Methods |
|---|---|
| Day Pass (¥300-1,500) | Card, Apple Pay, Google Pay, Konbini, PayPay |
| Monthly (¥980) | Card, Apple Pay, Google Pay (recurring requires card) |
| Annual (¥9,800) | Card, Bank Transfer, Konbini (one-time payment) |
| 買い切り (¥4,980-14,800) | Card, Bank Transfer, Konbini, PayPay |
| Corporate (¥29,800+) | Bank Transfer, 請求書払い |

---

## 📜 IRON RULES (Never Break These)

### Rule 1: NO watermark on client-facing output
Tools where output goes to clients (請求書, 見積書, 名刺, 封筒, 納品書) NEVER get watermarks. Embarrassment risk too high in Japanese B2B.

### Rule 2: Free single-use must always work
Any Layer 2 tool MUST allow single-use for free. Killing free use = killing SEO + trust.

### Rule 3: 領収書 must be auto-generated
Every paid purchase MUST auto-generate downloadable PDF 領収書 with company info. This unlocks 経費精算 (expense reimbursement) for office workers.

### Rule 4: Paywall ONLY at the power feature moment
Never block users at the start of a tool. Block ONLY when they try to:
- Upload CSV / bulk
- Save template
- Process 10+ items
- Export high-res

### Rule 5: Cancel anytime, full transparency
No hidden fees, no auto-renewal traps, no cancel difficulty. Japanese users punish サブスク with hidden gotchas.

### Rule 6: Price all subscriptions 税込 (tax-inclusive)
Display prices include 10% JCT. Never show "+ tax" — it kills impulse purchase.

### Rule 7: コンビニ払い must support 7-Eleven
KOMOJU supports all stores. Never use a payment method that excludes 7-Eleven.

### Rule 8: Free Forever tools STAY free forever
Once a tool is in Layer 1, it can NEVER move to Layer 2 or 3. This builds long-term trust.

### Rule 9: Show day pass > subscription
On paywall screens, day pass is the PRIMARY option. Monthly is secondary. This matches Japanese psychology.

### Rule 10: Never require login for free use
Layer 1 tools = zero login. Layer 2 free use = zero login. Login only required for purchase or to save data.

---

## 🎯 12-Month Revenue Projection

| Month | Day Pass | Monthly Sub | Pro Calc | B2B | Ads | Total |
|---|---|---|---|---|---|---|
| Month 3 | ¥10,000 | ¥5,000 | ¥5,000 | ¥0 | ¥3,000 | ¥23,000 |
| Month 6 | ¥30,000 | ¥15,000 | ¥10,000 | ¥30,000 | ¥10,000 | ¥95,000 |
| Month 12 | ¥80,000 | ¥40,000 | ¥30,000 | ¥100,000 | ¥30,000 | ¥280,000 |

Assumes traffic grows from 200/day to ~2,000/day in 12 months.

---

## 🔄 When to Update This Document

Update this roadmap when:
- Adding a new tool category not covered here
- Changing pricing tiers
- Adding a new payment method
- Discovering a new user behavior pattern
- After 3 months of real conversion data (adjust assumptions)

---

## 📚 Quick Decision Examples

### Example 1: "Should I add a 給与明細作成 (payslip generator) tool?"
- Produces business document → YES
- Has bulk use case → YES (companies generate many)
- Has template save → YES
- → **LAYER 2** (Smart Freemium)
- Free: 1 payslip
- Paid: Bulk CSV upload, save templates

### Example 2: "Should I add a 退職金シミュレーター?"
- Helps life decision → YES
- Multiple scenarios → YES
- Returns over time → YES
- → **LAYER 3** (Pro Calculator)
- Free: Basic calc
- Paid: Save scenarios, PDF export, advanced parameters

### Example 3: "Should I add a タイムゾーン変換ツール?"
- Quick lookup → YES
- No file output → YES
- Used by general public → YES
- → **LAYER 1** (Free Forever)
- All free, sidebar ads OK

### Example 4: "Should I add API access to PDF tools?"
- Multi-user/enterprise → YES
- High volume → YES
- → **LAYER 4** (B2B)
- ¥29,800+/月 with API key

### Example 5: "Should I add 'remove watermark' as a paid feature?"
- ❌ STOP — Iron Rule #1
- We don't add watermarks on client-facing tools
- Find a different premium feature

---

## ✅ Pre-Launch Checklist for New Features

Before deploying any new paid feature:

- [ ] Categorized into correct Layer (1-4)
- [ ] Pricing aligned with this doc
- [ ] Free version still works for casual users
- [ ] No watermark on client-facing output
- [ ] 領収書 generation enabled
- [ ] Payment methods configured per tier
- [ ] Cancel/refund flow tested
- [ ] 税込 pricing displayed
- [ ] Terms of service updated
- [ ] Tested on staging.yamada-tools.jp first

---

**END OF ROADMAP DOCUMENT**

Keep this file in your repo at `/docs/MONETIZATION_ROADMAP.md` and reference it for every new feature decision.
