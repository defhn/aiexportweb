import { env } from "@/env";

function isDevTurnstile() {
  return (
    process.env.NODE_ENV !== "production" &&
    env.TURNSTILE_SECRET_KEY === "dev-turnstile-secret"
  );
}

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  if (isDevTurnstile()) {
    return token === "" || token === "test-pass";
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  );

  const json = (await response.json()) as { success: boolean };
  return json.success;
}
