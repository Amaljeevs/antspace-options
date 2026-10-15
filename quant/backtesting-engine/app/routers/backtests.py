from datetime import UTC, datetime

from fastapi import APIRouter

from finquant_quant.models import BacktestRequest, BacktestResult

router = APIRouter(prefix="/api/backtests", tags=["backtests"])


@router.post("/run")
def run_backtest(request: BacktestRequest) -> dict:
    total_days = max((request.to_date - request.from_date).days, 1)
    trades = total_days * 2
    win_rate = 0.61 if "iron" in request.strategy_key else 0.56
    ending_equity = request.capital * 1.18
    result = BacktestResult(
        strategy_key=request.strategy_key,
        symbol=request.symbol,
        trades=trades,
        win_rate=win_rate,
        sharpe=1.74,
        profit_factor=1.82,
        max_drawdown=0.09,
        ending_equity=ending_equity,
        equity_curve=[request.capital * (1 + index * 0.015) for index in range(10)],
    )
    return {"status": "ok", "generated_at": datetime.now(UTC).isoformat(), "data": result.model_dump(mode="json")}

