import { useEffect, useRef } from "react";

interface HeroFxIslandProps {
  slideCount: number;
}

function setActive(index: number, slideCount: number) {
  const activeIndex = Math.max(0, Math.min(slideCount - 1, index));
  const groups = [
    document.querySelectorAll<HTMLElement>("[data-hero-slide]"),
    document.querySelectorAll<HTMLElement>("[data-hero-copy]"),
    document.querySelectorAll<HTMLElement>("[data-hero-control]"),
  ];

  groups.forEach(group => {
    group.forEach((element, itemIndex) => {
      element.dataset.active = itemIndex === activeIndex ? "true" : "false";
    });
  });
}

export function HeroFxIsland({ slideCount }: HeroFxIslandProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let animationFrame = 0;
    let refreshFrame = 0;
    let refreshTimeout = 0;
    let cleanup = () => {};

    const init = async () => {
      const canvas = canvasRef.current;
      const root = document.querySelector<HTMLElement>("[data-hero]");
      if (!canvas || !root || slideCount <= 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      let width = 0;
      let height = 0;
      let dpr = 1;
      const state = { progress: 0, velocity: 0 };

      const syncFromScroll = () => {
        const distance = Math.max(1, root.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / distance));
        state.progress = progress;
        setActive(Math.round(progress * (slideCount - 1)), slideCount);
      };

      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(320, rect.width);
        height = Math.max(520, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      };

      const draw = (time: number) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = "screen";

        const segment = state.progress * Math.max(1, slideCount - 1);
        const local = segment - Math.floor(segment);
        const speed = Math.min(1, Math.abs(state.velocity) / 2800);
        const pulse = 0.5 + Math.sin(time * 0.001) * 0.5;
        const glowX = width * (0.18 + local * 0.72);
        const glowY = height * (0.3 + pulse * 0.18);
        const radius = Math.max(width, height) * (0.34 + speed * 0.12);
        const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, radius);
        gradient.addColorStop(0, `rgba(255, 230, 170, ${0.24 + speed * 0.18})`);
        gradient.addColorStop(0.46, `rgba(184, 64, 50, ${0.1 + speed * 0.14})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 72; i += 1) {
          const seed = (Math.sin(i * 13.7) + 1) / 2;
          const x = (i * 41 + time * (0.008 + seed * 0.01) + state.progress * width * 0.24) % width;
          const y = height * (0.14 + ((i * 19) % 73) / 96) + Math.sin(time * 0.001 + i) * 10;
          ctx.fillStyle = `rgba(255, 232, 170, ${0.045 + seed * 0.06 + speed * 0.08})`;
          ctx.beginPath();
          ctx.arc(x, y, 0.8 + seed * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
      };

      const tick = (time: number) => {
        draw(time);
        animationFrame = window.requestAnimationFrame(tick);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("scroll", syncFromScroll, { passive: true });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: self => {
          state.progress = self.progress;
          state.velocity = self.getVelocity();
          setActive(Math.round(self.progress * (slideCount - 1)), slideCount);
        },
      });

      const controlCleanups: Array<() => void> = [];
      document.querySelectorAll<HTMLButtonElement>("[data-hero-control]").forEach(button => {
        const handleClick = () => {
          const index = Number(button.dataset.index || 0);
          const rect = root.getBoundingClientRect();
          const start = window.scrollY + rect.top;
          const distance = root.getBoundingClientRect().height - window.innerHeight;
          window.scrollTo({
            top: start + distance * (index / Math.max(1, slideCount - 1)),
            behavior: "smooth",
          });
        };

        button.addEventListener("click", handleClick);
        controlCleanups.push(() => button.removeEventListener("click", handleClick));
      });

      const refreshState = () => {
        ScrollTrigger.refresh();
        syncFromScroll();
      };

      refreshFrame = window.requestAnimationFrame(refreshState);
      refreshTimeout = window.setTimeout(refreshState, 350);
      animationFrame = window.requestAnimationFrame(tick);
      cleanup = () => {
        trigger.kill();
        controlCleanups.forEach(removeListener => removeListener());
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("scroll", syncFromScroll);
        window.cancelAnimationFrame(animationFrame);
        window.cancelAnimationFrame(refreshFrame);
        window.clearTimeout(refreshTimeout);
      };
    };

    void init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [slideCount]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-screen" aria-hidden="true" />;
}
