import { useEffect, useRef } from "react";

interface ScrollFrameSequenceIslandProps {
  basePath?: string;
  className?: string;
  frameCount: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function frameSrc(basePath: string, index: number) {
  const cleanBase = basePath.replace(/\/$/, "");
  const frame = String(index).padStart(3, "0");
  return `${cleanBase}/frame_${frame}_delay-0.041s.webp`;
}

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, dpr: number) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (imageRatio > canvasRatio) {
    sourceWidth = image.naturalHeight * canvasRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / canvasRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

function nearestLoadedFrame(images: Map<number, HTMLImageElement>, target: number, frameCount: number) {
  if (images.has(target)) return target;

  for (let radius = 1; radius < frameCount; radius += 1) {
    const previous = target - radius;
    const next = target + radius;

    if (previous >= 0 && images.has(previous)) return previous;
    if (next < frameCount && images.has(next)) return next;
  }

  return null;
}

export function ScrollFrameSequenceIsland({ basePath = "/consequence", className, frameCount }: ScrollFrameSequenceIslandProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.closest<HTMLElement>("[data-sequence-section]");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !root || !ctx || frameCount <= 0) return;

    let cancelled = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let progress = 0;
    let drawFrame = 0;
    let scrollFrame = 0;
    let resizeFrame = 0;
    let renderedFrame = -1;
    let needsSizeRedraw = true;
    const images = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();

    const loadFrame = (rawIndex: number) => {
      const index = clamp(rawIndex, 0, frameCount - 1);
      if (images.has(index) || loading.has(index)) return;

      loading.add(index);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (cancelled) return;
        loading.delete(index);
        images.set(index, image);
        scheduleDraw();
      };
      image.onerror = () => {
        loading.delete(index);
      };
      image.src = frameSrc(basePath, index);
    };

    const preloadAround = (index: number) => {
      const radius = window.innerWidth < 768 ? 5 : 10;
      for (let offset = -radius; offset <= radius; offset += 1) {
        loadFrame(index + offset);
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(320, rect.width);
      height = Math.max(480, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      needsSizeRedraw = true;
      scheduleDraw();
    };

    const updateProgress = () => {
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      progress = clamp(-root.getBoundingClientRect().top / distance, 0, 1);
      scheduleDraw();
    };

    const draw = () => {
      drawFrame = 0;
      const targetFrame = Math.round(progress * (frameCount - 1));
      loadFrame(targetFrame);
      preloadAround(targetFrame);

      const frameToDraw = nearestLoadedFrame(images, targetFrame, frameCount);
      if (frameToDraw === null) return;

      const image = images.get(frameToDraw);
      if (!image) return;

      if (frameToDraw === renderedFrame && !needsSizeRedraw) return;
      drawCover(ctx, image, width, height, dpr);
      renderedFrame = frameToDraw;
      needsSizeRedraw = false;
    };

    function scheduleDraw() {
      if (drawFrame) return;
      drawFrame = window.requestAnimationFrame(draw);
    }

    const scheduleProgress = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateProgress();
      });
    };

    const scheduleResize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resizeCanvas();
        updateProgress();
      });
    };

    resizeCanvas();
    updateProgress();
    loadFrame(0);
    loadFrame(frameCount - 1);
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleResize);
      window.cancelAnimationFrame(drawFrame);
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, [basePath, frameCount]);

  return <canvas ref={canvasRef} className={className || "absolute inset-0 z-0 h-full w-full"} aria-hidden="true" />;
}
