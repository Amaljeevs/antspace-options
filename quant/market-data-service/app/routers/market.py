from __future__ import annotations

import json

from fastapi import APIRouter
from sqlalchemy import select

from finquant_quant.models import MarketInstrument, OptionChainSnapshot

from ..db import SessionLocal
from ..models import Candle, Instrument, OptionChainSnapshot as OptionChainSnapshotRecord

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/instruments")
def instruments() -> dict:
    with SessionLocal() as session:
        items = session.scalars(select(Instrument).order_by(Instrument.symbol)).all()
        return {"status": "ok", "data": [MarketInstrument.model_validate(item, from_attributes=True).model_dump() for item in items]}


@router.get("/candles/{symbol}")
def candles(symbol: str) -> dict:
    with SessionLocal() as session:
        items = session.scalars(select(Candle).where(Candle.symbol == symbol).order_by(Candle.ts)).all()
        return {
            "status": "ok",
            "data": [
                {
                    "ts": item.ts.isoformat(),
                    "open": item.open,
                    "high": item.high,
                    "low": item.low,
                    "close": item.close,
                    "volume": item.volume,
                }
                for item in items
            ],
        }


@router.get("/option-chain/{underlying}")
def option_chain(underlying: str) -> dict:
    with SessionLocal() as session:
        record = session.execute(
            select(OptionChainSnapshotRecord)
            .where(OptionChainSnapshotRecord.underlying == underlying)
            .order_by(OptionChainSnapshotRecord.captured_at.desc())
        ).scalar_one()
        payload = json.loads(record.payload)
        data = OptionChainSnapshot(
            underlying=record.underlying,
            expiry=record.captured_at,
            spot=record.spot,
            legs=payload["legs"],
        )
        return {"status": "ok", "data": data.model_dump(mode="json")}

