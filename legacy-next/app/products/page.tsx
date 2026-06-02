import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { MarketingShell } from "@/components/MarketingShell";
import { ProductCenter } from "@/components/ProductCenter";
import { getSiteData } from "@/content/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();

  return {
    title: "产品中心",
    description: siteData.productCenter.hero.desc,
    alternates: {
      canonical: "/products/",
    },
  };
}

export default async function ProductsPage() {
  const siteData = await getSiteData();
  const { productCenter, productCategories, products, company, contact } = siteData;

  return (
    <MarketingShell active="products" siteData={siteData}>
      <ProductCenter center={productCenter} categories={productCategories} products={products} standalone />
      <ContactSection company={company} contact={contact} />
    </MarketingShell>
  );
}
