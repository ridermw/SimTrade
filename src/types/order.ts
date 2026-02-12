/**
 * OrderType specifies the intent of the order
 */
export type OrderType = "BUY" | "SELL";

/**
 * OrderStatus tracks the execution state of an order
 */
export type OrderStatus = "PENDING" | "FILLED" | "REJECTED" | "CANCELLED";

/**
 * Order represents a buy or sell request with execution state
 */
export interface Order {
  /** Unique order identifier */
  id: string;
  /** Trading symbol */
  symbol: string;
  /** Order type: buy or sell */
  type: OrderType;
  /** Number of shares */
  quantity: number;
  /** Requested price per share */
  price: number;
  /** Current execution status */
  status: OrderStatus;
  /** Timestamp when order was created (milliseconds since epoch) */
  createdAt: number;
  /** Timestamp when order was filled/rejected/cancelled (optional) */
  executedAt?: number;
  /** Actual execution price (may differ from requested price) */
  executionPrice?: number;
  /** Reason for rejection (if status is REJECTED) */
  rejectionReason?: string;
}
