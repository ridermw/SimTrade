"use client";

import type { Ticker } from "@/types/market";

interface MarketStripProps {
  tickers: Ticker[];
}

export default function MarketStrip({ tickers }: MarketStripProps) {
  return (
    <div className="w-full bg-gray-900 border-b border-gray-700">
      <div className="flex gap-6 px-6 py-4 overflow-x-auto">
        {tickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center gap-3 min-w-fit">
            <span className="font-mono font-bold text-white text-lg">
              {ticker.symbol}
            </span>
            <span className="font-mono text-white text-lg">
              ${ticker.price.toFixed(2)}
            </span>
            <span
              className={`font-mono text-sm ${
                ticker.changePercent >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {ticker.changePercent >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(ticker.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
