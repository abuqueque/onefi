import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our data
export interface FixedDeposit {
  id: number
  bank: string
  product_name: string
  interest_rate: number
  tenure: string
  min_deposit: number
  is_islamic: boolean
  features: string[]
  terms: string
  affiliate_url: string
  created_at: string
  updated_at: string
}

export interface MoneyMarketFund {
  id: number
  provider: string
  fund_name: string
  current_yield: number
  management_fee: number
  min_investment: number
  liquidity: string
  is_shariah: boolean
  risk_level: string
  fund_size: string
  created_at: string
  updated_at: string
}

export interface StockBroker {
  id: number
  broker_name: string
  commission_rate: number
  min_deposit: number
  is_beginner_friendly: boolean
  is_licensed: boolean
  features: string[]
  commission_structure: string
  platform_fee: number
  affiliate_url: string
  created_at: string
  updated_at: string
}

export interface CryptoBroker {
  id: number
  broker_name: string
  trading_fee: number
  min_deposit: number
  is_beginner_friendly: boolean
  is_licensed: boolean
  features: string[]
  supported_coins: number
  withdrawal_fee: string
  affiliate_url: string
  created_at: string
  updated_at: string
}
