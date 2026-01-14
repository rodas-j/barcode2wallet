import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://barcode2wallet.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2025-01-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-01-13"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2025-01-13"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
