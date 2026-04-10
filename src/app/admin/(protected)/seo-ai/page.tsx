import { saveSeoAiSettings } from "@/features/seo-ai/actions";
import { getSeoAiSettings } from "@/features/seo-ai/queries";
import { buildRobotsPolicies } from "@/lib/ai-crawlers";

const checkboxItems = [
  {
    name: "allowGoogle",
    label: "\u5141\u8bb8 Google \u6293\u53d6",
    description: "\u5141\u8bb8 Googlebot \u6293\u53d6\u516c\u5f00\u9875\u9762\u3002",
  },
  {
    name: "allowBing",
    label: "\u5141\u8bb8 Bing \u6293\u53d6",
    description: "\u5141\u8bb8 Bingbot \u6293\u53d6\u516c\u5f00\u9875\u9762\u3002",
  },
  {
    name: "allowOaiSearchBot",
    label: "\u5141\u8bb8 ChatGPT \u641c\u7d22\u5f15\u7528",
    description:
      "\u5141\u8bb8 OAI-SearchBot \u6293\u53d6\u5e76\u5728\u641c\u7d22\u578b\u56de\u7b54\u4e2d\u5f15\u7528\u3002",
  },
  {
    name: "allowClaudeSearchBot",
    label: "\u5141\u8bb8 Claude \u641c\u7d22\u5f15\u7528",
    description:
      "\u5141\u8bb8 Claude-SearchBot \u6293\u53d6\u516c\u5f00\u9875\u9762\u3002",
  },
  {
    name: "allowPerplexityBot",
    label: "\u5141\u8bb8 Perplexity \u5f15\u7528",
    description:
      "\u5141\u8bb8 PerplexityBot \u6293\u53d6\u516c\u5f00\u9875\u9762\u3002",
  },
  {
    name: "allowGptBot",
    label: "\u5141\u8bb8 OpenAI \u8bad\u7ec3\u6293\u53d6",
    description:
      "\u9ed8\u8ba4\u5efa\u8bae\u5173\u95ed\uff0c\u907f\u514d\u5f00\u653e\u8bad\u7ec3\u578b\u6293\u53d6\u3002",
  },
  {
    name: "allowClaudeBot",
    label: "\u5141\u8bb8 Anthropic \u8bad\u7ec3\u6293\u53d6",
    description:
      "\u9ed8\u8ba4\u5efa\u8bae\u5173\u95ed\uff0c\u907f\u514d\u5f00\u653e\u8bad\u7ec3\u578b\u6293\u53d6\u3002",
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
          {"SEO \u4e0e AI \u6293\u53d6"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u9ed8\u8ba4\u5efa\u8bae\u5141\u8bb8\u641c\u7d22\u578b\u6293\u53d6\uff0c\u8bad\u7ec3\u578b\u6293\u53d6\u4fdd\u6301\u5173\u95ed\u3002\u4fdd\u5b58\u540e robots.txt \u4f1a\u6309\u540e\u53f0\u8bbe\u7f6e\u8f93\u51fa\u3002"
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
            {"\u989d\u5916 robots \u5907\u6ce8"}
            <textarea
              className={textareaClassName}
              defaultValue={settings.extraRobotsTxt}
              name="extraRobotsTxt"
              placeholder="\u53ef\u9009\uff0c\u4ec5\u7528\u4e8e\u8bb0\u5f55\u7279\u6b8a\u8bf4\u660e\u3002"
            />
          </label>
        </section>

        <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            {"robots \u9884\u89c8"}
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
            {"\u4fdd\u5b58\u6293\u53d6\u8bbe\u7f6e"}
          </button>
        </div>
      </form>
    </div>
  );
}
