import type { MetadataRoute } from "next";
import { publishedLocalPages } from "@/config/local-pages";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...publishedLocalPages().map((p) => ({ url: `${siteUrl}/interventions/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${siteUrl}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];
}
