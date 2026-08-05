/**
 * @fileoverview Initializes the tsparticles engine with required shapes and plugins.
 */

import { loadFull } from "tsparticles";
import { PlanetDrawer } from "@ajrojasfuentes/planets";
import { TravelerDrawer } from "@ajrojasfuentes/travelers";
import type { Engine } from "@tsparticles/engine";

/**
 * Initializes the StellarVoid particle engine by loading standard features and custom shape drawers.
 * 
 * @param {Engine} engine - The tsparticles Engine instance to initialize.
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 */
import { DEFAULT_CDN_PATH } from "@ajrojasfuentes/core";

export async function initStellarVoidEngine(engine: Engine, assetBasePath: string = DEFAULT_CDN_PATH): Promise<void> {
  // We need to load the standard shapes like circle, polygon, etc if needed by particles
  await loadFull(engine);
  
  // Register our custom shapes
  engine.pluginManager.addShape(["planet"], async () => new PlanetDrawer());
  engine.pluginManager.addShape(["traveler"], async () => new TravelerDrawer(assetBasePath));
}
