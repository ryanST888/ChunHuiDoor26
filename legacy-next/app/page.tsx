import { HomeExperienceSections } from "@/components/HomeExperienceSections";
import { HomeWheelEntrances } from "@/components/HomeWheelEntrances";
import { MarketingShell } from "@/components/MarketingShell";
import { getSiteData } from "@/content/cms";

export default async function HomePage() {
  const siteData = await getSiteData();
  const { company } = siteData;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    brand: company.slogan,
    telephone: company.phone,
    email: company.email,
    address: company.address,
    url: "https://www.chunhuidoors.com",
  };

  return (
    <MarketingShell active="home" siteData={siteData}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeWheelEntrances siteData={siteData} />
      <HomeExperienceSections siteData={siteData} />
    </MarketingShell>
  );
}
