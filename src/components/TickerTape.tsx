import React from 'react';
import { StockQuote, MarketIndex } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectTicker: (ticker: string) => void;
  flashingTickers: Record<string, 'up' | 'down'>;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  stocks,
  indices,
  onSelectTicker,
  flashingTickers,
}) => {
  // Combine index highlights and top stocks for the tape
  const items = [
    ...indices.slice(0, 3).map((idx) => ({
      key: idx.symbol,
      symbol: idx.symbol,
      price: idx.price,
      changePercent: idx.changePercent,
      isIndex: true,
    })),
    ...stocks.slice(0, 10).map((s) => ({
      key: s.ticker,
      symbol: s.ticker,
      price: s.price,
      changePercent: s.changePercent,
      isIndex: false,
    })),
  ];

  return (
    <div className="w-full bg-[#ffffff] border-b border-[#e0e3eb] overflow-x-auto no-scrollbar py-1.5 px-4">
      <div className="max-w-[1440px] mx-auto flex items-center gap-6 min-w-max text-xs">
        {items.map((item) => {
          const isUp = item.changePercent >= 0;
          const flash = flashingTickers[item.symbol];

          return (
            <button
              key={item.key}
              onClick={() => onSelectTicker(item.symbol)}
              className={`flex items-center gap-2 py-0.5 px-2 rounded hover:bg-[#ebedfa]/60 transition-colors text-left group ${
                flash === 'up'
                  ? 'bg-[#089981]/10'
                  : flash === 'down'
                  ? 'bg-[#f23645]/10'
                  : ''
              }`}
            >
              <span className="font-semibold text-[#181b24] group-hover:text-[#2962ff] transition-colors">
                {item.symbol}
              </span>
              <span className="font-mono text-[#181b24] font-medium">
                {item.price > 1000
                  ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : item.price.toFixed(2)}
              </span>
              <span
                className={`font-mono text-[11px] font-medium flex items-center gap-0.5 ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                )}
                {isUp ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
