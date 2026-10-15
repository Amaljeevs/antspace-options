from fastapi import FastAPI

from .routers.backtests import router as backtests_router

app = FastAPI(title="FinQuant Backtesting Engine", version="0.1.0")


@app.get("/internal/health")
def health() -> dict:
    return {"status": "ok", "service": "backtesting-engine"}


app.include_router(backtests_router)

