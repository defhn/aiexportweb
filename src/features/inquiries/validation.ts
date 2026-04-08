const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function validateInquiryAttachment(file?: File | null) {
  if (!file || file.size === 0) {
    return { ok: true as const };
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    return {
      ok: false as const,
      error: "Unsupported attachment type. Please upload PDF, Office, ZIP, or image files.",
    };
  }

  if (file.size > MAX_ATTACHMENT_SIZE) {
    return {
      ok: false as const,
      error: "Attachment is too large. Please keep files under 10MB.",
    };
  }

  return { ok: true as const };
}

export { ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENT_SIZE };
