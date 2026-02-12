import {
  executionReducer,
  createInitialState,
  calculateTotalValue
} from './execution'
import { ExecutionState } from './execution'

describe('execution', () => {
  describe('createInitialState', () => {
    it('creates initial state with cash and empty holdings', () => {
      const state = createInitialState(10000, ['FYNX', 'ZORD', 'MERA'])
      expect(state.portfolio.cash).toBe(10000)
      expect(state.portfolio.holdings).toEqual({})
      expect(state.portfolio.totalValue).toBe(10000)
      expect(state.orders).toEqual([])
      expect(state.currentPrices).toHaveProperty('FYNX')
      expect(state.currentPrices).toHaveProperty('ZORD')
      expect(state.currentPrices).toHaveProperty('MERA')
    })
  })

  describe('calculateTotalValue', () => {
    it('calculates total value with only cash', () => {
      const total = calculateTotalValue(10000, {}, {})
      expect(total).toBe(10000)
    })

    it('calculates total value with cash and holdings', () => {
      const holdings = {
        FYNX: { symbol: 'FYNX', quantity: 10, averagePrice: 95 }
      }
      const prices = { FYNX: 100 }
      const total = calculateTotalValue(5000, holdings, prices)
      expect(total).toBe(6000) // 5000 cash + 10 * 100 = 6000
    })

    it('uses average price when current price not available', () => {
      const holdings = {
        FYNX: { symbol: 'FYNX', quantity: 10, averagePrice: 95 }
      }
      const prices = {}
      const total = calculateTotalValue(5000, holdings, prices)
      expect(total).toBe(5950) // 5000 + 10 * 95 = 5950
    })
  })

  describe('executionReducer - BUY orders', () => {
    let initialState: ExecutionState

    beforeEach(() => {
      initialState = {
        portfolio: {
          cash: 10000,
          holdings: {},
          totalValue: 10000
        },
        orders: [],
        currentPrices: { FYNX: 100, ZORD: 50 }
      }
    })

    it('executes valid buy order', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'BUY' as const,
          symbol: 'FYNX',
          quantity: 10,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(9000) // 10000 - 1000
      expect(newState.portfolio.holdings.FYNX).toEqual({
        symbol: 'FYNX',
        quantity: 10,
        averagePrice: 100
      })
      expect(newState.orders).toHaveLength(1)
      expect(newState.orders[0].status).toBe('FILLED')
      expect(newState.orders[0].executionPrice).toBe(100)
    })

    it('adds to existing position on second buy', () => {
      const state = {
        ...initialState,
        portfolio: {
          ...initialState.portfolio,
          cash: 9550,
          holdings: {
            FYNX: {
              symbol: 'FYNX',
              quantity: 5,
              averagePrice: 90
            }
          }
        }
      }

      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'BUY' as const,
          symbol: 'FYNX',
          quantity: 5,
          price: 100
        }
      }

      const newState = executionReducer(state, action)

      expect(newState.portfolio.cash).toBe(9050) // 9550 - 500
      expect(newState.portfolio.holdings.FYNX.quantity).toBe(10)
      expect(newState.portfolio.holdings.FYNX.averagePrice).toBe(95) // (5*90 + 5*100) / 10
    })

    it('rejects buy order with insufficient funds', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'BUY' as const,
          symbol: 'FYNX',
          quantity: 200,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(10000) // unchanged
      expect(newState.portfolio.holdings).toEqual({}) // unchanged
      expect(newState.orders).toHaveLength(1)
      expect(newState.orders[0].status).toBe('REJECTED')
      expect(newState.orders[0].rejectionReason).toContain('Insufficient funds')
    })

    it('rejects buy order for unknown symbol', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'BUY' as const,
          symbol: 'UNKNOWN',
          quantity: 10,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(10000) // unchanged
      expect(newState.orders[0].status).toBe('REJECTED')
      expect(newState.orders[0].rejectionReason).toContain('not found')
    })
  })

  describe('executionReducer - SELL orders', () => {
    let initialState: ExecutionState

    beforeEach(() => {
      initialState = {
        portfolio: {
          cash: 5000,
          holdings: {
            FYNX: { symbol: 'FYNX', quantity: 20, averagePrice: 95 }
          },
          totalValue: 7000
        },
        orders: [],
        currentPrices: { FYNX: 100, ZORD: 50 }
      }
    })

    it('executes valid sell order', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'SELL' as const,
          symbol: 'FYNX',
          quantity: 10,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(6000) // 5000 + 1000
      expect(newState.portfolio.holdings.FYNX.quantity).toBe(10)
      expect(newState.orders).toHaveLength(1)
      expect(newState.orders[0].status).toBe('FILLED')
      expect(newState.orders[0].executionPrice).toBe(100)
    })

    it('removes position when selling entire holding', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'SELL' as const,
          symbol: 'FYNX',
          quantity: 20,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(7000) // 5000 + 2000
      expect(newState.portfolio.holdings.FYNX).toBeUndefined()
      expect(newState.orders[0].status).toBe('FILLED')
    })

    it('rejects sell order with insufficient holdings', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'SELL' as const,
          symbol: 'FYNX',
          quantity: 30,
          price: 100
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(5000) // unchanged
      expect(newState.portfolio.holdings.FYNX.quantity).toBe(20) // unchanged
      expect(newState.orders[0].status).toBe('REJECTED')
      expect(newState.orders[0].rejectionReason).toContain('Insufficient holdings')
    })

    it('rejects sell order when no position exists', () => {
      const action = {
        type: 'EXECUTE_ORDER' as const,
        order: {
          type: 'SELL' as const,
          symbol: 'ZORD',
          quantity: 10,
          price: 50
        }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.portfolio.cash).toBe(5000) // unchanged
      expect(newState.orders[0].status).toBe('REJECTED')
      expect(newState.orders[0].rejectionReason).toContain('Insufficient holdings')
    })
  })

  describe('executionReducer - UPDATE_PRICES', () => {
    it('updates current prices and recalculates portfolio value', () => {
      const initialState: ExecutionState = {
        portfolio: {
          cash: 5000,
          holdings: {
            FYNX: { symbol: 'FYNX', quantity: 10, averagePrice: 95 }
          },
          totalValue: 6000
        },
        orders: [],
        currentPrices: { FYNX: 100 }
      }

      const action = {
        type: 'UPDATE_PRICES' as const,
        prices: { FYNX: 110 }
      }

      const newState = executionReducer(initialState, action)

      expect(newState.currentPrices.FYNX).toBe(110)
      expect(newState.portfolio.totalValue).toBe(6100) // 5000 + 10 * 110
    })
  })
})
