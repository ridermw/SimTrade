import {
  PriceTick,
  TickGeneratorConfig,
  VOLATILITY_PRESETS,
} from "@/types/simulation";
import { SeededRandom } from "./seedRandom";

/**
 * Deterministic tick generator for price simulation.
 * Uses geometric Brownian motion to generate realistic price movements.
 *
 * Price model: P(t+1) = P(t) * exp((μ - 0.5σ²)Δt + σ√Δt * ε)
 * where:
 *   μ = drift (expected return)
 *   σ = volatility
 *   ε = random variable ~ N(0,1)
 *   Δt = time interval
 */
export class TickGenerator {
  private config: TickGeneratorConfig;
  private rng: SeededRandom;
  private currentPrice: number;
  private previousPrice: number;
  private currentTime: number;
  private tickCount: number;

  /**
   * Create a new deterministic tick generator
   * @param config - Configuration for the generator
   */
  constructor(config: TickGeneratorConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);
    this.currentPrice = config.initialPrice;
    this.previousPrice = config.initialPrice;
    this.currentTime = config.startTime ?? Date.now();
    this.tickCount = 0;
  }

  /**
   * Generate the next price tick
   * @returns PriceTick object with timestamp, price, and change information
   */
  nextTick(): PriceTick {
    // Get volatility configuration
    const volatilityConfig = VOLATILITY_PRESETS[this.config.volatilityPreset];
    const { volatility, drift } = volatilityConfig;

    // Calculate time interval in years (for annualized volatility)
    // 252 trading days * 6.5 hours * 60 minutes * 60 seconds * 1000 ms
    const millisecondsPerYear = 252 * 6.5 * 60 * 60 * 1000;
    const deltaT = this.config.tickIntervalMs / millisecondsPerYear;

    // Generate random component from standard normal distribution
    const epsilon = this.rng.nextGaussian();

    // Calculate price change using geometric Brownian motion
    // P(t+1) = P(t) * exp((μ - 0.5σ²)Δt + σ√Δt * ε)
    const driftComponent = (drift - 0.5 * volatility * volatility) * deltaT;
    const randomComponent = volatility * Math.sqrt(deltaT) * epsilon;
    const priceMultiplier = Math.exp(driftComponent + randomComponent);

    // Update price
    this.previousPrice = this.currentPrice;
    this.currentPrice = this.currentPrice * priceMultiplier;

    // Ensure price stays positive and reasonable
    this.currentPrice = Math.max(0.01, this.currentPrice);

    // Calculate change metrics
    const change = this.currentPrice - this.previousPrice;
    const changePercent =
      this.previousPrice > 0 ? (change / this.previousPrice) * 100 : 0;

    // Advance time (monotonic progression)
    this.currentTime += this.config.tickIntervalMs;
    this.tickCount++;

    return {
      timestamp: this.currentTime,
      price: this.currentPrice,
      change,
      changePercent,
    };
  }

  /**
   * Generate multiple ticks
   * @param count - Number of ticks to generate
   * @returns Array of PriceTick objects
   */
  generateTicks(count: number): PriceTick[] {
    const ticks: PriceTick[] = [];
    for (let i = 0; i < count; i++) {
      ticks.push(this.nextTick());
    }
    return ticks;
  }

  /**
   * Get the current state of the generator
   */
  getState() {
    return {
      currentPrice: this.currentPrice,
      currentTime: this.currentTime,
      tickCount: this.tickCount,
    };
  }

  /**
   * Reset the generator to initial conditions with optional new seed
   * @param newSeed - Optional new seed (uses original seed if not provided)
   */
  reset(newSeed?: number): void {
    const seed = newSeed ?? this.config.seed;
    this.rng.reset(seed);
    this.currentPrice = this.config.initialPrice;
    this.previousPrice = this.config.initialPrice;
    this.currentTime = this.config.startTime ?? Date.now();
    this.tickCount = 0;
    if (newSeed !== undefined) {
      this.config.seed = newSeed;
    }
  }
}
