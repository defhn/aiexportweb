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
import { getActiveTemplate } from "@/templates";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
  ]);

  const { PublicLayout: TemplateLayout } = getActiveTemplate();

  return (
    <TemplateLayout settings={settings} categories={categories}>
      {children}
    </TemplateLayout>
  );
}
