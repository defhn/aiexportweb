import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/features/blog/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

// force-dynamic闁挎稒纰嶉惁鈥斥枎闄囬顒€效閸岀偛鍘撮梺鎻掔У閺屽﹪鎮介悢绋跨亣闁挎稑鐬奸垾妯荤┍濠靛懘鐛撻柛婵撴嫹/闁告鑹鹃瑙勭▔婵犲嫬娈犻柛姘捣閻濇盯宕￠崘鎻掓瘔闁绘粍婢樺﹢锟?Sitemap
export const dynamic = "force-dynamic";
// 闁告艾鏈鍌涚▕閻旀椿鍟庣紓鍐挎嫹 revalidate 0 闁稿繑绮岀花锟?
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, posts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getBlogPosts(),
  ]);

  const now = new Date();

  return [
    // 闂傚牊鐟﹂埀顑跨窔閵嗗妫冮敓锟?
    { url: buildAbsoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: buildAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: buildAbsoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: buildAbsoluteUrl("/request-quote"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: buildAbsoluteUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // 濞存籂鍐╂儌闁告帒妫涚悮顐ｃ亜绾板绀勫ù锝堟硶閺併倝鎯囬悢椋庢澖 updatedAt闁挎冻鎷?
    ...categories.map((category) => ({
      url: buildAbsoluteUrl(`/products/${category.slug}`),
      // 濞村吋锚閸樻稒鎷呯捄銊︽殢 updatedAt闁挎稑鑻ú鏍焻閳ь剟宕氶弶璺ㄧЪ闁告挸绉靛鍌炴⒒閿燂拷
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // 濞存籂鍐╂儌閻犲浄闄勯崕蹇斻亜绾板绀勫ù锝堟硶閺併倝鎯囬悢椋庢澖 updatedAt闁挎冻鎷?
    ...products.map((product) => ({
      url: buildAbsoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // 闁告鑹鹃褰掑礆濡ゅ嫨鈧啯銇勯敓锟?
    { url: buildAbsoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.7 },

    // 闁告鑹鹃褰掑棘閸モ晝褰垮銈囶暜缁辨瑦鎷呯捄銊︽殢闁活亞鍠庨悿锟?publishedAt闁挎冻鎷?
    ...posts
      .filter((post) => post.status === "published")
      .map((post) => ({
        url: buildAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
