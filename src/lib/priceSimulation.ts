import type { Ticker } from "@/types/market";

const INITIAL_PRICES = {
  FYNX: 102.45,
  ZORD: 87.12,
  MERA: 134.67,
};

// Volatility factor for simulating price changes (0.2% per tick)
const VOLATILITY = 0.002;

export function generatePriceUpdate(ticker: Ticker): Ticker {
  const volatility = VOLATILITY;
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = ticker.price * (1 + randomChange);
  const change = newPrice - INITIAL_PRICES[ticker.symbol as keyof typeof INITIAL_PRICES];
  const changePercent = (change / INITIAL_PRICES[ticker.symbol as keyof typeof INITIAL_PRICES]) * 100;

  return {
    ...ticker,
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
  };
}

export function initializeTickers(): Ticker[] {
  return Object.entries(INITIAL_PRICES).map(([symbol, price]) => ({
    symbol,
    price,
    change: 0,
    changePercent: 0,
  }));
}
