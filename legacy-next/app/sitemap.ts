import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

const routes = ["", "products", "about", "news", "join"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: absoluteUrl(`/${route}`),
    lastModified: new Date("2026-06-01"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
