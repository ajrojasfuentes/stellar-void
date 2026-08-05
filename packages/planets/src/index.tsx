import React, { useMemo } from "react";
import Particles from "@tsparticles/react";
import { planetsConfig } from "./config";
import type { ISourceOptions } from "@tsparticles/engine";
import { useStellarVoidConfig } from "@ajrojasfuentes/core";
import { preloadPlanets } from "./shapes/planets";

export function PlanetsLayer() {
  const config = useStellarVoidConfig();
  
  // Preload sprites
  preloadPlanets(config.assetBasePath);

  const options = useMemo(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Generate emitters from the context config
    const dynamicEmitters = config.planets.map((planet) => ({
      direction: "none",
      rate: { quantity: 1, delay: 9999 }, // Single spawn
      life: { count: 1, duration: 0.1, delay: 0 }, 
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      size: { mode: "percent", width: 0, height: 0 },
      particles: {
        size: { value: planet.size },
        opacity: { value: planet.opacity },
        move: { speed: planet.speed },
        shape: {
          type: "planet",
          options: {
            planet: [{ type: planet.type }]
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
      emitters: dynamicEmitters
    } as ISourceOptions;
  }, [config.planets]);

  return (
    <Particles
      id="tsparticles-planets"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

export { PlanetDrawer } from './shapes/planets';
