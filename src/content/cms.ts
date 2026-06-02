import { siteData as defaultSiteData } from "@/content/site";
import type { SiteData } from "@/lib/types";

type JsonObject = Record<string, unknown>;

const cmsEnabled = process.env.CHUNHUI_CMS_ENABLED === "true";
const cmsContentUrl = cmsEnabled ? process.env.CHUNHUI_CMS_CONTENT_URL : undefined;
const cmsApiToken = process.env.CHUNHUI_CMS_API_TOKEN;

export const cmsRevalidateSeconds = parseRevalidateSeconds(process.env.CHUNHUI_CMS_REVALIDATE_SECONDS);
export const cmsConfigured = Boolean(cmsContentUrl);

export async function getSiteData(): Promise<SiteData> {
  if (!cmsContentUrl) return defaultSiteData;

  try {
    const response = await fetch(cmsContentUrl, createFetchOptions());

    if (!response.ok) {
      console.warn(`CMS content request failed: ${response.status} ${response.statusText}`);
      return defaultSiteData;
    }

    const payload = await response.json();
    const content = unwrapCmsPayload(payload);

    if (!isSiteDataFragment(content)) {
      console.warn("CMS content response did not match the Chunhui site content shape.");
      return defaultSiteData;
    }

    return mergeDeep(defaultSiteData, content) as SiteData;
  } catch (error) {
    console.warn("CMS content request failed. Falling back to local content.", error);
    return defaultSiteData;
  }
}

function createFetchOptions(): RequestInit {
  const headers = new Headers({ Accept: "application/json" });
  if (cmsApiToken) headers.set("Authorization", `Bearer ${cmsApiToken}`);

  const options: RequestInit = { headers };

  if (cmsRevalidateSeconds === 0) {
    options.cache = "no-store";
  }

  return options;
}

function parseRevalidateSeconds(value: string | undefined): number {
  if (!value) return 60;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 60;

  return Math.floor(parsed);
}

function unwrapCmsPayload(payload: unknown): unknown {
  if (Array.isArray(payload)) return payload.length > 0 ? unwrapCmsPayload(payload[0]) : payload;
  if (!isJsonObject(payload)) return payload;
  if (isSiteDataFragment(payload)) return payload;

  const directKeys = ["content", "siteData", "site_data", "site"];
  for (const key of directKeys) {
    if (key in payload) return unwrapCmsPayload(payload[key]);
  }

  const data = Array.isArray(payload.data) ? payload.data[0] : payload.data;
  if (!isJsonObject(data)) return payload;

  if (isSiteDataFragment(data)) return data;

  for (const key of directKeys) {
    if (key in data) return unwrapCmsPayload(data[key]);
  }

  const attributes = data.attributes;
  if (!isJsonObject(attributes)) return data;

  if (isSiteDataFragment(attributes)) return attributes;

  for (const key of directKeys) {
    if (key in attributes) return unwrapCmsPayload(attributes[key]);
  }

  return payload;
}

function isSiteDataFragment(value: unknown): value is Partial<SiteData> {
  if (!isJsonObject(value)) return false;

  return [
    "company",
    "stats",
    "productCategories",
    "productCenter",
    "products",
    "about",
    "news",
    "advantages",
    "contact",
    "nav",
  ].some(key => key in value);
}

function mergeDeep(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || Array.isArray(override)) return override;
  if (!isJsonObject(base) || !isJsonObject(override)) return override;

  const merged: JsonObject = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = mergeDeep(base[key], value);
  }

  return merged;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
