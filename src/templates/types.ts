/**
 * 多模板系统 — 模板接口定义
 *
 * 每套模板必须导出一个实现 TemplateDefinition 接口的对象。
 * 功能逻辑（询盘/博客/产品）在 src/features/ 里，模板只负责把数据渲染出来。
 */

import type { ComponentType } from "react";

// ─── 公共 Props 类型（来自 features 层） ───────────────────────────────────

/** 首页模块的原始 payload（来自数据库 pages 表） */
export interface HomeModulePayload {
  moduleKey: string;
  payloadJson: Record<string, unknown> | null;
}

/** 产品卡片数据 */
export interface ProductCardData {
  slug: string;
  nameEn: string;
  shortDescriptionEn: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  categorySlug: string;
}

/** 产品分类数据（字段名与 getAllCategories() 返回一致） */
export interface CategoryCardData {
  id: number;
  nameEn: string;
  slug: string;
  summaryEn: string;           // category-grid.tsx 使用此字段
  imageUrl: string | null;     // category-grid.tsx 使用此字段
  imageAlt: string | null;
  isFeatured: boolean;
}

/** 博客文章摘要数据（字段名与 getBlogPosts() 返回 & LatestInsights 组件一致） */
export interface BlogPostSummary {
  slug: string;
  titleEn: string;
  excerptEn: string;           // latest-insights 内部要求 string（非 null）
  coverImageUrl: string | null;
  categorySlug: string | null; // latest-insights 使用此字段
  publishedAt: string | null;  // BlogCard 使用 slice(0,10)
}

/** 站点配置（来自 settings 表） */
export interface SiteSettings {
  companyNameEn: string;
  taglineEn: string | null;
  email: string | null;
  phone: string | null;
  addressEn: string | null;
  seoOgImageUrl: string | null;
}

// ─── 模板页面级 Props ─────────────────────────────────────────────────────

export interface HomePageProps {
  modules: HomeModulePayload[];
  products: ProductCardData[];
  categories: CategoryCardData[];
  blogPosts: BlogPostSummary[];
  settings: SiteSettings;
}

export interface PublicLayoutProps {
  children: React.ReactNode;
  settings: SiteSettings;
  categories: CategoryCardData[];
  theme?: {
    accent: string;
    surface: string;
    surfaceAlt: string;
    border: string;
  };
}

// ─── 模板定义接口 ─────────────────────────────────────────────────────────

/**
 * 每套模板必须实现的接口。
 * 模板 ID 用于在 SITE_TEMPLATE 环境变量和 URL 中识别。
 */
export interface TemplateDefinition {
  /** 模板唯一标识，例如 "template-01"、"template-02" */
  id: string;
  /** 人类可读的模板名称，用于管理后台展示 */
  name: string;
  /** 适用行业说明 */
  industry: string;
  /** 首页组件 */
  HomePage: ComponentType<HomePageProps>;
  /** 公共页面布局（Header + Footer） */
  PublicLayout: ComponentType<PublicLayoutProps>;
}
