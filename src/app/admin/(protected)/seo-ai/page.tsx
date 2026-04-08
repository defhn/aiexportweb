import { buildRobotsPolicies, getDefaultCrawlerPolicy } from "@/lib/ai-crawlers";

export default function AdminSeoAiPage() {
  const policy = getDefaultCrawlerPolicy();
  const robotsPreview = buildRobotsPolicies(policy);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">SEO 与 AI 抓取</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          默认允许搜索型爬虫引用，默认拦截训练型爬虫。后续这里会接入数据库持久化和开关编辑。
        </p>
      </section>

      <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-950">robots 预览</h3>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-5 text-xs leading-6 text-stone-100">
          {robotsPreview}
        </pre>
      </article>
    </div>
  );
}
