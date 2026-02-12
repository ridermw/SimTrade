import { add, formatPrice } from './utils'

describe('utils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add negative numbers', () => {
      expect(add(-5, 3)).toBe(-2)
    })

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5)
    })
  })

  describe('formatPrice', () => {
    it('should format price with two decimal places', () => {
      expect(formatPrice(10)).toBe('$10.00')
    })

    it('should format price with cents', () => {
      expect(formatPrice(12.5)).toBe('$12.50')
    })

    it('should round to two decimal places', () => {
      expect(formatPrice(9.999)).toBe('$10.00')
    })
  })
})
