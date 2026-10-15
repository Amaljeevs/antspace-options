from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Instrument(Base):
    __tablename__ = "instrument"
    __table_args__ = {"schema": "market"}

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exchange: Mapped[str] = mapped_column(String(16))
    symbol: Mapped[str] = mapped_column(String(64), unique=True)
    instrument_type: Mapped[str] = mapped_column(String(24))
    tick_size: Mapped[float] = mapped_column(Float)
    lot_size: Mapped[int] = mapped_column(Integer)


class Candle(Base):
    __tablename__ = "candle"
    __table_args__ = {"schema": "market"}

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(64))
    timeframe: Mapped[str] = mapped_column(String(16))
    open: Mapped[float] = mapped_column(Float)
    high: Mapped[float] = mapped_column(Float)
    low: Mapped[float] = mapped_column(Float)
    close: Mapped[float] = mapped_column(Float)
    volume: Mapped[int] = mapped_column(Integer)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class OptionChainSnapshot(Base):
    __tablename__ = "option_chain_snapshot"
    __table_args__ = {"schema": "market"}

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    underlying: Mapped[str] = mapped_column(String(64))
    expiry_code: Mapped[str] = mapped_column(String(32))
    spot: Mapped[float] = mapped_column(Float)
    payload: Mapped[str] = mapped_column(Text)
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

