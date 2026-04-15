/**
 * template-09 入口文件
 * 行业：家居户外 / 家具出口
 * SeedPackKey: "furniture-outdoor"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template09HomePage } from "./home-page";
import { Template09Layout } from "./layout";

export const template09: TemplateDefinition = {
  id: "template-09",
  name: "Furniture Outdoor",
  industry: "家居户外 / 家具出口",
  HomePage: Template09HomePage,
  PublicLayout: Template09Layout,
};
