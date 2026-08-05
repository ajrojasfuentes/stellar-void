/**
 * @fileoverview Default configuration for the constellation particles layer.
 */

import type { ISourceOptions } from "@tsparticles/engine";

/**
 * The base configuration for the tsparticles engine used in the constellations layer.
 * Defines the appearance, movement, and interactivity of stars and links.
 */
export const starsConfig: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  detectRetina: true,
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: ["repulse", "grab"],
      },
      onClick: {
        enable: false,
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      repulse: {
        distance: 130,
        duration: 1.5,
        factor: 0.6,
        speed: 0.3,
      },
      grab: {
        distance: 130,
        links: {
          opacity: 0.2,
          color: "#ffffff",
          width: 0.5
        }
      },
    },
  },
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        width: 1920,
        height: 1080,
      },
    },
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 85,
      enable: true,
      opacity: 0.25,
      width: 0.5,
    },
    move: {
      enable: true,
      speed: 0.1,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "out",
      },
    },
    size: {
      value: { min: 0.5, max: 2 },
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
    },
  }
};
