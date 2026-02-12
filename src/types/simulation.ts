/**
 * Volatility preset configurations for price simulation
 */
export type VolatilityPreset = "low" | "medium" | "high";

/**
 * Configuration for volatility levels
 */
export interface VolatilityConfig {
  volatility: number; // σ (sigma) - annualized volatility
  drift: number; // μ (mu) - expected return
}

/**
 * Volatility preset mappings
 */
export const VOLATILITY_PRESETS: Record<VolatilityPreset, VolatilityConfig> = {
  low: {
    volatility: 0.15, // 15% annualized volatility
    drift: 0.0,
  },
  medium: {
    volatility: 0.30, // 30% annualized volatility
    drift: 0.0,
  },
  high: {
    volatility: 0.50, // 50% annualized volatility
    drift: 0.0,
  },
};

/**
 * A single price tick in the simulation
 */
export interface PriceTick {
  timestamp: number; // Unix timestamp in milliseconds
  price: number; // Current price
  change: number; // Price change from previous tick
  changePercent: number; // Percentage change from previous tick
}

/**
 * Configuration for the tick generator
 */
export interface TickGeneratorConfig {
  initialPrice: number;
  volatilityPreset: VolatilityPreset;
  seed: number;
  tickIntervalMs: number; // Time between ticks in milliseconds
  startTime?: number; // Optional start time (defaults to Date.now())
}
