from sqlalchemy import text

from fastapi import FastAPI

from .db import Base, engine
from .routers.market import router as market_router
from .seed import seed_market_data

app = FastAPI(title="FinQuant Market Data Service", version="0.1.0")


@app.on_event("startup")
def startup() -> None:
    with engine.begin() as connection:
        connection.execute(text("create schema if not exists market"))
    Base.metadata.create_all(bind=engine)
    seed_market_data()


@app.get("/internal/health")
def health() -> dict:
    return {"status": "ok", "service": "market-data-service"}


app.include_router(market_router)
