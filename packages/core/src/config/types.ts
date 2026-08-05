/**
 * @fileoverview Defines all type definitions and configuration interfaces for the StellarVoid background module.
 * It includes types for constellations, planets, and traveler shapes.
 */

/**
 * Represents a single numeric value or a range between a minimum and maximum value.
 */
export type RangeValue = number | { min: number; max: number };

/**
 * Configuration for the constellation layer (stars and links).
 */
export interface ConstellationsConfig {
  /** The total number of stars in the background */
  starsCount: number;
  /** The size or range of sizes for the stars */
  starsSize: RangeValue;
  /** The opacity or range of opacities for the stars */
  starsOpacity: RangeValue;
  /** The base speed of the stars */
  starsSpeed: number;
  /** The maximum distance for links between stars */
  linksDistance: number;
  /** The opacity of the links between stars */
  linksOpacity: number;
  /** The width of the links between stars */
  linksWidth: number;
  /** Interactivity settings for the constellations */
  interactivity: {
    /** The distance at which stars are repulsed by the mouse */
    repulseDistance: number;
    /** The distance at which stars are grabbed by the mouse */
    grabDistance: number;
    /** The opacity of the line when a star is grabbed */
    grabOpacity: number;
  };
}

/**
 * The specific types of planets that can be rendered.
 */
export type PlanetType = "geoid" | "saturnian" | "gaseous" | "iceous" | "lunar" | "binary" | "orbital";

/**
 * Configuration for an individual planet instance.
 */
export interface PlanetInstanceConfig {
  /** A unique identifier for the planet */
  id: string;
  /** The type of the planet to render */
  type: PlanetType;
  /** The size or range of sizes for the planet */
  size: RangeValue;
  /** The opacity or range of opacities for the planet */
  opacity: RangeValue;
  /** The speed or range of speeds for the planet */
  speed: RangeValue;
}

/**
 * The specific types of traveler shapes that can be rendered.
 */
export type TravelerShapeType = "asteroid" | "meteor" | "comet" | "boulder" | "satellite" | "ufo-1" | "invader" | "ufo-2";

/**
 * Configuration for an individual traveler shape.
 */
export interface TravelerShapeConfig {
  /** The type of traveler shape */
  type: TravelerShapeType;
  /** The size or range of sizes for the traveler */
  size: RangeValue;
  /** The multiplier to apply to the base speed */
  speedMultiplier: RangeValue;
  /** Optional rotation speed for specific shapes like orbitals */
  rotationSpeed?: RangeValue;
}

/**
 * Configuration for the travelers layer (asteroids, UFOs, etc.).
 */
export interface TravelersConfig {
  /** Minimum time interval between traveler spawns (in milliseconds) */
  spawnIntervalMin: number;
  /** Maximum time interval between traveler spawns (in milliseconds) */
  spawnIntervalMax: number;
  /** Probabilities for different traveler rarities */
  probabilities: {
    /** Probability of a common traveler spawning (e.g., 0.70) */
    common: number;
    /** Probability of an uncommon traveler spawning (e.g., 0.20) */
    uncommon: number;
    /** Probability of a rare traveler spawning (e.g., 0.10) */
    rare: number;
  };
  /** Definitions for each available traveler shape */
  shapes: Record<TravelerShapeType, TravelerShapeConfig>;
}

/**
 * The complete theme configuration for the entire StellarVoid component.
 */
export interface StellarVoidThemeConfig {
  /** Constellation layer configuration */
  constellations: ConstellationsConfig;
  /** Planet layer configuration */
  planets: PlanetInstanceConfig[];
  /** Travelers layer configuration */
  travelers: TravelersConfig;
  /** Base path for all loaded sprite assets. Defaults to '/sprites' */
  assetBasePath?: string;
}
