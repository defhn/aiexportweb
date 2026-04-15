"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Plus, ShieldCheck, Trash2, UserRound, Users } from "lucide-react";

import { ChangePasswordForm } from "@/components/admin/change-password-form";

type SiteMember = {
  id: number;
  username: string;
  role: "client_admin" | "employee";
  createdAt: string;
};

const roleOptions = [
  {
    value: "client_admin" as const,
    label: "Client admin",
    description: "Can manage plan, site settings, staff, and all content for this client site.",
  },
  {
    value: "employee" as const,
    label: "Employee",
    description: "Can work on content, inquiries, and day-to-day operations only.",
  },
];

export default function StaffPage() {
  const [members, setMembers] = useState<SiteMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<SiteMember["role"]>("employee");
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const counts = useMemo(
    () => ({
      clientAdmins: members.filter((member) => member.role === "client_admin").length,
      employees: members.filter((member) => member.role === "employee").length,
    }),
    [members],
  );

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load site members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMembers();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create member.");
      }

      setNewUsername("");
      setNewPassword("");
      setNewRole("employee");
      showSuccess("Site member created.");
      await fetchMembers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Delete ${username}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete member.");
      }
      showSuccess(`${username} deleted.`);
      await fetchMembers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete member.");
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resetId) return;

    try {
      const res = await fetch(`/api/admin/staff/${resetId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }
      setResetId(null);
      setResetPassword("");
      showSuccess("Password reset.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-950">Site members</h2>
        </div>
        <p className="text-sm leading-6 text-stone-500">
          Add client admins and employees for the current site. Client admins can manage plans,
          site settings, and staff. Employees stay focused on content, inquiries, and daily
          follow-up work.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Client admins
            </p>
            <p className="mt-2 text-2xl font-bold text-stone-950">{counts.clientAdmins}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Employees
            </p>
            <p className="mt-2 text-2xl font-bold text-stone-950">{counts.employees}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Client admin access
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>Can manage site package, feature overrides, and site settings.</li>
              <li>Can create and remove other members for the same client site.</li>
              <li>Can work across content, inquiries, quotes, and AI modules allowed by plan.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Employee access
            </p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>Can handle products, blog content, inquiries, and routine follow-up work.</li>
              <li>Cannot change package, billing-facing settings, or cross-site controls.</li>
              <li>Still sees locked menu items, but access is blocked until upgraded.</li>
            </ul>
          </div>
        </div>
      </section>

      {successMessage ? (
        <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center justify-between rounded-2xl bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          {error}
          <button className="ml-4 text-red-400 hover:text-red-600" onClick={() => setError("")} type="button">
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-stone-950">Add site member</h3>
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              className="min-w-48 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              minLength={3}
              onChange={(event) => setNewUsername(event.target.value)}
              placeholder="Username"
              required
              value={newUsername}
            />
            <input
              className="min-w-48 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              minLength={6}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Temporary password"
              required
              type="password"
              value={newPassword}
            />
            <select
              className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              onChange={(event) => setNewRole(event.target.value as SiteMember["role"])}
              value={newRole}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {roleOptions.map((option) => (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" key={option.value}>
                <p className="text-sm font-semibold text-stone-900">{option.label}</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">{option.description}</p>
              </div>
            ))}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h3 className="text-base font-semibold text-stone-950">Current members ({members.length})</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-400">No site members yet.</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {members.map((member) => {
              const isClientAdmin = member.role === "client_admin";
              return (
                <div className="relative flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between" key={member.id}>
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-stone-900">{member.username}</div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isClientAdmin
                            ? "bg-blue-50 text-blue-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {isClientAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                        {isClientAdmin ? "Client admin" : "Employee"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-stone-400">
                      Added {new Date(member.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                      onClick={() => {
                        setResetId(member.id);
                        setResetPassword("");
                      }}
                      type="button"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      Reset password
                    </button>
                    <button
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(member.id, member.username)}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>

                  {resetId === member.id ? (
                    <form
                      className="absolute right-4 top-full z-20 mt-2 min-w-72 rounded-xl border border-blue-200 bg-white p-4 shadow-xl"
                      onSubmit={handleReset}
                    >
                      <p className="mb-3 text-sm font-semibold text-stone-900">
                        Set a new password for {member.username}
                      </p>
                      <input
                        className="mb-3 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        minLength={6}
                        onChange={(event) => setResetPassword(event.target.value)}
                        placeholder="At least 6 characters"
                        required
                        type="password"
                        value={resetPassword}
                      />
                      <div className="flex gap-2">
                        <button
                          className="flex-1 rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                          type="submit"
                        >
                          Save password
                        </button>
                        <button
                          className="flex-1 rounded-lg border border-stone-200 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
                          onClick={() => setResetId(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ChangePasswordForm />
    </div>
  );
}
