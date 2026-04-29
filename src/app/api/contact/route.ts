import { NextResponse } from "next/server";
import { appendFileSync } from "fs";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

// Maximum lengths to prevent abuse
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

const VALID_SUBJECTS = [
  "一般的なお問い合わせ",
  "バグ・不具合の報告",
  "機能のご要望",
  "セキュリティに関するご報告",
  "ビジネス・提携について",
  "その他",
];

function sanitize(s: string, max: number): string {
  return String(s ?? "").slice(0, max).trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateRef(): string {
  return "YT-" + randomBytes(4).toString("hex").toUpperCase();
}

async function trySendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ref: string;
}): Promise<{ sent: boolean; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM_EMAIL ?? user;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!host || !user || !pass || !to) {
    return { sent: false, error: "SMTP not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"山田ツール お問い合わせ" <${from}>`,
      to,
      replyTo: data.email,
      subject: `[お問い合わせ ${data.ref}] ${data.subject}`,
      text: [
        `参照番号: ${data.ref}`,
        `お名前: ${data.name}`,
        `メールアドレス: ${data.email}`,
        `件名: ${data.subject}`,
        "",
        "お問い合わせ内容:",
        data.message,
      ].join("\n"),
    });

    return { sent: true };
  } catch (err) {
    return { sent: false, error: String(err) };
  }
}

function saveToFile(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ref: string;
}) {
  const record = JSON.stringify({
    ...data,
    ts: new Date().toISOString(),
  });
  appendFileSync("/tmp/contact-submissions.jsonl", record + "\n", "utf-8");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = sanitize(body.name as string, MAX_NAME);
  const email = sanitize(body.email as string, MAX_EMAIL);
  const subject = sanitize(body.subject as string, MAX_SUBJECT);
  const message = sanitize(body.message as string, MAX_MESSAGE);

  if (!name) return NextResponse.json({ ok: false, error: "お名前を入力してください" }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ ok: false, error: "有効なメールアドレスを入力してください" }, { status: 400 });
  if (!VALID_SUBJECTS.includes(subject)) return NextResponse.json({ ok: false, error: "件名を選択してください" }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ ok: false, error: "お問い合わせ内容を10文字以上入力してください" }, { status: 400 });

  const ref = generateRef();
  const data = { name, email, subject, message, ref };

  const { sent, error: emailError } = await trySendEmail(data);

  // Always save to file as backup (or primary if SMTP not configured)
  try {
    saveToFile(data);
  } catch (e) {
    console.warn("contact: failed to save to file:", e);
  }

  if (!sent) {
    console.warn("contact: email not sent:", emailError, "| ref:", ref, "| saved to /tmp/contact-submissions.jsonl");
  }

  return NextResponse.json({ ok: true, ref });
}
