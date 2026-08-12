/**
 * @file SpriteEntity.ts
 * @description Abstract entity class that renders an image sprite with support for transformations and additional effects.
 * Uses centralized embedded sprites from @ajrojasfuentes/core.
 */
import type { Particle } from "@tsparticles/engine";
import { BaseEntity } from "../BaseEntity";
import { getSpriteBitmap } from "@ajrojasfuentes/core";

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
   * @param spriteKey - The unique key identifying the sprite (must match a key in SPRITES).
   * @param scale - The scale factor to apply to the sprite. Defaults to 1.0.
   */
  constructor(spriteKey: string, scale: number = 1.0) {
    super();
    this.spriteKey = spriteKey;
    this.scale = scale;
  }

  /**
   * Draws the sprite entity, applying any transforms, background effects, and extra overlays.
   */
  draw(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    const bitmap = getSpriteBitmap(this.spriteKey);
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
   */
  protected applyTransform(ctx: CanvasRenderingContext2D, particle: Particle, pData: any, radius: number) {
    // Default does nothing
  }

  /**
   * Hook for drawing background effects (like aura) BEFORE the image is drawn.
   */
  protected drawBackgroundExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Default does nothing
  }

  /**
   * Hook for drawing extra elements on top of the sprite (e.g., blinking lights).
   */
  protected drawExtras(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any) {
    // Default does nothing
  }
}
