/**
 * Seeded pseudo-random number generator using Linear Congruential Generator (LCG)
 * This provides deterministic random number generation for reproducible simulations.
 *
 * Based on the Numerical Recipes LCG parameters:
 * a = 1664525, c = 1013904223, m = 2^32
 */
export class SeededRandom {
  private seed: number;
  private readonly a = 1664525;
  private readonly c = 1013904223;
  private readonly m = Math.pow(2, 32);

  /**
   * Create a new seeded random number generator
   * @param seed - Initial seed value (integer)
   */
  constructor(seed: number) {
    this.seed = Math.abs(Math.floor(seed)) % this.m;
  }

  /**
   * Generate next random number between 0 and 1
   * @returns Random number in range [0, 1)
   */
  next(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  }

  /**
   * Generate a random number from standard normal distribution (mean=0, std=1)
   * Uses Box-Muller transform
   * @returns Random number from N(0,1)
   */
  nextGaussian(): number {
    let u1 = this.next();
    const u2 = this.next();

    // Ensure u1 > 0 to avoid log(0) which produces -Infinity
    while (u1 <= 1e-10) {
      u1 = this.next();
    }

    // Box-Muller transform
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0;
  }

  /**
   * Reset the generator to a new seed
   * @param seed - New seed value
   */
  reset(seed: number): void {
    this.seed = Math.abs(Math.floor(seed)) % this.m;
  }
}
