import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteData } from "@/content/cms";
import { assetPath, excerpt } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();

  return {
    title: "关于春晖",
    description: excerpt(siteData.about.content, 150),
    alternates: {
      canonical: "/about/",
    },
  };
}

export default async function AboutPage() {
  const siteData = await getSiteData();
  const { about, stats, productCenter } = siteData;

  return (
    <MarketingShell active="about" siteData={siteData}>
      <section className="bg-ink py-20 text-white">
        <div className="container-shell">
          <SectionHeading eyebrow="About Chunhui" title={about.title} description={excerpt(about.content, 220)} inverse />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-shell grid gap-6 md:grid-cols-4">
          {stats.map(item => (
            <div className="rounded-lg border border-ink/8 bg-paper p-6" key={item.label}>
              <strong className="block font-serif text-4xl text-clay">{item.number}</strong>
              <span className="mt-2 block text-sm text-ink/58">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="overflow-hidden rounded-lg bg-warm shadow-soft">
            <img className="aspect-[4/3] w-full object-cover" src={assetPath(about.image || productCenter.hero.image)} alt="春晖门业制造基地" loading="lazy" />
          </div>
          <div>
            <SectionHeading eyebrow="Manufacturing" title="进口设备与稳定工艺，支撑长期品质" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {about.highlights.map(item => (
                <article className="rounded-lg border border-ink/8 bg-white p-5" key={item.title}>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink/58">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-shell max-w-4xl">
          <p className="text-lg leading-9 text-ink/70">{about.content}</p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-shell">
          <SectionHeading eyebrow="History" title="发展历程" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {about.timeline.map(item => (
              <article className="rounded-lg border border-ink/8 bg-white p-6" key={item.year}>
                <strong className="font-serif text-3xl text-clay">{item.year}</strong>
                <p className="mt-3 text-sm leading-7 text-ink/62">{item.event}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
