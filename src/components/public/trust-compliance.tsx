"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Shield, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent_v1";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so banner doesn't flash on every page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 z-[9999] flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-start gap-4 rounded-2xl border border-stone-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl sm:items-center"
          exit={{ y: 30, opacity: 0 }}
          initial={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-stone-900">
              We use cookies to improve your experience
            </p>
            <p className="mt-0.5 text-xs leading-5 text-stone-500">
              We use essential cookies for the site to function and analytics
              cookies to understand how you use it. No personal data is sold.{" "}
              <Link
                className="underline underline-offset-2 hover:text-stone-700"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="rounded-xl bg-stone-950 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              type="button"
              onClick={accept}
            >
              Accept
            </button>
            <button
              className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-50"
              type="button"
              onClick={decline}
            >
              Decline
            </button>
            <button
              aria-label="Close cookie banner"
              className="rounded-lg p-1 text-stone-400 hover:text-stone-600"
              type="button"
              onClick={decline}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** NDA 信任徽章组件 — 显示在询盘表单底部，强化保密承诺 */
export function NdaTrustBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 ${className}`}
    >
      <Shield className="h-4 w-4 shrink-0 text-emerald-500" />
      <span>
        <strong>Strict NDA Guaranteed</strong> &mdash; Your drawings, specs and
        business information are kept 100% confidential and never shared with
        third parties.
      </span>
    </div>
  );
}
