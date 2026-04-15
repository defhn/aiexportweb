/**
 * 模板注册表
 *
 * 所有模板在此处注册。新增模板时：
 * 1. 在 src/templates/ 下创建新目录（参考 template-01）
 * 2. 在下方 TEMPLATE_REGISTRY 中添加一行
 * 3. 在 Vercel 环境变量中设置 SITE_TEMPLATE=template-xx
 *
 * 不需要改动 app/ 目录下任何文件。
 */

import { template01 } from "./template-01";
// import { template02 } from "./template-02";  // 新模板在这里注册
// import { template03 } from "./template-03";

import type { TemplateDefinition } from "./types";

const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  "template-01": template01,
  // "template-02": template02,
};

/** 默认模板 ID（本地开发或未指定时使用） */
const DEFAULT_TEMPLATE_ID = "template-01";

/**
 * 根据 SITE_TEMPLATE 环境变量获取当前模板。
 * 在服务器端调用（Server Component 或 Server Action）。
 */
export function getActiveTemplate(): TemplateDefinition {
  const templateId = process.env.SITE_TEMPLATE ?? DEFAULT_TEMPLATE_ID;
  const template = TEMPLATE_REGISTRY[templateId];

  if (!template) {
    console.warn(
      `[templates] 未找到模板 "${templateId}"，回退到默认模板 "${DEFAULT_TEMPLATE_ID}"`,
    );
    return TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_ID]!;
  }

  return template;
}

/** 获取所有已注册的模板列表（用于管理后台展示） */
export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export type { TemplateDefinition };
