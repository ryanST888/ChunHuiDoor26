import Link from "next/link";
import type { Company, NavItem } from "@/lib/types";

interface SiteFooterProps {
  company: Company;
  nav: NavItem[];
}

export function SiteFooter({ company, nav }: SiteFooterProps) {
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md border border-gold/70 text-sm text-gold">春</span>
            <strong className="font-serif text-xl">{company.name}</strong>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/62">{company.sloganSub}</p>
        </div>
        <nav className="flex flex-col gap-3 text-sm text-white/70" aria-label="页脚导航">
          {nav.map(item => (
            <Link className="transition hover:text-white" href={item.href} key={item.key}>
              {item.label}
            </Link>
          ))}
        </nav>
        <address className="not-italic text-sm leading-7 text-white/64">
          <p>{company.address}</p>
          <p>{company.branchAddress}</p>
          <p>
            <a className="text-white transition hover:text-gold" href={`tel:${company.phone}`}>
              {company.phone}
            </a>
          </p>
          <p>
            <a className="transition hover:text-gold" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
        </address>
      </div>
      <div className="container-shell mt-10 border-t border-white/10 pt-6 text-xs text-white/42">
        <p>© {new Date().getFullYear()} {company.name}. {company.icp}</p>
      </div>
    </footer>
  );
}
