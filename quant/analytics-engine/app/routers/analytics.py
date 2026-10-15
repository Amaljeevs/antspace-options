from datetime import UTC, datetime

from fastapi import APIRouter

from finquant_quant.models import AnalyticsSummary

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
def summary() -> dict:
    data = AnalyticsSummary(
        total_pnl=248560.0,
        sharpe=1.92,
        win_rate=0.62,
        max_drawdown=0.08,
        used_margin=182000.0,
        free_cash=568000.0,
        capital_utilization=24.3,
        updated_at=datetime.now(UTC),
    )
    return {"status": "ok", "data": data.model_dump(mode="json")}
