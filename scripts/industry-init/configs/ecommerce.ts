/**
 * E-commerce industry config — demo example
 * Copy this file and rename it for your own industry.
 */
import type { IndustryConfig } from "../types";

export const config: IndustryConfig = {
  // ─── Required ───────────────────────────────────────────────────────────────
  industry: "ecommerce",
  businessDescription:
    "A modern B2C online store selling quality consumer electronics, home goods, and lifestyle products, targeting English-speaking markets globally.",
  company: {
    nameEn: "BrightShop",
    nameCn: "光亮购物", // optional
    country: "United States",
    email: "hello@brightshop.example.com",
    phone: "+1 800 123 4567",
    whatsapp: "+1 800 123 4567",
    addressEn: "123 Commerce St, San Francisco, CA 94105, USA",
  },
  domain: "https://brightshop.example.com",
  adminPassword: "Change_Me_2025!", // ← CHANGE THIS before running

  // ─── Optional (defaults shown) ──────────────────────────────────────────────
  categoryCount: 5,
  productCount: 10,
  blogPostCount: 3,
  faqCount: 8,
};
