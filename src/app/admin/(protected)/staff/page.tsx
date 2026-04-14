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
      setError("加载员工列表失败");
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
        throw new Error(data.error || "创建失败");
      }
      setNewUsername("");
      setNewPassword("");
      showSuccess("员工账号已创建");
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "创建失败，请稍后重试",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (
      !confirm(
        `确定要删除员工 ${username} 吗？此操作不可恢复。`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("删除失败");
      }
      showSuccess(`${username} 已删除`);
      await fetchEmployees();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "删除失败，请稍后重试",
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
        throw new Error("重置失败");
      }
      setResetId(null);
      setResetPassword("");
      showSuccess("密码已重置");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "重置失败，请稍后重试",
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
            {"员工账号管理"}
          </h2>
        </div>
        <p className="text-sm leading-6 text-stone-500">
          {
            "管理可登录 Admin 后台的员工账号，密码在创建后无法再次查看，请妥善保存。"
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
            {"关闭"}
          </button>
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-stone-950">
          {"新增员工"}
        </h3>
        <form className="flex flex-wrap gap-3" onSubmit={handleCreate}>
          <input
            className="min-w-48 flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            minLength={3}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="用户名（至少3位）"
            required
            value={newUsername}
          />
          <input
            className="min-w-48 flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            minLength={6}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="密码（至少6位）"
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
            {"创建账号"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h3 className="text-base font-semibold text-stone-950">
            {`当前员工 (${employees.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : employees.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-400">
            {"暂无员工账号"}
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
                    {`创建于 ${new Date(emp.createdAt).toLocaleDateString("zh-CN")}`}
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
                    {"重置密码"}
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(emp.id, emp.username)}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {"删除"}
                  </button>
                </div>

                {resetId === emp.id ? (
                  <form
                    className="absolute right-4 top-full z-20 mt-2 min-w-64 rounded-xl border border-blue-200 bg-white p-4 shadow-xl"
                    onSubmit={handleReset}
                  >
                    <p className="mb-3 text-sm font-semibold text-stone-900">
                      {`为「${emp.username}」设置新密码`}
                    </p>
                    <input
                      className="mb-3 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      minLength={6}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="至少 6 位"
                      required
                      type="password"
                      value={resetPassword}
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                        type="submit"
                      >
                        {"确认重置"}
                      </button>
                      <button
                        className="flex-1 rounded-lg border border-stone-200 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
                        onClick={() => setResetId(null)}
                        type="button"
                      >
                        {"取消"}
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
