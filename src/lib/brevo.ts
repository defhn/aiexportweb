import { env } from "@/env";

export type InquiryEmailInput = {
  name: string;
  email: string;
  companyName?: string | null;
  country?: string | null;
  whatsapp?: string | null;
  message: string;
  productName?: string | null;
  sourceUrl?: string | null;
  attachmentUrl?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isDevBrevo() {
  return (
    process.env.NODE_ENV !== "production" && env.BREVO_API_KEY === "dev-brevo-key"
  );
}

export function buildInquiryEmailPayload(input: InquiryEmailInput) {
  const subject = input.productName
    ? `New inquiry for ${input.productName}`
    : "New website inquiry";

  const htmlContent = `
    <h2>${escapeHtml(subject)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(input.companyName ?? "-")}</p>
    <p><strong>Country:</strong> ${escapeHtml(input.country ?? "-")}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(input.whatsapp ?? "-")}</p>
    <p><strong>Product:</strong> ${escapeHtml(input.productName ?? "-")}</p>
    <p><strong>Source URL:</strong> ${escapeHtml(input.sourceUrl ?? "-")}</p>
    <p><strong>Attachment:</strong> ${escapeHtml(input.attachmentUrl ?? "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(input.message)}</p>
  `;

  return { subject, htmlContent };
}

export async function sendInquiryNotification(input: InquiryEmailInput) {
  const payload = buildInquiryEmailPayload(input);

  if (isDevBrevo()) {
    return payload;
  }

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Export Growth Website", email: env.BREVO_TO_EMAIL },
      to: [{ email: env.BREVO_TO_EMAIL }],
      subject: payload.subject,
      htmlContent: payload.htmlContent,
    }),
  });

  return payload;
}
