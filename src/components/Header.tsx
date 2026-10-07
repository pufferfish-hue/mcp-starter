import React from 'react';
import { Search, Bell, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { ActiveTab } from '../types/market';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenTrade: () => void;
  alertsCount: number;
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenTrade,
  alertsCount,
  isLiveStreaming,
  setIsLiveStreaming,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'chart', label: 'Terminal Chart' },
    { id: 'screener', label: 'Screener' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf9ff]/90 backdrop-blur-md border-b border-[#e0e3eb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text element */}
        <div className="flex items-center gap-6 shrink-0">
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white shadow-sm shadow-[#2962ff]/20">
              <Activity className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#181b24] group-hover:text-[#2962ff] transition-colors">
              Market Intelligence System
            </span>
          </div>

          {/* Quiet market session indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#5a5e6b] pl-2 border-l border-[#e0e3eb]">
            <Clock className="w-3.5 h-3.5 text-[#5a5e6b]" />
            <span className="font-mono text-[11px] text-[#089981] font-semibold">NYSE OPEN</span>
            <span className="text-[#c3c5d8]">·</span>
            <span className="font-mono text-[11px]">16:00 EST CLOSE</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ffffff] text-[#2962ff] shadow-xs font-semibold'
                    : 'text-[#5a5e6b] hover:text-[#181b24] hover:bg-[#ebedfa]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#5a5e6b] bg-[#ffffff] border border-[#e0e3eb] rounded-lg hover:border-[#c3c5d8] hover:text-[#181b24] transition-colors shadow-2xs"
            title="Search tickers (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#5a5e6b]" />
            <span className="hidden sm:inline">Search symbol</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#f1f3ff] text-[#434656] rounded border border-[#e0e3eb]">
              ⌘K
            </kbd>
          </button>

          {/* Live Tick Stream Toggle */}
          <button
            onClick={() => setIsLiveStreaming((prev) => !prev)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isLiveStreaming
                ? 'bg-[#ffffff] border-[#089981]/30 text-[#089981]'
                : 'bg-[#ffffff] border-[#e0e3eb] text-[#737687]'
            }`}
            title="Toggle live price simulation"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-[#089981] animate-pulse' : 'bg-[#c3c5d8]'}`} />
            <span className="font-mono text-[11px]">{isLiveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setActiveTab('portfolio')}
            className="relative p-1.5 text-[#5a5e6b] hover:text-[#181b24] rounded-lg hover:bg-[#ebedfa]/50 transition-colors"
            title="Price Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#2962ff] rounded-full ring-2 ring-[#faf9ff]" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenTrade}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#0049db] rounded-lg shadow-xs transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <span>Trade Order</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-[#e0e3eb] bg-[#ffffff] gap-1 no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#ebedfa] text-[#2962ff] font-semibold'
                : 'text-[#5a5e6b]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
