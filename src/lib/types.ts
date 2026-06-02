export type Locale = "zh-CN";

export type NavKey = "home" | "products" | "about" | "news" | "join";

export interface Company {
  name: string;
  nameEn: string;
  slogan: string;
  sloganSub: string;
  founded: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  branchAddress: string;
  contactPerson: string;
  wechat: string;
  icp: string;
}

export interface NavItem {
  label: string;
  href: string;
  key: NavKey;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  series: string;
  desc: string;
  tag?: string;
  price: string;
  image: string;
  accent?: string;
}

export interface ProductCategoryCard {
  title: string;
  subtitle: string;
  desc: string;
  count: string;
  image: string;
}

export interface ProductFilterGroup {
  title: string;
  values: string[];
}

export interface ProductNavGroup {
  title: string;
  items: Array<{
    label: string;
    desc: string;
    cat: string;
  }>;
}

export interface ProductCenterData {
  hero: {
    eyebrow: string;
    title: string;
    desc: string;
    image: string;
    highlights: Array<{ value: string; label: string }>;
  };
  navGroups?: ProductNavGroup[];
  categories: ProductCategoryCard[];
  filters: ProductFilterGroup[];
  recommendations?: Array<{ title: string; name: string; image: string }>;
  catalogTitle: string;
  catalogDesc: string;
}

export interface AboutData {
  title: string;
  content: string;
  image: string;
  highlights: Array<{ icon: string; title: string; desc: string }>;
  timeline: Array<{ year: string; event: string }>;
}

export interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  summary: string;
  image: string;
}

export interface ContactData {
  salesPhone: string;
  mobilePhone: string;
  afterSalePhone: string;
  workHours: string;
  contactPerson: string;
  wechatQR: string;
  cta: string;
  ctaSub: string;
}

export interface SiteData {
  company: Company;
  stats: StatItem[];
  productCategories: string[];
  productCenter: ProductCenterData;
  products: Product[];
  about: AboutData;
  news: NewsItem[];
  advantages: Array<{ icon: string; title: string; desc: string }>;
  contact: ContactData;
  nav: NavItem[];
}

export interface LocalizedSiteContent {
  activeLocale: Locale;
  locales: Record<Locale, SiteData>;
}
