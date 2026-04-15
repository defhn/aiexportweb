/**
 * template-08 入口文件
 * 行业：五金工业 / 塑胶件 / 紧固件
 * SeedPackKey: "hardware-plastics"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template08HomePage } from "./home-page";
import { Template08Layout } from "./layout";

export const template08: TemplateDefinition = {
  id: "template-08",
  name: "Hardware Plastics",
  industry: "五金工业 / 塑胶件 / 紧固件",
  HomePage: Template08HomePage,
  PublicLayout: Template08Layout,
};
