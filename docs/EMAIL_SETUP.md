# Email Setup (Contact Form)

## Overview

The `/about/contact` form sends submissions via SMTP (nodemailer).  
If SMTP is not configured, submissions are saved to `/tmp/contact-submissions.jsonl` and the user still sees a success message.

## Required env vars

Add these to `.env.local` (development) or the PM2 ecosystem / production env:

```
SMTP_HOST=mail.yamadatrade.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@yamadatrade.com
SMTP_PASS=<your-smtp-password>
CONTACT_FROM_EMAIL=noreply@yamadatrade.com
CONTACT_TO_EMAIL=support@yamadatrade.com
```

### Where to get credentials

- Log in to your domain mail provider (e.g. the control panel for yamadatrade.com)
- Look for **Mail / SMTP settings** — it will show the host, port, and authentication details
- Common values: port 587 (STARTTLS) or 465 (SSL); `SMTP_SECURE=true` for port 465

## Fallback behavior (no SMTP)

If any of `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, or `CONTACT_TO_EMAIL` is missing:

1. Email is not sent
2. The submission is appended to `/tmp/contact-submissions.jsonl`
3. The user sees the success page (with a reference number)
4. A warning is written to the server log: `contact: email not sent: SMTP not configured | ref: YT-XXXXXXXX | saved to /tmp/contact-submissions.jsonl`

### Retrieve unsent submissions

```bash
# On the server
cat /tmp/contact-submissions.jsonl | python3 -c "import sys,json; [print(json.dumps(json.loads(l), indent=2, ensure_ascii=False)) for l in sys.stdin]"
```

## Testing locally

1. Copy `.env.example` → `.env.local`
2. Fill in real SMTP credentials
3. `npm run dev` and submit the form at http://localhost:3002/about/contact
4. Check your inbox for the test message

If you don't have SMTP credentials yet, leave the vars empty and check `/tmp/contact-submissions.jsonl` after submitting.
