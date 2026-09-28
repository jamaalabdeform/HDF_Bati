import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { SITE_ENV } from "@/config/validation";

/** Préproduction : indexation bloquée. Production : tout est ouvert sauf l'API. */
export default function robots(): MetadataRoute.Robots {
  if (SITE_ENV !== "production") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
