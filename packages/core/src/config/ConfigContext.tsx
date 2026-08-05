/**
 * @fileoverview Context provider and hooks for managing the StellarVoid configuration.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { StellarVoidThemeConfig } from './types';
import { defaultStellarVoidConfig } from './defaultConfig';

/**
 * Context holding the active StellarVoid theme configuration.
 */
const ConfigContext = createContext<StellarVoidThemeConfig>(defaultStellarVoidConfig);

/**
 * Helper function to deeply merge partial configuration overrides into a base configuration.
 *
 * @param {any} base - The original configuration object.
 * @param {any} override - The configuration overrides to apply.
 * @returns {any} The newly merged configuration.
 */
function mergeConfig(base: any, override: any): any {
  if (override === undefined) return base;
  if (override === null) return override;
  if (Array.isArray(base) && Array.isArray(override)) return override; // Arrays are replaced, not merged
  if (typeof base !== 'object' || typeof override !== 'object' || base === null) return override;
  
  const result = { ...base };
  for (const key in override) {
    if (Object.prototype.hasOwnProperty.call(override, key)) {
      result[key] = mergeConfig(base[key], override[key]);
    }
  }
  return result;
}

/**
 * Properties for the StellarVoidConfigProvider component.
 */
interface ConfigProviderProps {
  /** Optional partial configuration overrides */
  config?: Partial<StellarVoidThemeConfig>;
  /** Child elements to be rendered within the provider */
  children: React.ReactNode;
}

/**
 * A React provider component that merges and supplies the StellarVoid configuration to its children.
 *
 * @param {ConfigProviderProps} props - The component properties.
 * @returns {JSX.Element} The provider wrapping its children.
 */
export function StellarVoidConfigProvider({ config, children }: ConfigProviderProps) {
  const mergedConfig = useMemo(() => {
    return mergeConfig(defaultStellarVoidConfig, config) as StellarVoidThemeConfig;
  }, [config]);

  return (
    <ConfigContext.Provider value={mergedConfig}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Custom hook to access the current StellarVoid configuration from context.
 *
 * @returns {StellarVoidThemeConfig} The active theme configuration.
 */
export function useStellarVoidConfig() {
  return useContext(ConfigContext);
}
