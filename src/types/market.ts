export type TimeRange = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';
export type ChartType = 'candlestick' | 'line' | 'area';
export type ActiveTab = 'overview' | 'chart' | 'screener' | 'heatmap' | 'intelligence' | 'portfolio';

export interface StockQuote {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  marketCap: number; // in billions
  peRatio: number;
  forwardPe: number;
  eps: number;
  dividendYield: number;
  beta: number;
  high52w: number;
  low52w: number;
  shortFloat: number;
  nextEarnings: string;
  sparkline: number[];
  rsi: number;
  signal: 'Strong Buy' | 'Buy' | 'Hold' | 'Take Profit' | 'Oversold Breakout';
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sparkline: number[];
  category: 'EQUITY' | 'BONDS' | 'VOLATILITY' | 'CRYPTO';
}

export interface CandleDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
}

export interface AnalystConsensus {
  targetHigh: number;
  targetMean: number;
  targetLow: number;
  buyCount: number;
  holdCount: number;
  sellCount: number;
  consensusScore: string; // e.g. "Strong Buy"
  analystCoverage: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  tickers: string[];
  category: 'Macro' | 'Earnings' | 'SEC Filing' | 'Rating Upgrade' | 'Tech & AI';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore: number; // e.g. +0.82
  summary: string;
  url?: string;
}

export interface SectorNode {
  id: string;
  name: string;
  weight: number; // percentage of total
  changePercent: number;
  companies: {
    ticker: string;
    name: string;
    marketCap: number;
    changePercent: number;
    price: number;
  }[];
}

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalCost: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface TradeOrder {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  shares: number;
  price: number;
  timestamp: string;
  status: 'FILLED' | 'PENDING';
  total: number;
}

export interface PriceAlert {
  id: string;
  ticker: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  triggered: boolean;
}
