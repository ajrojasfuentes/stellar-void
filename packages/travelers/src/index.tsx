import React, { useMemo, useState, useCallback } from "react";
import Particles from "@tsparticles/react";
import { travelersConfig } from "./config";
import { TravelerSpawner } from "./spawner/TravelerSpawner";
import { useStellarVoidConfig } from "@ajrojasfuentes/core";
import type { ISourceOptions, Container } from "@tsparticles/engine";

export function TravelersLayer() {
  const [travelersContainer, setTravelersContainer] = useState<Container | null>(null);
  const config = useStellarVoidConfig();

  const options = useMemo(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      return {
        ...travelersConfig,
        fpsLimit: 15,
        particles: {
          ...travelersConfig.particles,
          move: {
            ...travelersConfig.particles?.move,
            enable: false,
          }
        },
      } as ISourceOptions;
    }
    return {
      ...travelersConfig,
      fpsLimit: config.batterySaver ? 30 : travelersConfig.fpsLimit
    } as ISourceOptions;
  }, [config.batterySaver]);

  const handleParticlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      setTravelersContainer(container);
    }
  }, []);

  return (
    <>
      <Particles
        id="tsparticles-travelers"
        options={options}
        className="absolute inset-0 z-20 pointer-events-none"
        particlesLoaded={handleParticlesLoaded}
      />
      <TravelerSpawner 
        container={travelersContainer} 
        offset={100} 
      />
    </>
  );
}

export { TravelerDrawer } from './shapes';
