import type { ReactNode } from "react";
import type { NavKey, SiteData } from "@/lib/types";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface MarketingShellProps {
  active: NavKey;
  children: ReactNode;
  siteData: SiteData;
}

export function MarketingShell({ active, children, siteData }: MarketingShellProps) {
  return (
    <>
      <SiteHeader active={active} siteData={siteData} />
      <main>{children}</main>
      <SiteFooter company={siteData.company} nav={siteData.nav} />
    </>
  );
}
