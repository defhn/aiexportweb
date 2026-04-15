import { describe, expect, it } from "vitest";

import {
  DEFAULT_SITE_SLUG,
  buildDemoSites,
  getSeedPackKeyForTemplate,
  normalizeHost,
  normalizeSiteDomain,
  parseSiteDomainAliases,
  resolveSiteLookup,
} from "@/lib/sites";

describe("site resolution", () => {
  it("normalizes hosts by removing ports and lowercasing", () => {
    expect(normalizeHost("Medical.Demo.Localhost:3000")).toBe("medical.demo.localhost");
    expect(normalizeHost(" client.com ")).toBe("client.com");
  });

  it("normalizes custom domain aliases for matching and storage", () => {
    expect(normalizeSiteDomain(" HTTPS://WWW.Client-Demo.com/path?x=1 ")).toBe("www.client-demo.com");
    expect(normalizeSiteDomain("client-demo.com:443")).toBe("client-demo.com");
    expect(normalizeSiteDomain("")).toBe("");
  });

  it("parses custom domain aliases from multiline admin input", () => {
    expect(
      parseSiteDomainAliases(`
        https://client-demo.com
        www.client-demo.com
        client-demo.com
        preview.client-demo.com:3000
      `),
    ).toEqual(["client-demo.com", "www.client-demo.com", "preview.client-demo.com"]);
  });

  it("prefers explicit site query over host resolution for local previews", () => {
    expect(resolveSiteLookup({ host: "cnc.demo.test", site: "medical-demo" })).toEqual({
      kind: "slug",
      value: "medical-demo",
    });
  });

  it("falls back to host lookup and then default site", () => {
    expect(resolveSiteLookup({ host: "gifts.example.com" })).toEqual({
      kind: "host",
      value: "gifts.example.com",
    });
    expect(resolveSiteLookup({ host: "" })).toEqual({
      kind: "slug",
      value: DEFAULT_SITE_SLUG,
    });
  });

  it("maps every registered template to a seed pack", () => {
    expect(getSeedPackKeyForTemplate("template-01")).toBe("cnc");
    expect(getSeedPackKeyForTemplate("template-05")).toBe("medical-health");
    expect(getSeedPackKeyForTemplate("template-12")).toBe("lifestyle");
  });

  it("builds 12 demo site definitions", () => {
    const sites = buildDemoSites("demo.localhost");

    expect(sites).toHaveLength(12);
    expect(sites.map((site) => site.templateId)).toContain("template-01");
    expect(sites.map((site) => site.templateId)).toContain("template-12");
    expect(sites.find((site) => site.slug === "medical-demo")?.domain).toBe(
      "medical.demo.localhost",
    );
  });
});
