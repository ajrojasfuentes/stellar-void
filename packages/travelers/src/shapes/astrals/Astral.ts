import type { Particle } from "@tsparticles/engine";
import { BaseEntity } from "../BaseEntity";
import { TailManager } from "../../effects/TailManager";
import { DebrisManager } from "../../effects/DebrisManager";

export abstract class Astral extends BaseEntity {
  protected tailManager: TailManager;
  protected debrisManager: DebrisManager | null = null;
  protected colorStr: string;
  private debrisChance: number;

  constructor(colorStr: string, tailLength: number, debrisChance: number = 0) {
    super();
    this.allowedPaths = ["straight", "parabolic", "sinusoidal"];
    this.colorStr = colorStr;
    this.debrisChance = debrisChance;
    this.tailManager = new TailManager(tailLength);
    if (debrisChance > 0) {
      this.debrisManager = new DebrisManager(colorStr);
    }
  }

  // Hook for subclass overrides (like Comet dynamic color)
  protected getColor(pData: any): string {
    return this.colorStr;
  }
  
  protected getDebrisChance(): number {
    return this.debrisManager ? this.debrisChance : 0; // Default or configured chance
  }

  override initKinematics(particle: Particle, pData: any) {
    if (!pData.astralInit) {
      pData.astralInit = true;
      super.initKinematics(particle, pData);
      
      let speedMult = pData.configSpeedMultiplier ?? 1.4;
      if (pData.trajectory === "sinusoidal") {
        speedMult *= 0.78; // Slow down slightly for sinusoidal to keep it serene
      }
      
      particle.velocity.x *= speedMult;
      particle.velocity.y *= speedMult;
      
      if (pData.pathEngine) {
        pData.pathEngine.init(particle, pData); // Re-init to capture new velocities
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    const activeColor = this.getColor(pData);
    
    // Pass current color to debris manager if needed
    if (this.debrisManager && this.debrisManager.getColor() !== activeColor) {
      this.debrisManager.setColor(activeColor);
    }

    // 1. Draw Tail (Underneath)
    const scaleFactor = radius / 15;
    this.tailManager.draw(ctx, opacity, activeColor, particle, pData, scaleFactor);
    
    let visX = 0;
    let visY = 0;
    let headScale = 1;
    
    if (pData.trajectory === "sinusoidal") {
      visX = pData.visOffsetX || 0;
      visY = pData.visOffsetY || 0;
      if (pData.time !== undefined) {
        const z = Math.cos(pData.time);
        headScale = 0.4 + ((z + 1) / 2) * 0.6; // Scale fluctuates between 0.4 and 1.0
      }
    }

    // Debris trailing
    if (this.debrisManager) {
      this.debrisManager.update(this.getDebrisChance(), visX, visY, particle.velocity.x, particle.velocity.y);
      this.debrisManager.draw(ctx, opacity);
    }

    ctx.save();
    
    this.drawAura(ctx, activeColor, opacity, visX, visY, headScale, scaleFactor);

    // Core Bright Head (Glowing)
    const headRadius = 4.5 * headScale * scaleFactor;
    ctx.beginPath();
    ctx.arc(visX, visY, headRadius, 0, Math.PI * 2); 
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9 * headScale})`;
    ctx.shadowBlur = 12 * headScale * scaleFactor;
    ctx.shadowColor = `rgba(${activeColor}, ${opacity * headScale})`;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }

  protected drawAura(ctx: CanvasRenderingContext2D, colorStr: string, opacity: number, headOffsetX: number, headOffsetY: number, headScale: number, scaleFactor: number = 1) {
    // Override in Comet
  }
}
