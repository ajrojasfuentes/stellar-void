/**
 * @file TravelerDrawer.ts
 * @description Custom shape drawer for tsParticles that renders different traveler entities.
 */
import type { IShapeDrawer, IShapeDrawData } from "@tsparticles/engine";
import { Asteroid } from "./astrals/Asteroid";
import { Meteor } from "./astrals/Meteor";
import { Comet } from "./astrals/Comet";
import { Boulder } from "./orbitals/Boulder";
import { Satellite } from "./orbitals/Satellite";
import { Ufo1 } from "./aliens/Ufo1";
import { Ufo2 } from "./aliens/Ufo2";
import { Invader } from "./aliens/Invader";
import type { BaseEntity } from "./BaseEntity";

/** Define the possible types of travelers. */
type TravelerType = "asteroid" | "meteor" | "comet" | "boulder" | "satellite" | "ufo-1" | "invader" | "ufo-2";

/**
 * Custom shape drawer that delegates drawing logic to specific traveler entities.
 */
export class TravelerDrawer implements IShapeDrawer {
  constructor() {}
  /**
   * Draws the custom shape for a given particle.
   * @param data - The data containing the context and particle to draw.
   */
  draw(data: IShapeDrawData): void {
    const { context, particle } = data;
    const pData = particle as any;
    const radius = pData.configSize ?? data.radius ?? 15;
    const opacity = data.opacity ?? 1;
    const ctx = context as unknown as CanvasRenderingContext2D;

    if (particle.destroyed) return;

    // Determine the type
    const type = (pData.realType || particle.shapeData?.type || "asteroid") as TravelerType;

    // Track history for trails and paths
    if (!pData.history) pData.history = [];

    // Lazy instantiation of the proper Entity OOP instance
    if (!pData.entity) {
      pData.entity = this.createEntity(type);
    }
    
    const entity = pData.entity as BaseEntity;

    // Initialize Kinematics (Path Engine)
    entity.initKinematics(particle, pData);

    // Update Physics via PathEngine
    if (pData.pathEngine) {
      pData.pathEngine.update(particle, pData);
    }

    // Track History
    if (pData.history.length > 0) {
      const last = pData.history[pData.history.length - 1];
      const sdx = particle.position.x - last.x;
      const sdy = particle.position.y - last.y;
      if (Math.abs(sdx) > 100 || Math.abs(sdy) > 100) {
        pData.history = []; // Clear if warped across screen
      }
    }

    pData.history.push({ x: particle.position.x, y: particle.position.y, time: Date.now() });
    if (pData.history.length > 600) pData.history.shift(); 

    // Draw visually
    ctx.save();
    entity.draw(ctx, radius, opacity, particle, pData);
    ctx.restore();
    
    // Clear path so tsParticles doesn't auto-fill background paths (like aura circles) with default color
    ctx.beginPath();
  }

  /**
   * Creates an instance of a specific entity based on the traveler type.
   * @param type - The type of traveler.
   * @returns A new BaseEntity instance corresponding to the given type.
   */
  private createEntity(type: TravelerType): BaseEntity {
    switch (type) {
      case "asteroid": return new Asteroid();
      case "meteor": return new Meteor();
      case "comet": return new Comet();
      case "boulder": return new Boulder();
      case "satellite": return new Satellite();
      case "ufo-1": return new Ufo1();
      case "ufo-2": return new Ufo2();
      case "invader": return new Invader();
      default: return new Asteroid();
    }
  }
}
