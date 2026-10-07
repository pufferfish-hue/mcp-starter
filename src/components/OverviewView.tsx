import React from 'react';
import { MarketIndex, StockQuote, NewsItem } from '../types/market';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import tradingFloorImg from '../assets/images/nyse_trading_floor_1791340027750.jpg';

interface OverviewViewProps {
  indices: MarketIndex[];
  stocks: StockQuote[];
  news: NewsItem[];
  onSelectTicker: (ticker: string) => void;
  onOpenTradeForTicker: (ticker: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  indices,
  stocks,
  news,
  onSelectTicker,
  onOpenTradeForTicker,
}) => {
  // Derive market movers
  const sortedByChange = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedByChange.slice(0, 4);
  const topLosers = [...sortedByChange].reverse().slice(0, 4);
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 4);

  // Market Breadth simulation
  const advancing = stocks.filter((s) => s.changePercent > 0).length;
  const declining = stocks.filter((s) => s.changePercent < 0).length;
  const unchanged = stocks.length - advancing - declining;
  const advancePercent = Math.round((advancing / stocks.length) * 100);

  const getBadgeStyle = (symbol: string) => {
    if (symbol.includes('NASDAQ')) return 'text-[#0091ff] border-[#0091ff]/20 bg-[#0091ff]/5';
    if (symbol.includes('S&P')) return 'text-[#e91e63] border-[#e91e63]/20 bg-[#e91e63]/5';
    if (symbol.includes('DOW')) return 'text-[#0055ff] border-[#0055ff]/20 bg-[#0055ff]/5';
    return 'text-[#5a5e6b] border-[#e0e3eb] bg-[#f1f3ff]';
  };

  return (
    <div className="space-y-6">
      {/* Editorial Market Lead Banner */}
      <div className="relative rounded-xl border border-[#e0e3eb] bg-white overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-6 lg:p-8 lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5a5e6b]">
              <span className="font-semibold text-[#2962ff]">GLOBAL MACRO BRIEF</span>
              <span aria-hidden="true">·</span>
              <span>U.S. CASH EQUITY SESSION</span>
              <span aria-hidden="true">·</span>
              <span>UPDATED LIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181b24] text-balance">
              Equities Extend Rally as Semis Surge on CapEx Guidance; Yields Moderate
            </h1>

            <p className="text-sm text-[#434656] leading-relaxed max-w-3xl">
              Broad market indices trade higher led by mega-cap technology and semiconductor components. The standard volatility gauge (VIX) compressed below 14.0, while 10-year Treasury yields eased 4bps following disciplined central bank disinflation commentary.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => onSelectTicker('NVDA')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2962ff] text-white font-medium rounded-lg hover:bg-[#0049db] transition-colors"
              >
                Inspect NVDA Terminal <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectTicker('SPY')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f3ff] text-[#181b24] font-medium rounded-lg hover:bg-[#ebedfa] border border-[#e0e3eb] transition-colors"
              >
                View Benchmark S&P 500
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 h-full min-h-[220px] relative border-l border-[#e0e3eb]">
            <img
              src={tradingFloorImg}
              alt="Trading Floor Architecture"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent flex items-end p-4">
              <span className="text-[11px] font-mono text-[#5a5e6b] bg-white/90 backdrop-blur-xs px-2 py-1 rounded border border-[#e0e3eb]">
                FLOOR TERMINAL // NYHQ-01
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Indices Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#181b24]">
              Core Market Benchmarks
            </h2>
            <span className="text-xs text-[#5a5e6b]">· 7 Global Asset Classes</span>
          </div>
          <span className="text-xs font-mono text-[#5a5e6b]">REAL-TIME TICKS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {indices.map((idx) => {
            const isUp = idx.changePercent >= 0;
            return (
              <div
                key={idx.symbol}
                onClick={() => onSelectTicker(idx.symbol === 'S&P 500' ? 'AAPL' : idx.symbol === 'NASDAQ' ? 'NVDA' : 'MSFT')}
                className="bg-white border border-[#e0e3eb] rounded-xl p-3.5 hover:border-[#2962ff]/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle(
                      idx.symbol
                    )}`}
                  >
                    {idx.symbol}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="mb-2">
                  <div className="font-mono text-lg font-bold tracking-tight text-[#181b24] group-hover:text-[#2962ff] transition-colors">
                    {idx.price > 1000
                      ? idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : idx.price.toFixed(3)}
                  </div>
                  <div className="text-[11px] text-[#5a5e6b] truncate">{idx.name}</div>
                </div>

                <div className="pt-2 border-t border-[#f0f3fa] flex items-center justify-between">
                  <Sparkline data={idx.sparkline} width={75} height={20} isPositive={isUp} />
                  <div className="text-right font-mono text-[10px] text-[#5a5e6b]">
                    <span>H: {idx.high > 1000 ? Math.round(idx.high) : idx.high.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Breadth & Sentiment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#181b24]">Market Breadth & Liquidity</h3>
            <span className="text-xs font-mono text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded font-semibold">
              BULLISH ACCUMULATION
            </span>
          </div>

          {/* Advancing / Declining Ratio Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#5a5e6b]">
              <span>Advancing: <strong className="font-mono text-[#089981]">{advancing}</strong></span>
              <span>Declining: <strong className="font-mono text-[#f23645]">{declining}</strong></span>
            </div>
            <div className="w-full h-2.5 bg-[#ebedfa] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${advancePercent}%` }}
                className="bg-[#089981] transition-all duration-500"
              />
              <div
                style={{ width: `${100 - advancePercent}%` }}
                className="bg-[#f23645] transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#5a5e6b] font-mono">
              <span>{advancePercent}% Market Positive</span>
              <span>{100 - advancePercent}% Pullback</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e0e3eb]">
            <div className="bg-[#faf9ff] p-2.5 rounded-lg border border-[#e0e3eb]">
              <div className="text-[11px] text-[#5a5e6b]">Put / Call Ratio</div>
              <div className="font-mono text-base font-bold text-[#181b24]">0.68</div>
              <div className="text-[10px] text-[#089981] font-medium">Risk-On Positioning</div>
            </div>
            <div className="bg-[#faf9ff] p-2.5 rounded-lg border border-[#e0e3eb]">
              <div className="text-[11px] text-[#5a5e6b]">Composite Volume</div>
              <div className="font-mono text-base font-bold text-[#181b24]">10.8B</div>
              <div className="text-[10px] text-[#5a5e6b] font-medium">+14% vs 30D Avg</div>
            </div>
          </div>

          <div className="text-xs text-[#5a5e6b] flex items-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#2962ff]" />
            <span>Institutional order books show 2.8x higher buy-side liquidity clusters near VWAP support.</span>
          </div>
        </div>

        {/* Market Movers: Gainers, Losers, Active */}
        <div className="lg:col-span-8 bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-[#181b24]">High-Frequency Market Movers</h3>
            </div>
            <div className="text-xs text-[#5a5e6b]">NYSE & NASDAQ Equities</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Gainers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#089981] pb-1 border-b border-[#e0e3eb]">
                <span>Top Gainers</span>
                <span>Chg %</span>
              </div>
              <div className="space-y-1.5">
                {topGainers.map((stock) => (
                  <div
                    key={stock.ticker}
                    onClick={() => onSelectTicker(stock.ticker)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ebedfa]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#181b24] hover:text-[#2962ff]">
                        {stock.ticker}
                      </div>
                      <div className="text-[10px] text-[#5a5e6b] truncate max-w-[100px]">{stock.name}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-semibold text-[#181b24]">${stock.price.toFixed(2)}</div>
                      <div className="text-[11px] font-semibold text-[#089981]">+{stock.changePercent.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#f23645] pb-1 border-b border-[#e0e3eb]">
                <span>Top Pullbacks</span>
                <span>Chg %</span>
              </div>
              <div className="space-y-1.5">
                {topLosers.map((stock) => (
                  <div
                    key={stock.ticker}
                    onClick={() => onSelectTicker(stock.ticker)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ebedfa]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#181b24] hover:text-[#2962ff]">
                        {stock.ticker}
                      </div>
                      <div className="text-[10px] text-[#5a5e6b] truncate max-w-[100px]">{stock.name}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-semibold text-[#181b24]">${stock.price.toFixed(2)}</div>
                      <div className="text-[11px] font-semibold text-[#f23645]">{stock.changePercent.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Active Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2962ff] pb-1 border-b border-[#e0e3eb]">
                <span>Most Active</span>
                <span>Volume</span>
              </div>
              <div className="space-y-1.5">
                {mostActive.map((stock) => (
                  <div
                    key={stock.ticker}
                    onClick={() => onSelectTicker(stock.ticker)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ebedfa]/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#181b24] hover:text-[#2962ff]">
                        {stock.ticker}
                      </div>
                      <div className="text-[10px] text-[#5a5e6b] truncate max-w-[100px]">{stock.name}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-semibold text-[#181b24]">${stock.price.toFixed(2)}</div>
                      <div className="text-[11px] text-[#5a5e6b]">
                        {(stock.volume / 1000000).toFixed(1)}M shs
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking Financial Catalysts Preview */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-[#181b24]">Live Intelligence Wire</h3>
          </div>
          <span className="text-xs text-[#5a5e6b]">Real-Time Institutional Feeds</span>
        </div>

        <div className="divide-y divide-[#f0f3fa]">
          {news.slice(0, 3).map((item) => {
            const isBullish = item.sentiment === 'BULLISH';
            const isBearish = item.sentiment === 'BEARISH';
            return (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs text-[#5a5e6b]">
                    <span className="font-semibold text-[#181b24]">{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#2962ff]">{item.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#181b24] hover:text-[#2962ff] cursor-pointer" onClick={() => onSelectTicker(item.tickers[0])}>
                    {item.headline}
                  </h4>
                  <p className="text-xs text-[#434656] line-clamp-1">{item.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    {item.tickers.map((t) => (
                      <button
                        key={t}
                        onClick={() => onSelectTicker(t)}
                        className="px-2 py-0.5 text-xs font-mono font-bold bg-[#f1f3ff] text-[#2962ff] hover:bg-[#2962ff] hover:text-white rounded transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                      isBullish
                        ? 'text-[#089981] bg-[#089981]/10'
                        : isBearish
                        ? 'text-[#f23645] bg-[#f23645]/10'
                        : 'text-[#5a5e6b] bg-[#ebedfa]'
                    }`}
                  >
                    {isBullish ? '+BULLISH' : isBearish ? '-BEARISH' : 'NEUTRAL'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
