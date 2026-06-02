"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawHomeEntranceTransition, type HomeEntranceCanvasState } from "@/animations/drawHomeEntranceTransition";
import type { SiteData } from "@/lib/types";
import { assetPath } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HomeWheelEntrancesProps {
  siteData: SiteData;
}

interface Slide {
  key: string;
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  image: string;
}

type StoredScrollTrigger = {
  start: number;
  end: number;
  kill: () => void;
};

export function HomeWheelEntrances({ siteData }: HomeWheelEntrancesProps) {
  const { company, stats, productCenter, news, contact } = siteData;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollTriggerRef = useRef<StoredScrollTrigger | null>(null);
  const scrollTweenRef = useRef<number | null>(null);
  const canvasStateRef = useRef<HomeEntranceCanvasState>({
    progress: 0,
    velocity: 0,
    activeIndex: 0,
    slideCount: 5,
  });

  const slides = useMemo<Slide[]>(
    () => [
      {
        key: "home",
        eyebrow: `${company.nameEn} · Since ${company.founded}`,
        title: company.slogan,
        desc: company.sloganSub,
        href: "/products/",
        cta: "查看产品中心",
        image: productCenter.hero.image,
      },
      {
        key: "products",
        eyebrow: "Products",
        title: "产品中心",
        desc: "从生态门、实木烤漆门到铝木门，围绕材质、工艺与空间气质，提供成套木门选择。",
        href: "/products/",
        cta: "进入产品中心",
        image: productCenter.categories[0]?.image || productCenter.hero.image,
      },
      {
        key: "about",
        eyebrow: "About Chunhui",
        title: "关于春晖",
        desc: "了解春晖门业的制造能力、品牌理念、工艺体系与长期品质追求。",
        href: "/about/",
        cta: "了解春晖",
        image: productCenter.hero.image,
      },
      {
        key: "news",
        eyebrow: "News",
        title: "新闻动态",
        desc: "浏览品牌资讯、木门保养知识与家居空间趋势，让选门和养护更清楚。",
        href: "/news/",
        cta: "查看新闻动态",
        image: news[0]?.image || productCenter.hero.image,
      },
      {
        key: "join",
        eyebrow: "Join Us",
        title: "招商加盟",
        desc: `${contact.ctaSub}。了解加盟优势、合作流程与招商联系方式。`,
        href: "/join/",
        cta: "进入招商加盟",
        image: productCenter.categories[1]?.image || productCenter.hero.image,
      },
    ],
    [company.founded, company.nameEn, company.slogan, company.sloganSub, contact.ctaSub, news, productCenter],
  );

  const goTo = (nextIndex: number) => {
    const trigger = scrollTriggerRef.current;
    const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (!trigger || slides.length <= 1) {
      setActive(clamped);
      return;
    }

    const progress = clamped / (slides.length - 1);
    const targetY = trigger.start + (trigger.end - trigger.start) * progress;
    if (scrollTweenRef.current) window.clearTimeout(scrollTweenRef.current);
    window.scrollTo({ top: targetY, behavior: "smooth" });
    scrollTweenRef.current = window.setTimeout(() => {
      scrollTweenRef.current = null;
    }, 700);
  };

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    canvasStateRef.current.slideCount = slides.length;

    const renderCanvas = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHomeEntranceTransition(ctx, width, height, canvasStateRef.current, performance.now());
    };

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(320, rect.width);
      height = Math.max(520, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      renderCanvas();
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(stage);
    gsap.ticker.add(renderCanvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trigger = reduceMotion
      ? null
      : ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: self => {
            const nextActive = Math.round(self.progress * (slides.length - 1));
            canvasStateRef.current.progress = self.progress;
            canvasStateRef.current.velocity = self.getVelocity();
            canvasStateRef.current.activeIndex = nextActive;
            setProgress(self.progress);
            setActive(current => (current === nextActive ? current : nextActive));
          },
        });

    if (reduceMotion) {
      canvasStateRef.current.progress = 0;
      canvasStateRef.current.velocity = 0;
      canvasStateRef.current.activeIndex = 0;
      setProgress(0);
      renderCanvas();
    }

    scrollTriggerRef.current = trigger as StoredScrollTrigger | null;
    window.setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => {
      scrollTriggerRef.current = null;
      if (scrollTweenRef.current) window.clearTimeout(scrollTweenRef.current);
      trigger?.kill();
      resizeObserver.disconnect();
      gsap.ticker.remove(renderCanvas);
    };
  }, [slides.length]);

  return (
    <section
      ref={rootRef}
      className="relative bg-ink text-white"
      style={{ height: `${slides.length * 100}svh`, minHeight: `${slides.length * 680}px` }}
      aria-label="首页 GSAP ScrollTrigger Canvas 入口动画"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden bg-ink pt-24">
        {slides.map((slide, index) => (
          <img
            key={slide.key}
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
              active === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            src={assetPath(slide.image)}
            alt={`${slide.title}入口背景`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/50 to-ink/72" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink/74 to-transparent" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10 h-full w-full mix-blend-screen" aria-hidden="true" />

        <div className="container-shell relative z-20 grid min-h-[calc(100svh-6rem)] gap-10 py-12 lg:grid-cols-[minmax(0,0.95fr)_400px] lg:items-center">
          <div className="relative min-h-[360px] max-w-3xl">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`absolute inset-x-0 top-0 transition-all duration-700 ${
                  active === index
                    ? "pointer-events-auto translate-y-0 opacity-100 blur-0"
                    : "pointer-events-none translate-y-8 opacity-0 blur-sm"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">{slide.eyebrow}</p>
                <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">{slide.title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-lg sm:leading-9">{slide.desc}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link className="btn-primary" href={slide.href}>
                    {slide.cta}
                  </Link>
                  <a className="btn-secondary bg-white/10 text-white hover:bg-white hover:text-ink" href={`tel:${company.phone}`}>
                    {company.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-lg border border-white/12 bg-black/24 p-5 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Page Entrance</p>
            <div className="mt-5 space-y-3">
              {slides.map((item, index) => (
                <button
                  key={item.key}
                  className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition ${
                    active === index
                      ? "border-gold bg-white text-ink"
                      : "border-white/10 bg-white/[0.04] text-white/76 hover:border-white/30 hover:text-white"
                  }`}
                  type="button"
                  onClick={() => goTo(index)}
                >
                  <span className="min-w-0 pr-4 text-sm font-semibold">{item.title}</span>
                  <span className={active === index ? "text-clay" : "text-gold"}>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-5 rounded-full border border-white/12 bg-black/24 px-5 py-3 backdrop-blur-md md:flex">
          {stats.map(item => (
            <div className="min-w-20 text-center" key={item.label}>
              <strong className="block font-serif text-2xl text-gold">{item.number}</strong>
              <span className="text-xs text-white/58">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-5 left-5 z-20 hidden items-center gap-4 text-xs uppercase tracking-[0.28em] text-white/54 md:flex">
          <span>Scroll</span>
          <span className="h-px w-28 bg-white/18">
            <span className="block h-full origin-left bg-gold" style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
          </span>
        </div>
      </div>
    </section>
  );
}
