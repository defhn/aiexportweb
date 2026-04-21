"use client";

import { useState } from "react";
import { Settings2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConfigManager({ initialNegativeWords }: { initialNegativeWords: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const negativeWords = formData.get("negativeWords") as string;

    try {
      const res = await fetch("/api/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configKey: "negative_words",
          configValue: negativeWords,
          description: "Global AI writer negative phrase list (one per line)",
        }),
      });

      if (!res.ok) throw new Error("Failed to save config");

      setMessage({ type: "success", text: "Configuration saved successfully!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-stone-900">Dynamic Prompt Config</h3>
          <p className="text-xs text-stone-500">Tune the AI Engine behavior without deploying</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Negative SEO Phrases (One per line)
          </label>
          <p className="mt-1 text-xs text-stone-500">
            The Writer Agent and Reviewer will reject any draft containing these generic AI phrases.
          </p>
          <textarea
            name="negativeWords"
            rows={10}
            defaultValue={initialNegativeWords}
            className="mt-2 block w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm font-mono outline-none transition-colors focus:border-orange-500"
          />
        </div>

        {message && (
          <div
            className={`rounded-xl p-3 text-sm ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-stone-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Config"}
          </button>
        </div>
      </div>
    </form>
  );
}
