import type { Particle } from "@tsparticles/engine";
import { SpriteEntity } from "../craft/SpriteEntity";

export abstract class Aliens extends SpriteEntity {
  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    if (!pData.alienInit) {
      pData.alienInit = true;
      const speedMult = pData.configSpeedMultiplier ?? 2.5;
      particle.velocity.x *= speedMult;
      particle.velocity.y *= speedMult;
    }
  }

  protected override applyTransform(ctx: CanvasRenderingContext2D, particle: Particle, pData: any, radius: number) {
    // Slower, more erratic wobble effect combining sine waves
    const time = Date.now() / 1000;
    const wobble = (Math.sin(time * 1.8 + particle.id) + Math.cos(time * 2.7 + particle.id)) * (radius * 0.5);
    
    // Calculate perpendicular vector to the physics engine's translation direction
    const vx = particle.velocity.x;
    const vy = particle.velocity.y;
    const speed = Math.hypot(vx, vy);
    
    let perpX = 0;
    let perpY = 1;
    if (speed > 0.001) {
      perpX = -vy / speed;
      perpY = vx / speed;
    }
    
    // Apply visual offset strictly perpendicular to the movement axis
    ctx.translate(perpX * wobble, perpY * wobble);
  }

  protected override drawBackgroundExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Slow pulse effect for the glow (between 0.4 and 1.0)
    // The offset + particle.id ensures they don't all pulse in exact sync
    const pulse = 0.6 + Math.sin(Date.now() / 800 + particle.id) * 0.4;
    
    // Much larger radius for a diffuse, ethereal effect
    const auraRadius = radius * 2 * pulse; 

    // Create an ethereal radial gradient that fades smoothly
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, auraRadius);
    grad.addColorStop(0, `rgba(50, 255, 100, ${opacity * 0.35 * pulse})`); // Brighter center
    grad.addColorStop(0.3, `rgba(50, 255, 100, ${opacity * 0.15 * pulse})`); // Soft falloff
    grad.addColorStop(1, `rgba(50, 255, 100, 0)`); // Invisible edge

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    
    // Add outer blur to enhance the ethereal glow effect
    ctx.shadowBlur = 25 * pulse;
    ctx.shadowColor = `rgba(100, 255, 100, ${opacity * 0.6 * pulse})`;
    
    ctx.fill();
    ctx.restore();
  }
}
