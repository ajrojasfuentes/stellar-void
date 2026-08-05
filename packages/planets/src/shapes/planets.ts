import type { IShapeDrawer, IShapeDrawData } from "@tsparticles/engine";

type PlanetType = "geoid" | "saturnian" | "gaseous" | "iceous" | "lunar" | "binary" | "orbital";
type DrawFn = (ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle?: any) => void;

// Cache for ImageBitmaps for maximum performance
const imageCache: Record<string, ImageBitmap> = {};

const loadBitmap = async (url: string, key: string) => {
  if (typeof window === "undefined") return;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    imageCache[key] = bitmap;
  } catch (e) {
    console.error(`Failed to load sprite: ${url}`, e);
  }
};

let planetsPreloaded = false;

import { DEFAULT_CDN_PATH } from "@ajrojasfuentes/core";

export const preloadPlanets = (basePath: string = DEFAULT_CDN_PATH) => {
  if (typeof window === "undefined" || planetsPreloaded) return;
  planetsPreloaded = true;
  loadBitmap(`${basePath}/geoid-1.webp`, "geoid-1");
  loadBitmap(`${basePath}/geoid-2.webp`, "geoid-2");
  loadBitmap(`${basePath}/saturnian.webp`, "saturnian");
  loadBitmap(`${basePath}/gaseous.webp`, "gaseous");
  loadBitmap(`${basePath}/iceous.webp`, "iceous");
  loadBitmap(`${basePath}/lunar.webp`, "lunar");
  loadBitmap(`${basePath}/moon.webp`, "moon");
};

// Helper to draw an image bitmap centered
const drawSprite = (ctx: CanvasRenderingContext2D, key: string, radius: number, opacity: number, x = 0, y = 0) => {
  const bitmap = imageCache[key];
  if (!bitmap) return; // Skip if not loaded yet
  
  ctx.save();
  ctx.globalAlpha = opacity;
  // Size the image appropriately to fit the radius
  const size = radius * 2;
  ctx.drawImage(bitmap, x - radius, y - radius, size, size);
  ctx.restore();
};

const drawGeoid: DrawFn = (ctx, radius, opacity, particle) => {
  // Stably assign a geoid type to this particle so it doesn't flicker
  if (!particle.customGeoidKey) {
    particle.customGeoidKey = Math.random() > 0.5 ? "geoid-1" : "geoid-2";
  }
  drawSprite(ctx, particle.customGeoidKey, radius, opacity);
};

const drawSaturnian: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "saturnian", radius * 1.5, opacity); // Slightly larger radius for rings
};

const drawGaseous: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "gaseous", radius, opacity);
};

const drawIceous: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "iceous", radius, opacity);
};

const drawLunar: DrawFn = (ctx, radius, opacity) => {
  drawSprite(ctx, "lunar", radius, opacity);
};

const drawBinary: DrawFn = (ctx, radius, opacity, particle) => {
  // Slower time for calm orbit
  const time = Date.now() / 3500;
  
  // Wobble effect: pulse randomly every few seconds based on particle id
  const wobblePulse = Math.max(0, Math.sin(Date.now() / 2500 + particle.id) - 0.85) * (1 / 0.15); 
  const radiusWobble = Math.sin(Date.now() / 400) * (radius * 0.15) * wobblePulse;
  const angleWobble = Math.sin(Date.now() / 500) * 0.15 * wobblePulse;
  
  const orbitRadius = (radius * 0.8) + radiusWobble;
  const r1 = radius * 0.6;
  const r2 = radius * 0.6;
  
  const x1 = Math.cos(time + angleWobble) * orbitRadius;
  const y1 = Math.sin(time + angleWobble) * orbitRadius;
  
  const x2 = Math.cos(time + Math.PI + angleWobble) * orbitRadius;
  const y2 = Math.sin(time + Math.PI + angleWobble) * orbitRadius;
  
  drawSprite(ctx, "geoid-1", r1, opacity, x1, y1);
  drawSprite(ctx, "geoid-2", r2, opacity, x2, y2);
};

const drawOrbital: DrawFn = (ctx, radius, opacity, particle) => {
  if (!particle.customGeoidKey) {
    particle.customGeoidKey = Math.random() > 0.5 ? "geoid-1" : "geoid-2";
  }
  
  drawSprite(ctx, particle.customGeoidKey, radius * 0.8, opacity);
  
  // Slower time for calm orbit
  const time = Date.now() / 3000;
  
  // Wobble effect: pulse randomly every few seconds
  const wobblePulse = Math.max(0, Math.sin(Date.now() / 2000 + particle.id * 2) - 0.85) * (1 / 0.15); 
  const radiusWobble = Math.sin(Date.now() / 300) * (radius * 0.2) * wobblePulse;
  const angleWobble = Math.sin(Date.now() / 400) * 0.2 * wobblePulse;

  const phase = particle?.id || 0; 
  const angle = time + phase + angleWobble; 
  const orbitRadius = (radius * 1.3) + radiusWobble;
  
  const moonX = Math.cos(angle) * orbitRadius;
  const moonY = Math.sin(angle) * orbitRadius;
  
  drawSprite(ctx, "moon", radius * 0.3, opacity, moonX, moonY);
};

const PLANET_RENDERERS: Record<PlanetType, DrawFn> = {
  geoid: drawGeoid,
  saturnian: drawSaturnian,
  gaseous: drawGaseous,
  iceous: drawIceous,
  lunar: drawLunar,
  binary: drawBinary,
  orbital: drawOrbital,
};

export class PlanetDrawer implements IShapeDrawer {
  draw(data: IShapeDrawData): void {
    const { context, particle } = data;
    const radius = data.radius ?? 10;
    const opacity = data.opacity ?? 1;
    
    // Read the planet type from tsParticles shape configuration
    const type = (particle.shapeData?.type as PlanetType) || "geoid";

    const ctx = context as unknown as CanvasRenderingContext2D;

    ctx.save();
    const renderer = PLANET_RENDERERS[type] || PLANET_RENDERERS["geoid"];
    renderer(ctx, radius, opacity, particle);
    ctx.restore();
  }
}
