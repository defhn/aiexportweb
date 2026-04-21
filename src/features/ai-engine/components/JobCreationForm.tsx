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
      setError("请至少粘贴一些参考文本或者上传一份源 PDF 文档。");
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
          {"原料输入中心"}
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          {"可直接粘贴散乱的技术说明符、杂乱产品描述，或上传含参数表的原厂 PDF 工程图纸，后续交由信息提取 Agent 自动清洗。"}
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              {"选择所属垂直领域 (Industry Schema)"}
            </label>
            <select
              name="industry"
              className="mt-1 block w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
              defaultValue="cnc"
            >
              <option value="cnc">{"CNC 机加工与精密制造"}</option>
              <option value="medical">{"医疗器械与耗材"}</option>
              <option value="electronics">{"消费电子与 PCBA"}</option>
              <option value="metal_fab">{"钣金与金属成型"}</option>
              <option value="generic">{"通用生产制造"}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              {"物理文档源文件上传（PDF 可选）"}
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
              {"散装原始数据 / 产品杂乱描述"}
            </label>
            <textarea
              name="rawText"
              rows={6}
              placeholder="例如：尺寸 120x50mm，材质 Al6061-T6，公差 ±0.01mm，表面阳极氧化黑，可用于汽车配件... (支持直接复制乱码网页内容)"
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
              <span className="animate-pulse">{"唤醒多智能体..."}</span>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                {"启动云端流水线"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
