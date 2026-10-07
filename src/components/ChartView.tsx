import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StockQuote, TimeRange, ChartType, CandleDataPoint } from '../types/market';
import { generateCandleData, generateOrderBook, INITIAL_ANALYST_CONSENSUS } from '../data/marketData';
import { generateStockIntelligence, AnalysisResponse } from '../services/geminiService';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, Sparkles, SlidersHorizontal, 
  BarChart2, RefreshCw, Layers, ShieldCheck, ChevronDown, Check
} from 'lucide-react';

interface ChartViewProps {
  selectedStock: StockQuote;
  allStocks: StockQuote[];
  onSelectTicker: (ticker: string) => void;
  onOpenTrade: () => void;
}

export const ChartView: React.FC<ChartViewProps> = ({
  selectedStock,
  allStocks,
  onSelectTicker,
  onOpenTrade,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(false);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleDataPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Dropdown selector state
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

  // AI Analysis state
  const [aiReport, setAiReport] = useState<AnalysisResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rsiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate historical data based on stock & timeframe
  const candles = useMemo(() => {
    return generateCandleData(selectedStock.price, timeRange);
  }, [selectedStock.ticker, selectedStock.price, timeRange]);

  // Generate Level 2 Order Book
  const orderBook = useMemo(() => {
    return generateOrderBook(selectedStock.price);
  }, [selectedStock.ticker, selectedStock.price]);

  const consensus = INITIAL_ANALYST_CONSENSUS[selectedStock.ticker] || {
    targetHigh: Math.round(selectedStock.price * 1.3),
    targetMean: Math.round(selectedStock.price * 1.15),
    targetLow: Math.round(selectedStock.price * 0.85),
    buyCount: 24,
    holdCount: 8,
    sellCount: 2,
    consensusScore: 'Buy',
    analystCoverage: 34
  };

  // Fetch or synthesize AI intelligence when stock changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAi(true);
    generateStockIntelligence(selectedStock).then((res) => {
      if (isMounted) {
        setAiReport(res);
        setIsLoadingAi(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedStock.ticker]);

  // Render high-precision HTML5 Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI retina display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Padding
    const padTop = 20;
    const padBottom = 45;
    const padRight = 65;
    const chartHeight = height - padTop - padBottom;
    const chartWidth = width - padRight;

    // Determine min/max values
    let minPrice = Math.min(...candles.map((c) => c.low));
    let maxPrice = Math.max(...candles.map((c) => c.high));
    const priceMargin = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= priceMargin;
    maxPrice += priceMargin;
    const priceRange = maxPrice - minPrice;

    // Maximum volume for volume sub-bars
    const maxVol = Math.max(...candles.map((c) => c.volume)) || 1;
    const volHeight = chartHeight * 0.22;

    const getY = (val: number) => {
      return padTop + chartHeight - ((val - minPrice) / priceRange) * chartHeight;
    };

    // 1. Draw subtle background grid lines
    ctx.strokeStyle = '#f0f3fa';
    ctx.lineWidth = 1;
    const priceSteps = 5;
    for (let i = 0; i <= priceSteps; i++) {
      const priceVal = minPrice + (priceRange / priceSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price axis labels on right
      ctx.fillStyle = '#737687';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(2), chartWidth + 8, y + 4);
    }

    // 2. Draw volume bars at bottom
    const candleWidth = chartWidth / candles.length;
    candles.forEach((c, idx) => {
      const x = idx * candleWidth + candleWidth * 0.15;
      const barW = candleWidth * 0.7;
      const vH = (c.volume / maxVol) * volHeight;
      const y = padTop + chartHeight - vH;

      ctx.fillStyle = c.close >= c.open ? 'rgba(8, 153, 129, 0.18)' : 'rgba(242, 54, 69, 0.18)';
      ctx.fillRect(x, y, barW, vH);
    });

    // 3. Technical Indicators: SMA 20
    if (showSMA && candles.length >= 20) {
      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let started = false;
      for (let i = 19; i < candles.length; i++) {
        const slice = candles.slice(i - 19, i + 1);
        const avg = slice.reduce((sum, item) => sum + item.close, 0) / 20;
        const x = i * candleWidth + candleWidth / 2;
        const y = getY(avg);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // EMA 50
    if (showEMA && candles.length >= 30) {
      ctx.strokeStyle = '#9c27b0';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let prevEma = candles[0].close;
      const k = 2 / (30 + 1);
      candles.forEach((c, i) => {
        prevEma = c.close * k + prevEma * (1 - k);
        const x = i * candleWidth + candleWidth / 2;
        const y = getY(prevEma);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // 4. Main Chart rendering: Candlestick or Line
    if (chartType === 'candlestick') {
      candles.forEach((c, idx) => {
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#f23645';
        const xCenter = idx * candleWidth + candleWidth / 2;
        const barWidth = Math.max(candleWidth * 0.65, 2);

        // High-Low Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(xCenter, getY(c.high));
        ctx.lineTo(xCenter, getY(c.low));
        ctx.stroke();

        // Open-Close Candle Body
        const topY = getY(Math.max(c.open, c.close));
        const bottomY = getY(Math.min(c.open, c.close));
        const bodyHeight = Math.max(bottomY - topY, 1.5);

        ctx.fillStyle = color;
        ctx.fillRect(xCenter - barWidth / 2, topY, barWidth, bodyHeight);
      });
    } else {
      // Line / Area chart
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = idx * candleWidth + candleWidth / 2;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      if (chartType === 'area') {
        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartHeight);
        gradient.addColorStop(0, 'rgba(41, 98, 255, 0.22)');
        gradient.addColorStop(1, 'rgba(41, 98, 255, 0.00)');
        ctx.lineTo((candles.length - 1) * candleWidth + candleWidth / 2, padTop + chartHeight);
        ctx.lineTo(candleWidth / 2, padTop + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Re-stroke top line
        ctx.beginPath();
        candles.forEach((c, idx) => {
          const x = idx * candleWidth + candleWidth / 2;
          const y = getY(c.close);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
      }

      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // 5. Draw Time Axis Labels
    ctx.fillStyle = '#737687';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const timeStep = Math.max(Math.floor(candles.length / 6), 1);
    for (let i = 0; i < candles.length; i += timeStep) {
      const x = i * candleWidth + candleWidth / 2;
      ctx.fillText(candles[i].time, x, height - 12);
    }

    // 6. Draw Crosshair if hovering
    if (mousePos && mousePos.x <= chartWidth && mousePos.y >= padTop && mousePos.y <= padTop + chartHeight) {
      ctx.strokeStyle = 'rgba(115, 118, 135, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, padTop);
      ctx.lineTo(mousePos.x, padTop + chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(chartWidth, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Floating price tag on right scale
      const hoverPrice = maxPrice - ((mousePos.y - padTop) / chartHeight) * priceRange;
      ctx.fillStyle = '#181b24';
      ctx.fillRect(chartWidth + 2, mousePos.y - 10, 58, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(hoverPrice.toFixed(2), chartWidth + 6, mousePos.y + 4);
    }
  }, [candles, chartType, showSMA, showEMA, showBollinger, mousePos]);

  // Render RSI sub-chart
  useEffect(() => {
    if (!showRSI) return;
    const canvas = rsiCanvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const padRight = 65;
    const plotWidth = width - padRight;

    // RSI threshold lines: 70 and 30
    const getY = (rsi: number) => height - (rsi / 100) * height;

    ctx.strokeStyle = '#f0f3fa';
    ctx.lineWidth = 1;

    // 70 Line (Overbought)
    const y70 = getY(70);
    ctx.beginPath();
    ctx.moveTo(0, y70);
    ctx.lineTo(plotWidth, y70);
    ctx.stroke();
    ctx.fillStyle = '#f23645';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('70 OB', plotWidth + 8, y70 + 3);

    // 30 Line (Oversold)
    const y30 = getY(30);
    ctx.beginPath();
    ctx.moveTo(0, y30);
    ctx.lineTo(plotWidth, y30);
    ctx.stroke();
    ctx.fillStyle = '#089981';
    ctx.fillText('30 OS', plotWidth + 8, y30 + 3);

    // Simulate RSI line
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 1.6;
    ctx.beginPath();

    const candleWidth = plotWidth / candles.length;
    let rsiVal = selectedStock.rsi || 55;
    candles.forEach((c, idx) => {
      const delta = c.close - c.open;
      rsiVal = Math.min(Math.max(rsiVal + (delta > 0 ? 0.8 : -0.8), 22), 85);
      const x = idx * candleWidth + candleWidth / 2;
      const y = getY(rsiVal);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [candles, showRSI, selectedStock.rsi]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const chartWidth = rect.width - 65;

    if (x >= 0 && x <= chartWidth) {
      setMousePos({ x, y });
      const idx = Math.min(
        Math.floor((x / chartWidth) * candles.length),
        candles.length - 1
      );
      if (idx >= 0 && candles[idx]) {
        setHoveredCandle(candles[idx]);
      }
    } else {
      setMousePos(null);
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
  };

  const isUp = selectedStock.changePercent >= 0;
  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  return (
    <div className="space-y-6">
      {/* Ticker Header & Quick Switcher */}
      <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Quick Ticker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[#f1f3ff] hover:bg-[#ebedfa] border border-[#e0e3eb] rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 rounded bg-[#2962ff] text-white flex items-center justify-center font-bold text-xs font-mono">
                  {selectedStock.ticker.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-base text-[#181b24] flex items-center gap-1 font-mono">
                    {selectedStock.ticker}
                    <ChevronDown className="w-4 h-4 text-[#5a5e6b]" />
                  </div>
                  <div className="text-[11px] text-[#5a5e6b] truncate max-w-[140px]">
                    {selectedStock.name}
                  </div>
                </div>
              </button>

              {isSelectorOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#e0e3eb] rounded-xl shadow-lg z-50 p-1.5 max-h-80 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-[#737687] px-2 py-1">SELECT TICKER</div>
                  {allStocks.map((s) => (
                    <button
                      key={s.ticker}
                      onClick={() => {
                        onSelectTicker(s.ticker);
                        setIsSelectorOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#ebedfa] text-left transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#181b24]">{s.ticker}</span>
                        <span className="text-[#5a5e6b] truncate max-w-[110px]">{s.name}</span>
                      </div>
                      <span className={`font-mono ${s.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(1)}%
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Readout */}
            <div className="pl-4 border-l border-[#e0e3eb]">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold tracking-tight text-[#181b24]">
                  ${selectedStock.price.toFixed(2)}
                </span>
                <span
                  className={`font-mono text-sm font-semibold flex items-center gap-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                  {isUp ? '+' : ''}${selectedStock.change.toFixed(2)} ({isUp ? '+' : ''}
                  {selectedStock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#5a5e6b] pt-0.5">
                <span>{selectedStock.sector}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedStock.industry}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">Vol: {(selectedStock.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>

          {/* Quick Trade CTA & Indicators Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenTrade}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#0049db] rounded-lg shadow-xs transition-colors"
            >
              <span>Execute Order</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* OHLC Bar readout */}
        {activeCandle && (
          <div className="mt-3 pt-3 border-t border-[#f0f3fa] flex flex-wrap items-center gap-4 text-xs font-mono text-[#5a5e6b]">
            <div><span className="text-[#737687]">TIME:</span> <strong className="text-[#181b24]">{activeCandle.time}</strong></div>
            <div><span className="text-[#737687]">OPEN:</span> <strong className="text-[#181b24]">${activeCandle.open.toFixed(2)}</strong></div>
            <div><span className="text-[#737687]">HIGH:</span> <strong className="text-[#089981]">${activeCandle.high.toFixed(2)}</strong></div>
            <div><span className="text-[#737687]">LOW:</span> <strong className="text-[#f23645]">${activeCandle.low.toFixed(2)}</strong></div>
            <div><span className="text-[#737687]">CLOSE:</span> <strong className="text-[#181b24]">${activeCandle.close.toFixed(2)}</strong></div>
            <div><span className="text-[#737687]">VOL:</span> <strong className="text-[#181b24]">{(activeCandle.volume / 1000).toFixed(0)}k</strong></div>
          </div>
        )}
      </div>

      {/* Main Terminal Chart Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chart & Indicators */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs space-y-3">
            {/* Chart Toolbar: Timeframes & Type */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f0f3fa]">
              {/* Timeframes */}
              <div className="flex items-center gap-1 p-1 bg-[#f1f3ff] rounded-lg">
                {(['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-white text-[#2962ff] shadow-2xs font-bold'
                        : 'text-[#5a5e6b] hover:text-[#181b24]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Chart Modes & Overlays */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-[#f1f3ff] rounded-lg text-xs">
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`px-2 py-1 rounded font-medium ${
                      chartType === 'candlestick' ? 'bg-white text-[#181b24] shadow-2xs' : 'text-[#5a5e6b]'
                    }`}
                  >
                    Candle
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2 py-1 rounded font-medium ${
                      chartType === 'line' ? 'bg-white text-[#181b24] shadow-2xs' : 'text-[#5a5e6b]'
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2 py-1 rounded font-medium ${
                      chartType === 'area' ? 'bg-white text-[#181b24] shadow-2xs' : 'text-[#5a5e6b]'
                    }`}
                  >
                    Area
                  </button>
                </div>

                {/* Overlays toggles */}
                <button
                  onClick={() => setShowSMA(!showSMA)}
                  className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                    showSMA
                      ? 'bg-[#2962ff]/10 text-[#2962ff] border-[#2962ff]/30 font-semibold'
                      : 'border-[#e0e3eb] text-[#5a5e6b]'
                  }`}
                >
                  SMA 20
                </button>
                <button
                  onClick={() => setShowEMA(!showEMA)}
                  className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                    showEMA
                      ? 'bg-[#9c27b0]/10 text-[#9c27b0] border-[#9c27b0]/30 font-semibold'
                      : 'border-[#e0e3eb] text-[#5a5e6b]'
                  }`}
                >
                  EMA 50
                </button>
                <button
                  onClick={() => setShowRSI(!showRSI)}
                  className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                    showRSI
                      ? 'bg-[#181b24] text-white border-[#181b24] font-semibold'
                      : 'border-[#e0e3eb] text-[#5a5e6b]'
                  }`}
                >
                  RSI
                </button>
              </div>
            </div>

            {/* Canvas Interactive Chart Viewport */}
            <div className="relative w-full h-[380px] cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full block"
              />
            </div>

            {/* Sub-Pane: RSI Indicator */}
            {showRSI && (
              <div className="pt-2 border-t border-[#f0f3fa]">
                <div className="flex items-center justify-between text-xs text-[#5a5e6b] mb-1 font-mono">
                  <span>Relative Strength Index (14): <strong className="text-[#181b24]">{selectedStock.rsi.toFixed(1)}</strong></span>
                  <span className={selectedStock.rsi > 70 ? 'text-[#f23645]' : selectedStock.rsi < 30 ? 'text-[#089981]' : 'text-[#5a5e6b]'}>
                    {selectedStock.rsi > 70 ? 'Overbought Territory' : selectedStock.rsi < 30 ? 'Oversold Zone' : 'Neutral Range'}
                  </span>
                </div>
                <div className="h-[75px] w-full">
                  <canvas ref={rsiCanvasRef} className="w-full h-full block" />
                </div>
              </div>
            )}
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div className="bg-white border border-[#e0e3eb] rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#181b24]">Institutional Fundamental Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Market Cap</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">${selectedStock.marketCap.toFixed(1)}B</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">P/E (TTM)</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">{selectedStock.peRatio.toFixed(1)}x</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Forward P/E</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">{selectedStock.forwardPe.toFixed(1)}x</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Diluted EPS</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">${selectedStock.eps.toFixed(2)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">52W Range</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">${selectedStock.low52w.toFixed(1)} - ${selectedStock.high52w.toFixed(1)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Beta (5Y)</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">{selectedStock.beta.toFixed(2)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Short Float</div>
                <div className="font-mono text-sm font-bold text-[#181b24]">{selectedStock.shortFloat.toFixed(2)}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf9ff] border border-[#e0e3eb]">
                <div className="text-[11px] text-[#5a5e6b]">Next Earnings</div>
                <div className="font-mono text-sm font-bold text-[#2962ff]">{selectedStock.nextEarnings}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Book & Analyst Targets & AI Intelligence */}
        <div className="lg:col-span-4 space-y-4">
          {/* Level 2 Order Book Depth */}
          <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#2962ff]" />
                <h3 className="text-sm font-bold text-[#181b24]">Level 2 Depth Ladder</h3>
              </div>
              <span className="text-[11px] font-mono text-[#5a5e6b]">
                Spread: ${orderBook.spread.toFixed(2)} ({orderBook.spreadPercent}%)
              </span>
            </div>

            {/* Asks (Sells) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-[#737687] pb-1 border-b border-[#f0f3fa]">
                <span>ASK PRICE</span>
                <span>SIZE</span>
                <span>TOTAL</span>
              </div>
              <div className="space-y-0.5">
                {orderBook.asks.slice(0, 5).reverse().map((ask, i) => (
                  <div key={i} className="relative flex justify-between text-xs font-mono py-0.5 px-1 rounded overflow-hidden">
                    <div 
                      className="absolute inset-y-0 right-0 bg-[#f23645]/10" 
                      style={{ width: `${Math.min((ask.total / 8000) * 100, 100)}%` }} 
                    />
                    <span className="relative text-[#f23645] font-semibold">${ask.price.toFixed(2)}</span>
                    <span className="relative text-[#181b24]">{ask.size}</span>
                    <span className="relative text-[#5a5e6b]">{ask.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid Market Tick */}
            <div className="py-1 px-2 bg-[#f1f3ff] rounded flex items-center justify-between font-mono text-xs">
              <span className="text-[#5a5e6b]">MID MARKET</span>
              <span className="font-bold text-[#181b24]">${selectedStock.price.toFixed(2)}</span>
            </div>

            {/* Bids (Buys) */}
            <div className="space-y-0.5">
              {orderBook.bids.slice(0, 5).map((bid, i) => (
                <div key={i} className="relative flex justify-between text-xs font-mono py-0.5 px-1 rounded overflow-hidden">
                  <div 
                    className="absolute inset-y-0 right-0 bg-[#089981]/10" 
                    style={{ width: `${Math.min((bid.total / 8000) * 100, 100)}%` }} 
                  />
                  <span className="relative text-[#089981] font-semibold">${bid.price.toFixed(2)}</span>
                  <span className="relative text-[#181b24]">{bid.size}</span>
                  <span className="relative text-[#5a5e6b]">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wall Street Analyst Price Targets */}
          <div className="bg-white border border-[#e0e3eb] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#181b24]">Wall Street Consensus</h3>
              <span className="text-xs font-mono font-bold text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                {consensus.consensusScore}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#5a5e6b]">Mean Price Target:</span>
                <span className="font-mono font-bold text-[#181b24]">${consensus.targetMean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5a5e6b]">Implied Upside:</span>
                <span className="font-mono font-bold text-[#089981]">
                  +{Math.round(((consensus.targetMean - selectedStock.price) / selectedStock.price) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5a5e6b]">Range Corridor:</span>
                <span className="font-mono text-[#5a5e6b]">${consensus.targetLow.toFixed(0)} - ${consensus.targetHigh.toFixed(0)}</span>
              </div>

              {/* Buy / Hold / Sell distribution */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-[#5a5e6b] mb-1 font-mono">
                  <span className="text-[#089981] font-semibold">{consensus.buyCount} Buy</span>
                  <span className="text-[#5a5e6b]">{consensus.holdCount} Hold</span>
                  <span className="text-[#f23645]">{consensus.sellCount} Sell</span>
                </div>
                <div className="h-2 w-full bg-[#ebedfa] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(consensus.buyCount / consensus.analystCoverage) * 100}%` }}
                    className="bg-[#089981]"
                  />
                  <div
                    style={{ width: `${(consensus.holdCount / consensus.analystCoverage) * 100}%` }}
                    className="bg-[#5a5e6b]"
                  />
                  <div
                    style={{ width: `${(consensus.sellCount / consensus.analystCoverage) * 100}%` }}
                    className="bg-[#f23645]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Financial Catalyst Synthesizer */}
          <div className="bg-[#ffffff] border border-[#2962ff]/30 rounded-xl p-4 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#2962ff]">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <h3 className="text-sm font-bold text-[#181b24]">AI Catalyst Intelligence</h3>
              </div>
              <button
                onClick={() => {
                  setIsLoadingAi(true);
                  generateStockIntelligence(selectedStock).then((res) => {
                    setAiReport(res);
                    setIsLoadingAi(false);
                  });
                }}
                disabled={isLoadingAi}
                className="p-1 hover:bg-[#ebedfa] text-[#5a5e6b] rounded transition-colors"
                title="Refresh AI briefing"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin text-[#2962ff]' : ''}`} />
              </button>
            </div>

            {isLoadingAi ? (
              <div className="space-y-2 py-4 animate-pulse">
                <div className="h-3 bg-[#ebedfa] rounded w-3/4" />
                <div className="h-3 bg-[#ebedfa] rounded w-full" />
                <div className="h-3 bg-[#ebedfa] rounded w-5/6" />
              </div>
            ) : aiReport ? (
              <div className="space-y-3 text-xs">
                <p className="text-[#434656] leading-relaxed">
                  {aiReport.summary}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="font-semibold text-[#181b24]">Key Institutional Catalysts:</div>
                  <ul className="space-y-1">
                    {aiReport.catalysts.map((cat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[#5a5e6b]">
                        <span className="text-[#2962ff] font-bold font-mono">·</span>
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#f0f3fa] space-y-1.5">
                  <div className="p-2 bg-[#faf9ff] rounded border border-[#e0e3eb]">
                    <span className="font-semibold text-[#181b24]">Verdict: </span>
                    <span className="text-[#2962ff] font-medium">{aiReport.institutionalVerdict}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
