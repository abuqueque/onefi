-- Insert sample Fixed Deposits data
INSERT INTO fixed_deposits (bank, product_name, interest_rate, tenure, min_deposit, is_islamic, features, terms, affiliate_url) VALUES
('Maybank', 'Maybank Fixed Deposit-i', 3.85, '12M', 1000, true, '{"Shariah-compliant", "Auto-renewal option", "Partial withdrawal"}', 'Minimum deposit of RM1,000. Early withdrawal penalties apply.', 'https://maybank.com/fd'),
('CIMB', 'CIMB Fixed Deposit', 3.75, '12M', 1000, false, '{"Competitive rates", "Flexible tenure", "Online application"}', 'Minimum deposit of RM1,000. Terms and conditions apply.', 'https://cimb.com/fd'),
('Public Bank', 'Public Fixed Deposit', 3.70, '6M', 500, false, '{"Low minimum deposit", "Branch network", "Senior citizen rates"}', 'Minimum deposit of RM500. Higher rates for senior citizens.', 'https://publicbank.com/fd'),
('Hong Leong', 'Hong Leong Islamic Fixed Deposit', 3.80, '24M', 5000, true, '{"Shariah-compliant", "Higher returns", "Flexible terms"}', 'Minimum deposit of RM5,000. Islamic banking principles apply.', 'https://hlb.com/fd');

-- Insert sample Money Market Funds data
INSERT INTO money_market_funds (provider, fund_name, current_yield, management_fee, min_investment, liquidity, is_shariah, risk_level, fund_size) VALUES
('Maybank', 'Maybank Money Market Fund', 3.25, 0.35, 1000, 'T+1', false, 'Low', 'RM 2.5B'),
('CIMB', 'CIMB Islamic Money Market Fund', 3.35, 0.30, 5000, 'T+1', true, 'Low', 'RM 1.8B'),
('Public Bank', 'Public Money Market Fund', 3.15, 0.25, 1000, 'T+0', false, 'Low', 'RM 3.2B'),
('AmBank', 'AmIslamic Money Market Fund', 3.40, 0.40, 10000, 'T+2', true, 'Low', 'RM 1.2B');

-- Insert sample Stock Brokers data
INSERT INTO stock_brokers (broker_name, commission_rate, min_deposit, is_beginner_friendly, is_licensed, features, commission_structure, platform_fee, affiliate_url) VALUES
('Rakuten Trade', 0.05, 1000, true, true, '{"Zero brokerage for first 30 days", "Mobile app", "Research reports", "Educational content"}', '0.05% or min RM7', 0, 'https://rakutentrade.my'),
('M+ Online', 0.10, 1000, true, true, '{"Maybank integration", "Research tools", "Mobile trading", "IPO applications"}', '0.10% or min RM8', 0, 'https://maybank.com/mplus'),
('CIMB iTrade', 0.10, 1000, false, true, '{"Advanced charting", "Options trading", "Warrants", "Professional tools"}', '0.10% or min RM8.88', 0, 'https://cimb.com/itrade');

-- Insert sample Crypto Brokers data
INSERT INTO crypto_brokers (broker_name, trading_fee, min_deposit, is_beginner_friendly, is_licensed, features, supported_coins, withdrawal_fee, affiliate_url) VALUES
('Luno', 0.10, 50, true, true, '{"Easy to use", "Educational content", "Instant buy/sell", "Recurring buys", "Mobile app"}', 8, 'Free for BTC/ETH', 'https://luno.com/my'),
('Tokenize Xchange', 0.20, 100, true, true, '{"Local exchange", "Ringgit deposits", "Advanced trading", "API access", "Staking rewards"}', 50, '0.0005 BTC', 'https://tokenize.exchange'),
('Sinegy', 0.25, 100, false, true, '{"Professional trading", "Advanced charts", "Margin trading", "Futures", "OTC desk"}', 100, 'Network fees apply', 'https://sinegy.com');
