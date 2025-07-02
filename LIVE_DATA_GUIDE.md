# Live Data Implementation Guide for OneFi

This guide covers multiple approaches to implement live data in your OneFi financial application, building on your existing Supabase setup.

## Table of Contents
1. [Real-time Database Updates with Supabase](#1-real-time-database-updates-with-supabase)
2. [Live Financial Data APIs](#2-live-financial-data-apis)
3. [Real-time Market Data](#3-real-time-market-data)
4. [Live Updates for Interest Rates](#4-live-updates-for-interest-rates)
5. [WebSocket Implementation](#5-websocket-implementation)
6. [Performance Optimization](#6-performance-optimization)

## 1. Real-time Database Updates with Supabase

### Enable Realtime in Supabase

First, enable realtime for your tables in your Supabase dashboard:

```sql
-- Enable realtime for your tables
ALTER PUBLICATION supabase_realtime ADD TABLE fixed_deposits;
ALTER PUBLICATION supabase_realtime ADD TABLE money_market_funds;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_brokers;
ALTER PUBLICATION supabase_realtime ADD TABLE crypto_brokers;
```

### Create Real-time Hooks

Create a custom hook for real-time data subscription:

```typescript
// hooks/useRealtimeData.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeData<T>(
  table: string,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      try {
        // Initial data fetch
        const { data: initialData, error: fetchError } = await supabase
          .from(table)
          .select('*')

        if (fetchError) throw fetchError
        
        setData(initialData || [])
        setLoading(false)

        // Set up real-time subscription
        channel = supabase
          .channel(`${table}_changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table,
            },
            (payload) => {
              console.log(`${table} change received:`, payload)
              
              if (payload.eventType === 'INSERT') {
                setData(current => [...current, payload.new as T])
              } else if (payload.eventType === 'UPDATE') {
                setData(current => 
                  current.map(item => 
                    (item as any).id === payload.new.id ? payload.new as T : item
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                setData(current => 
                  current.filter(item => (item as any).id !== payload.old.id)
                )
              }
            }
          )
          .subscribe()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setLoading(false)
      }
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table])

  return { data, loading, error }
}
```

### Usage Example

```typescript
// In your component
import { useRealtimeData } from '@/hooks/useRealtimeData'
import type { FixedDeposit } from '@/lib/supabase'

export function FixedDepositsPage() {
  const { data: deposits, loading, error } = useRealtimeData<FixedDeposit>('fixed_deposits')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Live Fixed Deposits ({deposits.length})</h1>
      {deposits.map(deposit => (
        <div key={deposit.id}>
          {deposit.bank} - {deposit.interest_rate}%
        </div>
      ))}
    </div>
  )
}
```

## 2. Live Financial Data APIs

### Crypto Price Updates

```typescript
// lib/liveData.ts
import { supabase } from './supabase'

interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
  timestamp: number
}

export class LiveDataService {
  private priceUpdates = new Map<string, CryptoPrice>()
  private updateInterval: NodeJS.Timeout | null = null

  // Connect to cryptocurrency price feeds
  async startCryptoPriceUpdates(symbols: string[] = ['BTC', 'ETH', 'BNB']) {
    const updatePrices = async () => {
      try {
        // Using CoinGecko API (free tier)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true`
        )
        const data = await response.json()

        Object.entries(data).forEach(([symbol, priceData]: [string, any]) => {
          const price: CryptoPrice = {
            symbol: symbol.toUpperCase(),
            price: priceData.usd,
            change24h: priceData.usd_24h_change || 0,
            timestamp: Date.now()
          }
          
          this.priceUpdates.set(symbol, price)
          
          // Broadcast to subscribed components
          this.broadcastPriceUpdate(price)
        })
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error)
      }
    }

    // Update every 30 seconds
    updatePrices()
    this.updateInterval = setInterval(updatePrices, 30000)
  }

  private broadcastPriceUpdate(price: CryptoPrice) {
    // Custom event for price updates
    window.dispatchEvent(new CustomEvent('cryptoPriceUpdate', { 
      detail: price 
    }))
  }

  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  getCurrentPrice(symbol: string): CryptoPrice | null {
    return this.priceUpdates.get(symbol.toLowerCase()) || null
  }
}

export const liveDataService = new LiveDataService()
```

### Hook for Live Crypto Prices

```typescript
// hooks/useLiveCryptoPrices.ts
import { useState, useEffect } from 'react'
import { liveDataService } from '@/lib/liveData'

interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
  timestamp: number
}

export function useLiveCryptoPrices(symbols: string[] = ['bitcoin', 'ethereum', 'binancecoin']) {
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map())
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  useEffect(() => {
    // Start price updates
    liveDataService.startCryptoPriceUpdates(symbols)

    // Listen for price updates
    const handlePriceUpdate = (event: CustomEvent) => {
      const price = event.detail as CryptoPrice
      setPrices(prev => new Map(prev.set(price.symbol.toLowerCase(), price)))
      setLastUpdate(Date.now())
    }

    window.addEventListener('cryptoPriceUpdate', handlePriceUpdate as EventListener)

    return () => {
      window.removeEventListener('cryptoPriceUpdate', handlePriceUpdate as EventListener)
      liveDataService.stopUpdates()
    }
  }, [symbols])

  return { 
    prices: Object.fromEntries(prices), 
    lastUpdate,
    isStale: Date.now() - lastUpdate > 60000 // Consider stale after 1 minute
  }
}
```

## 3. Real-time Market Data

### Stock Market Data Integration

```typescript
// lib/marketData.ts
export interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
}

export class MarketDataService {
  private ws: WebSocket | null = null
  private subscribers = new Set<(data: StockPrice) => void>()

  // Example using Alpha Vantage or similar API
  async getStockPrice(symbol: string): Promise<StockPrice | null> {
    try {
      // Replace with your preferred stock API
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=YOUR_API_KEY`
      )
      const data = await response.json()
      
      const quote = data['Global Quote']
      if (!quote) return null

      return {
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Failed to fetch stock price:', error)
      return null
    }
  }

  subscribe(callback: (data: StockPrice) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers(data: StockPrice) {
    this.subscribers.forEach(callback => callback(data))
  }
}

export const marketDataService = new MarketDataService()
```

## 4. Live Updates for Interest Rates

### Bank Rate Monitor

```typescript
// lib/rateMonitor.ts
import { supabase } from './supabase'

export interface RateUpdate {
  id: number
  bank: string
  product_name: string
  old_rate: number
  new_rate: number
  change_type: 'increase' | 'decrease'
  timestamp: string
}

export class RateMonitorService {
  private monitoringInterval: NodeJS.Timeout | null = null

  async startRateMonitoring() {
    const checkRateChanges = async () => {
      try {
        // Get current rates
        const { data: currentRates } = await supabase
          .from('fixed_deposits')
          .select('id, bank, product_name, interest_rate, updated_at')

        // Compare with stored rates and detect changes
        // This would require a separate table to track rate history
        
        // Example: Insert rate change notification
        const rateChanges = await this.detectRateChanges(currentRates || [])
        
        if (rateChanges.length > 0) {
          // Notify users about rate changes
          rateChanges.forEach(change => this.notifyRateChange(change))
        }
      } catch (error) {
        console.error('Rate monitoring error:', error)
      }
    }

    // Check every hour
    this.monitoringInterval = setInterval(checkRateChanges, 3600000)
  }

  private async detectRateChanges(currentRates: any[]): Promise<RateUpdate[]> {
    // Implementation for comparing current rates with historical rates
    // This would involve querying a rate_history table
    return []
  }

  private notifyRateChange(update: RateUpdate) {
    // Send push notification or update UI
    window.dispatchEvent(new CustomEvent('rateChange', { detail: update }))
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
  }
}
```

## 5. WebSocket Implementation

### Custom WebSocket Hook

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react'

export function useWebSocket(url: string) {
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Open' | 'Closing' | 'Closed'>('Connecting')
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(url)
    
    ws.current.onopen = () => setConnectionStatus('Open')
    ws.current.onclose = () => setConnectionStatus('Closed')
    ws.current.onmessage = (event) => setLastMessage(event)
    
    return () => {
      ws.current?.close()
    }
  }, [url])

  const sendMessage = (message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message)
    }
  }

  return { connectionStatus, lastMessage, sendMessage }
}
```

## 6. Performance Optimization

### Optimized Live Data Hook

```typescript
// hooks/useOptimizedLiveData.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useOptimizedLiveData<T>(
  table: string,
  options: {
    select?: string
    filter?: any
    orderBy?: { column: string; ascending: boolean }
    limit?: number
    throttleMs?: number
  } = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastUpdateRef = useRef<number>(0)
  const { throttleMs = 1000 } = options

  const throttledUpdate = useCallback((updateFn: () => void) => {
    const now = Date.now()
    if (now - lastUpdateRef.current >= throttleMs) {
      updateFn()
      lastUpdateRef.current = now
    }
  }, [throttleMs])

  useEffect(() => {
    let mounted = true
    let channel: any

    const fetchInitialData = async () => {
      try {
        let query = supabase.from(table).select(options.select || '*')
        
        if (options.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          })
        }
        
        if (options.limit) {
          query = query.limit(options.limit)
        }

        const { data: initialData, error } = await query

        if (error) throw error
        if (mounted) {
          setData(initialData || [])
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data')
          setLoading(false)
        }
      }
    }

    fetchInitialData()

    // Set up real-time subscription with throttling
    channel = supabase
      .channel(`optimized_${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (!mounted) return

        throttledUpdate(() => {
          if (payload.eventType === 'INSERT') {
            setData(current => [...current, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData(current => 
              current.map(item => 
                (item as any).id === payload.new.id ? payload.new as T : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData(current => 
              current.filter(item => (item as any).id !== payload.old.id)
            )
          }
        })
      })
      .subscribe()

    return () => {
      mounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, options.select, JSON.stringify(options.filter), throttledUpdate])

  return { data, loading, error }
}
```

## Usage Examples in Your App

### 1. Live Fixed Deposits Page

```typescript
// app/fixed-deposits/page.tsx
"use client"

import { useRealtimeData } from '@/hooks/useRealtimeData'
import { useLiveCryptoPrices } from '@/hooks/useLiveCryptoPrices'
import type { FixedDeposit } from '@/lib/supabase'

export default function LiveFixedDepositsPage() {
  const { data: deposits, loading } = useRealtimeData<FixedDeposit>('fixed_deposits')
  const { prices } = useLiveCryptoPrices()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1>Live Fixed Deposits</h1>
        <div className="text-sm text-gray-500">
          {loading ? '🔄 Syncing...' : '✅ Live'}
        </div>
      </div>
      
      {deposits.map(deposit => (
        <div key={deposit.id} className="border p-4 rounded-lg mb-2">
          <h3>{deposit.bank}</h3>
          <p className="text-2xl font-bold text-green-600">
            {deposit.interest_rate}%
          </p>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(deposit.updated_at).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 2. Live Crypto Prices Widget

```typescript
// components/LiveCryptoPrices.tsx
"use client"

import { useLiveCryptoPrices } from '@/hooks/useLiveCryptoPrices'

export function LiveCryptoPrices() {
  const { prices, lastUpdate, isStale } = useLiveCryptoPrices(['bitcoin', 'ethereum'])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Live Crypto Prices</h3>
        <div className={`text-xs ${isStale ? 'text-red-500' : 'text-green-500'}`}>
          {isStale ? '⚠️ Stale' : '🟢 Live'}
        </div>
      </div>
      
      {Object.entries(prices).map(([symbol, price]) => (
        <div key={symbol} className="flex justify-between items-center py-2">
          <span className="font-medium">{symbol.toUpperCase()}</span>
          <div className="text-right">
            <div className="font-bold">${price.price.toLocaleString()}</div>
            <div className={`text-sm ${price.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {price.change24h >= 0 ? '+' : ''}{price.change24h.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Best Practices

1. **Rate Limiting**: Implement proper rate limiting for API calls
2. **Error Handling**: Always handle connection failures gracefully
3. **Fallback Data**: Keep cached data as fallback when live data fails
4. **Performance**: Use throttling and debouncing for high-frequency updates
5. **User Experience**: Show connection status and last update time
6. **Security**: Validate all incoming live data before displaying

## Next Steps

1. Choose the implementation that best fits your needs
2. Set up the required environment variables for external APIs
3. Enable realtime in your Supabase project
4. Test the implementation with a small dataset first
5. Monitor performance and adjust throttling as needed

This guide provides a comprehensive foundation for implementing live data in your OneFi application. Choose the methods that align with your specific requirements and data sources.