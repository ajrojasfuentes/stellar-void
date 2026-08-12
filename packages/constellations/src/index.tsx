/**
 * @fileoverview The React component that renders the interactive constellation layer.
 */

import React, { useMemo } from "react";
import Particles from "@tsparticles/react";
import { starsConfig } from "./config";
import type { ISourceOptions } from "@tsparticles/engine";
import { useStellarVoidConfig } from "@ajrojasfuentes/core";

/**
 * Renders the constellation particle layer using settings from the context configuration.
 * Also handles reduced motion preferences automatically.
 *
 * @returns {JSX.Element} The Constellations layer component.
 */
export function ConstellationsLayer() {
  const config = useStellarVoidConfig();

  const options = useMemo(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = starsConfig as any;
    const c = config.constellations;
    
    // Deep clone and merge config
    const mergedConfig = {
      ...s,
      fpsLimit: config.batterySaver ? 30 : s.fpsLimit,
      interactivity: {
        ...s.interactivity,
        modes: {
          ...s.interactivity?.modes,
          repulse: {
            ...s.interactivity?.modes?.repulse,
            distance: c.interactivity.repulseDistance,
          },
          grab: {
            ...s.interactivity?.modes?.grab,
            distance: c.interactivity.grabDistance,
            links: {
              ...s.interactivity?.modes?.grab?.links,
              opacity: c.interactivity.grabOpacity,
              width: c.linksWidth
            }
          }
        }
      },
      particles: {
        ...s.particles,
        number: {
          ...s.particles?.number,
          value: c.starsCount,
        },
        size: {
          ...s.particles?.size,
          value: c.starsSize,
        },
        opacity: {
          ...s.particles?.opacity,
          value: c.starsOpacity,
        },
        links: {
          ...s.particles?.links,
          distance: c.linksDistance,
          opacity: c.linksOpacity,
          width: c.linksWidth
        },
        move: {
          ...s.particles?.move,
          speed: c.starsSpeed
        }
      }
    } as any;

    if (isReducedMotion) {
      return {
        ...mergedConfig,
        fpsLimit: 15,
        particles: {
          ...mergedConfig.particles,
          move: {
            ...mergedConfig.particles?.move,
            enable: false,
          }
        },
        interactivity: {
          ...mergedConfig.interactivity,
          events: {
            onHover: { enable: false },
            onClick: { enable: false }
          }
        },
      } as ISourceOptions;
    }
    
    return mergedConfig;
  }, [config.constellations]);

  return (
    <Particles
      id="tsparticles-stars"
      options={options}
      className="absolute inset-0 z-10 pointer-events-auto"
    />
  );
}
