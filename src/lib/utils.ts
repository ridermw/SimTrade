/**
 * Simple utility function for testing purposes
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * Format a price value for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}
