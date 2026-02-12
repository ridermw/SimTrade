# Simulation Library

This directory contains the deterministic simulation engine for SimTrader.

## Overview

The simulation engine generates realistic price movements using geometric Brownian motion with configurable volatility levels. All simulations are deterministic and reproducible when using the same seed value.

## Core Components

### `seedRandom.ts`

Implements a seeded pseudo-random number generator using the Linear Congruential Generator (LCG) algorithm with Box-Muller transform for Gaussian distribution.

**Key features:**
- Deterministic random number generation
- Standard normal distribution support (N(0,1))
- Reset capability for replay scenarios

### `tickGenerator.ts`

Generates price ticks using geometric Brownian motion model.

**Formula:**
```
P(t+1) = P(t) * exp((μ - 0.5σ²)Δt + σ√Δt * ε)
```

Where:
- `P(t)` = price at time t
- `μ` = drift (expected return)
- `σ` = volatility (annualized)
- `Δt` = time interval (in years)
- `ε` = random variable from N(0,1)

**Key features:**
- Monotonic time progression
- Price bounds enforcement (always positive)
- Configurable volatility presets
- Reset and replay support

### `simulation.ts` (types)

TypeScript type definitions for the simulation engine.

## Volatility Presets

| Preset | Annualized Volatility | Drift | Use Case |
|--------|----------------------|-------|----------|
| `low` | 15% | 0.0 | Stable market conditions |
| `medium` | 30% | 0.0 | Normal market volatility |
| `high` | 50% | 0.0 | High volatility / crisis scenarios |

## Usage Example

```typescript
import { TickGenerator } from '@/lib';

// Create a generator with medium volatility
const generator = new TickGenerator({
  initialPrice: 100,
  volatilityPreset: 'medium',
  seed: 12345,
  tickIntervalMs: 1000,
  startTime: Date.now(),
});

// Generate next price tick
const tick = generator.nextTick();
console.log(`Price: $${tick.price.toFixed(2)}, Change: ${tick.changePercent.toFixed(2)}%`);

// Generate multiple ticks
const ticks = generator.generateTicks(10);

// Reset to replay the same sequence
generator.reset();
```

## Validation

Run the demo script to verify deterministic behavior:

```bash
npx tsx scripts/demo-simulation.ts
```

The demo validates:
1. ✓ Fixed-seed runs produce identical sequences
2. ✓ Monotonic time progression
3. ✓ Price bounds are maintained (always positive)
4. ✓ Volatility increases from low → medium → high
5. ✓ Reset produces identical sequences

## Testing

All simulation utilities should maintain ≥80% test coverage (per AGENTS.md guidelines).

Key test scenarios:
- Deterministic behavior (same seed = same output)
- Time progression is strictly monotonic
- Prices remain positive
- Volatility presets produce expected variance
- Reset functionality works correctly
