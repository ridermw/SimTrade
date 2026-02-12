import { Position } from "./position";

/**
 * Portfolio represents the complete account state including cash and positions
 */
export interface Portfolio {
  /** Current cash balance available for trading */
  cash: number;
  /** Initial cash at start of session */
  initialCash: number;
  /** All current positions indexed by symbol */
  positions: Record<string, Position>;
  /** Total market value of all positions */
  positionsValue: number;
  /** Total portfolio value (cash + positions) */
  totalValue: number;
  /** Total profit/loss since start (totalValue - initialCash) */
  totalPnL: number;
  /** Total profit/loss as percentage */
  totalPnLPercent: number;
  /** Timestamp of last update (milliseconds since epoch) */
  lastUpdated: number;
}
