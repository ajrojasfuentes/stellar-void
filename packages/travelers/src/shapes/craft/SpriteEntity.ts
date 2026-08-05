/**
 * @file SpriteEntity.ts
 * @description Abstract entity class that loads and renders an image sprite with support for transformations and additional effects.
 */
import type { Particle } from "@tsparticles/engine";
import { BaseEntity } from "../BaseEntity";

/** Global Cache for ImageBitmaps for maximum performance */
const imageCache: Record<string, ImageBitmap> = {};

/**
 * Abstract class for entities that are rendered using an image sprite.
 */
export abstract class SpriteEntity extends BaseEntity {
  /** The unique key for the loaded sprite. */
  protected spriteKey: string;
  /** The scale multiplier for the sprite. */
  protected scale: number;

  /**
   * Creates an instance of SpriteEntity.
   * @param spriteKey - The unique key identifying the sprite.
   * @param spriteUrl - The URL of the image to load.
   * @param scale - The scale factor to apply to the sprite. Defaults to 1.0.
   */
  constructor(spriteKey: string, spriteUrl: string, scale: number = 1.0) {
    super();
    this.spriteKey = spriteKey;
    this.scale = scale;
    this.loadBitmap(spriteUrl, spriteKey);
  }

  /**
   * Asynchronously loads and caches the sprite image as an ImageBitmap.
   * @param url - The URL of the image to load.
   * @param key - The cache key for the image.
   */
  private async loadBitmap(url: string, key: string) {
    if (typeof window === "undefined" || imageCache[key]) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      imageCache[key] = bitmap;
    } catch (e) {
      console.error(`Failed to load sprite: ${url}`, e);
    }
  }

  /**
   * Draws the sprite entity, applying any transforms, background effects, and extra overlays.
   * @param ctx - The canvas rendering context.
   * @param radius - The radius of the particle.
   * @param opacity - The opacity of the particle.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   */
  draw(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    const bitmap = imageCache[this.spriteKey];
    if (!bitmap) return; 

    ctx.save();
    
    // Allow subclass to modify context (e.g., rotation, translation) before drawing
    this.applyTransform(ctx, particle, pData, radius);
    
    // Allow subclass to draw background effects (like aura) BEFORE the image
    this.drawBackgroundExtras(ctx, radius, opacity, particle, pData);
    
    ctx.globalAlpha = opacity;
    const size = radius * 2 * this.scale;
    ctx.drawImage(bitmap, -radius * this.scale, -radius * this.scale, size, size);
    
    // Allow subclass to draw additional things on top (e.g., blinking lights)
    this.drawExtras(ctx, radius, opacity, particle, pData);
    
    ctx.restore();
  }

  /**
   * Hook for applying transformations (e.g., rotation, translation) before drawing the sprite.
   * @param ctx - The canvas rendering context.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   * @param radius - The radius of the particle.
   */
  protected applyTransform(ctx: CanvasRenderingContext2D, particle: Particle, pData: any, radius: number) {
    // Default does nothing
  }

  /**
   * Hook for drawing background effects (like aura) BEFORE the image is drawn.
   * @param ctx - The canvas rendering context.
   * @param radius - The radius of the particle.
   * @param opacity - The opacity of the particle.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   */
  protected drawBackgroundExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Default does nothing
  }

  /**
   * Hook for drawing extra elements on top of the sprite (e.g., blinking lights).
   * @param ctx - The canvas rendering context.
   * @param radius - The radius of the particle.
   * @param opacity - The opacity of the particle.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   */
  protected drawExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Default does nothing
  }
}
