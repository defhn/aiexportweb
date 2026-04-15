/**
 * template-03 入口文件
 * 行业：建材建筑 / 铝型材 / 金属装饰材料
 * SeedPackKey: "building-materials"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template03HomePage } from "./home-page";
import { Template03Layout } from "./layout";

export const template03: TemplateDefinition = {
  id: "template-03",
  name: "Building Materials",
  industry: "建材建筑 / 铝型材 / 玻璃制品",
  HomePage: Template03HomePage,
  PublicLayout: Template03Layout,
};
