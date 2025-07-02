"use client"

import { useState, useEffect, useCallback } from "react"
import { getFixedDeposits, getMoneyMarketFunds, getStockBrokers, getCryptoBrokers, clearCache } from "@/lib/api"
import type { FixedDeposit, MoneyMarketFund, StockBroker, CryptoBroker } from "@/lib/supabase"

// Generic hook for data fetching
function useAsyncData<T>(
  fetchFunction: () => Promise<{ data: T | null; error: string | null; loading: boolean }>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      if (forceRefresh) {
        clearCache()
      }

      const result = await fetchFunction()

      if (result.error) {
        setError(result.error)
        setData(null)
      } else {
        setData(result.data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => fetchData(true), [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    refetch: fetchData,
  }
}

// Specific hooks for each data type
export function useFixedDeposits() {
  return useAsyncData<FixedDeposit[]>(getFixedDeposits)
}

export function useMoneyMarketFunds() {
  return useAsyncData<MoneyMarketFund[]>(getMoneyMarketFunds)
}

export function useStockBrokers() {
  return useAsyncData<StockBroker[]>(getStockBrokers)
}

export function useCryptoBrokers() {
  return useAsyncData<CryptoBroker[]>(getCryptoBrokers)
}

// Combined hook for all financial data
export function useAllFinancialData() {
  const fixedDeposits = useFixedDeposits()
  const moneyMarketFunds = useMoneyMarketFunds()
  const stockBrokers = useStockBrokers()
  const cryptoBrokers = useCryptoBrokers()

  const isLoading = fixedDeposits.loading || moneyMarketFunds.loading || stockBrokers.loading || cryptoBrokers.loading
  const hasError = fixedDeposits.error || moneyMarketFunds.error || stockBrokers.error || cryptoBrokers.error

  const refreshAll = useCallback(() => {
    fixedDeposits.refresh()
    moneyMarketFunds.refresh()
    stockBrokers.refresh()
    cryptoBrokers.refresh()
  }, [fixedDeposits.refresh, moneyMarketFunds.refresh, stockBrokers.refresh, cryptoBrokers.refresh])

  return {
    fixedDeposits: fixedDeposits.data,
    moneyMarketFunds: moneyMarketFunds.data,
    stockBrokers: stockBrokers.data,
    cryptoBrokers: cryptoBrokers.data,
    loading: isLoading,
    error: hasError,
    lastUpdated: Math.max(
      fixedDeposits.lastUpdated?.getTime() || 0,
      moneyMarketFunds.lastUpdated?.getTime() || 0,
      stockBrokers.lastUpdated?.getTime() || 0,
      cryptoBrokers.lastUpdated?.getTime() || 0,
    ),
    refreshAll,
  }
}
