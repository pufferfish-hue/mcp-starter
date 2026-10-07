import React, { useState, useEffect } from 'react';
import { StockQuote, MarketIndex } from '../types/market';
import { Search, X, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectTicker: (ticker: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectTicker,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredStocks = stocks.filter(
    (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#e0e3eb] flex items-center gap-3 bg-[#faf9ff]">
          <Search className="w-4 h-4 text-[#5a5e6b] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company name, or sector (e.g. NVDA, Apple, Tech)..."
            className="w-full bg-transparent text-sm focus:outline-none text-[#181b24] placeholder:text-[#737687]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5a5e6b] hover:text-[#181b24] hover:bg-[#ebedfa] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#f0f3fa] p-1">
          {filteredStocks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5a5e6b]">
              No instruments found matching &quot;{query}&quot;.
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const isUp = stock.changePercent >= 0;

              return (
                <div
                  key={stock.ticker}
                  onClick={() => {
                    onSelectTicker(stock.ticker);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#ebedfa]/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f3ff] text-[#2962ff] flex items-center justify-center font-mono font-bold text-xs">
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#181b24] group-hover:text-[#2962ff] transition-colors">
                          {stock.ticker}
                        </span>
                        <span className="text-xs text-[#5a5e6b]">{stock.name}</span>
                      </div>
                      <div className="text-[11px] text-[#737687]">{stock.sector} · {stock.industry}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-semibold text-[#181b24]">${stock.price.toFixed(2)}</div>
                    <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isUp ? <TrendingUp className="w-3 h-3 stroke-[2.5]" /> : <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
                      {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-[#f8f9fd] border-t border-[#e0e3eb] flex items-center justify-between text-[11px] text-[#5a5e6b] font-mono">
          <span>Press ESC to dismiss</span>
          <span>Tab / Click to select</span>
        </div>
      </div>
    </div>
  );
};
