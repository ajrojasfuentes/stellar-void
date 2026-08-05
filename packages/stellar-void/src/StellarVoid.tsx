import React, { useCallback, useMemo } from "react";
import { ParticlesProvider } from "@tsparticles/react";
import { StellarVoidConfigProvider, StellarVoidThemeConfig } from "@ajrojasfuentes/core";
import { initStellarVoidEngine } from "./engine";

// Import modular layers
import { BackLayer } from "@ajrojasfuentes/background";
import { ConstellationsLayer } from "@ajrojasfuentes/constellations";
import { PlanetsLayer } from "@ajrojasfuentes/planets";
import { TravelersLayer } from "@ajrojasfuentes/travelers";

export interface StellarVoidProps {
  className?: string;
  enableNebulae?: boolean;
  config?: Partial<StellarVoidThemeConfig>;
  assetBasePath?: string;
  children?: React.ReactNode;
}

/**
 * StellarVoid Provider & Facade component.
 */
export function StellarVoid({ className, enableNebulae = true, assetBasePath, config, children }: StellarVoidProps) {
  const configOverrides = useMemo(() => {
    return assetBasePath ? { ...config, assetBasePath } : config;
  }, [config, assetBasePath]);

  const initEngine = useCallback(async (engine: any) => {
    return initStellarVoidEngine(engine, configOverrides?.assetBasePath);
  }, [configOverrides?.assetBasePath]);

  // Facade pattern: if no children provided, render default layers
  const hasChildren = React.Children.count(children) > 0;

  return (
    <StellarVoidConfigProvider config={configOverrides}>
      <div className={`fixed inset-0 w-full h-full bg-[#030014] overflow-hidden z-0 ${className || ""}`}>
        {hasChildren ? (
          <ParticlesProvider init={initEngine}>
            {children}
          </ParticlesProvider>
        ) : (
          <>
            {/* Default Facade Behavior */}
            <BackLayer enableNebulae={enableNebulae} />
            <ParticlesProvider init={initEngine}>
              <PlanetsLayer />
              <ConstellationsLayer />
              <TravelersLayer />
            </ParticlesProvider>
          </>
        )}
      </div>
    </StellarVoidConfigProvider>
  );
}

// Compound Components exposure
StellarVoid.Background = BackLayer;
StellarVoid.Constellations = ConstellationsLayer;
StellarVoid.Planets = PlanetsLayer;
StellarVoid.Travelers = TravelersLayer;
