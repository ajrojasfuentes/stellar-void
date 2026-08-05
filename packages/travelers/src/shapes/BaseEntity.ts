/**
 * @file BaseEntity.ts
 * @description Base class for all drawable traveler entities, providing path and drawing logic.
 */
import type { Particle } from "@tsparticles/engine";
import { PathEngineFactory, type PathEngine } from "../paths";

/**
 * Abstract base class representing a drawable entity with kinematics.
 */
export abstract class BaseEntity {
  /** The allowed path types for this entity. */
  protected allowedPaths: ("straight" | "parabolic" | "sinusoidal")[] = ["straight", "parabolic"];

  /**
   * Initializes the kinematics (path engine) for the particle.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   */
  initKinematics(particle: Particle, pData: any) {
    if (pData.trajectoryInit) return;
    
    pData.trajectoryInit = true;
    const pathType = this.allowedPaths[Math.floor(Math.random() * this.allowedPaths.length)];
    pData.pathEngine = PathEngineFactory.create(pathType) as PathEngine;
    pData.pathEngine.init(particle, pData);
  }

  /**
   * Draws the entity on the canvas.
   * @param ctx - The canvas rendering context.
   * @param radius - The radius of the particle.
   * @param opacity - The opacity of the particle.
   * @param particle - The tsParticles particle instance.
   * @param pData - The custom particle data.
   */
  abstract draw(ctx: CanvasRenderingContext2D, radius: number, opacity: number, particle: Particle, pData: any): void;
}
