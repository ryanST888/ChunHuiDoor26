import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { MarketingShell } from "@/components/MarketingShell";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteData } from "@/content/cms";

export const metadata: Metadata = {
  title: "招商加盟",
  description: "春晖门业面向全国经销商提供木门加盟与供应链支持。",
  alternates: {
    canonical: "/join/",
  },
};

export default async function JoinPage() {
  const siteData = await getSiteData();
  const { company, contact, advantages, stats } = siteData;

  return (
    <MarketingShell active="join" siteData={siteData}>
      <section className="bg-ink py-20 text-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading eyebrow="Partner Program" title="成为春晖门业城市合作伙伴" description={contact.ctaSub} inverse />
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link className="btn-primary" href="#contact">
              提交加盟咨询
            </Link>
            <a className="btn-secondary bg-white/10 text-white hover:bg-white hover:text-ink" href={`tel:${company.phone}`}>
              电话沟通
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-shell grid gap-4 md:grid-cols-4">
          {stats.map(item => (
            <div className="rounded-lg border border-ink/8 bg-paper p-6" key={item.label}>
              <strong className="block font-serif text-4xl text-clay">{item.number}</strong>
              <span className="mt-2 block text-sm text-ink/58">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-shell">
          <SectionHeading eyebrow="Support" title="加盟支持体系" description="从选址、产品、开业到运营支持，帮助门店更快进入本地市场。" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {advantages.map(item => (
              <article className="rounded-lg border border-ink/8 bg-white p-6 shadow-soft" key={item.title}>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/58">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection company={company} contact={contact} />
    </MarketingShell>
  );
}
