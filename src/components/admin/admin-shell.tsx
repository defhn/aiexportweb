import type { ReactNode } from "react";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-stone-100">
      <Sidebar />
      <section className="p-8">
        <div className="space-y-6">
          <Header />
          <div>{children}</div>
        </div>
      </section>
    </div>
  );
}
