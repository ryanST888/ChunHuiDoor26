import type { Company, ContactData } from "@/lib/types";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";

interface ContactSectionProps {
  company: Company;
  contact: ContactData;
}

export function ContactSection({ company, contact }: ContactSectionProps) {
  const items = [
    { label: "销售热线", value: contact.salesPhone, href: `tel:${contact.salesPhone}` },
    { label: "售后服务", value: contact.afterSalePhone, href: `tel:${contact.afterSalePhone}` },
    { label: "电子邮箱", value: company.email, href: `mailto:${company.email}` },
    { label: "服务时间", value: contact.workHours },
    { label: "总部地址", value: company.address },
  ];

  return (
    <section className="bg-paper py-20" id="contact">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionHeading eyebrow="Contact" title="联系春晖门业" description={contact.ctaSub} />
          <div className="mt-8 grid gap-3">
            {items.map(item => (
              <div className="rounded-lg border border-ink/8 bg-white p-5" key={item.label}>
                <span className="text-xs font-semibold text-clay">{item.label}</span>
                {item.href ? (
                  <a className="mt-2 block font-serif text-2xl font-semibold transition hover:text-clay" href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-base leading-7 text-ink/70">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
