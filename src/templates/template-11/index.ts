/**
 * template-11 入口文件
 * 行业：消费品电子 / 智能硬件
 * SeedPackKey: "consumer-electronics"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template11HomePage } from "./home-page";
import { Template11Layout } from "./layout";

export const template11: TemplateDefinition = {
  id: "template-11",
  name: "Consumer Electronics",
  industry: "消费品电子 / 智能硬件",
  HomePage: Template11HomePage,
  PublicLayout: Template11Layout,
};
