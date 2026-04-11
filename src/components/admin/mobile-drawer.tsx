"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminRole } from "@/lib/auth";

export function MobileDrawer({ currentRole = "super_admin" }: { currentRole?: AdminRole }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        aria-label={"\u6253\u5f00\u83dc\u5355"}
        className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 md:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>

      <dialog
        ref={dialogRef}
        className="m-0 h-full max-h-full w-72 max-w-full overflow-hidden rounded-none bg-transparent p-0 backdrop:bg-black/50 open:flex"
        onCancel={() => setOpen(false)}
        onClick={handleBackdropClick}
      >
        <div className="flex h-full w-full flex-col overflow-hidden bg-stone-950">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
            <Link
              className="flex items-center gap-3"
              href="/admin"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <span className="text-xs font-black">A</span>
              </div>
              <p className="text-sm font-semibold text-white">{"\u4e2d\u6587\u540e\u53f0"}</p>
            </Link>
            <button
              aria-label={"\u5173\u95ed\u83dc\u5355"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar currentRole={currentRole} onClose={() => setOpen(false)} />
          </div>
        </div>
      </dialog>
    </>
  );
}
