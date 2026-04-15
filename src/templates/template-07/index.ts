/**
 * template-07 入口文件
 * 行业：照明灯具 / 商业照明 / 工业照明
 * SeedPackKey: "lighting"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template07HomePage } from "./home-page";
import { Template07Layout } from "./layout";

export const template07: TemplateDefinition = {
  id: "template-07",
  name: "Lighting",
  industry: "照明灯具 / 商业照明 / 工业照明",
  HomePage: Template07HomePage,
  PublicLayout: Template07Layout,
};
