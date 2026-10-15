from fastapi import FastAPI

from .routers.analytics import router as analytics_router

app = FastAPI(title="FinQuant Analytics Engine", version="0.1.0")


@app.get("/internal/health")
def health() -> dict:
    return {"status": "ok", "service": "analytics-engine"}


app.include_router(analytics_router)

