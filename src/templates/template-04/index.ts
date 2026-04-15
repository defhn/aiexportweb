/**
 * template-04 入口文件
 * 行业：能源电力 / 配电系统 / 工商业储能
 * SeedPackKey: "energy-power"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template04HomePage } from "./home-page";
import { Template04Layout } from "./layout";

export const template04: TemplateDefinition = {
  id: "template-04",
  name: "Energy Power",
  industry: "能源电力 / 配电系统 / 工商业储能",
  HomePage: Template04HomePage,
  PublicLayout: Template04Layout,
};
