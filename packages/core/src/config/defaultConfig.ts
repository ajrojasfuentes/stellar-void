/**
 * @fileoverview Provides the default configuration object for the StellarVoid component.
 */

import type { StellarVoidThemeConfig } from "./types";

/**
 * The default theme configuration for the StellarVoid background, specifying parameters for
 * constellations, planets, and traveler entities.
 */
export const defaultStellarVoidConfig: StellarVoidThemeConfig = {
  constellations: {
    starsCount: 150,
    starsSize: { min: 0.5, max: 2 },
    starsOpacity: { min: 0.3, max: 0.8 },
    starsSpeed: 0.1,
    linksDistance: 85,
    linksOpacity: 0.25,
    linksWidth: 0.5,
    interactivity: {
      repulseDistance: 130,
      grabDistance: 110,
      grabOpacity: 0.20,
    }
  },
  planets: [
    { id: "geoid-1", type: "geoid", size: 35, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } },
    { id: "saturnian-1", type: "saturnian", size: 45, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } },
    { id: "gaseous-1", type: "gaseous", size: 60, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } },
    { id: "iceous-1", type: "iceous", size: 45, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } },
    { id: "lunar-1", type: "lunar", size: { min: 30, max: 35 }, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } },
    { id: "orbital-1", type: "orbital", size: { min: 35, max: 40 }, opacity: { min: 0.6, max: 0.9 }, speed: { min: 0.1, max: 0.4 } }
  ],
  travelers: {
    spawnIntervalMin: 45000,
    spawnIntervalMax: 120000,
    probabilities: {
      common: 0.70,
      uncommon: 0.20,
      rare: 0.10
    },
    shapes: {
      "asteroid": { type: "asteroid", size: { min: 12, max: 15 }, speedMultiplier: 1.5 },
      "meteor": { type: "meteor", size: { min: 12, max: 15 }, speedMultiplier: 1.5 },
      "comet": { type: "comet", size: { min: 12, max: 15 }, speedMultiplier: 1.5 },
      "boulder": { type: "boulder", size: { min: 20, max: 25 }, speedMultiplier: 0.25, rotationSpeed: { min: 0.005, max: 0.02 } },
      "satellite": { type: "satellite", size: { min: 20, max: 25 }, speedMultiplier: 0.25, rotationSpeed: { min: 0.005, max: 0.02 } },
      "ufo-1": { type: "ufo-1", size: 22, speedMultiplier: 1 },
      "ufo-2": { type: "ufo-2", size: 25, speedMultiplier: 1 },
      "invader": { type: "invader", size: 20, speedMultiplier: 1 }
    }
  },
  batterySaver: false
};
