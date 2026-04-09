"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { SitePlan } from "@/lib/plans";

import { PlanBadge } from "./plan-badge";

export function Header({ currentPlan }: { currentPlan: SitePlan }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <header className="flex items-center justify-between rounded-[2rem] border border-stone-200 bg-white px-6 py-5 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-500">后台总览</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-stone-950">管理中心</h1>
          <PlanBadge plan={currentPlan} />
        </div>
      </div>
      <button
        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        onClick={handleLogout}
        type="button"
      >
        {pending ? "退出中..." : "退出登�?}
      </button>
    </header>
  );
}
