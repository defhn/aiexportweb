import type { Metadata } from "next";

import { env } from "@/env";

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = buildAbsoluteUrl(input.path ?? "/");

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: "website",
    },
  };
}
