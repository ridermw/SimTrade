#!/usr/bin/env node
/**
 * Demo script to verify deterministic tick generation
 * This script demonstrates:
 * 1. Fixed-seed runs produce identical sequences
 * 2. Monotonic time progression
 * 3. Price bounds are maintained
 * 4. Different volatility presets produce different behaviors
 */

import { TickGenerator } from "../src/lib/tickGenerator";
import type { VolatilityPreset } from "../src/types/simulation";

// ANSI color codes for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

console.log("\n=== Deterministic Simulation Engine Demo ===\n");

// Test 1: Fixed seed produces identical sequences
console.log(`${colors.blue}Test 1: Deterministic Behavior${colors.reset}`);
console.log("Running two generators with same seed (12345)...\n");

const config1 = {
  initialPrice: 100,
  volatilityPreset: "medium" as VolatilityPreset,
  seed: 12345,
  tickIntervalMs: 1000,
  startTime: 1700000000000,
};

const gen1 = new TickGenerator(config1);
const gen2 = new TickGenerator(config1);

const ticks1 = gen1.generateTicks(5);
const ticks2 = gen2.generateTicks(5);

console.log("Generator 1 prices:", ticks1.map((t) => t.price.toFixed(4)));
console.log("Generator 2 prices:", ticks2.map((t) => t.price.toFixed(4)));

const identical = ticks1.every((tick, i) => tick.price === ticks2[i].price);
console.log(
  `${identical ? colors.green : colors.red}Result: ${identical ? "✓ PASS" : "✗ FAIL"} - Sequences are ${identical ? "identical" : "different"}${colors.reset}\n`
);

// Test 2: Monotonic time progression
console.log(`${colors.blue}Test 2: Monotonic Time Progression${colors.reset}`);
const gen3 = new TickGenerator({
  initialPrice: 100,
  volatilityPreset: "low" as VolatilityPreset,
  seed: 54321,
  tickIntervalMs: 1000,
  startTime: 1700000000000,
});

const ticks3 = gen3.generateTicks(10);
let monotonic = true;
for (let i = 1; i < ticks3.length; i++) {
  if (ticks3[i].timestamp <= ticks3[i - 1].timestamp) {
    monotonic = false;
    break;
  }
}

console.log("Timestamps:", ticks3.map((t) => t.timestamp).slice(0, 5), "...");
console.log(
  `${monotonic ? colors.green : colors.red}Result: ${monotonic ? "✓ PASS" : "✗ FAIL"} - Time progression is ${monotonic ? "monotonic" : "not monotonic"}${colors.reset}\n`
);

// Test 3: Price bounds (prices stay positive)
console.log(`${colors.blue}Test 3: Price Bounds${colors.reset}`);
const gen4 = new TickGenerator({
  initialPrice: 100,
  volatilityPreset: "high" as VolatilityPreset,
  seed: 99999,
  tickIntervalMs: 1000,
  startTime: 1700000000000,
});

const ticks4 = gen4.generateTicks(100);
const allPositive = ticks4.every((t) => t.price > 0);
const minPrice = Math.min(...ticks4.map((t) => t.price));
const maxPrice = Math.max(...ticks4.map((t) => t.price));

console.log(`Price range over 100 ticks: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);
console.log(
  `${allPositive ? colors.green : colors.red}Result: ${allPositive ? "✓ PASS" : "✗ FAIL"} - All prices are ${allPositive ? "positive" : "not positive"}${colors.reset}\n`
);

// Test 4: Different volatility presets
console.log(`${colors.blue}Test 4: Volatility Presets${colors.reset}`);
const presets: VolatilityPreset[] = ["low", "medium", "high"];
const results: Record<string, number> = {};

for (const preset of presets) {
  const gen = new TickGenerator({
    initialPrice: 100,
    volatilityPreset: preset,
    seed: 42,
    tickIntervalMs: 1000,
    startTime: 1700000000000,
  });

  const ticks = gen.generateTicks(50);
  const prices = ticks.map((t) => t.price);
  const avgChange =
    ticks.reduce((sum, t) => sum + Math.abs(t.changePercent), 0) / ticks.length;
  results[preset] = avgChange;
}

console.log("Average absolute % change per tick:");
console.log(`  Low:    ${results.low.toFixed(4)}%`);
console.log(`  Medium: ${results.medium.toFixed(4)}%`);
console.log(`  High:   ${results.high.toFixed(4)}%`);

const increasing =
  results.low < results.medium && results.medium < results.high;
console.log(
  `${increasing ? colors.green : colors.red}Result: ${increasing ? "✓ PASS" : "✗ FAIL"} - Volatility increases from low to high${colors.reset}\n`
);

// Test 5: Reset functionality
console.log(`${colors.blue}Test 5: Reset Functionality${colors.reset}`);
const gen5 = new TickGenerator({
  initialPrice: 100,
  volatilityPreset: "medium" as VolatilityPreset,
  seed: 11111,
  tickIntervalMs: 1000,
  startTime: 1700000000000,
});

const beforeReset = gen5.generateTicks(5).map((t) => t.price);
gen5.reset(); // Reset to same seed
const afterReset = gen5.generateTicks(5).map((t) => t.price);

const resetWorks = beforeReset.every((price, i) => price === afterReset[i]);
console.log("Prices before reset:", beforeReset.map((p) => p.toFixed(4)));
console.log("Prices after reset: ", afterReset.map((p) => p.toFixed(4)));
console.log(
  `${resetWorks ? colors.green : colors.red}Result: ${resetWorks ? "✓ PASS" : "✗ FAIL"} - Reset produces ${resetWorks ? "identical" : "different"} sequence${colors.reset}\n`
);

// Summary
const allPassed =
  identical && monotonic && allPositive && increasing && resetWorks;
console.log("=== Summary ===");
console.log(
  `${allPassed ? colors.green : colors.red}${allPassed ? "✓ All tests PASSED" : "✗ Some tests FAILED"}${colors.reset}\n`
);
