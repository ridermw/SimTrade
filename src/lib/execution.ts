import { Order, Portfolio, Holdings, Position } from '../types'
import { validateBuyOrder, validateSellOrder } from './validators'

export type ExecutionAction =
  | {
      type: 'EXECUTE_ORDER'
      order: Omit<Order, 'id' | 'timestamp' | 'status'>
    }
  | {
      type: 'UPDATE_PRICES'
      prices: { [symbol: string]: number }
    }

export interface ExecutionState {
  portfolio: Portfolio
  orders: Order[]
  currentPrices: { [symbol: string]: number }
}

export function calculateTotalValue(
  cash: number,
  holdings: Holdings,
  currentPrices: { [symbol: string]: number }
): number {
  let holdingsValue = 0
  for (const symbol in holdings) {
    const position = holdings[symbol]
    const currentPrice = currentPrices[symbol] || position.averagePrice
    holdingsValue += position.quantity * currentPrice
  }
  return cash + holdingsValue
}

export function executionReducer(
  state: ExecutionState,
  action: ExecutionAction
): ExecutionState {
  switch (action.type) {
    case 'EXECUTE_ORDER': {
      const { order: orderData } = action
      const currentPrice = state.currentPrices[orderData.symbol]

      if (!currentPrice) {
        // Reject if symbol not found
        const rejectedOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          status: 'REJECTED',
          rejectionReason: `Symbol ${orderData.symbol} not found`
        }
        return {
          ...state,
          orders: [...state.orders, rejectedOrder]
        }
      }

      // Use current market price for execution
      const executionPrice = currentPrice

      if (orderData.type === 'BUY') {
        const validation = validateBuyOrder(
          orderData.symbol,
          orderData.quantity,
          executionPrice,
          state.portfolio
        )

        if (!validation.valid) {
          const rejectedOrder: Order = {
            ...orderData,
            id: `order-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            status: 'REJECTED',
            rejectionReason: validation.error
          }
          return {
            ...state,
            orders: [...state.orders, rejectedOrder]
          }
        }

        // Execute buy order
        const orderCost = orderData.quantity * executionPrice
        const newCash = state.portfolio.cash - orderCost

        const existingPosition = state.portfolio.holdings[orderData.symbol]
        let newPosition: Position

        if (existingPosition) {
          const totalQuantity =
            existingPosition.quantity + orderData.quantity
          const totalCost =
            existingPosition.quantity * existingPosition.averagePrice +
            orderCost
          newPosition = {
            symbol: orderData.symbol,
            quantity: totalQuantity,
            averagePrice: totalCost / totalQuantity
          }
        } else {
          newPosition = {
            symbol: orderData.symbol,
            quantity: orderData.quantity,
            averagePrice: executionPrice
          }
        }

        const newHoldings = {
          ...state.portfolio.holdings,
          [orderData.symbol]: newPosition
        }

        const newPortfolio: Portfolio = {
          cash: newCash,
          holdings: newHoldings,
          totalValue: calculateTotalValue(
            newCash,
            newHoldings,
            state.currentPrices
          )
        }

        const filledOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          status: 'FILLED',
          executedAt: Date.now(),
          executionPrice
        }

        return {
          ...state,
          portfolio: newPortfolio,
          orders: [...state.orders, filledOrder]
        }
      } else {
        // SELL order
        const validation = validateSellOrder(
          orderData.symbol,
          orderData.quantity,
          state.portfolio
        )

        if (!validation.valid) {
          const rejectedOrder: Order = {
            ...orderData,
            id: `order-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            status: 'REJECTED',
            rejectionReason: validation.error
          }
          return {
            ...state,
            orders: [...state.orders, rejectedOrder]
          }
        }

        // Execute sell order
        const orderProceeds = orderData.quantity * executionPrice
        const newCash = state.portfolio.cash + orderProceeds

        const existingPosition = state.portfolio.holdings[orderData.symbol]
        const newQuantity = existingPosition.quantity - orderData.quantity

        let newHoldings: Holdings
        if (newQuantity === 0) {
          // Remove position if fully sold
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [orderData.symbol]: removed, ...remainingHoldings } =
            state.portfolio.holdings
          newHoldings = remainingHoldings
        } else {
          newHoldings = {
            ...state.portfolio.holdings,
            [orderData.symbol]: {
              ...existingPosition,
              quantity: newQuantity
            }
          }
        }

        const newPortfolio: Portfolio = {
          cash: newCash,
          holdings: newHoldings,
          totalValue: calculateTotalValue(
            newCash,
            newHoldings,
            state.currentPrices
          )
        }

        const filledOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          status: 'FILLED',
          executedAt: Date.now(),
          executionPrice
        }

        return {
          ...state,
          portfolio: newPortfolio,
          orders: [...state.orders, filledOrder]
        }
      }
    }

    case 'UPDATE_PRICES': {
      const newPrices = { ...state.currentPrices, ...action.prices }
      const newTotalValue = calculateTotalValue(
        state.portfolio.cash,
        state.portfolio.holdings,
        newPrices
      )
      return {
        ...state,
        currentPrices: newPrices,
        portfolio: {
          ...state.portfolio,
          totalValue: newTotalValue
        }
      }
    }

    default:
      return state
  }
}

export function createInitialState(
  initialCash: number,
  tickers: string[]
): ExecutionState {
  return {
    portfolio: {
      cash: initialCash,
      holdings: {},
      totalValue: initialCash
    },
    orders: [],
    currentPrices: tickers.reduce(
      (acc, ticker) => {
        acc[ticker] = 100 // Default price, will be updated
        return acc
      },
      {} as { [symbol: string]: number }
    )
  }
}
