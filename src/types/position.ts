/**
 * Position represents a held quantity of shares for a specific symbol
 */
export interface Position {
  /** Trading symbol */
  symbol: string;
  /** Number of shares held */
  quantity: number;
  /** Average cost per share (for P&L calculation) */
  averageCost: number;
  /** Current market price per share */
  currentPrice: number;
  /** Total market value (quantity * currentPrice) */
  marketValue: number;
  /** Unrealized profit/loss (marketValue - quantity * averageCost) */
  unrealizedPnL: number;
  /** Unrealized profit/loss as percentage */
  unrealizedPnLPercent: number;
}
