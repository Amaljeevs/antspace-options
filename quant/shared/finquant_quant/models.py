from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class MarketInstrument(BaseModel):
    exchange: str
    symbol: str
    instrument_type: str
    tick_size: float
    lot_size: int


class OptionLeg(BaseModel):
    symbol: str
    strike: float
    option_type: Literal["CE", "PE"]
    last_price: float
    implied_volatility: float


class OptionChainSnapshot(BaseModel):
    underlying: str
    expiry: datetime
    spot: float
    legs: list[OptionLeg]


class StrategyDefinition(BaseModel):
    key: str
    label: str
    category: str
    description: str
    risk_profile: str


class BacktestRequest(BaseModel):
    strategy_key: str = Field(..., min_length=3)
    symbol: str
    timeframe: str
    capital: float = Field(..., gt=0)
    from_date: datetime
    to_date: datetime


class BacktestResult(BaseModel):
    strategy_key: str
    symbol: str
    trades: int
    win_rate: float
    sharpe: float
    profit_factor: float
    max_drawdown: float
    ending_equity: float
    equity_curve: list[float]


class AnalyticsSummary(BaseModel):
    total_pnl: float
    sharpe: float
    win_rate: float
    max_drawdown: float
    used_margin: float
    free_cash: float
    capital_utilization: float
    updated_at: datetime
