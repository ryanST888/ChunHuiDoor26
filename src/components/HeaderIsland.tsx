import { useEffect, useState } from "react";
import type { NavItem, NavKey } from "@/lib/types";

interface HeaderIslandProps {
  active: NavKey;
  company: {
    phone: string;
    slogan: string;
  };
  nav: NavItem[];
  solid?: boolean;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function HeaderIsland({ active, company, nav, solid = false }: HeaderIslandProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(solid);
  const lightMode = solid || scrolled || menuOpen;

  useEffect(() => {
    if (solid) return;

    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
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
  }, [solid]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        lightMode
          ? "border-ink/10 bg-white/95 text-ink shadow-[0_14px_40px_rgba(21,17,12,0.06)]"
          : "border-white/15 bg-ink/20 text-white",
      )}
    >
      <div className="mx-auto flex h-20 w-[min(100%-2rem,1800px)] items-center gap-6 lg:h-24 lg:gap-9">
        <a className="min-w-0 leading-none lg:min-w-48" href="/" aria-label="返回春晖木门首页">
          <span className={cx("block font-serif-cn text-3xl font-black tracking-normal lg:text-4xl", lightMode && "text-clay")}>
            {company.slogan}
          </span>
          <span className={cx("mt-2 block text-[10px] font-bold tracking-[0.22em] lg:text-[11px]", lightMode ? "text-clay/80" : "text-white/78")}>
            静音 · 品质 · 家居
          </span>
        </a>

        <nav className="hidden h-full flex-1 items-center justify-center gap-7 text-[15px] font-bold lg:flex xl:gap-11" aria-label="主导航">
          {nav.map(item => (
            <a
              key={item.key}
              className={cx(
                "relative inline-flex h-full items-center whitespace-nowrap opacity-90 transition hover:opacity-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-clay after:transition-all after:duration-300",
                item.key === active ? "after:w-11" : "after:w-0 hover:after:w-11",
              )}
              href={item.href}
              aria-current={item.key === active ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-5 text-xl font-bold lg:flex">
          <a className={cx("transition", lightMode ? "hover:text-clay" : "hover:text-gold")} href={`tel:${company.phone}`}>
            {company.phone}
          </a>
          <a className={cx("grid size-11 place-items-center rounded-full transition", lightMode ? "hover:bg-ink/5 hover:text-clay" : "hover:bg-white/12")} href="/products/" aria-label="搜索产品">
            <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </a>
        </div>

        <button
          className="ml-auto grid size-11 place-items-center rounded-md border border-current lg:hidden"
          type="button"
          aria-label="打开导航菜单"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(current => !current)}
        >
          <span className="grid gap-1.5">
            <span className={cx("block h-0.5 w-5 bg-current transition", menuOpen && "translate-y-2 rotate-45")} />
            <span className={cx("block h-0.5 w-5 bg-current transition", menuOpen && "opacity-0")} />
            <span className={cx("block h-0.5 w-5 bg-current transition", menuOpen && "-translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <nav className="border-t border-ink/10 bg-white px-5 py-4 text-ink lg:hidden" aria-label="移动端导航">
          <div className="grid gap-2">
            {nav.map(item => (
              <a
                key={item.key}
                className={cx("rounded-md px-4 py-3 text-sm font-bold transition", item.key === active ? "bg-clay text-white" : "hover:bg-ink/5 hover:text-clay")}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
            <a className="rounded-md px-4 py-3 text-sm font-bold text-clay" href={`tel:${company.phone}`}>
              {company.phone}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

