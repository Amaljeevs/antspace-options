from fastapi import APIRouter

from finquant_quant.models import StrategyDefinition

router = APIRouter(prefix="/api/strategy", tags=["strategy"])

STRATEGIES = [
    StrategyDefinition(
        key="weekly-iron-condor",
        label="Weekly Iron Condor",
        category="income",
        description="Delta-balanced weekly index options income setup.",
        risk_profile="defined-risk",
    ),
    StrategyDefinition(
        key="credit-spread",
        label="Credit Spread",
        category="income",
        description="Directional vertical spread with pre-defined max loss.",
        risk_profile="defined-risk",
    ),
    StrategyDefinition(
        key="short-strangle",
        label="Short Strangle",
        category="premium-selling",
        description="Short OTM call and put with adjustments by vega and delta.",
        risk_profile="undefined-risk",
    ),
    StrategyDefinition(
        key="calendar-spread",
        label="Calendar Spread",
        category="volatility",
        description="Short near-month, long far-month options at shared strike.",
        risk_profile="defined-risk",
    ),
    StrategyDefinition(
        key="broken-wing-butterfly",
        label="Broken Wing Butterfly",
        category="income",
        description="Asymmetric fly built to widen profit window around expiry.",
        risk_profile="defined-risk",
    ),
]


@router.get("/catalog")
def catalog() -> dict:
    return {"status": "ok", "data": [item.model_dump() for item in STRATEGIES]}

