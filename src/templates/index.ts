/**
 * 模板注册表
 *
 * 所有模板在此处注册。新增模板时：
 * 1. 在 src/templates/ 下创建新目录（参考 template-01）
 * 2. 在下方 TEMPLATE_REGISTRY 中添加一行
 * 3. 在 Vercel 环境变量中设置 SITE_TEMPLATE=template-xx（本地也可用 TEMPLATE_ID）
 *
 * 不需要改动 app/ 目录下任何文件。
 */

import { template01 } from "./template-01";
import { template02 } from "./template-02";
import { template03 } from "./template-03";
import { template04 } from "./template-04";
import { template05 } from "./template-05";
import { template06 } from "./template-06";
import { template07 } from "./template-07";
import { template08 } from "./template-08";
import { template09 } from "./template-09";
import { template10 } from "./template-10";
import { template11 } from "./template-11";
import { template12 } from "./template-12";
import { getTemplateTheme } from "./theme";

import type { TemplateDefinition } from "./types";

const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  "template-01": template01,
  "template-02": template02,
  "template-03": template03,
  "template-04": template04,
  "template-05": template05,
  "template-06": template06,
  "template-07": template07,
  "template-08": template08,
  "template-09": template09,
  "template-10": template10,
  "template-11": template11,
  "template-12": template12,
};

/** 默认模板 ID（本地开发或未指定时使用） */
const DEFAULT_TEMPLATE_ID = "template-01";

/**
 * 根据环境变量获取当前模板。
 * 优先使用 TEMPLATE_ID，兼容 SITE_TEMPLATE。
 * 在服务器端调用（Server Component 或 Server Action）。
 */
export function getActiveTemplate(): TemplateDefinition {
  const templateId = process.env.TEMPLATE_ID ?? process.env.SITE_TEMPLATE ?? DEFAULT_TEMPLATE_ID;
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
export { getTemplateTheme };
export type { TemplateTheme } from "./theme";
