/**
 * template-10 入口文件
 * 行业：轻工纺织 / 包装材料
 * SeedPackKey: "textile-packaging"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template10HomePage } from "./home-page";
import { Template10Layout } from "./layout";

export const template10: TemplateDefinition = {
  id: "template-10",
  name: "Textile Packaging",
  industry: "轻工纺织 / 包装材料",
  HomePage: Template10HomePage,
  PublicLayout: Template10Layout,
};
