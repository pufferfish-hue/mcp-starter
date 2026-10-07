/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, StockQuote, MarketIndex, PortfolioPosition, TradeOrder, PriceAlert } from './types/market';
import { INITIAL_INDICES, INITIAL_STOCKS, INITIAL_NEWS } from './data/marketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { OverviewView } from './components/OverviewView';
import { ChartView } from './components/ChartView';
import { ScreenerView } from './components/ScreenerView';
import { HeatmapView } from './components/HeatmapView';
import { IntelligenceView } from './components/IntelligenceView';
import { PortfolioView } from './components/PortfolioView';
import { TradeModal } from './components/TradeModal';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'MSFT', 'META', 'PLTR']);

  // Portfolio state
  const [cashBalance, setCashBalance] = useState<number>(34820.00);
  const [positions, setPositions] = useState<PortfolioPosition[]>([
    {
      ticker: 'NVDA',
      shares: 150,
      avgCost: 112.50,
      currentPrice: 134.85,
      totalCost: 16875.00,
      marketValue: 20227.50,
      unrealizedPnL: 3352.50,
      unrealizedPnLPercent: 19.87,
    },
    {
      ticker: 'AAPL',
      shares: 80,
      avgCost: 215.20,
      currentPrice: 228.40,
      totalCost: 17216.00,
      marketValue: 18272.00,
      unrealizedPnL: 1056.00,
      unrealizedPnLPercent: 6.13,
    },
    {
      ticker: 'MSFT',
      shares: 45,
      avgCost: 402.10,
      currentPrice: 418.90,
      totalCost: 18094.50,
      marketValue: 18850.50,
      unrealizedPnL: 756.00,
      unrealizedPnLPercent: 4.18,
    },
  ]);

  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([
    {
      id: 'ord-101',
      ticker: 'NVDA',
      type: 'BUY',
      orderType: 'MARKET',
      shares: 50,
      price: 112.50,
      timestamp: 'Today, 09:32 EST',
      status: 'FILLED',
      total: 5625.00,
    },
    {
      id: 'ord-102',
      ticker: 'PLTR',
      type: 'BUY',
      orderType: 'LIMIT',
      shares: 200,
      price: 38.40,
      timestamp: 'Yesterday, 14:15 EST',
      status: 'FILLED',
      total: 7680.00,
    },
  ]);

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-1',
      ticker: 'NVDA',
      targetPrice: 140.00,
      condition: 'ABOVE',
      createdAt: 'Today 09:40 EST',
      triggered: false,
    },
    {
      id: 'alt-2',
      ticker: 'AAPL',
      targetPrice: 225.00,
      condition: 'BELOW',
      createdAt: 'Today 10:15 EST',
      triggered: false,
    },
  ]);

  // Modals & Tick Stream
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [flashingTickers, setFlashingTickers] = useState<Record<string, 'up' | 'down'>>({});
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTradeOpen, setIsTradeOpen] = useState<boolean>(false);
  const [tradeDefaultTicker, setTradeDefaultTicker] = useState<string>('NVDA');

  // Trigger Notification Toast simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  }, []);

  // Keyboard shortcut listener for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick 1 to 2 random stocks to tick
      const randomIndex = Math.floor(Math.random() * stocks.length);
      const stock = stocks[randomIndex];
      const deltaPercent = (Math.random() * 0.4 - 0.19) / 100; // -0.19% to +0.21%
      const newPrice = Math.round((stock.price * (1 + deltaPercent)) * 100) / 100;
      const isTickUp = newPrice >= stock.price;

      setStocks((prev) =>
        prev.map((s, idx) => {
          if (idx !== randomIndex) return s;
          const newChg = Math.round((s.change + (newPrice - s.price)) * 100) / 100;
          const newChgPct = Math.round((newChg / s.previousClose) * 10000) / 100;
          const updatedSparkline = [...s.sparkline.slice(1), newPrice];

          return {
            ...s,
            price: newPrice,
            change: newChg,
            changePercent: newChgPct,
            high: Math.max(s.high, newPrice),
            low: Math.min(s.low, newPrice),
            sparkline: updatedSparkline,
          };
        })
      );

      // Flash ticker highlight
      setFlashingTickers((prev) => ({
        ...prev,
        [stock.ticker]: isTickUp ? 'up' : 'down',
      }));

      setTimeout(() => {
        setFlashingTickers((prev) => {
          const next = { ...prev };
          delete next[stock.ticker];
          return next;
        });
      }, 700);

      // Update positions mark-to-market
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          if (pos.ticker !== stock.ticker) return pos;
          const marketValue = pos.shares * newPrice;
          const unrealizedPnL = marketValue - pos.totalCost;
          const unrealizedPnLPercent = (unrealizedPnL / pos.totalCost) * 100;
          return {
            ...pos,
            currentPrice: newPrice,
            marketValue,
            unrealizedPnL,
            unrealizedPnLPercent,
          };
        })
      );

      // Check alerts
      setAlerts((prevAlerts) =>
        prevAlerts.map((alt) => {
          if (alt.ticker === stock.ticker && !alt.triggered) {
            const conditionMet =
              alt.condition === 'ABOVE'
                ? newPrice >= alt.targetPrice
                : newPrice <= alt.targetPrice;
            if (conditionMet) {
              showToast(`🔔 Price Alert Triggered: ${alt.ticker} reached $${newPrice.toFixed(2)} (${alt.condition === 'ABOVE' ? 'Above' : 'Below'} $${alt.targetPrice.toFixed(2)})`);
              return { ...alt, triggered: true };
            }
          }
          return alt;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, stocks, showToast]);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab('chart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTradeForTicker = (ticker: string) => {
    setTradeDefaultTicker(ticker);
    setIsTradeOpen(true);
  };

  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  const handleExecuteTrade = (params: {
    ticker: string;
    type: 'BUY' | 'SELL';
    shares: number;
    price: number;
  }): boolean => {
    const totalAmount = params.shares * params.price;

    if (params.type === 'BUY') {
      if (totalAmount > cashBalance) return false;
      setCashBalance((prev) => prev - totalAmount);

      setPositions((prev) => {
        const existing = prev.find((p) => p.ticker === params.ticker);
        if (existing) {
          const newShares = existing.shares + params.shares;
          const newTotalCost = existing.totalCost + totalAmount;
          const newAvgCost = newTotalCost / newShares;
          const marketVal = newShares * params.price;
          const pnl = marketVal - newTotalCost;
          return prev.map((p) =>
            p.ticker === params.ticker
              ? {
                  ...p,
                  shares: newShares,
                  avgCost: newAvgCost,
                  totalCost: newTotalCost,
                  currentPrice: params.price,
                  marketValue: marketVal,
                  unrealizedPnL: pnl,
                  unrealizedPnLPercent: (pnl / newTotalCost) * 100,
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              ticker: params.ticker,
              shares: params.shares,
              avgCost: params.price,
              currentPrice: params.price,
              totalCost: totalAmount,
              marketValue: totalAmount,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
            },
          ];
        }
      });
    } else {
      // SELL
      setCashBalance((prev) => prev + totalAmount);
      setPositions((prev) => {
        const existing = prev.find((p) => p.ticker === params.ticker);
        if (!existing) return prev;
        if (existing.shares <= params.shares) {
          return prev.filter((p) => p.ticker !== params.ticker);
        } else {
          const newShares = existing.shares - params.shares;
          const newTotalCost = existing.avgCost * newShares;
          const marketVal = newShares * params.price;
          const pnl = marketVal - newTotalCost;
          return prev.map((p) =>
            p.ticker === params.ticker
              ? {
                  ...p,
                  shares: newShares,
                  totalCost: newTotalCost,
                  currentPrice: params.price,
                  marketValue: marketVal,
                  unrealizedPnL: pnl,
                  unrealizedPnLPercent: (pnl / newTotalCost) * 100,
                }
              : p
          );
        }
      });
    }

    // Add to trade history
    const newOrder: TradeOrder = {
      id: `ord-${Date.now()}`,
      ticker: params.ticker,
      type: params.type,
      orderType: 'MARKET',
      shares: params.shares,
      price: params.price,
      timestamp: 'Just now',
      status: 'FILLED',
      total: totalAmount,
    };
    setTradeHistory((prev) => [newOrder, ...prev]);
    showToast(`Order Confirmed: ${params.type} ${params.shares} shs of ${params.ticker} @ $${params.price.toFixed(2)}`);

    return true;
  };

  const handleClosePosition = (ticker: string) => {
    const pos = positions.find((p) => p.ticker === ticker);
    if (!pos) return;
    const currentStock = stocks.find((s) => s.ticker === ticker);
    const price = currentStock ? currentStock.price : pos.currentPrice;
    handleExecuteTrade({
      ticker,
      type: 'SELL',
      shares: pos.shares,
      price,
    });
  };

  const handleAddAlert = (ticker: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      ticker,
      targetPrice,
      condition,
      createdAt: 'Just now',
      triggered: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert Set: Trigger when ${ticker} is ${condition} $${targetPrice.toFixed(2)}`);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const selectedStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0];

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#181b24] flex flex-col">
      {/* Institutional Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrade={() => {
          setTradeDefaultTicker(selectedTicker);
          setIsTradeOpen(true);
        }}
        alertsCount={alerts.filter((a) => !a.triggered).length}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
      />

      {/* Real-time Ticker Tape Ribbon */}
      <TickerTape
        stocks={stocks}
        indices={indices}
        onSelectTicker={handleSelectTicker}
        flashingTickers={flashingTickers}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#181b24] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#434656] text-xs font-mono animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#c3c5d8] hover:text-white ml-2 text-base font-sans"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            indices={indices}
            stocks={stocks}
            news={INITIAL_NEWS}
            onSelectTicker={handleSelectTicker}
            onOpenTradeForTicker={handleOpenTradeForTicker}
          />
        )}

        {activeTab === 'chart' && (
          <ChartView
            selectedStock={selectedStock}
            allStocks={stocks}
            onSelectTicker={handleSelectTicker}
            onOpenTrade={() => {
              setTradeDefaultTicker(selectedStock.ticker);
              setIsTradeOpen(true);
            }}
          />
        )}

        {activeTab === 'screener' && (
          <ScreenerView
            stocks={stocks}
            onSelectTicker={handleSelectTicker}
            onOpenTradeForTicker={handleOpenTradeForTicker}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {activeTab === 'heatmap' && (
          <HeatmapView onSelectTicker={handleSelectTicker} />
        )}

        {activeTab === 'intelligence' && (
          <IntelligenceView
            news={INITIAL_NEWS}
            stocks={stocks}
            onSelectTicker={handleSelectTicker}
            onOpenTradeForTicker={handleOpenTradeForTicker}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            cashBalance={cashBalance}
            positions={positions}
            tradeHistory={tradeHistory}
            alerts={alerts}
            stocks={stocks}
            onOpenTrade={() => {
              setTradeDefaultTicker(selectedTicker);
              setIsTradeOpen(true);
            }}
            onClosePosition={handleClosePosition}
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
            onSelectTicker={handleSelectTicker}
          />
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        indices={indices}
        onSelectTicker={handleSelectTicker}
      />

      <TradeModal
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        stocks={stocks}
        defaultTicker={tradeDefaultTicker}
        cashBalance={cashBalance}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-[#e0e3eb] bg-[#ffffff] py-4 px-6 text-xs text-[#5a5e6b]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#181b24]">Market Intelligence System</span>
            <span aria-hidden="true">·</span>
            <span>Institutional Real-Time Equity & Derivatives Analytics</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>UTC TIMESTAMP: {new Date().toISOString().slice(0, 19)}Z</span>
            <span className="hidden md:inline text-[#c3c5d8]">|</span>
            <span className="hidden md:inline text-[#089981]">SYSTEM STATUS: NORMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
