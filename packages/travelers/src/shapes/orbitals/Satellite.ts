import type { Particle } from "@tsparticles/engine";
import { Orbitals } from "./Orbitals";

export class Satellite extends Orbitals {
  constructor(basePath: string) {
    super("satellite", `${basePath}/satellite.webp`, 0.8);
  }

  protected override drawExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Slower blink
    const blink = Math.sin(Date.now() / 800) * 0.5 + 0.5;
    
    ctx.save();
    ctx.beginPath();
    // Centered at 0,0 (on top of the satellite)
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    
    // Red, diffuse and ethereal
    ctx.fillStyle = `rgba(255, 50, 50, ${blink * opacity * 0.8})`;
    ctx.shadowBlur = radius * 0.8;
    ctx.shadowColor = `rgba(255, 50, 50, ${blink * opacity})`;
    
    ctx.fill();
    ctx.restore();
  }
}
