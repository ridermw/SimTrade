import { Portfolio } from '../types'

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateOrderQuantity(quantity: number): ValidationResult {
  if (!Number.isInteger(quantity)) {
    return { valid: false, error: 'Quantity must be a whole number' }
  }
  if (quantity <= 0) {
    return { valid: false, error: 'Quantity must be greater than zero' }
  }
  return { valid: true }
}

export function validateBuyOrder(
  symbol: string,
  quantity: number,
  price: number,
  portfolio: Portfolio
): ValidationResult {
  const quantityValidation = validateOrderQuantity(quantity)
  if (!quantityValidation.valid) {
    return quantityValidation
  }

  const orderCost = quantity * price
  if (portfolio.cash < orderCost) {
    return {
      valid: false,
      error: `Insufficient funds. Need $${orderCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`
    }
  }

  return { valid: true }
}

export function validateSellOrder(
  symbol: string,
  quantity: number,
  portfolio: Portfolio
): ValidationResult {
  const quantityValidation = validateOrderQuantity(quantity)
  if (!quantityValidation.valid) {
    return quantityValidation
  }

  const position = portfolio.holdings[symbol]
  if (!position || position.quantity < quantity) {
    const available = position?.quantity || 0
    return {
      valid: false,
      error: `Insufficient holdings. You have ${available} shares of ${symbol}`
    }
  }

  return { valid: true }
}
