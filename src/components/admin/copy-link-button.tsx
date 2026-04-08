"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyLinkButtonProps = {
  value: string;
  compact?: boolean;
  label?: string;
};

export function CopyLinkButton({
  value,
  compact = false,
  label = "复制链接",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        title={copied ? "已复制" : label}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-700"
    >
      {copied ? "已复制" : label}
    </button>
  );
}
