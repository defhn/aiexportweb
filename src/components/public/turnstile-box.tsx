"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
        },
      ) => void;
    };
    __turnstileLoaded?: boolean;
  }
}

type TurnstileBoxProps = {
  inputId: string;
  widgetId: string;
};

export function TurnstileBox({ inputId, widgetId }: TurnstileBoxProps) {
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
    const tokenInput = document.getElementById(inputId) as HTMLInputElement | null;

    if (siteKey === "1x00000000000000000000AA") {
      if (tokenInput) {
        tokenInput.value = "test-pass";
      }
      return;
    }

    const renderWidget = () => {
      if (!window.turnstile) {
        return;
      }

      window.turnstile.render(`#${widgetId}`, {
        sitekey: siteKey,
        callback: (token) => {
          if (tokenInput) {
            tokenInput.value = token;
          }
        },
        "error-callback": () => {
          if (tokenInput) {
            tokenInput.value = "";
          }
        },
      });
    };

    if (window.__turnstileLoaded) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.__turnstileLoaded = true;
      renderWidget();
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [inputId, widgetId]);

  return (
    <div className="space-y-2">
      <div
        className="min-h-16 rounded-2xl border border-stone-200 bg-stone-50 p-2"
        id={widgetId}
      />
      <input id={inputId} name="turnstileToken" type="hidden" />
      <p className="text-xs text-stone-500">
        Spam protection is enabled for inquiry submissions.
      </p>
    </div>
  );
}
