import { type Metadata } from "next";
import { BrainCircuit, Activity } from "lucide-react";
import { JobCreationForm } from "@/features/ai-engine/components/JobCreationForm";
import { JobProgressTracker } from "@/features/ai-engine/components/JobProgressTracker";
import { ConfigManager } from "@/features/ai-engine/components/ConfigManager";
import { getAiEngineConfig } from "@/features/ai-engine/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { NEGATIVE_WORDS } from "@/lib/agents/agent-writer";

export const metadata: Metadata = {
  title: "AI Content Engine",
};

export default async function AiEngineDashboard() {
  const currentSite = await getCurrentSiteFromRequest();
  
  // 尝试从数据库获取配置，如果没有则从代码中回退
  const negativeWordsDb = await getAiEngineConfig(currentSite.id ?? null, "negative_words");
  const initialNegativeWords = negativeWordsDb || NEGATIVE_WORDS.join("\n");

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">AI 获客内容引擎 (AI Content Engine)</h1>
              <p className="mt-1 text-sm font-medium text-stone-500">
                多智能体驱动的 B2B SEO 批量自动发文管线
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-600">
            仅需上传工业产品技术表格或 PDF 规格书即可。参数提取 Agent 会保证硬件数据 100% 准确；SEO 设计 Agent 与 外贸写手 Agent 将协同撰写符合 Google 机制的专业英文博文。最终由质检 Agent 拦截全网常见的“低智 AI 套话”，彻底杜绝科技幻觉。
          </p>
        </div>
        
        <div className="shrink-0 mt-4 md:mt-0">
          <a
            href="/admin/ai-engine/jobs"
            className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
          >
            查看历史任务记录
          </a>
        </div>
      </section>

      {/* Main Grid: Form on left, live jobs on right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Form & Config */}
        <div className="space-y-6">
          <JobCreationForm />
          
          <ConfigManager initialNegativeWords={initialNegativeWords} />
        </div>

        {/* Right Column: Tracker */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between rounded-[1.5rem] bg-stone-900 p-5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">实时流水线监控 (Live Pipeline)</h3>
            </div>
          </div>
          
          <JobProgressTracker />
        </div>
      </div>
    </div>
  );
}
