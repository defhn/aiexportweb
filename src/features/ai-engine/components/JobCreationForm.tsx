"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, FileText, Cpu, CheckCircle } from "lucide-react";

export function JobCreationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("taskType", "blog_gen");

    const rawText = formData.get("rawText") as string;
    const file = formData.get("pdfFile") as File | null;

    if (!rawText.trim() && (!file || file.size === 0)) {
      setError("Please provide some source text or upload a PDF document.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/content-jobs", {
        method: "POST",
        body: formData, // 直接通过 multipart/form-data 传递
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create job");
      }

      // Reset the form on success and let the tracker show progress
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-950">
          <FileText className="h-5 w-5 text-blue-500" />
          {"Source Material Intake"}
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          {"Paste raw specifications, PDF content, or unformatted descriptions. The AI Extractor Agent will do the rest."}
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              {"Industry / Sector Schema"}
            </label>
            <select
              name="industry"
              className="mt-1 block w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
              defaultValue="cnc"
            >
              <option value="cnc">{"CNC & Precision Machining"}</option>
              <option value="medical">{"Medical Devices & Healthcare"}</option>
              <option value="electronics">{"Consumer Electronics & PCBA"}</option>
              <option value="metal_fab">{"Metal Fabrication & Sheet Metal"}</option>
              <option value="generic">{"Generic Manufacturing"}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              {"Blueprint PDF Upload (Optional)"}
            </label>
            <input
              type="file"
              name="pdfFile"
              accept="application/pdf"
              className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              {"Raw Blueprint Data"}
            </label>
            <textarea
              name="rawText"
              rows={6}
              placeholder="e.g. Dimensions: 120x50mm. Material: Al6061-T6. Tolerance: ±0.01mm. Surface: Anodized Black..."
              className="mt-1 block w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">{"Starting Agents..."}</span>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                {"Ignite Engine"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
