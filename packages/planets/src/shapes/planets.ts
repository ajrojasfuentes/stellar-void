/**
 * @fileoverview Custom tsParticles Shape Drawer for rendering planet sprites.
 * Uses embedded base64 sprites via getSpriteBitmap from @ajrojasfuentes/core.
 */

import type { IShapeDrawer, IShapeDrawData } from "@tsparticles/engine";
import type { PlanetType } from "@ajrojasfuentes/core";
import { getSpriteBitmap } from "@ajrojasfuentes/core";

type DrawFn = (ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle?: any) => void;

/**
 * Helper to draw an ImageBitmap centered at (x, y) within the given radius.
 */
const drawSprite = (ctx: CanvasRenderingContext2D, key: string, radius: number, opacity: number, x = 0, y = 0) => {
  const bitmap = getSpriteBitmap(key);
  if (!bitmap) return;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  const size = radius * 2;
  ctx.drawImage(bitmap, x - radius, y - radius, size, size);
  ctx.restore();
};

const drawGeoid: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "geoid", radius * 0.95, opacity);
};

const drawSaturnian: DrawFn = (ctx, radius, opacity) => {
  // To make the central planet fit the hitbox (radius), the sprite including rings must be scaled up (~1.45x)
  drawSprite(ctx, "saturnian", radius * 1.45, opacity);
};

const drawGaseous: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "gaseous", radius * 0.95, opacity);
};

const drawIceous: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "iceous", radius * 0.95, opacity);
};

const drawLunar: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "lunar", radius * 0.95, opacity);
};

const drawOrbital: DrawFn = (ctx, radius, opacity, particle) => {
  // Core planet matches physics hitbox perfectly (0.95x)
  drawSprite(ctx, "geoid", radius * 0.95, opacity);
  
  // Slower time for calm orbit
  const time = Date.now() / 3000;
  
  // Wobble effect: pulse randomly every few seconds
  const wobblePulse = Math.max(0, Math.sin(Date.now() / 2000 + particle.id * 2) - 0.85) * (1 / 0.15); 
  const radiusWobble = Math.sin(Date.now() / 300) * (radius * 0.2) * wobblePulse;
  const angleWobble = Math.sin(Date.now() / 400) * 0.2 * wobblePulse;

  const phase = particle?.id || 0; 
  const angle = time + phase + angleWobble; 
  // Moon orbits completely OUTSIDE the collision physics core
  const orbitRadius = (radius * 1.4) + radiusWobble;
  
  const moonX = Math.cos(angle) * orbitRadius;
  const moonY = Math.sin(angle) * orbitRadius;
  
  drawSprite(ctx, "moon", radius * 0.25, opacity, moonX, moonY);
};

const PLANET_RENDERERS: Record<PlanetType, DrawFn> = {
  geoid: drawGeoid,
  saturnian: drawSaturnian,
  gaseous: drawGaseous,
  iceous: drawIceous,
  lunar: drawLunar,
  orbital: drawOrbital,
};

/**
 * Custom IShapeDrawer for rendering planets with embedded sprite assets.
 * Supports per-particle rotation via configRotationSpeed.
 */
export class PlanetDrawer implements IShapeDrawer {
  draw(data: IShapeDrawData): void {
    const { context, particle } = data;
    const radius = data.radius ?? 10;
    const opacity = data.opacity ?? 1;
    const pData = particle as any;
    
    // Read the planet type from tsParticles shape configuration
    const type = (particle.shapeData?.type as PlanetType) || "geoid";
    const ctx = context as unknown as CanvasRenderingContext2D;

    ctx.save();
    
    // Per-particle rotation
    const rotSpeed = pData.shapeData?.rotationSpeed ?? 0;
    if (rotSpeed !== 0) {
      if (pData.planetRotationAngle === undefined) {
        pData.planetRotationAngle = Math.random() * Math.PI * 2;
      }
      pData.planetRotationAngle += rotSpeed;
      ctx.rotate(pData.planetRotationAngle);
    }
    
    const renderer = PLANET_RENDERERS[type] || PLANET_RENDERERS["geoid"];
    renderer(ctx, radius, opacity, particle);
    ctx.restore();
  }
}
