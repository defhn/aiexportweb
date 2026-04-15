/**
 * template-01 模板定义入口
 * 行业：工业制造 / CNC 精密加工（深黑 + 蓝色科技感）
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template01HomePage } from "./home-page";
import { Template01Layout } from "./layout";

export const template01: TemplateDefinition = {
  id: "template-01",
  name: "Industrial Pro",
  industry: "CNC 精密加工 / 工业制造",
  HomePage: Template01HomePage,
  PublicLayout: Template01Layout,
};
