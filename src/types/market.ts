export interface Ticker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export type SessionState = "active" | "ended";
