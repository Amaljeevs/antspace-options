from fastapi import FastAPI

from .routers.strategy import router as strategy_router

app = FastAPI(title="FinQuant Strategy Engine", version="0.1.0")


@app.get("/internal/health")
def health() -> dict:
    return {"status": "ok", "service": "strategy-engine"}


app.include_router(strategy_router)

