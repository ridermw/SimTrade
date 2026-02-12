"use client";

import { useState, useEffect } from "react";
import MarketStrip from "@/components/MarketStrip";
import SessionTimer from "@/components/SessionTimer";
import { initializeTickers, generatePriceUpdate } from "@/lib/priceSimulation";
import type { Ticker, SessionState } from "@/types/market";

const SESSION_DURATION = 60;
const PRICE_UPDATE_INTERVAL = 500;

export default function Home() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(SESSION_DURATION);
  const [sessionState, setSessionState] = useState<SessionState>("active");

  useEffect(() => {
    setTickers(initializeTickers());
  }, []);

  useEffect(() => {
    if (sessionState !== "active") return;

    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setSessionState("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [sessionState]);

  useEffect(() => {
    if (sessionState !== "active") return;

    const priceInterval = setInterval(() => {
      setTickers((prevTickers) =>
        prevTickers.map((ticker) => generatePriceUpdate(ticker))
      );
    }, PRICE_UPDATE_INTERVAL);

    return () => clearInterval(priceInterval);
  }, [sessionState]);

  return (
    <div className="min-h-screen bg-gray-950">
      <SessionTimer secondsRemaining={secondsRemaining} />
      <MarketStrip tickers={tickers} />

      <main className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">SimTrader</h1>
          <p className="text-gray-400 text-lg mb-8">
            {sessionState === "active"
              ? "Watch the markets update in real-time"
              : "Session Ended - Market Closed"}
          </p>
          {sessionState === "ended" && (
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">
                Trading Session Complete
              </h2>
              <p className="text-gray-300">
                The 60-second trading session has ended.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
