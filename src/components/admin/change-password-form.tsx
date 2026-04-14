"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-stone-900";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirm) {
      setError("两次新密码输入不一致");
      return;
    }
    if (newPassword.length < 8) {
      setError("新密码至少 8 位");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "修改失败，请重试");
        return;
      }
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-amber-50 p-2">
          <KeyRound className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-950">修改登录密码</h3>
          <p className="text-xs text-stone-400">建议使用 12 位以上、含字母与数字的强密码</p>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          ✅ 密码已修改成功，下次登录请使用新密码
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-stone-700">
          当前密码
          <input
            className={inputCls}
            required
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="输入当前密码"
            autoComplete="current-password"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          新密码（至少 8 位）
          <input
            className={inputCls}
            minLength={8}
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="输入新密码"
            autoComplete="new-password"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          确认新密码
          <input
            className={inputCls}
            minLength={8}
            required
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="再次输入新密码"
            autoComplete="new-password"
          />
        </label>

        <button
          className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {pending ? "保存中..." : "保存新密码"}
        </button>
      </form>
    </section>
  );
}
