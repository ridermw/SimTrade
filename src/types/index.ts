// Domain types for SimTrade

export type OrderType = 'BUY' | 'SELL'

export type OrderStatus = 'PENDING' | 'FILLED' | 'REJECTED' | 'CANCELLED'

export interface Order {
  id: string
  type: OrderType
  symbol: string
  quantity: number
  price: number
  timestamp: number
  status: OrderStatus
  executedAt?: number
  executionPrice?: number
  rejectionReason?: string
}

export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
}

export interface Holdings {
  [symbol: string]: Position
}

export interface Portfolio {
  cash: number
  holdings: Holdings
  totalValue: number
}

export interface QuoteTick {
  symbol: string
  price: number
  timestamp: number
  change: number
  changePercent: number
}

export interface Ticker {
  symbol: string
  name: string
  initialPrice: number
  drift: number
  volatility: number
}
