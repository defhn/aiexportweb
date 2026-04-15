/**
 * template-05 入口文件
 * 行业：医疗健康 / 医疗耗材 / 康复设备
 * SeedPackKey: "medical-health"
 */

import type { TemplateDefinition } from "@/templates/types";
import { Template05HomePage } from "./home-page";
import { Template05Layout } from "./layout";

export const template05: TemplateDefinition = {
  id: "template-05",
  name: "Medical Health",
  industry: "医疗健康 / 医疗耗材 / 康复设备",
  HomePage: Template05HomePage,
  PublicLayout: Template05Layout,
};
