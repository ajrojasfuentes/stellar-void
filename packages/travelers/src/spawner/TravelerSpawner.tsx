/**
 * @file TravelerSpawner.tsx
 * @description Component responsible for spawning traveler entities (asteroids, UFOs, etc.) at random intervals and locations around the screen perimeter.
 */
import React, { useEffect, useRef } from 'react';
import type { Container } from '@tsparticles/engine';
import type { TravelerShapeType as TravelerType } from '@ajrojasfuentes/core';
import { useStellarVoidConfig } from '@ajrojasfuentes/core';

/**
 * Props for the TravelerSpawner component.
 */
export interface TravelerSpawnerProps {
  /** The tsParticles container instance. */
  container: Container | null;
  /** Offset for spawning particles outside the visible area. */
  offset?: number;
}

/**
 * Component that continuously spawns traveler entities based on the configuration.
 * Also handles garbage collection for entities that move out of bounds.
 * 
 * @param props - The component props.
 * @returns Returns null as this is a logical component without UI.
 */
export function TravelerSpawner({ 
  container, 
  offset = 100 
}: TravelerSpawnerProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frameRef = useRef<number | undefined>(undefined);
  const isMounted = useRef(true);
  const config = useStellarVoidConfig();

  useEffect(() => {
    isMounted.current = true;
    if (!container) return;

    const { spawnIntervalMin, spawnIntervalMax, probabilities } = config.travelers;

    // --- GARBAGE COLLECTOR (Despawn) ---
    const checkOutOfBounds = () => {
      if (!isMounted.current) return;
      
      try {
        const width = container.canvas?.size?.width ?? 1920;
        const height = container.canvas?.size?.height ?? 1080;
        const despawnLimit = offset + 150; // Extra margin to prevent immediate despawn
        // Get the active particles safely using the filter method
        const particlesArray = container.particles.filter(() => true) || [];
        for (let i = particlesArray.length - 1; i >= 0; i--) {
          const p = particlesArray[i];
          if (p && !p.destroyed && p.position) {
            const x = p.position.x;
            const y = p.position.y;
            if (
              x < -despawnLimit ||
              x > width + despawnLimit ||
              y < -despawnLimit ||
              y > height + despawnLimit
            ) {
              p.destroy();
            }
          }
        }
      } catch (e) {
        console.error("Error in TravelerSpawner garbage collector:", e);
      }

      frameRef.current = requestAnimationFrame(checkOutOfBounds);
    };

    frameRef.current = requestAnimationFrame(checkOutOfBounds);

    // --- SPAWNER LOGIC ---
    const scheduleNextSpawn = () => {
      if (!isMounted.current) return;
      const delay = Math.random() * (spawnIntervalMax - spawnIntervalMin) + spawnIntervalMin;
      timeoutRef.current = setTimeout(spawnTraveler, delay);
    };

    const spawnTraveler = () => {
      if (!isMounted.current || !container) return;

      try {
        // Safe check for canvas dimensions to prevent physics engine crash
        const w = container.canvas?.size?.width || 0;
        const h = container.canvas?.size?.height || 0;
        
        // If canvas is not fully initialized yet, retry in 1 second
        if (w === 0 || h === 0) {
          timeoutRef.current = setTimeout(spawnTraveler, 1000);
          return;
        }

        // 1. Type selection (True Randomizer with new probabilities)
        const roll = Math.random();
        let realType: TravelerType;
        
        if (roll < probabilities.common) {
          const commons: TravelerType[] = ["asteroid", "meteor", "comet"];
          realType = commons[Math.floor(Math.random() * commons.length)];
        } else if (roll < probabilities.common + probabilities.uncommon) {
          const uncommons: TravelerType[] = ["boulder", "satellite"];
          realType = uncommons[Math.floor(Math.random() * uncommons.length)];
        } else {
          const rares: TravelerType[] = ["ufo-1", "ufo-2", "invader"];
          realType = rares[Math.floor(Math.random() * rares.length)];
        }

        // 2. Random initial coordinates (Entire perimeter)
        // Reduce the offset internally so they enter the screen faster
        const spawnOffset = offset; 
        const perimeter = 2 * w + 2 * h;
        const r = Math.random() * perimeter;
        
        let spawnX = 0;
        let spawnY = 0;
        
        if (r < w) { // Top edge
          spawnX = r;
          spawnY = -spawnOffset;
        } else if (r < w + h) { // Right edge
          spawnX = w + spawnOffset;
          spawnY = r - w;
        } else if (r < 2 * w + h) { // Bottom edge
          spawnX = r - (w + h);
          spawnY = h + spawnOffset;
        } else { // Left edge
          spawnX = -spawnOffset;
          spawnY = r - (2 * w + h);
        }

        // 3. Inject particle and configuration
        const shapeConfig = config.travelers.shapes[realType];
        
        const configSize = typeof shapeConfig.size === 'number' 
          ? shapeConfig.size 
          : Math.random() * (shapeConfig.size.max - shapeConfig.size.min) + shapeConfig.size.min;
            
        const p = container.particles.addParticle({
          x: spawnX,
          y: spawnY
        });

        if (p) {
          const pData = p as any;
          pData.realType = realType;
          p.position.x = spawnX;
          p.position.y = spawnY;
          
          // Config values
          pData.configSize = configSize;
            
          pData.configSpeedMultiplier = typeof shapeConfig.speedMultiplier === 'number' 
            ? shapeConfig.speedMultiplier 
            : Math.random() * (shapeConfig.speedMultiplier.max - shapeConfig.speedMultiplier.min) + shapeConfig.speedMultiplier.min;

          if (shapeConfig.rotationSpeed !== undefined) {
            pData.configRotationSpeed = typeof shapeConfig.rotationSpeed === 'number'
              ? shapeConfig.rotationSpeed
              : Math.random() * (shapeConfig.rotationSpeed.max - shapeConfig.rotationSpeed.min) + shapeConfig.rotationSpeed.min;
          }
          
          // Point towards the exact opposite side of the screen
          const oppositeX = w - Math.max(0, Math.min(w, spawnX));
          const oppositeY = h - Math.max(0, Math.min(h, spawnY));
          
          let angle = Math.atan2(oppositeY - spawnY, oppositeX - spawnX);
          
          // Add a random variation of +/- 10 degrees
          const variation = (Math.random() - 0.5) * 2 * (10 * Math.PI / 180);
          angle += variation;
          
          const speed = Math.random() * 1.5 + 1.0; 
          
          p.velocity.x = Math.cos(angle) * speed;
          p.velocity.y = Math.sin(angle) * speed;
        }
      } catch (e) {
        console.error("Error spawning traveler:", e);
      }

      // 4. Schedule the next spawn
      scheduleNextSpawn();
    };

    // Delay initial spawn slightly to ensure engine is fully ready and DOM is painted
    timeoutRef.current = setTimeout(spawnTraveler, 1500);

    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [container, offset, config.travelers]);

  return null;
}
