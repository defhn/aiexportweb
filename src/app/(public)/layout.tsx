/**
 * 公共页面布局 — 模板分发器
 *
 * 此文件只负责：
 * 1. 获取公共数据（settings、categories）
 * 2. 调用当前激活模板的 PublicLayout 渲染 Header/Footer
 *
 * ⚠️  不要在此文件写任何 UI 代码。布局 UI 在 src/templates/[template-id]/layout.tsx 里。
 */

import { getAllCategories } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById } from "@/templates";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [settings, categories] = await Promise.all([
    getSiteSettings(currentSite.seedPackKey, siteId),
    getAllCategories(currentSite.seedPackKey, siteId),
  ]);

  const { PublicLayout: TemplateLayout } = getTemplateById(currentSite.templateId);

  return (
    <TemplateLayout settings={settings} categories={categories}>
      {children}
    </TemplateLayout>
  );
}
