import type { NextConfig } from "next";

const useStaticExport = process.env.CHUNHUI_STATIC_EXPORT === "true" || !process.env.CHUNHUI_CMS_CONTENT_URL;

const nextConfig: NextConfig = {
  ...(useStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
