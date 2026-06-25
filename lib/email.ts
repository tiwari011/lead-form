import { Resend } from "resend";
import type { LeadDocument } from "./schemas/Lead";

const DEFAULT_REDIRECT_URL = "https://admexo.com";

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(process.env.RESEND_API_KEY);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM || "Lead Team <onboarding@resend.dev>";
}

function getReplyTo() {
  return process.env.EMAIL_REPLY_TO || undefined;
}

export async function sendLeadEmail(lead: LeadDocument) {
  const appUrl = getAppUrl();
  const leadId = lead._id.toString();
  const clickUrl = `${appUrl}/api/track/${leadId}/click?redirect=${encodeURIComponent(
    DEFAULT_REDIRECT_URL
  )}`;
  const openPixelUrl = `${appUrl}/api/track/${leadId}/open`;

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to: lead.email,
    replyTo: getReplyTo(),
    subject: "Thanks for reaching out",
    html: `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="padding:28px;background:#4f46e5;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;line-height:1.25;">We received your requirement</h1>
          </div>
          <div style="padding:28px;">
            <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi ${escapeHtml(lead.name)},</p>
            <p style="font-size:16px;line-height:1.7;margin:0 0 18px;">
              Thank you for reaching out. We received your requirement:
              <strong>${escapeHtml(lead.requirement)}</strong>
            </p>
            <a href="${clickUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none;">
              Learn more
            </a>
            <p style="font-size:13px;line-height:1.6;color:#64748b;margin:24px 0 0;">
              Our team will review your details and get back to you shortly.
            </p>
          </div>
        </div>
        <img src="${openPixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;" />
      </div>
    `
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendTestEmail(to: string) {
  const resend = getResendClient();
  const appUrl = getAppUrl();

  const { data, error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    replyTo: getReplyTo(),
    subject: "Lead Tracking System email test",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h1 style="font-size:22px;margin:0 0 12px;">Email test successful</h1>
        <p style="margin:0 0 12px;">Your Lead Tracking System can send email through Resend.</p>
        <p style="margin:0;">App URL: ${escapeHtml(appUrl)}</p>
      </div>
    `
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
