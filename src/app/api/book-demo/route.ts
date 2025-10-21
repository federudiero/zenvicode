import { NextResponse } from "next/server";
import { z } from "zod";

const demoSchema = z.object({
  company: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = demoSchema.parse(json);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: false, error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "federudiero@gmail.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Zenvicode <onboarding@resend.dev>";

    const subject = `New demo request from ${data.name} (${data.company})`;
    const html = `
      <div style=\"font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111\">
        <h2 style=\"margin:0 0 12px 0\">New Demo Request</h2>
        <p style=\"margin:0 0 6px 0\"><strong>Company:</strong> ${escapeHtml(data.company)}</p>
        <p style=\"margin:0 0 6px 0\"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style=\"margin:0 0 6px 0\"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style=\"margin:0 0 6px 0\"><strong>Message:</strong></p>
        <div style=\"white-space:pre-wrap;border:1px solid #eee;border-radius:8px;padding:12px;background:#fafafa\">${escapeHtml(data.message)}</div>
      </div>
    `;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject,
        html,
        reply_to: data.email,
      }),
    });

    const resp = await r.json().catch(() => ({}));
    if (!r.ok) {
      return NextResponse.json({ ok: false, error: resp?.error || "Resend error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: resp?.id }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}