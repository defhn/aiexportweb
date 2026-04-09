import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { getFeatureGate } from "@/features/plans/access";
import { importProductsFromCsv } from "@/features/products/actions";

const csvTemplate = `name_zh,name_en,category,material,process,moq,lead_time,application
支架,Custom Bracket,CNC Parts,Aluminum 6061,CNC Milling,500 pcs,20 days,Industrial enclosure`;

export default async function AdminProductImportPage() {
  const gate = await getFeatureGate("csv_import");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">CSV 导入产品</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          先按模板整理产品，再批量导入到后台。系统会自动匹配分类，并写入常用默认参数�?        </p>
      </section>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-950">模板字段</h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          支持字段：`name_zh`, `name_en`, `category`, `material`, `process`, `moq`,
          `lead_time`, `application`
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-4 text-xs leading-6 text-stone-100">
          {csvTemplate}
        </pre>
      </section>

      <form
        action={importProductsFromCsv}
        className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-stone-700">
          上传 CSV 文件
          <input
            accept=".csv,text/csv"
            className="mt-2 block w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
            name="file"
            required
            type="file"
          />
        </label>
        <div className="mt-5 flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            开始导�?          </button>
        </div>
      </form>
    </div>
  );
}
