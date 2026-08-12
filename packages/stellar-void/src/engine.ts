/**
 * @fileoverview Initializes the tsparticles engine with required shapes and plugins.
 */

import { loadFull } from "tsparticles";
import { PlanetDrawer } from "@ajrojasfuentes/planets";
import { TravelerDrawer } from "@ajrojasfuentes/travelers";
import { preloadAllSprites } from "@ajrojasfuentes/core";
import type { Engine } from "@tsparticles/engine";

/**
 * Initializes the StellarVoid particle engine by loading standard features,
 * preloading embedded sprite assets, and registering custom shape drawers.
 * 
 * @param {Engine} engine - The tsparticles Engine instance to initialize.
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 */
export async function initStellarVoidEngine(engine: Engine): Promise<void> {
  // Preload all embedded sprite bitmaps for instant rendering
  await preloadAllSprites();
  
  // Load the standard shapes like circle, polygon, etc.
  await loadFull(engine);
  
  // Register our custom shapes
  engine.pluginManager.addShape(["planet"], async () => new PlanetDrawer());
  engine.pluginManager.addShape(["traveler"], async () => new TravelerDrawer());
}
