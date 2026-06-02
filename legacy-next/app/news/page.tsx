import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteData } from "@/content/cms";
import { assetPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "新闻动态",
  description: "春晖门业品牌资讯、木门保养知识与家居空间趋势。",
  alternates: {
    canonical: "/news/",
  },
};

export default async function NewsPage() {
  const siteData = await getSiteData();
  const { news } = siteData;

  return (
    <MarketingShell active="news" siteData={siteData}>
      <section className="bg-ink py-20 text-white">
        <div className="container-shell">
          <SectionHeading eyebrow="News" title="新闻动态" description="聚焦春晖门业品牌资讯、木门保养知识与家居空间趋势。" inverse />
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-shell grid gap-6">
          {news.map((item, index) => (
            <article className={`grid overflow-hidden rounded-lg border border-ink/8 bg-white shadow-soft ${index === 0 ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.45fr_1fr]"}`} key={item.id}>
              <img className="h-full min-h-72 w-full object-cover" src={assetPath(item.image)} alt={item.title} loading={index === 0 ? "eager" : "lazy"} />
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <p className="text-xs text-clay">{item.category} · {item.date}</p>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">{item.title}</h2>
                <p className="mt-4 text-base leading-8 text-ink/62">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
