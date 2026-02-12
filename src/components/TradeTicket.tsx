'use client'

import { useState } from 'react'
import { OrderType } from '../types'

export interface TradeTicketProps {
  symbol: string
  currentPrice: number
  cashAvailable: number
  sharesOwned: number
  onTrade: (type: OrderType, quantity: number) => void
  error?: string
}

export default function TradeTicket({
  symbol,
  currentPrice,
  cashAvailable,
  sharesOwned,
  onTrade,
  error
}: TradeTicketProps) {
  const [quantity, setQuantity] = useState<string>('1')

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value)
    }
  }

  const handleBuy = () => {
    const qty = parseInt(quantity, 10)
    if (!isNaN(qty) && qty > 0) {
      onTrade('BUY', qty)
    }
  }

  const handleSell = () => {
    const qty = parseInt(quantity, 10)
    if (!isNaN(qty) && qty > 0) {
      onTrade('SELL', qty)
    }
  }

  const maxBuy = Math.floor(cashAvailable / currentPrice)
  const orderCost = parseInt(quantity || '0', 10) * currentPrice

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Trade {symbol}</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current Price: ${currentPrice.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          Cash Available: ${cashAvailable.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">Shares Owned: {sharesOwned}</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quantity
        </label>
        <input
          id="quantity"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quantity"
        />
        <p className="text-xs text-gray-500 mt-1">
          Max Buy: {maxBuy} shares (${(maxBuy * currentPrice).toFixed(2)})
        </p>
        {quantity && parseInt(quantity, 10) > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Order Cost: ${orderCost.toFixed(2)}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleBuy}
          disabled={!quantity || parseInt(quantity, 10) <= 0}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Buy
        </button>
        <button
          onClick={handleSell}
          disabled={!quantity || parseInt(quantity, 10) <= 0}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Sell
        </button>
      </div>
    </div>
  )
}
