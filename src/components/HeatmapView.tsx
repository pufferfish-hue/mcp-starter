import React, { useState } from 'react';
import { SectorNode } from '../types/market';
import { SECTOR_HEATMAP_DATA } from '../data/marketData';
import { TrendingUp, TrendingDown, LayoutGrid, Info } from 'lucide-react';

interface HeatmapViewProps {
  onSelectTicker: (ticker: string) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onSelectTicker }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [hoveredCompany, setHoveredCompany] = useState<{
    ticker: string;
    name: string;
    price: number;
    changePercent: number;
    marketCap: number;
    sector: string;
  } | null>(null);

  // Timeframe multiplier for demo richness
  const getMultiplier = (tf: string) => {
    if (tf === '1W') return 1.8;
    if (tf === '1M') return 3.4;
    if (tf === 'YTD') return 7.2;
    return 1.0;
  };

  const mult = getMultiplier(timeframe);

  // Determine heatmap background color based on % change
  const getHeatmapColor = (pct: number) => {
    const val = pct * mult;
    if (val >= 4.0) return 'bg-[#089981] text-white';
    if (val >= 2.0) return 'bg-[#089981]/90 text-white';
    if (val >= 0.8) return 'bg-[#089981]/75 text-white';
    if (val > 0) return 'bg-[#089981]/60 text-white';
    if (val === 0) return 'bg-[#787b86] text-white';
    if (val > -1.0) return 'bg-[#f23645]/60 text-white';
    if (val > -2.5) return 'bg-[#f23645]/80 text-white';
    return 'bg-[#f23645] text-white';
  };

  return (
    <div className="space-y-4">
      {/* Heatmap Controls Bar */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-sm font-bold text-[#181b24]">S&P 500 Sector Map</h2>
          <span className="text-xs text-[#5a5e6b]">· Sized by Market Capitalization</span>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-[#f1f3ff] rounded-lg text-xs">
          {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 font-mono rounded font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-white text-[#2962ff] shadow-2xs font-bold'
                  : 'text-[#5a5e6b] hover:text-[#181b24]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Heatmap Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {SECTOR_HEATMAP_DATA.map((sector) => {
          const sectorChg = sector.changePercent * mult;
          const isUp = sectorChg >= 0;

          return (
            <div
              key={sector.id}
              className="bg-white border border-[#e0e3eb] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0f3fa]">
                <div>
                  <div className="font-bold text-xs text-[#181b24]">{sector.name}</div>
                  <div className="text-[10px] text-[#5a5e6b] font-mono">{sector.weight}% S&P Weight</div>
                </div>
                <span
                  className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? '+' : ''}{sectorChg.toFixed(2)}%
                </span>
              </div>

              {/* Companies Grid Tiles within this sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 flex-1">
                {sector.companies.map((c) => {
                  const chg = c.changePercent * mult;
                  const colorClass = getHeatmapColor(c.changePercent);

                  return (
                    <div
                      key={c.ticker}
                      onClick={() => onSelectTicker(c.ticker)}
                      onMouseEnter={() =>
                        setHoveredCompany({
                          ticker: c.ticker,
                          name: c.name,
                          price: c.price,
                          changePercent: chg,
                          marketCap: c.marketCap,
                          sector: sector.name,
                        })
                      }
                      onMouseLeave={() => setHoveredCompany(null)}
                      className={`p-2 rounded-lg cursor-pointer transition-transform hover:scale-[1.02] flex flex-col justify-between min-h-[72px] shadow-2xs ${colorClass}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-xs">{c.ticker}</span>
                        <span className="font-mono text-[10px] opacity-90">${c.price.toFixed(0)}</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-right">
                        {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating or fixed inspection bar */}
      {hoveredCompany ? (
        <div className="bg-[#181b24] text-white p-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-base text-[#2962ff]">{hoveredCompany.ticker}</span>
            <span className="font-medium">{hoveredCompany.name}</span>
            <span className="text-[#c3c5d8]">·</span>
            <span className="text-[#c3c5d8]">{hoveredCompany.sector}</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <div>Price: <strong className="text-white">${hoveredCompany.price.toFixed(2)}</strong></div>
            <div>
              {timeframe} Shift:{' '}
              <strong className={hoveredCompany.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
                {hoveredCompany.changePercent >= 0 ? '+' : ''}{hoveredCompany.changePercent.toFixed(2)}%
              </strong>
            </div>
            <div>Market Cap: <strong className="text-white">${hoveredCompany.marketCap}B</strong></div>
            <button
              onClick={() => onSelectTicker(hoveredCompany.ticker)}
              className="px-2.5 py-1 bg-[#2962ff] hover:bg-[#0049db] rounded text-white text-xs font-sans font-medium transition-colors"
            >
              Open Terminal Chart
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-[#faf9ff] rounded-xl border border-[#e0e3eb] text-xs text-[#5a5e6b] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#2962ff]" />
            <span>Hover over any tile to preview metrics or click to open full institutional terminal.</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#089981]" /> Gainers</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#f23645]" /> Losers</span>
          </div>
        </div>
      )}
    </div>
  );
};
