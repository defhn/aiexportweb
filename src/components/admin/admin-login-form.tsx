"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: String(formData.get("username") ?? ""),
          password: String(formData.get("password") ?? ""),
          next: nextPath ?? null,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "账号或密码错误�?);
        return;
      }

      router.replace(result.redirectTo ?? "/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="w-full rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Admin
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-950">后台登录</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        输入管理员账号密码，进入统一中文后台，维护英文公开站点内容�?      </p>

      <div className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-700">用户�?/span>
          <input
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
            name="username"
            placeholder="请输入用户名"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-700">密码</span>
          <input
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
            name="password"
            placeholder="请输入密�?
            required
            type="password"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "登录�?.." : "登录"}
      </button>
    </form>
  );
}
