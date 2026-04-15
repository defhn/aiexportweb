/**
 * template-02 入口文件
 * 行业：工业机械设备 / 自动化设备 / 机器人
 * SeedPackKey: "industrial-equipment"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template02HomePage } from "./home-page";
import { Template02Layout } from "./layout";

export const template02: TemplateDefinition = {
  id: "template-02",
  name: "Industrial Equipment",
  industry: "工业设备 / 自动化 / 机器人",
  HomePage: Template02HomePage,
  PublicLayout: Template02Layout,
};
