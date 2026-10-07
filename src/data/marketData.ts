import { MarketIndex, StockQuote, SectorNode, NewsItem, AnalystConsensus, CandleDataPoint, OrderBook } from '../types/market';

export const INITIAL_INDICES: MarketIndex[] = [
  {
    symbol: 'NASDAQ',
    name: 'Nasdaq Composite',
    price: 18402.65,
    change: 254.12,
    changePercent: 1.40,
    high: 18450.20,
    low: 18180.40,
    sparkline: [18190, 18220, 18260, 18240, 18310, 18380, 18402.65],
    category: 'EQUITY'
  },
  {
    symbol: 'S&P 500',
    name: 'Standard & Poor\'s 500',
    price: 5751.13,
    change: 49.30,
    changePercent: 0.86,
    high: 5765.40,
    low: 5712.80,
    sparkline: [5715, 5722, 5735, 5729, 5742, 5748, 5751.13],
    category: 'EQUITY'
  },
  {
    symbol: 'DOW JONES',
    name: 'Dow Jones Industrial',
    price: 42124.65,
    change: 142.20,
    changePercent: 0.34,
    high: 42200.10,
    low: 41980.50,
    sparkline: [42010, 42050, 42020, 42090, 42110, 42080, 42124.65],
    category: 'EQUITY'
  },
  {
    symbol: 'RUSSELL 2000',
    name: 'Russell 2000 Small Cap',
    price: 2194.80,
    change: -4.60,
    changePercent: -0.21,
    high: 2210.40,
    low: 2186.20,
    sparkline: [2205, 2202, 2198, 2204, 2196, 2191, 2194.80],
    category: 'EQUITY'
  },
  {
    symbol: 'US 10Y YIELD',
    name: 'U.S. 10-Year Treasury',
    price: 4.184,
    change: -0.042,
    changePercent: -0.99,
    high: 4.240,
    low: 4.162,
    sparkline: [4.23, 4.22, 4.21, 4.19, 4.20, 4.17, 4.184],
    category: 'BONDS'
  },
  {
    symbol: 'VIX INDEX',
    name: 'CBOE Volatility Index',
    price: 13.82,
    change: -0.74,
    changePercent: -5.08,
    high: 14.90,
    low: 13.65,
    sparkline: [14.8, 14.5, 14.4, 14.1, 13.9, 13.7, 13.82],
    category: 'VOLATILITY'
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin Spot Reference',
    price: 64890.00,
    change: 1320.00,
    changePercent: 2.08,
    high: 65200.00,
    low: 63100.00,
    sparkline: [63200, 63800, 63600, 64200, 64600, 64500, 64890],
    category: 'CRYPTO'
  }
];

export const INITIAL_STOCKS: StockQuote[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 134.85,
    change: 4.95,
    changePercent: 3.81,
    open: 130.40,
    high: 135.20,
    low: 130.10,
    previousClose: 129.90,
    volume: 58420000,
    avgVolume: 51200000,
    marketCap: 3315.4,
    peRatio: 58.4,
    forwardPe: 34.2,
    eps: 2.31,
    dividendYield: 0.03,
    beta: 1.68,
    high52w: 140.76,
    low52w: 45.11,
    shortFloat: 1.15,
    nextEarnings: 'Nov 20, 2026',
    sparkline: [129.5, 131.0, 130.8, 132.4, 133.6, 134.1, 134.85],
    rsi: 66.4,
    signal: 'Strong Buy'
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    price: 228.40,
    change: 2.15,
    changePercent: 0.95,
    open: 226.50,
    high: 229.10,
    low: 225.80,
    previousClose: 226.25,
    volume: 42100000,
    avgVolume: 48900000,
    marketCap: 3465.2,
    peRatio: 34.2,
    forwardPe: 30.1,
    eps: 6.68,
    dividendYield: 0.44,
    beta: 1.05,
    high52w: 237.23,
    low52w: 164.08,
    shortFloat: 0.82,
    nextEarnings: 'Oct 31, 2026',
    sparkline: [225.8, 226.4, 227.1, 226.8, 227.9, 228.1, 228.40],
    rsi: 54.8,
    signal: 'Buy'
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: 418.90,
    change: 3.40,
    changePercent: 0.82,
    open: 416.00,
    high: 420.50,
    low: 415.20,
    previousClose: 415.50,
    volume: 18450000,
    avgVolume: 21800000,
    marketCap: 3112.8,
    peRatio: 36.1,
    forwardPe: 31.4,
    eps: 11.60,
    dividendYield: 0.72,
    beta: 1.18,
    high52w: 468.35,
    low52w: 327.20,
    shortFloat: 0.65,
    nextEarnings: 'Oct 29, 2026',
    sparkline: [415.2, 416.1, 417.0, 416.5, 418.0, 418.5, 418.90],
    rsi: 51.2,
    signal: 'Buy'
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    industry: 'Internet Retail',
    price: 186.20,
    change: 2.85,
    changePercent: 1.55,
    open: 183.90,
    high: 187.10,
    low: 183.50,
    previousClose: 183.35,
    volume: 33800000,
    avgVolume: 41200000,
    marketCap: 1940.5,
    peRatio: 44.2,
    forwardPe: 32.8,
    eps: 4.21,
    dividendYield: 0.00,
    beta: 1.29,
    high52w: 201.20,
    low52w: 118.35,
    shortFloat: 0.74,
    nextEarnings: 'Oct 24, 2026',
    sparkline: [183.1, 184.2, 184.8, 185.3, 185.9, 186.0, 186.20],
    rsi: 58.7,
    signal: 'Buy'
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 167.40,
    change: 1.90,
    changePercent: 1.15,
    open: 165.80,
    high: 168.20,
    low: 165.30,
    previousClose: 165.50,
    volume: 24100000,
    avgVolume: 27900000,
    marketCap: 2068.7,
    peRatio: 23.8,
    forwardPe: 20.4,
    eps: 7.03,
    dividendYield: 0.48,
    beta: 1.12,
    high52w: 191.75,
    low52w: 120.21,
    shortFloat: 0.61,
    nextEarnings: 'Oct 22, 2026',
    sparkline: [165.2, 166.0, 166.5, 166.2, 167.0, 167.1, 167.40],
    rsi: 49.3,
    signal: 'Hold'
  },
  {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 592.10,
    change: 11.60,
    changePercent: 2.00,
    open: 582.40,
    high: 594.50,
    low: 581.00,
    previousClose: 580.50,
    volume: 12400000,
    avgVolume: 14800000,
    marketCap: 1502.3,
    peRatio: 28.6,
    forwardPe: 24.1,
    eps: 20.70,
    dividendYield: 0.34,
    beta: 1.25,
    high52w: 602.95,
    low52w: 279.40,
    shortFloat: 0.98,
    nextEarnings: 'Oct 30, 2026',
    sparkline: [580.5, 584.2, 586.0, 589.4, 591.2, 591.8, 592.10],
    rsi: 68.2,
    signal: 'Strong Buy'
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Discretionary',
    industry: 'Auto Manufacturers',
    price: 248.50,
    change: -4.30,
    changePercent: -1.70,
    open: 253.20,
    high: 254.80,
    low: 246.50,
    previousClose: 252.80,
    volume: 68300000,
    avgVolume: 74200000,
    marketCap: 792.4,
    peRatio: 64.2,
    forwardPe: 78.1,
    eps: 3.87,
    dividendYield: 0.00,
    beta: 2.34,
    high52w: 271.00,
    low52w: 138.80,
    shortFloat: 3.24,
    nextEarnings: 'Oct 23, 2026',
    sparkline: [253.0, 252.1, 250.4, 248.9, 249.2, 247.8, 248.50],
    rsi: 42.1,
    signal: 'Hold'
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 168.20,
    change: 5.40,
    changePercent: 3.32,
    open: 163.50,
    high: 169.40,
    low: 162.80,
    previousClose: 162.80,
    volume: 48900000,
    avgVolume: 52400000,
    marketCap: 272.5,
    peRatio: 118.4,
    forwardPe: 31.2,
    eps: 1.42,
    dividendYield: 0.00,
    beta: 1.72,
    high52w: 227.30,
    low52w: 94.04,
    shortFloat: 2.18,
    nextEarnings: 'Oct 29, 2026',
    sparkline: [162.5, 164.0, 165.2, 166.8, 167.3, 167.9, 168.20],
    rsi: 61.9,
    signal: 'Oversold Breakout'
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 178.60,
    change: 3.80,
    changePercent: 2.17,
    open: 175.20,
    high: 179.30,
    low: 174.80,
    previousClose: 174.80,
    volume: 16200000,
    avgVolume: 19400000,
    marketCap: 834.1,
    peRatio: 48.3,
    forwardPe: 27.9,
    eps: 3.70,
    dividendYield: 1.18,
    beta: 1.28,
    high52w: 185.16,
    low52w: 80.82,
    shortFloat: 1.05,
    nextEarnings: 'Dec 12, 2026',
    sparkline: [174.5, 175.6, 176.4, 177.2, 177.9, 178.2, 178.60],
    rsi: 64.5,
    signal: 'Strong Buy'
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: 43.15,
    change: 2.10,
    changePercent: 5.12,
    open: 41.20,
    high: 43.60,
    low: 40.90,
    previousClose: 41.05,
    volume: 54200000,
    avgVolume: 49500000,
    marketCap: 96.8,
    peRatio: 112.5,
    forwardPe: 68.4,
    eps: 0.38,
    dividendYield: 0.00,
    beta: 2.45,
    high52w: 44.50,
    low52w: 14.48,
    shortFloat: 3.82,
    nextEarnings: 'Nov 04, 2026',
    sparkline: [40.8, 41.5, 41.9, 42.4, 42.8, 43.0, 43.15],
    rsi: 74.2,
    signal: 'Take Profit'
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    industry: 'Banks - Diversified',
    price: 221.80,
    change: 1.40,
    changePercent: 0.64,
    open: 220.50,
    high: 222.90,
    low: 219.80,
    previousClose: 220.40,
    volume: 9800000,
    avgVolume: 10400000,
    marketCap: 634.5,
    peRatio: 12.4,
    forwardPe: 11.8,
    eps: 17.88,
    dividendYield: 2.07,
    beta: 1.11,
    high52w: 225.48,
    low52w: 140.23,
    shortFloat: 0.72,
    nextEarnings: 'Oct 11, 2026',
    sparkline: [220.1, 220.6, 221.2, 221.0, 221.5, 221.7, 221.80],
    rsi: 58.3,
    signal: 'Buy'
  },
  {
    ticker: 'V',
    name: 'Visa Inc.',
    sector: 'Financials',
    industry: 'Credit Services',
    price: 278.40,
    change: 1.10,
    changePercent: 0.40,
    open: 277.20,
    high: 279.10,
    low: 276.50,
    previousClose: 277.30,
    volume: 5200000,
    avgVolume: 6100000,
    marketCap: 568.2,
    peRatio: 30.1,
    forwardPe: 25.4,
    eps: 9.25,
    dividendYield: 0.75,
    beta: 0.94,
    high52w: 290.96,
    low52w: 227.78,
    shortFloat: 0.88,
    nextEarnings: 'Oct 29, 2026',
    sparkline: [277.0, 277.5, 278.1, 277.8, 278.2, 278.3, 278.40],
    rsi: 52.4,
    signal: 'Hold'
  },
  {
    ticker: 'LLY',
    name: 'Eli Lilly and Company',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers - General',
    price: 894.20,
    change: 9.80,
    changePercent: 1.11,
    open: 885.00,
    high: 898.00,
    low: 882.10,
    previousClose: 884.40,
    volume: 2800000,
    avgVolume: 3200000,
    marketCap: 849.6,
    peRatio: 114.2,
    forwardPe: 42.1,
    eps: 7.83,
    dividendYield: 0.58,
    beta: 0.76,
    high52w: 972.53,
    low52w: 528.25,
    shortFloat: 0.65,
    nextEarnings: 'Oct 30, 2026',
    sparkline: [884.0, 887.2, 889.5, 891.0, 893.4, 893.9, 894.20],
    rsi: 57.8,
    signal: 'Strong Buy'
  },
  {
    ticker: 'UNH',
    name: 'UnitedHealth Group',
    sector: 'Healthcare',
    industry: 'Healthcare Plans',
    price: 588.60,
    change: -3.20,
    changePercent: -0.54,
    open: 592.00,
    high: 593.50,
    low: 586.10,
    previousClose: 591.80,
    volume: 2400000,
    avgVolume: 3100000,
    marketCap: 541.3,
    peRatio: 36.8,
    forwardPe: 20.8,
    eps: 16.00,
    dividendYield: 1.43,
    beta: 0.62,
    high52w: 606.37,
    low52w: 436.38,
    shortFloat: 0.81,
    nextEarnings: 'Oct 15, 2026',
    sparkline: [591.5, 590.2, 589.8, 590.4, 588.9, 588.2, 588.60],
    rsi: 48.6,
    signal: 'Hold'
  },
  {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    industry: 'Oil & Gas Integrated',
    price: 122.30,
    change: -1.45,
    changePercent: -1.17,
    open: 124.00,
    high: 124.40,
    low: 121.80,
    previousClose: 123.75,
    volume: 14500000,
    avgVolume: 16800000,
    marketCap: 488.6,
    peRatio: 14.5,
    forwardPe: 13.1,
    eps: 8.43,
    dividendYield: 3.11,
    beta: 0.98,
    high52w: 126.34,
    low52w: 95.77,
    shortFloat: 1.18,
    nextEarnings: 'Nov 01, 2026',
    sparkline: [123.6, 123.2, 122.8, 122.9, 122.4, 122.1, 122.30],
    rsi: 46.2,
    signal: 'Hold'
  },
  {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer Staples',
    industry: 'Discount Stores',
    price: 81.20,
    change: 0.65,
    changePercent: 0.81,
    open: 80.60,
    high: 81.45,
    low: 80.35,
    previousClose: 80.55,
    volume: 14200000,
    avgVolume: 17100000,
    marketCap: 651.9,
    peRatio: 33.2,
    forwardPe: 29.8,
    eps: 2.45,
    dividendYield: 1.02,
    beta: 0.54,
    high52w: 82.10,
    low52w: 49.85,
    shortFloat: 0.75,
    nextEarnings: 'Nov 19, 2026',
    sparkline: [80.5, 80.7, 80.9, 81.0, 81.1, 81.15, 81.20],
    rsi: 63.1,
    signal: 'Buy'
  }
];

export const SECTOR_HEATMAP_DATA: SectorNode[] = [
  {
    id: 'tech',
    name: 'Technology',
    weight: 31.4,
    changePercent: 2.14,
    companies: [
      { ticker: 'NVDA', name: 'NVIDIA', marketCap: 3315, changePercent: 3.81, price: 134.85 },
      { ticker: 'AAPL', name: 'Apple', marketCap: 3465, changePercent: 0.95, price: 228.40 },
      { ticker: 'MSFT', name: 'Microsoft', marketCap: 3112, changePercent: 0.82, price: 418.90 },
      { ticker: 'AVGO', name: 'Broadcom', marketCap: 834, changePercent: 2.17, price: 178.60 },
      { ticker: 'AMD', name: 'AMD', marketCap: 272, changePercent: 3.32, price: 168.20 },
      { ticker: 'PLTR', name: 'Palantir', marketCap: 96, changePercent: 5.12, price: 43.15 }
    ]
  },
  {
    id: 'comm',
    name: 'Communication Services',
    weight: 12.2,
    changePercent: 1.58,
    companies: [
      { ticker: 'GOOGL', name: 'Alphabet', marketCap: 2068, changePercent: 1.15, price: 167.40 },
      { ticker: 'META', name: 'Meta', marketCap: 1502, changePercent: 2.00, price: 592.10 },
      { ticker: 'NFLX', name: 'Netflix', marketCap: 310, changePercent: 1.84, price: 712.50 }
    ]
  },
  {
    id: 'cons_disc',
    name: 'Consumer Discretionary',
    weight: 10.5,
    changePercent: 0.42,
    companies: [
      { ticker: 'AMZN', name: 'Amazon', marketCap: 1940, changePercent: 1.55, price: 186.20 },
      { ticker: 'TSLA', name: 'Tesla', marketCap: 792, changePercent: -1.70, price: 248.50 },
      { ticker: 'HD', name: 'Home Depot', marketCap: 405, changePercent: 0.38, price: 409.20 }
    ]
  },
  {
    id: 'fin',
    name: 'Financials',
    weight: 13.1,
    changePercent: 0.52,
    companies: [
      { ticker: 'JPM', name: 'JPMorgan Chase', marketCap: 634, changePercent: 0.64, price: 221.80 },
      { ticker: 'V', name: 'Visa', marketCap: 568, changePercent: 0.40, price: 278.40 },
      { ticker: 'MA', name: 'Mastercard', marketCap: 462, changePercent: 0.58, price: 498.10 },
      { ticker: 'BAC', name: 'Bank of America', marketCap: 320, changePercent: 0.28, price: 41.30 }
    ]
  },
  {
    id: 'health',
    name: 'Healthcare',
    weight: 11.8,
    changePercent: 0.48,
    companies: [
      { ticker: 'LLY', name: 'Eli Lilly', marketCap: 849, changePercent: 1.11, price: 894.20 },
      { ticker: 'UNH', name: 'UnitedHealth', marketCap: 541, changePercent: -0.54, price: 588.60 },
      { ticker: 'JNJ', name: 'Johnson & Johnson', marketCap: 388, changePercent: 0.15, price: 162.40 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    weight: 3.9,
    changePercent: -1.05,
    companies: [
      { ticker: 'XOM', name: 'Exxon Mobil', marketCap: 488, changePercent: -1.17, price: 122.30 },
      { ticker: 'CVX', name: 'Chevron', marketCap: 280, changePercent: -0.88, price: 151.40 }
    ]
  },
  {
    id: 'cons_stap',
    name: 'Consumer Staples',
    weight: 5.8,
    changePercent: 0.62,
    companies: [
      { ticker: 'WMT', name: 'Walmart', marketCap: 651, changePercent: 0.81, price: 81.20 },
      { ticker: 'COST', name: 'Costco', marketCap: 402, changePercent: 0.94, price: 906.50 },
      { ticker: 'PG', name: 'Procter & Gamble', marketCap: 406, changePercent: 0.22, price: 172.80 }
    ]
  },
  {
    id: 'indust',
    name: 'Industrials',
    weight: 8.5,
    changePercent: 0.31,
    companies: [
      { ticker: 'CAT', name: 'Caterpillar', marketCap: 194, changePercent: 0.45, price: 395.20 },
      { ticker: 'GE', name: 'GE Aerospace', marketCap: 205, changePercent: 0.65, price: 188.70 },
      { ticker: 'UNP', name: 'Union Pacific', marketCap: 148, changePercent: -0.12, price: 242.10 }
    ]
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    headline: 'Semiconductor Index Hits All-Time High as Hyperscalers Accelerate AI CapEx Guidance',
    source: 'Bloomberg Markets',
    timestamp: '8m ago',
    tickers: ['NVDA', 'AMD', 'AVGO'],
    category: 'Tech & AI',
    sentiment: 'BULLISH',
    sentimentScore: 0.88,
    summary: 'Cloud providers signaled an additional $14B in custom compute infrastructure spend for Q4, pushing semiconductor supplier order books into historic multi-quarter backlogs.'
  },
  {
    id: 'news-2',
    headline: 'Federal Reserve Minutes: FOMC Members Signal Measured 25bps Rate Trajectory Amid Soft Landing',
    source: 'Reuters Macro',
    timestamp: '24m ago',
    tickers: ['SPY', 'QQQ'],
    category: 'Macro',
    sentiment: 'BULLISH',
    sentimentScore: 0.72,
    summary: 'Minutes confirmed broad consensus that balance sheet runoff is progressing smoothly, with disinflation in shelter metrics providing runway for steady monetary easing.'
  },
  {
    id: 'news-3',
    headline: 'Eli Lilly Receives Priority FDA Review for Expanded GLP-1 Cardiovascular Indication',
    source: 'BioPharma Wire',
    timestamp: '42m ago',
    tickers: ['LLY'],
    category: 'Earnings',
    sentiment: 'BULLISH',
    sentimentScore: 0.84,
    summary: 'The expedited designation could accelerate label extension by 6 months, expanding the addressable patient demographic across commercial medicare plans.'
  },
  {
    id: 'news-4',
    headline: 'Crude Futures Retreat Below $74 as Global Inventories Expand Beyond Forecasts',
    source: 'Dow Jones Newswires',
    timestamp: '1h ago',
    tickers: ['XOM', 'CVX'],
    category: 'Macro',
    sentiment: 'BEARISH',
    sentimentScore: -0.58,
    summary: 'EIA reports a 3.8 million barrel inventory build against expectations of a 1.2 million draw, pressuring upstream exploration margins.'
  },
  {
    id: 'news-5',
    headline: 'Palantir Awarded $480M Defense Modernization Expansion for AI Tactical Edge Systems',
    source: 'SEC 8-K Feed',
    timestamp: '1h 30m ago',
    tickers: ['PLTR'],
    category: 'SEC Filing',
    sentiment: 'BULLISH',
    sentimentScore: 0.91,
    summary: 'Form 8-K confirms execution of multi-year prototype transition contract, expanding enterprise seat deployment across unified combatant commands.'
  },
  {
    id: 'news-6',
    headline: 'Morgan Stanley Upgrades Meta to Overweight with $650 Target on Llama Monetization',
    source: 'Wall Street Research',
    timestamp: '2h ago',
    tickers: ['META'],
    category: 'Rating Upgrade',
    sentiment: 'BULLISH',
    sentimentScore: 0.81,
    summary: 'Analysts highlight enterprise API adoption and enhanced ad targeting ROAS as catalysts for margin expansion through FY2027.'
  }
];

export const INITIAL_ANALYST_CONSENSUS: Record<string, AnalystConsensus> = {
  NVDA: {
    targetHigh: 175.00,
    targetMean: 152.40,
    targetLow: 120.00,
    buyCount: 38,
    holdCount: 3,
    sellCount: 1,
    consensusScore: 'Strong Buy',
    analystCoverage: 42
  },
  AAPL: {
    targetHigh: 260.00,
    targetMean: 242.00,
    targetLow: 185.00,
    buyCount: 26,
    holdCount: 12,
    sellCount: 2,
    consensusScore: 'Moderate Buy',
    analystCoverage: 40
  },
  MSFT: {
    targetHigh: 500.00,
    targetMean: 472.50,
    targetLow: 400.00,
    buyCount: 34,
    holdCount: 4,
    sellCount: 0,
    consensusScore: 'Strong Buy',
    analystCoverage: 38
  },
  META: {
    targetHigh: 650.00,
    targetMean: 618.00,
    targetLow: 520.00,
    buyCount: 36,
    holdCount: 4,
    sellCount: 1,
    consensusScore: 'Strong Buy',
    analystCoverage: 41
  },
  TSLA: {
    targetHigh: 310.00,
    targetMean: 235.00,
    targetLow: 115.00,
    buyCount: 14,
    holdCount: 16,
    sellCount: 9,
    consensusScore: 'Hold',
    analystCoverage: 39
  },
  AMD: {
    targetHigh: 210.00,
    targetMean: 188.00,
    targetLow: 140.00,
    buyCount: 29,
    holdCount: 8,
    sellCount: 1,
    consensusScore: 'Buy',
    analystCoverage: 38
  }
};

// Generates high-fidelity historical candle bars for any stock and timeframe
export function generateCandleData(basePrice: number, range: string): CandleDataPoint[] {
  let count = 60;
  let volatility = basePrice * 0.008;
  let trend = 0.0004;

  if (range === '1D') {
    count = 48; // 5-minute bars for today
    volatility = basePrice * 0.003;
  } else if (range === '5D') {
    count = 60; // 30-minute bars
    volatility = basePrice * 0.006;
  } else if (range === '1M') {
    count = 30; // Daily bars
    volatility = basePrice * 0.012;
  } else if (range === '6M') {
    count = 75;
    volatility = basePrice * 0.018;
  } else if (range === 'YTD' || range === '1Y') {
    count = 100;
    volatility = basePrice * 0.022;
  } else {
    count = 120;
    volatility = basePrice * 0.030;
  }

  const candles: CandleDataPoint[] = [];
  let currentPrice = basePrice * (1 - (trend * count * 0.6));

  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isUp = Math.random() > 0.46;
    const delta = (Math.random() * volatility * (isUp ? 1.05 : -0.95)) + (trend * basePrice);
    const open = Math.round(currentPrice * 100) / 100;
    const close = Math.round((open + delta) * 100) / 100;
    const high = Math.round((Math.max(open, close) + Math.random() * volatility * 0.6) * 100) / 100;
    const low = Math.round((Math.min(open, close) - Math.random() * volatility * 0.6) * 100) / 100;
    const volume = Math.round(150000 + Math.random() * 850000 * (Math.abs(delta) / volatility + 0.5));

    let timeLabel = '';
    if (range === '1D') {
      const barDate = new Date(now.getTime() - (count - i) * 5 * 60 * 1000);
      timeLabel = barDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const barDate = new Date(now.getTime() - (count - i) * 24 * 60 * 60 * 1000);
      timeLabel = barDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    candles.push({
      time: timeLabel,
      open,
      high,
      low,
      close,
      volume
    });

    currentPrice = close;
  }

  // Ensure last candle close is exactly basePrice
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

// Generate realistic Level-2 Order Book ladder
export function generateOrderBook(currentPrice: number): OrderBook {
  const tickSize = currentPrice > 100 ? 0.05 : 0.01;
  const bids = [];
  const asks = [];

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 1; i <= 8; i++) {
    const bidPrice = Math.round((currentPrice - i * tickSize) * 100) / 100;
    const bidSize = Math.round(200 + Math.random() * 1800);
    bidTotal += bidSize;
    bids.push({ price: bidPrice, size: bidSize, total: bidTotal });

    const askPrice = Math.round((currentPrice + i * tickSize) * 100) / 100;
    const askSize = Math.round(200 + Math.random() * 1800);
    askTotal += askSize;
    asks.push({ price: askPrice, size: askSize, total: askTotal });
  }

  const bestBid = bids[0].price;
  const bestAsk = asks[0].price;
  const spread = Math.round((bestAsk - bestBid) * 100) / 100;
  const spreadPercent = Math.round((spread / currentPrice) * 10000) / 100;

  return {
    bids,
    asks,
    spread,
    spreadPercent
  };
}
