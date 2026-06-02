export interface HomeEntranceCanvasState {
  progress: number;
  velocity: number;
  activeIndex: number;
  slideCount: number;
}

export function drawHomeEntranceTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: HomeEntranceCanvasState,
  time: number,
) {
  ctx.clearRect(0, 0, width, height);

  const segment = state.slideCount > 1 ? state.progress * (state.slideCount - 1) : 0;
  const local = segment - Math.floor(segment);
  const speed = Math.min(1, Math.abs(state.velocity) / 2600);
  const pulse = 0.5 + Math.sin(time * 0.0012) * 0.5;

  drawAmberWash(ctx, width, height, local, speed, pulse);
  drawWoodGrainCurtain(ctx, width, height, segment, speed, time);
  drawLightSweep(ctx, width, height, local, speed);
  drawFloatingDust(ctx, width, height, state.progress, speed, time);
}

function drawAmberWash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  local: number,
  speed: number,
  pulse: number,
) {
  const cx = width * (0.26 + local * 0.48);
  const cy = height * (0.34 + pulse * 0.18);
  const radius = Math.max(width, height) * (0.32 + speed * 0.18);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  glow.addColorStop(0, `rgba(255, 219, 144, ${0.18 + speed * 0.16})`);
  glow.addColorStop(0.45, `rgba(184, 64, 50, ${0.08 + speed * 0.12})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawWoodGrainCurtain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  segment: number,
  speed: number,
  time: number,
) {
  const offset = segment * width * 0.18 + time * 0.006;
  const lineCount = Math.ceil(width / 16);
  ctx.save();
  ctx.globalAlpha = 0.26 + speed * 0.2;
  ctx.globalCompositeOperation = "screen";

  for (let i = -4; i < lineCount + 4; i += 1) {
    const seed = pseudo(i * 13.7);
    const x = i * 16 + Math.sin(i * 0.72 + offset * 0.02) * 22 - (offset % 32);
    const alpha = 0.045 + seed * 0.08 + speed * 0.035;
    const gradient = ctx.createLinearGradient(x, 0, x + 46, height);
    gradient.addColorStop(0, `rgba(255, 228, 180, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(196, 132, 75, ${alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.8 + seed * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, height * -0.08);
    ctx.bezierCurveTo(
      x + Math.sin(seed * 8) * 48,
      height * 0.24,
      x - Math.cos(seed * 10) * 34,
      height * 0.68,
      x + Math.sin(seed * 12) * 36,
      height * 1.08,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawLightSweep(ctx: CanvasRenderingContext2D, width: number, height: number, local: number, speed: number) {
  const sweepX = width * (-0.18 + local * 1.36);
  const sweep = ctx.createLinearGradient(sweepX - width * 0.16, 0, sweepX + width * 0.18, height);
  sweep.addColorStop(0, "rgba(255,255,255,0)");
  sweep.addColorStop(0.45, `rgba(255, 235, 186, ${0.16 + speed * 0.18})`);
  sweep.addColorStop(1, "rgba(255,255,255,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = sweep;
  ctx.beginPath();
  ctx.moveTo(sweepX - width * 0.22, 0);
  ctx.lineTo(sweepX + width * 0.08, 0);
  ctx.lineTo(sweepX + width * 0.28, height);
  ctx.lineTo(sweepX - width * 0.08, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFloatingDust(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  speed: number,
  time: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 72; i += 1) {
    const seed = pseudo(i * 9.21);
    const drift = time * (0.004 + seed * 0.012) + progress * width * 0.18;
    const x = (pseudo(i + 24) * width + Math.sin(drift * 0.03 + i) * 28) % width;
    const y = height * (0.14 + pseudo(i + 61) * 0.72) + Math.cos(drift * 0.02 + i) * 16;
    const size = 0.7 + seed * 2.4;
    ctx.fillStyle = `rgba(255, 232, 170, ${0.05 + speed * 0.16 + seed * 0.05})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function pseudo(value: number) {
  const x = Math.sin(value * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}
