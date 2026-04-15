/**
 * template-12 入口文件
 * 行业：生活礼品 / 文创礼品
 * SeedPackKey: "lifestyle"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template12HomePage } from "./home-page";
import { Template12Layout } from "./layout";

export const template12: TemplateDefinition = {
  id: "template-12",
  name: "Lifestyle Gifts",
  industry: "生活礼品 / 文创礼品",
  HomePage: Template12HomePage,
  PublicLayout: Template12Layout,
};
