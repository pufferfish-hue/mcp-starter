import React, { useState } from 'react';
import { NewsItem, StockQuote } from '../types/market';
import { Search, Filter, Sparkles, TrendingUp, TrendingDown, BookOpen, Clock, ArrowRight } from 'lucide-react';
import analystAvatar from '../assets/images/analyst_sarah_chen_1791340015848.jpg';

interface IntelligenceViewProps {
  news: NewsItem[];
  stocks: StockQuote[];
  onSelectTicker: (ticker: string) => void;
  onOpenTradeForTicker: (ticker: string) => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  news,
  stocks,
  onSelectTicker,
  onOpenTradeForTicker,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSentiment, setActiveSentiment] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = ['ALL', 'Macro', 'Earnings', 'SEC Filing', 'Rating Upgrade', 'Tech & AI'];

  const filteredNews = news.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (activeSentiment !== 'ALL' && item.sentiment !== activeSentiment) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        item.headline.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tickers.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Intelligence Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Analyst Desk Spotlight Card */}
        <div className="lg:col-span-8 bg-white border border-[#e0e3eb] rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f3fa]">
            <div className="flex items-center gap-3">
              <img
                src={analystAvatar}
                alt="Sarah Chen, CFA"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-[#e0e3eb]"
              />
              <div>
                <div className="text-sm font-bold text-[#181b24]">Sarah Chen, CFA</div>
                <div className="text-xs text-[#5a5e6b]">Head of Quantitative & Cross-Asset Strategy</div>
              </div>
            </div>
            <span className="text-xs font-mono text-[#2962ff] bg-[#2962ff]/10 px-2.5 py-1 rounded font-semibold">
              DAILY INTELLIGENCE NOTE
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#181b24] tracking-tight">
            Institutional Regime Shift: Semis Lead Margin Expansion While Defensive Sectors Lag
          </h2>

          <p className="text-sm text-[#434656] leading-relaxed">
            Leading mega-cap hyperscalers have officially reported record cloud workload deployments, driving persistent enterprise order backlogs for accelerated computing. With real yields stabilizing around 2.1% and corporate balance sheets locking in longer debt maturities, liquidity indicators favor targeted growth over broad equity factor rotations.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <span className="font-semibold text-[#181b24]">Focus Exposure:</span>
            {['NVDA', 'AVGO', 'MSFT', 'META'].map((ticker) => (
              <button
                key={ticker}
                onClick={() => onSelectTicker(ticker)}
                className="font-mono font-bold text-[#2962ff] bg-[#f1f3ff] hover:bg-[#2962ff] hover:text-white px-2 py-0.5 rounded transition-colors"
              >
                ${ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Catalyst Digest Summary */}
        <div className="lg:col-span-4 bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-[#181b24]">Catalyst Distribution</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#f0f3fa]">
                <span className="text-[#5a5e6b]">Bullish Flow Events:</span>
                <span className="font-mono font-bold text-[#089981]">68%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f3fa]">
                <span className="text-[#5a5e6b]">Bearish Revisions:</span>
                <span className="font-mono font-bold text-[#f23645]">19%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f3fa]">
                <span className="text-[#5a5e6b]">Macro / Neutral Releases:</span>
                <span className="font-mono font-bold text-[#5a5e6b]">13%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#faf9ff] rounded-lg border border-[#e0e3eb] text-xs text-[#5a5e6b]">
            <strong className="text-[#181b24]">Upcoming Macro Watch:</strong> FOMC Rate Decision and Core CPI print scheduled for Thursday 08:30 EST.
          </div>
        </div>
      </div>

      {/* Wire Filter Bar */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5a5e6b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search news, filings, tickers..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf9ff] border border-[#e0e3eb] rounded-lg focus:outline-none focus:border-[#2962ff] focus:bg-white transition-all text-[#181b24]"
            />
          </div>

          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#2962ff] text-white shadow-2xs font-semibold'
                    : 'bg-[#faf9ff] text-[#5a5e6b] border border-[#e0e3eb] hover:text-[#181b24]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed Stream */}
      <div className="space-y-3">
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#e0e3eb] rounded-xl text-xs text-[#5a5e6b]">
            No wire reports match the selected filters.
          </div>
        ) : (
          filteredNews.map((item) => {
            const isBullish = item.sentiment === 'BULLISH';
            const isBearish = item.sentiment === 'BEARISH';

            return (
              <div
                key={item.id}
                className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs hover:border-[#2962ff]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-4xl">
                  <div className="flex items-center gap-2 text-xs text-[#5a5e6b]">
                    <span className="font-bold text-[#181b24]">{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#2962ff]">{item.category}</span>
                  </div>

                  <h3
                    onClick={() => onSelectTicker(item.tickers[0])}
                    className="text-base font-bold text-[#181b24] hover:text-[#2962ff] cursor-pointer transition-colors"
                  >
                    {item.headline}
                  </h3>

                  <p className="text-xs text-[#434656] leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                  <span
                    className={`font-mono text-xs font-semibold px-2.5 py-1 rounded ${
                      isBullish
                        ? 'text-[#089981] bg-[#089981]/10'
                        : isBearish
                        ? 'text-[#f23645] bg-[#f23645]/10'
                        : 'text-[#5a5e6b] bg-[#ebedfa]'
                    }`}
                  >
                    {isBullish ? 'BULLISH +' + item.sentimentScore : isBearish ? 'BEARISH ' + item.sentimentScore : 'NEUTRAL'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {item.tickers.map((t) => (
                      <button
                        key={t}
                        onClick={() => onSelectTicker(t)}
                        className="px-2.5 py-1 text-xs font-mono font-bold bg-[#f1f3ff] text-[#2962ff] hover:bg-[#2962ff] hover:text-white rounded-md transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
