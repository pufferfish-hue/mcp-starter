import React, { useState } from 'react';
import { StockQuote } from '../types/market';
import { X, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockQuote[];
  defaultTicker: string;
  cashBalance: number;
  onExecuteTrade: (params: {
    ticker: string;
    type: 'BUY' | 'SELL';
    shares: number;
    price: number;
  }) => boolean;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stocks,
  defaultTicker,
  cashBalance,
  onExecuteTrade,
}) => {
  const [ticker, setTicker] = useState(defaultTicker || 'NVDA');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStock = stocks.find((s) => s.ticker === ticker) || stocks[0];
  const executionPrice = orderType === 'LIMIT' && limitPrice > 0 ? limitPrice : currentStock.price;
  const totalAmount = shares * executionPrice;

  const handleQuickPercent = (pct: number) => {
    if (orderSide === 'BUY' && executionPrice > 0) {
      const maxShares = Math.floor((cashBalance * (pct / 100)) / executionPrice);
      setShares(Math.max(maxShares, 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) {
      setFeedback('Invalid share count');
      return;
    }

    if (orderSide === 'BUY' && totalAmount > cashBalance) {
      setFeedback('Insufficient buying power');
      return;
    }

    const success = onExecuteTrade({
      ticker: currentStock.ticker,
      type: orderSide,
      shares,
      price: executionPrice,
    });

    if (success) {
      setFeedback('Order filled successfully!');
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white border border-[#e0e3eb] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center justify-between bg-[#faf9ff]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2962ff] text-white flex items-center justify-center text-xs font-mono font-bold">
              {currentStock.ticker.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181b24]">Institutional Order Ticket</h3>
              <div className="text-[11px] text-[#5a5e6b] font-mono">${currentStock.ticker} · ${currentStock.price.toFixed(2)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5a5e6b] hover:text-[#181b24] hover:bg-[#ebedfa] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Buy / Sell Segmented Selector */}
          <div className="grid grid-cols-2 p-1 bg-[#f1f3ff] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setOrderSide('BUY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                orderSide === 'BUY'
                  ? 'bg-[#089981] text-white shadow-2xs'
                  : 'text-[#5a5e6b] hover:text-[#181b24]'
              }`}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              onClick={() => setOrderSide('SELL')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                orderSide === 'SELL'
                  ? 'bg-[#f23645] text-white shadow-2xs'
                  : 'text-[#5a5e6b] hover:text-[#181b24]'
              }`}
            >
              SELL / SHORT
            </button>
          </div>

          {/* Ticker selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5a5e6b]">Instrument</label>
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full p-2 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg font-mono font-bold text-xs text-[#181b24]"
            >
              {stocks.map((s) => (
                <option key={s.ticker} value={s.ticker}>
                  {s.ticker} - {s.name} (${s.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Order Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5a5e6b]">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
                className="w-full p-2 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg text-xs font-medium"
              >
                <option value="MARKET">Market Execution</option>
                <option value="LIMIT">Limit Order</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5a5e6b]">
                {orderType === 'LIMIT' ? 'Limit Price ($)' : 'Estimated Price'}
              </label>
              {orderType === 'LIMIT' ? (
                <input
                  type="number"
                  step="0.05"
                  value={limitPrice || currentStock.price}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg font-mono text-xs font-semibold"
                />
              ) : (
                <div className="p-2 bg-[#f1f3ff] rounded-lg font-mono text-xs font-bold text-[#181b24]">
                  ${currentStock.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#5a5e6b]">
              <span className="font-semibold">Quantity (Shares)</span>
              <span className="font-mono">Buying Power: ${cashBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={shares}
                onChange={(e) => setShares(Math.max(parseInt(e.target.value) || 1, 1))}
                className="flex-1 p-2 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg font-mono font-bold text-xs"
              />
              <div className="flex items-center gap-1">
                {[25, 50, 100].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleQuickPercent(p)}
                    className="px-2 py-1.5 text-[11px] font-mono bg-[#f1f3ff] hover:bg-[#ebedfa] text-[#434656] rounded transition-colors"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculation summary */}
          <div className="p-3 bg-[#faf9ff] border border-[#e0e3eb] rounded-xl space-y-1 text-xs font-mono">
            <div className="flex justify-between text-[#5a5e6b]">
              <span>Estimated Value:</span>
              <span className="text-[#181b24] font-bold">
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#5a5e6b]">
              <span>Exchange Fee / Commission:</span>
              <span className="text-[#089981] font-bold">$0.00 FREE</span>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                feedback.includes('success')
                  ? 'bg-[#089981]/10 text-[#089981] font-bold'
                  : 'bg-[#f23645]/10 text-[#f23645]'
              }`}
            >
              {feedback.includes('success') ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{feedback}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] ${
              orderSide === 'BUY'
                ? 'bg-[#089981] hover:bg-[#067a67]'
                : 'bg-[#f23645] hover:bg-[#c92533]'
            }`}
          >
            <span>{orderSide === 'BUY' ? 'Execute Buy Order' : 'Execute Sell Order'}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
