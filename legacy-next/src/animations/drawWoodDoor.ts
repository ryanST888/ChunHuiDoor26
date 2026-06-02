export interface DoorAnimationState {
  open: number;
  light: number;
  zoom: number;
  grain: number;
  dust: number;
  polish: number;
}

interface Point {
  x: number;
  y: number;
}

interface DoorPanelPoints {
  hingeTop: Point;
  hingeBottom: Point;
  seamTop: Point;
  seamBottom: Point;
}

export function drawWoodDoorScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: DoorAnimationState,
  time: number,
) {
  ctx.clearRect(0, 0, width, height);
  drawRoom(ctx, width, height, state);
  drawOpeningGlow(ctx, width, height, state);
  drawDoorPair(ctx, width, height, state, time);
  drawDust(ctx, width, height, state, time);
  drawForegroundVignette(ctx, width, height, state);
}

function drawRoom(ctx: CanvasRenderingContext2D, width: number, height: number, state: DoorAnimationState) {
  const zoom = 1 + state.zoom * 0.08;
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.scale(zoom, zoom);
  ctx.translate(-width * 0.5, -height * 0.5);

  const wall = ctx.createLinearGradient(0, 0, width, height);
  wall.addColorStop(0, "#26180f");
  wall.addColorStop(0.48, "#6d5f4f");
  wall.addColorStop(1, "#1a100a");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, height);

  const floorY = height * 0.66;
  const floor = ctx.createLinearGradient(0, floorY, 0, height);
  floor.addColorStop(0, "#2e2117");
  floor.addColorStop(1, "#120c08");
  ctx.fillStyle = floor;
  ctx.fillRect(0, floorY, width, height - floorY);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i += 1) {
    const x = width * (i / 11);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, floorY);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  ctx.restore();
}

function drawOpeningGlow(ctx: CanvasRenderingContext2D, width: number, height: number, state: DoorAnimationState) {
  const cx = width * 0.5;
  const cy = height * 0.46;
  const radius = Math.min(width, height) * (0.16 + state.light * 0.5);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  glow.addColorStop(0, `rgba(255, 236, 178, ${0.36 + state.light * 0.34})`);
  glow.addColorStop(0.42, `rgba(210, 72, 44, ${0.12 + state.light * 0.16})`);
  glow.addColorStop(1, "rgba(255, 236, 178, 0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const beamAlpha = state.light * 0.22;
  ctx.fillStyle = `rgba(255, 217, 134, ${beamAlpha})`;
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.08, cy);
  ctx.lineTo(width * 0.16, height);
  ctx.lineTo(width * 0.5, height);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + width * 0.08, cy);
  ctx.lineTo(width * 0.84, height);
  ctx.lineTo(width * 0.5, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDoorPair(ctx: CanvasRenderingContext2D, width: number, height: number, state: DoorAnimationState, time: number) {
  const doorHeight = Math.min(height * 0.78, width * 0.72);
  const doorWidth = Math.min(width * 0.25, doorHeight * 0.36);
  const top = height * 0.5 - doorHeight * 0.53;
  const bottom = top + doorHeight;
  const center = width * 0.5;
  const gap = 5;

  const openEase = easeOutCubic(state.open);
  const framePadding = 18;

  drawDoorFrame(ctx, center, top, bottom, doorWidth, framePadding, state);

  const leftPanel: DoorPanelPoints = {
    hingeTop: { x: center - doorWidth - framePadding * 0.18 - openEase * doorWidth * 0.08, y: top },
    hingeBottom: { x: center - doorWidth - framePadding * 0.18 - openEase * doorWidth * 0.08, y: bottom },
    seamTop: { x: center - gap - openEase * doorWidth * 0.76, y: top + openEase * 28 },
    seamBottom: { x: center - gap - openEase * doorWidth * 0.62, y: bottom - openEase * 22 },
  };

  const rightPanel: DoorPanelPoints = {
    hingeTop: { x: center + doorWidth + framePadding * 0.18 + openEase * doorWidth * 0.08, y: top },
    hingeBottom: { x: center + doorWidth + framePadding * 0.18 + openEase * doorWidth * 0.08, y: bottom },
    seamTop: { x: center + gap + openEase * doorWidth * 0.76, y: top + openEase * 28 },
    seamBottom: { x: center + gap + openEase * doorWidth * 0.62, y: bottom - openEase * 22 },
  };

  drawPanelShadow(ctx, leftPanel, "left", state);
  drawPanelShadow(ctx, rightPanel, "right", state);
  drawDoorPanel(ctx, leftPanel, "left", state, time);
  drawDoorPanel(ctx, rightPanel, "right", state, time);
  drawDoorHandles(ctx, leftPanel, rightPanel, state);
}

function drawDoorFrame(
  ctx: CanvasRenderingContext2D,
  center: number,
  top: number,
  bottom: number,
  doorWidth: number,
  framePadding: number,
  state: DoorAnimationState,
) {
  const frameLeft = center - doorWidth - framePadding;
  const frameRight = center + doorWidth + framePadding;
  const frameTop = top - framePadding;
  const frameBottom = bottom + framePadding;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 18;
  const frame = ctx.createLinearGradient(frameLeft, frameTop, frameRight, frameBottom);
  frame.addColorStop(0, "#5b3421");
  frame.addColorStop(0.45, "#9a6037");
  frame.addColorStop(1, "#2a160d");
  ctx.strokeStyle = frame;
  ctx.lineWidth = 16;
  ctx.strokeRect(frameLeft, frameTop, frameRight - frameLeft, frameBottom - frameTop);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(255, 216, 148, ${0.1 + state.polish * 0.18})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(frameLeft + 9, frameTop + 9, frameRight - frameLeft - 18, frameBottom - frameTop - 18);
  ctx.restore();
}

function drawPanelShadow(ctx: CanvasRenderingContext2D, panel: DoorPanelPoints, side: "left" | "right", state: DoorAnimationState) {
  ctx.save();
  ctx.globalAlpha = 0.34 + state.open * 0.26;
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.filter = "blur(18px)";
  const offset = side === "left" ? -14 : 14;
  ctx.beginPath();
  ctx.moveTo(panel.hingeTop.x + offset, panel.hingeTop.y + 18);
  ctx.lineTo(panel.seamTop.x + offset, panel.seamTop.y + 18);
  ctx.lineTo(panel.seamBottom.x + offset, panel.seamBottom.y + 24);
  ctx.lineTo(panel.hingeBottom.x + offset, panel.hingeBottom.y + 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDoorPanel(ctx: CanvasRenderingContext2D, panel: DoorPanelPoints, side: "left" | "right", state: DoorAnimationState, time: number) {
  const minX = Math.min(panel.hingeTop.x, panel.hingeBottom.x, panel.seamTop.x, panel.seamBottom.x);
  const maxX = Math.max(panel.hingeTop.x, panel.hingeBottom.x, panel.seamTop.x, panel.seamBottom.x);
  const minY = Math.min(panel.hingeTop.y, panel.seamTop.y);
  const maxY = Math.max(panel.hingeBottom.y, panel.seamBottom.y);

  ctx.save();
  tracePanel(ctx, panel);
  ctx.clip();

  const base = ctx.createLinearGradient(minX, minY, maxX, maxY);
  if (side === "left") {
    base.addColorStop(0, "#3a1d11");
    base.addColorStop(0.36, "#8b4b2b");
    base.addColorStop(1, "#c17a42");
  } else {
    base.addColorStop(0, "#c17a42");
    base.addColorStop(0.54, "#804526");
    base.addColorStop(1, "#2f180f");
  }
  ctx.fillStyle = base;
  ctx.fillRect(minX - 8, minY - 8, maxX - minX + 16, maxY - minY + 16);

  drawWoodGrain(ctx, minX, minY, maxX - minX, maxY - minY, state, time, side);
  drawInsetPanels(ctx, minX, minY, maxX - minX, maxY - minY, state);
  drawPolishSweep(ctx, minX, minY, maxX - minX, maxY - minY, state, side);

  ctx.restore();

  ctx.save();
  tracePanel(ctx, panel);
  ctx.strokeStyle = "rgba(255, 230, 177, 0.24)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawWoodGrain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  state: DoorAnimationState,
  time: number,
  side: "left" | "right",
) {
  const lineCount = 52;
  ctx.lineCap = "round";
  for (let i = 0; i < lineCount; i += 1) {
    const t = i / lineCount;
    const wave = Math.sin(i * 1.7 + state.grain * 2.4 + time * 0.00025) * 7;
    const px = x + width * t + wave;
    const alpha = 0.06 + pseudo(i + (side === "left" ? 0 : 70)) * 0.1;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 226, 178, ${alpha})`;
    ctx.lineWidth = 0.7 + pseudo(i * 12) * 1.2;
    ctx.moveTo(px, y + height * 0.04);
    ctx.bezierCurveTo(px + Math.sin(i) * 12, y + height * 0.32, px - Math.cos(i * 0.4) * 14, y + height * 0.66, px + Math.sin(i * 0.7) * 9, y + height * 0.96);
    ctx.stroke();

    if (i % 9 === 0) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(50, 25, 14, 0.18)";
      ctx.lineWidth = 2.2;
      ctx.ellipse(px + width * 0.02, y + height * (0.18 + pseudo(i) * 0.62), 12 + pseudo(i + 4) * 20, 28 + pseudo(i + 9) * 46, 0.05, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawInsetPanels(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, state: DoorAnimationState) {
  const padX = Math.max(10, width * 0.14);
  const panelWidth = Math.max(22, width - padX * 2);
  const sections = [
    { y: y + height * 0.12, h: height * 0.22 },
    { y: y + height * 0.43, h: height * 0.38 },
  ];

  ctx.save();
  ctx.strokeStyle = "rgba(40, 18, 9, 0.32)";
  ctx.lineWidth = 4;
  sections.forEach(section => {
    ctx.strokeRect(x + padX, section.y, panelWidth, section.h);
  });
  ctx.strokeStyle = `rgba(255, 232, 184, ${0.08 + state.polish * 0.12})`;
  ctx.lineWidth = 1.5;
  sections.forEach(section => {
    ctx.strokeRect(x + padX + 6, section.y + 6, Math.max(10, panelWidth - 12), Math.max(10, section.h - 12));
  });
  ctx.restore();
}

function drawPolishSweep(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, state: DoorAnimationState, side: "left" | "right") {
  const sweepX = x + width * ((side === "left" ? 0.1 : 0.35) + state.polish * 0.64);
  const gradient = ctx.createLinearGradient(sweepX - width * 0.22, y, sweepX + width * 0.2, y + height);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.5, `rgba(255, 241, 205, ${0.18 * state.polish})`);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
}

function drawDoorHandles(ctx: CanvasRenderingContext2D, left: DoorPanelPoints, right: DoorPanelPoints, state: DoorAnimationState) {
  const alpha = 1 - state.open * 0.15;
  ctx.save();
  ctx.globalAlpha = alpha;
  drawHandle(ctx, left.seamTop.x - 24, lerp(left.seamTop.y, left.seamBottom.y, 0.52), "left");
  drawHandle(ctx, right.seamTop.x + 24, lerp(right.seamTop.y, right.seamBottom.y, 0.52), "right");
  ctx.restore();
}

function drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number, side: "left" | "right") {
  const knob = ctx.createRadialGradient(x, y, 2, x, y, 18);
  knob.addColorStop(0, "#fff1bb");
  knob.addColorStop(0.4, "#cba14e");
  knob.addColorStop(1, "#573a17");
  ctx.fillStyle = knob;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 238, 184, 0.65)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + (side === "left" ? -22 : 22), y + 8);
  ctx.stroke();
}

function drawDust(ctx: CanvasRenderingContext2D, width: number, height: number, state: DoorAnimationState, time: number) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 84; i += 1) {
    const seed = pseudo(i * 3.9);
    const x = width * (0.22 + pseudo(i + 11) * 0.56) + Math.sin(time * 0.0004 + i) * 18;
    const y = height * (0.18 + pseudo(i + 31) * 0.58) + Math.cos(time * 0.0003 + i * 0.8) * 14;
    const size = 0.7 + seed * 2.4;
    ctx.fillStyle = `rgba(255, 229, 164, ${state.dust * (0.03 + seed * 0.16)})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawForegroundVignette(ctx: CanvasRenderingContext2D, width: number, height: number, state: DoorAnimationState) {
  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.46, Math.min(width, height) * 0.18, width * 0.5, height * 0.48, Math.max(width, height) * 0.68);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, `rgba(0,0,0,${0.46 - state.light * 0.16})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function tracePanel(ctx: CanvasRenderingContext2D, panel: DoorPanelPoints) {
  ctx.beginPath();
  ctx.moveTo(panel.hingeTop.x, panel.hingeTop.y);
  ctx.lineTo(panel.seamTop.x, panel.seamTop.y);
  ctx.lineTo(panel.seamBottom.x, panel.seamBottom.y);
  ctx.lineTo(panel.hingeBottom.x, panel.hingeBottom.y);
  ctx.closePath();
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp01(value), 3);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function pseudo(value: number) {
  const x = Math.sin(value * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}
