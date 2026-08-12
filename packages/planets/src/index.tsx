import React, { useMemo } from "react";
import Particles from "@tsparticles/react";
import { planetsConfig } from "./config";
import type { ISourceOptions } from "@tsparticles/engine";
import { useStellarVoidConfig, preloadAllSprites, useResponsiveScale } from "@ajrojasfuentes/core";
import type { RangeValue } from "@ajrojasfuentes/core";

/** Resolves a RangeValue to a concrete number */
function resolveRange(value: RangeValue | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value === 'number') return value;
  return Math.random() * (value.max - value.min) + value.min;
}

/** Generates scattered positions to prevent overlapping on spawn */
function generatePositions(count: number): {x: number, y: number}[] {
  const positions: {x: number, y: number}[] = [];
  const minDistance = 20; // Try to keep them at least 20% apart

  for (let i = 0; i < count; i++) {
    let bestPos = { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
    let bestDist = 0;

    // Best-candidate: test up to 20 random points and pick the one furthest from existing points
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
      if (positions.length === 0) {
        bestPos = candidate;
        break;
      }

      let closestDist = Infinity;
      for (const p of positions) {
        const dx = p.x - candidate.x;
        const dy = p.y - candidate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) closestDist = dist;
      }

      if (closestDist >= minDistance) {
        bestPos = candidate;
        break;
      }

      if (closestDist > bestDist) {
        bestDist = closestDist;
        bestPos = candidate;
      }
    }
    positions.push(bestPos);
  }
  return positions;
}

export function PlanetsLayer() {
  const config = useStellarVoidConfig();
  const scale = useResponsiveScale();
  
  // Preload sprites
  preloadAllSprites();

  const options = useMemo(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Generate scattered positions for this render
    const initialPositions = generatePositions(config.planets.length);
    
    // Generate emitters from the context config
    const dynamicEmitters = config.planets.map((planet, index) => ({
      direction: "none",
      rate: { quantity: 1, delay: 9999 },
      life: { count: 1, duration: 0.1, delay: 0 }, 
      position: initialPositions[index],
      size: { mode: "percent", width: 0, height: 0 },
      particles: {
        size: typeof planet.size === 'number' 
          ? { value: planet.size * scale }
          : { value: { min: planet.size.min * scale, max: planet.size.max * scale } },
        opacity: { value: planet.opacity },
        move: { speed: planet.speed },
        shape: {
          type: "planet",
          options: {
            planet: [{ type: planet.type, rotationSpeed: resolveRange(planet.rotationSpeed, 0) }]
          }
        }
      }
    }));

    if (isReducedMotion) {
      return {
        ...planetsConfig,
        fpsLimit: 15,
        particles: {
          ...planetsConfig.particles,
          move: {
            ...planetsConfig.particles?.move,
            enable: false,
          }
        },
        emitters: []
      } as ISourceOptions;
    }
    
    return {
      ...planetsConfig,
      fpsLimit: config.batterySaver ? 30 : planetsConfig.fpsLimit,
      emitters: dynamicEmitters
    } as ISourceOptions;
  }, [config.planets, config.batterySaver, scale]);

  return (
    <Particles
      id="tsparticles-planets"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

export { PlanetDrawer } from './shapes/planets';
