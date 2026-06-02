"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product, ProductCenterData } from "@/lib/types";
import { assetPath } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

interface ProductCenterProps {
  categories: string[];
  center: ProductCenterData;
  products: Product[];
  standalone?: boolean;
}

export function ProductCenter({ categories, center, products, standalone = false }: ProductCenterProps) {
  const defaultCategory = categories[0] ?? "全部";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [query, setQuery] = useState("");

  const visibleProducts = useMemo(() => {
    const keyword = query.trim();
    if (keyword) {
      return products.filter(product =>
        [product.name, product.series, product.desc, product.tag ?? ""].some(value => value.includes(keyword)),
      );
    }

    if (selectedCategory === defaultCategory) return products;
    return products.filter(product => product.series === selectedCategory);
  }, [defaultCategory, products, query, selectedCategory]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setQuery("");
  };

  const activeTitle = query || (selectedCategory === defaultCategory ? center.catalogTitle : selectedCategory);

  return (
    <section className={`${standalone ? "pt-12" : "pt-20"} bg-paper pb-20`} id="products">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <SectionHeading eyebrow={center.hero.eyebrow} title={center.hero.title} description={center.hero.desc} />
          <div className="relative overflow-hidden rounded-lg bg-warm shadow-soft">
            <img
              className="aspect-[4/3] h-full w-full object-contain p-8"
              src={assetPath(center.hero.image)}
              alt={`${center.hero.title}产品主图`}
              loading={standalone ? "eager" : "lazy"}
            />
            <div className="grid grid-cols-3 border-t border-ink/10 bg-white/90">
              {center.hero.highlights.map(item => (
                <div className="px-4 py-4 text-center" key={item.label}>
                  <strong className="block font-serif text-2xl text-clay">{item.value}</strong>
                  <span className="text-xs text-ink/58">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {center.categories.map(category => {
            const active = selectedCategory === category.title && !query;
            return (
              <button
                type="button"
                className={`group grid min-h-44 grid-cols-[1fr_96px] gap-4 rounded-lg border p-5 text-left transition ${
                  active ? "border-clay bg-white shadow-soft" : "border-ink/8 bg-white/70 hover:border-clay/50 hover:bg-white"
                }`}
                key={category.title}
                onClick={() => selectCategory(category.title)}
              >
                <span>
                  <small className="text-xs text-clay">{category.count}</small>
                  <strong className="mt-2 block font-serif text-2xl">{category.title}</strong>
                  <em className="mt-2 block text-sm not-italic leading-6 text-ink/58">{category.desc}</em>
                </span>
                <img className="h-32 w-24 object-contain transition group-hover:scale-105" src={assetPath(category.image)} alt={category.title} loading="lazy" />
              </button>
            );
          })}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-ink/8 bg-white p-5 shadow-soft">
            <label className="block text-sm font-semibold text-ink" htmlFor="product-search">
              搜索产品
            </label>
            <input
              id="product-search"
              className="mt-3 h-11 w-full rounded-md border border-ink/10 bg-paper px-4 text-sm outline-none transition focus:border-clay focus:bg-white"
              value={query}
              placeholder="输入系列、材质或型号"
              onChange={event => setQuery(event.target.value)}
            />
            <div className="mt-6 space-y-6">
              {center.filters.map(group => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.values.map(value => {
                      const isCategory = categories.includes(value);
                      const active = isCategory ? selectedCategory === value && !query : query === value;
                      return (
                        <button
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            active ? "border-clay bg-clay text-white" : "border-ink/10 bg-paper text-ink/70 hover:border-clay hover:text-clay"
                          }`}
                          key={value}
                          type="button"
                          onClick={() => (isCategory ? selectCategory(value) : setQuery(value))}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Catalog</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold">{activeTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/58">{center.catalogDesc}</p>
              </div>
              <span className="text-sm text-ink/52">共 {visibleProducts.length} 款</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map(product => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-ink/8 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link href="/#contact" aria-label={`咨询${product.name}`}>
        <span className="relative block bg-warm">
          <img className="aspect-[4/3] w-full object-contain p-7 transition group-hover:scale-105" src={assetPath(product.image)} alt={product.name} loading="lazy" />
          {product.tag ? <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-1 text-xs text-clay shadow-soft">{product.tag}</span> : null}
        </span>
        <span className="block p-5">
          <span className="text-xs font-semibold text-clay">{product.series}</span>
          <strong className="mt-2 block min-h-14 font-serif text-xl leading-7">{product.name}</strong>
          <span className="mt-3 block min-h-14 text-sm leading-7 text-ink/58">{product.desc}</span>
          <span className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4">
            <span className="font-semibold text-ink">{product.price}</span>
            <span className="text-sm text-clay">立即咨询</span>
          </span>
        </span>
      </Link>
    </article>
  );
}
