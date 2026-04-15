import { describe, expect, it } from "vitest";

import { getAllTemplates, getTemplateTheme } from "@/templates";

describe("template fullsite themes", () => {
  it("provides complete fullsite copy and visuals for every registered template", () => {
    const templates = getAllTemplates();

    expect(templates).toHaveLength(12);

    for (const template of templates) {
      const theme = getTemplateTheme(template.id);

      expect(theme.heroTag).toBeTruthy();
      expect(theme.catalogTitle).toBeTruthy();
      expect(theme.catalogDescription).toBeTruthy();
      expect(theme.categoryTitle).toBeTruthy();
      expect(theme.categoryDescription).toBeTruthy();
      expect(theme.detailSupportTitle).toBeTruthy();
      expect(theme.detailSupportDescription).toBeTruthy();
      expect(theme.header.navItems.length).toBeGreaterThanOrEqual(5);
      expect(theme.header.quoteLabel).toBeTruthy();

      expect(theme.productDetail.datasheetTitle).toBeTruthy();
      expect(theme.productDetail.relatedTitle).toBeTruthy();
      expect(theme.productDetail.breadcrumbCatalogLabel).toBeTruthy();

      expect(theme.blog.title).toBeTruthy();
      expect(theme.blog.description).toBeTruthy();
      expect(theme.blog.supportTitle).toBeTruthy();
      expect(theme.blog.defaultCategoryLabel).toBeTruthy();

      expect(theme.about.title).toBeTruthy();
      expect(theme.about.description).toBeTruthy();
      expect(theme.about.heroImage).toMatch(/^\/images\//);
      expect(theme.about.featureImage).toMatch(/^\/images\//);

      expect(theme.capabilities.title).toBeTruthy();
      expect(theme.capabilities.description).toBeTruthy();
      expect(theme.capabilities.highlights).toHaveLength(2);
      expect(theme.capabilities.highlights[0]?.image).toMatch(/^\/images\//);
      expect(theme.capabilities.highlights[1]?.image).toMatch(/^\/images\//);
      expect(theme.capabilities.specGroups).toHaveLength(2);

      expect(theme.forms.inquiryTitle).toBeTruthy();
      expect(theme.forms.successMessage).toBeTruthy();
      expect(theme.forms.securityNote).toBeTruthy();
      expect(theme.forms.trustBadgeTitle).toBeTruthy();
      expect(theme.forms.trustBadgeDescription).toBeTruthy();

      expect(theme.footer.trustItems).toHaveLength(3);
      expect(theme.footer.description).toBeTruthy();
      expect(theme.footer.rfqHint).toBeTruthy();
    }
  });
});
