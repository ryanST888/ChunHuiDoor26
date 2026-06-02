"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawWoodDoorScene, type DoorAnimationState } from "@/animations/drawWoodDoor";

gsap.registerPlugin(ScrollTrigger);

export function WoodDoorAnimationDemo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<DoorAnimationState>({
    open: 0,
    light: 0,
    zoom: 0,
    grain: 0,
    dust: 0,
    polish: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!section || !pin || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cssWidth = 0;
    let cssHeight = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(320, rect.width);
      cssHeight = Math.max(420, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      render();
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawWoodDoorScene(ctx, cssWidth, cssHeight, stateRef.current, performance.now());
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(pin);
    gsap.ticker.add(render);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctxGsap = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([".wd-copy", ".wd-step"], { opacity: 1, y: 0 });
        gsap.set(stateRef.current, { open: 0.72, light: 0.9, zoom: 0.7, grain: 0.6, dust: 0.7, polish: 1 });
        render();
        return;
      }

      gsap.set(".wd-copy", { opacity: 0, y: 28 });
      gsap.set(".wd-step", { opacity: 0.34, y: 12 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          scrub: 0.9,
          pin,
          anticipatePin: 1,
        },
      });

      timeline
        .to(".wd-copy-intro", { opacity: 1, y: 0, duration: 0.35 }, 0)
        .to(".wd-step-1", { opacity: 1, y: 0, duration: 0.32 }, 0.04)
        .to(stateRef.current, { grain: 1, polish: 0.35, duration: 0.55, ease: "none" }, 0)
        .to(".wd-copy-intro", { opacity: 0, y: -18, duration: 0.22 }, 0.42)
        .to(".wd-copy-craft", { opacity: 1, y: 0, duration: 0.32 }, 0.52)
        .to(".wd-step-2", { opacity: 1, y: 0, duration: 0.32 }, 0.52)
        .to(stateRef.current, { polish: 1, duration: 0.5, ease: "none" }, 0.48)
        .to(".wd-copy-craft", { opacity: 0, y: -18, duration: 0.22 }, 0.86)
        .to(".wd-copy-open", { opacity: 1, y: 0, duration: 0.32 }, 0.96)
        .to(".wd-step-3", { opacity: 1, y: 0, duration: 0.32 }, 0.96)
        .to(stateRef.current, { open: 1, light: 1, dust: 1, duration: 0.68, ease: "power2.out" }, 0.88)
        .to(".wd-copy-open", { opacity: 0, y: -18, duration: 0.24 }, 1.48)
        .to(".wd-copy-final", { opacity: 1, y: 0, duration: 0.38 }, 1.58)
        .to(".wd-step-4", { opacity: 1, y: 0, duration: 0.32 }, 1.58)
        .to(stateRef.current, { zoom: 1, duration: 0.52, ease: "none" }, 1.48);
    }, section);

    return () => {
      ctxGsap.revert();
      gsap.ticker.remove(render);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0b07] text-white">
      <section ref={sectionRef} className="relative min-h-[360vh]">
        <div ref={pinRef} className="relative flex h-screen min-h-[680px] overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="木门开合 Canvas 动画演示" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/18 to-black/58" />

          <div className="relative z-10 flex w-full items-center">
            <div className="container-shell grid w-full gap-10 lg:grid-cols-[minmax(0,0.78fr)_340px] lg:items-end">
              <div className="max-w-2xl pt-24">
                <Link className="mb-8 inline-flex rounded-md border border-white/14 px-4 py-2 text-sm text-white/70 transition hover:border-gold hover:text-gold" href="/">
                  返回官网首页
                </Link>
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gold">GSAP · ScrollTrigger · Canvas</p>
                <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                  木门开合动画实验页
                </h1>
                <div className="relative mt-8 min-h-[180px]">
                  <StoryCopy className="wd-copy-intro" title="第一幕：木纹醒来" text="Canvas 先生成木纹、门框与空间光感，让用户在首屏就感受到真实材质。" />
                  <StoryCopy className="wd-copy-craft" title="第二幕：漆面扫光" text="GSAP 控制漆面高光沿门板移动，表达工艺、油漆、触感和高级质感。" />
                  <StoryCopy className="wd-copy-open" title="第三幕：开门见光" text="ScrollTrigger 把滚动进度映射到门扇开合、光线和空气粒子，形成沉浸式节奏。" />
                  <StoryCopy className="wd-copy-final" title="第四幕：进入空间" text="最后轻微推进镜头，露出背后的家居空间，可衔接产品中心或预约咨询。" />
                </div>
              </div>

              <aside className="hidden rounded-lg border border-white/12 bg-black/28 p-5 backdrop-blur-md lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Animation Map</p>
                <div className="mt-5 space-y-3">
                  <Step className="wd-step-1" index="01" text="生成木纹与门框" />
                  <Step className="wd-step-2" index="02" text="漆面高光扫过" />
                  <Step className="wd-step-3" index="03" text="门扇开启与光线进入" />
                  <Step className="wd-step-4" index="04" text="镜头推进到空间" />
                </div>
                <p className="mt-6 text-xs leading-6 text-white/48">
                  这是独立实验页，不进入主导航；后续可以把同一套组件接到首页 Hero。
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 text-ink">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          <DemoNote title="可控" text="每个视觉阶段都在 GSAP timeline 里分段，调试时只看对应 label 或时间点。" />
          <DemoNote title="可替换" text="Canvas 绘制函数独立，后续能换成真实门款纹理、产品图或序列帧。" />
          <DemoNote title="可降级" text="用户关闭动效时会显示静态开门状态，移动端也可以改成轻量版。" />
        </div>
      </section>
    </main>
  );
}

function StoryCopy({ className, title, text }: { className: string; title: string; text: string }) {
  return (
    <div className={`wd-copy absolute inset-x-0 top-0 ${className}`}>
      <h2 className="font-serif text-3xl font-semibold">{title}</h2>
      <p className="mt-4 max-w-xl text-base leading-8 text-white/70">{text}</p>
    </div>
  );
}

function Step({ className, index, text }: { className: string; index: string; text: string }) {
  return (
    <div className={`wd-step flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 ${className}`}>
      <strong className="font-serif text-xl text-gold">{index}</strong>
      <span className="text-sm text-white/72">{text}</span>
    </div>
  );
}

function DemoNote({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-ink/8 bg-white p-6 shadow-soft">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink/60">{text}</p>
    </article>
  );
}
