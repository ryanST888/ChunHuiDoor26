import Link from "next/link";
import type { SiteData } from "@/lib/types";
import { assetPath } from "@/lib/utils";

interface HomeExperienceSectionsProps {
  siteData: SiteData;
}

export function HomeExperienceSections({ siteData }: HomeExperienceSectionsProps) {
  const { about, company, contact, news, productCenter, products, stats } = siteData;
  const productHref = (category: string) => `/products/?category=${encodeURIComponent(category)}`;
  const productBySeries = (series: string) => products.find(item => item.series === series);
  const categoryByTitle = (title: string) => productCenter.categories.find(item => item.title === title);
  const imageFor = (series: string, category = series) => productBySeries(series)?.image || categoryByTitle(category)?.image || productCenter.hero.image;

  const serviceActions = [
    { title: "预约量尺", desc: "确认门洞、墙厚和开启方向", href: `tel:${company.phone}` },
    { title: "预约设计", desc: "按户型和风格匹配门型", href: "/products/" },
    { title: "招商合作", desc: "了解区域合作与门店支持", href: "/join/" },
  ];

  const productStories = [
    {
      eyebrow: "Quiet Living",
      title: "卧室静音",
      desc: "把门扇结构、密封和饰面触感放在第一位，适合主卧、儿童房和需要安静休息的空间。",
      image: imageFor("生态门"),
      href: productHref("生态门"),
    },
    {
      eyebrow: "Craft Texture",
      title: "客厅门面",
      desc: "用木纹、线条和色彩统一过道、背景墙与整屋气质，让门成为空间第一视觉面。",
      image: imageFor("实木烤漆门"),
      href: productHref("实木烤漆门"),
    },
    {
      eyebrow: "Light & Clean",
      title: "厨卫采光",
      desc: "窄边与玻璃比例兼顾通透和清洁，适合厨房、卫生间、书房与采光过渡区。",
      image: imageFor("玻璃门"),
      href: productHref("玻璃门"),
    },
    {
      eyebrow: "Stable Use",
      title: "防潮抗变",
      desc: "面向南方潮湿环境，关注同色一体、防潮稳定和长期使用后的整体观感。",
      image: imageFor("铝木门"),
      href: productHref("铝木门"),
    },
  ];

  const promiseItems = [
    { title: "进口设备", desc: "意大利、德国进口生产设备，支撑稳定工艺。" },
    { title: "长期服务", desc: "售前沟通、生产交付、安装售后形成闭环。" },
    { title: "门店支持", desc: "全国加盟网络覆盖，便于本地咨询与服务。" },
  ];

  const bottomLinks = [
    { title: "产品手册", desc: "从品类、系列和型号开始筛选", href: "/products/" },
    { title: "品牌动态", desc: news[0]?.title || "查看春晖门业最新资讯", href: "/news/" },
    { title: "合作通道", desc: "了解加盟优势与合作流程", href: "/join/" },
  ];

  return (
    <>
      <section className="bg-white pt-24">
        <div className="container-shell">
          <div className="-mt-16 grid overflow-hidden rounded-lg border border-ink/8 bg-white shadow-soft lg:grid-cols-3">
            {serviceActions.map((item, index) => (
              <Link
                className={`group flex min-h-32 items-center justify-between gap-6 p-7 transition hover:bg-paper ${
                  index > 0 ? "border-t border-ink/8 lg:border-l lg:border-t-0" : ""
                }`}
                href={item.href}
                key={item.title}
              >
                <span>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">Service</span>
                  <strong className="mt-3 block font-serif text-3xl font-semibold text-ink">{item.title}</strong>
                  <span className="mt-2 block text-sm text-ink/56">{item.desc}</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/12 text-xl text-clay transition group-hover:border-clay group-hover:bg-clay group-hover:text-white">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-32 lg:h-fit">
              <p className="eyebrow">Product Center</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink lg:text-5xl">
                按空间和功能，先找到适合的门
              </h2>
              <p className="mt-6 text-base leading-8 text-ink/62">
                首页不重复完整目录，只把用户最常见的使用场景提前摆出来；进入产品中心后再看型号、筛选和细节。
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map(item => (
                  <div className="border-t border-ink/10 pt-4" key={item.label}>
                    <strong className="block font-serif text-3xl text-clay">{item.number}</strong>
                    <span className="mt-1 block text-xs text-ink/54">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link className="btn-primary mt-8" href="/products/">
                进入产品中心
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {productStories.map((item, index) => (
                <Link
                  className={`group overflow-hidden rounded-lg border border-ink/8 bg-paper transition hover:-translate-y-1 hover:shadow-lift ${
                    index === 0 ? "md:row-span-2" : ""
                  }`}
                  href={item.href}
                  key={item.title}
                >
                  <span className={`block bg-warm ${index === 0 ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                    <img
                      className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
                      src={assetPath(item.image)}
                      alt={item.title}
                      loading="eager"
                    />
                  </span>
                  <span className="block bg-white p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">{item.eyebrow}</span>
                    <strong className="mt-3 block font-serif text-3xl font-semibold text-ink">{item.title}</strong>
                    <span className="mt-4 block text-sm leading-7 text-ink/58">{item.desc}</span>
                    <span className="mt-6 inline-flex text-sm font-semibold text-clay">探索对应产品</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_420px] lg:items-center">
            <div>
              <p className="eyebrow text-gold">Brand Promise</p>
              <h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight lg:text-6xl">
                把安静、耐用和好看，做成每一樘门的基本面
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/64">
                {about.content.slice(0, 108)}……
              </p>
              <Link className="btn-secondary mt-8 bg-white/10 text-white hover:bg-white hover:text-ink" href="/about/">
                了解春晖制造
              </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.06]">
              <img className="aspect-[4/3] w-full object-cover" src={assetPath(productCenter.hero.image)} alt="春晖木门空间展示" loading="lazy" />
              <div className="grid gap-4 p-6">
                {promiseItems.map(item => (
                  <div className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0" key={item.title}>
                    <strong className="font-serif text-2xl text-gold">{item.title}</strong>
                    <p className="mt-2 text-sm leading-7 text-white/58">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F4EE] py-20">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.55fr)]">
            <div className="rounded-lg bg-white p-8 shadow-soft lg:p-10">
              <p className="eyebrow">Measurement & Design</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink lg:text-5xl">
                先预约沟通，再决定看哪一类门
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/62">
                把户型、预算、风格和使用习惯说清楚，春晖销售顾问会优先按空间需求给出方向，减少来回筛选时间。
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {["户型", "门洞", "风格", "预算"].map((item, index) => (
                  <div className="rounded-md border border-ink/8 bg-paper p-4" key={item}>
                    <span className="font-serif text-2xl text-clay">{String(index + 1).padStart(2, "0")}</span>
                    <strong className="mt-5 block text-lg text-ink">{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg bg-ink p-8 text-white shadow-soft lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Hotline</p>
              <a className="mt-5 block font-serif text-4xl font-semibold transition hover:text-gold" href={`tel:${company.phone}`}>
                {company.phone}
              </a>
              <p className="mt-4 text-sm leading-7 text-white/58">{contact.workHours}</p>
              <div className="mt-8 flex flex-col gap-3">
                <a className="btn-primary" href={`tel:${company.phone}`}>
                  电话咨询
                </a>
                <Link className="btn-secondary bg-white/10 text-white hover:bg-white hover:text-ink" href="/join/">
                  招商合作
                </Link>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {bottomLinks.map(item => (
              <Link className="group rounded-lg border border-ink/8 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft" href={item.href} key={item.title}>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Explore</span>
                <strong className="mt-8 block font-serif text-3xl font-semibold text-ink">{item.title}</strong>
                <span className="mt-3 block text-sm leading-7 text-ink/58">{item.desc}</span>
                <span className="mt-6 inline-flex text-sm font-semibold text-clay">了解更多 ›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
