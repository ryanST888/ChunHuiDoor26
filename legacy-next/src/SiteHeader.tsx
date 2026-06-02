"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem, NavKey, ProductNavGroup, SiteData } from "@/lib/types";

interface SiteHeaderProps {
  active: NavKey;
  siteData: SiteData;
}

type MegaLink = {
  label: string;
  desc: string;
  href: string;
};

export function SiteHeader({ active, siteData }: SiteHeaderProps) {
  const { company, contact, nav, news, productCenter, stats } = siteData;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<NavKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = active === "home";
  const expanded = hoveredKey !== null;
  const lightMode = !isHome || expanded || menuOpen || scrolled;
  const menuKey = hoveredKey ?? active;

  useEffect(() => {
    if (!isHome) return;
    const update = () => {
      const hero = document.querySelector('[aria-label="首页 GSAP ScrollTrigger Canvas 入口动画"]');
      const heroBottom = hero?.getBoundingClientRect().bottom ?? window.innerHeight;
      setScrolled(heroBottom <= 104);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} left-0 top-0 z-50 w-full transition-colors duration-300 ${
        lightMode ? "border-b border-ink/10 bg-white text-ink shadow-[0_14px_40px_rgba(21,17,12,0.06)]" : "border-b border-white/12 bg-ink/18 text-white"
      }`}
      onMouseLeave={() => setHoveredKey(null)}
    >
      <div className="mx-auto flex h-24 w-full max-w-[1800px] items-center gap-8 px-6 md:px-8 xl:px-10">
        <Link className="flex min-w-[170px] flex-col leading-none" href="/" aria-label="返回春晖木门首页">
          <span className={`font-serif text-3xl font-black tracking-normal transition-colors ${lightMode ? "text-clay" : "text-white"}`}>
            春晖木门
          </span>
          <span className={`mt-2 text-[11px] font-semibold tracking-[0.28em] transition-colors ${lightMode ? "text-clay/80" : "text-white/78"}`}>
            静音 · 品质 · 家居
          </span>
        </Link>

        <nav className="hidden h-full flex-1 items-center justify-center gap-8 text-[15px] lg:flex xl:gap-10" aria-label="主导航">
          {nav.map(item => (
            <HeaderNavLink
              key={item.key}
              active={active}
              expandedKey={hoveredKey}
              item={item}
              lightMode={lightMode}
              onEnter={() => setHoveredKey(item.key)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a className={`inline-flex items-center gap-2 text-xl transition-colors ${lightMode ? "text-ink hover:text-clay" : "text-white hover:text-gold"}`} href={`tel:${company.phone}`}>
            <PhoneIcon />
            <span>{company.phone}</span>
          </a>
          <button
            className={`grid size-10 place-items-center rounded-full transition-colors ${lightMode ? "text-ink hover:bg-ink/5 hover:text-clay" : "text-white hover:bg-white/12"}`}
            type="button"
            aria-label="搜索"
          >
            <SearchIcon />
          </button>
        </div>

        <button
          className={`ml-auto grid size-10 place-items-center rounded-md border transition lg:hidden ${
            lightMode ? "border-ink/12 text-ink" : "border-white/20 text-white"
          }`}
          type="button"
          aria-label="打开导航菜单"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`hidden overflow-hidden border-t border-ink/8 bg-white text-ink transition-[max-height,opacity] duration-300 lg:block ${
          expanded ? "max-h-[390px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <MegaPanel
          activeKey={menuKey}
          contact={contact}
          nav={nav}
          news={news}
          productGroups={productCenter.navGroups}
          stats={stats}
          onNavigate={() => setHoveredKey(null)}
        />
      </div>

      {menuOpen ? (
        <div className="border-t border-ink/10 bg-white px-5 py-4 text-ink lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="移动端导航">
            {nav.map(item => (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-md px-3 py-3 text-sm transition ${
                  item.key === active ? "bg-clay text-white" : "text-ink/78 hover:bg-ink/5 hover:text-clay"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a className="rounded-md px-3 py-3 text-sm text-clay" href={`tel:${company.phone}`}>
              {company.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function HeaderNavLink({
  active,
  expandedKey,
  item,
  lightMode,
  onEnter,
}: {
  active: NavKey;
  expandedKey: NavKey | null;
  item: NavItem;
  lightMode: boolean;
  onEnter: () => void;
}) {
  const selected = expandedKey === item.key || (!expandedKey && active === item.key);

  return (
    <Link
      href={item.href}
      className={`group relative inline-flex h-full items-center whitespace-nowrap transition-colors ${
        lightMode ? "text-ink hover:text-clay" : "text-white/88 hover:text-white"
      } ${selected ? (lightMode ? "text-clay" : "text-white") : ""}`}
      aria-current={active === item.key ? "page" : undefined}
      aria-expanded={expandedKey === item.key}
      onFocus={onEnter}
      onMouseEnter={onEnter}
    >
      {item.label}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-clay transition-all duration-300 ${
          selected ? "w-11" : "w-0 group-hover:w-11"
        }`}
      />
    </Link>
  );
}

function MegaPanel({
  activeKey,
  contact,
  nav,
  news,
  productGroups,
  stats,
  onNavigate,
}: {
  activeKey: NavKey;
  contact: SiteData["contact"];
  nav: NavItem[];
  news: SiteData["news"];
  productGroups?: ProductNavGroup[];
  stats: SiteData["stats"];
  onNavigate: () => void;
}) {
  if (activeKey === "products") {
    return (
      <div className="mx-auto grid min-h-[310px] w-full max-w-[1800px] grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)_220px] gap-8 px-8 py-12 xl:px-12">
        {(productGroups?.length ? productGroups : fallbackProductGroups).slice(0, 2).map((group, groupIndex) => (
          <ProductMegaGroup group={group} groupIndex={groupIndex} key={group.title} onNavigate={onNavigate} />
        ))}
        <div className="border-l border-ink/8 pl-8">
          <p className="text-xl font-medium">热门入口</p>
          <div className="mt-8 space-y-4">
            {nav
              .filter(item => item.key !== "home")
              .map(item => (
                <Link className="flex items-center justify-between text-sm text-ink/62 transition hover:text-clay" href={item.href} key={item.key} onClick={onNavigate}>
                  <span>{item.label}</span>
                  <span className="text-lg text-ink/26">›</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  const content = getGenericMenu(activeKey, nav, news, stats, contact);

  return (
    <div className="mx-auto grid min-h-[280px] w-full max-w-[1800px] grid-cols-[280px_minmax(0,1fr)] gap-12 px-8 py-12 xl:px-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-clay">{content.eyebrow}</p>
        <h2 className="mt-4 font-serif text-3xl font-semibold">{content.title}</h2>
        <p className="mt-4 max-w-xs text-sm leading-7 text-ink/58">{content.desc}</p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {content.items.map((item, index) => (
          <Link
            className="group rounded-md border border-ink/8 px-5 py-5 transition hover:border-clay/30 hover:bg-clay/[0.03]"
            href={item.href}
            key={`${item.label}-${index}`}
            onClick={onNavigate}
          >
            <span className="grid size-11 place-items-center rounded-full border border-ink/12 text-ink/34 transition group-hover:border-clay/35 group-hover:text-clay">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-6 block text-base font-medium text-ink">{item.label}</span>
            <span className="mt-3 block text-sm leading-6 text-ink/54">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductMegaGroup({ group, groupIndex, onNavigate }: { group: ProductNavGroup; groupIndex: number; onNavigate: () => void }) {
  return (
    <div className={`${groupIndex > 0 ? "border-l border-ink/8 pl-8" : ""}`}>
      <p className="text-xl font-medium">{group.title}</p>
      <div className="mt-12 grid grid-cols-4 gap-x-8 gap-y-7">
        {group.items.map((item, index) => (
          <Link
            className="group flex min-w-0 flex-col items-center text-center"
            href={`/products/?category=${encodeURIComponent(item.cat)}`}
            key={`${item.label}-${index}`}
            onClick={onNavigate}
          >
            <MegaDoorIcon variant={index + groupIndex} />
            <span className="mt-5 max-w-full break-words text-sm text-ink transition group-hover:text-clay">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MegaDoorIcon({ variant }: { variant: number }) {
  return (
    <span className="relative block h-14 w-14 text-ink/26 transition group-hover:text-clay/70">
      <span className="absolute inset-x-[17px] bottom-1 top-1 rounded-sm border border-current" />
      <span className="absolute left-1/2 top-2 h-10 -translate-x-1/2 border-l border-current" />
      {variant % 3 === 0 ? <span className="absolute left-[23px] top-7 size-1 rounded-full bg-current" /> : null}
      {variant % 3 === 1 ? <span className="absolute inset-x-[20px] top-5 h-4 border border-current" /> : null}
      {variant % 3 === 2 ? (
        <>
          <span className="absolute left-[20px] top-2 h-10 border-l border-current" />
          <span className="absolute right-[20px] top-2 h-10 border-l border-current" />
        </>
      ) : null}
    </span>
  );
}

function getGenericMenu(activeKey: NavKey, nav: NavItem[], news: SiteData["news"], stats: SiteData["stats"], contact: SiteData["contact"]) {
  const navItems = nav.filter(item => item.key !== "home").map(item => ({ label: item.label, desc: "进入独立页面查看完整内容", href: item.href }));

  if (activeKey === "about") {
    return {
      eyebrow: "About Chunhui",
      title: "关于春晖",
      desc: "从品牌故事、制造能力、服务网络到品质体系，快速进入春晖门业的核心信息。",
      items: stats.slice(0, 4).map(item => ({ label: item.label, desc: item.number, href: "/about/" })),
    };
  }

  if (activeKey === "news") {
    return {
      eyebrow: "News",
      title: "新闻动态",
      desc: "查看品牌资讯、产品知识与空间趋势，让客户更快找到选门灵感。",
      items: news.slice(0, 4).map(item => ({ label: item.title, desc: item.category, href: "/news/" })),
    };
  }

  if (activeKey === "join") {
    return {
      eyebrow: "Join Us",
      title: "招商加盟",
      desc: "面向经销商与合作伙伴，展示加盟优势、支持政策和咨询通道。",
      items: [
        { label: "加盟优势", desc: "产品、门店、培训与运营支持", href: "/join/" },
        { label: "合作流程", desc: "咨询、评估、签约、开业", href: "/join/" },
        { label: "招商热线", desc: contact.salesPhone || contact.mobilePhone, href: `tel:${contact.salesPhone || contact.mobilePhone}` },
        { label: "服务时间", desc: contact.workHours, href: "/join/" },
      ],
    };
  }

  return {
    eyebrow: "Chunhui",
    title: "首页导览",
    desc: "按官网主入口快速进入产品、品牌、资讯和加盟内容。",
    items: navItems.length ? navItems : fallbackHomeLinks,
  };
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const fallbackProductGroups: ProductNavGroup[] = [
  {
    title: "产品品类",
    items: [
      { label: "生态门", desc: "多色饰面", cat: "生态门" },
      { label: "实木烤漆门", desc: "雕刻线条", cat: "实木烤漆门" },
      { label: "铝木门", desc: "防潮抗变", cat: "铝木门" },
      { label: "玻璃门", desc: "通透采光", cat: "玻璃门" },
    ],
  },
  {
    title: "风格系列",
    items: [
      { label: "国潮墨影", desc: "东方木纹", cat: "生态门" },
      { label: "经典平雕", desc: "耐看线型", cat: "实木烤漆门" },
      { label: "橡木深雕", desc: "立体质感", cat: "实木烤漆门" },
      { label: "健康无漆", desc: "低味环保", cat: "铝木门" },
    ],
  },
];

const fallbackHomeLinks: MegaLink[] = [
  { label: "产品中心", desc: "查看木门系列与推荐产品", href: "/products/" },
  { label: "关于春晖", desc: "了解品牌与制造能力", href: "/about/" },
  { label: "新闻动态", desc: "浏览品牌资讯和选门知识", href: "/news/" },
  { label: "招商加盟", desc: "查看合作政策与联系方式", href: "/join/" },
];
