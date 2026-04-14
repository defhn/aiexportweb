"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, Plus, Trash2, Users } from "lucide-react";

import { ChangePasswordForm } from "@/components/admin/change-password-form";

type Employee = {
  id: number;
  username: string;
  role: string;
  createdAt: string;
};

export default function StaffPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      setError("\u52a0\u8f7d\u5458\u5de5\u5217\u8868\u5931\u8d25");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: "employee",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "\u521b\u5efa\u5931\u8d25");
      }
      setNewUsername("");
      setNewPassword("");
      showSuccess("\u5458\u5de5\u8d26\u53f7\u5df2\u521b\u5efa");
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "\u521b\u5efa\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (
      !confirm(
        `\u786e\u5b9a\u8981\u5220\u9664\u5458\u5de5 ${username} \u5417\uff1f\u6b64\u64cd\u4f5c\u4e0d\u53ef\u6062\u590d\u3002`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("\u5220\u9664\u5931\u8d25");
      }
      showSuccess(`${username} \u5df2\u5220\u9664`);
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
      );
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetId) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff/${resetId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassword }),
      });
      if (!res.ok) {
        throw new Error("\u91cd\u7f6e\u5931\u8d25");
      }
      setResetId(null);
      setResetPassword("");
      showSuccess("\u5bc6\u7801\u5df2\u91cd\u7f6e");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "\u91cd\u7f6e\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-950">
            {"\u5458\u5de5\u8d26\u53f7\u7ba1\u7406"}
          </h2>
        </div>
        <p className="text-sm leading-6 text-stone-500">
          {
            "\u7ba1\u7406\u53ef\u767b\u5f55 Admin \u540e\u53f0\u7684\u5458\u5de5\u8d26\u53f7\uff0c\u5bc6\u7801\u5728\u521b\u5efa\u540e\u65e0\u6cd5\u518d\u6b21\u67e5\u770b\uff0c\u8bf7\u59a5\u5584\u4fdd\u5b58\u3002"
          }
        </p>
      </section>

      {successMessage ? (
        <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center justify-between rounded-2xl bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          {error}
          <button
            className="ml-4 text-red-400 hover:text-red-600"
            onClick={() => setError("")}
            type="button"
          >
            {"\u5173\u95ed"}
          </button>
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-stone-950">
          {"\u65b0\u589e\u5458\u5de5"}
        </h3>
        <form className="flex flex-wrap gap-3" onSubmit={handleCreate}>
          <input
            className="min-w-48 flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            minLength={3}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="\u7528\u6237\u540d\uff08\u81f3\u5c113\u4f4d\uff09"
            required
            value={newUsername}
          />
          <input
            className="min-w-48 flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            minLength={6}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="\u5bc6\u7801\uff08\u81f3\u5c116\u4f4d\uff09"
            required
            type="password"
            value={newPassword}
          />
          <button
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {"\u521b\u5efa\u8d26\u53f7"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h3 className="text-base font-semibold text-stone-950">
            {`\u5f53\u524d\u5458\u5de5 (${employees.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : employees.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-400">
            {"\u6682\u65e0\u5458\u5de5\u8d26\u53f7"}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {employees.map((emp) => (
              <div
                className="relative flex items-center justify-between px-6 py-4"
                key={emp.id}
              >
                <div>
                  <div className="font-medium text-stone-900">{emp.username}</div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    {`\u521b\u5efa\u4e8e ${new Date(emp.createdAt).toLocaleDateString("zh-CN")}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                    onClick={() => {
                      setResetId(emp.id);
                      setResetPassword("");
                    }}
                    type="button"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    {"\u91cd\u7f6e\u5bc6\u7801"}
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(emp.id, emp.username)}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {"\u5220\u9664"}
                  </button>
                </div>

                {resetId === emp.id ? (
                  <form
                    className="absolute right-4 top-full z-20 mt-2 min-w-64 rounded-xl border border-blue-200 bg-white p-4 shadow-xl"
                    onSubmit={handleReset}
                  >
                    <p className="mb-3 text-sm font-semibold text-stone-900">
                      {`\u4e3a\u300c${emp.username}\u300d\u8bbe\u7f6e\u65b0\u5bc6\u7801`}
                    </p>
                    <input
                      className="mb-3 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      minLength={6}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="\u81f3\u5c11 6 \u4f4d"
                      required
                      type="password"
                      value={resetPassword}
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                        type="submit"
                      >
                        {"\u786e\u8ba4\u91cd\u7f6e"}
                      </button>
                      <button
                        className="flex-1 rounded-lg border border-stone-200 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
                        onClick={() => setResetId(null)}
                        type="button"
                      >
                        {"\u53d6\u6d88"}
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
      {/* ── 修改我的密码 ── */}
      <ChangePasswordForm />
    </div>
  );
}
