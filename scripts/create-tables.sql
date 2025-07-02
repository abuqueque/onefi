-- Create Fixed Deposits table
CREATE TABLE fixed_deposits (
  id BIGSERIAL PRIMARY KEY,
  bank VARCHAR(100) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  tenure VARCHAR(10) NOT NULL,
  min_deposit INTEGER NOT NULL,
  is_islamic BOOLEAN DEFAULT FALSE,
  features TEXT[] DEFAULT '{}',
  terms TEXT,
  affiliate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Money Market Funds table
CREATE TABLE money_market_funds (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  fund_name VARCHAR(200) NOT NULL,
  current_yield DECIMAL(5,2) NOT NULL,
  management_fee DECIMAL(4,2) NOT NULL,
  min_investment INTEGER NOT NULL,
  liquidity VARCHAR(10) NOT NULL,
  is_shariah BOOLEAN DEFAULT FALSE,
  risk_level VARCHAR(20) DEFAULT 'Low',
  fund_size VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Stock Brokers table
CREATE TABLE stock_brokers (
  id BIGSERIAL PRIMARY KEY,
  broker_name VARCHAR(100) NOT NULL,
  commission_rate DECIMAL(4,2) NOT NULL,
  min_deposit INTEGER NOT NULL,
  is_beginner_friendly BOOLEAN DEFAULT FALSE,
  is_licensed BOOLEAN DEFAULT TRUE,
  features TEXT[] DEFAULT '{}',
  commission_structure VARCHAR(200),
  platform_fee INTEGER DEFAULT 0,
  affiliate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Crypto Brokers table
CREATE TABLE crypto_brokers (
  id BIGSERIAL PRIMARY KEY,
  broker_name VARCHAR(100) NOT NULL,
  trading_fee DECIMAL(4,2) NOT NULL,
  min_deposit INTEGER NOT NULL,
  is_beginner_friendly BOOLEAN DEFAULT FALSE,
  is_licensed BOOLEAN DEFAULT FALSE,
  features TEXT[] DEFAULT '{}',
  supported_coins INTEGER DEFAULT 0,
  withdrawal_fee VARCHAR(100),
  affiliate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_market_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_brokers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on fixed_deposits" ON fixed_deposits FOR SELECT USING (true);
CREATE POLICY "Allow public read access on money_market_funds" ON money_market_funds FOR SELECT USING (true);
CREATE POLICY "Allow public read access on stock_brokers" ON stock_brokers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on crypto_brokers" ON crypto_brokers FOR SELECT USING (true);
