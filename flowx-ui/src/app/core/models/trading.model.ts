export interface BrokerSummary {
  brokerId: string;
  capabilities: Record<string, boolean>;
}

export interface MarketInstrument {
  exchange: string;
  symbol: string;
  instrument_type: string;
  tick_size: number;
  lot_size: number;
}

export interface CandlePoint {
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OptionLeg {
  symbol: string;
  strike: number;
  option_type: 'CE' | 'PE';
  last_price: number;
  implied_volatility: number;
}

export interface OptionChain {
  underlying: string;
  expiry: string;
  spot: number;
  legs: OptionLeg[];
}

export interface PortfolioSummary {
  openPositions: number;
  markToMarket: number;
}

export interface PositionSnapshot {
  id: string;
  symbol: string;
  netQuantity: number;
  mtm: number;
  recordedAt: string;
}

export interface VirtualAccount {
  id: string;
  ownerName: string;
  initialCapital: number;
  availableCash: number;
  usedMargin: number;
  realizedPnl: number;
  unrealizedPnl: number;
  equity: number;
  freeMargin: number;
  createdAt: string;
}

export interface RiskAllocation {
  accountId: string;
  availableCapital: number;
  estimatedMargin: number;
  maximumLoss: number;
  freeMarginAfterTrade: number;
  marginUtilizationPct: number;
  riskPctOfCapital: number;
  recommendation: string;
}

export interface MarginEstimate {
  accountId: string;
  symbol: string;
  notionalValue: number;
  estimatedMargin: number;
  maximumLoss: number;
  capitalRequiredPct: number;
  recommendation: string;
}

export interface PaperOrder {
  id: string;
  accountId: string;
  strategyKey: string;
  symbol: string;
  side: string;
  quantity: number;
  status: string;
  mode: string;
  entryPrice: number;
  lotSize: number;
  estimatedMargin: number;
  maximumLoss: number;
  riskPctOfCapital: number;
  createdAt: string;
}
