/**
 * Ticker represents a tradable security with associated metadata
 */
export interface Ticker {
  /** Unique trading symbol (e.g., "FYNX", "ZORD") */
  symbol: string;
  /** Full company name */
  name: string;
  /** Industry or sector classification */
  sector: string;
  /** Initial price at market open */
  initialPrice: number;
  /** Expected annual return (drift) for price simulation */
  drift: number;
  /** Annual volatility (standard deviation) for price simulation */
  volatility: number;
}
