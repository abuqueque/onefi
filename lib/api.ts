import { supabase } from "./supabase"
import type { FixedDeposit, MoneyMarketFund, StockBroker, CryptoBroker } from "./supabase"

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

// Generic cache helper
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// API Response type
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Fixed Deposits API
export async function getFixedDeposits(): Promise<ApiResponse<FixedDeposit[]>> {
  try {
    // Check cache first
    const cachedData = getCachedData<FixedDeposit[]>("fixed_deposits")
    if (cachedData) {
      return { data: cachedData, error: null, loading: false }
    }

    const { data, error } = await supabase
      .from("fixed_deposits")
      .select("*")
      .order("interest_rate", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Transform data to match frontend interface
    const transformedData: FixedDeposit[] = data.map((item) => ({
      ...item,
      productName: item.product_name,
      interestRate: item.interest_rate,
      minDeposit: item.min_deposit,
      islamic: item.is_islamic,
      affiliateUrl: item.affiliate_url,
    }))

    // Cache the result
    setCachedData("fixed_deposits", transformedData)

    return { data: transformedData, error: null, loading: false }
  } catch (error) {
    console.error("Error fetching fixed deposits:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch fixed deposits",
      loading: false,
    }
  }
}

// Money Market Funds API
export async function getMoneyMarketFunds(): Promise<ApiResponse<MoneyMarketFund[]>> {
  try {
    const cachedData = getCachedData<MoneyMarketFund[]>("money_market_funds")
    if (cachedData) {
      return { data: cachedData, error: null, loading: false }
    }

    const { data, error } = await supabase
      .from("money_market_funds")
      .select("*")
      .order("current_yield", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    const transformedData: MoneyMarketFund[] = data.map((item) => ({
      ...item,
      name: item.fund_name,
      yield: item.current_yield,
      fee: item.management_fee,
      minInvestment: item.min_investment,
      shariah: item.is_shariah,
      riskLevel: item.risk_level,
      fundSize: item.fund_size,
    }))

    setCachedData("money_market_funds", transformedData)
    return { data: transformedData, error: null, loading: false }
  } catch (error) {
    console.error("Error fetching money market funds:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch money market funds",
      loading: false,
    }
  }
}

// Stock Brokers API
export async function getStockBrokers(): Promise<ApiResponse<StockBroker[]>> {
  try {
    const cachedData = getCachedData<StockBroker[]>("stock_brokers")
    if (cachedData) {
      return { data: cachedData, error: null, loading: false }
    }

    const { data, error } = await supabase
      .from("stock_brokers")
      .select("*")
      .order("commission_rate", { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    const transformedData: StockBroker[] = data.map((item) => ({
      ...item,
      name: item.broker_name,
      commissionRate: item.commission_rate,
      minDeposit: item.min_deposit,
      beginnerFriendly: item.is_beginner_friendly,
      licensed: item.is_licensed,
      commissionStructure: item.commission_structure,
      platformFee: item.platform_fee,
      affiliateUrl: item.affiliate_url,
    }))

    setCachedData("stock_brokers", transformedData)
    return { data: transformedData, error: null, loading: false }
  } catch (error) {
    console.error("Error fetching stock brokers:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch stock brokers",
      loading: false,
    }
  }
}

// Crypto Brokers API
export async function getCryptoBrokers(): Promise<ApiResponse<CryptoBroker[]>> {
  try {
    const cachedData = getCachedData<CryptoBroker[]>("crypto_brokers")
    if (cachedData) {
      return { data: cachedData, error: null, loading: false }
    }

    const { data, error } = await supabase.from("crypto_brokers").select("*").order("trading_fee", { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    const transformedData: CryptoBroker[] = data.map((item) => ({
      ...item,
      name: item.broker_name,
      tradingFee: item.trading_fee,
      minDeposit: item.min_deposit,
      beginnerFriendly: item.is_beginner_friendly,
      licensed: item.is_licensed,
      supportedCoins: item.supported_coins,
      withdrawalFee: item.withdrawal_fee,
      affiliateUrl: item.affiliate_url,
    }))

    setCachedData("crypto_brokers", transformedData)
    return { data: transformedData, error: null, loading: false }
  } catch (error) {
    console.error("Error fetching crypto brokers:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch crypto brokers",
      loading: false,
    }
  }
}

// Clear cache function (useful for manual refresh)
export function clearCache(): void {
  cache.clear()
}

// Get cache status
export function getCacheStatus(): { key: string; age: number }[] {
  const now = Date.now()
  return Array.from(cache.entries()).map(([key, value]) => ({
    key,
    age: Math.floor((now - value.timestamp) / 1000), // age in seconds
  }))
}
