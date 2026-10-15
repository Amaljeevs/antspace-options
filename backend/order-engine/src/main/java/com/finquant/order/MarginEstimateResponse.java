package com.finquant.order;

import java.math.BigDecimal;
import java.util.UUID;

public record MarginEstimateResponse(
    UUID accountId,
    String symbol,
    BigDecimal notionalValue,
    BigDecimal estimatedMargin,
    BigDecimal maximumLoss,
    BigDecimal capitalRequiredPct,
    String recommendation
) {
}

