from datetime import UTC, datetime, timedelta
import json

from sqlalchemy import text

from .db import SessionLocal
from .models import Candle, Instrument, OptionChainSnapshot


def seed_market_data() -> None:
    with SessionLocal() as session:
        session.execute(text("create schema if not exists market"))
        if session.query(Instrument).count() == 0:
            session.add_all(
                [
                    Instrument(exchange="NSE", symbol="NIFTY", instrument_type="INDEX", tick_size=0.05, lot_size=50),
                    Instrument(exchange="NSE", symbol="BANKNIFTY", instrument_type="INDEX", tick_size=0.05, lot_size=15),
                    Instrument(exchange="NSE", symbol="NIFTY28AUG24600CE", instrument_type="OPTION", tick_size=0.05, lot_size=50),
                ]
            )
        if session.query(Candle).count() == 0:
            base = datetime.now(UTC).replace(minute=0, second=0, microsecond=0)
            for step in range(12):
                session.add(
                    Candle(
                        symbol="NIFTY",
                        timeframe="15m",
                        open=24450 + step * 8,
                        high=24470 + step * 8,
                        low=24420 + step * 8,
                        close=24460 + step * 8,
                        volume=125000 + step * 1000,
                        ts=base - timedelta(minutes=(11 - step) * 15),
                    )
                )
        if session.query(OptionChainSnapshot).count() == 0:
            payload = {
                "legs": [
                    {"symbol": "NIFTY28AUG24600CE", "strike": 24600, "option_type": "CE", "last_price": 142.2, "implied_volatility": 13.1},
                    {"symbol": "NIFTY28AUG24400PE", "strike": 24400, "option_type": "PE", "last_price": 133.8, "implied_volatility": 13.7},
                ]
            }
            session.add(
                OptionChainSnapshot(
                    underlying="NIFTY",
                    expiry_code="2026-08-27",
                    spot=24526.4,
                    payload=json.dumps(payload),
                    captured_at=datetime.now(UTC),
                )
            )
        session.commit()

