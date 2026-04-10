import "./globals.css";
import type { Metadata } from "next";

import { getSiteSettings } from "@/features/settings/queries";

// 鍔ㄦ€佺敓鎴愭牴绾?metadata锛坢etadataBase + title template锛夛紝
// 瀛愰〉闈㈤€氳繃鍚勮嚜鐨?generateMetadata 瑕嗙洊 title/description
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const metadataBase = settings.siteUrl
    ? new URL(settings.siteUrl)
    : undefined;

  return {
    metadataBase,
    title: {
      template: settings.seoTitleTemplate.includes("%s")
        ? settings.seoTitleTemplate
        : `%s | ${settings.companyNameEn}`,
      default: settings.companyNameEn || "Industrial Export Website",
    },
    description: settings.taglineEn || "B2B industrial export lead generation website.",
    openGraph: {
      type: "website",
      siteName: settings.companyNameEn,
      ...(settings.seoOgImageUrl
        ? { images: [{ url: settings.seoOgImageUrl, width: 1200, height: 630, alt: settings.companyNameEn }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(settings.seoOgImageUrl ? { images: [settings.seoOgImageUrl] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html 
      lang="en"
      style={{
        "--brand": settings.themePrimaryColor,
        "--radius": settings.themeBorderRadius,
      } as React.CSSProperties}
    >
      <body className="antialiased font-sans" style={{ fontFamily: settings.themeFontFamily }}>
        {children}
      </body>
    </html>
  );
}
