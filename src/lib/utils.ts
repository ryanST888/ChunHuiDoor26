export function assetPath(path: string): string {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) return path;
  return `/${path.split("/").map(segment => encodeURIComponent(segment)).join("/")}`;
}

export function excerpt(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function absoluteUrl(path = ""): string {
  const baseUrl = process.env.PUBLIC_SITE_URL || "https://www.chunhuidoors.com";
  return new URL(path, baseUrl).toString();
}
