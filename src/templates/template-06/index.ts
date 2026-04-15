/**
 * template-06 入口文件
 * 行业：流体工程 / HVAC / 管路系统
 * SeedPackKey: "fluid-hvac"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template06HomePage } from "./home-page";
import { Template06Layout } from "./layout";

export const template06: TemplateDefinition = {
  id: "template-06",
  name: "Fluid HVAC",
  industry: "流体工程 / HVAC / 管路系统",
  HomePage: Template06HomePage,
  PublicLayout: Template06Layout,
};
