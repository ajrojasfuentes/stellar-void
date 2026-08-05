import { Astral } from "./Astral";

export class Comet extends Astral {
  constructor() {
    super("", 300, 0); // Dynamic color, long tail, no debris
  }

  protected override getColor(pData: any): string {
    if (!pData.cometColor) {
      const colors = ["100, 255, 100", "100, 200, 255", "200, 100, 255", "255, 100, 200"];
      pData.cometColor = colors[Math.floor(Math.random() * colors.length)];
    }
    return pData.cometColor;
  }

  protected override drawAura(ctx: CanvasRenderingContext2D, colorStr: string, opacity: number, headOffsetX: number, headOffsetY: number, headScale: number, scaleFactor: number = 1) {
    const auraRadius = 24 * headScale * scaleFactor;
    const grad = ctx.createRadialGradient(headOffsetX, headOffsetY, 0, headOffsetX, headOffsetY, auraRadius);
    grad.addColorStop(0, `rgba(${colorStr}, ${opacity * 0.4 * headScale})`);
    grad.addColorStop(1, `rgba(${colorStr}, 0)`);

    ctx.beginPath();
    ctx.arc(headOffsetX, headOffsetY, auraRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}
