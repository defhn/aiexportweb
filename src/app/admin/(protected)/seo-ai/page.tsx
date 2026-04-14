import { saveSeoAiSettings } from "@/features/seo-ai/actions";
import { getSeoAiSettings } from "@/features/seo-ai/queries";
import { buildRobotsPolicies } from "@/lib/ai-crawlers";

const checkboxItems = [
  {
    name: "allowGoogle",
    label: "允许 Google 抓取",
    description: "允许 Googlebot 抓取公开页面。",
  },
  {
    name: "allowBing",
    label: "允许 Bing 抓取",
    description: "允许 Bingbot 抓取公开页面。",
  },
  {
    name: "allowOaiSearchBot",
    label: "允许 ChatGPT 搜索引用",
    description:
      "允许 OAI-SearchBot 抓取并在搜索型回答中引用。",
  },
  {
    name: "allowClaudeSearchBot",
    label: "允许 Claude 搜索引用",
    description:
      "允许 Claude-SearchBot 抓取公开页面。",
  },
  {
    name: "allowPerplexityBot",
    label: "允许 Perplexity 引用",
    description:
      "允许 PerplexityBot 抓取公开页面。",
  },
  {
    name: "allowGptBot",
    label: "允许 OpenAI 训练抓取",
    description:
      "默认建议关闭，避免开放训练型抓取。",
  },
  {
    name: "allowClaudeBot",
    label: "允许 Anthropic 训练抓取",
    description:
      "默认建议关闭，避免开放训练型抓取。",
  },
] as const;

const textareaClassName =
  "mt-2 min-h-28 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

export default async function AdminSeoAiPage() {
  const settings = await getSeoAiSettings();
  const robotsPreview = buildRobotsPolicies(settings);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"SEO 与 AI 抓取"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "默认建议允许搜索型抓取，训练型抓取保持关闭。保存后 robots.txt 会按后台设置输出。"
          }
        </p>
      </section>

      <form action={saveSeoAiSettings} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {checkboxItems.map((item) => (
              <label
                className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-700"
                key={item.name}
              >
                <span className="flex items-start gap-3">
                  <input
                    defaultChecked={settings[item.name]}
                    name={item.name}
                    type="checkbox"
                  />
                  <span>
                    <span className="block font-medium text-stone-950">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-stone-500">
                      {item.description}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>

          <label className="mt-5 block text-sm font-medium text-stone-700">
            {"额外 robots 备注"}
            <textarea
              className={textareaClassName}
              defaultValue={settings.extraRobotsTxt}
              name="extraRobotsTxt"
              placeholder="可选，仅用于记录特殊说明。"
            />
          </label>
        </section>

        <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            {"robots 预览"}
          </h3>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-5 text-xs leading-6 text-stone-100">
            {robotsPreview}
            {settings.extraRobotsTxt ? `\n\n${settings.extraRobotsTxt}` : ""}
          </pre>
        </article>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            {"保存抓取设置"}
          </button>
        </div>
      </form>
    </div>
  );
}
