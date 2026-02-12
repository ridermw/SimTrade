import {
  validateOrderQuantity,
  validateBuyOrder,
  validateSellOrder
} from './validators'
import { Portfolio } from '../types'

describe('validators', () => {
  describe('validateOrderQuantity', () => {
    it('accepts positive integers', () => {
      expect(validateOrderQuantity(1)).toEqual({ valid: true })
      expect(validateOrderQuantity(100)).toEqual({ valid: true })
    })

    it('rejects zero quantity', () => {
      const result = validateOrderQuantity(0)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('greater than zero')
    })

    it('rejects negative quantity', () => {
      const result = validateOrderQuantity(-5)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('greater than zero')
    })

    it('rejects decimal quantity', () => {
      const result = validateOrderQuantity(1.5)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('whole number')
    })
  })

  describe('validateBuyOrder', () => {
    const mockPortfolio: Portfolio = {
      cash: 1000,
      holdings: {},
      totalValue: 1000
    }

    it('accepts valid buy order with sufficient funds', () => {
      const result = validateBuyOrder('FYNX', 5, 100, mockPortfolio)
      expect(result.valid).toBe(true)
    })

    it('rejects buy order with insufficient funds', () => {
      const result = validateBuyOrder('FYNX', 20, 100, mockPortfolio)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Insufficient funds')
      expect(result.error).toContain('$2000.00')
      expect(result.error).toContain('$1000.00')
    })

    it('rejects buy order with invalid quantity', () => {
      const result = validateBuyOrder('FYNX', 0, 100, mockPortfolio)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('greater than zero')
    })

    it('handles edge case where order cost equals available cash', () => {
      const result = validateBuyOrder('FYNX', 10, 100, mockPortfolio)
      expect(result.valid).toBe(true)
    })
  })

  describe('validateSellOrder', () => {
    const portfolioWithHoldings: Portfolio = {
      cash: 1000,
      holdings: {
        FYNX: { symbol: 'FYNX', quantity: 10, averagePrice: 95 }
      },
      totalValue: 2000
    }

    const portfolioNoHoldings: Portfolio = {
      cash: 1000,
      holdings: {},
      totalValue: 1000
    }

    it('accepts valid sell order with sufficient holdings', () => {
      const result = validateSellOrder('FYNX', 5, portfolioWithHoldings)
      expect(result.valid).toBe(true)
    })

    it('rejects sell order with insufficient holdings', () => {
      const result = validateSellOrder('FYNX', 15, portfolioWithHoldings)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Insufficient holdings')
      expect(result.error).toContain('10 shares')
    })

    it('rejects sell order when no position exists', () => {
      const result = validateSellOrder('ZORD', 5, portfolioNoHoldings)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Insufficient holdings')
      expect(result.error).toContain('0 shares')
    })

    it('rejects sell order with invalid quantity', () => {
      const result = validateSellOrder('FYNX', -1, portfolioWithHoldings)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('greater than zero')
    })

    it('handles edge case where selling entire position', () => {
      const result = validateSellOrder('FYNX', 10, portfolioWithHoldings)
      expect(result.valid).toBe(true)
    })
  })
})
