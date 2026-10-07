import React, { useState } from 'react';
import { PortfolioPosition, TradeOrder, PriceAlert, StockQuote } from '../types/market';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface PortfolioViewProps {
  cashBalance: number;
  positions: PortfolioPosition[];
  tradeHistory: TradeOrder[];
  alerts: PriceAlert[];
  stocks: StockQuote[];
  onOpenTrade: () => void;
  onClosePosition: (ticker: string) => void;
  onAddAlert: (ticker: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (alertId: string) => void;
  onSelectTicker: (ticker: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  cashBalance,
  positions,
  tradeHistory,
  alerts,
  stocks,
  onOpenTrade,
  onClosePosition,
  onAddAlert,
  onRemoveAlert,
  onSelectTicker,
}) => {
  // Alert modal / form state
  const [alertTicker, setAlertTicker] = useState('NVDA');
  const [alertPrice, setAlertPrice] = useState<number>(140);
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [showAddAlert, setShowAddAlert] = useState(false);

  // Compute total equity
  const totalHoldingsValue = positions.reduce((acc, pos) => acc + pos.marketValue, 0);
  const totalCost = positions.reduce((acc, pos) => acc + pos.totalCost, 0);
  const totalEquity = cashBalance + totalHoldingsValue;
  const unrealizedPnL = totalHoldingsValue - totalCost;
  const unrealizedPnLPercent = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertPrice > 0) {
      onAddAlert(alertTicker, alertPrice, alertCondition);
      setShowAddAlert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Value Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equity */}
        <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-1">
          <div className="text-xs text-[#5a5e6b] font-medium flex items-center justify-between">
            <span>Total Portfolio Equity</span>
            <Wallet className="w-4 h-4 text-[#2962ff]" />
          </div>
          <div className="font-mono text-2xl font-bold tracking-tight text-[#181b24]">
            ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#5a5e6b] font-mono">
            Initial Seed: $100,000.00
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-1">
          <div className="text-xs text-[#5a5e6b] font-medium">Unrealized P&L</div>
          <div className={`font-mono text-2xl font-bold tracking-tight flex items-center gap-1 ${
            unrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
          }`}>
            {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[11px] font-mono font-semibold ${
            unrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
          }`}>
            {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPercent.toFixed(2)}% ROI
          </div>
        </div>

        {/* Available Cash Balance */}
        <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-1">
          <div className="text-xs text-[#5a5e6b] font-medium">Available Cash Buying Power</div>
          <div className="font-mono text-2xl font-bold tracking-tight text-[#181b24]">
            ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#5a5e6b]">Instant Execution Ready</div>
        </div>

        {/* Invested Capital */}
        <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-1">
          <div className="text-xs text-[#5a5e6b] font-medium">Invested Securities Value</div>
          <div className="font-mono text-2xl font-bold tracking-tight text-[#181b24]">
            ${totalHoldingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#5a5e6b] font-mono">{positions.length} Open Positions</div>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div className="p-4 border-b border-[#e0e3eb] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#181b24]">Active Holdings & Positions</h3>
            <span className="text-xs text-[#5a5e6b]">Real-Time Mark-to-Market Valuation</span>
          </div>

          <button
            onClick={onOpenTrade}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#0049db] rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open New Position</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9fd] border-b border-[#e0e3eb] text-[#5a5e6b] font-semibold">
                <th className="py-2.5 px-4">TICKER</th>
                <th className="py-2.5 px-4 text-right">SHARES</th>
                <th className="py-2.5 px-4 text-right">AVG COST</th>
                <th className="py-2.5 px-4 text-right">CURRENT PRICE</th>
                <th className="py-2.5 px-4 text-right">MARKET VALUE</th>
                <th className="py-2.5 px-4 text-right">UNREALIZED P&L</th>
                <th className="py-2.5 px-4 text-right">RETURN %</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa]">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5a5e6b]">
                    No open positions in your paper trading portfolio. Click &quot;Open New Position&quot; to execute your first order.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const isGain = pos.unrealizedPnL >= 0;

                  return (
                    <tr
                      key={pos.ticker}
                      onClick={() => onSelectTicker(pos.ticker)}
                      className="hover:bg-[#ebedfa]/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#181b24] group-hover:text-[#2962ff]">
                        {pos.ticker}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#181b24]">
                        {pos.shares}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#5a5e6b]">
                        ${pos.avgCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#181b24]">
                        ${pos.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#181b24]">
                        ${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={isGain ? 'text-[#089981]' : 'text-[#f23645]'}>
                          {isGain ? '+' : ''}${pos.unrealizedPnL.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={isGain ? 'text-[#089981]' : 'text-[#f23645]'}>
                          {isGain ? '+' : ''}{pos.unrealizedPnLPercent.toFixed(2)}%
                        </span>
                      </td>
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onClosePosition(pos.ticker)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#f23645] bg-[#f23645]/10 hover:bg-[#f23645] hover:text-white rounded transition-colors"
                        >
                          Close Out
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom split: Price Alerts Manager & Trade History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Price Alerts */}
        <div className="lg:col-span-5 bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#181b24]">Active Price Alerts</h3>
              <span className="text-xs text-[#5a5e6b]">Monitors Real-Time Market Ticks</span>
            </div>
            <button
              onClick={() => setShowAddAlert(!showAddAlert)}
              className="px-2.5 py-1 text-xs font-semibold text-[#2962ff] bg-[#f1f3ff] hover:bg-[#2962ff] hover:text-white rounded-lg transition-colors"
            >
              + New Alert
            </button>
          </div>

          {showAddAlert && (
            <form onSubmit={handleCreateAlert} className="p-3 bg-[#faf9ff] border border-[#e0e3eb] rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#5a5e6b] mb-1">Ticker</label>
                  <select
                    value={alertTicker}
                    onChange={(e) => setAlertTicker(e.target.value)}
                    className="w-full p-1.5 bg-white border border-[#e0e3eb] rounded font-mono font-bold"
                  >
                    {stocks.map((s) => (
                      <option key={s.ticker} value={s.ticker}>
                        {s.ticker}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#5a5e6b] mb-1">Condition</label>
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as 'ABOVE' | 'BELOW')}
                    className="w-full p-1.5 bg-white border border-[#e0e3eb] rounded font-mono"
                  >
                    <option value="ABOVE">Crosses Above (&gt;)</option>
                    <option value="BELOW">Crosses Below (&lt;)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#5a5e6b] mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-1.5 bg-white border border-[#e0e3eb] rounded font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAlert(false)}
                  className="px-2.5 py-1 text-xs text-[#5a5e6b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#2962ff] text-white text-xs font-semibold rounded"
                >
                  Save Trigger
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#f0f3fa]">
            {alerts.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5a5e6b]">
                No price alerts set. Create an alert to receive trigger notifications.
              </div>
            ) : (
              alerts.map((al) => (
                <div key={al.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#181b24]">${al.ticker}</span>
                    <span className="text-[#5a5e6b]">
                      {al.condition === 'ABOVE' ? 'crosses above' : 'crosses below'}
                    </span>
                    <span className="font-mono font-bold text-[#2962ff]">${al.targetPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {al.triggered ? (
                      <span className="font-mono text-[10px] text-[#089981] bg-[#089981]/10 px-1.5 py-0.5 rounded font-bold">
                        TRIGGERED
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#5a5e6b] bg-[#ebedfa] px-1.5 py-0.5 rounded">
                        MONITORING
                      </span>
                    )}
                    <button
                      onClick={() => onRemoveAlert(al.id)}
                      className="text-[#c3c5d8] hover:text-[#f23645] transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Executed Order Ledger */}
        <div className="lg:col-span-7 bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#181b24]">Order Execution Log</h3>
              <span className="text-xs text-[#5a5e6b]">Institutional Fill Confirmations</span>
            </div>
            <span className="font-mono text-xs text-[#089981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> SIMULATOR ACTIVE
            </span>
          </div>

          <div className="divide-y divide-[#f0f3fa]">
            {tradeHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5a5e6b]">
                No orders filled yet.
              </div>
            ) : (
              tradeHistory.slice(0, 6).map((order) => {
                const isBuy = order.type === 'BUY';

                return (
                  <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          isBuy ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {order.type}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-[#181b24]">{order.ticker}</span>
                        <span className="text-[#5a5e6b] ml-1.5">
                          {order.shares} shs @ ${order.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-semibold text-[#181b24]">
                        ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-[#5a5e6b]">{order.timestamp}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
