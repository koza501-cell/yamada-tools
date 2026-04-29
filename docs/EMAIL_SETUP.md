# Email Setup (Contact Form)

## Overview

The `/about/contact` form sends submissions via SMTP (nodemailer).  
If SMTP is not configured, submissions are saved to a persistent file and the user still sees a success message.

## Required env vars

Add these to `.env.local` on the production server:

```
SMTP_HOST=mail.yamadatrade.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@yamadatrade.jp
SMTP_PASS=<your-smtp-password>
CONTACT_FROM_EMAIL=noreply@yamadatrade.com
CONTACT_TO_EMAIL=support@yamadatrade.jp
```

### Where to get credentials

- Log in to your domain mail provider (e.g. the control panel for yamadatrade.com)
- Look for **Mail / SMTP settings** — it will show the host, port, and authentication details
- Common values: port 587 (STARTTLS) or 465 (SSL); `SMTP_SECURE=true` for port 465

## Fallback storage location

When SMTP is not configured, every submission is appended to:

```
/home/yamada/yamada-tools-data/contact-submissions.jsonl
```

**Why this path:**
- Persistent across reboots (unlike `/tmp/`)
- NOT inside `public/` or any statically-served directory — not web-accessible
- Directory permissions: `700` (yamada user only)
- File created with mode `0o600` (owner read/write only)

### Retrieve unsent submissions

```bash
# On the server
cat ~/yamada-tools-data/contact-submissions.jsonl | python3 -c "import sys,json; [print(json.dumps(json.loads(l), indent=2, ensure_ascii=False)) for l in sys.stdin]"
```

### Find new submissions via PM2 logs (faster)

Every successful submission writes a `[CONTACT]` log line:

```
[CONTACT] ref=YT-XXXXXXXX from=user@example.com subject=一般的なお問い合わせ stored=/home/yamada/yamada-tools-data/contact-submissions.jsonl smtp_skip=SMTP not configured
```

To grep for them:

```bash
pm2 logs yamada-frontend --nostream --lines 500 | grep "\[CONTACT\]"
```

## Fallback behavior (no SMTP)

If any of `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, or `CONTACT_TO_EMAIL` is missing:

1. Email is not sent
2. The submission is appended to the persistent fallback path above
3. The user sees the success page (with a reference number)
4. A `[CONTACT]` warn line is written to PM2 logs (greppable)

## Testing locally

1. Copy `.env.example` → `.env.local`
2. Fill in real SMTP credentials
3. `npm run dev` and submit the form at http://localhost:3002/about/contact
4. Check your inbox for the test message

If you don't have SMTP credentials yet, leave the vars empty and check the fallback file after submitting.
