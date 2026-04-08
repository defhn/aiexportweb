import type { ReactNode } from "react";

import { getCurrentSitePlan } from "@/features/plans/access";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const currentPlan = getCurrentSitePlan();

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-stone-100">
      <Sidebar currentPlan={currentPlan} />
      <section className="p-8">
        <div className="space-y-6">
          <Header currentPlan={currentPlan} />
          <div>{children}</div>
        </div>
      </section>
    </div>
  );
}
