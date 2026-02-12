'use client'

import { useReducer, useEffect, useState } from 'react'
import TradeTicket from '../components/TradeTicket'
import { executionReducer, createInitialState } from '../lib/execution'
import { OrderType } from '../types'

export default function Home() {
  const [state, dispatch] = useReducer(
    executionReducer,
    createInitialState(10000, ['FYNX', 'ZORD', 'MERA'])
  )

  // Mock current prices - in a real app these would update from the simulation engine
  const mockPrices = {
    FYNX: 102.45,
    ZORD: 87.12,
    MERA: 156.78
  }

  // Update state with mock prices on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_PRICES', prices: mockPrices })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedSymbol, setSelectedSymbol] = useState('FYNX')
  const [lastError, setLastError] = useState<string | undefined>(undefined)

  const handleTrade = (type: OrderType, quantity: number) => {
    setLastError(undefined)
    dispatch({
      type: 'EXECUTE_ORDER',
      order: {
        type,
        symbol: selectedSymbol,
        quantity,
        price: state.currentPrices[selectedSymbol]
      }
    })
  }

  // Update error message when orders change
  useEffect(() => {
    const lastOrder = state.orders[state.orders.length - 1]
    if (lastOrder && lastOrder.status === 'REJECTED') {
      setLastError(lastOrder.rejectionReason)
    }
  }, [state.orders])

  const currentPrice = state.currentPrices[selectedSymbol] || 0
  const sharesOwned =
    state.portfolio.holdings[selectedSymbol]?.quantity || 0

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SimTrade</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Summary */}
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash:</span>
                <span className="font-semibold">
                  ${state.portfolio.cash.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-semibold">
                  ${state.portfolio.totalValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">P&L:</span>
                <span
                  className={`font-semibold ${
                    state.portfolio.totalValue >= 10000
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  ${(state.portfolio.totalValue - 10000).toFixed(2)}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Holdings</h3>
            {Object.keys(state.portfolio.holdings).length === 0 ? (
              <p className="text-gray-500 text-sm">No positions</p>
            ) : (
              <div className="space-y-2">
                {Object.values(state.portfolio.holdings).map((position) => (
                  <div
                    key={position.symbol}
                    className="flex justify-between text-sm"
                  >
                    <span className="font-medium">{position.symbol}:</span>
                    <span>
                      {position.quantity} @ $
                      {position.averagePrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Prices */}
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Market Prices</h2>
            <div className="space-y-3">
              {Object.entries(state.currentPrices).map(([symbol, price]) => (
                <button
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    selectedSymbol === symbol
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{symbol}</span>
                    <span className="text-lg">${price.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Ticket */}
        <div className="mb-8">
          <TradeTicket
            symbol={selectedSymbol}
            currentPrice={currentPrice}
            cashAvailable={state.portfolio.cash}
            sharesOwned={sharesOwned}
            onTrade={handleTrade}
            error={lastError}
          />
        </div>

        {/* Recent Orders */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {state.orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {state.orders
                .slice()
                .reverse()
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <span
                        className={`font-semibold ${
                          order.type === 'BUY'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {order.type}
                      </span>{' '}
                      {order.quantity} {order.symbol}
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          order.status === 'FILLED'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {order.status}
                      </div>
                      {order.status === 'FILLED' && order.executionPrice && (
                        <div className="text-sm text-gray-600">
                          @ ${order.executionPrice.toFixed(2)}
                        </div>
                      )}
                      {order.status === 'REJECTED' &&
                        order.rejectionReason && (
                          <div className="text-xs text-red-600">
                            {order.rejectionReason}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
