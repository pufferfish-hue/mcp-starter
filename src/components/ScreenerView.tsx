import React, { useState, useMemo } from 'react';
import { StockQuote } from '../types/market';
import { Sparkline } from './Sparkline';
import { Search, Star, ArrowUpDown, ArrowUpRight, Filter, ChevronRight } from 'lucide-react';

interface ScreenerViewProps {
  stocks: StockQuote[];
  onSelectTicker: (ticker: string) => void;
  onOpenTradeForTicker: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  stocks,
  onSelectTicker,
  onOpenTradeForTicker,
  watchlist,
  onToggleWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<string>('ALL');
  const [onlyWatchlist, setOnlyWatchlist] = useState<boolean>(false);
  const [sortField, setSortField] = useState<keyof StockQuote>('marketCap');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector)));
    return ['ALL', ...list];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        if (onlyWatchlist && !watchlist.includes(s.ticker)) return false;
        if (selectedSector !== 'ALL' && s.sector !== selectedSector) return false;
        if (selectedSignal !== 'ALL' && s.signal !== selectedSignal) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortAsc ? aVal - bVal : bVal - aVal;
        }
        return sortAsc
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
  }, [stocks, onlyWatchlist, watchlist, selectedSector, selectedSignal, searchQuery, sortField, sortAsc]);

  const handleSort = (field: keyof StockQuote) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Screener Controls Bar */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5a5e6b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ticker or company name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf9ff] border border-[#e0e3eb] rounded-lg focus:outline-none focus:border-[#2962ff] focus:bg-white transition-all text-[#181b24]"
            />
          </div>

          {/* Quick Segmented Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Watchlist toggle */}
            <button
              onClick={() => setOnlyWatchlist(!onlyWatchlist)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                onlyWatchlist
                  ? 'bg-[#2962ff] text-white border-[#2962ff] font-semibold'
                  : 'bg-white text-[#5a5e6b] border-[#e0e3eb] hover:text-[#181b24]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyWatchlist ? 'fill-current' : ''}`} />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            {/* Sector Selector */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-1.5 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg text-xs font-medium text-[#181b24] focus:outline-none focus:border-[#2962ff]"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>

            {/* Signal Selector */}
            <select
              value={selectedSignal}
              onChange={(e) => setSelectedSignal(e.target.value)}
              className="px-2.5 py-1.5 bg-[#faf9ff] border border-[#e0e3eb] rounded-lg text-xs font-medium text-[#181b24] focus:outline-none focus:border-[#2962ff]"
            >
              <option value="ALL">All Technical Signals</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Hold">Hold</option>
              <option value="Oversold Breakout">Oversold Breakout</option>
              <option value="Take Profit">Take Profit</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Tabular Grid */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9fd] border-b border-[#e0e3eb] text-[#5a5e6b] font-semibold">
                <th className="py-2.5 px-3 w-10 text-center">★</th>
                <th
                  onClick={() => handleSort('ticker')}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#181b24] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>TICKER</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">COMPANY & SECTOR</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>PRICE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>24H CHG</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none hidden md:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>VOLUME</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>MARKET CAP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('peRatio')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>P/E (TTM)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rsi')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#181b24] select-none hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>RSI (14)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 hidden xl:table-cell">TECHNICAL SIGNAL</th>
                <th className="py-2.5 px-3 text-center hidden sm:table-cell">7D TREND</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa]">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-[#5a5e6b]">
                    No securities match your screener criteria. Try clearing filters.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const isUp = stock.changePercent >= 0;
                  const isStarred = watchlist.includes(stock.ticker);

                  return (
                    <tr
                      key={stock.ticker}
                      className="hover:bg-[#ebedfa]/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectTicker(stock.ticker)}
                    >
                      {/* Watchlist star */}
                      <td
                        className="py-2 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.ticker);
                        }}
                      >
                        <button className="text-[#c3c5d8] hover:text-[#2962ff] transition-colors">
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#2962ff] text-[#2962ff]' : ''}`} />
                        </button>
                      </td>

                      {/* Ticker */}
                      <td className="py-2.5 px-3 font-mono font-bold text-[#181b24] group-hover:text-[#2962ff] transition-colors">
                        {stock.ticker}
                      </td>

                      {/* Company Name & Sector */}
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-[#181b24] truncate max-w-[150px]">{stock.name}</div>
                        <div className="text-[11px] text-[#5a5e6b] truncate max-w-[150px]">{stock.sector}</div>
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#181b24]">
                        ${stock.price.toFixed(2)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">
                        <span className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#5a5e6b] hidden md:table-cell">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>

                      {/* Market Cap */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#181b24] hidden sm:table-cell">
                        ${stock.marketCap.toFixed(1)}B
                      </td>

                      {/* P/E */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#5a5e6b] hidden lg:table-cell">
                        {stock.peRatio.toFixed(1)}x
                      </td>

                      {/* RSI */}
                      <td className="py-2.5 px-3 text-right font-mono hidden lg:table-cell">
                        <span className={stock.rsi > 70 ? 'text-[#f23645]' : stock.rsi < 30 ? 'text-[#089981]' : 'text-[#5a5e6b]'}>
                          {stock.rsi.toFixed(1)}
                        </span>
                      </td>

                      {/* Signal */}
                      <td className="py-2.5 px-3 hidden xl:table-cell">
                        <span className="text-[11px] font-semibold text-[#181b24] bg-[#f1f3ff] px-2 py-0.5 rounded">
                          {stock.signal}
                        </span>
                      </td>

                      {/* Sparkline */}
                      <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                        <div className="inline-block">
                          <Sparkline data={stock.sparkline} width={70} height={18} isPositive={isUp} />
                        </div>
                      </td>

                      {/* Action */}
                      <td
                        className="py-2.5 px-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onOpenTradeForTicker(stock.ticker)}
                          className="px-2 py-1 text-[11px] font-semibold text-[#2962ff] bg-[#f1f3ff] hover:bg-[#2962ff] hover:text-white rounded transition-colors"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Tabular summary footer */}
        <div className="px-4 py-2 bg-[#f8f9fd] border-t border-[#e0e3eb] flex items-center justify-between text-xs text-[#5a5e6b]">
          <span>Displaying {filteredStocks.length} of {stocks.length} instruments</span>
          <span className="font-mono">Real-Time Data Feed Synchronized</span>
        </div>
      </div>
    </div>
  );
};
