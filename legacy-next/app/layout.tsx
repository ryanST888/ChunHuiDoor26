import type { Metadata } from "next";
import { getSiteData } from "@/content/cms";
import { absoluteUrl, assetPath } from "@/lib/utils";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();

  return {
    metadataBase: new URL(absoluteUrl()),
    title: {
      default: `${siteData.company.name} | ${siteData.company.slogan}`,
      template: `%s | ${siteData.company.slogan}`,
    },
    description: siteData.company.sloganSub,
    keywords: ["春晖木门", "中山木门", "生态门", "实木烤漆门", "铝木门", "木门加盟"],
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${siteData.company.name} | ${siteData.company.slogan}`,
      description: siteData.company.sloganSub,
      url: "/",
      siteName: siteData.company.name,
      locale: "zh_CN",
      type: "website",
      images: [
        {
          url: assetPath(siteData.productCenter.hero.image),
          width: 1200,
          height: 800,
          alt: `${siteData.company.slogan}产品展示`,
        },
      ],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
