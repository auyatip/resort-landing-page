import { MetadataRoute } from "next";
import { getAllGuideSlugs } from "./lib/pai-guide/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.athiphousepai.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pai-guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${baseUrl}/pai-guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages];
}