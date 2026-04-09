/**
 * TEMPLATE — Copy this file and fill in your details.
 * Rename: configs/my-industry.ts
 */
import type { IndustryConfig } from "../types";

export const config: IndustryConfig = {
  // ─── REQUIRED: fill these in ────────────────────────────────────────────────

  /** Short industry keyword. The AI uses this as context.
   *  Examples: "healthcare", "food-beverage", "logistics", "education",
   *            "legal-services", "real-estate", "automotive", "hospitality"
   */
  industry: "YOUR_INDUSTRY_HERE",

  /** One-sentence description of the business.
   *  Be specific — the AI generates all content based on this.
   *  Example: "A B2B supplier of industrial safety equipment to factories in Southeast Asia."
   */
  businessDescription: "YOUR_BUSINESS_DESCRIPTION_HERE",

  company: {
    nameEn: "Your Company Name",
    // nameCn: "公司中文名", // optional: AI will generate if omitted
    country: "Your Country",
    email: "contact@yourcompany.com",
    // phone: "+1 xxx xxx xxxx",     // optional
    // whatsapp: "+1 xxx xxx xxxx",  // optional
    // addressEn: "123 Street, City, Country", // optional
  },

  /** Public URL of the website (used for SEO canonical tags) */
  domain: "https://yourwebsite.com",

  /** Initial admin password. Must be at least 8 chars.
   *  You MUST change this immediately after first login.
   */
  adminPassword: "CHANGE_ME_IMMEDIATELY",

  // ─── OPTIONAL: leave as-is or adjust ────────────────────────────────────────

  categoryCount: 5,   // How many product/service categories to create
  productCount: 10,   // How many demo products to generate
  blogPostCount: 3,   // How many blog articles to write
  faqCount: 8,        // How many FAQ items to generate
};
