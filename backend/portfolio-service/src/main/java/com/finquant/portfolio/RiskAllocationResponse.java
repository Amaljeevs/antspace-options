package com.finquant.portfolio;

import java.math.BigDecimal;
import java.util.UUID;

public record RiskAllocationResponse(
    UUID accountId,
    BigDecimal availableCapital,
    BigDecimal estimatedMargin,
    BigDecimal maximumLoss,
    BigDecimal freeMarginAfterTrade,
    BigDecimal marginUtilizationPct,
    BigDecimal riskPctOfCapital,
    String recommendation
) {
}

