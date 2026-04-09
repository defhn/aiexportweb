"use server";

import { revalidatePath } from "next/cache";
import { env } from "@/env";

type SendReplyInput = {
  inquiryId: number;
  toEmail: string;
  toName: string;
  subject: string;
  bodyText: string;
};

function isDevBrevo() {
  return process.env.NODE_ENV !== "production" && env.BREVO_API_KEY === "dev-brevo-key";
}

export async function sendInquiryReply(input: SendReplyInput) {
  const { toEmail, toName, subject, bodyText, inquiryId } = input;

  if (!toEmail || !subject || !bodyText) {
    return { ok: false, error: "收件人、主题和正文均必填�? };
  }

  const htmlContent = bodyText
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("");

  if (isDevBrevo()) {
    console.log("[brevo/dev] 模拟发送邮�?", { toEmail, subject });
    revalidatePath(`/admin/inquiries/${inquiryId}`);
    return { ok: true, simulated: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Export Growth Sales", email: env.BREVO_TO_EMAIL },
        to: [{ email: toEmail, name: toName }],
        replyTo: { email: env.BREVO_TO_EMAIL },
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[brevo] 发送失�?", text);
      return { ok: false, error: `邮件发送失败：${response.status}` };
    }

    revalidatePath(`/admin/inquiries/${inquiryId}`);
    return { ok: true };
  } catch (error) {
    console.error("[brevo] 发送异�?", error);
    return { ok: false, error: "邮件服务暂时不可用，请稍后重试�? };
  }
}
