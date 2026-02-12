/**
 * QuoteTick represents a single price update for a security at a specific time
 */
export interface QuoteTick {
  /** Trading symbol */
  symbol: string;
  /** Current price */
  price: number;
  /** Timestamp of this quote (milliseconds since epoch) */
  timestamp: number;
  /** Change from previous tick */
  change: number;
  /** Percentage change from previous tick */
  changePercent: number;
  /** Bid price (for display purposes) */
  bid?: number;
  /** Ask price (for display purposes) */
  ask?: number;
  /** Volume at this tick (optional for simulation) */
  volume?: number;
}
